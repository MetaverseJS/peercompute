function Dn(n,e){return n==null||e==null?NaN:n<e?-1:n>e?1:n>=e?0:NaN}function st(n,e){return n==null||e==null?NaN:e<n?-1:
e>n?1:e>=n?0:NaN}function Jn(n){let e,t,r;n.length!==2?(e=Dn,t=(o,s)=>Dn(n(o),s),r=(o,s)=>n(o)-s):(e=n===Dn||n===st?n:lt,
t=n,r=n);function i(o,s,f=0,h=o.length){if(f<h){if(e(s,s)!==0)return h;do{const l=f+h>>>1;t(o[l],s)<0?f=l+1:h=l}while(f<
h)}return f}function u(o,s,f=0,h=o.length){if(f<h){if(e(s,s)!==0)return h;do{const l=f+h>>>1;t(o[l],s)<=0?f=l+1:h=l}while(f<
h)}return f}function a(o,s,f=0,h=o.length){const l=i(o,s,f,h-1);return l>f&&r(o[l-1],s)>-r(o[l],s)?l-1:l}return{left:i,center:a,
right:u}}function lt(){return 0}function gt(n){return n===null?NaN:+n}const ht=Jn(Dn),mt=ht.right;Jn(gt).center;class ce extends Map{constructor(e,t=yt){
if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:t}}),e!=null)for(const[r,i]of e)this.set(r,
i)}get(e){return super.get(se(this,e))}has(e){return super.has(se(this,e))}set(e,t){return super.set(dt(this,e),t)}delete(e){
return super.delete(xt(this,e))}}function se({_intern:n,_key:e},t){const r=e(t);return n.has(r)?n.get(r):t}function dt({
_intern:n,_key:e},t){const r=e(t);return n.has(r)?n.get(r):(n.set(r,t),t)}function xt({_intern:n,_key:e},t){const r=e(t);
return n.has(r)&&(t=n.get(r),n.delete(r)),t}function yt(n){return n!==null&&typeof n=="object"?n.valueOf():n}const Mt=Math.
sqrt(50),pt=Math.sqrt(10),bt=Math.sqrt(2);function kn(n,e,t){const r=(e-n)/Math.max(0,t),i=Math.floor(Math.log10(r)),u=r/
Math.pow(10,i),a=u>=Mt?10:u>=pt?5:u>=bt?2:1;let o,s,f;return i<0?(f=Math.pow(10,-i)/a,o=Math.round(n*f),s=Math.round(e*f),
o/f<n&&++o,s/f>e&&--s,f=-f):(f=Math.pow(10,i)*a,o=Math.round(n/f),s=Math.round(e/f),o*f<n&&++o,s*f>e&&--s),s<o&&.5<=t&&t<
2?kn(n,e,t*2):[o,s,f]}function wt(n,e,t){if(e=+e,n=+n,t=+t,!(t>0))return[];if(n===e)return[n];const r=e<n,[i,u,a]=r?kn(e,
n,t):kn(n,e,t);if(!(u>=i))return[];const o=u-i+1,s=new Array(o);if(r)if(a<0)for(let f=0;f<o;++f)s[f]=(u-f)/-a;else for(let f=0;f<
o;++f)s[f]=(u-f)*a;else if(a<0)for(let f=0;f<o;++f)s[f]=(i+f)/-a;else for(let f=0;f<o;++f)s[f]=(i+f)*a;return s}function Vn(n,e,t){
return e=+e,n=+n,t=+t,kn(n,e,t)[2]}function Qn(n,e,t){e=+e,n=+n,t=+t;const r=e<n,i=r?Vn(e,n,t):Vn(n,e,t);return(r?-1:1)*
(i<0?1/-i:i)}function Wi(n,e){let t;if(e===void 0)for(const r of n)r!=null&&(t<r||t===void 0&&r>=r)&&(t=r);else{let r=-1;
for(let i of n)(i=e(i,++r,n))!=null&&(t<i||t===void 0&&i>=i)&&(t=i)}return t}function Li(n,e){let t;if(e===void 0)for(const r of n)
r!=null&&(t>r||t===void 0&&r>=r)&&(t=r);else{let r=-1;for(let i of n)(i=e(i,++r,n))!=null&&(t>i||t===void 0&&i>=i)&&(t=i)}
return t}function Tt(n,e,t){n=+n,e=+e,t=(i=arguments.length)<2?(e=n,n=0,1):i<3?1:+t;for(var r=-1,i=Math.max(0,Math.ceil(
(e-n)/t))|0,u=new Array(i);++r<i;)u[r]=n+r*t;return u}function Kn(n,e,t){n.prototype=e.prototype=t,t.constructor=n}function Re(n,e){
var t=Object.create(n.prototype);for(var r in e)t[r]=e[r];return t}function Mn(){}var dn=.7,Nn=1/dn,fn="\\s*([+-]?\\d+)\\s*",
xn="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",O="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",vt=/^#([0-9a-f]{3,8})$/,
Ct=new RegExp(`^rgb\\(${fn},${fn},${fn}\\)$`),Ut=new RegExp(`^rgb\\(${O},${O},${O}\\)$`),Dt=new RegExp(`^rgba\\(${fn},${fn}\
,${fn},${xn}\\)$`),kt=new RegExp(`^rgba\\(${O},${O},${O},${xn}\\)$`),Nt=new RegExp(`^hsl\\(${xn},${O},${O}\\)$`),St=new RegExp(
`^hsla\\(${xn},${O},${O},${xn}\\)$`),le={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,
beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,
cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,
cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,
darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,
darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,
deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,
fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,
grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,
lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,
lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,
lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,
lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,
mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,
midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,
olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,
paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,
powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,
salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,
slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,
tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};
Kn(Mn,yn,{copy(n){return Object.assign(new this.constructor,this,n)},displayable(){return this.rgb().displayable()},hex:ge,
formatHex:ge,formatHex8:$t,formatHsl:Ft,formatRgb:he,toString:he});function ge(){return this.rgb().formatHex()}function $t(){
return this.rgb().formatHex8()}function Ft(){return Oe(this).formatHsl()}function he(){return this.rgb().formatRgb()}function yn(n){
var e,t;return n=(n+"").trim().toLowerCase(),(e=vt.exec(n))?(t=e[1].length,e=parseInt(e[1],16),t===6?me(e):t===3?new F(e>>
8&15|e>>4&240,e>>4&15|e&240,(e&15)<<4|e&15,1):t===8?vn(e>>24&255,e>>16&255,e>>8&255,(e&255)/255):t===4?vn(e>>12&15|e>>8&
240,e>>8&15|e>>4&240,e>>4&15|e&240,((e&15)<<4|e&15)/255):null):(e=Ct.exec(n))?new F(e[1],e[2],e[3],1):(e=Ut.exec(n))?new F(
e[1]*255/100,e[2]*255/100,e[3]*255/100,1):(e=Dt.exec(n))?vn(e[1],e[2],e[3],e[4]):(e=kt.exec(n))?vn(e[1]*255/100,e[2]*255/
100,e[3]*255/100,e[4]):(e=Nt.exec(n))?ye(e[1],e[2]/100,e[3]/100,1):(e=St.exec(n))?ye(e[1],e[2]/100,e[3]/100,e[4]):le.hasOwnProperty(
n)?me(le[n]):n==="transparent"?new F(NaN,NaN,NaN,0):null}function me(n){return new F(n>>16&255,n>>8&255,n&255,1)}function vn(n,e,t,r){
return r<=0&&(n=e=t=NaN),new F(n,e,t,r)}function Ht(n){return n instanceof Mn||(n=yn(n)),n?(n=n.rgb(),new F(n.r,n.g,n.b,
n.opacity)):new F}function Xn(n,e,t,r){return arguments.length===1?Ht(n):new F(n,e,t,r??1)}function F(n,e,t,r){this.r=+n,
this.g=+e,this.b=+t,this.opacity=+r}Kn(F,Xn,Re(Mn,{brighter(n){return n=n==null?Nn:Math.pow(Nn,n),new F(this.r*n,this.g*
n,this.b*n,this.opacity)},darker(n){return n=n==null?dn:Math.pow(dn,n),new F(this.r*n,this.g*n,this.b*n,this.opacity)},rgb(){
return this},clamp(){return new F(X(this.r),X(this.g),X(this.b),Sn(this.opacity))},displayable(){return-.5<=this.r&&this.
r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:de,formatHex:de,formatHex8:Yt,
formatRgb:xe,toString:xe}));function de(){return`#${Q(this.r)}${Q(this.g)}${Q(this.b)}`}function Yt(){return`#${Q(this.r)}${Q(
this.g)}${Q(this.b)}${Q((isNaN(this.opacity)?1:this.opacity)*255)}`}function xe(){const n=Sn(this.opacity);return`${n===
1?"rgb(":"rgba("}${X(this.r)}, ${X(this.g)}, ${X(this.b)}${n===1?")":`, ${n})`}`}function Sn(n){return isNaN(n)?1:Math.max(
0,Math.min(1,n))}function X(n){return Math.max(0,Math.min(255,Math.round(n)||0))}function Q(n){return n=X(n),(n<16?"0":"")+
n.toString(16)}function ye(n,e,t,r){return r<=0?n=e=t=NaN:t<=0||t>=1?n=e=NaN:e<=0&&(n=NaN),new I(n,e,t,r)}function Oe(n){
if(n instanceof I)return new I(n.h,n.s,n.l,n.opacity);if(n instanceof Mn||(n=yn(n)),!n)return new I;if(n instanceof I)return n;
n=n.rgb();var e=n.r/255,t=n.g/255,r=n.b/255,i=Math.min(e,t,r),u=Math.max(e,t,r),a=NaN,o=u-i,s=(u+i)/2;return o?(e===u?a=
(t-r)/o+(t<r)*6:t===u?a=(r-e)/o+2:a=(e-t)/o+4,o/=s<.5?u+i:2-u-i,a*=60):o=s>0&&s<1?0:a,new I(a,o,s,n.opacity)}function At(n,e,t,r){
return arguments.length===1?Oe(n):new I(n,e,t,r??1)}function I(n,e,t,r){this.h=+n,this.s=+e,this.l=+t,this.opacity=+r}Kn(
I,At,Re(Mn,{brighter(n){return n=n==null?Nn:Math.pow(Nn,n),new I(this.h,this.s,this.l*n,this.opacity)},darker(n){return n=
n==null?dn:Math.pow(dn,n),new I(this.h,this.s,this.l*n,this.opacity)},rgb(){var n=this.h%360+(this.h<0)*360,e=isNaN(n)||
isNaN(this.s)?0:this.s,t=this.l,r=t+(t<.5?t:1-t)*e,i=2*t-r;return new F(Pn(n>=240?n-240:n+120,i,r),Pn(n,i,r),Pn(n<120?n+
240:n-120,i,r),this.opacity)},clamp(){return new I(Me(this.h),Cn(this.s),Cn(this.l),Sn(this.opacity))},displayable(){return(0<=
this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const n=Sn(this.opacity);
return`${n===1?"hsl(":"hsla("}${Me(this.h)}, ${Cn(this.s)*100}%, ${Cn(this.l)*100}%${n===1?")":`, ${n})`}`}}));function Me(n){
return n=(n||0)%360,n<0?n+360:n}function Cn(n){return Math.max(0,Math.min(1,n||0))}function Pn(n,e,t){return(n<60?e+(t-e)*
n/60:n<180?t:n<240?e+(t-e)*(240-n)/60:e)*255}const ne=n=>()=>n;function Wt(n,e){return function(t){return n+t*e}}function Lt(n,e,t){
return n=Math.pow(n,t),e=Math.pow(e,t)-n,t=1/t,function(r){return Math.pow(n+r*e,t)}}function It(n){return(n=+n)==1?Pe:function(e,t){
return t-e?Lt(e,t,n):ne(isNaN(e)?t:e)}}function Pe(n,e){var t=e-n;return t?Wt(n,t):ne(isNaN(n)?e:n)}const pe=(function n(e){
var t=It(e);function r(i,u){var a=t((i=Xn(i)).r,(u=Xn(u)).r),o=t(i.g,u.g),s=t(i.b,u.b),f=Pe(i.opacity,u.opacity);return function(h){
return i.r=a(h),i.g=o(h),i.b=s(h),i.opacity=f(h),i+""}}return r.gamma=n,r})(1);function Rt(n,e){e||(e=[]);var t=n?Math.min(
e.length,n.length):0,r=e.slice(),i;return function(u){for(i=0;i<t;++i)r[i]=n[i]*(1-u)+e[i]*u;return r}}function Ot(n){return ArrayBuffer.
isView(n)&&!(n instanceof DataView)}function Pt(n,e){var t=e?e.length:0,r=n?Math.min(t,n.length):0,i=new Array(r),u=new Array(
t),a;for(a=0;a<r;++a)i[a]=ee(n[a],e[a]);for(;a<t;++a)u[a]=e[a];return function(o){for(a=0;a<r;++a)u[a]=i[a](o);return u}}
function qt(n,e){var t=new Date;return n=+n,e=+e,function(r){return t.setTime(n*(1-r)+e*r),t}}function $n(n,e){return n=
+n,e=+e,function(t){return n*(1-t)+e*t}}function jt(n,e){var t={},r={},i;(n===null||typeof n!="object")&&(n={}),(e===null||
typeof e!="object")&&(e={});for(i in e)i in n?t[i]=ee(n[i],e[i]):r[i]=e[i];return function(u){for(i in t)r[i]=t[i](u);return r}}
var Bn=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,qn=new RegExp(Bn.source,"g");function zt(n){return function(){return n}}
function Zt(n){return function(e){return n(e)+""}}function Et(n,e){var t=Bn.lastIndex=qn.lastIndex=0,r,i,u,a=-1,o=[],s=[];
for(n=n+"",e=e+"";(r=Bn.exec(n))&&(i=qn.exec(e));)(u=i.index)>t&&(u=e.slice(t,u),o[a]?o[a]+=u:o[++a]=u),(r=r[0])===(i=i[0])?
o[a]?o[a]+=i:o[++a]=i:(o[++a]=null,s.push({i:a,x:$n(r,i)})),t=qn.lastIndex;return t<e.length&&(u=e.slice(t),o[a]?o[a]+=u:
o[++a]=u),o.length<2?s[0]?Zt(s[0].x):zt(e):(e=s.length,function(f){for(var h=0,l;h<e;++h)o[(l=s[h]).i]=l.x(f);return o.join(
"")})}function ee(n,e){var t=typeof e,r;return e==null||t==="boolean"?ne(e):(t==="number"?$n:t==="string"?(r=yn(e))?(e=r,
pe):Et:e instanceof yn?pe:e instanceof Date?qt:Ot(e)?Rt:Array.isArray(e)?Pt:typeof e.valueOf!="function"&&typeof e.toString!=
"function"||isNaN(e)?jt:$n)(n,e)}function _t(n,e){return n=+n,e=+e,function(t){return Math.round(n*(1-t)+e*t)}}function Vt(n){
return Math.abs(n=Math.round(n))>=1e21?n.toLocaleString("en").replace(/,/g,""):n.toString(10)}function Fn(n,e){if(!isFinite(
n)||n===0)return null;var t=(n=e?n.toExponential(e-1):n.toExponential()).indexOf("e"),r=n.slice(0,t);return[r.length>1?r[0]+
r.slice(2):r,+n.slice(t+1)]}function cn(n){return n=Fn(Math.abs(n)),n?n[1]:NaN}function Qt(n,e){return function(t,r){for(var i=t.
length,u=[],a=0,o=n[0],s=0;i>0&&o>0&&(s+o+1>r&&(o=Math.max(1,r-s)),u.push(t.substring(i-=o,i+o)),!((s+=o+1)>r));)o=n[a=(a+
1)%n.length];return u.reverse().join(e)}}function Xt(n){return function(e){return e.replace(/[0-9]/g,function(t){return n[+t]})}}
var Bt=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function Hn(n){if(!(e=Bt.exec(n)))throw new Error(
"invalid format: "+n);var e;return new te({fill:e[1],align:e[2],sign:e[3],symbol:e[4],zero:e[5],width:e[6],comma:e[7],precision:e[8]&&
e[8].slice(1),trim:e[9],type:e[10]})}Hn.prototype=te.prototype;function te(n){this.fill=n.fill===void 0?" ":n.fill+"",this.
align=n.align===void 0?">":n.align+"",this.sign=n.sign===void 0?"-":n.sign+"",this.symbol=n.symbol===void 0?"":n.symbol+
"",this.zero=!!n.zero,this.width=n.width===void 0?void 0:+n.width,this.comma=!!n.comma,this.precision=n.precision===void 0?
void 0:+n.precision,this.trim=!!n.trim,this.type=n.type===void 0?"":n.type+""}te.prototype.toString=function(){return this.
fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(this.width===void 0?"":Math.max(1,this.width|0))+(this.comma?"\
,":"")+(this.precision===void 0?"":"."+Math.max(0,this.precision|0))+(this.trim?"~":"")+this.type};function Gt(n){n:for(var e=n.
length,t=1,r=-1,i;t<e;++t)switch(n[t]){case".":r=i=t;break;case"0":r===0&&(r=t),i=t;break;default:if(!+n[t])break n;r>0&&
(r=0);break}return r>0?n.slice(0,r)+n.slice(i+1):n}var Yn;function Jt(n,e){var t=Fn(n,e);if(!t)return Yn=void 0,n.toPrecision(
e);var r=t[0],i=t[1],u=i-(Yn=Math.max(-8,Math.min(8,Math.floor(i/3)))*3)+1,a=r.length;return u===a?r:u>a?r+new Array(u-a+
1).join("0"):u>0?r.slice(0,u)+"."+r.slice(u):"0."+new Array(1-u).join("0")+Fn(n,Math.max(0,e+u-1))[0]}function be(n,e){var t=Fn(
n,e);if(!t)return n+"";var r=t[0],i=t[1];return i<0?"0."+new Array(-i).join("0")+r:r.length>i+1?r.slice(0,i+1)+"."+r.slice(
i+1):r+new Array(i-r.length+2).join("0")}var we={"%":(n,e)=>(n*100).toFixed(e),b:n=>Math.round(n).toString(2),c:n=>n+"",
d:Vt,e:(n,e)=>n.toExponential(e),f:(n,e)=>n.toFixed(e),g:(n,e)=>n.toPrecision(e),o:n=>Math.round(n).toString(8),p:(n,e)=>be(
n*100,e),r:be,s:Jt,X:n=>Math.round(n).toString(16).toUpperCase(),x:n=>Math.round(n).toString(16)};function Te(n){return n}
var ve=Array.prototype.map,Ce=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function Kt(n){var e=n.
grouping===void 0||n.thousands===void 0?Te:Qt(ve.call(n.grouping,Number),n.thousands+""),t=n.currency===void 0?"":n.currency[0]+
"",r=n.currency===void 0?"":n.currency[1]+"",i=n.decimal===void 0?".":n.decimal+"",u=n.numerals===void 0?Te:Xt(ve.call(n.
numerals,String)),a=n.percent===void 0?"%":n.percent+"",o=n.minus===void 0?"−":n.minus+"",s=n.nan===void 0?"NaN":n.nan+
"";function f(l,g){l=Hn(l);var b=l.fill,T=l.align,C=l.sign,N=l.symbol,R=l.zero,_=l.width,H=l.comma,D=l.precision,K=l.trim,
d=l.type;d==="n"?(H=!0,d="g"):we[d]||(D===void 0&&(D=12),K=!0,d="g"),(R||b==="0"&&T==="=")&&(R=!0,b="0",T="=");var k=(g&&
g.prefix!==void 0?g.prefix:"")+(N==="$"?t:N==="#"&&/[boxX]/.test(d)?"0"+d.toLowerCase():""),nn=(N==="$"?r:/[%p]/.test(d)?
a:"")+(g&&g.suffix!==void 0?g.suffix:""),bn=we[d],On=/[defgprs%]/.test(d);D=D===void 0?6:/[gprs]/.test(d)?Math.max(1,Math.
min(21,D)):Math.max(0,Math.min(20,D));function wn(y){var P=k,S=nn,E,Tn,en;if(d==="c")S=bn(y)+S,y="";else{y=+y;var tn=y<0||
1/y<0;if(y=isNaN(y)?s:bn(Math.abs(y),D),K&&(y=Gt(y)),tn&&+y==0&&C!=="+"&&(tn=!1),P=(tn?C==="("?C:o:C==="-"||C==="("?"":C)+
P,S=(d==="s"&&!isNaN(y)&&Yn!==void 0?Ce[8+Yn/3]:"")+S+(tn&&C==="("?")":""),On){for(E=-1,Tn=y.length;++E<Tn;)if(en=y.charCodeAt(
E),48>en||en>57){S=(en===46?i+y.slice(E+1):y.slice(E))+S,y=y.slice(0,E);break}}}H&&!R&&(y=e(y,1/0));var rn=P.length+y.length+
S.length,L=rn<_?new Array(_-rn+1).join(b):"";switch(H&&R&&(y=e(L+y,L.length?_-S.length:1/0),L=""),T){case"<":y=P+y+S+L;break;case"\
=":y=P+L+y+S;break;case"^":y=L.slice(0,rn=L.length>>1)+P+y+S+L.slice(rn);break;default:y=L+P+y+S;break}return u(y)}return wn.
toString=function(){return l+""},wn}function h(l,g){var b=Math.max(-8,Math.min(8,Math.floor(cn(g)/3)))*3,T=Math.pow(10,-b),
C=f((l=Hn(l),l.type="f",l),{suffix:Ce[8+b/3]});return function(N){return C(T*N)}}return{format:f,formatPrefix:h}}var Un,
qe,je;nr({thousands:",",grouping:[3],currency:["$",""]});function nr(n){return Un=Kt(n),qe=Un.format,je=Un.formatPrefix,
Un}function er(n){return Math.max(0,-cn(Math.abs(n)))}function tr(n,e){return Math.max(0,Math.max(-8,Math.min(8,Math.floor(
cn(e)/3)))*3-cn(Math.abs(n)))}function rr(n,e){return n=Math.abs(n),e=Math.abs(e)-n,Math.max(0,cn(e)-cn(n))+1}const jn=new Date,
zn=new Date;function v(n,e,t,r){function i(u){return n(u=arguments.length===0?new Date:new Date(+u)),u}return i.floor=u=>(n(
u=new Date(+u)),u),i.ceil=u=>(n(u=new Date(u-1)),e(u,1),n(u),u),i.round=u=>{const a=i(u),o=i.ceil(u);return u-a<o-u?a:o},
i.offset=(u,a)=>(e(u=new Date(+u),a==null?1:Math.floor(a)),u),i.range=(u,a,o)=>{const s=[];if(u=i.ceil(u),o=o==null?1:Math.
floor(o),!(u<a)||!(o>0))return s;let f;do s.push(f=new Date(+u)),e(u,o),n(u);while(f<u&&u<a);return s},i.filter=u=>v(a=>{
if(a>=a)for(;n(a),!u(a);)a.setTime(a-1)},(a,o)=>{if(a>=a)if(o<0)for(;++o<=0;)for(;e(a,-1),!u(a););else for(;--o>=0;)for(;e(
a,1),!u(a););}),t&&(i.count=(u,a)=>(jn.setTime(+u),zn.setTime(+a),n(jn),n(zn),Math.floor(t(jn,zn))),i.every=u=>(u=Math.floor(
u),!isFinite(u)||!(u>0)?null:u>1?i.filter(r?a=>r(a)%u===0:a=>i.count(0,a)%u===0):i)),i}const An=v(()=>{},(n,e)=>{n.setTime(
+n+e)},(n,e)=>e-n);An.every=n=>(n=Math.floor(n),!isFinite(n)||!(n>0)?null:n>1?v(e=>{e.setTime(Math.floor(e/n)*n)},(e,t)=>{
e.setTime(+e+t*n)},(e,t)=>(t-e)/n):An);An.range;const q=1e3,W=q*60,j=W*60,z=j*24,re=z*7,Ue=z*30,Zn=z*365,an=v(n=>{n.setTime(
n-n.getMilliseconds())},(n,e)=>{n.setTime(+n+e*q)},(n,e)=>(e-n)/q,n=>n.getUTCSeconds());an.range;const ie=v(n=>{n.setTime(
n-n.getMilliseconds()-n.getSeconds()*q)},(n,e)=>{n.setTime(+n+e*W)},(n,e)=>(e-n)/W,n=>n.getMinutes());ie.range;const ir=v(
n=>{n.setUTCSeconds(0,0)},(n,e)=>{n.setTime(+n+e*W)},(n,e)=>(e-n)/W,n=>n.getUTCMinutes());ir.range;const ue=v(n=>{n.setTime(
n-n.getMilliseconds()-n.getSeconds()*q-n.getMinutes()*W)},(n,e)=>{n.setTime(+n+e*j)},(n,e)=>(e-n)/j,n=>n.getHours());ue.
range;const ur=v(n=>{n.setUTCMinutes(0,0,0)},(n,e)=>{n.setTime(+n+e*j)},(n,e)=>(e-n)/j,n=>n.getUTCHours());ur.range;const pn=v(
n=>n.setHours(0,0,0,0),(n,e)=>n.setDate(n.getDate()+e),(n,e)=>(e-n-(e.getTimezoneOffset()-n.getTimezoneOffset())*W)/z,n=>n.
getDate()-1);pn.range;const ae=v(n=>{n.setUTCHours(0,0,0,0)},(n,e)=>{n.setUTCDate(n.getUTCDate()+e)},(n,e)=>(e-n)/z,n=>n.
getUTCDate()-1);ae.range;const ar=v(n=>{n.setUTCHours(0,0,0,0)},(n,e)=>{n.setUTCDate(n.getUTCDate()+e)},(n,e)=>(e-n)/z,n=>Math.
floor(n/z));ar.range;function G(n){return v(e=>{e.setDate(e.getDate()-(e.getDay()+7-n)%7),e.setHours(0,0,0,0)},(e,t)=>{e.
setDate(e.getDate()+t*7)},(e,t)=>(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*W)/re)}const In=G(0),Wn=G(1),or=G(2),
fr=G(3),sn=G(4),cr=G(5),sr=G(6);In.range;Wn.range;or.range;fr.range;sn.range;cr.range;sr.range;function J(n){return v(e=>{
e.setUTCDate(e.getUTCDate()-(e.getUTCDay()+7-n)%7),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t*7)},(e,t)=>(t-
e)/re)}const ze=J(0),Ln=J(1),lr=J(2),gr=J(3),ln=J(4),hr=J(5),mr=J(6);ze.range;Ln.range;lr.range;gr.range;ln.range;hr.range;
mr.range;const oe=v(n=>{n.setDate(1),n.setHours(0,0,0,0)},(n,e)=>{n.setMonth(n.getMonth()+e)},(n,e)=>e.getMonth()-n.getMonth()+
(e.getFullYear()-n.getFullYear())*12,n=>n.getMonth());oe.range;const dr=v(n=>{n.setUTCDate(1),n.setUTCHours(0,0,0,0)},(n,e)=>{
n.setUTCMonth(n.getUTCMonth()+e)},(n,e)=>e.getUTCMonth()-n.getUTCMonth()+(e.getUTCFullYear()-n.getUTCFullYear())*12,n=>n.
getUTCMonth());dr.range;const Z=v(n=>{n.setMonth(0,1),n.setHours(0,0,0,0)},(n,e)=>{n.setFullYear(n.getFullYear()+e)},(n,e)=>e.
getFullYear()-n.getFullYear(),n=>n.getFullYear());Z.every=n=>!isFinite(n=Math.floor(n))||!(n>0)?null:v(e=>{e.setFullYear(
Math.floor(e.getFullYear()/n)*n),e.setMonth(0,1),e.setHours(0,0,0,0)},(e,t)=>{e.setFullYear(e.getFullYear()+t*n)});Z.range;
const B=v(n=>{n.setUTCMonth(0,1),n.setUTCHours(0,0,0,0)},(n,e)=>{n.setUTCFullYear(n.getUTCFullYear()+e)},(n,e)=>e.getUTCFullYear()-
n.getUTCFullYear(),n=>n.getUTCFullYear());B.every=n=>!isFinite(n=Math.floor(n))||!(n>0)?null:v(e=>{e.setUTCFullYear(Math.
floor(e.getUTCFullYear()/n)*n),e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCFullYear(e.getUTCFullYear()+t*
n)});B.range;function xr(n,e,t,r,i,u){const a=[[an,1,q],[an,5,5*q],[an,15,15*q],[an,30,30*q],[u,1,W],[u,5,5*W],[u,15,15*
W],[u,30,30*W],[i,1,j],[i,3,3*j],[i,6,6*j],[i,12,12*j],[r,1,z],[r,2,2*z],[t,1,re],[e,1,Ue],[e,3,3*Ue],[n,1,Zn]];function o(f,h,l){
const g=h<f;g&&([f,h]=[h,f]);const b=l&&typeof l.range=="function"?l:s(f,h,l),T=b?b.range(f,+h+1):[];return g?T.reverse():
T}function s(f,h,l){const g=Math.abs(h-f)/l,b=Jn(([,,N])=>N).right(a,g);if(b===a.length)return n.every(Qn(f/Zn,h/Zn,l));
if(b===0)return An.every(Math.max(Qn(f,h,l),1));const[T,C]=a[g/a[b-1][2]<a[b][2]/g?b-1:b];return T.every(C)}return[o,s]}
const[yr,Mr]=xr(Z,oe,In,pn,ue,ie);function En(n){if(0<=n.y&&n.y<100){var e=new Date(-1,n.m,n.d,n.H,n.M,n.S,n.L);return e.
setFullYear(n.y),e}return new Date(n.y,n.m,n.d,n.H,n.M,n.S,n.L)}function _n(n){if(0<=n.y&&n.y<100){var e=new Date(Date.UTC(
-1,n.m,n.d,n.H,n.M,n.S,n.L));return e.setUTCFullYear(n.y),e}return new Date(Date.UTC(n.y,n.m,n.d,n.H,n.M,n.S,n.L))}function gn(n,e,t){
return{y:n,m:e,d:t,H:0,M:0,S:0,L:0}}function pr(n){var e=n.dateTime,t=n.date,r=n.time,i=n.periods,u=n.days,a=n.shortDays,
o=n.months,s=n.shortMonths,f=hn(i),h=mn(i),l=hn(u),g=mn(u),b=hn(a),T=mn(a),C=hn(o),N=mn(o),R=hn(s),_=mn(s),H={a:en,A:tn,
b:rn,B:L,c:null,d:Fe,e:Fe,f:jr,g:Jr,G:ni,H:Or,I:Pr,j:qr,L:Ze,m:zr,M:Zr,p:tt,q:rt,Q:Ae,s:We,S:Er,u:_r,U:Vr,V:Qr,w:Xr,W:Br,
x:null,X:null,y:Gr,Y:Kr,Z:ei,"%":Ye},D={a:it,A:ut,b:at,B:ot,c:null,d:He,e:He,f:ui,g:di,G:yi,H:ti,I:ri,j:ii,L:_e,m:ai,M:oi,
p:ft,q:ct,Q:Ae,s:We,S:fi,u:ci,U:si,V:li,w:gi,W:hi,x:null,X:null,y:mi,Y:xi,Z:Mi,"%":Ye},K={a:On,A:wn,b:y,B:P,c:S,d:Se,e:Se,
f:Wr,g:Ne,G:ke,H:$e,I:$e,j:Fr,L:Ar,m:$r,M:Hr,p:bn,q:Sr,Q:Ir,s:Rr,S:Yr,u:Cr,U:Ur,V:Dr,w:vr,W:kr,x:E,X:Tn,y:Ne,Y:ke,Z:Nr,"\
%":Lr};H.x=d(t,H),H.X=d(r,H),H.c=d(e,H),D.x=d(t,D),D.X=d(r,D),D.c=d(e,D);function d(m,x){return function(M){var c=[],$=-1,
w=0,Y=m.length,A,V,fe;for(M instanceof Date||(M=new Date(+M));++$<Y;)m.charCodeAt($)===37&&(c.push(m.slice(w,$)),(V=De[A=
m.charAt(++$)])!=null?A=m.charAt(++$):V=A==="e"?" ":"0",(fe=x[A])&&(A=fe(M,V)),c.push(A),w=$+1);return c.push(m.slice(w,
$)),c.join("")}}function k(m,x){return function(M){var c=gn(1900,void 0,1),$=nn(c,m,M+="",0),w,Y;if($!=M.length)return null;
if("Q"in c)return new Date(c.Q);if("s"in c)return new Date(c.s*1e3+("L"in c?c.L:0));if(x&&!("Z"in c)&&(c.Z=0),"p"in c&&(c.
H=c.H%12+c.p*12),c.m===void 0&&(c.m="q"in c?c.q:0),"V"in c){if(c.V<1||c.V>53)return null;"w"in c||(c.w=1),"Z"in c?(w=_n(
gn(c.y,0,1)),Y=w.getUTCDay(),w=Y>4||Y===0?Ln.ceil(w):Ln(w),w=ae.offset(w,(c.V-1)*7),c.y=w.getUTCFullYear(),c.m=w.getUTCMonth(),
c.d=w.getUTCDate()+(c.w+6)%7):(w=En(gn(c.y,0,1)),Y=w.getDay(),w=Y>4||Y===0?Wn.ceil(w):Wn(w),w=pn.offset(w,(c.V-1)*7),c.y=
w.getFullYear(),c.m=w.getMonth(),c.d=w.getDate()+(c.w+6)%7)}else("W"in c||"U"in c)&&("w"in c||(c.w="u"in c?c.u%7:"W"in c?
1:0),Y="Z"in c?_n(gn(c.y,0,1)).getUTCDay():En(gn(c.y,0,1)).getDay(),c.m=0,c.d="W"in c?(c.w+6)%7+c.W*7-(Y+5)%7:c.w+c.U*7-
(Y+6)%7);return"Z"in c?(c.H+=c.Z/100|0,c.M+=c.Z%100,_n(c)):En(c)}}function nn(m,x,M,c){for(var $=0,w=x.length,Y=M.length,
A,V;$<w;){if(c>=Y)return-1;if(A=x.charCodeAt($++),A===37){if(A=x.charAt($++),V=K[A in De?x.charAt($++):A],!V||(c=V(m,M,c))<
0)return-1}else if(A!=M.charCodeAt(c++))return-1}return c}function bn(m,x,M){var c=f.exec(x.slice(M));return c?(m.p=h.get(
c[0].toLowerCase()),M+c[0].length):-1}function On(m,x,M){var c=b.exec(x.slice(M));return c?(m.w=T.get(c[0].toLowerCase()),
M+c[0].length):-1}function wn(m,x,M){var c=l.exec(x.slice(M));return c?(m.w=g.get(c[0].toLowerCase()),M+c[0].length):-1}
function y(m,x,M){var c=R.exec(x.slice(M));return c?(m.m=_.get(c[0].toLowerCase()),M+c[0].length):-1}function P(m,x,M){var c=C.
exec(x.slice(M));return c?(m.m=N.get(c[0].toLowerCase()),M+c[0].length):-1}function S(m,x,M){return nn(m,e,x,M)}function E(m,x,M){
return nn(m,t,x,M)}function Tn(m,x,M){return nn(m,r,x,M)}function en(m){return a[m.getDay()]}function tn(m){return u[m.getDay()]}
function rn(m){return s[m.getMonth()]}function L(m){return o[m.getMonth()]}function tt(m){return i[+(m.getHours()>=12)]}
function rt(m){return 1+~~(m.getMonth()/3)}function it(m){return a[m.getUTCDay()]}function ut(m){return u[m.getUTCDay()]}
function at(m){return s[m.getUTCMonth()]}function ot(m){return o[m.getUTCMonth()]}function ft(m){return i[+(m.getUTCHours()>=
12)]}function ct(m){return 1+~~(m.getUTCMonth()/3)}return{format:function(m){var x=d(m+="",H);return x.toString=function(){
return m},x},parse:function(m){var x=k(m+="",!1);return x.toString=function(){return m},x},utcFormat:function(m){var x=d(
m+="",D);return x.toString=function(){return m},x},utcParse:function(m){var x=k(m+="",!0);return x.toString=function(){return m},
x}}}var De={"-":"",_:" ",0:"0"},U=/^\s*\d+/,br=/^%/,wr=/[\\^$*+?|[\]().{}]/g;function p(n,e,t){var r=n<0?"-":"",i=(r?-n:
n)+"",u=i.length;return r+(u<t?new Array(t-u+1).join(e)+i:i)}function Tr(n){return n.replace(wr,"\\$&")}function hn(n){return new RegExp(
"^(?:"+n.map(Tr).join("|")+")","i")}function mn(n){return new Map(n.map((e,t)=>[e.toLowerCase(),t]))}function vr(n,e,t){
var r=U.exec(e.slice(t,t+1));return r?(n.w=+r[0],t+r[0].length):-1}function Cr(n,e,t){var r=U.exec(e.slice(t,t+1));return r?
(n.u=+r[0],t+r[0].length):-1}function Ur(n,e,t){var r=U.exec(e.slice(t,t+2));return r?(n.U=+r[0],t+r[0].length):-1}function Dr(n,e,t){
var r=U.exec(e.slice(t,t+2));return r?(n.V=+r[0],t+r[0].length):-1}function kr(n,e,t){var r=U.exec(e.slice(t,t+2));return r?
(n.W=+r[0],t+r[0].length):-1}function ke(n,e,t){var r=U.exec(e.slice(t,t+4));return r?(n.y=+r[0],t+r[0].length):-1}function Ne(n,e,t){
var r=U.exec(e.slice(t,t+2));return r?(n.y=+r[0]+(+r[0]>68?1900:2e3),t+r[0].length):-1}function Nr(n,e,t){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.
exec(e.slice(t,t+6));return r?(n.Z=r[1]?0:-(r[2]+(r[3]||"00")),t+r[0].length):-1}function Sr(n,e,t){var r=U.exec(e.slice(
t,t+1));return r?(n.q=r[0]*3-3,t+r[0].length):-1}function $r(n,e,t){var r=U.exec(e.slice(t,t+2));return r?(n.m=r[0]-1,t+
r[0].length):-1}function Se(n,e,t){var r=U.exec(e.slice(t,t+2));return r?(n.d=+r[0],t+r[0].length):-1}function Fr(n,e,t){
var r=U.exec(e.slice(t,t+3));return r?(n.m=0,n.d=+r[0],t+r[0].length):-1}function $e(n,e,t){var r=U.exec(e.slice(t,t+2));
return r?(n.H=+r[0],t+r[0].length):-1}function Hr(n,e,t){var r=U.exec(e.slice(t,t+2));return r?(n.M=+r[0],t+r[0].length):
-1}function Yr(n,e,t){var r=U.exec(e.slice(t,t+2));return r?(n.S=+r[0],t+r[0].length):-1}function Ar(n,e,t){var r=U.exec(
e.slice(t,t+3));return r?(n.L=+r[0],t+r[0].length):-1}function Wr(n,e,t){var r=U.exec(e.slice(t,t+6));return r?(n.L=Math.
floor(r[0]/1e3),t+r[0].length):-1}function Lr(n,e,t){var r=br.exec(e.slice(t,t+1));return r?t+r[0].length:-1}function Ir(n,e,t){
var r=U.exec(e.slice(t));return r?(n.Q=+r[0],t+r[0].length):-1}function Rr(n,e,t){var r=U.exec(e.slice(t));return r?(n.s=
+r[0],t+r[0].length):-1}function Fe(n,e){return p(n.getDate(),e,2)}function Or(n,e){return p(n.getHours(),e,2)}function Pr(n,e){
return p(n.getHours()%12||12,e,2)}function qr(n,e){return p(1+pn.count(Z(n),n),e,3)}function Ze(n,e){return p(n.getMilliseconds(),
e,3)}function jr(n,e){return Ze(n,e)+"000"}function zr(n,e){return p(n.getMonth()+1,e,2)}function Zr(n,e){return p(n.getMinutes(),
e,2)}function Er(n,e){return p(n.getSeconds(),e,2)}function _r(n){var e=n.getDay();return e===0?7:e}function Vr(n,e){return p(
In.count(Z(n)-1,n),e,2)}function Ee(n){var e=n.getDay();return e>=4||e===0?sn(n):sn.ceil(n)}function Qr(n,e){return n=Ee(
n),p(sn.count(Z(n),n)+(Z(n).getDay()===4),e,2)}function Xr(n){return n.getDay()}function Br(n,e){return p(Wn.count(Z(n)-
1,n),e,2)}function Gr(n,e){return p(n.getFullYear()%100,e,2)}function Jr(n,e){return n=Ee(n),p(n.getFullYear()%100,e,2)}
function Kr(n,e){return p(n.getFullYear()%1e4,e,4)}function ni(n,e){var t=n.getDay();return n=t>=4||t===0?sn(n):sn.ceil(
n),p(n.getFullYear()%1e4,e,4)}function ei(n){var e=n.getTimezoneOffset();return(e>0?"-":(e*=-1,"+"))+p(e/60|0,"0",2)+p(e%
60,"0",2)}function He(n,e){return p(n.getUTCDate(),e,2)}function ti(n,e){return p(n.getUTCHours(),e,2)}function ri(n,e){
return p(n.getUTCHours()%12||12,e,2)}function ii(n,e){return p(1+ae.count(B(n),n),e,3)}function _e(n,e){return p(n.getUTCMilliseconds(),
e,3)}function ui(n,e){return _e(n,e)+"000"}function ai(n,e){return p(n.getUTCMonth()+1,e,2)}function oi(n,e){return p(n.
getUTCMinutes(),e,2)}function fi(n,e){return p(n.getUTCSeconds(),e,2)}function ci(n){var e=n.getUTCDay();return e===0?7:
e}function si(n,e){return p(ze.count(B(n)-1,n),e,2)}function Ve(n){var e=n.getUTCDay();return e>=4||e===0?ln(n):ln.ceil(
n)}function li(n,e){return n=Ve(n),p(ln.count(B(n),n)+(B(n).getUTCDay()===4),e,2)}function gi(n){return n.getUTCDay()}function hi(n,e){
return p(Ln.count(B(n)-1,n),e,2)}function mi(n,e){return p(n.getUTCFullYear()%100,e,2)}function di(n,e){return n=Ve(n),p(
n.getUTCFullYear()%100,e,2)}function xi(n,e){return p(n.getUTCFullYear()%1e4,e,4)}function yi(n,e){var t=n.getUTCDay();return n=
t>=4||t===0?ln(n):ln.ceil(n),p(n.getUTCFullYear()%1e4,e,4)}function Mi(){return"+0000"}function Ye(){return"%"}function Ae(n){
return+n}function We(n){return Math.floor(+n/1e3)}var un,Qe,Xe,Be;pi({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%\
S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun",
"Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","Septembe\
r","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});
function pi(n){return un=pr(n),Qe=un.format,un.parse,Xe=un.utcFormat,Be=un.utcParse,un}var Ge="%Y-%m-%dT%H:%M:%S.%LZ";function bi(n){
return n.toISOString()}Date.prototype.toISOString||Xe(Ge);function wi(n){var e=new Date(n);return isNaN(e)?null:e}+new Date(
"2000-01-01T00:00:00.000Z")||Be(Ge);function Rn(n,e){switch(arguments.length){case 0:break;case 1:this.range(n);break;default:
this.range(e).domain(n);break}return this}const Le=Symbol("implicit");function Je(){var n=new ce,e=[],t=[],r=Le;function i(u){
let a=n.get(u);if(a===void 0){if(r!==Le)return r;n.set(u,a=e.push(u)-1)}return t[a%t.length]}return i.domain=function(u){
if(!arguments.length)return e.slice();e=[],n=new ce;for(const a of u)n.has(a)||n.set(a,e.push(a)-1);return i},i.range=function(u){
return arguments.length?(t=Array.from(u),i):t.slice()},i.unknown=function(u){return arguments.length?(r=u,i):r},i.copy=function(){
return Je(e,t).unknown(r)},Rn.apply(i,arguments),i}function Ti(){var n=Je().unknown(void 0),e=n.domain,t=n.range,r=0,i=1,
u,a,o=!1,s=0,f=0,h=.5;delete n.unknown;function l(){var g=e().length,b=i<r,T=b?i:r,C=b?r:i;u=(C-T)/Math.max(1,g-s+f*2),o&&
(u=Math.floor(u)),T+=(C-T-u*(g-s))*h,a=u*(1-s),o&&(T=Math.round(T),a=Math.round(a));var N=Tt(g).map(function(R){return T+
u*R});return t(b?N.reverse():N)}return n.domain=function(g){return arguments.length?(e(g),l()):e()},n.range=function(g){
return arguments.length?([r,i]=g,r=+r,i=+i,l()):[r,i]},n.rangeRound=function(g){return[r,i]=g,r=+r,i=+i,o=!0,l()},n.bandwidth=
function(){return a},n.step=function(){return u},n.round=function(g){return arguments.length?(o=!!g,l()):o},n.padding=function(g){
return arguments.length?(s=Math.min(1,f=+g),l()):s},n.paddingInner=function(g){return arguments.length?(s=Math.min(1,g),
l()):s},n.paddingOuter=function(g){return arguments.length?(f=+g,l()):f},n.align=function(g){return arguments.length?(h=
Math.max(0,Math.min(1,g)),l()):h},n.copy=function(){return Ti(e(),[r,i]).round(o).paddingInner(s).paddingOuter(f).align(
h)},Rn.apply(l(),arguments)}function vi(n){return function(){return n}}function Ci(n){return+n}var Ie=[0,1];function on(n){
return n}function Gn(n,e){return(e-=n=+n)?function(t){return(t-n)/e}:vi(isNaN(e)?NaN:.5)}function Ui(n,e){var t;return n>
e&&(t=n,n=e,e=t),function(r){return Math.max(n,Math.min(e,r))}}function Di(n,e,t){var r=n[0],i=n[1],u=e[0],a=e[1];return i<
r?(r=Gn(i,r),u=t(a,u)):(r=Gn(r,i),u=t(u,a)),function(o){return u(r(o))}}function ki(n,e,t){var r=Math.min(n.length,e.length)-
1,i=new Array(r),u=new Array(r),a=-1;for(n[r]<n[0]&&(n=n.slice().reverse(),e=e.slice().reverse());++a<r;)i[a]=Gn(n[a],n[a+
1]),u[a]=t(e[a],e[a+1]);return function(o){var s=mt(n,o,1,r)-1;return u[s](i[s](o))}}function Ke(n,e){return e.domain(n.
domain()).range(n.range()).interpolate(n.interpolate()).clamp(n.clamp()).unknown(n.unknown())}function Ni(){var n=Ie,e=Ie,
t=ee,r,i,u,a=on,o,s,f;function h(){var g=Math.min(n.length,e.length);return a!==on&&(a=Ui(n[0],n[g-1])),o=g>2?ki:Di,s=f=
null,l}function l(g){return g==null||isNaN(g=+g)?u:(s||(s=o(n.map(r),e,t)))(r(a(g)))}return l.invert=function(g){return a(
i((f||(f=o(e,n.map(r),$n)))(g)))},l.domain=function(g){return arguments.length?(n=Array.from(g,Ci),h()):n.slice()},l.range=
function(g){return arguments.length?(e=Array.from(g),h()):e.slice()},l.rangeRound=function(g){return e=Array.from(g),t=_t,
h()},l.clamp=function(g){return arguments.length?(a=g?!0:on,h()):a!==on},l.interpolate=function(g){return arguments.length?
(t=g,h()):t},l.unknown=function(g){return arguments.length?(u=g,l):u},function(g,b){return r=g,i=b,h()}}function nt(){return Ni()(
on,on)}function Si(n,e,t,r){var i=Qn(n,e,t),u;switch(r=Hn(r??",f"),r.type){case"s":{var a=Math.max(Math.abs(n),Math.abs(
e));return r.precision==null&&!isNaN(u=tr(i,a))&&(r.precision=u),je(r,a)}case"":case"e":case"g":case"p":case"r":{r.precision==
null&&!isNaN(u=rr(i,Math.max(Math.abs(n),Math.abs(e))))&&(r.precision=u-(r.type==="e"));break}case"f":case"%":{r.precision==
null&&!isNaN(u=er(i))&&(r.precision=u-(r.type==="%")*2);break}}return qe(r)}function $i(n){var e=n.domain;return n.ticks=
function(t){var r=e();return wt(r[0],r[r.length-1],t??10)},n.tickFormat=function(t,r){var i=e();return Si(i[0],i[i.length-
1],t??10,r)},n.nice=function(t){t==null&&(t=10);var r=e(),i=0,u=r.length-1,a=r[i],o=r[u],s,f,h=10;for(o<a&&(f=a,a=o,o=f,
f=i,i=u,u=f);h-- >0;){if(f=Vn(a,o,t),f===s)return r[i]=a,r[u]=o,e(r);if(f>0)a=Math.floor(a/f)*f,o=Math.ceil(o/f)*f;else if(f<
0)a=Math.ceil(a*f)/f,o=Math.floor(o*f)/f;else break;s=f}return n},n}function Fi(){var n=nt();return n.copy=function(){return Ke(
n,Fi())},Rn.apply(n,arguments),$i(n)}function Hi(n,e){n=n.slice();var t=0,r=n.length-1,i=n[t],u=n[r],a;return u<i&&(a=t,
t=r,r=a,a=i,i=u,u=a),n[t]=e.floor(i),n[r]=e.ceil(u),n}function Yi(n){return new Date(n)}function Ai(n){return n instanceof
Date?+n:Math.round(n)}function et(n,e,t,r,i,u,a,o,s,f){var h=nt(),l=h.invert,g=h.domain,b=f(".%L"),T=f(":%S"),C=f("%I:%M"),
N=f("%I %p"),R=f("%a %d"),_=f("%b %d"),H=f("%B"),D=f("%Y");function K(d){return(s(d)<d?b:o(d)<d?T:a(d)<d?C:u(d)<d?N:r(d)<
d?i(d)<d?R:_:t(d)<d?H:D)(d)}return h.invert=function(d){return new Date(Math.round(l(d)))},h.domain=function(d){return arguments.
length?g(Array.from(d,Ai)):g().map(Yi)},h.ticks=function(d){var k=g();return n(k[0],k[k.length-1],d??10)},h.tickFormat=function(d,k){
return k==null?K:f(k)},h.nice=function(d){var k=g();return(!d||typeof d.range!="function")&&(d=e(k[0],k[k.length-1],d??10)),
d?g(Hi(k,d)):h},h.copy=function(){return Ke(h,et(n,e,t,r,i,u,a,o,s,f))},h}function Ii(){return Rn.apply(et(yr,Mr,Z,oe,In,
pn,ue,ie,an,Qe).domain([new Date(2e3,0,1),new Date(2e3,0,2)]),arguments)}export{Wi as a,Ti as b,Qe as c,oe as d,In as e,qe as f,sr as g,cr as h,sn as i,fr as j,or as k,Fi as l,Li as m,Wn as n,Je as o,
pn as p,ue as q,ie as r,an as s,Ii as t,An as u};
