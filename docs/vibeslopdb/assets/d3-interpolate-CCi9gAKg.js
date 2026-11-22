function R(e,t,r){e.prototype=t.prototype=r,r.constructor=e}function P(e,t){var r=Object.create(e.prototype);for(var n in t)
r[n]=t[n];return r}function p(){}var $=.7,H=1/$,M="\\s*([+-]?\\d+)\\s*",E="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
o="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Ie=/^#([0-9a-f]{3,8})$/,Ae=new RegExp(`^rgb\\(${M},${M},${M}\\)$`),
Be=new RegExp(`^rgb\\(${o},${o},${o}\\)$`),je=new RegExp(`^rgba\\(${M},${M},${M},${E}\\)$`),De=new RegExp(`^rgba\\(${o},${o}\
,${o},${E}\\)$`),Le=new RegExp(`^hsl\\(${E},${o},${o}\\)$`),Oe=new RegExp(`^hsla\\(${E},${o},${o},${E}\\)$`),he={aliceblue:15792383,
antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,
blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,
cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,
darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,
darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,
darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,
dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,
gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,
indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,
lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,
lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,
lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,
linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,
mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,
midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,
olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,
paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,
powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,
salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,
slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,
tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};
R(p,W,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:se,
formatHex:se,formatHex8:Ge,formatHsl:Qe,formatRgb:ce,toString:ce});function se(){return this.rgb().formatHex()}function Ge(){
return this.rgb().formatHex8()}function Qe(){return ye(this).formatHsl()}function ce(){return this.rgb().formatRgb()}function W(e){
var t,r;return e=(e+"").trim().toLowerCase(),(t=Ie.exec(e))?(r=t[1].length,t=parseInt(t[1],16),r===6?ue(t):r===3?new c(t>>
8&15|t>>4&240,t>>4&15|t&240,(t&15)<<4|t&15,1):r===8?B(t>>24&255,t>>16&255,t>>8&255,(t&255)/255):r===4?B(t>>12&15|t>>8&240,
t>>8&15|t>>4&240,t>>4&15|t&240,((t&15)<<4|t&15)/255):null):(t=Ae.exec(e))?new c(t[1],t[2],t[3],1):(t=Be.exec(e))?new c(t[1]*
255/100,t[2]*255/100,t[3]*255/100,1):(t=je.exec(e))?B(t[1],t[2],t[3],t[4]):(t=De.exec(e))?B(t[1]*255/100,t[2]*255/100,t[3]*
255/100,t[4]):(t=Le.exec(e))?oe(t[1],t[2]/100,t[3]/100,1):(t=Oe.exec(e))?oe(t[1],t[2]/100,t[3]/100,t[4]):he.hasOwnProperty(
e)?ue(he[e]):e==="transparent"?new c(NaN,NaN,NaN,0):null}function ue(e){return new c(e>>16&255,e>>8&255,e&255,1)}function B(e,t,r,n){
return n<=0&&(e=t=r=NaN),new c(e,t,r,n)}function ee(e){return e instanceof p||(e=W(e)),e?(e=e.rgb(),new c(e.r,e.g,e.b,e.
opacity)):new c}function D(e,t,r,n){return arguments.length===1?ee(e):new c(e,t,r,n??1)}function c(e,t,r,n){this.r=+e,this.
g=+t,this.b=+r,this.opacity=+n}R(c,D,P(p,{brighter(e){return e=e==null?H:Math.pow(H,e),new c(this.r*e,this.g*e,this.b*e,
this.opacity)},darker(e){return e=e==null?$:Math.pow($,e),new c(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},
clamp(){return new c(y(this.r),y(this.g),y(this.b),L(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=
this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:le,formatHex:le,formatHex8:Te,formatRgb:xe,
toString:xe}));function le(){return`#${w(this.r)}${w(this.g)}${w(this.b)}`}function Te(){return`#${w(this.r)}${w(this.g)}${w(
this.b)}${w((isNaN(this.opacity)?1:this.opacity)*255)}`}function xe(){const e=L(this.opacity);return`${e===1?"rgb(":"rgb\
a("}${y(this.r)}, ${y(this.g)}, ${y(this.b)}${e===1?")":`, ${e})`}`}function L(e){return isNaN(e)?1:Math.max(0,Math.min(
1,e))}function y(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function w(e){return e=y(e),(e<16?"0":"")+e.toString(
16)}function oe(e,t,r,n){return n<=0?e=t=r=NaN:r<=0||r>=1?e=t=NaN:t<=0&&(e=NaN),new x(e,t,r,n)}function ye(e){if(e instanceof
x)return new x(e.h,e.s,e.l,e.opacity);if(e instanceof p||(e=W(e)),!e)return new x;if(e instanceof x)return e;e=e.rgb();var t=e.
r/255,r=e.g/255,n=e.b/255,i=Math.min(t,r,n),a=Math.max(t,r,n),f=NaN,h=a-i,s=(a+i)/2;return h?(t===a?f=(r-n)/h+(r<n)*6:r===
a?f=(n-t)/h+2:f=(t-r)/h+4,h/=s<.5?a+i:2-a-i,f*=60):h=s>0&&s<1?0:f,new x(f,h,s,e.opacity)}function Ke(e,t,r,n){return arguments.
length===1?ye(e):new x(e,t,r,n??1)}function x(e,t,r,n){this.h=+e,this.s=+t,this.l=+r,this.opacity=+n}R(x,Ke,P(p,{brighter(e){
return e=e==null?H:Math.pow(H,e),new x(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?$:Math.pow($,e),
new x(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,t=isNaN(e)||isNaN(this.s)?0:this.s,r=this.
l,n=r+(r<.5?r:1-r)*t,i=2*r-n;return new c(X(e>=240?e-240:e+120,i,n),X(e,i,n),X(e<120?e+240:e-120,i,n),this.opacity)},clamp(){
return new x(be(this.h),j(this.s),j(this.l),L(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&
0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=L(this.opacity);return`${e===1?"hsl(":"hsla("}${be(
this.h)}, ${j(this.s)*100}%, ${j(this.l)*100}%${e===1?")":`, ${e})`}`}}));function be(e){return e=(e||0)%360,e<0?e+360:e}
function j(e){return Math.max(0,Math.min(1,e||0))}function X(e,t,r){return(e<60?t+(r-t)*e/60:e<180?r:e<240?t+(r-t)*(240-
e)/60:t)*255}const me=Math.PI/180,$e=180/Math.PI,O=18,Ne=.96422,Me=1,ve=.82521,He=4/29,v=6/29,Re=3*v*v,Xe=v*v*v;function ke(e){
if(e instanceof b)return new b(e.l,e.a,e.b,e.opacity);if(e instanceof g)return qe(e);e instanceof c||(e=ee(e));var t=J(e.
r),r=J(e.g),n=J(e.b),i=Y((.2225045*t+.7168786*r+.0606169*n)/Me),a,f;return t===r&&r===n?a=f=i:(a=Y((.4360747*t+.3850649*
r+.1430804*n)/Ne),f=Y((.0139322*t+.0971045*r+.7141733*n)/ve)),new b(116*i-16,500*(a-i),200*(i-f),e.opacity)}function Ye(e,t,r,n){
return arguments.length===1?ke(e):new b(e,t,r,n??1)}function b(e,t,r,n){this.l=+e,this.a=+t,this.b=+r,this.opacity=+n}R(
b,Ye,P(p,{brighter(e){return new b(this.l+O*(e??1),this.a,this.b,this.opacity)},darker(e){return new b(this.l-O*(e??1),this.
a,this.b,this.opacity)},rgb(){var e=(this.l+16)/116,t=isNaN(this.a)?e:e+this.a/500,r=isNaN(this.b)?e:e-this.b/200;return t=
Ne*Z(t),e=Me*Z(e),r=ve*Z(r),new c(F(3.1338561*t-1.6168667*e-.4906146*r),F(-.9787684*t+1.9161415*e+.033454*r),F(.0719453*
t-.2289914*e+1.4052427*r),this.opacity)}}));function Y(e){return e>Xe?Math.pow(e,1/3):e/Re+He}function Z(e){return e>v?e*
e*e:Re*(e-He)}function F(e){return 255*(e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055)}function J(e){return(e/=255)<=
.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}function Ze(e){if(e instanceof g)return new g(e.h,e.c,e.l,e.opacity);if(e instanceof
b||(e=ke(e)),e.a===0&&e.b===0)return new g(NaN,0<e.l&&e.l<100?0:NaN,e.l,e.opacity);var t=Math.atan2(e.b,e.a)*$e;return new g(
t<0?t+360:t,Math.sqrt(e.a*e.a+e.b*e.b),e.l,e.opacity)}function U(e,t,r,n){return arguments.length===1?Ze(e):new g(e,t,r,
n??1)}function g(e,t,r,n){this.h=+e,this.c=+t,this.l=+r,this.opacity=+n}function qe(e){if(isNaN(e.h))return new b(e.l,0,
0,e.opacity);var t=e.h*me;return new b(e.l,Math.cos(t)*e.c,Math.sin(t)*e.c,e.opacity)}R(g,U,P(p,{brighter(e){return new g(
this.h,this.c,this.l+O*(e??1),this.opacity)},darker(e){return new g(this.h,this.c,this.l-O*(e??1),this.opacity)},rgb(){return qe(
this).rgb()}}));var _e=-.14861,te=1.78277,re=-.29227,G=-.90649,C=1.97294,ge=C*G,de=C*te,pe=te*re-G*_e;function Fe(e){if(e instanceof
m)return new m(e.h,e.s,e.l,e.opacity);e instanceof c||(e=ee(e));var t=e.r/255,r=e.g/255,n=e.b/255,i=(pe*n+ge*t-de*r)/(pe+
ge-de),a=n-i,f=(C*(r-i)-re*a)/G,h=Math.sqrt(f*f+a*a)/(C*i*(1-i)),s=h?Math.atan2(f,a)*$e-120:NaN;return new m(s<0?s+360:s,
h,i,e.opacity)}function V(e,t,r,n){return arguments.length===1?Fe(e):new m(e,t,r,n??1)}function m(e,t,r,n){this.h=+e,this.
s=+t,this.l=+r,this.opacity=+n}R(m,V,P(p,{brighter(e){return e=e==null?H:Math.pow(H,e),new m(this.h,this.s,this.l*e,this.
opacity)},darker(e){return e=e==null?$:Math.pow($,e),new m(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=isNaN(this.
h)?0:(this.h+120)*me,t=+this.l,r=isNaN(this.s)?0:this.s*t*(1-t),n=Math.cos(e),i=Math.sin(e);return new c(255*(t+r*(_e*n+
te*i)),255*(t+r*(re*n+G*i)),255*(t+r*(C*n)),this.opacity)}}));function Je(e,t,r,n,i){var a=e*e,f=a*e;return((1-3*e+3*a-f)*
t+(4-6*a+3*f)*r+(1+3*e+3*a-3*f)*n+f*i)/6}function Ue(e){var t=e.length-1;return function(r){var n=r<=0?r=0:r>=1?(r=1,t-1):
Math.floor(r*t),i=e[n],a=e[n+1],f=n>0?e[n-1]:2*i-a,h=n<t-1?e[n+2]:2*a-i;return Je((r-n/t)*t,f,i,a,h)}}var ne=e=>()=>e;function Ee(e,t){
return function(r){return e+r*t}}function Ve(e,t,r){return e=Math.pow(e,r),t=Math.pow(t,r)-e,r=1/r,function(n){return Math.
pow(e+n*t,r)}}function Ce(e,t){var r=t-e;return r?Ee(e,r>180||r<-180?r-360*Math.round(r/360):r):ne(isNaN(e)?t:e)}function We(e){
return(e=+e)==1?d:function(t,r){return r-t?Ve(t,r,e):ne(isNaN(t)?r:t)}}function d(e,t){var r=t-e;return r?Ee(e,r):ne(isNaN(
e)?t:e)}(function e(t){var r=We(t);function n(i,a){var f=r((i=D(i)).r,(a=D(a)).r),h=r(i.g,a.g),s=r(i.b,a.b),u=d(i.opacity,
a.opacity);return function(l){return i.r=f(l),i.g=h(l),i.b=s(l),i.opacity=u(l),i+""}}return n.gamma=e,n})(1);function e0(e){
return function(t){var r=t.length,n=new Array(r),i=new Array(r),a=new Array(r),f,h;for(f=0;f<r;++f)h=D(t[f]),n[f]=h.r||0,
i[f]=h.g||0,a[f]=h.b||0;return n=e(n),i=e(i),a=e(a),h.opacity=1,function(s){return h.r=n(s),h.g=i(s),h.b=a(s),h+""}}}var a0=e0(
Ue),t0=1e-12;function we(e){return((e=Math.exp(e))+1/e)/2}function r0(e){return((e=Math.exp(e))-1/e)/2}function n0(e){return((e=
Math.exp(2*e))-1)/(e+1)}(function e(t,r,n){function i(a,f){var h=a[0],s=a[1],u=a[2],l=f[0],ze=f[1],N=f[2],z=l-h,S=ze-s,I=z*
z+S*S,A,k;if(I<t0)k=Math.log(N/u)/t,A=function(_){return[h+_*z,s+_*S,u*Math.exp(t*_*k)]};else{var Q=Math.sqrt(I),T=(N*N-
u*u+n*I)/(2*u*r*Q),K=(N*N-u*u-n*I)/(2*N*r*Q),q=Math.log(Math.sqrt(T*T+1)-T),Se=Math.log(Math.sqrt(K*K+1)-K);k=(Se-q)/t,A=
function(_){var ie=_*k,ae=we(q),fe=u/(r*Q)*(ae*n0(t*ie+q)-r0(q));return[h+fe*z,s+fe*S,u*ae/we(t*ie+q)]}}return A.duration=
Math.abs(k)*1e3*t/Math.SQRT2,A}return i.rho=function(a){var f=Math.max(.001,+a),h=f*f,s=h*h;return e(f,h,s)},i})(Math.SQRT2,
2,4);function i0(e){return function(t,r){var n=e((t=U(t)).h,(r=U(r)).h),i=d(t.c,r.c),a=d(t.l,r.l),f=d(t.opacity,r.opacity);
return function(h){return t.h=n(h),t.c=i(h),t.l=a(h),t.opacity=f(h),t+""}}}var f0=i0(Ce);function Pe(e){return(function t(r){
r=+r;function n(i,a){var f=e((i=V(i)).h,(a=V(a)).h),h=d(i.s,a.s),s=d(i.l,a.l),u=d(i.opacity,a.opacity);return function(l){
return i.h=f(l),i.s=h(l),i.l=s(Math.pow(l,r)),i.opacity=u(l),i+""}}return n.gamma=t,n})(1)}Pe(Ce);var h0=Pe(d);export{V as a,D as b,h0 as c,f0 as h,a0 as r};
