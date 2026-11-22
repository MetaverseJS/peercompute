import{bT as It,_ as l,h as be,g as we,J as _e,I as De,i as Se,j as Ce,k as dt,y as vt,o as Me,b_ as U,n as st,A as Ee,ad as Ie,
R as $e,G as Ae}from"./carnageWindow--1fjkU2y.js";import{t as Ye,m as Fe,a as Le,l as Oe,c as Zt,d as Qt,e as We,g as Pe,
h as Ve,i as Re,j as ze,k as Ne,n as He,p as Jt,q as Kt,r as te,s as ee,u as re}from"./d3-scale-D5mADQCJ.js";import{h as Be}from"./d3-interpolate-CCi9gAKg.js";
import"./preload-helper-FD8EeCEm.js";function qe(t){return t}var Tt=1,At=2,Ft=3,xt=4,se=1e-6;function Ge(t){return"trans\
late("+t+",0)"}function je(t){return"translate(0,"+t+")"}function Xe(t){return e=>+t(e)}function Ue(t,e){return e=Math.max(
0,t.bandwidth()-e*2)/2,t.round()&&(e=Math.round(e)),s=>+t(s)+e}function Ze(){return!this.__axis}function de(t,e){var s=[],
r=null,i=null,g=6,y=6,b=3,S=typeof window<"u"&&window.devicePixelRatio>1?0:.5,L=t===Tt||t===xt?-1:1,_=t===xt||t===At?"x":
"y",W=t===Tt||t===Ft?Ge:je;function w(D){var N=r??(e.ticks?e.ticks.apply(e,s):e.domain()),V=i??(e.tickFormat?e.tickFormat.
apply(e,s):qe),k=Math.max(g,0)+b,M=e.range(),P=+M[0]+S,O=+M[M.length-1]+S,B=(e.bandwidth?Ue:Xe)(e.copy(),S),H=D.selection?
D.selection():D,I=H.selectAll(".domain").data([null]),x=H.selectAll(".tick").data(N,e).order(),h=x.exit(),E=x.enter().append(
"g").attr("class","tick"),f=x.select("line"),T=x.select("text");I=I.merge(I.enter().insert("path",".tick").attr("class",
"domain").attr("stroke","currentColor")),x=x.merge(E),f=f.merge(E.append("line").attr("stroke","currentColor").attr(_+"2",
L*g)),T=T.merge(E.append("text").attr("fill","currentColor").attr(_,L*k).attr("dy",t===Tt?"0em":t===Ft?"0.71em":"0.32em")),
D!==H&&(I=I.transition(D),x=x.transition(D),f=f.transition(D),T=T.transition(D),h=h.transition(D).attr("opacity",se).attr(
"transform",function(v){return isFinite(v=B(v))?W(v+S):this.getAttribute("transform")}),E.attr("opacity",se).attr("trans\
form",function(v){var p=this.parentNode.__axis;return W((p&&isFinite(p=p(v))?p:B(v))+S)})),h.remove(),I.attr("d",t===xt||
t===At?y?"M"+L*y+","+P+"H"+S+"V"+O+"H"+L*y:"M"+S+","+P+"V"+O:y?"M"+P+","+L*y+"V"+S+"H"+O+"V"+L*y:"M"+P+","+S+"H"+O),x.attr(
"opacity",1).attr("transform",function(v){return W(B(v)+S)}),f.attr(_+"2",L*g),T.attr(_,L*k).text(V),H.filter(Ze).attr("\
fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===At?"start":t===xt?"end":"midd\
le"),H.each(function(){this.__axis=B})}return w.scale=function(D){return arguments.length?(e=D,w):e},w.ticks=function(){
return s=Array.from(arguments),w},w.tickArguments=function(D){return arguments.length?(s=D==null?[]:Array.from(D),w):s.slice()},
w.tickValues=function(D){return arguments.length?(r=D==null?null:Array.from(D),w):r&&r.slice()},w.tickFormat=function(D){
return arguments.length?(i=D,w):i},w.tickSize=function(D){return arguments.length?(g=y=+D,w):g},w.tickSizeInner=function(D){
return arguments.length?(g=+D,w):g},w.tickSizeOuter=function(D){return arguments.length?(y=+D,w):y},w.tickPadding=function(D){
return arguments.length?(b=+D,w):b},w.offset=function(D){return arguments.length?(S=+D,w):S},w}function Qe(t){return de(
Tt,t)}function Je(t){return de(Ft,t)}var bt={exports:{}},Ke=bt.exports,ne;function tr(){return ne||(ne=1,(function(t,e){
(function(s,r){t.exports=r()})(Ke,(function(){var s="day";return function(r,i,g){var y=function(L){return L.add(4-L.isoWeekday(),
s)},b=i.prototype;b.isoWeekYear=function(){return y(this).year()},b.isoWeek=function(L){if(!this.$utils().u(L))return this.
add(7*(L-this.isoWeek()),s);var _,W,w,D,N=y(this),V=(_=this.isoWeekYear(),W=this.$u,w=(W?g.utc:g)().year(_).startOf("yea\
r"),D=4-w.isoWeekday(),w.isoWeekday()>4&&(D+=7),w.add(D,s));return N.diff(V,"week")+1},b.isoWeekday=function(L){return this.
$utils().u(L)?this.day()||7:this.day(this.day()%7?L:L-7)};var S=b.startOf;b.startOf=function(L,_){var W=this.$utils(),w=!!W.
u(_)||_;return W.p(L)==="isoweek"?w?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-
(this.isoWeekday()-1)+7).endOf("day"):S.bind(this)(L,_)}}}))})(bt)),bt.exports}var er=tr();const rr=It(er);var wt={exports:{}},
sr=wt.exports,ie;function nr(){return ie||(ie=1,(function(t,e){(function(s,r){t.exports=r()})(sr,(function(){var s={LTS:"\
h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},r=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,
i=/\d/,g=/\d\d/,y=/\d\d?/,b=/\d*[^-_:/,()\s\d]+/,S={},L=function(k){return(k=+k)+(k>68?1900:2e3)},_=function(k){return function(M){
this[k]=+M}},W=[/[+-]\d\d:?(\d\d)?|Z/,function(k){(this.zone||(this.zone={})).offset=(function(M){if(!M||M==="Z")return 0;
var P=M.match(/([+-]|\d\d)/g),O=60*P[1]+(+P[2]||0);return O===0?0:P[0]==="+"?-O:O})(k)}],w=function(k){var M=S[k];return M&&
(M.indexOf?M:M.s.concat(M.f))},D=function(k,M){var P,O=S.meridiem;if(O){for(var B=1;B<=24;B+=1)if(k.indexOf(O(B,0,M))>-1){
P=B>12;break}}else P=k===(M?"pm":"PM");return P},N={A:[b,function(k){this.afternoon=D(k,!1)}],a:[b,function(k){this.afternoon=
D(k,!0)}],Q:[i,function(k){this.month=3*(k-1)+1}],S:[i,function(k){this.milliseconds=100*+k}],SS:[g,function(k){this.milliseconds=
10*+k}],SSS:[/\d{3}/,function(k){this.milliseconds=+k}],s:[y,_("seconds")],ss:[y,_("seconds")],m:[y,_("minutes")],mm:[y,
_("minutes")],H:[y,_("hours")],h:[y,_("hours")],HH:[y,_("hours")],hh:[y,_("hours")],D:[y,_("day")],DD:[g,_("day")],Do:[b,
function(k){var M=S.ordinal,P=k.match(/\d+/);if(this.day=P[0],M)for(var O=1;O<=31;O+=1)M(O).replace(/\[|\]/g,"")===k&&(this.
day=O)}],w:[y,_("week")],ww:[g,_("week")],M:[y,_("month")],MM:[g,_("month")],MMM:[b,function(k){var M=w("months"),P=(w("\
monthsShort")||M.map((function(O){return O.slice(0,3)}))).indexOf(k)+1;if(P<1)throw new Error;this.month=P%12||P}],MMMM:[
b,function(k){var M=w("months").indexOf(k)+1;if(M<1)throw new Error;this.month=M%12||M}],Y:[/[+-]?\d+/,_("year")],YY:[g,
function(k){this.year=L(k)}],YYYY:[/\d{4}/,_("year")],Z:W,ZZ:W};function V(k){var M,P;M=k,P=S&&S.formats;for(var O=(k=M.
replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(f,T,v){var p=v&&v.toUpperCase();return T||P[v]||s[v]||P[p].replace(
/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(a,d,m){return d||m.slice(1)}))}))).match(r),B=O.length,H=0;H<B;H+=1){var I=O[H],
x=N[I],h=x&&x[0],E=x&&x[1];O[H]=E?{regex:h,parser:E}:I.replace(/^\[|\]$/g,"")}return function(f){for(var T={},v=0,p=0;v<
B;v+=1){var a=O[v];if(typeof a=="string")p+=a.length;else{var d=a.regex,m=a.parser,u=f.slice(p),C=d.exec(u)[0];m.call(T,
C),f=f.replace(C,"")}}return(function(n){var $=n.afternoon;if($!==void 0){var o=n.hours;$?o<12&&(n.hours+=12):o===12&&(n.
hours=0),delete n.afternoon}})(T),T}}return function(k,M,P){P.p.customParseFormat=!0,k&&k.parseTwoDigitYear&&(L=k.parseTwoDigitYear);
var O=M.prototype,B=O.parse;O.parse=function(H){var I=H.date,x=H.utc,h=H.args;this.$u=x;var E=h[1];if(typeof E=="string"){
var f=h[2]===!0,T=h[3]===!0,v=f||T,p=h[2];T&&(p=h[2]),S=this.$locale(),!f&&p&&(S=P.Ls[p]),this.$d=(function(u,C,n,$){try{
if(["x","X"].indexOf(C)>-1)return new Date((C==="X"?1e3:1)*u);var o=V(C)(u),G=o.year,c=o.month,A=o.day,Y=o.hours,z=o.minutes,
F=o.seconds,q=o.milliseconds,R=o.zone,nt=o.week,at=new Date,yt=A||(G||c?1:at.getDate()),lt=G||at.getFullYear(),j=0;G&&!c||
(j=c>0?c-1:at.getMonth());var J,Z=Y||0,ot=z||0,K=F||0,it=q||0;return R?new Date(Date.UTC(lt,j,yt,Z,ot,K,it+60*R.offset*1e3)):
n?new Date(Date.UTC(lt,j,yt,Z,ot,K,it)):(J=new Date(lt,j,yt,Z,ot,K,it),nt&&(J=$(J).week(nt).toDate()),J)}catch{return new Date(
"")}})(I,E,x,P),this.init(),p&&p!==!0&&(this.$L=this.locale(p).$L),v&&I!=this.format(E)&&(this.$d=new Date("")),S={}}else if(E instanceof
Array)for(var a=E.length,d=1;d<=a;d+=1){h[1]=E[d-1];var m=P.apply(this,h);if(m.isValid()){this.$d=m.$d,this.$L=m.$L,this.
init();break}d===a&&(this.$d=new Date(""))}else B.call(this,H)}}}))})(wt)),wt.exports}var ir=nr();const ar=It(ir);var _t={
exports:{}},or=_t.exports,ae;function cr(){return ae||(ae=1,(function(t,e){(function(s,r){t.exports=r()})(or,(function(){
return function(s,r){var i=r.prototype,g=i.format;i.format=function(y){var b=this,S=this.$locale();if(!this.isValid())return g.
bind(this)(y);var L=this.$utils(),_=(y||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,
(function(W){switch(W){case"Q":return Math.ceil((b.$M+1)/3);case"Do":return S.ordinal(b.$D);case"gggg":return b.weekYear();case"\
GGGG":return b.isoWeekYear();case"wo":return S.ordinal(b.week(),"W");case"w":case"ww":return L.s(b.week(),W==="w"?1:2,"0");case"\
W":case"WW":return L.s(b.isoWeek(),W==="W"?1:2,"0");case"k":case"kk":return L.s(String(b.$H===0?24:b.$H),W==="k"?1:2,"0");case"\
X":return Math.floor(b.$d.getTime()/1e3);case"x":return b.$d.getTime();case"z":return"["+b.offsetName()+"]";case"zzz":return"\
["+b.offsetName("long")+"]";default:return W}}));return g.bind(this)(_)}}}))})(_t)),_t.exports}var lr=cr();const ur=It(lr);
var Dt={exports:{}},dr=Dt.exports,oe;function fr(){return oe||(oe=1,(function(t,e){(function(s,r){t.exports=r()})(dr,(function(){
var s,r,i=1e3,g=6e4,y=36e5,b=864e5,S=31536e6,L=2628e6,_=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,
W=/\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g,w={years:S,months:L,days:b,hours:y,minutes:g,seconds:i,
milliseconds:1,weeks:6048e5},D=function(I){return I instanceof B},N=function(I,x,h){return new B(I,h,x.$l)},V=function(I){
return r.p(I)+"s"},k=function(I){return I<0},M=function(I){return k(I)?Math.ceil(I):Math.floor(I)},P=function(I){return Math.
abs(I)},O=function(I,x){return I?k(I)?{negative:!0,format:""+P(I)+x}:{negative:!1,format:""+I+x}:{negative:!1,format:""}},
B=(function(){function I(h,E,f){var T=this;if(this.$d={},this.$l=f,h===void 0&&(this.$ms=0,this.parseFromMilliseconds()),
E)return N(h*w[V(E)],this);if(typeof h=="number")return this.$ms=h,this.parseFromMilliseconds(),this;if(typeof h=="objec\
t")return Object.keys(h).forEach((function(a){T.$d[V(a)]=h[a]})),this.calMilliseconds(),this;if(typeof h=="string"){var v=h.
match(_);if(v){var p=v.slice(2).map((function(a){return a!=null?Number(a):0}));return this.$d.years=p[0],this.$d.months=
p[1],this.$d.weeks=p[2],this.$d.days=p[3],this.$d.hours=p[4],this.$d.minutes=p[5],this.$d.seconds=p[6],this.calMilliseconds(),
this}}return this}var x=I.prototype;return x.calMilliseconds=function(){var h=this;this.$ms=Object.keys(this.$d).reduce(
(function(E,f){return E+(h.$d[f]||0)*w[f]}),0)},x.parseFromMilliseconds=function(){var h=this.$ms;this.$d.years=M(h/S),h%=
S,this.$d.months=M(h/L),h%=L,this.$d.days=M(h/b),h%=b,this.$d.hours=M(h/y),h%=y,this.$d.minutes=M(h/g),h%=g,this.$d.seconds=
M(h/i),h%=i,this.$d.milliseconds=h},x.toISOString=function(){var h=O(this.$d.years,"Y"),E=O(this.$d.months,"M"),f=+this.
$d.days||0;this.$d.weeks&&(f+=7*this.$d.weeks);var T=O(f,"D"),v=O(this.$d.hours,"H"),p=O(this.$d.minutes,"M"),a=this.$d.
seconds||0;this.$d.milliseconds&&(a+=this.$d.milliseconds/1e3,a=Math.round(1e3*a)/1e3);var d=O(a,"S"),m=h.negative||E.negative||
T.negative||v.negative||p.negative||d.negative,u=v.format||p.format||d.format?"T":"",C=(m?"-":"")+"P"+h.format+E.format+
T.format+u+v.format+p.format+d.format;return C==="P"||C==="-P"?"P0D":C},x.toJSON=function(){return this.toISOString()},x.
format=function(h){var E=h||"YYYY-MM-DDTHH:mm:ss",f={Y:this.$d.years,YY:r.s(this.$d.years,2,"0"),YYYY:r.s(this.$d.years,
4,"0"),M:this.$d.months,MM:r.s(this.$d.months,2,"0"),D:this.$d.days,DD:r.s(this.$d.days,2,"0"),H:this.$d.hours,HH:r.s(this.
$d.hours,2,"0"),m:this.$d.minutes,mm:r.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:r.s(this.$d.seconds,2,"0"),SSS:r.s(
this.$d.milliseconds,3,"0")};return E.replace(W,(function(T,v){return v||String(f[T])}))},x.as=function(h){return this.$ms/
w[V(h)]},x.get=function(h){var E=this.$ms,f=V(h);return f==="milliseconds"?E%=1e3:E=f==="weeks"?M(E/w[f]):this.$d[f],E||
0},x.add=function(h,E,f){var T;return T=E?h*w[V(E)]:D(h)?h.$ms:N(h,this).$ms,N(this.$ms+T*(f?-1:1),this)},x.subtract=function(h,E){
return this.add(h,E,!0)},x.locale=function(h){var E=this.clone();return E.$l=h,E},x.clone=function(){return N(this.$ms,this)},
x.humanize=function(h){return s().add(this.$ms,"ms").locale(this.$l).fromNow(!h)},x.valueOf=function(){return this.asMilliseconds()},
x.milliseconds=function(){return this.get("milliseconds")},x.asMilliseconds=function(){return this.as("milliseconds")},x.
seconds=function(){return this.get("seconds")},x.asSeconds=function(){return this.as("seconds")},x.minutes=function(){return this.
get("minutes")},x.asMinutes=function(){return this.as("minutes")},x.hours=function(){return this.get("hours")},x.asHours=
function(){return this.as("hours")},x.days=function(){return this.get("days")},x.asDays=function(){return this.as("days")},
x.weeks=function(){return this.get("weeks")},x.asWeeks=function(){return this.as("weeks")},x.months=function(){return this.
get("months")},x.asMonths=function(){return this.as("months")},x.years=function(){return this.get("years")},x.asYears=function(){
return this.as("years")},I})(),H=function(I,x,h){return I.add(x.years()*h,"y").add(x.months()*h,"M").add(x.days()*h,"d").
add(x.hours()*h,"h").add(x.minutes()*h,"m").add(x.seconds()*h,"s").add(x.milliseconds()*h,"ms")};return function(I,x,h){
s=h,r=h().$utils(),h.duration=function(T,v){var p=h.locale();return N(T,{$l:p},v)},h.isDuration=D;var E=x.prototype.add,
f=x.prototype.subtract;x.prototype.add=function(T,v){return D(T)?H(this,T,1):E.bind(this)(T,v)},x.prototype.subtract=function(T,v){
return D(T)?H(this,T,-1):f.bind(this)(T,v)}}}))})(Dt)),Dt.exports}var hr=fr();const mr=It(hr);var Lt=(function(){var t=l(
function(p,a,d,m){for(d=d||{},m=p.length;m--;d[p[m]]=a);return d},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,
26,27,28,29,30,31,33,35,36,38,40],s=[1,26],r=[1,27],i=[1,28],g=[1,29],y=[1,30],b=[1,31],S=[1,32],L=[1,33],_=[1,34],W=[1,
9],w=[1,10],D=[1,11],N=[1,12],V=[1,13],k=[1,14],M=[1,15],P=[1,16],O=[1,19],B=[1,20],H=[1,21],I=[1,22],x=[1,23],h=[1,25],
E=[1,35],f={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,
NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,
weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,
tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,
acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,
href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_m\
onday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"w\
eekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFor\
mat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"a\
cc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"cal\
lbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[
11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[
9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],
performAction:l(function(a,d,m,u,C,n,$){var o=n.length-1;switch(C){case 1:return n[o-1];case 2:this.$=[];break;case 3:n[o-
1].push(n[o]),this.$=n[o-1];break;case 4:case 5:this.$=n[o];break;case 6:case 7:this.$=[];break;case 8:u.setWeekday("mon\
day");break;case 9:u.setWeekday("tuesday");break;case 10:u.setWeekday("wednesday");break;case 11:u.setWeekday("thursday");
break;case 12:u.setWeekday("friday");break;case 13:u.setWeekday("saturday");break;case 14:u.setWeekday("sunday");break;case 15:
u.setWeekend("friday");break;case 16:u.setWeekend("saturday");break;case 17:u.setDateFormat(n[o].substr(11)),this.$=n[o].
substr(11);break;case 18:u.enableInclusiveEndDates(),this.$=n[o].substr(18);break;case 19:u.TopAxis(),this.$=n[o].substr(
8);break;case 20:u.setAxisFormat(n[o].substr(11)),this.$=n[o].substr(11);break;case 21:u.setTickInterval(n[o].substr(13)),
this.$=n[o].substr(13);break;case 22:u.setExcludes(n[o].substr(9)),this.$=n[o].substr(9);break;case 23:u.setIncludes(n[o].
substr(9)),this.$=n[o].substr(9);break;case 24:u.setTodayMarker(n[o].substr(12)),this.$=n[o].substr(12);break;case 27:u.
setDiagramTitle(n[o].substr(6)),this.$=n[o].substr(6);break;case 28:this.$=n[o].trim(),u.setAccTitle(this.$);break;case 29:case 30:
this.$=n[o].trim(),u.setAccDescription(this.$);break;case 31:u.addSection(n[o].substr(8)),this.$=n[o].substr(8);break;case 33:
u.addTask(n[o-1],n[o]),this.$="task";break;case 34:this.$=n[o-1],u.setClickEvent(n[o-1],n[o],null);break;case 35:this.$=
n[o-2],u.setClickEvent(n[o-2],n[o-1],n[o]);break;case 36:this.$=n[o-2],u.setClickEvent(n[o-2],n[o-1],null),u.setLink(n[o-
2],n[o]);break;case 37:this.$=n[o-3],u.setClickEvent(n[o-3],n[o-2],n[o-1]),u.setLink(n[o-3],n[o]);break;case 38:this.$=n[o-
2],u.setClickEvent(n[o-2],n[o],null),u.setLink(n[o-2],n[o-1]);break;case 39:this.$=n[o-3],u.setClickEvent(n[o-3],n[o-1],
n[o]),u.setLink(n[o-3],n[o-2]);break;case 40:this.$=n[o-1],u.setLink(n[o-1],n[o]);break;case 41:case 47:this.$=n[o-1]+" "+
n[o];break;case 42:case 43:case 45:this.$=n[o-2]+" "+n[o-1]+" "+n[o];break;case 44:case 46:this.$=n[o-3]+" "+n[o-2]+" "+
n[o-1]+" "+n[o];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,
12:s,13:r,14:i,15:g,16:y,17:b,18:S,19:18,20:L,21:_,22:W,23:w,24:D,25:N,26:V,27:k,28:M,29:P,30:O,31:B,33:H,35:I,36:x,37:24,
38:h,40:E},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:s,13:r,14:i,15:g,16:y,17:b,18:S,19:18,20:L,21:_,22:W,23:w,24:D,
25:N,26:V,27:k,28:M,29:P,30:O,31:B,33:H,35:I,36:x,37:24,38:h,40:E},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,
19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,
38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),
t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[
1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,
39])],defaultActions:{},parseError:l(function(a,d){if(d.recoverable)this.trace(a);else{var m=new Error(a);throw m.hash=d,
m}},"parseError"),parse:l(function(a){var d=this,m=[0],u=[],C=[null],n=[],$=this.table,o="",G=0,c=0,A=2,Y=1,z=n.slice.call(
arguments,1),F=Object.create(this.lexer),q={yy:{}};for(var R in this.yy)Object.prototype.hasOwnProperty.call(this.yy,R)&&
(q.yy[R]=this.yy[R]);F.setInput(a,q.yy),q.yy.lexer=F,q.yy.parser=this,typeof F.yylloc>"u"&&(F.yylloc={});var nt=F.yylloc;
n.push(nt);var at=F.options&&F.options.ranges;typeof q.yy.parseError=="function"?this.parseError=q.yy.parseError:this.parseError=
Object.getPrototypeOf(this).parseError;function yt(Q){m.length=m.length-2*Q,C.length=C.length-Q,n.length=n.length-Q}l(yt,
"popStack");function lt(){var Q;return Q=u.pop()||F.lex()||Y,typeof Q!="number"&&(Q instanceof Array&&(u=Q,Q=u.pop()),Q=
d.symbols_[Q]||Q),Q}l(lt,"lex");for(var j,J,Z,ot,K={},it,tt,Ut,pt;;){if(J=m[m.length-1],this.defaultActions[J]?Z=this.defaultActions[J]:
((j===null||typeof j>"u")&&(j=lt()),Z=$[J]&&$[J][j]),typeof Z>"u"||!Z.length||!Z[0]){var $t="";pt=[];for(it in $[J])this.
terminals_[it]&&it>A&&pt.push("'"+this.terminals_[it]+"'");F.showPosition?$t="Parse error on line "+(G+1)+`:
`+F.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[j]||j)+"'":$t="Parse error on line "+(G+1)+": Unexpected "+(j==Y?"e\
nd of input":"'"+(this.terminals_[j]||j)+"'"),this.parseError($t,{text:F.match,token:this.terminals_[j]||j,line:F.yylineno,
loc:nt,expected:pt})}if(Z[0]instanceof Array&&Z.length>1)throw new Error("Parse Error: multiple actions possible at stat\
e: "+J+", token: "+j);switch(Z[0]){case 1:m.push(j),C.push(F.yytext),n.push(F.yylloc),m.push(Z[1]),j=null,c=F.yyleng,o=F.
yytext,G=F.yylineno,nt=F.yylloc;break;case 2:if(tt=this.productions_[Z[1]][1],K.$=C[C.length-tt],K._$={first_line:n[n.length-
(tt||1)].first_line,last_line:n[n.length-1].last_line,first_column:n[n.length-(tt||1)].first_column,last_column:n[n.length-
1].last_column},at&&(K._$.range=[n[n.length-(tt||1)].range[0],n[n.length-1].range[1]]),ot=this.performAction.apply(K,[o,
c,G,q.yy,Z[1],C,n].concat(z)),typeof ot<"u")return ot;tt&&(m=m.slice(0,-1*tt*2),C=C.slice(0,-1*tt),n=n.slice(0,-1*tt)),m.
push(this.productions_[Z[1]][0]),C.push(K.$),n.push(K._$),Ut=$[m[m.length-2]][m[m.length-1]],m.push(Ut);break;case 3:return!0}}
return!0},"parse")},T=(function(){var p={EOF:1,parseError:l(function(d,m){if(this.yy.parser)this.yy.parser.parseError(d,
m);else throw new Error(d)},"parseError"),setInput:l(function(a,d){return this.yy=d||this.yy||{},this._input=a,this._more=
this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["IN\
ITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),
this.offset=0,this},"setInput"),input:l(function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.
match+=a,this.matched+=a;var d=a.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.
last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},"input"),unput:l(function(a){
var d=a.length,m=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-
d),this.offset-=d;var u=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=
this.matched.substr(0,this.matched.length-1),m.length-1&&(this.yylineno-=m.length-1);var C=this.yylloc.range;return this.
yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:m?
(m.length===u.length?this.yylloc.first_column:0)+u[u.length-m.length].length-m[0].length:this.yylloc.first_column-d},this.
options.ranges&&(this.yylloc.range=[C[0],C[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){
return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.
parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of \
the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(a){this.unput(this.
match.slice(a))},"less"),pastInput:l(function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.
length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var a=this.match;return a.length<
20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(
function(){var a=this.pastInput(),d=new Array(a.length+1).join("-");return a+this.upcomingInput()+`
`+d+"^"},"showPosition"),test_match:l(function(a,d){var m,u,C;if(this.options.backtrack_lexer&&(C={yylineno:this.yylineno,
yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.
yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.
offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.
ranges&&(C.yylloc.range=this.yylloc.range.slice(0))),u=a[0].match(/(?:\r\n?|\n).*/g),u&&(this.yylineno+=u.length),this.yylloc=
{first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:u?u[u.length-
1].length-u[u.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+a[0].length},this.yytext+=a[0],this.match+=a[0],
this.matches=a,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),
this._more=!1,this._backtrack=!1,this._input=this._input.slice(a[0].length),this.matched+=a[0],m=this.performAction.call(
this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),m)return m;
if(this._backtrack){for(var n in C)this[n]=C[n];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.
EOF;this._input||(this.done=!0);var a,d,m,u;this._more||(this.yytext="",this.match="");for(var C=this._currentRules(),n=0;n<
C.length;n++)if(m=this._input.match(this.rules[C[n]]),m&&(!d||m[0].length>d[0].length)){if(d=m,u=n,this.options.backtrack_lexer){
if(a=this.test_match(m,C[n]),a!==!1)return a;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)
break}return d?(a=this.test_match(d,C[u]),a!==!1?a:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+
(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var d=this.next();return d||this.
lex()},"lex"),begin:l(function(d){this.conditionStack.push(d)},"begin"),popState:l(function(){var d=this.conditionStack.
length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.
conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.
length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(d){return d=this.conditionStack.length-
1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},"topState"),pushState:l(function(d){this.begin(d)},"pushState"),
stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(
function(d,m,u,C){switch(u){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_ti\
tle"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),
"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_mu\
ltiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin(
"href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();
break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:
this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:
return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:
return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:
return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:
return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,
/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,
/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,
/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,
/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,
/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,
/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,
/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,
/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,
/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{
rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[
15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,
31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return p})();f.lexer=T;function v(){this.
yy={}}return l(v,"Parser"),v.prototype=f,f.Parser=v,new v})();Lt.parser=Lt;var kr=Lt;U.extend(rr);U.extend(ar);U.extend(
ur);var ce={friday:5,saturday:6},et="",Vt="",Rt=void 0,zt="",ht=[],mt=[],Nt=new Map,Ht=[],Mt=[],kt="",Bt="",fe=["active",
"done","crit","milestone","vert"],qt=[],ut="",gt=!1,Gt=!1,jt="sunday",Et="saturday",Ot=0,yr=l(function(){Ht=[],Mt=[],kt=
"",qt=[],St=0,Pt=void 0,Ct=void 0,X=[],et="",Vt="",Bt="",Rt=void 0,zt="",ht=[],mt=[],gt=!1,Gt=!1,Ot=0,Nt=new Map,ut="",$e(),
jt="sunday",Et="saturday"},"clear"),gr=l(function(t){ut=t},"setDiagramId"),pr=l(function(t){Vt=t},"setAxisFormat"),vr=l(
function(){return Vt},"getAxisFormat"),xr=l(function(t){Rt=t},"setTickInterval"),Tr=l(function(){return Rt},"getTickInte\
rval"),br=l(function(t){zt=t},"setTodayMarker"),wr=l(function(){return zt},"getTodayMarker"),_r=l(function(t){et=t},"set\
DateFormat"),Dr=l(function(){gt=!0},"enableInclusiveEndDates"),Sr=l(function(){return gt},"endDatesAreInclusive"),Cr=l(function(){
Gt=!0},"enableTopAxis"),Mr=l(function(){return Gt},"topAxisEnabled"),Er=l(function(t){Bt=t},"setDisplayMode"),Ir=l(function(){
return Bt},"getDisplayMode"),$r=l(function(){return et},"getDateFormat"),he=l((t,e)=>{const s=e.toLowerCase().split(/[\s,]+/).
filter(r=>r!=="");return[...new Set([...t,...s])]},"mergeTokens"),Ar=l(function(t){ht=he(ht,t)},"setIncludes"),Yr=l(function(){
return ht},"getIncludes"),Fr=l(function(t){mt=he(mt,t)},"setExcludes"),Lr=l(function(){return mt},"getExcludes"),Or=l(function(){
return Nt},"getLinks"),Wr=l(function(t){kt=t,Ht.push(t)},"addSection"),Pr=l(function(){return Ht},"getSections"),Vr=l(function(){
let t=le();const e=10;let s=0;for(;!t&&s<e;)t=le(),s++;return Mt=X,Mt},"getTasks"),me=l(function(t,e,s,r){const i=t.format(
e.trim()),g=t.format("YYYY-MM-DD");return r.includes(i)||r.includes(g)?!1:s.includes("weekends")&&(t.isoWeekday()===ce[Et]||
t.isoWeekday()===ce[Et]+1)||s.includes(t.format("dddd").toLowerCase())?!0:s.includes(i)||s.includes(g)},"isInvalidDate"),
Rr=l(function(t){jt=t},"setWeekday"),zr=l(function(){return jt},"getWeekday"),Nr=l(function(t){Et=t},"setWeekend"),ke=l(
function(t,e,s,r){if(!s.length||t.manualEndTime)return;let i;t.startTime instanceof Date?i=U(t.startTime):i=U(t.startTime,
e,!0),i=i.add(1,"d");let g;t.endTime instanceof Date?g=U(t.endTime):g=U(t.endTime,e,!0);const[y,b]=Hr(i,g,e,s,r);t.endTime=
y.toDate(),t.renderEndTime=b},"checkTaskDates"),Hr=l(function(t,e,s,r,i){let g=!1,y=null;const b=e.add(1e4,"d");for(;t<=
e;){if(g||(y=e.toDate()),g=me(t,s,r,i),g&&(e=e.add(1,"d"),e>b))throw new Error("Failed to find a valid date that was not\
 excluded by `excludes` after 10,000 iterations.");t=t.add(1,"d")}return[e,y]},"fixTaskDates"),ye=l(function(t,e){st.warn(
`Gantt: the "${t}" statement references unknown task id(s): ${e.join(", ")}. Make sure the referenced tasks exist and de\
clare an id. Milestones need both an id and a duration, e.g. "Milestone :milestone, m1, 2023-01-01, 0d".`)},"warnAboutUn\
knownTaskIds"),Wt=l(function(t,e,s){if(s=s.trim(),l(b=>{const S=b.trim();return S==="x"||S==="X"},"isTimestampFormat")(e)&&
/^\d+$/.test(s))return new Date(Number(s));const g=/^after\s+(?<ids>[\d\w- ]+)/.exec(s);if(g!==null){let b=null;const S=[],
L=g.groups.ids.split(" ").filter(W=>W!=="");for(const W of L){const w=ct(W);if(w===void 0){S.push(W);continue}(!b||w.endTime>
b.endTime)&&(b=w)}if(S.length>0&&ye("after",S),b)return b.endTime;const _=new Date;return _.setHours(0,0,0,0),_}let y=U(
s,e.trim(),!0);if(y.isValid())return y.toDate();{st.debug("Invalid date:"+s),st.debug("With date format:"+e.trim());const b=new Date(
s);if(b===void 0||isNaN(b.getTime())||b.getFullYear()<-1e4||b.getFullYear()>1e4)throw new Error("Invalid date:"+s);return b}},
"getStartDate"),ge=l(function(t){const e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return e!==null?[Number.parseFloat(
e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),pe=l(function(t,e,s,r=!1){s=s.trim();const g=/^until\s+(?<ids>[\d\w- ]+)/.exec(
s);if(g!==null){let _=null;const W=[],w=g.groups.ids.split(" ").filter(N=>N!=="");for(const N of w){const V=ct(N);if(V===
void 0){W.push(N);continue}(!_||V.startTime<_.startTime)&&(_=V)}if(W.length>0&&ye("until",W),_)return _.startTime;const D=new Date;
return D.setHours(0,0,0,0),D}let y=U(s,e.trim(),!0);if(y.isValid())return r&&(y=y.add(1,"d")),y.toDate();let b=U(t);const[
S,L]=ge(s);if(Number.isNaN(S))st.warn(`Gantt: "${s}" is neither a valid date for the "${e.trim()}" date format nor a val\
id duration (e.g. "3d"), so it is ignored and the task gets a zero duration. Milestones need a duration too, e.g. "Miles\
tone :milestone, m1, 2023-01-01, 0d".`);else{const _=b.add(S,L);_.isValid()&&(b=_)}return b.toDate()},"getEndDate"),St=0,
ft=l(function(t){return t===void 0?(St=St+1,"task"+St):t},"parseId"),Br=l(function(t,e){let s;e.substr(0,1)===":"?s=e.substr(
1,e.length):s=e;const r=s.split(","),i={};Xt(r,i,fe);for(let y=0;y<r.length;y++)r[y]=r[y].trim();let g="";switch(r.length){case 1:
i.id=ft(),i.startTime=t.endTime,g=r[0];break;case 2:i.id=ft(),i.startTime=Wt(void 0,et,r[0]),g=r[1];break;case 3:i.id=ft(
r[0]),i.startTime=Wt(void 0,et,r[1]),g=r[2];break}return g&&(i.endTime=pe(i.startTime,et,g,gt),i.manualEndTime=U(g,"YYYY\
-MM-DD",!0).isValid(),ke(i,et,mt,ht)),i},"compileData"),qr=l(function(t,e){let s;e.substr(0,1)===":"?s=e.substr(1,e.length):
s=e;const r=s.split(","),i={};Xt(r,i,fe);for(let g=0;g<r.length;g++)r[g]=r[g].trim();switch(r.length){case 1:i.id=ft(),i.
startTime={type:"prevTaskEnd",id:t},i.endTime={data:r[0]};break;case 2:i.id=ft(),i.startTime={type:"getStartDate",startData:r[0]},
i.endTime={data:r[1]};break;case 3:i.id=ft(r[0]),i.startTime={type:"getStartDate",startData:r[1]},i.endTime={data:r[2]};
break}return i},"parseData"),Pt,Ct,X=[],ve={},Gr=l(function(t,e){const s={section:kt,type:kt,processed:!1,manualEndTime:!1,
renderEndTime:null,raw:{data:e},task:t,classes:[]},r=qr(Ct,e);s.raw.startTime=r.startTime,s.raw.endTime=r.endTime,s.id=r.
id,s.prevTaskId=Ct,s.active=r.active,s.done=r.done,s.crit=r.crit,s.milestone=r.milestone,s.vert=r.vert,s.vert?s.order=-1:
(s.order=Ot,Ot++);const i=X.push(s);Ct=s.id,ve[s.id]=i-1},"addTask"),ct=l(function(t){const e=ve[t];return X[e]},"findTa\
skById"),jr=l(function(t,e){const s={section:kt,type:kt,description:t,task:t,classes:[]},r=Br(Pt,e);s.startTime=r.startTime,
s.endTime=r.endTime,s.id=r.id,s.active=r.active,s.done=r.done,s.crit=r.crit,s.milestone=r.milestone,s.vert=r.vert,Pt=s,Mt.
push(s)},"addTaskOrg"),le=l(function(){const t=l(function(s){const r=X[s];let i="";switch(X[s].raw.startTime.type){case"\
prevTaskEnd":{const g=ct(r.prevTaskId);r.startTime=g.endTime;break}case"getStartDate":i=Wt(void 0,et,X[s].raw.startTime.
startData),i&&(X[s].startTime=i);break}return X[s].startTime&&(X[s].endTime=pe(X[s].startTime,et,X[s].raw.endTime.data,gt),
X[s].endTime&&(X[s].processed=!0,X[s].manualEndTime=U(X[s].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),ke(X[s],et,mt,ht))),
X[s].processed},"compileTask");let e=!0;for(const[s,r]of X.entries())t(s),e=e&&r.processed;return e},"compileTasks"),Xr=l(
function(t,e){let s=e;dt().securityLevel!=="loose"&&(s=Ie.sanitizeUrl(e)),t.split(",").forEach(function(r){ct(r)!==void 0&&
(Te(r,()=>{window.open(s,"_self")}),Nt.set(r,s))}),xe(t,"clickable")},"setLink"),xe=l(function(t,e){t.split(",").forEach(
function(s){let r=ct(s);r!==void 0&&r.classes.push(e)})},"setClass"),Ur=l(function(t,e,s){if(dt().securityLevel!=="loose"||
e===void 0)return;let r=[];if(typeof s=="string"){r=s.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let g=0;g<r.length;g++){
let y=r[g].trim();y.startsWith('"')&&y.endsWith('"')&&(y=y.substr(1,y.length-2)),r[g]=y}}r.length===0&&r.push(t),ct(t)!==
void 0&&Te(t,()=>{Ae.runFunc(e,...r)})},"setClickFun"),Te=l(function(t,e){qt.push(function(){const s=ut?`${ut}-${t}`:t,r=document.
querySelector(`[id="${s}"]`);r!==null&&r.addEventListener("click",function(){e()})},function(){const s=ut?`${ut}-${t}`:t,
r=document.querySelector(`[id="${s}-text"]`);r!==null&&r.addEventListener("click",function(){e()})})},"pushFun"),Zr=l(function(t,e,s){
t.split(",").forEach(function(r){Ur(r,e,s)}),xe(t,"clickable")},"setClickEvent"),Qr=l(function(t){qt.forEach(function(e){
e(t)})},"bindFunctions"),Jr={getConfig:l(()=>dt().gantt,"getConfig"),clear:yr,setDateFormat:_r,getDateFormat:$r,enableInclusiveEndDates:Dr,
endDatesAreInclusive:Sr,enableTopAxis:Cr,topAxisEnabled:Mr,setAxisFormat:pr,getAxisFormat:vr,setTickInterval:xr,getTickInterval:Tr,
setTodayMarker:br,getTodayMarker:wr,setAccTitle:Ce,getAccTitle:Se,setDiagramTitle:De,getDiagramTitle:_e,setDiagramId:gr,
setDisplayMode:Er,getDisplayMode:Ir,setAccDescription:we,getAccDescription:be,addSection:Wr,getSections:Pr,getTasks:Vr,addTask:Gr,
findTaskById:ct,addTaskOrg:jr,setIncludes:Ar,getIncludes:Yr,setExcludes:Fr,getExcludes:Lr,setClickEvent:Zr,setLink:Xr,getLinks:Or,
bindFunctions:Qr,parseDuration:ge,isInvalidDate:me,setWeekday:Rr,getWeekday:zr,setWeekend:Nr};function Xt(t,e,s){let r=!0;
for(;r;)r=!1,s.forEach(function(i){const g="^\\s*"+i+"\\s*$",y=new RegExp(g);t[0].match(y)&&(e[i]=!0,t.shift(1),r=!0)})}
l(Xt,"getTaskTags");U.extend(mr);var Kr=l(function(){st.debug("Something is calling, setConf, remove the call")},"setCon\
f"),ue={monday:He,tuesday:Ne,wednesday:ze,thursday:Re,friday:Ve,saturday:Pe,sunday:We},ts=l((t,e)=>{let s=[...t].map(()=>-1/0),
r=[...t].sort((g,y)=>g.startTime-y.startTime||g.order-y.order),i=0;for(const g of r)for(let y=0;y<s.length;y++)if(g.startTime>=
s[y]){s[y]=g.endTime,g.order=y+e,y>i&&(i=y);break}return i},"getMaxIntersections"),rt,Yt=1e4,es=l(function(t,e,s,r){const i=dt().
gantt;r.db.setDiagramId(e);const g=dt().securityLevel;let y;g==="sandbox"&&(y=vt("#i"+e));const b=g==="sandbox"?vt(y.nodes()[0].
contentDocument.body):vt("body"),S=g==="sandbox"?y.nodes()[0].contentDocument:document,L=S.getElementById(e);rt=L.parentElement.
offsetWidth,rt===void 0&&(rt=1200),i.useWidth!==void 0&&(rt=i.useWidth);const _=r.db.getTasks(),W=_.filter(f=>!f.vert);let w=[];
for(const f of W)w.push(f.type);w=E(w);const D={};let N=2*i.topPadding;if(r.db.getDisplayMode()==="compact"||i.displayMode===
"compact"){const f={};for(const v of W)f[v.section]===void 0?f[v.section]=[v]:f[v.section].push(v);let T=0;for(const v of Object.
keys(f)){const p=ts(f[v],T)+1;T+=p,N+=p*(i.barHeight+i.barGap),D[v]=p}}else{N+=W.length*(i.barHeight+i.barGap);for(const f of w)
D[f]=W.filter(T=>T.type===f).length}L.setAttribute("viewBox","0 0 "+rt+" "+N);const V=b.select(`[id="${e}"]`),k=Ye().domain(
[Fe(_,function(f){return f.startTime}),Le(_,function(f){return f.endTime})]).rangeRound([0,rt-i.leftPadding-i.rightPadding]);
function M(f,T){const v=f.startTime,p=T.startTime;let a=0;return v>p?a=1:v<p&&(a=-1),a}l(M,"taskCompare"),_.sort(M),P(_,
rt,N),Me(V,N,rt,i.useMaxWidth),V.append("text").text(r.db.getDiagramTitle()).attr("x",rt/2).attr("y",i.titleTopMargin).attr(
"class","titleText");function P(f,T,v){const p=i.barHeight,a=p+i.barGap,d=i.topPadding,m=i.leftPadding,u=Oe().domain([0,
w.length]).range(["#00B9FA","#F95002"]).interpolate(Be);B(a,d,m,T,v,f,r.db.getExcludes(),r.db.getIncludes()),I(m,d,T,v),
O(f,a,d,m,p,u,T),x(a,d),h(m,d,T,v)}l(P,"makeGantt");function O(f,T,v,p,a,d,m){f.sort((c,A)=>c.vert===A.vert?0:c.vert?1:-1);
const u=f.filter(c=>!c.vert),n=[...new Set(u.map(c=>c.order))].map(c=>u.find(A=>A.order===c));V.append("g").selectAll("r\
ect").data(n).enter().append("rect").attr("x",0).attr("y",function(c,A){return A=c.order,A*T+v-2}).attr("width",function(){
return m-i.rightPadding/2}).attr("height",T).attr("class",function(c){for(const[A,Y]of w.entries())if(c.type===Y)return"\
section section"+A%i.numberSectionStyles;return"section section0"}).enter();const $=V.append("g").selectAll("rect").data(
f).enter(),o=r.db.getLinks();if($.append("rect").attr("id",function(c){return e+"-"+c.id}).attr("rx",3).attr("ry",3).attr(
"x",function(c){return c.milestone?k(c.startTime)+p+.5*(k(c.endTime)-k(c.startTime))-.5*a:k(c.startTime)+p}).attr("y",function(c,A){
return A=c.order,c.vert?i.gridLineStartPadding:A*T+v}).attr("width",function(c){return c.milestone?a:c.vert?.08*a:k(c.renderEndTime||
c.endTime)-k(c.startTime)}).attr("height",function(c){return c.vert?u.length*(i.barHeight+i.barGap)+i.barHeight*2:a}).attr(
"transform-origin",function(c,A){return A=c.order,(k(c.startTime)+p+.5*(k(c.endTime)-k(c.startTime))).toString()+"px "+(A*
T+v+.5*a).toString()+"px"}).attr("class",function(c){const A="task";let Y="";c.classes.length>0&&(Y=c.classes.join(" "));
let z=0;for(const[q,R]of w.entries())c.type===R&&(z=q%i.numberSectionStyles);let F="";return c.active?c.crit?F+=" active\
Crit":F=" active":c.done?c.crit?F=" doneCrit":F=" done":c.crit&&(F+=" crit"),F.length===0&&(F=" task"),c.milestone&&(F="\
 milestone "+F),c.vert&&(F=" vert "+F),F+=z,F+=" "+Y,A+F}),$.append("text").attr("id",function(c){return e+"-"+c.id+"-te\
xt"}).text(function(c){return c.task}).attr("font-size",i.fontSize).attr("x",function(c){let A=k(c.startTime),Y=k(c.renderEndTime||
c.endTime);if(c.milestone&&(A+=.5*(k(c.endTime)-k(c.startTime))-.5*a,Y=A+a),c.vert)return k(c.startTime)+p;const z=this.
getBBox().width;return z>Y-A?Y+z+1.5*i.leftPadding>m?A+p-5:Y+p+5:(Y-A)/2+A+p}).attr("y",function(c,A){return c.vert?i.gridLineStartPadding+
u.length*(i.barHeight+i.barGap)+60:(A=c.order,A*T+i.barHeight/2+(i.fontSize/2-2)+v)}).attr("text-height",a).attr("class",
function(c){const A=k(c.startTime);let Y=k(c.endTime);c.milestone&&(Y=A+a);const z=this.getBBox().width;let F="";c.classes.
length>0&&(F=c.classes.join(" "));let q=0;for(const[nt,at]of w.entries())c.type===at&&(q=nt%i.numberSectionStyles);let R="";
return c.active&&(c.crit?R="activeCritText"+q:R="activeText"+q),c.done?c.crit?R=R+" doneCritText"+q:R=R+" doneText"+q:c.
crit&&(R=R+" critText"+q),c.milestone&&(R+=" milestoneText"),c.vert&&(R+=" vertText"),z>Y-A?Y+z+1.5*i.leftPadding>m?F+" \
taskTextOutsideLeft taskTextOutside"+q+" "+R:F+" taskTextOutsideRight taskTextOutside"+q+" "+R+" width-"+z:F+" taskText \
taskText"+q+" "+R+" width-"+z}),dt().securityLevel==="sandbox"){let c;c=vt("#i"+e);const A=c.nodes()[0].contentDocument;
$.filter(function(Y){return o.has(Y.id)}).each(function(Y){var z=A.querySelector("#"+CSS.escape(e+"-"+Y.id)),F=A.querySelector(
"#"+CSS.escape(e+"-"+Y.id+"-text"));const q=z.parentNode;var R=A.createElement("a");R.setAttribute("xlink:href",o.get(Y.
id)),R.setAttribute("target","_top"),q.appendChild(R),R.appendChild(z),R.appendChild(F)})}}l(O,"drawRects");function B(f,T,v,p,a,d,m,u){
if(m.length===0&&u.length===0)return;let C,n;for(const{startTime:Y,endTime:z}of d)(C===void 0||Y<C)&&(C=Y),(n===void 0||
z>n)&&(n=z);if(!C||!n)return;if(U(n).diff(U(C),"year")>5){st.warn("The difference between the min and max time is more t\
han 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const $=r.db.getDateFormat(),o=[];
let G=null,c=U(C);for(;c.valueOf()<=n;)r.db.isInvalidDate(c,$,m,u)?G?G.end=c:G={start:c,end:c}:G&&(o.push(G),G=null),c=c.
add(1,"d");V.append("g").selectAll("rect").data(o).enter().append("rect").attr("id",Y=>e+"-exclude-"+Y.start.format("YYY\
Y-MM-DD")).attr("x",Y=>k(Y.start.startOf("day"))+v).attr("y",i.gridLineStartPadding).attr("width",Y=>k(Y.end.endOf("day"))-
k(Y.start.startOf("day"))).attr("height",a-T-i.gridLineStartPadding).attr("transform-origin",function(Y,z){return(k(Y.start)+
v+.5*(k(Y.end)-k(Y.start))).toString()+"px "+(z*f+.5*a).toString()+"px"}).attr("class","exclude-range")}l(B,"drawExclude\
Days");function H(f,T,v,p){if(v<=0||f>T)return 1/0;const a=T-f,d=U.duration({[p??"day"]:v}).asMilliseconds();return d<=0?
1/0:Math.ceil(a/d)}l(H,"getEstimatedTickCount");function I(f,T,v,p){const a=r.db.getDateFormat(),d=r.db.getAxisFormat();
let m;d?m=d:a==="D"?m="%d":m=i.axisFormat??"%Y-%m-%d";let u=Je(k).tickSize(-p+T+i.gridLineStartPadding).tickFormat(Zt(m));
const n=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||i.tickInterval);if(n!==
null){const $=parseInt(n[1],10);if(isNaN($)||$<=0)st.warn(`Invalid tick interval value: "${n[1]}". Skipping custom tick \
interval.`);else{const o=n[2],G=r.db.getWeekday()||i.weekday,c=k.domain(),A=c[0],Y=c[1],z=H(A,Y,$,o);if(z>Yt)st.warn(`Th\
e tick interval "${$}${o}" would generate ${z} ticks, which exceeds the maximum allowed (${Yt}). This may indicate an in\
valid date or time range. Skipping custom tick interval.`);else switch(o){case"millisecond":u.ticks(re.every($));break;case"\
second":u.ticks(ee.every($));break;case"minute":u.ticks(te.every($));break;case"hour":u.ticks(Kt.every($));break;case"da\
y":u.ticks(Jt.every($));break;case"week":u.ticks(ue[G].every($));break;case"month":u.ticks(Qt.every($));break}}}if(V.append(
"g").attr("class","grid").attr("transform","translate("+f+", "+(p-50)+")").call(u).selectAll("text").style("text-anchor",
"middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||i.topAxis){
let $=Qe(k).tickSize(-p+T+i.gridLineStartPadding).tickFormat(Zt(m));if(n!==null){const o=parseInt(n[1],10);if(isNaN(o)||
o<=0)st.warn(`Invalid tick interval value: "${n[1]}". Skipping custom tick interval.`);else{const G=n[2],c=r.db.getWeekday()||
i.weekday,A=k.domain(),Y=A[0],z=A[1];if(H(Y,z,o,G)<=Yt)switch(G){case"millisecond":$.ticks(re.every(o));break;case"secon\
d":$.ticks(ee.every(o));break;case"minute":$.ticks(te.every(o));break;case"hour":$.ticks(Kt.every(o));break;case"day":$.
ticks(Jt.every(o));break;case"week":$.ticks(ue[c].every(o));break;case"month":$.ticks(Qt.every(o));break}}}V.append("g").
attr("class","grid").attr("transform","translate("+f+", "+T+")").call($).selectAll("text").style("text-anchor","middle").
attr("fill","#000").attr("stroke","none").attr("font-size",10)}}l(I,"makeGrid");function x(f,T){let v=0;const p=Object.keys(
D).map(a=>[a,D[a]]);V.append("g").selectAll("text").data(p).enter().append(function(a){const d=a[0].split(Ee.lineBreakRegex),
m=-(d.length-1)/2,u=S.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("dy",m+"em");for(const[C,n]of d.
entries()){const $=S.createElementNS("http://www.w3.org/2000/svg","tspan");$.setAttribute("alignment-baseline","central"),
$.setAttribute("x","10"),C>0&&$.setAttribute("dy","1em"),$.textContent=n,u.appendChild($)}return u}).attr("x",10).attr("\
y",function(a,d){if(d>0)for(let m=0;m<d;m++)return v+=p[d-1][1],a[1]*f/2+v*f+T;else return a[1]*f/2+T}).attr("font-size",
i.sectionFontSize).attr("class",function(a){for(const[d,m]of w.entries())if(a[0]===m)return"sectionTitle sectionTitle"+d%
i.numberSectionStyles;return"sectionTitle"})}l(x,"vertLabels");function h(f,T,v,p){const a=r.db.getTodayMarker();if(a===
"off")return;const d=V.append("g").attr("class","today"),m=new Date,u=d.append("line");u.attr("x1",k(m)+f).attr("x2",k(m)+
f).attr("y1",i.titleTopMargin).attr("y2",p-i.titleTopMargin).attr("class","today"),a!==""&&u.attr("style",a.replace(/,/g,
";"))}l(h,"drawToday");function E(f){const T={},v=[];for(let p=0,a=f.length;p<a;++p)Object.prototype.hasOwnProperty.call(
T,f[p])||(T[f[p]]=!0,v.push(f[p]));return v}l(E,"checkUnique")},"draw"),rs={setConf:Kr,draw:es},ss=l(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done-crit task text outside the bar — same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles"),ns=ss,ls={parser:kr,db:Jr,renderer:rs,styles:ns};export{ls as diagram};
