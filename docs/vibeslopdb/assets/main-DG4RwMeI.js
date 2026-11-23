import{c3 as ke,c4 as ys,c5 as bs,c6 as or,c7 as Di,c8 as ks,c9 as fo,ca as Is,cb as xs,cc as sr,cd as Rs,bf as po,bb as Ms,
bc as ot,bd as Ss,bh as Os,bj as Es,be as Ts,bi as Cs,bk as zs,bg as $s}from"./carnageWindow-Ta-Zfo9P.js";import"./preload-helper-FD8EeCEm.js";
let yt,Gt=0;async function wo(i,e,t){for(;Gt!==0;)await Promise.resolve();++Gt,yt=i;try{t.call(e)}catch(n){throw Gt=0,n}
yt=void 0,--Gt}function mo(i,e=i){for(const t of e)"dependencies"in t?(i.delete(t),mo(i,t.dependencies)):i.add(t)}const it=Symbol(
"reactive"),bt=Symbol("original_ref"),Ft=Symbol("connected_signal");function As(i){return i instanceof Object&&it in i}function Ws(i,e,t=!1){
Object.defineProperties(i,{[it]:{value:!0},[bt]:{value:i},[Ft]:{value:e}});const n=i.set.bind(i);let r;t?r=function(l,u){
const h=i.get(l);return n(l,u),u!==h&&e.propagate(),i}:r=function(l,u){const{size:h}=i;return n(l,u),i.size>h&&e.propagate(),
i};const o=i.delete.bind(i);function s(d){const l=o(d);return l&&e.propagate(),l}const a=i.clear.bind(i);function c(){const{
size:d}=i;a(),d>0&&e.propagate()}return Object.defineProperties(i,{set:{value:r},delete:{value:s},clear:{value:c}}),i}function Ps(i,e){
Object.defineProperties(i,{[it]:{value:!0},[bt]:{value:i},[Ft]:{value:e}});const t=i.add.bind(i);function n(c){const{size:d}=i;
return t(c),i.size>d&&e.propagate(),i}const r=i.delete.bind(i);function o(c){const d=r(c);return d&&e.propagate(),d}const s=i.
clear.bind(i);function a(){const{size:c}=i;s(),c>0&&e.propagate()}return Object.defineProperties(i,{add:{value:n},delete:{
value:o},clear:{value:a}}),i}function Ns(i,e,t=!1){if(Object.defineProperties(i,{[it]:{value:!0},[bt]:{value:i},[Ft]:{value:e}}),
t)return Qe(i,e,!0);const n=i.push.bind(i);function r(...f){const p=n(...f);return p>0&&e.propagate(),p}const o=i.pop.bind(
i);function s(){const{length:f}=i,p=o();return f>0&&e.propagate(),p}const a=i.splice.bind(i);function c(f,p,...w){const g=a(
f,p,...w);return(g.length>0||w.length>0)&&e.propagate(),g}const d=Array.prototype.sort.bind(i);function l(f){const p=d(f);
return e.propagate(),p}const u=Array.prototype.reverse.bind(i);function h(){const f=u();return e.propagate(),f}return Object.
defineProperties(i,{push:{value:r},pop:{value:s},splice:{value:c},sort:{value:l},reverse:{value:h}}),i}function Qe(i,e,t=!1){
if(typeof i!="object")throw new Error("parameter object needs to be typeof 'object'");if(Array.isArray(i)){if(Ns(i,e),!t)
return i}else As(i)||Object.defineProperties(i,{[it]:{value:!0},[bt]:{value:i},[Ft]:{value:e}});if(t){const r={set(o,s,a){
return o[s]!==(o[s]=a)&&e.propagate(),!0}};return new Proxy(i,r)}const n={};Object.defineProperties(n,{[it]:{value:!0},[bt]:{
value:i},[Ft]:{value:e}});for(const r in i)Object.defineProperty(n,r,{enumerable:!0,get(){return i[r]},set(o){i[r]!==(i[r]=
o)&&e.propagate()}});return n}class js extends Error{constructor(){super("You can only deeply observe value with typeof \
'object'")}}class Bs extends Error{path;constructor(e){super(`Recursive signal propagation detected: ${e.join(" -> ")}`),
this.name="SignalRecursiveUpdateError",this.path=[...e]}}const Ls=32,Ot=new Map,Fi=[];class Ie{$value;dependants;subscriptions;whenSubscriptions;forceUpdateValue;disposed=!1;constructor(e,t){
if(t?.deepObserve){if(typeof e!="object")throw new js;e instanceof Set?e=Ps(e,this):e instanceof Map?e=Ws(e,this,t.watchMapUpdates):
e=Qe(e,this,t.watchObjectIndex)}this.$value=e}when(e,t,n){this.whenSubscriptions??=new Map;const{whenSubscriptions:r}=this;
let o=r.get(e);o?o.add(t):(o=new Set().add(t),r.set(e,o)),n?.addEventListener("abort",()=>{o?.delete(t)})}drop(e,t){this.
whenSubscriptions?.get(e)?.delete(t)}subscribe(e,t){this.subscriptions??=new Set,this.subscriptions.add(e),t?.addEventListener(
"abort",()=>{this.subscriptions?.delete(e)})}unsubscribe(e){this.subscriptions?.delete(e)}inspect(){return{disposed:this.
disposed,subscriptions:this.subscriptions?.size??0,whenSubscriptions:[...this.whenSubscriptions?.values()??[]].reduce((e,t)=>e+
t.size,0),dependants:this.dependants?.size??0,reactive:typeof this.$value=="object"&&this.$value!==null&&it in this.$value}}depend(e){
this.dependants??=new Set,this.dependants.add(e)}propagate(e){const t=Ds(this),{subscriptions:n,whenSubscriptions:r,dependants:o}=this;
try{const s=this.$value;if(n?.size)for(const c of n)c(s);const a=r?.get(s);if(a)for(const c of a)c(s);if(!o?.size)return;
for(const c of o)"forceUpdateValue"in c&&(c.forceUpdateValue=!0),c.update(e??this)}finally{t()}}dispose(){let{$value:e}=this;
this.disposed=!0,typeof e=="object"&&e!==null&&(e=e?.[bt]??e),this.$value=e,Object.defineProperty(this,"value",{value:e});
const{dependants:t,subscriptions:n,whenSubscriptions:r}=this;if(n?.clear(),r?.clear(),!!t)for(const o of[...t])t.delete(
o),o.dependencies.delete(this),o.dependencies||o.dispose()}get value(){return yt?.add(this),this.$value}set value(e){yt?.
add(this),(this.$value!==(this.$value=e)||this.forceUpdateValue)&&this.propagate()}peek(){return this.$value}jink(e){this.
$value=e}valueOf(){return this.$value}toString(){return`${this.$value}`}}function Ds(i){const e=Ot.get(i)??0;if(e>=Ls)throw new Bs(
[...Fi,i].map(Fs));return Ot.set(i,e+1),Fi.push(i),()=>{Fi.pop();const t=(Ot.get(i)??1)-1;t<=0?Ot.delete(i):Ot.set(i,t)}}
function Fs(i){return i.constructor?.name||"unknown"}class ar extends Error{constructor(){super("Computed is read-only, \
you can't (and shouldn't!) directly modify its value")}}class Hs extends Ie{computable;dependencies;constructor(e){super(
void 0);const t=e(this);super.value=t,this.computable=e,this.dependencies=new Set,wo(this.dependencies,this,e).then(()=>{
for(const n of this.dependencies)n.depend(this)})}get value(){return yt?.add(this),this.$value}set value(e){throw new ar}jink(e){
throw new ar}update(e){yt?.add(this),(this.$value!==(this.$value=this.computable(e))||this.forceUpdateValue)&&this.propagate(
e)}dispose(){super.dispose();const{dependencies:e}=this;for(const t of[...e])t.dependants?.delete(this),e.delete(t)}}class _s extends Error{constructor(){
super("Cannot update an effect while it is paused."),this.name="EffectPausedUpdateError"}}class qs{$effectable;dependencies;paused;constructor(e){
this.$effectable=e,this.dependencies=new Set,this.paused=!1,wo(this.dependencies,this,e).then(()=>{for(const t of this.dependencies)
t.dependants?.delete(this);if(mo(this.dependencies),!this.paused)for(const t of this.dependencies)t.depend(this)})}update(e){
if(this.paused)throw new _s;this.$effectable(e)}dispose(){const{dependencies:e}=this;for(const t of e)t.dependants?.delete(
this);e.clear()}pause(){this.paused=!0;for(const e of this.dependencies)e.dependants?.delete(this)}resume(){this.paused=
!1;for(const e of this.dependencies)e.depend(this)}}function go(i){return i instanceof Error?i.message:String(i)}function Us(i){
return i===" "||i===`
`||i==="	"||i==="\r"||i==="\f"}class vo{listeners={};on(e,t,n){let r=this.listeners[e];if(r||(r=[],this.listeners[e]=r),
n){const o=t;t=(...s)=>{o.apply(this,s),this.off(e,t)}}return r.includes(t)?()=>this.off(e,t):(r.splice(r.length,0,t),()=>this.
off(e,t))}once(e,t){return this.on(e,t,!0)}off(e,t){if(!e){this.listeners={};return}if(!t){this.listeners[e]=[];return}const n=this.
listeners[e];if(!n)return;const r=n.indexOf(t);r<0||n.splice(r,1)}emit(e,...t){const n=this.listeners[e];if(n?.length)for(const r of n)
r.apply(this,t)}listenerCount(e){if(e!==void 0)return this.listeners[e]?.length??0;let t=0;for(const n in this.listeners)
t+=this.listeners[n]?.length??0;return t}eventNames(){const e=[];for(const t in this.listeners)(this.listeners[t]?.length??
0)>0&&e.push(t);return e}inspect(){const e=[];let t=0;for(const n in this.listeners){const r=this.listeners[n]?.length??
0;r<=0||(t+=r,e.push({type:n,listenerCount:r}))}return e.sort((n,r)=>n.type.localeCompare(r.type)),{eventCount:e.length,
listenerCount:t,events:e}}}class Gs extends Array{compareFn;constructor(e,...t){super(...t),this.compareFn=e}push(...e){
return super.push(...e),this.sort(this.compareFn),this.length}remove(...e){for(const t of e){const n=this.indexOf(t);n>=
0&&this.splice(n,1)}return this.length}}function cr(i,e,t){return t.width!==0&&t.height!==0&&i>=t.column&&i<t.column+t.width&&
e>=t.row&&e<t.row+t.height}function Ln(i,e){return i===e||i.column===e.column&&i.row===e.row&&i.width===e.width&&i.height===
e.height}const Et={column:0,row:0,width:0,height:0};function bi(i,e,t){const{column:n,row:r,width:o,height:s}=i,{column:a,
row:c,width:d,height:l}=e;if(n>=a+d||a>=n+o||r>=c+l||c>=r+s)return!1;if(!t)return!0;const u=Math.min(n+o,a+d),h=Math.min(
r+s,c+l),f=Math.max(0,u-Math.max(n,a));if(f===0)return!1;const p=Math.max(0,h-Math.max(r,c));return p===0?!1:(Et.column=
u-f,Et.row=h-p,Et.width=f,Et.height=p,Et)}function Fe(i,e){return i instanceof Ie?i:new Ie(i,e)}function Vs(i,e,t,n,r,o){
const s=Xs(e,t,n,r,o);if(!s)return Ks(e);const a=i[s.row]??=new Set,c=a.size;for(let d=s.startColumn;d<s.endColumn;d+=1)
a.add(d);return{row:s.row,startColumn:s.startColumn,endColumn:s.endColumn,queuedCells:a.size-c}}function Ks(i){return{row:i,
startColumn:0,endColumn:0,queuedCells:0}}function Xs(i,e,t,n,r){if(i<0||i>=n.rows)return;let o=Math.max(0,Math.floor(e)),
s=Math.min(n.columns,Math.ceil(t));if(r){if(i<r.row||i>=r.row+r.height)return;o=Math.max(o,r.column),s=Math.min(s,r.column+
r.width)}if(!(s<=o))return{row:i,startColumn:o,endColumn:s}}let Ys=0;class Js{id;type;canvas;style;zIndex;view;viewOffset;rectangle;previousRectangle;objectsUnder;omitCells;rerenderCells;rendered;outOfBounds;updated;moved;#e;#t;#i;#o;#n;#s;#r;constructor(e,t){
this.id=Ys++,this.type=e,this.canvas=t.canvas,this.viewOffset={columns:0,rows:0},this.omitCells=[],this.rerenderCells=[],
this.objectsUnder=new Set,this.rendered=!1,this.outOfBounds=!1,this.canvas.updateObjects.push(this),this.updated=!0,this.
moved=!0,this.view=Fe(t.view),this.zIndex=Fe(t.zIndex),this.style=Fe(t.style);const{updateObjects:n}=this.canvas;this.#e=
()=>{this.rendered=!1,this.updated=!1,n.push(this);for(const r of this.objectsUnder)r.updated=!1,n.push(r)},this.#t=()=>{
this.canvas.resortDrawnObjects(),this.previousRectangle=void 0,this.moved=!0,this.updated=!1,n.push(this)},this.#i=r=>this.#a(
r),this.#o=()=>this.#d(),this.#n=()=>this.#d(),this.#s=()=>this.#u(),this.view.subscribe(this.#i),queueMicrotask(()=>this.#a(
this.view.peek()))}draw(){this.style.subscribe(this.#e),this.zIndex.subscribe(this.#t),this.rendered=!1;const{objectsUnder:e}=this,
{updateObjects:t}=this.canvas;this.moved=!0,this.updated=!1,t.push(this);for(const n of e)n.moved=!0,n.updated=!1,t.push(
n);this.canvas.drawnObjects.includes(this)||this.canvas.drawnObjects.push(this),this.canvas.drawnOrderVersion+=1}erase(){
this.style.unsubscribe(this.#e),this.zIndex.unsubscribe(this.#t);const{drawnObjects:e}=this.canvas;e.remove(this),this.canvas.
drawnOrderVersion+=1;for(const l of e)l.objectsUnder.delete(this);const{objectsUnder:t}=this,{updateObjects:n}=this.canvas;
this.moved=!0,this.updated=!1,n.push(this);for(const l of t)l.moved=!0,l.updated=!1,n.push(l);const{column:r,row:o,width:s,
height:a}=this.rectangle.peek(),c=o+a,d=r+s;for(let l=o;l<c;++l)for(const u of t)u.queueRerenderRange(l,r,d)}queueRerender(e,t){
this.queueRerenderRange(e,t,t+1)}queueRerenderRange(e,t,n){const r=this.view.peek()?.rectangle?.peek();Vs(this.rerenderCells,
e,t,n,this.canvas.size.peek(),r)}queueRerenderRectangle(e){const t=e.row+e.height,n=e.column+e.width;for(let r=e.row;r<t;r+=
1)this.queueRerenderRange(r,e.column,n)}updatePreviousRectangle(){const{previousRectangle:e}=this,{column:t,row:n,width:r,
height:o}=this.rectangle.peek();e?(e.column=t,e.row=n,e.width=r,e.height=o):this.previousRectangle={column:t,row:n,width:r,
height:o}}updateMovement(){const{previousRectangle:e,objectsUnder:t}=this,n=this.rectangle.peek();if(!e||Ln(n,e))return;
const r=bi(n,e,!0),o=e.row+e.height,s=e.column+e.width;for(let d=e.row;d<o;++d){if(r&&d>=r.row&&d<r.row+r.height){for(const l of t)
l.queueRerenderRange(d,e.column,r.column),l.queueRerenderRange(d,r.column+r.width,s);continue}for(const l of t)l.queueRerenderRange(
d,e.column,s)}const a=n.row+n.height,c=n.column+n.width;for(let d=n.row;d<a;++d){if(r&&d>=r.row&&d<r.row+r.height){this.
queueRerenderRange(d,n.column,r.column),this.queueRerenderRange(d,r.column+r.width,c);continue}this.queueRerenderRange(d,
n.column,c)}}updateOutOfBounds(){const{columns:e,rows:t}=this.canvas.size.peek(),{column:n,row:r,width:o,height:s}=this.
rectangle.peek();if(this.outOfBounds=o===0||s===0||n>=e||r>=t||n+o<0||r+s<0,!this.outOfBounds){const a=this.view.peek()?.
rectangle?.peek();if(!a)return;(n>a.column+a.width||r>a.row+a.height||n+o<a.column||r+s<a.row)&&(this.outOfBounds=!0)}}update(){}render(){
const{column:e,row:t,width:n,height:r}=this.rectangle.peek();this.queueRerenderRectangle({column:e,row:t,width:n,height:r}),
this.rerender()}rerender(){}#a(e){if(this.#r===e){this.#d();return}this.#r&&(this.#r.rectangle.unsubscribe(this.#o),this.#r.
offset.unsubscribe(this.#n),this.#r.maxOffset.unsubscribe(this.#s)),this.#r=e,e&&(e.rectangle.subscribe(this.#o),e.offset.
subscribe(this.#n),e.maxOffset.subscribe(this.#s)),this.#d()}#d(){const e=this.#r;if(!e){this.#u();return}const t=this.rectangle?.
peek();if(!t)return;const n=e.rectangle.peek(),r=e.offset.peek(),o=n.column-r.columns,s=n.row-r.rows,a=o-this.viewOffset.
columns,c=s-this.viewOffset.rows;if(a!==0||c!==0){t.column+=a,t.row+=c,this.moved=!0;for(const d of this.objectsUnder)d.
moved=!0}this.viewOffset.columns=o,this.viewOffset.rows=s,this.#u()}#u(){const{updateObjects:e}=this.canvas;this.updated=
!1,e.push(this);for(const t of this.objectsUnder)t.updated=!1,e.push(t)}}class Dn{#e=new Map;#t=0;static fromRectangles(e){
const t=new Dn;return t.resetFromRectangles(e),t}resetFromRectangles(e){this.clearRetainingRows();for(const t of e)this.
addRectangleUnmerged(t);this.mergeRows()}addRectangleUnmerged(e){const t=Math.floor(e.row),n=t+Math.max(0,Math.floor(e.height)),
r=Math.floor(e.column),o=r+Math.max(0,Math.floor(e.width));if(!(n<=t||o<=r))for(let s=t;s<n;s+=1){const a=this.#e.get(s),
c={row:s,startColumn:r,endColumn:o};a?a.push(c):this.#e.set(s,[c])}}addRectangle(e){const t=Math.floor(e.row),n=t+Math.max(
0,Math.floor(e.height)),r=Math.floor(e.column),o=r+Math.max(0,Math.floor(e.width));for(let s=t;s<n;s+=1)this.addSegment(
s,r,o)}addSegment(e,t,n){const r=Math.floor(e),o=Math.floor(Math.min(t,n)),s=Math.floor(Math.max(t,n));if(s<=o)return;const a=this.#e.
get(r);if(a){const c=a.length;a.push({row:r,startColumn:o,endColumn:s}),ki(a),this.#t+=a.length-c}else this.#e.set(r,[{row:r,
startColumn:o,endColumn:s}]),this.#t+=1}clear(){this.#e.clear(),this.#t=0}isEmpty(){return this.#t===0}inspect(){const e=[];
for(const n of this.#e.keys())e.push(n);e.sort((n,r)=>n-r);const t=[];for(const n of e){const r=this.#e.get(n);if(r)for(const o of r)
t.push({...o})}return t}forEachSegment(e){for(const t of this.#e.values())for(const n of t)e(n)}intersects(e){const t=Math.
floor(e.row),n=t+Math.max(0,Math.floor(e.height)),r=Math.floor(e.column),o=r+Math.max(0,Math.floor(e.width));if(n<=t||o<=
r)return!1;for(let s=t;s<n;s+=1)for(const a of this.#e.get(s)??[])if(Math.min(o,a.endColumn)>Math.max(r,a.startColumn))return!0;
return!1}intersections(e){const t=[];return this.forEachIntersection(e,n=>{t.push({...n})}),t}forEachIntersection(e,t){this.
forEachIntersectionValue(e,(n,r,o)=>{t({row:n,startColumn:r,endColumn:o})})}forEachIntersectionValue(e,t){const n=Math.floor(
e.row),r=n+Math.max(0,Math.floor(e.height)),o=Math.floor(e.column),s=o+Math.max(0,Math.floor(e.width));if(!(r<=n||s<=o))
for(let a=n;a<r;a+=1)for(const c of this.#e.get(a)??[]){const d=Math.max(o,c.startColumn),l=Math.min(s,c.endColumn);l>d&&
t(a,d,l)}}mergeRows(){let e=0;for(const t of this.#e.values())ki(t),e+=t.length;this.#t=e}clearRetainingRows(){for(const e of this.#e.
values())e.length=0;this.#t=0}}function ki(i){if(i.length<2)return;i.sort((t,n)=>t.startColumn-n.startColumn||t.endColumn-
n.endColumn);let e=0;for(let t=1;t<i.length;t+=1){const n=i[e],r=i[t];if(r.startColumn<=n.endColumn){n.endColumn=Math.max(
n.endColumn,r.endColumn);continue}e+=1,i[e]=r}i.length=e+1}class Zs extends Js{text;valueChars;overwriteRectangle;multiCodePointSupport;rerenderRanges;#e;#t;constructor(e){
super("text",e),this.text=Fe(e.value),this.rectangle=Fe(e.rectangle),this.overwriteRectangle=Fe(e.overwriteRectangle??!1),
this.multiCodePointSupport=Fe(e.multiCodePointSupport??!1),this.valueChars=this.multiCodePointSupport.value?dr(this.text.
value):this.text.value,this.rerenderRanges=[];const{updateObjects:t}=this.canvas,n=(r,o,s,a)=>{if(!a){const w=o.width;if(o.
width=ke(r),o.width!==w){this.moved=!0;for(const g of this.objectsUnder)g.moved=!0}}o.height=1;const{valueChars:c}=this,
d=this.valueChars=s?dr(r):r,{row:l,column:u,width:h}=o,f=a?h<c.length?h:-1:d.length<c.length?d.length:-1,p=Math.max(d.length,
c.length);if(a&&h!==void 0&&d.length>=h){Qs(this,c,d,l,u,h);return}if(f!==-1)for(let w=0;w<p;++w)if(w>=f)for(const g of this.
objectsUnder)g.queueRerender(l,u+w);else d[w]!==c[w]&&this.queueRerender(l,u+w);else for(let w=0;w<p;++w)d[w]!==c[w]&&this.
queueRerender(l,u+w)};this.#e=r=>{const o=this.text.peek(),s=this.multiCodePointSupport.peek(),a=this.overwriteRectangle.
peek();this.moved=!0,this.updated=!1,t.push(this);for(const c of this.objectsUnder)c.moved=!0,c.updated=!1,t.push(c);n(o,
r,s,a)},this.#t=new qs(()=>{const r=this.text.value,o=this.rectangle.peek(),s=this.overwriteRectangle.value,a=this.multiCodePointSupport.
value;this.updated=!1,t.push(this);for(const c of this.objectsUnder)c.updated=!1,t.push(c);n(r,o,a,s)})}draw(){this.#t.resume(),
this.rectangle.subscribe(this.#e),super.draw()}erase(){this.#t.pause(),this.rectangle.unsubscribe(this.#e),super.erase()}queueRerender(e,t){
this.queueRerenderRange(e,t,t+1)}queueRerenderRange(e,t,n){const r=this.view.peek()?.rectangle?.peek();if(e<0)return;const{
columns:o,rows:s}=this.canvas.size.peek();if(e>=s)return;let a=Math.max(0,Math.floor(t)),c=Math.min(o,Math.ceil(n));if(r){
if(e<r.row||e>=r.row+r.height)return;a=Math.max(a,r.column),c=Math.min(c,r.column+r.width)}if(c<=a)return;const d=Math.floor(
e);(this.rerenderRanges[d]??=[]).push({row:d,startColumn:a,endColumn:c})}updateMovement(){const{objectsUnder:e,previousRectangle:t}=this,
n=this.rectangle.peek();if(!t||Ln(n,t))return;const r=bi(n,t,!0),o=t.row,s=t.column+t.width;for(let l=t.column;l<s;++l)if(!(r&&
cr(l,o,r)))for(const u of e)u.queueRerender(o,l);const a=n.column!==t.column||n.row!==t.row,{row:c}=n,d=n.column+n.width;
for(let l=n.column;l<d;++l)if(a&&this.queueRerender(c,l),!(r&&cr(l,c,r)))for(const u of e)u.queueRerender(c,l)}rerender(){
const{canvas:e,valueChars:t,omitCells:n,rerenderCells:r,rerenderRanges:o}=this,{frameBuffer:s,rerenderQueue:a}=e,{columns:c,
rows:d}=e.size.peek(),l=this.rectangle.peek(),u=this.style.peek(),{row:h}=l,f=this.overwriteRectangle.peek()?l.width??t.
length:t.length;let p=Math.min(h,d),w=Math.min(l.column+f,c);const g=this.view.peek()?.rectangle?.peek();if(g&&(p=Math.min(
h,g.row+g.height),w=Math.min(w,g.column+g.width)),h>p)return;const R=r[h],m=o[h];if(!R?.size&&!m?.length)return;const M=n[h];
if(M?.size===t.length){R?.clear(),m&&(m.length=0);return}const I=s[h]??=[],E=Math.max(0,l.column,g?.column??0),$=F=>{const L=F-
l.column;let G=t[L]??" ";return(G===""&&(F===E||M?.has(F-1))||t[L+1]===""&&(F+1>=w||M?.has(F+1)))&&(G=" "),u(G)};if(m?.length){
ki(m);const F=M?.size?void 0:e.rerenderRanges[h]??=[];let L;for(const G of m){const v=Math.max(G.startColumn,l.column),y=Math.
min(G.endColumn,w);if(!(y<=v)){for(let x=v;x<y;x+=1)M?.has(x)||(I[x]=$(x),F||(L??=a[h]??=new Set,L.add(x)));F&&F.push({row:h,
startColumn:v,endColumn:y})}}m.length=0}if(R?.size){const F=a[h]??=new Set;for(const L of R)L>=w||L<l.column||M?.has(L)||
(I[L]=$(L),F.add(L));R.clear()}}}function dr(i){const e=ys(i);return ke(i)===e.length?e:e.flatMap(t=>{const n=ke(t);return n===
2?[t,""]:n?[t]:[]})}function Qs(i,e,t,n,r,o){let s=-1;for(let a=0;a<o;a+=1){const c=t[a]??" ",d=e[a]??" ";if(c===d){s!==
-1&&(i.queueRerenderRange(n,r+s,r+a),s=-1);continue}s===-1&&(s=a)}s!==-1&&i.queueRerenderRange(n,r+s,r+o)}class Fn{#e=new Map;#t=new Set;#i=new Set;#o=0;#n=0;static fromObjects(e){
return new Fn().resetFromObjects(e)}resetFromObjects(e){this.clearRetainingRows();for(const t of e)this.add(t);return this}add(e){
if(e.outOfBounds)return;const t=e.rectangle.peek(),n=Math.floor(t.row),r=n+Math.max(0,Math.floor(t.height)),o=Math.floor(
t.column),s=o+Math.max(0,Math.floor(t.width));if(!(r<=n||s<=o)){this.#t.add(e);for(let a=n;a<r;a+=1){const c=this.#e.get(
a);c?(c.length===0&&(this.#n+=1),c.push(e)):(this.#e.set(a,[e]),this.#n+=1),this.#o+=1}}}query(e){return this.queryInto(
[],e)}queryInto(e,t){e.length=0;const n=Math.floor(t.row),r=n+Math.max(0,Math.floor(t.height)),o=Math.floor(t.column),s=o+
Math.max(0,Math.floor(t.width));if(r<=n||s<=o)return e;const a=this.#i;a.clear();for(let c=n;c<r;c+=1)for(const d of this.#e.
get(c)??[]){const l=d.rectangle.peek(),u=Math.floor(l.column);u+Math.max(0,Math.floor(l.width))<=o||u>=s||a.add(d)}for(const c of a)
e.push(c);return a.clear(),e}queryDirtyRegion(e){return this.queryDirtyRegionInto([],e)}queryDirtyRegionInto(e,t){if(e.length=
0,t.isEmpty())return e;const n=this.#i;n.clear(),t.forEachSegment(r=>{const o=r.startColumn,s=r.endColumn;for(const a of this.#e.
get(r.row)??[]){const c=a.rectangle.peek(),d=Math.floor(c.column);d+Math.max(0,Math.floor(c.width))<=o||d>=s||n.add(a)}});
for(const r of n)e.push(r);return n.clear(),e}inspect(){return{objects:this.#t.size,rows:this.#n,rowEntries:this.#o}}clear(){
this.#e.clear(),this.#t.clear(),this.#i.clear(),this.#o=0,this.#n=0}clearRetainingRows(){for(const e of this.#e.values())
e.length=0;this.#t.clear(),this.#i.clear(),this.#o=0,this.#n=0}}class ea extends vo{stdout;sink;size;rerenderedObjects;frameBuffer;rerenderQueue;rerenderRanges;drawnObjects;updateObjects;resizeNeeded;lastRenderStats;drawnOrderVersion;cellUpdatesBuffer;rowRangesBuffer;directRowRangesBuffer;objectsToUpdateBuffer;seenObjectsBuffer;dirtyRowsSeenBuffer;dirtyRectanglesBuffer;movedOwnObjectsBuffer;nonMovingUpdatedObjectsBuffer;affectedObjectsBuffer;requiredObjectsBuffer;dirtyCandidatesBuffer;intersectionCandidatesBuffer;dirtyRegionBuffer;spatialIndexBuffer;constructor(e){
if(super(),this.frameBuffer=[],this.rerenderQueue=[],this.rerenderRanges=[],this.stdout=e.stdout,e.sink)this.sink=e.sink;else if(e.
stdout)this.sink=new bs({stdout:e.stdout});else throw new Error("Canvas requires either stdout or sink.");this.drawnObjects=
new Gs((r,o)=>r.zIndex.peek()-o.zIndex.peek()||r.id-o.id),this.updateObjects=[],this.resizeNeeded=!1,this.lastRenderStats=
lr(),this.drawnOrderVersion=0,this.cellUpdatesBuffer=[],this.rowRangesBuffer=[],this.directRowRangesBuffer=[],this.objectsToUpdateBuffer=
[],this.seenObjectsBuffer=new Set,this.dirtyRowsSeenBuffer=new Set,this.dirtyRectanglesBuffer=[],this.movedOwnObjectsBuffer=
new Set,this.nonMovingUpdatedObjectsBuffer=[],this.affectedObjectsBuffer=[],this.requiredObjectsBuffer=new Set,this.dirtyCandidatesBuffer=
[],this.intersectionCandidatesBuffer=[],this.dirtyRegionBuffer=new Dn,this.spatialIndexBuffer=new Fn,this.size=Fe(e.size,
{deepObserve:!0}),this.size.subscribe(()=>{this.resizeNeeded=!0;const{columns:r,rows:o}=this.size.peek();this.sink.resize?.(
r,o)});const{columns:t,rows:n}=this.size.peek();this.sink.resize?.(t,n)}resortDrawnObjects(){this.drawnObjects.sort(this.
drawnObjects.compareFn),this.drawnOrderVersion+=1}resize(){this.rerenderAll()}rerenderAll(){const{columns:e,rows:t}=this.
size.peek();this.clearRetainedResizeState();for(const n of this.drawnObjects){const{column:r,row:o}=n.rectangle.peek();r>=
e||o>=t||(n.rendered=!1,n.updated=!1,this.updateObjects.push(n))}}clearRetainedResizeState(){this.frameBuffer.length=0,this.
rerenderQueue.length=0,this.rerenderRanges.length=0,this.cellUpdatesBuffer.length=0,this.rowRangesBuffer.length=0,this.directRowRangesBuffer.
length=0,this.dirtyRowsSeenBuffer.clear(),this.dirtyRegionBuffer.clear();for(const e of this.drawnObjects){for(const n of e.
rerenderCells)n?.clear();e.rerenderCells.length=0;const t=e;if(t.rerenderRanges){for(const n of t.rerenderRanges)n&&(n.length=
0);t.rerenderRanges.length=0}}}updateIntersections(e,t){const{omitCells:n,objectsUnder:r}=e;let o=0;const s=e.zIndex.peek(),
a=e.rectangle.peek();for(const c of n)c?.clear();r.clear();for(const c of t??this.drawnObjects){if(e===c||c.outOfBounds)
continue;o+=1;const d=c.zIndex.peek();if(d<s||d===s&&c.id<e.id){bi(a,c.rectangle.peek(),!1)&&r.add(c);continue}const l=bi(
a,c.rectangle.peek(),!0);if(!l)continue;const u=l.row+l.height,h=l.column+l.width;for(let f=l.row;f<u;++f){const p=n[f]??=
new Set;for(let w=l.column;w<h;++w)p.add(w)}}return o}inspectRender(){return{...this.lastRenderStats}}render(){const{frameBuffer:e,
updateObjects:t}=this;if(this.resizeNeeded&&(this.resize(),this.resizeNeeded=!1),!t.length){this.lastRenderStats=lr();return}
const n=this.objectsToUpdateBuffer,r=this.seenObjectsBuffer;for(n.length=0,r.clear();t.length;){const y=t.pop();r.has(y)||
(r.add(y),n.push(y))}n.sort((y,x)=>x.zIndex.peek()-y.zIndex.peek()||x.id-y.id);let o=0,s=!1;const a=this.dirtyRectanglesBuffer,
c=this.movedOwnObjectsBuffer,d=this.nonMovingUpdatedObjectsBuffer;a.length=0,c.clear(),d.length=0;for(const y of n){y.updated=
!0,++o,y.update();const x=y.previousRectangle?hr(y.previousRectangle):void 0;if(y.updateMovement(),y.moved){s=!0;const D=y.
rectangle.peek(),C=!x||!Ln(D,x),N=this.drawnObjects.includes(y);C||!N?(a.push(hr(D)),x&&a.push(x),c.add(y)):d.push(y)}else
d.push(y);y.updatePreviousRectangle(),y.updateOutOfBounds(),y.outOfBounds&&(y.rendered=!1)}const l=this.dirtyRegionBuffer;
l.resetFromRectangles(a);const u=s?this.spatialIndexBuffer.resetFromObjects(this.drawnObjects):void 0,h=s?ta(this.drawnObjects,
l,d,c,u,this.affectedObjectsBuffer,this.requiredObjectsBuffer,this.dirtyCandidatesBuffer):n;let f=0;if(s){h.sort((x,D)=>D.
zIndex.peek()-x.zIndex.peek()||D.id-x.id);const y=this.intersectionCandidatesBuffer;for(const x of h)f+=this.updateIntersections(
x,u.queryInto(y,x.rectangle.peek())),x.moved=!1,x.outOfBounds||(c.has(x)||!x.rendered?x.rendered=!1:ia(x,l))}else for(const y of h)
y.moved=!1;let p=0,w=0;for(const y of h)y.outOfBounds||(y.rendered?(y.rerender(),w+=1):(y.render(),y.rendered=!0,p+=1));
this.rerenderedObjects=o;const{rerenderQueue:g,rerenderRanges:R}=this,m=this.size.peek();let M=0,I=0,E=0;const $=this.cellUpdatesBuffer,
F=this.directRowRangesBuffer,L=this.dirtyRowsSeenBuffer;$.length=0,F.length=0,L.clear();const G=!this.sink.flushRanges||
this.sink.requiresCellUpdates!==!1;for(let y=0;y<m.rows;++y){const x=R[y];if(x?.length){ki(x),L.add(y);const N=e[y]??=[];
for(const B of x)E+=Math.max(0,B.endColumn-B.startColumn),M+=na(y,B.startColumn,B.endColumn,N,F,G?$:void 0);x.length=0}const D=g[y];
if(!D?.size)continue;L.add(y),E+=D.size;const C=e[y]??=[];for(const N of D){const B=C[N];B!==void 0&&($.push({row:y,column:N,
value:B}),M+=1)}D.clear()}const v=this.sink.flushRanges?F:or($,this.rowRangesBuffer);if(this.sink.flushRanges&&$.length>
0){or($,this.rowRangesBuffer);for(const y of this.rowRangesBuffer)F.push(y)}I=L.size,this.lastRenderStats={updatedObjects:o,
renderedObjects:p,rerenderedObjects:w,intersectionUpdates:s?h.length:0,intersectionCandidateChecks:f,intersectionsDirty:s,
dirtyRectangles:a.length,dirtyRowRanges:v.length,dirtyRows:I,dirtyCells:E,fullRedraws:p,flushedCells:M},($.length>0||this.
sink.flushRanges&&v.length>0)&&(this.sink.flushRanges?this.sink.flushRanges(v,this.lastRenderStats,$):this.sink.flush($,
this.lastRenderStats),this.sink.takeFlushDegraded?.()&&this.rerenderAll()),this.emit("render")}}function lr(){return{updatedObjects:0,
renderedObjects:0,rerenderedObjects:0,intersectionUpdates:0,intersectionCandidateChecks:0,intersectionsDirty:!1,dirtyRectangles:0,
dirtyRowRanges:0,dirtyRows:0,dirtyCells:0,fullRedraws:0,flushedCells:0}}function hr(i){return{column:i.column,row:i.row,
width:i.width,height:i.height}}function ta(i,e,t,n,r,o,s,a){if(o.length=0,s.clear(),e.isEmpty()){for(const c of i)o.push(
c);return o}for(const c of n)s.add(c);for(const c of t)s.add(c);for(const c of r.queryDirtyRegionInto(a,e))s.add(c);for(const c of i)
s.has(c)&&o.push(c);return o}function ia(i,e){e.forEachIntersectionValue(i.rectangle.peek(),(t,n,r)=>{i.queueRerenderRange(
t,n,r)})}function na(i,e,t,n,r,o){if(!o){const d=ra(n,e,t);if(d)return r.push({row:i,startColumn:e,values:d}),d.length}let s=0,
a,c=e;for(let d=e;d<t;d+=1){const l=n[d];if(l===void 0){a?.length&&(o||r.push({row:i,startColumn:c,values:a})),a=void 0;
continue}a||(a=[],c=d),a.push(l),o?.push({row:i,column:d,value:l}),s+=1}return a?.length&&(o||r.push({row:i,startColumn:c,
values:a})),s}function ra(i,e,t){for(let n=e;n<t;n+=1)if(i[n]===void 0)return;return i.slice(e,t)}function oa(i,e,t){const n=Math.
max(0,i),r=Math.max(0,t-e);return Math.max(0,n-r)}class sa{#e;#t;#i;#o;#n;#s;#r=!1;#a=0;#d;#u;#w=0;#f=0;#p=0;#g;constructor(e){
this.#e=e.tick,this.#t=e.timer??aa,this.#n=Math.max(0,e.intervalMs??1e3/60),this.#i=e.immediate??!0,this.#o=e.onError}get running(){
return this.#r}get frame(){return this.#a}get intervalMs(){return this.#n}set intervalMs(e){this.#n=Math.max(0,e)}start(){
this.#r||(this.#r=!0,this.#i?this.#m():this.#l())}stop(){this.#s!==void 0&&(this.#t.clearTimeout(this.#s),this.#s=void 0),
this.#r=!1}step(){this.#h()}inspect(){return{running:this.#r,frame:this.#a,intervalMs:this.#n,frameBudgetMs:this.#n,lastStartedAt:this.#d,
lastDurationMs:this.#u,averageDurationMs:this.#a===0?0:this.#w/this.#a,maxDurationMs:this.#f,overBudgetFrames:this.#p,lastError:this.#g}}#m(){
if(this.#r){this.#s=void 0;try{this.#h();const e=this.#d??this.#t.now();this.#l(oa(this.#n,e,this.#t.now()))}catch(e){this.#g=
e,this.#o?.(e),this.stop()}}}#h(){const e=this.#t.now(),t=this.#d===void 0?0:e-this.#d;this.#d=e,this.#a+=1,this.#e({frame:this.#a,
startedAt:e,deltaMs:t});const n=Math.max(0,this.#t.now()-e);this.#u=n,this.#w+=n,this.#f=Math.max(this.#f,n),n>this.#n&&
(this.#p+=1)}#l(e=this.#n){this.#r&&(this.#s=this.#t.setTimeout(()=>this.#m(),e))}}const aa={setTimeout:(i,e)=>setTimeout(
i,e),clearTimeout:i=>clearTimeout(i),now:()=>performance.now()};class ca{values=new Map;get(e){return Promise.resolve(this.
values.get(e))}set(e,t){return this.values.set(e,t),Promise.resolve()}delete(e){return this.values.delete(e),Promise.resolve()}}
class da{storeName;databasePromise;diagnostics;constructor(e){this.storeName=e.storeName??"values",this.diagnostics=e.diagnostics,
this.databasePromise=la(e.databaseName,this.storeName,e.version??1,e.scope).catch(t=>{throw this.diagnostics?.report({source:"\
storage",code:"indexeddb-open-failed",severity:"warning",message:"IndexedDB open failed.",detail:go(t),context:{databaseName:e.
databaseName,storeName:this.storeName,version:e.version??1}}),t})}async get(e){const t=await this.databasePromise;return await Hi(
t.transaction(this.storeName,"readonly").objectStore(this.storeName).get(e),this.diagnostics,"get",this.storeName,e)}async set(e,t){
const n=await this.databasePromise;await Hi(n.transaction(this.storeName,"readwrite").objectStore(this.storeName).put(t,
e),this.diagnostics,"set",this.storeName,e)}async delete(e){const t=await this.databasePromise;await Hi(t.transaction(this.
storeName,"readwrite").objectStore(this.storeName).delete(e),this.diagnostics,"delete",this.storeName,e)}}function la(i,e,t,n=globalThis){
return"indexedDB"in n?new Promise((r,o)=>{const a=n.indexedDB.open(i,t);a.onerror=()=>o(a.error??new Error("Failed to op\
en IndexedDB database.")),a.onsuccess=()=>r(a.result),a.onupgradeneeded=()=>{a.result.objectStoreNames.contains(e)||a.result.
createObjectStore(e)}}):Promise.reject(new Error("IndexedDB is not available in this runtime."))}function Hi(i,e,t,n,r){
return new Promise((o,s)=>{i.onerror=()=>{const a=i.error??new Error("IndexedDB request failed.");e?.report({source:"sto\
rage",code:"indexeddb-request-failed",severity:"warning",message:"IndexedDB request failed.",detail:go(a),context:{operation:t,
storeName:n,key:r}}),s(a)},i.onsuccess=()=>o(i.result)})}function ha(i){let e="",t="";for(const n of i){const r=`${n.foreground?.
join(",")??""}|${n.background?.join(",")??""}|${n.bold?"b":""}`;r!==t&&(t=r,e+="\x1B[0m",n.bold&&(e+="\x1B[1m"),n.foreground&&
(e+=`\x1B[38;2;${n.foreground.join(";")}m`),n.background&&(e+=`\x1B[48;2;${n.background.join(";")}m`)),e+=n.char}return`${e}\
\x1B[0m`}function At(i){return["#0f172a","#ef4444","#22c55e","#eab308","#3b82f6","#d946ef","#06b6d4","#e5e7eb","#475569",
"#fb7185","#86efac","#fde047","#93c5fd","#f0abfc","#67e8f9","#f8fafc"][i]??"#dbeafe"}function ua(i){if(!Number.isFinite(
i)||i<0)return"#dbeafe";if(i<16)return At(i);if(i>=232){const o=8+(Math.min(i,255)-232)*10;return`rgb(${o},${o},${o})`}const e=Math.
min(i,231)-16,t=Math.floor(e/36),n=Math.floor(e%36/6),r=e%6;return`rgb(${Di(t)},${Di(n)},${Di(r)})`}const fa=new TextDecoder,
pa=new Map([[9472,5],[9474,10],[9484,6],[9488,3],[9492,12],[9496,9],[9500,14],[9508,11],[9516,7],[9524,13],[9532,15],[9581,
6],[9582,3],[9583,9],[9584,12],[9588,1],[9589,8],[9590,4],[9591,2]]),wa="\x1B",ma=new RegExp(`${wa}\\[([0-9;:]*)m`,"g");
class ga{requiresCellUpdates=!1;#e;#t;#i;#o;#n;#s;#r=0;#a=0;#d;#u;#w;#f=[];#p=new Set;constructor(e){const t=e.canvas.getContext(
"2d");if(!t)throw new Error("BrowserCellCanvasSink requires a 2D canvas context.");this.#e=e.canvas,this.#t=t,this.#i=e.
font??"16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",this.#o=e.foreground??"#dbeafe",this.#n=e.background??
"#070b12",this.#s=Math.max(1,e.devicePixelRatio??globalThis.devicePixelRatio??1),this.#d=Math.max(1,e.cellWidth??10),this.#u=
Math.max(1,e.cellHeight??20),this.#t.font=this.#i,this.#t.textBaseline="top"}resize(e,t){if(e=Math.max(1,Math.floor(e)),
t=Math.max(1,Math.floor(t)),!Number.isSafeInteger(e*t)||e*t>2e6)throw new RangeError("Browser cell surfaces support at m\
ost 2,000,000 finite cells.");this.#r=e,this.#a=t,this.#f=new Array(e*t),this.#p.clear(),this.#e.width=Math.ceil(this.#r*
this.#d*this.#s),this.#e.height=Math.ceil(this.#a*this.#u*this.#s),this.#t.setTransform?.(1,0,0,1,0,0),this.#t.scale(this.#s,
this.#s),this.#t.font=this.#i,this.#t.textBaseline="top",this.#t.fillStyle=this.#n,this.#t.fillRect(0,0,this.#e.width/this.#s,
this.#e.height/this.#s)}flush(e,t){const n=new Set;for(const r of e)this.#g(r.row,r.column,r.value,n);this.#m(n),this.#w=
{...t}}flushRanges(e,t,n=[]){const r=new Set;for(const o of e){let s=o.startColumn;for(const a of o.values)this.#g(o.row,
s,a,r),s+=1}this.#m(r),this.#w={...t}}inspectSink(){return{columns:this.#r,rows:this.#a,cellWidth:this.#d,cellHeight:this.#u,
foreground:this.#o,background:this.#n,lastStats:this.#w?{...this.#w}:void 0}}#g(e,t,n,r){if(!Number.isInteger(e)||!Number.
isInteger(t)||e<0||e>=this.#a||t<0||t>=this.#r)return;const o=e*this.#r+t;r.add(o),this.#p.has(o)&&r.add(o+1),t>0&&this.#p.
has(o-1)&&r.add(o-1),this.#f[o]=typeof n=="string"?n:fa.decode(n)}#m(e){const t=new Map,n=s=>{let a=t.get(s);return a||(a=
va(this.#f[s]??""),t.set(s,a)),a},r=s=>this.#f[s]!==void 0&&n(s).text==="",o=s=>ks(n(s).text)!==2?1:s%this.#r+1<this.#r&&
r(s+1)?2:0;for(const s of e)o(s)===2&&e.add(s+1),s%this.#r>0&&r(s)&&o(s-1)===2&&e.add(s-1);for(const s of e){if(this.#p.
delete(s),s%this.#r>0&&r(s)&&o(s-1)===2)continue;const a=n(s),c=o(s);this.#h(Math.floor(s/this.#r),s%this.#r,a,c),c===2&&
this.#p.add(s)}}#h(e,t,n,r){const o=t*this.#d,s=e*this.#u,a=Math.max(1,r)*this.#d,c=Math.round(o*this.#s)/this.#s,d=Math.
round(s*this.#s)/this.#s,l=(t+Math.max(1,r)===this.#r?this.#e.width:Math.round((o+a)*this.#s))/this.#s,u=(e+1===this.#a?
this.#e.height:Math.round((s+this.#u)*this.#s))/this.#s;this.#t.fillStyle=n.inverse?n.foreground??this.#o:n.background??
this.#n,this.#t.fillRect(c,d,l-c,u-d);const h=r===0?" ":n.text||" ",f=n.inverse?n.background??this.#n:n.foreground??this.#o,
p=n.dim?ba(f):f;if(!(h.trim().length===0&&!n.underline&&!n.overline&&!n.strikethrough))if(this.#t.save&&this.#t.restore&&
this.#t.beginPath&&this.#t.rect&&this.#t.clip){this.#t.save();try{this.#t.beginPath(),this.#t.rect(c,d,l-c,u-d),this.#t.
clip(),this.#l(n,r,h,o,s,p,c,d,l-c,u-d)}finally{this.#t.restore()}}else this.#l(n,r,h,o,s,p,c,d,l-c,u-d)}#l(e,t,n,r,o,s,a,c,d,l){
if(n.trim().length===0){this.#c(e,r,o,s);return}if(n.length===1){const u=n.codePointAt(0);if(u>=9472&&u<=9599&&this.#v(u,
a,c,s,d,l)||this.#y(u,a,c,s,d,l)){this.#c(e,r,o,s);return}}this.#t.font=`${e.italic?"italic ":""}${e.bold?"700 ":""}${this.#i}`,
this.#t.fillStyle=s,this.#t.fillText(n,r,o),this.#c(e,r,o,s),t===2&&this.#c(e,r+this.#d,o,s)}#c(e,t,n,r){if(!e.underline&&
!e.strikethrough&&!e.overline)return;const o=Math.min(this.#u,Math.max(1,Math.round(this.#u/16)));if(this.#t.fillStyle=r,
e.overline&&this.#t.fillRect(t,n,this.#d,o),e.strikethrough&&this.#t.fillRect(t,n+Math.floor((this.#u-o)/2),this.#d,o),!e.
underline)return;this.#t.fillStyle=e.underlineColor??r;const s=n+this.#u-o,a=e.underlineStyle??"solid";if(a==="solid"||a===
"double")this.#t.fillRect(t,s,this.#d,o),a==="double"&&this.#u>o*2&&this.#t.fillRect(t,Math.max(n,s-o*2),this.#d,o);else{
const c=a==="dotted"?o*2:a==="dashed"?o*6:o*8,d=Math.max(1,this.#d/512);for(let l=0;l<this.#d;l+=d){const u=(t+l)%c;if(a===
"dotted"&&u>=o||a==="dashed"&&u>=o*4)continue;const h=a==="wavy"?Math.max(n,s-Math.min(this.#u-o,o*2)*(1+Math.sin((t+l)*
Math.PI*2/c))/2):s;this.#t.fillRect(t+l,h,Math.min(d,this.#d-l),o)}}}#v(e,t,n,r,o,s){const a=this.#t,c=Math.max(1,Math.round(
Math.min(o,s)/8)),d=Math.max(2,c*2),l=t+Math.floor((o-c)/2),u=n+Math.floor((s-c)/2),h=(I,E,$,F=c)=>a.fillRect(E,I,Math.max(
0,$-E),F),f=(I,E,$,F=c)=>a.fillRect(I,E,F,Math.max(0,$-E)),p=e===9473?5:e===9475?10:pa.get(e);if(p!==void 0){a.fillStyle=
r;const I=e===9473||e===9475?d:c,E=t+Math.floor((o-I)/2),$=n+Math.floor((s-I)/2);return p&8&&f(E,n,$+I,I),p&2&&f(E,$,n+s,
I),p&1&&h($,t,E+I,I),p&4&&h($,E,t+o,I),!0}const w=Math.max(c+1,Math.round(Math.min(o,s)/5)),g=u-w,R=u+w,m=l-w,M=l+w;switch(a.
fillStyle=r,e){case 9552:return h(g,t,t+o),h(R,t,t+o),!0;case 9553:return f(m,n,n+s),f(M,n,n+s),!0;case 9556:return h(g,
m,t+o),h(R,M,t+o),f(m,g,n+s),f(M,R,n+s),!0;case 9559:return h(g,t,M+c),h(R,t,m+c),f(M,g,n+s),f(m,R,n+s),!0;case 9562:return h(
R,m,t+o),h(g,M,t+o),f(m,n,R+c),f(M,n,g+c),!0;case 9565:return h(R,t,M+c),h(g,t,m+c),f(M,n,R+c),f(m,n,g+c),!0;case 9568:return f(
m,n,n+s),f(M,n,g+c),f(M,R,n+s),h(g,M,t+o),h(R,M,t+o),!0;case 9571:return f(M,n,n+s),f(m,n,g+c),f(m,R,n+s),h(g,t,m+c),h(R,
t,m+c),!0;case 9574:return h(g,t,t+o),h(R,t,m+c),h(R,M,t+o),f(m,R,n+s),f(M,R,n+s),!0;case 9577:return h(R,t,t+o),h(g,t,m+
c),h(g,M,t+o),f(m,n,g+c),f(M,n,g+c),!0;case 9580:return f(m,n,g+c),f(M,n,g+c),f(m,R,n+s),f(M,R,n+s),h(g,t,m+c),h(R,t,m+c),
h(g,M,t+o),h(R,M,t+o),!0;case 9578:return h(g,t,t+o),h(R,t,t+o),f(l,n,n+s),!0;case 9579:return f(m,n,n+s),f(M,n,n+s),h(u,
t,t+o),!0;default:return!1}}#y(e,t,n,r,o,s){if(e<9600||e>9631)return!1;const a=this.#t;if(a.fillStyle=r,e===9600)a.fillRect(
t,n,o,s/2);else if(e>=9601&&e<=9608){const c=s*(e-9600)/8;a.fillRect(t,n+s-c,o,c)}else if(e>=9609&&e<=9615)a.fillRect(t,
n,o*(9616-e)/8,s);else if(e===9616)a.fillRect(t+o/2,n,o/2,s);else if(e>=9617&&e<=9619){const c=[.25,.5,.75][e-9617],d=a.
globalAlpha??1;a.globalAlpha=d*c,a.fillRect(t,n,o,s),a.globalAlpha=d}else if(e===9620)a.fillRect(t,n,o,s/8);else if(e===
9621)a.fillRect(t+o*7/8,n,o/8,s);else{const c=[4,8,1,13,9,7,11,2,6,14][e-9622];c&1&&a.fillRect(t,n,o/2,s/2),c&2&&a.fillRect(
t+o/2,n,o/2,s/2),c&4&&a.fillRect(t,n+s/2,o/2,s/2),c&8&&a.fillRect(t+o/2,n+s/2,o/2,s/2)}return!0}}function va(i){const e={
text:fo(i),bold:!1,dim:!1},t=ya(i),n=i.matchAll(ma);for(const r of n){if(r.index!==void 0&&r.index>t)break;const o=Is(r[1]??
"");for(let s=0;s<o.length;s+=1){const a=o[s].split(":"),c=Number(a[0]);if(a.length>1&&c===4){a.length===2&&/^[0-5]$/.test(
a[1])&&(a[1]==="0"?(delete e.underline,delete e.underlineStyle):(e.underline=!0,e.underlineStyle=["solid","double","wavy",
"dotted","dashed"][Number(a[1])-1]));continue}if(c===38||c===48||c===58){const d=xs(o,s),l=d.rgb?`rgb(${d.rgb.join(",")}\
)`:d.palette!==void 0?ua(d.palette):void 0;l!==void 0&&(c===38?e.foreground=l:c===48?e.background=l:e.underlineColor=l),
s+=d.consumed-1;continue}a.length>1||(c===0?(e.foreground=void 0,e.background=void 0,e.bold=!1,e.dim=!1,delete e.italic,
delete e.underline,delete e.strikethrough,delete e.underlineColor,delete e.underlineStyle,delete e.overline,delete e.inverse):
c===1?e.bold=!0:c===2?e.dim=!0:c===3?e.italic=!0:c===4?(e.underline=!0,delete e.underlineStyle):c===21?(e.underline=!0,e.
underlineStyle="double"):c===53?e.overline=!0:c===55?delete e.overline:c===59?delete e.underlineColor:c===9?e.strikethrough=
!0:c===7?e.inverse=!0:c===27?delete e.inverse:c===23?delete e.italic:c===24?(delete e.underline,delete e.underlineStyle):
c===29?delete e.strikethrough:c===22?(e.bold=!1,e.dim=!1):c===39?e.foreground=void 0:c===49?e.background=void 0:c>=30&&c<=
37?e.foreground=At(c-30):c>=90&&c<=97?e.foreground=At(c-90+8):c>=40&&c<=47?e.background=At(c-40):c>=100&&c<=107&&(e.background=
At(c-100+8)))}}return e}function ya(i){for(let e=0;e<i.length;e+=1){if(i[e]!=="\x1B")return e;for(;e<i.length&&i[e]!=="m";)
e+=1}return i.length}function ba(i){return i.startsWith("#")?`${i}aa`:i}class ka{constructor(e="noop"){this.kind=e}#e=!1;start(){
this.#e=!0}stop(){this.#e=!1}inspect(){return{running:this.#e,kind:this.kind}}}const Ht=1;class j extends Error{constructor(e,t,n="\
$",r){super(`${t} at ${n}`,{cause:r}),this.code=e,this.path=n,this.cause=r,this.name="InputEnvelopeError"}}const yo=["te\
rminal","browser","remote","test"],Ia=["keyboard","mouse","touch","pen","clipboard","window","unknown"],xa=["trusted","u\
ntrusted","synthetic"],Ra=["key","text","pointer","scroll","paste","focus","resize","composition","drop"],_i=["alt","ctr\
l","meta","shift"],Ma=["schemaVersion","sequence","timestamp","source","device","trust","modifiers","kind"],Sa=["data","\
raw"],Oa=["encoding","data"],Ea=["__proto__","constructor","prototype"],He="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789+/",Vt=Object.freeze({maxBytes:64*1024,maxDepth:16,maxNodes:4096,maxRawBytes:4*1024});class bo{#e;#t;#i;#o;#n;#s;#r=0;constructor(e){
if(!e||typeof e.now!="function")throw new j("invalid-value","factory now must be a function","$.now");const t=e.initialSequence??
1;So(t,"$.initialSequence");const n=e.sequenceOverflowPolicy??"throw";if(n!=="throw")throw new j("invalid-value","sequen\
ceOverflowPolicy must be throw","$.sequenceOverflowPolicy");this.#e=e.now,this.#o=t,this.#i=n,this.#t=Oo(e.limits)}create(e,t,n={}){
Wt(e,yo,"source","$.source");const r=n.trust??La(e),o=n.device??t.device,s=Wa(t.modifiers,n.modifiers),a={schemaVersion:Ht,
sequence:this.#a(),timestamp:0,source:e,device:o,trust:r,modifiers:s,kind:t.kind};t.data!==void 0&&(a.data=t.data),n.includeRaw===
!0&&t.raw!==void 0&&(a.raw=Na(t.raw,this.#t.maxRawBytes));const c=this.#d();a.timestamp=c;const d=Io(a,this.#t);return this.#u(
d.sequence,c),d}terminal(e,t={}){return this.create("terminal",Ta(e,{includeRaw:t.includeRaw}),t)}browser(e,t={}){return this.
create("browser",Ca(e,{includeRaw:t.includeRaw}),t)}remote(e,t={}){return this.create("remote",za(e,{includeRaw:t.includeRaw}),
t)}test(e,t={}){return this.create("test",$a(e,{includeRaw:t.includeRaw}),t)}inspect(){const e=Object.freeze({...this.#t}),
t={schemaVersion:Ht,emitted:this.#r,exhausted:this.#o===void 0,nextSequence:this.#o,lastSequence:this.#n,lastTimestamp:this.#s,
sequenceOverflowPolicy:this.#i,limits:e};return Object.freeze(t)}#a(){if(this.#o===void 0)throw new j("sequence-overflow",
"input sequence exhausted at Number.MAX_SAFE_INTEGER","$.sequence");return this.#o}#d(){let e;try{e=this.#e()}catch(t){throw new j(
"clock-failed","input clock threw","$.timestamp",t)}if(!Number.isFinite(e))throw new j("clock-failed","input clock must \
return a finite number","$.timestamp");return Object.is(e,-0)&&(e=0),this.#s===void 0?e:Math.max(this.#s,e)}#u(e,t){this.#n=
e,this.#s=t,this.#o=e===Number.MAX_SAFE_INTEGER?void 0:e+1,this.#r+=1}}function Ta(i,e={}){return zi(i,e.includeRaw===!0)}
function Ca(i,e={}){return zi(i,e.includeRaw===!0)}function za(i,e={}){if(!i||typeof i!="object")throw new j("invalid-sh\
ape","remote input must be an object","$.input");const t=zi(i.event,e.includeRaw===!0);if(!(i.kind==="keyPress"&&t.kind===
"key"||i.kind==="mousePress"&&t.kind==="pointer"||i.kind==="mouseScroll"&&t.kind==="scroll"||i.kind==="paste"&&t.kind===
"paste"||i.kind==="terminalFocus"&&t.kind==="focus"))throw new j("invalid-value",`remote kind ${String(i.kind)} does not\
 match its event`,"$.input.kind");return t}function $a(i,e={}){return zi(i,e.includeRaw===!0)}function ko(i,e){return Io(
i,Oo(e))}function Io(i,e){const t=$i(i,"$","input envelope");if(_n(t,Ma,Sa,"$","input envelope"),t.schemaVersion!==Ht)throw new j(
"unsupported-version",`unsupported input envelope schema version ${String(t.schemaVersion)}`,"$.schemaVersion");if(So(t.
sequence,"$.sequence"),typeof t.timestamp!="number"||!Number.isFinite(t.timestamp))throw new j("invalid-value","timestam\
p must be finite","$.timestamp");const n=Object.is(t.timestamp,-0)?0:t.timestamp,r=Wt(t.source,yo,"source","$.source"),o=Wt(
t.device,Ia,"device","$.device"),s=Wt(t.trust,xa,"trust","$.trust"),a=Wt(t.kind,Ra,"kind","$.kind"),c=un(t.modifiers,"$.\
modifiers",!1),d={nodes:0,ancestors:new WeakSet,limits:e},l=t.data===void 0?void 0:ja(t.data,"$.data",0,d),u=t.raw===void 0?
void 0:Pa(t.raw,e),h={schemaVersion:Ht,sequence:t.sequence,timestamp:n,source:r,device:o,trust:s,modifiers:c,kind:a};l!==
void 0&&(h.data=l),u!==void 0&&(h.raw=u);const f=Object.freeze(h),p=JSON.stringify(f);return Da(p,e.maxBytes,"$","canoni\
cal envelope"),f}function zi(i,e){if(!i||typeof i!="object")throw new j("invalid-shape","input event must be an object",
"$.event");const t=e?Aa(i):void 0;if(i.key==="paste")return Tt({kind:"paste",device:"clipboard",modifiers:ur(),data:{text:i.
text}},t);if(i.key==="focus")return Tt({kind:"focus",device:"window",modifiers:ur(),data:{focused:i.focused}},t);if(i.key===
"apc")throw new j("invalid-shape","terminal APC replies are not semantic input; subscribe to terminalApc instead","$.eve\
nt");if(i.key!=="mouse")return Tt({kind:"key",device:"keyboard",modifiers:qi(i),data:{key:i.key}},t);const n={x:i.x,y:i.
y,movementX:i.movementX,movementY:i.movementY};if("scroll"in i)return Tt({kind:"scroll",device:"mouse",modifiers:qi(i),data:{
...n,direction:i.scroll,drag:i.drag}},t);const r="release"in i;return Tt({kind:"pointer",device:"mouse",modifiers:qi(i),
data:{...n,phase:r?i.release?"up":i.drag?"move":"down":"move",button:r?i.button??null:null,drag:r?i.drag:!1}},t)}function Tt(i,e){
return e===void 0?i:{...i,raw:e}}function Aa(i){if(!(i.buffer instanceof Uint8Array))throw new j("invalid-value","input \
event buffer must be Uint8Array","$.event.buffer");return new Uint8Array(i.buffer)}function qi(i){return{alt:!1,ctrl:i.ctrl,
meta:i.meta,shift:i.shift}}function ur(){return{alt:!1,ctrl:!1,meta:!1,shift:!1}}function Wa(i,e){const t=un(i??{},"$.ev\
ent.modifiers",!0),n=un(e??{},"$.options.modifiers",!0);return{alt:e?.alt===void 0?t.alt:n.alt,ctrl:e?.ctrl===void 0?t.ctrl:
n.ctrl,meta:e?.meta===void 0?t.meta:n.meta,shift:e?.shift===void 0?t.shift:n.shift}}function un(i,e,t){const n=$i(i,e,"m\
odifiers");_n(n,t?[]:_i,t?_i:[],e,"modifiers");const r={alt:!1,ctrl:!1,meta:!1,shift:!1};for(const o of _i){const s=n[o];
if(!(s===void 0&&t)){if(typeof s!="boolean")throw new j("invalid-value",`${o} modifier must be boolean`,`${e}.${o}`);r[o]=
s}}return Object.freeze(r)}function Pa(i,e){const t=$i(i,"$.raw","raw payload");if(_n(t,Oa,[],"$.raw","raw payload"),t.encoding!==
"base64")throw new j("invalid-value","raw encoding must be base64","$.raw.encoding");if(typeof t.data!="string")throw new j(
"invalid-value","raw data must be a string","$.raw.data");return Fa(t.data,e.maxRawBytes,"$.raw.data"),Object.freeze({encoding:"\
base64",data:t.data})}function Na(i,e){if(!(i instanceof Uint8Array))throw new j("invalid-value","raw input must be Uint\
8Array","$.event.raw");if(i.byteLength>e)throw new j("limit-exceeded",`raw payload exceeds ${e} bytes`,"$.raw.data");return Object.
freeze({encoding:"base64",data:Eo(i)})}function ja(i,e,t,n){const r=Hn(i,e,t,n);if(r===null||Array.isArray(r)||typeof r!=
"object")throw new j("invalid-shape","semantic data must be a plain JSON object",e);return r}function Hn(i,e,t,n){if(t>n.
limits.maxDepth)throw new j("limit-exceeded",`semantic data exceeds depth ${n.limits.maxDepth}`,e);if(n.nodes+=1,n.nodes>
n.limits.maxNodes)throw new j("limit-exceeded",`semantic data exceeds ${n.limits.maxNodes} nodes`,e);if(i===null||typeof i==
"boolean"||typeof i=="string")return i;if(typeof i=="number"){if(!Number.isFinite(i))throw new j("invalid-value","JSON n\
umbers must be finite",e);return Object.is(i,-0)?0:i}if(typeof i!="object")throw new j("invalid-value",`unsupported JSON\
 value ${typeof i}`,e);if(n.ancestors.has(i))throw new j("invalid-value","cyclic JSON value",e);n.ancestors.add(i);try{if(Array.
isArray(i))return Ba(i,e,t,n);const r=$i(i,e,"JSON object"),o={};for(const s of Object.keys(r).sort()){if(qa(s))throw new j(
"invalid-value",`reserved object key ${s}`,`${e}.${s}`);o[s]=Hn(r[s],et(e,s),t+1,n)}return Object.freeze(o)}finally{n.ancestors.
delete(i)}}function Ba(i,e,t,n){if(Object.getPrototypeOf(i)!==Array.prototype)throw new j("invalid-shape","JSON arrays m\
ust use Array.prototype",e);if(i.length>n.limits.maxNodes)throw new j("limit-exceeded",`JSON array exceeds ${n.limits.maxNodes}\
 entries`,e);const r=Ro(i,e);for(const s of r){if(typeof s!="string")throw new j("invalid-shape","JSON arrays cannot con\
tain symbol properties",e);if(s!=="length"&&!_a(s,i.length))throw new j("invalid-shape",`unexpected array property ${s}`,
et(e,s))}const o=[];for(let s=0;s<i.length;s+=1){const a=Mo(i,String(s),`${e}[${s}]`);if(!a)throw new j("invalid-shape",
"sparse JSON arrays are not allowed",`${e}[${s}]`);xo(a,`${e}[${s}]`),o.push(Hn(a.value,`${e}[${s}]`,t+1,n))}return Object.
freeze(o)}function $i(i,e,t){if(typeof i!="object"||i===null||Array.isArray(i))throw new j("invalid-shape",`${t} must be\
 a plain object`,e);let n;try{n=Object.getPrototypeOf(i)}catch(r){throw new j("invalid-shape",`${t} prototype is not ins\
pectable`,e,r)}if(n!==Object.prototype&&n!==null)throw new j("invalid-shape",`${t} cannot be an exotic or class instance`,
e);for(const r of Ro(i,e)){if(typeof r!="string")throw new j("invalid-shape",`${t} cannot contain symbol properties`,e);
const o=Mo(i,r,et(e,r));if(!o)throw new j("invalid-shape",`${t} property disappeared`,et(e,r));xo(o,et(e,r))}return i}function xo(i,e){
if(!("value"in i)||!i.enumerable)throw new j("invalid-shape","JSON properties must be enumerable data properties without\
 accessors",e)}function Ro(i,e){try{return Reflect.ownKeys(i)}catch(t){throw new j("invalid-shape","object keys are not \
inspectable",e,t)}}function Mo(i,e,t){try{return Object.getOwnPropertyDescriptor(i,e)}catch(n){throw new j("invalid-shap\
e","property descriptor is not inspectable",t,n)}}function _n(i,e,t,n,r){const o=[...e,...t];for(const s of Object.keys(
i))if(!o.includes(s))throw new j("unknown-field",`${r} contains unknown field ${s}`,et(n,s));for(const s of e)if(!Object.
hasOwn(i,s))throw new j("invalid-shape",`${r} is missing ${s}`,et(n,s))}function So(i,e){if(typeof i!="number"||!Number.
isSafeInteger(i)||i<0||Object.is(i,-0))throw new j("invalid-value","sequence must be a non-negative safe integer",e)}function Wt(i,e,t,n){
if(typeof i!="string"||!e.includes(i))throw new j("invalid-value",`${t} is not supported`,n);return i}function Oo(i){const e={
maxBytes:Kt(i?.maxBytes,Vt.maxBytes,"$.limits.maxBytes",1),maxDepth:Kt(i?.maxDepth,Vt.maxDepth,"$.limits.maxDepth",0),maxNodes:Kt(
i?.maxNodes,Vt.maxNodes,"$.limits.maxNodes",1),maxRawBytes:Kt(i?.maxRawBytes,Vt.maxRawBytes,"$.limits.maxRawBytes",0)};return Object.
freeze(e)}function Kt(i,e,t,n){if(i===void 0)return e;if(!Number.isSafeInteger(i)||i<n)throw new j("invalid-value",`limi\
t must be a safe integer >= ${n}`,t);return i}function La(i){return i==="remote"?"untrusted":i==="test"?"synthetic":"tru\
sted"}function Da(i,e,t,n){if(new TextEncoder().encode(i).byteLength>e)throw new j("limit-exceeded",`${n} exceeds ${e} U\
TF-8 bytes`,t)}function Fa(i,e,t){if(i.length%4!==0||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.
test(i))throw new j("invalid-value","raw data must be canonical base64",t);const n=i.endsWith("==")?2:i.endsWith("=")?1:
0,r=i.length===0?0:i.length/4*3-n;if(r>e)throw new j("limit-exceeded",`raw payload exceeds ${e} bytes`,t);const o=Ha(i,r);
if(Eo(o)!==i)throw new j("invalid-value","raw data must use canonical base64 padding bits",t)}function Eo(i){let e="";for(let t=0;t<
i.length;t+=3){const n=i[t],r=i[t+1],o=i[t+2],s=n<<16|(r??0)<<8|(o??0);e+=He[s>>>18&63],e+=He[s>>>12&63],e+=r===void 0?"\
=":He[s>>>6&63],e+=o===void 0?"=":He[s&63]}return e}function Ha(i,e){const t=new Uint8Array(e);let n=0;for(let r=0;r<i.length;r+=
4){const o=He.indexOf(i[r]),s=He.indexOf(i[r+1]),a=i[r+2]==="="?0:He.indexOf(i[r+2]),c=i[r+3]==="="?0:He.indexOf(i[r+3]),
d=o<<18|s<<12|a<<6|c;n<e&&(t[n++]=d>>>16&255),n<e&&(t[n++]=d>>>8&255),n<e&&(t[n++]=d&255)}return t}function _a(i,e){if(!/^(?:0|[1-9][0-9]*)$/.
test(i))return!1;const t=Number(i);return Number.isSafeInteger(t)&&t>=0&&t<e&&String(t)===i}function qa(i){return Ea.includes(
i)}function et(i,e){return/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(e)?`${i}.${e}`:`${i}[${JSON.stringify(e)}]`}const fn=1,Ua=1;
class W extends Error{constructor(e,t,n="$",r){super(`${t} at ${n}`,{cause:r}),this.code=e,this.path=n,this.cause=r,this.
name="PointerInputError"}}const To=["mouse","touch","pen"],Ga=["down","move","up","cancel","enter","leave","wheel"],Va=[
"screen","cell","local"],Ka=["pixel","line","page","cell"],Xa=["schemaVersion","sequence","timestamp","source","trust","\
modifiers","pointerId","device","kind","coordinates","primary","button","buttons"],Ya=["raw","pressure","tangentialPress\
ure","tiltX","tiltY","twist","contact","wheel"],Ja=["pointerId","kind","coordinates","primary","button","buttons"],fr=["\
pressure","tangentialPressure","tiltX","tiltY","twist","contact","wheel"],Ui=["key","buffer","x","y","movementX","moveme\
ntY","meta","ctrl","shift"],pr=128,Za=80,Qa=512;function Ai(i,e){const t=ze(i,"$","pointer event");if(we(t,Xa,Ya,"$","po\
inter event"),t.schemaVersion!==fn)throw new W("invalid-value",`unsupported pointer schema version ${String(t.schemaVersion)}`,
"$.schemaVersion");const n=Ii(t.device,To,"pointer device","$.device"),r=Ii(t.kind,Ga,"pointer kind","$.kind"),o={schemaVersion:Ht,
sequence:t.sequence,timestamp:t.timestamp,source:t.source,device:n,trust:t.trust,modifiers:t.modifiers,kind:zo(r)};t.raw!==
void 0&&(o.raw=t.raw);const s=ko(o,e),a=pt(t.pointerId,"$.pointerId"),c=rc(t.coordinates,"$.coordinates");if(typeof t.primary!=
"boolean")throw new W("invalid-value","primary must be boolean","$.primary");const d=lc(t.button,"$.button"),l=pn(t.buttons,
0,63,"buttons","$.buttons"),u=Yt(t.pressure,0,1,"pressure","$.pressure"),h=Yt(t.tangentialPressure,-1,1,"tangentialPress\
ure","$.tangentialPressure"),f=Yt(t.tiltX,-90,90,"tiltX","$.tiltX"),p=Yt(t.tiltY,-90,90,"tiltY","$.tiltY"),w=t.twist===void 0?
void 0:pn(t.twist,0,359,"twist","$.twist");if(n!=="pen"&&(h!==void 0||f!==void 0||p!==void 0||w!==void 0))throw new W("i\
nvalid-value","tangential pressure, tilt, and twist are only valid for pen input","$.device");const g=t.contact===void 0?
void 0:sc(t.contact,"$.contact"),R=t.wheel===void 0?void 0:ac(t.wheel,"$.wheel");if(r==="wheel"&&R===void 0)throw new W(
"invalid-shape","wheel events require a wheel delta","$.wheel");if(r!=="wheel"&&R!==void 0)throw new W("invalid-value","\
wheel delta is only valid for wheel events","$.wheel");const m={schemaVersion:fn,sequence:s.sequence,timestamp:s.timestamp,
source:s.source,trust:s.trust,modifiers:s.modifiers,pointerId:a,device:n,kind:r,coordinates:c,primary:t.primary,button:d,
buttons:l};return s.raw!==void 0&&(m.raw=s.raw),u!==void 0&&(m.pressure=u),h!==void 0&&(m.tangentialPressure=h),f!==void 0&&
(m.tiltX=f),p!==void 0&&(m.tiltY=p),w!==void 0&&(m.twist=w),g!==void 0&&(m.contact=g),R!==void 0&&(m.wheel=R),Object.freeze(
m)}function Co(i,e){return qn(i,"mouse",e)}function ec(i,e){return qn(i,"touch",e)}function tc(i,e){return qn(i,"pen",e)}
function qn(i,e,t){const n=Ii(e,To,"pointer device","$.device"),r=ze(t,"$.input","pointer adapter input");we(r,Ja,fr,"$.\
input","pointer adapter input");const o=ko(i);if(o.device!==n)throw new W("invalid-value",`envelope device ${o.device} d\
oes not match ${n} adapter`,"$.envelope.device");const s={schemaVersion:fn,sequence:o.sequence,timestamp:o.timestamp,source:o.
source,trust:o.trust,modifiers:o.modifiers,pointerId:r.pointerId,device:n,kind:r.kind,coordinates:r.coordinates,primary:r.
primary,button:r.button,buttons:r.buttons};o.raw!==void 0&&(s.raw=o.raw);for(const d of fr)r[d]!==void 0&&(s[d]=r[d]);const a=Ai(
s),c=zo(a.kind);if(o.kind!==c)throw new W("invalid-value",`envelope kind ${o.kind} does not match pointer kind ${a.kind}`,
"$.envelope.kind");return a}function ic(i,e,t={}){const n=cc(e),r=ze(t,"$.options","terminal mouse pointer options");we(
r,[],["pointerId","screen","local"],"$.options","terminal mouse pointer options");const o={cell:Object.freeze({space:"ce\
ll",x:n.x,y:n.y})};r.screen!==void 0&&(o.screen=r.screen),r.local!==void 0&&(o.local=r.local);let s,a=null,c=0,d;"scroll"in
n?(s="wheel",d=Object.freeze({deltaX:0,deltaY:n.scroll,unit:"line"})):"release"in n?(s=n.release?"up":n.drag?"move":"dow\
n",(s==="down"||s==="up")&&(a=n.button??null),(s==="down"||s==="move")&&(c=dc(n.button))):s="move";const l={pointerId:r.
pointerId===void 0?Ua:pt(r.pointerId,"$.options.pointerId"),kind:s,coordinates:o,primary:!0,button:a,buttons:c,...d===void 0?
{}:{wheel:d}};return Co(i,l)}const Xt=Object.freeze({maxOwners:256,maxCaptures:256,maxListeners:256,maxDiagnostics:64});
class nc{#e;#t=new Map;#i=new Map;#o=new Set;#n=[];#s=new Set;#r=0;#a=0;#d=!1;#u=!1;#w=!1;constructor(e={}){this.#e=uc(e)}get disposed(){
return this.#d}registerOwner(e){this.#v("registerOwner");const t=ze(e,"$.owner","pointer capture owner");we(t,["id","onP\
ointer"],[],"$.owner","pointer capture owner");const n=Ve(t.id,"$.owner.id");if(typeof t.onPointer!="function")throw new W(
"invalid-value","owner onPointer must be a function","$.owner.onPointer");if(this.#t.has(n))throw new W("duplicate",`poi\
nter owner ${n} is already registered`,"$.owner.id");if(this.#t.size>=this.#e.maxOwners)throw new W("limit-exceeded",`po\
inter owners exceed ${this.#e.maxOwners}`,"$.owner");const r={id:n,onPointer:t.onPointer,active:!0};return this.#t.set(n,
r),Object.freeze({id:n,dispose:()=>{r.active&&this.#p(r)},isDisposed:()=>!r.active})}disposeOwner(e){this.#v("disposeOwn\
er");const t=Ve(e,"$.ownerId"),n=this.#t.get(t);return n?(this.#p(n),!0):!1}subscribe(e){if(this.#v("subscribe"),typeof e!=
"function")throw new W("invalid-value","capture listener must be a function","$.listener");if(this.#o.has(e))throw new W(
"duplicate","capture listener is already registered","$.listener");if(this.#o.size>=this.#e.maxListeners)throw new W("li\
mit-exceeded",`capture listeners exceed ${this.#e.maxListeners}`,"$.listener");this.#o.add(e);let t=!0;return()=>{t&&(t=
!1,this.#o.delete(e))}}capture(e,t){this.#v("capture");const n=pt(e,"$.pointerId"),r=Ve(t,"$.ownerId");this.#h(n,"captur\
e");const o=this.#f(r),s=this.#i.get(n);if(s){const a=s===o?"duplicate":"capture-conflict";throw new W(a,`pointer ${n} i\
s already captured by ${s.id}`,"$.pointerId")}if(this.#i.size>=this.#e.maxCaptures)throw new W("limit-exceeded",`pointer\
 captures exceed ${this.#e.maxCaptures}`,"$.pointerId");this.#i.set(n,o),this.#l("captured",n,void 0,o.id)}transfer(e,t,n){
this.#v("transfer");const r=pt(e,"$.pointerId"),o=Ve(t,"$.fromOwnerId"),s=Ve(n,"$.toOwnerId");if(this.#h(r,"transfer"),o===
s)throw new W("duplicate","capture transfer owners must differ","$.toOwnerId");const a=this.#f(o),c=this.#f(s),d=this.#i.
get(r);if(!d)throw new W("not-found",`pointer ${r} is not captured`,"$.pointerId");if(d!==a)throw new W("capture-conflic\
t",`pointer ${r} is captured by ${d.id}, not ${o}`,"$.fromOwnerId");this.#i.set(r,c),this.#l("transferred",r,a.id,c.id)}release(e,t){
this.#v("release");const n=pt(e,"$.pointerId"),r=Ve(t,"$.ownerId"),o=this.#i.get(n);if(!o)return!1;if(o.id!==r)throw new W(
"capture-conflict",`pointer ${n} is captured by ${o.id}, not ${r}`,"$.ownerId");return this.#i.delete(n),this.#l("releas\
ed",n,o.id,void 0),!0}cancelAll(){return this.#v("cancelAll"),this.#m()}captureOwner(e){const t=pt(e,"$.pointerId");return this.#i.
get(t)?.id}route(e,t){this.#v("route");const n=Ai(e),r=t===void 0?void 0:Ve(t,"$.hitOwnerId"),o=this.#i.get(n.pointerId),
s=o!==void 0&&o.active,a=s?o:r===void 0?void 0:this.#t.get(r),c=n.kind==="up"||n.kind==="cancel",d=c&&!this.#s.has(n.pointerId);
d&&this.#s.add(n.pointerId);let l,u=!1;try{if(a?.active){u=!0;const f=Object.freeze({ownerId:a.id,...r===void 0?{}:{hitOwnerId:r},
captured:s});try{a.onPointer(n,f)}catch(p){l=mr(p),this.#c("owner-handler",p,n.pointerId,a.id)}}}finally{c&&this.#g(n.pointerId,
"auto-released"),d&&this.#s.delete(n.pointerId)}const h={pointerId:n.pointerId,kind:n.kind,delivered:u,captured:s};return r!==
void 0&&(h.hitOwnerId=r),a!==void 0&&(h.ownerId=a.id),l!==void 0&&(h.error=l),Object.freeze(h)}inspect(){const e=[...this.#i.
entries()].sort(([o],[s])=>o-s),t=Object.freeze(e.map(([o,s])=>Object.freeze({pointerId:o,ownerId:s.id}))),n=Object.freeze(
[...this.#t.values()].sort((o,s)=>o.id.localeCompare(s.id)).map(o=>{const s=Object.freeze(e.filter(([,a])=>a===o).map(([
a])=>a));return Object.freeze({id:o.id,capturedPointerIds:s})})),r=Object.freeze(this.#n.map(fc));return Object.freeze({
disposed:this.#d,revision:this.#r,listenerCount:this.#o.size,owners:n,captures:t,diagnostics:r})}clearDiagnostics(){this.#v(
"clearDiagnostics"),this.#n.length=0}dispose(){if(!(this.#d||this.#u)){this.#u=!0;try{this.#w||this.#m()}finally{for(const e of this.#t.
values())e.active=!1;this.#t.clear(),this.#i.clear(),this.#o.clear(),this.#s.clear(),this.#d=!0,this.#u=!1}}}#f(e){const t=this.#t.
get(e);if(!t?.active)throw new W("not-found",`pointer owner ${e} is not registered`,"$.ownerId");return t}#p(e){if(!e.active)
return;e.active=!1,this.#t.get(e.id)===e&&this.#t.delete(e.id);const t=[...this.#i.entries()].filter(([,r])=>r===e).sort(
([r],[o])=>r-o),n=[];for(const[r]of t)this.#i.delete(r),this.#s.has(r)||(this.#s.add(r),n.push(r));try{for(const[r]of t)
this.#l("owner-disposed",r,e.id,void 0)}finally{for(const r of n)this.#s.delete(r)}}#g(e,t){const n=this.#i.get(e);n&&(this.#i.
delete(e),this.#l(t,e,n.id,void 0))}#m(){if(this.#w)throw new W("invalid-state","capture cancellation is already in prog\
ress","$.controller");const e=[...this.#i.entries()].sort(([t],[n])=>t-n);this.#w=!0,this.#i.clear();try{for(const[t,n]of e)
this.#l("cancelled",t,n.id,void 0)}finally{this.#w=!1}return e.length}#h(e,t){if(this.#w||this.#s.has(e))throw new W("in\
valid-state",`cannot ${t} pointer ${e} during terminal capture cleanup`,"$.pointerId")}#l(e,t,n,r){this.#r=wr(this.#r,"c\
apture revision");const o=Object.freeze({revision:this.#r,kind:e,pointerId:t,...n===void 0?{}:{previousOwnerId:n},...r===
void 0?{}:{nextOwnerId:r}}),s=[...this.#o];for(const a of s)try{a(o)}catch(c){this.#c("capture-listener",c,t,r??n)}}#c(e,t,n,r){
if(this.#e.maxDiagnostics===0)return;this.#a=wr(this.#a,"diagnostic sequence");const o=Object.freeze({sequence:this.#a,phase:e,
...n===void 0?{}:{pointerId:n},...r===void 0?{}:{ownerId:r},error:mr(t)});this.#n.length===this.#e.maxDiagnostics&&this.#n.
shift(),this.#n.push(o)}#v(e){if(this.#d||this.#u)throw new W("disposed",`cannot ${e} a disposed capture controller`,"$.\
controller")}}function rc(i,e){const t=ze(i,e,"pointer coordinates");we(t,[],["screen","cell","local"],e,"pointer coordi\
nates");const n={};for(const r of Va)t[r]!==void 0&&(n[r]=oc(t[r],r,`${e}.${r}`));if(n.screen===void 0&&n.cell===void 0&&
n.local===void 0)throw new W("invalid-shape","at least one coordinate space is required",e);return Object.freeze(n)}function oc(i,e,t){
const n=ze(i,t,`${e} coordinate`);if(we(n,["space","x","y"],[],t,`${e} coordinate`),n.space!==e)throw new W("invalid-val\
ue",`${e} coordinate must declare space ${e}`,`${t}.space`);return Object.freeze({space:e,x:kt(n.x,"x",`${t}.x`),y:kt(n.
y,"y",`${t}.y`)})}function sc(i,e){const t=ze(i,e,"pointer contact");return we(t,["width","height"],[],e,"pointer contac\
t"),Object.freeze({width:wn(t.width,0,Number.MAX_VALUE,"contact width",`${e}.width`),height:wn(t.height,0,Number.MAX_VALUE,
"contact height",`${e}.height`)})}function ac(i,e){const t=ze(i,e,"pointer wheel delta");return we(t,["deltaX","deltaY",
"unit"],[],e,"pointer wheel delta"),Object.freeze({deltaX:kt(t.deltaX,"wheel deltaX",`${e}.deltaX`),deltaY:kt(t.deltaY,"\
wheel deltaY",`${e}.deltaY`),unit:Ii(t.unit,Ka,"wheel unit",`${e}.unit`)})}function cc(i){const e=ze(i,"$.event","termin\
al mouse event");if(Object.hasOwn(e,"scroll")?we(e,[...Ui,"drag","scroll"],[],"$.event","mouse scroll event"):Object.hasOwn(
e,"release")||Object.hasOwn(e,"button")?we(e,[...Ui,"drag","release","button"],[],"$.event","mouse press event"):we(e,Ui,
[],"$.event","mouse move event"),e.key!=="mouse")throw new W("invalid-value","terminal mouse key must be mouse","$.event\
.key");if(!(e.buffer instanceof Uint8Array))throw new W("invalid-value","terminal mouse buffer must be Uint8Array","$.ev\
ent.buffer");for(const t of["x","y","movementX","movementY"])kt(e[t],t,`$.event.${t}`);for(const t of["meta","ctrl","shi\
ft"])if(typeof e[t]!="boolean")throw new W("invalid-value",`${t} must be boolean`,`$.event.${t}`);if(Object.hasOwn(e,"sc\
roll")){if(typeof e.drag!="boolean")throw new W("invalid-value","drag must be boolean","$.event.drag");if(e.scroll!==-1&&
e.scroll!==0&&e.scroll!==1)throw new W("invalid-value","scroll must be -1, 0, or 1","$.event.scroll")}else if(Object.hasOwn(
e,"release")){if(typeof e.drag!="boolean"||typeof e.release!="boolean")throw new W("invalid-value","drag and release mus\
t be boolean","$.event");if(e.button!==void 0&&e.button!==0&&e.button!==1&&e.button!==2)throw new W("invalid-value","ter\
minal mouse button must be 0, 1, 2, or undefined","$.event.button");if(!e.release&&e.button===void 0)throw new W("invali\
d-value","non-release mouse events require a button","$.event.button")}return e}function zo(i){return i==="wheel"?"scrol\
l":"pointer"}function dc(i){return i===0?1:i===1?4:i===2?2:0}function pt(i,e){if(typeof i!="number"||!Number.isSafeInteger(
i)||i<0||Object.is(i,-0))throw new W("invalid-value","pointerId must be a non-negative safe integer",e);return i}function lc(i,e){
return i===null?null:pn(i,0,5,"button",e)}function pn(i,e,t,n,r){if(typeof i!="number"||!Number.isSafeInteger(i)||i<e||i>
t)throw new W("invalid-value",`${n} must be an integer from ${e} through ${t}`,r);return i}function kt(i,e,t){if(typeof i!=
"number"||!Number.isFinite(i))throw new W("invalid-value",`${e} must be finite`,t);return Object.is(i,-0)?0:i}function wn(i,e,t,n,r){
const o=kt(i,n,r);if(o<e||o>t)throw new W("invalid-value",`${n} must be from ${e} through ${t}`,r);return o}function Yt(i,e,t,n,r){
return i===void 0?void 0:wn(i,e,t,n,r)}function Ve(i,e){if(typeof i!="string"||i.length===0||i.length>pr||hc(i))throw new W(
"invalid-value",`owner id must be 1-${pr} printable characters`,e);return i}function hc(i){for(let e=0;e<i.length;e+=1)if(i.
charCodeAt(e)<=31)return!0;return!1}function uc(i){const e=ze(i,"$.options","pointer capture options");return we(e,[],["\
maxOwners","maxCaptures","maxListeners","maxDiagnostics"],"$.options","pointer capture options"),Object.freeze({maxOwners:Jt(
e.maxOwners,Xt.maxOwners,1,"$.options.maxOwners"),maxCaptures:Jt(e.maxCaptures,Xt.maxCaptures,1,"$.options.maxCaptures"),
maxListeners:Jt(e.maxListeners,Xt.maxListeners,1,"$.options.maxListeners"),maxDiagnostics:Jt(e.maxDiagnostics,Xt.maxDiagnostics,
0,"$.options.maxDiagnostics")})}function Jt(i,e,t,n){if(i===void 0)return e;if(typeof i!="number"||!Number.isSafeInteger(
i)||i<t||i>1e5)throw new W("invalid-value",`controller limit must be an integer from ${t} through 100000`,n);return i}function wr(i,e){
if(i===Number.MAX_SAFE_INTEGER)throw new W("limit-exceeded",`${e} exhausted`,"$.controller");return i+1}function mr(i){let e="\
Error",t="pointer callback failed";try{i instanceof Error?(e=typeof i.name=="string"&&i.name.length>0?i.name:e,t=typeof i.
message=="string"?i.message:t):t=String(i)}catch{}return Object.freeze({name:e.slice(0,Za),message:t.slice(0,Qa)})}function fc(i){
return Object.freeze({sequence:i.sequence,phase:i.phase,...i.pointerId===void 0?{}:{pointerId:i.pointerId},...i.ownerId===
void 0?{}:{ownerId:i.ownerId},error:Object.freeze({...i.error})})}function ze(i,e,t){if(typeof i!="object"||i===null||Array.
isArray(i))throw new W("invalid-shape",`${t} must be a plain object`,e);let n;try{n=Object.getPrototypeOf(i)}catch(s){throw new W(
"invalid-shape",`${t} prototype is not inspectable`,e,s)}if(n!==Object.prototype&&n!==null)throw new W("invalid-shape",`${t}\
 cannot be an exotic or class instance`,e);let r;try{r=Reflect.ownKeys(i)}catch(s){throw new W("invalid-shape",`${t} key\
s are not inspectable`,e,s)}const o=Object.create(null);for(const s of r){if(typeof s!="string")throw new W("invalid-sha\
pe",`${t} cannot contain symbol properties`,e);let a;try{a=Object.getOwnPropertyDescriptor(i,s)}catch(c){throw new W("in\
valid-shape",`${t} property is not inspectable`,xi(e,s),c)}if(!a||!("value"in a)||!a.enumerable)throw new W("invalid-sha\
pe",`${t} properties must be enumerable data properties without accessors`,xi(e,s));o[s]=a.value}return o}function we(i,e,t,n,r){
const o=[...e,...t];for(const s of Object.keys(i))if(!o.includes(s))throw new W("unknown-field",`${r} contains unknown f\
ield ${s}`,xi(n,s));for(const s of e)if(!Object.hasOwn(i,s))throw new W("invalid-shape",`${r} is missing ${s}`,xi(n,s))}
function Ii(i,e,t,n){if(typeof i!="string"||!e.includes(i))throw new W("invalid-value",`${t} is not supported`,n);return i}
function xi(i,e){return/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(e)?`${i}.${e}`:`${i}[${JSON.stringify(e)}]`}class pc{kind="brow\
ser";size;input;lifecycle;#e;#t;constructor(e){const t=e.cellWidth??10,n=e.cellHeight??20;this.size=new Ie(e.columns&&e.
rows?{columns:e.columns,rows:e.rows}:gr(e.root,t,n),{deepObserve:!0}),this.input=e.input??new wc(e.root,{cellWidth:t,cellHeight:n,
touchAction:e.touchAction,userSelect:e.userSelect,textInput:e.textInput}),this.lifecycle=e.lifecycle??new ka("browser"),
this.#e=e.scheduler??Ic(),"ResizeObserver"in globalThis&&(this.#t=new ResizeObserver(()=>{const r=gr(e.root,t,n),o=this.
size.peek();(r.columns!==o.columns||r.rows!==o.rows)&&(o.columns=r.columns,o.rows=r.rows)}),this.#t.observe(e.root))}now(){
return this.#e.now()}scheduleFrame(e){const t=this.#e.request(()=>e());return{dispose:()=>this.#e.cancel(t)}}dispose(){this.#t?.
disconnect(),this.input.dispose(),this.lifecycle.stop()}}class wc{#e;#t;#i;#o;#n;#s;#r;#a;#d=!1;#u=[];#w;#f;#p;constructor(e,t={}){
this.#e=e,this.#t=Math.max(1,t.cellWidth??10),this.#i=Math.max(1,t.cellHeight??20),this.#o=t.touchAction??"none",this.#n=
t.userSelect??"none",this.#s=t.textInput??"auto",this.#r=new bo({now:t.now??(()=>performance.now())})}attach(e){this.detach(),
this.#a=e,this.#e.tabIndex=this.#e.tabIndex<0?0:this.#e.tabIndex,this.#w=mc(this.#e,this.#o,this.#n);const t=this.#N();this.#u=
[Re(t,"keydown",n=>this.#g(n)),Re(this.#e,"pointerdown",n=>this.#m(n,"down"),{passive:!1}),Re(this.#e,"pointermove",n=>this.#h(
n),{passive:!1}),Re(this.#e,"pointerup",n=>this.#m(n,"up"),{passive:!1}),Re(this.#e,"pointercancel",n=>this.#m(n,"cancel"),
{passive:!1}),Re(this.#e,"wheel",n=>this.#c(n),{passive:!1}),Re(t,"input",n=>this.#y(n),{passive:!1}),Re(t,"paste",n=>this.#v(
n),{passive:!1}),Re(t,"focus",()=>this.#x(!0)),Re(t,"blur",()=>this.#x(!1))],this.#d=!0}detach(){for(const e of this.#u)
e();this.#u=[],this.#w?.(),this.#w=void 0,this.#p?.(),this.#p=void 0,this.#f=void 0,this.#a=void 0,this.#d=!1}dispose(){
this.detach()}inspect(){return{attached:this.#d,kind:"browser"}}#g(e){const t=kc(e);t&&(this.#a?.emit("keyPress",{key:t,
meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new TextEncoder().encode(e.key.length===1?e.key:e.code)}),
e.preventDefault())}#m(e,t){const n=t!=="down",r=vr(e);try{t==="down"&&!r?(e.button===0&&this.#e.ownerDocument?.getSelection()?.
removeAllRanges(),(this.#f??this.#e).focus({preventScroll:!0}),this.#e.setPointerCapture?.(e.pointerId)):this.#e.hasPointerCapture?.(
e.pointerId)&&this.#e.releasePointerCapture?.(e.pointerId)}catch{}const o=this.#b(e);this.#l(e,t,o),this.#a?.emit("mouse\
Press",{key:"mouse",x:o.x,y:o.y,movementX:e.movementX,movementY:e.movementY,meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.
shiftKey,buffer:new Uint8Array,drag:!1,release:n,button:n?void 0:Gi(e.button)}),r||e.preventDefault()}#h(e){const t=this.#b(
e);this.#l(e,"move",t),e.buttons!==0&&(this.#a?.emit("mousePress",{key:"mouse",x:t.x,y:t.y,movementX:e.movementX,movementY:e.
movementY,meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new Uint8Array,drag:!0,release:!1,button:Gi(e.
button)}),vr(e)||e.preventDefault())}#l(e,t,n){const r=vc(e.pointerType),o=this.#e.getBoundingClientRect(),s=this.#r.create(
"browser",{kind:"pointer",device:r,modifiers:{alt:e.altKey===!0,ctrl:e.ctrlKey===!0,meta:e.metaKey===!0,shift:e.shiftKey===
!0},data:{phase:t,pointerId:yr(e.pointerId)}}),a={pointerId:yr(e.pointerId),kind:t,coordinates:{screen:{space:"screen",x:Zt(
e.screenX),y:Zt(e.screenY)},cell:{space:"cell",x:n.x,y:n.y},local:{space:"local",x:Zt(e.clientX-o.left),y:Zt(e.clientY-o.
top)}},primary:e.isPrimary!==!1,button:t==="down"||t==="up"?Gi(e.button)??null:null,buttons:t==="up"||t==="cancel"?0:yc(
e.buttons,t),...bc(e,r)};let c;r==="touch"?c=ec(s,a):r==="pen"?c=tc(s,a):c=Co(s,a),this.#a?.emit("pointerInput",c)}#c(e){
const t=this.#b(e);this.#a?.emit("mouseScroll",{key:"mouse",x:t.x,y:t.y,movementX:0,movementY:e.deltaY,meta:e.metaKey||e.
altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new Uint8Array,drag:!1,scroll:e.deltaY>0?1:e.deltaY<0?-1:0}),e.preventDefault()}#v(e){
const t=e.clipboardData?.getData("text")??"";this.#a?.emit("paste",{key:"paste",text:t,buffer:new TextEncoder().encode(t)}),
e.preventDefault()}#y(e){const t=e.target,n=typeof t.value=="string"?t.value:"";if(n){t.value="";for(const r of n)this.#$(
r);e.preventDefault()}}#x(e){this.#a?.emit("terminalFocus",{key:"focus",focused:e,buffer:new Uint8Array})}#b(e){const t=this.#e.
getBoundingClientRect();return{x:Math.max(0,Math.floor((e.clientX-t.left)/this.#t)),y:Math.max(0,Math.floor((e.clientY-t.
top)/this.#i))}}focus(){(this.#f??this.#e).focus({preventScroll:!0})}#N(){const e=this.#s!==!1&&this.#s!=="target"?gc(this.#e):
void 0;return e?(this.#f=e.element,this.#p=e.dispose,e.element):(this.#f=this.#e,this.#e)}#$(e){const t=e===`
`||e==="\r"?"return":e===" "?"space":e.toLowerCase();this.#a?.emit("keyPress",{key:t,meta:!1,ctrl:!1,shift:!1,buffer:new TextEncoder().
encode(e)})}}function gr(i,e,t){const n=i.getBoundingClientRect();return{columns:Math.max(1,Math.floor(n.width/e)),rows:Math.
max(1,Math.floor(n.height/t))}}function Re(i,e,t,n){return i.addEventListener(e,t,n),()=>i.removeEventListener(e,t,n)}function mc(i,e,t){
const n=i.style;if(!n)return()=>{};const r=n.touchAction,o=n.userSelect,s=n.webkitUserSelect;return n.touchAction=e,n.userSelect=
t,n.webkitUserSelect=t,()=>{n.touchAction=r,n.userSelect=o,n.webkitUserSelect=s}}function gc(i){const e=i.ownerDocument??
globalThis.document;if(!e?.createElement)return;const t=e.createElement("textarea");return t.tabIndex=0,t.setAttribute("\
aria-hidden","true"),t.setAttribute("autocapitalize","off"),t.setAttribute("autocomplete","off"),t.setAttribute("autocor\
rect","off"),t.setAttribute("spellcheck","false"),globalThis.matchMedia?.("(pointer: coarse)").matches&&(t.setAttribute(
"inputmode","none"),t.setAttribute("virtualkeyboardpolicy","manual")),t.style.position="fixed",t.style.left="0",t.style.
top="0",t.style.width="1px",t.style.height="1px",t.style.opacity="0",t.style.pointerEvents="none",t.style.zIndex="-1",t.
style.resize="none",t.style.border="0",t.style.padding="0",t.style.margin="0",(e.body??i).appendChild(t),{element:t,dispose:()=>t.
remove()}}function vr(i){return typeof Element<"u"&&i.composedPath().some(e=>e instanceof Element&&e.hasAttribute("data-\
exotui-selectable"))}function Gi(i){return i===0||i===1||i===2?i:0}function vc(i){return i==="touch"||i==="pen"?i:"mouse"}
function yr(i){return Number.isSafeInteger(i)&&i>=0?i:0}function yc(i,e){return Number.isSafeInteger(i)&&i>=0&&i<=63?i:e===
"down"||e==="move"?1:0}function Zt(i){return Number.isFinite(i)?i:0}function bc(i,e){const t={};return Number.isFinite(i.
pressure)&&i.pressure>=0&&i.pressure<=1&&(t.pressure=i.pressure),(e==="touch"||e==="pen")&&Number.isFinite(i.width)&&i.width>=
0&&Number.isFinite(i.height)&&i.height>=0&&(t.contact={width:i.width,height:i.height}),e==="pen"&&(Number.isFinite(i.tangentialPressure)&&
i.tangentialPressure>=-1&&i.tangentialPressure<=1&&(t.tangentialPressure=i.tangentialPressure),Number.isFinite(i.tiltX)&&
i.tiltX>=-90&&i.tiltX<=90&&(t.tiltX=i.tiltX),Number.isFinite(i.tiltY)&&i.tiltY>=-90&&i.tiltY<=90&&(t.tiltY=i.tiltY),Number.
isSafeInteger(i.twist)&&i.twist>=0&&i.twist<=359&&(t.twist=i.twist)),t}function kc(i){if(i.key.length===1)return i.key===
" "?"space":i.key.toLowerCase();const e={Enter:"return",Tab:"tab",Backspace:"backspace",Escape:"escape",ArrowUp:"up",ArrowDown:"\
down",ArrowLeft:"left",ArrowRight:"right",Delete:"delete",Insert:"insert",PageUp:"pageup",PageDown:"pagedown",Home:"home",
End:"end"};if(i.key in e)return e[i.key];if(/^F([1-9]|1[0-2])$/.test(i.key))return i.key.toLowerCase()}function Ic(){const i=globalThis.
requestAnimationFrame??(t=>setTimeout(()=>t(performance.now()),16.666666666666668)),e=globalThis.cancelAnimationFrame??(t=>clearTimeout(
t));return{request:t=>i(t),cancel:t=>e(t),now:()=>performance.now()}}class xc extends vo{root;element;platform;sink;canvas;renderLoop;#e=!1;#t;#i;constructor(e){
super(),this.root=e.root,this.element=e.canvas??document.createElement("canvas"),e.canvas||this.root.appendChild(this.element),
this.sink=e.sink??new ga({canvas:this.element,...e.sinkOptions}),this.platform=new pc({root:e.root,columns:e.columns,rows:e.
rows,cellWidth:e.sinkOptions?.cellWidth,cellHeight:e.sinkOptions?.cellHeight,...e.platformOptions}),this.canvas=new ea({
sink:this.sink,size:this.platform.size}),this.renderLoop=new sa({intervalMs:e.refreshRate??1e3/60,tick:()=>this.canvas.render()})}focus(){
this.platform.input.focus?.()}start(){if(this.#e)return;this.#e=!0,this.platform.lifecycle.start(),this.platform.input.attach(
this),this.#t=this.canvas.on("render",()=>this.emit("render"));const e=()=>this.canvas.render();this.platform.size.subscribe(
e),this.#i=()=>this.platform.size.unsubscribe(e),this.renderLoop.start()}stop(){this.#e&&(this.#e=!1,this.renderLoop.stop(),
this.platform.input.detach(),this.platform.lifecycle.stop(),this.#t?.(),this.#t=void 0,this.#i?.(),this.#i=void 0)}destroy(){
this.stop(),this.platform.dispose(),this.emit("destroy"),this.off()}inspectHost(){return{running:this.#e,size:{...this.platform.
size.peek()},renderLoop:this.renderLoop.inspect(),sink:this.sink.inspectSink()}}}function Rc(i){return new xc(i)}const Ae=[
{id:"vhs",label:"vhs — tape tremor, tracking, bleed",options:[{key:"tracking",label:"tracking",min:0,max:1,step:.1,value:.3},
{key:"noise",label:"tape noise",min:0,max:.5,step:.05,value:.1},{key:"bleed",label:"chroma bleed",min:0,max:3,step:.25,value:1}],
body:`
      vec2 uv = fragCoord / iResolution.xy;
      float track = u_tracking * iMagnet * 2.0;
      float line = floor(fragCoord.y);
      // Per-line tremor, re-rolled at tape speed; the magnetized tube shakes
      // the transport harder.
      float wobble = (shaderHash(vec2(line, floor(iTime * 60.0))) - 0.5) * 0.0025 * (0.4 + track);
      // A tracking band rolls up the tube, shearing and lightening the tape.
      float band = fract(uv.y * 0.7 + iTime * 0.11);
      float inBand = smoothstep(0.0, 0.04, band) * (1.0 - smoothstep(0.05, 0.12, band));
      wobble += inBand * track * 0.03 * (shaderHash(vec2(line, floor(iTime * 24.0))) - 0.3);
      vec2 shifted = vec2(uv.x + wobble, uv.y);
      // Luma stays sharp; chroma smears sideways, the composite signature.
      float px = u_bleed * iMagnet * 2.0 / iResolution.x;
      vec3 color;
      color.r = sampleChannel(vec2(shifted.x + px * 1.5, shifted.y)).r;
      color.g = sampleChannel(shifted).g;
      color.b = sampleChannel(vec2(shifted.x - px * 1.5, shifted.y)).b;
      float sparkle = shaderHash(vec2(fragCoord.x * 0.37 + iTime * 91.0, line * 1.7 + iTime * 57.0));
      float grain = u_noise * iMagnet * 2.0 * (0.35 + inBand * 2.0);
      // The head-switch stripe lives at the bottom of the picture.
      if (uv.y < 0.025) grain += 0.5 * track;
      color += (sparkle - 0.5) * grain;
      fragColor = vec4(color, 1.0);
    `},{id:"crt",label:"crt — curvature, vignette, fringe",options:[{key:"curve",label:"curvature",min:0,max:.25,step:.02,
value:.04},{key:"vignette",label:"vignette",min:0,max:.8,step:.05,value:.25},{key:"fringe",label:"chroma fringe",min:0,max:.004,
step:4e-4,value:4e-4}],body:`
      vec2 uv = fragCoord / iResolution.xy;
      vec2 centered = uv * 2.0 - 1.0;
      // Tangent at the edge midpoints (r = 1): distortion vanishes there, so
      // the picture stays flush with its container where the eye lines up
      // rows, and only the corners pull in.
      centered *= 1.0 + u_curve * (dot(centered, centered) - 1.0);
      uv = (centered + 1.0) * 0.5;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }
      vec3 color = sampleChannel(uv).rgb;
      float dim = max(0.0, 1.0 - u_vignette * iMagnet * 2.0 * pow(length(centered), 3.0));
      color *= dim;
      float fringe = u_fringe * iMagnet * 2.0;
      color.r = sampleChannel(uv + vec2(fringe, 0.0)).r * dim;
      color.b = sampleChannel(uv - vec2(fringe, 0.0)).b * dim;
      fragColor = vec4(color, 1.0);
    `},{id:"phosphor",label:"phosphor — glow and persistence",options:[{key:"glow",label:"glow",min:0,max:2,step:.15,value:.9}],
body:`
      vec2 uv = fragCoord / iResolution.xy;
      vec3 color = sampleChannel(uv).rgb;
      vec3 glow = vec3(0.0);
      for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
          glow += sampleChannel(uv + vec2(float(x), float(y)) / iResolution.xy * 1.6).rgb;
        }
      }
      glow /= 25.0;
      color = color + glow * glow * u_glow * iMagnet * 2.0;
      color *= mix(vec3(1.0), vec3(0.94, 1.03, 0.96), min(1.0, iMagnet * 2.0));
      fragColor = vec4(color, 1.0);
    `},{id:"scanlines",label:"scanlines — the raster's lines",options:[{key:"strength",label:"strength",min:0,max:.5,step:.04,
value:.14},{key:"period",label:"spacing",min:2,max:6,step:1,value:3}],body:`
      vec2 uv = fragCoord / iResolution.xy;
      vec3 color = sampleChannel(uv).rgb;
      float line = mod(fragCoord.y, u_period) < 1.0 ? max(0.0, 1.0 - u_strength * iMagnet * 2.0) : 1.0;
      fragColor = vec4(color * line, 1.0);
    `},{id:"degauss",label:"degauss — the coil magnetizes",options:[{key:"rate",label:"drift rate",min:.02,max:5,step:.02,
value:.02}],body:`
      vec2 uv = fragCoord / iResolution.xy;
      float settle = exp(-2.6 * iThump);
      float wob = sin(iThump * 34.0 - uv.y * 9.0) * settle;
      vec2 centered = uv - 0.5;
      float radius = length(centered);
      float angle = wob * 0.10 * radius + iMagnet * 0.05 * sin(iTime * 0.4) * radius;
      mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      vec2 sheared = centered + vec2(iMagnet * 0.008 * sin(uv.y * 21.0 + iTime * 0.7), 0.0);
      vec2 shoved = clamp(0.5 + rotate * sheared * (1.0 + wob * 0.05), 0.0, 1.0);
      float fringe = settle * 0.010 * (0.3 + radius) + iMagnet * 0.004 * radius;
      vec3 color;
      color.r = sampleChannel(clamp(shoved + vec2(fringe * (0.4 + 0.6 * sin(iThump * 40.0)), 0.0), 0.0, 1.0)).r;
      color.g = sampleChannel(shoved).g;
      color.b = sampleChannel(clamp(shoved - vec2(fringe * (0.4 + 0.6 * sin(iThump * 47.0 + 1.0)), 0.0), 0.0, 1.0)).b;
      // The magnetized tube loses colour purity at the corners — the classic
      // green/purple stains, breathing slowly, gone the moment you degauss.
      float stain = iMagnet * smoothstep(0.32, 0.72, radius);
      float theta = atan(centered.y, centered.x) * 2.0 + iTime * 0.05;
      color *= 1.0 + stain * 0.45 * vec3(sin(theta), sin(theta + 2.1), sin(theta + 4.2));
      float sweep = 6.0 * radius - iThump * 20.0;
      color += 0.22 * settle * settle * vec3(sin(sweep), sin(sweep + 2.1), sin(sweep + 4.2));
      fragColor = vec4(color, 1.0);
    `}],Mc=`#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;function Sc(i){return`#version 300 es
precision highp float;
uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform float iTime;
uniform float iFlip;
uniform float iMagnet;
uniform float iThump;
${(i.options??[]).map(t=>`uniform float u_${t.key};`).join(`
`)}
out vec4 outColor;
float shaderHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
vec4 sampleChannel(vec2 uv) {
  return texture(iChannel0, iFlip > 0.5 ? vec2(uv.x, 1.0 - uv.y) : uv);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
${i.body}
}
void main() {
  mainImage(outColor, gl_FragCoord.xy);
}
`}function Oc(i,e){const t=document.createElement("canvas");t.style.position="absolute",t.style.inset="0",t.style.width=
"100%",t.style.height="100%",t.style.pointerEvents="none",t.style.display="none",getComputedStyle(i).position==="static"&&
(i.style.position="relative"),i.appendChild(t);let n=null,r=null;const o=new Map,s=[];let a="";const c=new Set,d=new Map;
for(const v of Ae)d.set(v.id,new Map((v.options??[]).map(y=>[y.key,y.value])));let l=0,u=-1/0,h=.02,f=0,p;const w=1.3,g=performance.
now(),R=()=>{l&&cancelAnimationFrame(l),l=0,t.style.display="none",e.style.visibility="visible"},m=v=>{const y=v.createTexture();
return v.bindTexture(v.TEXTURE_2D,y),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MIN_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,
v.TEXTURE_MAG_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_S,v.CLAMP_TO_EDGE),v.texParameteri(v.TEXTURE_2D,
v.TEXTURE_WRAP_T,v.CLAMP_TO_EDGE),y},M=()=>{if(n)return n;if(n=t.getContext("webgl2"),!n)return null;const v=n,y=v.createBuffer();
return v.bindBuffer(v.ARRAY_BUFFER,y),v.bufferData(v.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),v.STATIC_DRAW),r=m(
v),v},I=v=>{const y=o.get(v.id);if(y)return y;const x=M();if(!x)return;const D=(Z,de)=>{const S=x.createShader(Z);return S?
(x.shaderSource(S,de),x.compileShader(S),x.getShaderParameter(S,x.COMPILE_STATUS)?S:null):null},C=D(x.VERTEX_SHADER,Mc),
N=D(x.FRAGMENT_SHADER,Sc(v));if(!C||!N)return;const B=x.createProgram();if(!B||(x.attachShader(B,C),x.attachShader(B,N),
x.linkProgram(B),!x.getProgramParameter(B,x.LINK_STATUS)))return;const H=x.getAttribLocation(B,"position");x.enableVertexAttribArray(
H),x.vertexAttribPointer(H,2,x.FLOAT,!1,0,0);const J=new Map;for(const Z of["iChannel0","iResolution","iTime","iFlip","i\
Magnet","iThump"])J.set(Z,x.getUniformLocation(B,Z));for(const Z of v.options??[])J.set(`u_${Z.key}`,x.getUniformLocation(
B,`u_${Z.key}`));const U={program:B,uniforms:J};return o.set(v.id,U),U},E=(v,y,x)=>{const D=`${y}x${x}`;if(!(a===D&&s.length===
2)){for(a=D;s.length<2;)s.push({texture:m(v),framebuffer:v.createFramebuffer()});for(const C of s)v.bindTexture(v.TEXTURE_2D,
C.texture),v.texImage2D(v.TEXTURE_2D,0,v.RGBA,y,x,0,v.RGBA,v.UNSIGNED_BYTE,null),v.bindFramebuffer(v.FRAMEBUFFER,C.framebuffer),
v.framebufferTexture2D(v.FRAMEBUFFER,v.COLOR_ATTACHMENT0,v.TEXTURE_2D,C.texture,0);v.bindFramebuffer(v.FRAMEBUFFER,null)}},
$=()=>{try{if(p??=new AudioContext,p.resume().catch(()=>{}),p.state!=="running")return;const v=p.currentTime,y=p.createGain();
y.gain.setValueAtTime(.5,v),y.gain.exponentialRampToValueAtTime(5e-4,v+1.2),y.connect(p.destination);const x=p.createOscillator();
x.type="sine",x.frequency.setValueAtTime(130,v),x.frequency.exponentialRampToValueAtTime(32,v+.5),x.connect(y),x.start(v),
x.stop(v+1.2);const D=p.createOscillator();D.type="sawtooth",D.frequency.value=50;const C=p.createGain();C.gain.setValueAtTime(
.06,v),C.gain.exponentialRampToValueAtTime(5e-4,v+.9),D.connect(C),C.connect(y),D.start(v),D.stop(v+1);const N=p.createBufferSource(),
B=p.createBuffer(1,Math.floor(p.sampleRate*.4),p.sampleRate),H=B.getChannelData(0);for(let Z=0;Z<H.length;Z+=1)H[Z]=(Math.
random()*2-1)*(1-Z/H.length);N.buffer=B;const J=p.createBiquadFilter();J.type="lowpass",J.frequency.value=900;const U=p.
createGain();U.gain.value=.18,N.connect(J),J.connect(U),U.connect(y),N.start(v)}catch{}},F=()=>Ae.filter(v=>c.has(v.id)&&
I(v)!==void 0),L=()=>{const v=F(),y=performance.now(),x=(y-u)/1e3,D=f?Math.min(.25,(y-f)/1e3):0;if(f=y,c.has("degauss")){
const H=d.get("degauss")?.get("rate")??1;h=Math.min(1,h+D*H/300)}if(v.length===0){if(x>=w){R();return}const H=Ae.find(J=>J.
id==="degauss");H&&I(H)&&v.push(H)}if(!n||v.length===0)return;const C=n;(t.width!==e.width||t.height!==e.height)&&(t.width=
e.width,t.height=e.height),C.viewport(0,0,t.width,t.height),E(C,t.width,t.height),C.activeTexture(C.TEXTURE0),C.bindTexture(
C.TEXTURE_2D,r);try{C.texImage2D(C.TEXTURE_2D,0,C.RGBA,C.RGBA,C.UNSIGNED_BYTE,e)}catch{l=requestAnimationFrame(L);return}
const N=(performance.now()-g)/1e3;let B=r;for(let H=0;H<v.length;H+=1){const J=v[H],U=o.get(J.id),de=H===v.length-1?null:
s[H%2];C.bindFramebuffer(C.FRAMEBUFFER,de?de.framebuffer:null),C.useProgram(U.program),C.bindTexture(C.TEXTURE_2D,B),C.uniform2f(
U.uniforms.get("iResolution")??null,t.width,t.height),C.uniform1f(U.uniforms.get("iTime")??null,N),C.uniform1i(U.uniforms.
get("iChannel0")??null,0),C.uniform1f(U.uniforms.get("iFlip")??null,H===0?1:0),C.uniform1f(U.uniforms.get("iMagnet")??null,
h),C.uniform1f(U.uniforms.get("iThump")??null,Math.min(x,60));const S=d.get(J.id);for(const P of J.options??[])C.uniform1f(
U.uniforms.get(`u_${P.key}`)??null,S?.get(P.key)??P.value);C.drawArrays(C.TRIANGLES,0,3),de&&(B=de.texture)}l=requestAnimationFrame(
L)},G=()=>{if(F().length===0){c.clear(),R();return}t.style.display="block",e.style.visibility="hidden",l||(l=requestAnimationFrame(
L))};return{list:()=>Ae,enabled:()=>Ae.filter(v=>c.has(v.id)).map(v=>v.id),toggle(v){c.has(v)?c.delete(v):Ae.some(y=>y.id===
v)&&c.add(v),G()},setEnabled(v){c.clear();for(const y of v)Ae.some(x=>x.id===y)&&c.add(y);G()},option:(v,y)=>d.get(v)?.get(
y),magnetism:()=>h,warpPoint(v,y){if(!l)return{u:v,v:y};const x=B=>Math.min(1,Math.max(0,B));let D=x(v),C=1-x(y);if(c.has(
"degauss")){const B=(performance.now()-g)/1e3,H=Math.min((performance.now()-u)/1e3,60),J=Math.exp(-2.6*H),U=Math.sin(H*34-
C*9)*J,Z=D-.5,de=C-.5,S=Math.hypot(Z,de),P=U*.1*S+h*.05*Math.sin(B*.4)*S,ie=Math.cos(P),b=Math.sin(P),O=Z+h*.008*Math.sin(
C*21+B*.7),T=1+U*.05;D=x(.5+(ie*O+b*de)*T),C=x(.5+(-b*O+ie*de)*T)}const N=d.get("crt")?.get("curve")??0;if(c.has("crt")&&
N!==0){const B=D*2-1,H=C*2-1,J=1+N*(B*B+H*H-1);D=(B*J+1)/2,C=(H*J+1)/2}return{u:D,v:1-C}},degauss(){h=.02;const v=Ae.find(
y=>y.id==="degauss");!v||!I(v)||(u=performance.now(),$(),t.style.display="block",e.style.visibility="hidden",l||(l=requestAnimationFrame(
L)))},setOption(v,y,x){const C=Ae.find(N=>N.id===v)?.options?.find(N=>N.key===y);C&&d.get(v)?.set(y,Math.min(C.max,Math.
max(C.min,x)))},dispose(){R(),p?.close().catch(()=>{}),p=void 0,t.remove()}}}function Ec(i){const e=Rc({root:i.root,sinkOptions:{
cellWidth:9,cellHeight:18,font:"14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",...i.host?.sinkOptions??{}},
...i.host??{}}),t=()=>e.platform.size.peek().columns,n=()=>e.platform.size.peek().rows,r=[],o=()=>{for(let f=r.length;f<
n();f+=1){const p=new Ie(""),w=f;r.push(p),new Zs({canvas:e.canvas,rectangle:new Hs(()=>({column:0,row:w,width:e.platform.
size.value.columns})),value:p,overwriteRectangle:!0,multiCodePointSupport:!0,style:g=>g,zIndex:1}).draw()}};o();const s={
gpu:typeof navigator<"u"&&navigator.gpu!==void 0,audioInput:typeof navigator<"u"&&navigator.mediaDevices!==void 0,extras:i.
extras},a=new Map;let c=!1;const d=f=>f.preventDefault();i.root.addEventListener("contextmenu",d);const l=Oc(i.root,e.element),
u=(f,p)=>{const w=e.platform.size.peek(),g=l.warpPoint((f+.5)/w.columns,(p+.5)/w.rows);return{x:Math.min(w.columns-1,Math.
max(0,Math.floor(g.u*w.columns))),y:Math.min(w.rows-1,Math.max(0,Math.floor(g.v*w.rows)))}},h=f=>{const p=f.coordinates.
cell;if(!p)return f;const w=u(p.x,p.y);return w.x===p.x&&w.y===p.y?f:{...f,coordinates:{...f.coordinates,cell:{...p,x:w.
x,y:w.y}}}};return e.start(),{host:e,shader:l,focus:()=>e.focus(),capabilities:s,size:()=>({columns:t(),rows:n()}),onResize(f){
const p=()=>{o(),f({columns:t(),rows:n()})};return e.platform.size.subscribe(p),()=>e.platform.size.unsubscribe(p)},onKey(f){
const p=w=>f(w);return e.on("keyPress",p),()=>e.off("keyPress",p)},onPointer(f){const p=w=>f(h(w));return e.on("pointerI\
nput",p),()=>e.off("pointerInput",p)},onWheel(f){const p=w=>{const g=u(w.x,w.y);f(g.x===w.x&&g.y===w.y?w:{...w,x:g.x,y:g.
y})};return e.on("mouseScroll",p),()=>e.off("mouseScroll",p)},present(f){o();const p=n();for(let w=0;w<p;w+=1){const g=f[w];
r[w]&&(r[w].value=g?ha(g):"")}for(let w=p;w<r.length;w+=1)r[w].value=""},requestFrame(f){requestAnimationFrame(f)},store(f){
let p=a.get(f);if(!p){try{p=new da({databaseName:i.storeDatabase??"exotui",storeName:f})}catch{p=new ca}a.set(f,p)}return p},
now:()=>performance.now(),dispose(){c||(c=!0,i.root.removeEventListener("contextmenu",d),l.dispose(),e.destroy())}}}function Tc(i){
return{column:Math.floor(i.column),row:Math.floor(i.row),width:Math.max(0,Math.floor(i.width)),height:Math.max(0,Math.floor(
i.height))}}function br(i,e,t,n,r){i.column=e,i.row=t,i.width=n,i.height=r}const mn=1;class Cc{state;gap;#e;#t;#i=1;#o=new Map;constructor(e={}){
const t=Wi(e.layout??{});this.#t=new zc(Pi(e.gap)),this.gap=this.#t;const n=e.windows===void 0?Wo(t,e.activeWindowId):ui(
t,e.windows,{activeWindowId:e.activeWindowId});this.#e=new $c(n,(r,o)=>{this.#s(r,o)}),this.state=this.#e,this.#n(this.state.
peek())}windowIds(){return Ze(this.state.peek().root).map(e=>e.windowId)}windowRegistrationGeneration(e){return this.#o.
get(e)}reconcile(e,t={}){const n=ui(this.state.peek(),e,t);return this.#n(n),this.#r(n),this.inspect()}focus(e){const t=Oe(
this.state.peek().root,e);return!t||this.state.peek().activePaneId===t.id?t!==void 0:(this.#r({...this.state.peek(),activePaneId:t.
id}),!0)}activatePane(e){const t=fe(this.state.peek().root,e);return!t||this.state.peek().activePaneId===t.id?t!==void 0:
(this.#r({...this.state.peek(),activePaneId:t.id}),!0)}remove(e){const t=this.state.peek(),n=Oe(t.root,e);if(!n)return!1;
const r=Mi(t.root,n.id),o=t.activePaneId?fe(r,t.activePaneId):void 0,s={root:r,activePaneId:o?.id??Rt(r)?.id};return this.#n(
s),this.#r(s),!0}move(e,t){if(!Number.isFinite(t)||Math.trunc(t)===0)return!1;const n=this.state.peek(),r=Ze(n.root),o=r.
findIndex(d=>d.windowId===e);if(o<0||r.length<2)return!1;const s=Math.max(0,Math.min(r.length-1,o+Math.trunc(t)));if(s===
o)return!1;const a=r[o],c=[...r];return c.splice(o,1),c.splice(s,0,a),this.#r({root:kn(n.root,c,{value:0}),activePaneId:a.
id}),!0}swap(e,t){if(e===t)return!1;const n=this.state.peek(),r=Oe(n.root,e),o=Oe(n.root,t);return!r||!o?!1:(this.#r({root:Bc(
n.root,r.id,o.id),activePaneId:r.id}),!0)}dock(e,t,n,r={}){if(e===t)return!1;const o=this.state.peek(),s=Oe(o.root,e),a=Oe(
o.root,t);if(!s||!a)return!1;const c=Mi(o.root,s.id),d=fe(c,a.id);if(!c||!d)return!1;const l=n==="left"||n==="top",u=En(
r.ratio??.5),h={kind:"split",id:Bo("split",c),direction:n==="left"||n==="right"?"row":"column",ratio:l?u:1-u,first:ce(l?
s:d),second:ce(l?d:s)};return this.#r({root:Si(c,d.id,h),activePaneId:s.id}),!0}setSplitRatio(e,t){const n=this.state.peek(),
r=En(t),o=xn(n.root,e,r);return o.changed?(this.#r({...n,root:o.node}),!0):!1}resizeSplitRatio(e,t){const n=Oi(this.state.
peek().root,e);return!n||!Number.isFinite(t)||t===0?!1:this.setSplitRatio(e,n.ratio+t)}resizeSplit(e,t,n,r={}){if(!Number.
isFinite(t)||Math.trunc(t)===0)return!1;const s=this.layout(n,r).separators.find(p=>p.splitId===e),a=$o(this.state.peek(),
r.visibleWindowIds),c=Oi(a.root,e);if(!s||!c)return!1;const d=c.direction==="row"?s.firstRect.width+s.secondRect.width:s.
firstRect.height+s.secondRect.height;if(d<=0)return!1;const l=c.direction==="row"?s.firstRect.width:s.firstRect.height,u=nt(
c.first,r.gap??this.gap.peek()),h=nt(c.second,r.gap??this.gap.peek()),f=Po(d,l+Math.trunc(t),c.direction==="row"?u.width:
u.height,c.direction==="row"?h.width:h.height);return f===l?!1:this.setSplitRatio(e,f/d)}layout(e,t={}){return Ac(this.state.
peek(),e,{...t,gap:t.gap??this.gap.peek()})}inspect(){const e=jo(this.state.peek()),t=Ze(e.root),n=e.activePaneId?fe(e.root,
e.activePaneId):void 0;return{layout:e,activePaneId:n?.id,activeWindowId:n?.windowId,windows:t.map(Lc),count:t.length}}snapshot(){
return kr({gap:this.gap.peek(),layout:this.state.peek()})}restore(e,t){const n=kr(e),r=t===void 0?n.layout:ui(n.layout,t);
this.#n(r);const o=this.gap.peek(),s=this.#t.externalMutationRevision;this.#t.jinkOwned(n.gap);try{this.#r(r)}finally{o!==
n.gap&&this.#t.externalMutationRevision===s&&this.gap.peek()===n.gap&&this.gap.propagate()}return this.inspect()}dispose(){
this.#o.clear(),this.state.dispose(),this.gap.dispose()}#n(e){const t=new Set(Ze(e.root).map(n=>n.windowId));for(const n of[
...this.#o.keys()])t.has(n)||this.#o.delete(n);for(const n of t)if(!this.#o.has(n)){if(!Number.isSafeInteger(this.#i))throw new RangeError(
"Tiled workspace registration generation space exhausted.");this.#o.set(n,this.#i++)}}#s(e,t){const n=new Map(this.#o);let r=this.#i;
for(const o of[...n.keys()])t.byId.has(o)||n.delete(o);for(const[o,s]of t.byId)if(!(e.byId.get(o)===s&&n.has(o))){if(!Number.
isSafeInteger(r))throw new RangeError("Tiled workspace registration generation space exhausted.");n.set(o,r++)}this.#o=n,
this.#i=r}#r(e){this.#e.publishOwned(e)}}class zc extends Ie{#e=0;get value(){return super.value}set value(e){this.#t(),
super.value=e}jink(e){this.#t(),super.jink(e)}get externalMutationRevision(){return this.#e}jinkOwned(e){super.jink(e)}#t(){
this.#e=this.#e===Number.MAX_SAFE_INTEGER?0:this.#e+1}}class $c extends Ie{#e;#t=new WeakMap;#i;constructor(e,t){super(e),
this.#e=t,this.$value=this.#o(e),this.#i=je(this.peek())}get value(){return super.value}set value(e){const t=this.#o(e),
n=je(t);this.#e(this.#i,n),this.#i=n;try{super.value=t}finally{this.#i=je(this.peek())}}jink(e){const t=this.#o(e),n=je(
t);this.#e(this.#i,n),this.#i=n,super.jink(t)}propagate(){try{this.#n(this.peek());const e=je(this.peek());this.#e(this.#i,
e),this.#i=e}catch(e){const t=this.#o(this.#i.rollback);throw super.jink(t),this.#i=je(t),e}super.propagate()}publishOwned(e){
const t=this.#o(e);this.#i=je(t);try{super.value=t}finally{this.#i=je(this.peek())}}#o(e){if(this.#t.get(e))return this.#n(
e),e;const n={...e};n.root&&(n.root=this.#s(n.root));const r=Qe(n,this,!0);return this.#t.set(r,n),r}#n(e){if(!e.root)return;
const t=this.#t.get(e)??e;t.root=this.#s(e.root)}#s(e){const t=this.#t.get(e);if(t){if(e.kind==="split"){const o=t;o.first=
this.#s(e.first),o.second=this.#s(e.second)}return e}const n={...e};n.kind==="split"&&(n.first=this.#s(n.first),n.second=
this.#s(n.second));const r=Qe(n,this);return this.#t.set(r,n),r}}function je(i){const e=Ze(i.root),t=new Map;for(const n of e){
const r=vt(n.windowId);if(!r||r!==n.windowId)throw new TypeError("Tiled workspace pane window ids must be non-empty norm\
alized strings.");if(t.has(r))throw new TypeError(`Tiled workspace contains duplicate window id ${JSON.stringify(r)}.`);
t.set(r,n)}return{byId:t,rollback:jo(i)}}function kr(i){return{version:mn,gap:Pi(i.gap),layout:Wi(i.layout)}}function Wi(i={},e,t={}){
const n=new Set,r=new Set,o=Ri(i.root,n,r),s={root:o,activePaneId:i.activePaneId&&fe(o,i.activePaneId)?i.activePaneId:Rt(
o)?.id};return e===void 0?Wo(s,t.activeWindowId):Ao(s,e,t)}function ui(i,e,t={}){return Ao(Wi(i),e,t)}function nt(i,e=1){
if(!i)return{width:0,height:0};if(i.kind==="pane")return{width:Ir(i.minWidth),height:Ir(i.minHeight)};const t=nt(i.first,
e),n=nt(i.second,e),r=Pi(e);return i.direction==="row"?{width:t.width+r+n.width,height:Math.max(t.height,n.height)}:{width:Math.
max(t.width,n.width),height:t.height+r+n.height}}function Ac(i,e,t={}){const n=$o(i,t.visibleWindowIds),r=Tc(e),o=Pi(t.gap),
s=nt(n.root,o),a=n.activePaneId?fe(n.root,n.activePaneId):void 0,c={bounds:Un(r),minimumSize:s,fitsMinimumSize:r.width>=
s.width&&r.height>=s.height,activePaneId:a?.id,activeWindowId:a?.windowId,panes:[],separators:[]};return n.root&&bn(n.root,
r,o,Dc(t.separatorHitSize),n.activePaneId,c),c}function $o(i,e){const t=Wi(i);if(e===void 0)return t;const n=new Set;for(const s of e){
const a=vt(s);a&&n.add(a)}const r=gn(t.root,n),o=t.activePaneId?fe(r,t.activePaneId):void 0;return{root:r,activePaneId:o?.
id??Rt(r)?.id}}function gn(i,e){if(!i)return;if(i.kind==="pane")return e.has(i.windowId)?ce(i):void 0;const t=gn(i.first,
e),n=gn(i.second,e);return!t||!n?t??n:{...i,first:t,second:n}}function Ao(i,e,t){const n=Wc(e),r=new Map(n.map(l=>[l.id,
l]));let o=vn(i.root,r,new Set);const s=new Set(Ze(o).map(l=>l.windowId)),a=n.filter(l=>!s.has(l.id));if(!o&&a.length>0)
o=yn(a,0,{value:1});else for(const l of a)o=Pc(o,No(l));o=Ri(o,new Set,new Set);const c=t.activeWindowId?Oe(o,t.activeWindowId):
void 0,d=i.activePaneId?fe(o,i.activePaneId):void 0;return{root:o,activePaneId:c?.id??d?.id??Rt(o)?.id}}function Wo(i,e){
const t=e?Oe(i.root,e):void 0,n=i.activePaneId?fe(i.root,i.activePaneId):void 0;return{root:i.root?Ce(i.root):void 0,activePaneId:t?.
id??n?.id??Rt(i.root)?.id}}function Ri(i,e,t){if(!i||i.kind!=="pane"&&i.kind!=="split")return;if(i.kind==="pane"){const o=vt(
i.windowId);return!o||t.has(o)?void 0:(t.add(o),{kind:"pane",id:Sn(vt(i.id)||`pane-${Lo(o)}`,e),windowId:o,minWidth:_t(i.
minWidth),minHeight:_t(i.minHeight)})}const n=Ri(i.first,e,t),r=Ri(i.second,e,t);return!n||!r?n??r:{kind:"split",id:Sn(vt(
i.id)||"split",e),direction:i.direction==="column"?"column":"row",ratio:En(i.ratio),first:n,second:r}}function Wc(i){const e=[],
t=new Set;for(const n of i){const r=vt(n.id);!r||t.has(r)||(t.add(r),e.push({id:r,minWidth:_t(n.minWidth),minHeight:_t(n.
minHeight)}))}return e}function vn(i,e,t){if(!i)return;if(i.kind==="pane"){const o=e.get(i.windowId);return!o||t.has(o.id)?
void 0:(t.add(o.id),{...ce(i),minWidth:o.minWidth,minHeight:o.minHeight})}const n=vn(i.first,e,t),r=vn(i.second,e,t);return!n||
!r?n??r:{...i,first:n,second:r}}function yn(i,e,t){if(i.length===1)return No(i[0]);const n=Math.ceil(i.length/2),r=yn(i.
slice(0,n),e+1,t),o=yn(i.slice(n),e+1,t),s=`split-${t.value}`;return t.value+=1,{kind:"split",id:s,direction:e%2===0?"ro\
w":"column",ratio:n/i.length,first:r,second:o}}function Pc(i,e){if(!i)return e;const t=Ze(i).at(-1),n=Mn(i,t.id),r={kind:"\
split",id:Bo("split",i),direction:n?.direction==="row"?"column":"row",ratio:.5,first:ce(t),second:e};return Si(i,t.id,r)}
function bn(i,e,t,n,r,o){if(i.kind==="pane"){o.panes.push({pane:ce(i),windowId:i.windowId,rect:Un(e),active:i.id===r});return}
const s=Nc(i,e,t,n);o.separators.push(s),bn(i.first,s.firstRect,t,n,r,o),bn(i.second,s.secondRect,t,n,r,o)}function Nc(i,e,t,n){
const r=i.direction==="row"?e.width:e.height,o=Math.min(t,Math.max(0,r-1)),s=Math.max(0,r-o),a=nt(i.first,t),c=nt(i.second,
t),d=Math.floor(s*i.ratio),l=Po(s,d,i.direction==="row"?a.width:a.height,i.direction==="row"?c.width:c.height),u=Math.max(
0,s-l);let h,f,p;return i.direction==="row"?(h={...e,width:l},f={column:e.column+l,row:e.row,width:o,height:e.height},p=
{column:f.column+o,row:e.row,width:u,height:e.height}):(h={...e,height:l},f={column:e.column,row:e.row+l,width:e.width,height:o},
p={column:e.column,row:f.row+o,width:e.width,height:u}),{splitId:i.id,direction:i.direction,axis:i.direction==="row"?"co\
lumn":"row",ratio:s<=0?0:l/s,bounds:Un(e),firstRect:h,rect:f,hitRect:jc(e,f,i.direction,n),secondRect:p}}function jc(i,e,t,n){
if(t==="row"){const a=Math.min(i.width,Math.max(e.width,n));if(a<=0)return{column:i.column,row:i.row,width:0,height:i.height};
const c=e.column+e.width/2;return{column:Math.max(i.column,Math.min(i.column+i.width-a,Math.floor(c-a/2))),row:i.row,width:a,
height:i.height}}const r=Math.min(i.height,Math.max(e.height,n));if(r<=0)return{column:i.column,row:i.row,width:i.width,
height:0};const o=e.row+e.height/2,s=Math.max(i.row,Math.min(i.row+i.height-r,Math.floor(o-r/2)));return{column:i.column,
row:s,width:i.width,height:r}}function Po(i,e,t,n){if(i<=0)return 0;const r=Math.max(0,Math.floor(t)),o=Math.max(0,Math.
floor(n));if(r+o<=i)return Math.max(r,Math.min(i-o,Math.floor(e)));const s=r+o;return s<=0?Math.max(0,Math.min(i,Math.floor(
e))):Math.max(0,Math.min(i,Math.round(i*r/s)))}function Mi(i,e){if(!i)return;if(i.kind==="pane")return i.id===e?void 0:ce(
i);const t=Mi(i.first,e),n=Mi(i.second,e);return!t||!n?t??n:{...i,first:t,second:n}}function Si(i,e,t){return i.kind==="\
pane"?i.id===e?Ce(t):ce(i):{...i,first:Si(i.first,e,t),second:Si(i.second,e,t)}}function Bc(i,e,t){if(!i)return;const n=fe(
i,e),r=fe(i,t);return!n||!r?Ce(i):In(i,n,r)}function kn(i,e,t){if(i){if(i.kind==="pane"){const n=e[t.value];return t.value+=
1,ce(n||i)}return{...i,first:kn(i.first,e,t)??Ce(i.first),second:kn(i.second,e,t)??Ce(i.second)}}}function In(i,e,t){return i.
kind==="pane"?i.id===e.id?ce(t):i.id===t.id?ce(e):ce(i):{...i,first:In(i.first,e,t),second:In(i.second,e,t)}}function xn(i,e,t){
if(!i||i.kind==="pane")return{node:i,changed:!1};if(i.id===e)return i.ratio===t?{node:Ce(i),changed:!1}:{node:{...i,ratio:t},
changed:!0};const n=xn(i.first,e,t);if(n.changed)return{node:{...i,first:n.node??i.first},changed:!0};const r=xn(i.second,
e,t);return r.changed?{node:{...i,second:r.node??i.second},changed:!0}:{node:Ce(i),changed:!1}}function Ze(i){const e=[];
return Rn(i,e),e}function Rn(i,e){if(i){if(i.kind==="pane"){e.push(i);return}Rn(i.first,e),Rn(i.second,e)}}function fe(i,e){
if(i)return i.kind==="pane"?i.id===e?i:void 0:fe(i.first,e)??fe(i.second,e)}function Oe(i,e){if(i)return i.kind==="pane"?
i.windowId===e?i:void 0:Oe(i.first,e)??Oe(i.second,e)}function Oi(i,e){if(!(!i||i.kind==="pane"))return i.id===e?i:Oi(i.
first,e)??Oi(i.second,e)}function Mn(i,e){if(!(!i||i.kind==="pane"))return i.first.kind==="pane"&&i.first.id===e||i.second.
kind==="pane"&&i.second.id===e?i:Mn(i.first,e)??Mn(i.second,e)}function Rt(i){if(i)return i.kind==="pane"?i:Rt(i.first)}
function No(i){return{kind:"pane",id:`pane-${Lo(i.id)}`,windowId:i.id,minWidth:i.minWidth,minHeight:i.minHeight}}function Lc(i){
return{id:i.windowId,minWidth:i.minWidth,minHeight:i.minHeight}}function jo(i){return{root:i.root?Ce(i.root):void 0,activePaneId:i.
activePaneId}}function Ce(i){return i.kind==="pane"?ce(i):{kind:"split",id:i.id,direction:i.direction,ratio:i.ratio,first:Ce(
i.first),second:Ce(i.second)}}function ce(i){return{kind:"pane",id:i.id,windowId:i.windowId,minWidth:i.minWidth,minHeight:i.
minHeight}}function Un(i){return{column:i.column,row:i.row,width:i.width,height:i.height}}function Sn(i,e){let t=i,n=2;for(;e.
has(t);)t=`${i}-${n}`,n+=1;return e.add(t),t}function Bo(i,e){const t=new Set;return On(e,t),Sn(i,t)}function On(i,e){i&&
(e.add(i.id),i.kind==="split"&&(On(i.first,e),On(i.second,e)))}function vt(i){return typeof i=="string"?i.trim():""}function Lo(i){
return i.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"window"}function _t(i){return Number.isFinite(i)?
Math.max(1,Math.floor(i)):void 0}function Ir(i){return _t(i)??1}function Pi(i){return Number.isFinite(i)?Math.max(0,Math.
floor(i)):1}function Dc(i){return Number.isFinite(i)?Math.max(1,Math.floor(i)):1}function En(i){return Number.isFinite(i)?
Math.max(.05,Math.min(.95,i)):.5}class Mt extends Error{constructor(e,t,n){super(t),this.code=e,this.cause=n,this.name="\
HistoryStackError"}}class st extends Mt{constructor(e,t){super("busy",t?`History ${e} is blocked while ${t} is active.`:
`History ${e} is blocked by an active transaction.`),this.operation=e,this.activeOperation=t,this.name="HistoryBusyError"}}
class at extends Mt{constructor(e){super("scope-closed",e),this.name="HistoryScopeError"}}class Qt extends Mt{constructor(e,t,n){
super(t?"poisoned":"operation-failed",t?`History ${e.phase} failed and compensation could not restore a known state.`:`H\
istory ${e.phase} failed; compensation restored the prior state.`,n),this.failure=e,this.poisoned=t,this.name="HistoryOp\
erationError"}}class xr extends Mt{constructor(e,t){super("transaction-aborted",`History transaction "${e.label}" was ro\
lled back.`,t),this.entry=e,this.name="HistoryTransactionAbortedError"}}class Be extends Mt{constructor(e,t){super("pois\
oned","History is poisoned; call clear() or recoverPoison() before further mutation.",t),this.poison=e,this.name="Histor\
yPoisonedError"}}class fi extends Mt{constructor(e,t){super("unsafe-replay",`History entry "${e.label}" has an unsafe re\
play declaration: ${t}.`),this.entry=e,this.name="HistoryReplaySafetyError"}}const It=Symbol("HistoryStack.composite"),Do=Symbol(
"HistoryStack.coalesced");class Fc{#e=[];#t=[];#i;#o;#n=new WeakMap;#s=[];#r;#a;#d=0;#u=0;#w;constructor(e={}){this.#i=Math.
max(1,Math.floor(e.capacity??100)),this.#o=_c(e.coalescing)}get undoDepth(){return this.#e.length}get redoDepth(){return this.#t.
length}canUndo(){return!this.#a&&!this.#r&&this.#s.length===0&&this.#e.length>0}canRedo(){return!this.#a&&!this.#r&&this.#s.
length===0&&this.#t.length>0}push(e){this.#m("push"),this.#f(dt(e))}async apply(e){this.#m("apply");const t=dt(e);this.#r=
"apply";try{await this.#S(t,"redo","apply"),this.#f(t)}finally{this.#r=void 0}}async undo(){this.#m("undo");const e=this.#e.
at(-1);if(!e)return!1;this.#r="undo";try{await this.#S(e,"undo","undo")}finally{this.#r=void 0}return this.#e.pop(),this.#t.
push(e),this.#g(),!0}async redo(){this.#m("redo");const e=this.#t.at(-1);if(!e)return!1;this.#r="redo";try{await this.#S(
e,"redo","redo")}finally{this.#r=void 0}return this.#t.pop(),this.#e.push(e),this.#g(),!0}markCoalescingBoundary(){this.#m(
"markCoalescingBoundary"),this.#g()}async transaction(e,t){return this.#m("transaction"),await this.#v(void 0,e,t)}transactionSync(e,t){
return this.#m("transactionSync"),this.#x(void 0,e,t)}clear(){this.#h("clear"),this.#e.length=0,this.#t.length=0,this.#a=
void 0,this.#w=void 0,this.#g()}recoverPoison(e){if(this.#h("recoverPoison"),e!=="clear-history"&&e!=="retain-history")throw new TypeError(
`Unknown history poison recovery policy: ${String(e)}`);return this.#a?(e==="clear-history"&&(this.#e.length=0,this.#t.length=
0,this.#w=void 0),this.#a=void 0,this.#g(),!0):!1}isPoisoned(){return this.#a!==void 0}inspect(){const e={canUndo:this.canUndo(),
canRedo:this.canRedo(),undoDepth:this.undoDepth,redoDepth:this.redoDepth,nextUndo:We(this.#e.at(-1)),nextRedo:We(this.#t.
at(-1))},t=this.#s.at(-1);if(t){const n={...ct(t.options),mode:t.mode,depth:this.#s.length,entryCount:t.entries.length};
t.discardRequested&&(n.discardRequested=!0),e.transaction=n}return this.#r&&(e.operation=this.#r),this.#a&&(e.poisoned=he(
this.#a)),this.#w&&(e.replayBarrier=Vc(this.#w)),e}#f(e){if(qo(e)){this.#p(e);return}const t=this.#t.length>0,n=e.coalesce,
r=n&&this.#o?Kc(this.#o.now):void 0,o=this.#e.at(-1),s=o?this.#n.get(o):void 0;let a=e;for(!t&&n&&r!==void 0&&o&&s&&s.key===
n.key&&s.boundary===n.boundary&&s.boundarySequence===this.#d&&o.group===e.group&&r>=s.committedAt&&r-s.committedAt<=this.#o.
idleIntervalMs?(a=Uc(o,e),this.#e[this.#e.length-1]=a):this.#e.push(a),n&&r!==void 0&&this.#n.set(a,{...n,boundarySequence:this.#d,
committedAt:r});this.#e.length>this.#i;)this.#e.shift();this.#t.length=0}#p(e){this.#e.length=0,this.#t.length=0;const t=We(
e);t.replaySafety="non-replayable",this.#w={sequence:++this.#u,entry:t},this.#g()}#g(){this.#d+=1}#m(e){if(this.#a)throw new Be(
he(this.#a));if(this.#r)throw new st(e,this.#r);if(this.#s.length>0)throw new st(e)}#h(e){if(this.#r)throw new st(e,this.#r);
if(this.#s.length>0)throw new st(e)}#l(e,t){if(this.#a)throw new Be(he(this.#a));if(e.state!=="active"||this.#s.at(-1)!==
e)throw new at(`Cannot ${t}: the transaction scope is closed or not current.`);if(e.discardRequested)throw new at(`Canno\
t ${t}: the transaction scope is marked for discard.`);if(this.#r)throw new st(t,this.#r)}#c(e){if(e.state!=="active"||this.#s.
at(-1)!==e)throw new at("Cannot discard: the transaction scope is closed or not current.");if(!e.discardRequested){if(this.#r)
throw new st("discard",this.#r);e.discardRequested=!0}}async#v(e,t,n){e&&this.#l(e,"start a nested transaction");const r=this.#b(
e,t,"async"),o=this.#N(r);let s,a;try{s=await n(o)}catch(d){a=d}const c=await this.#y(r);if(a===void 0&&c!==void 0&&(a=c),
a===void 0&&this.#a&&(a=new Be(he(this.#a))),a!==void 0&&await this.#O(r,a),r.discardRequested)return await this.#M(r),s;
try{this.#j(r)}catch(d){throw r.state==="active"&&this.#s.at(-1)===r&&await this.#O(r,d),d}return s}async#y(e){let t,n=!1;
for(;;){const r=[...e.pendingTasks];if(r.length===0){if(n)return t;n=!0,await Promise.resolve();continue}n=!1;const o=await Promise.
allSettled(r.map(s=>s.promise));for(let s=0;s<r.length;s+=1){const a=r[s];e.pendingTasks.delete(a);const c=o[s];t===void 0&&
c.status==="rejected"&&!a.observed&&(t=c.reason)}}}#x(e,t,n){e&&this.#l(e,"start a nested synchronous transaction");const r=this.#b(
e,t,"sync"),o=this.#U(r);let s;try{if(s=n(o),Uo(s))throw Promise.resolve(s).catch(Gn),new at("transactionSync callback r\
eturned a promise; use transaction() instead.")}catch(a){this.#W(r,a)}return this.#a&&this.#W(r,new Be(he(this.#a))),r.discardRequested?
(this.#C(r),s):(this.#j(r),s)}#b(e,t,n){const o={options:Hc(t),mode:n,parent:e,entries:[],pendingTasks:new Set,discardRequested:!1,
state:"active"};return this.#s.push(o),o}#N(e){return Object.freeze({depth:this.#s.length,entry:ct(e.options),get discarded(){
return e.discardRequested},push:t=>{this.#l(e,"push"),e.entries.push(dt(t))},apply:t=>{const n=this.#$(e,t);return Or(e,
n)},discard:()=>{this.#c(e)},transaction:(t,n)=>{this.#l(e,"start a nested transaction");const r=this.#v(e,t,n);return Or(
e,r)},transactionSync:(t,n)=>this.#x(e,t,n)})}async#$(e,t){this.#l(e,"apply");const n=dt(t);this.#r="transaction-apply";
try{await this.#S(n,"redo","transaction-apply"),e.entries.push(n)}finally{this.#r=void 0}}#U(e){return Object.freeze({depth:this.#s.
length,entry:ct(e.options),get discarded(){return e.discardRequested},push:t=>{this.#l(e,"push"),e.entries.push(dt(t))},
apply:t=>{this.#l(e,"apply");const n=dt(t);this.#r="transaction-apply";try{this.#T(n,"redo","transaction-apply"),e.entries.
push(n)}finally{this.#r=void 0}},discard:()=>{this.#c(e)},transaction:(t,n)=>this.#x(e,t,n)})}#j(e){if(this.#l(e,"commit"),
e.entries.length===0&&e.options.replaySafety?.strategy!=="non-replayable"){this.#k(e);return}const t=pi(e.options,e.entries);
e.parent?e.parent.entries.push(t):this.#f(t),this.#k(e)}async#O(e,t){throw await this.#M(e,t),new xr(ct(e.options),t)}async#M(e,t){
this.#B(e);let n;if(e.entries.length>0){this.#r="transaction-rollback";try{await this.#S(pi(e.options,e.entries),"undo",
"transaction-rollback")}catch(r){n=r}finally{this.#r=void 0}}if(this.#k(e),n)throw this.#A(e.options,n),new Be(he(this.#a),
n);if(this.#a)throw new Be(he(this.#a),t)}#W(e,t){throw this.#C(e,t),new xr(ct(e.options),t)}#C(e,t){this.#B(e);let n;if(e.
entries.length>0){this.#r="transaction-rollback";try{this.#T(pi(e.options,e.entries),"undo","transaction-rollback")}catch(r){
n=r}finally{this.#r=void 0}}if(this.#k(e),n)throw this.#A(e.options,n),new Be(he(this.#a),n);if(this.#a)throw new Be(he(
this.#a),t)}#B(e){if(e.state!=="active"||this.#s.at(-1)!==e)throw new at("Cannot abort a transaction while a nested scop\
e is still active.")}#k(e){if(this.#s.at(-1)!==e)throw new at("Transaction scopes must close in nesting order.");this.#s.
pop(),e.state="closed"}async#S(e,t,n){const r=Ei(e,t),o=[];for(const s of r)try{await Rr(s,t),o.push(s)}catch(a){const c=[],
d=[s,...o.slice().reverse()];for(const u of d)try{await Rr(u,Sr(t))}catch(h){c.push({entry:We(u),error:Pt(h)})}const l=Vi(
n,t,e,s,a,c);throw c.length>0&&(this.#a=he({...l,reason:"compensation-failed"})),new Qt(l,c.length>0,a)}}#T(e,t,n){const r=Ei(
e,t),o=[];for(const s of r)try{Mr(s,t),o.push(s)}catch(a){if(a instanceof Go){const l=Vi(n,t,e,s,a,[{entry:We(s),error:Pt(
a)}]);throw this.#a=he({...l,reason:"async-in-sync-scope"}),new Qt(l,!0,a)}const c=[];for(const l of[s,...o.slice().reverse()])
try{Mr(l,Sr(t))}catch(u){c.push({entry:We(l),error:Pt(u)})}const d=Vi(n,t,e,s,a,c);throw c.length>0&&(this.#a=he({...d,reason:"\
compensation-failed"})),new Qt(d,c.length>0,a)}}#A(e,t){if(this.#a)return;const n=ct(e),r=t instanceof Qt?t.failure:{phase:"\
transaction-rollback",direction:"undo",entry:n,failedEntry:n,error:Pt(t),compensationFailures:[]};this.#a=he({...r,reason:"\
rollback-failed"})}}function We(i){if(!i)return;const e={id:i.id,label:i.label,group:i.group};return i.coalesce&&(e.coalesceKey=
i.coalesce.key,i.coalesce.boundary!==void 0&&(e.coalesceBoundary=i.coalesce.boundary)),i.replaySafety&&(e.replaySafety=i.
replaySafety.strategy),Ni(i)&&(e.composite=!0,e.operationCount=Ei(i,"redo").length),_o(i)&&(e.coalesced=!0),e}function ct(i){
const e={id:i.id,label:i.label,group:i.group};return i.coalesce&&(e.coalesceKey=i.coalesce.key,i.coalesce.boundary!==void 0&&
(e.coalesceBoundary=i.coalesce.boundary)),i.replaySafety&&(e.replaySafety=i.replaySafety.strategy),e}function Hc(i){const e=i.
label.trim();if(!e)throw new TypeError("History transaction label must not be empty.");return{id:i.id?.trim()||void 0,label:e,
group:i.group?.trim()||void 0,coalesce:Fo(i.coalesce),replaySafety:Ho(i.replaySafety,e)}}function _c(i){if(i!==void 0){if(!Number.
isFinite(i.idleIntervalMs)||i.idleIntervalMs<0)throw new TypeError("History coalescing idleIntervalMs must be a non-nega\
tive finite number.");if(i.now!==void 0&&typeof i.now!="function")throw new TypeError("History coalescing now must be a \
function.");return{idleIntervalMs:i.idleIntervalMs,now:i.now??Date.now}}}function Fo(i){if(i===void 0)return;if(typeof i!=
"object"||i===null)throw new TypeError("History coalescing metadata must be an object.");const e=typeof i.key=="string"?
i.key.trim():"";if(!e)throw new TypeError("History coalescing key must not be empty.");if(i.boundary!==void 0&&typeof i.
boundary!="string")throw new TypeError("History coalescing boundary must be a string when provided.");const t=i.boundary?.
trim()||void 0;return t===void 0?{key:e}:{key:e,boundary:t}}function Ho(i,e){if(i===void 0)return;const t={label:e};if(typeof i!=
"object"||i===null)throw new fi(t,"metadata must be an object");if(i.sideEffectful!==!0)throw new fi(t,"sideEffectful mu\
st be true");if(!qc(i.strategy))throw new fi(t,"strategy must be idempotent, compensatable, or non-replayable");return{sideEffectful:!0,
strategy:i.strategy}}function dt(i){const e=typeof i.label=="string"?i.label:String(i.label),t=Ho(i.replaySafety,e);if(t&&
(typeof i.undo!="function"||typeof i.redo!="function"))throw new fi({id:i.id,label:e,group:i.group,replaySafety:t.strategy},
"side-effectful entries require both undo and redo callbacks");return{...i,coalesce:Fo(i.coalesce),replaySafety:t,undo:()=>i.
undo(),redo:()=>i.redo()}}function qc(i){return i==="idempotent"||i==="compensatable"||i==="non-replayable"}function pi(i,e){
const t=e.slice();return{...i,[It]:t,async undo(){for(let n=t.length-1;n>=0;n-=1)await t[n].undo()},async redo(){for(const n of t)
await n.redo()}}}function Ni(i){return It in i}function Uc(i,e){const t=_o(i)?[...i[It],e]:[i,e];return{...pi({id:e.id,label:e.
label,group:e.group,coalesce:e.coalesce,replaySafety:e.replaySafety},t),[Do]:!0}}function _o(i){return Ni(i)&&Do in i}function qo(i){
return i.replaySafety?.strategy==="non-replayable"?!0:Ni(i)&&i[It].some(qo)}function Ei(i,e){if(!Ni(i))return[i];const t=e===
"redo"?i[It]:i[It].slice().reverse(),n=[];for(const r of t)n.push(...Ei(r,e));return n}async function Rr(i,e){await i[e]()}
function Mr(i,e){const t=i[e]();if(Uo(t))throw Promise.resolve(t).catch(Gn),new Go(We(i))}function Sr(i){return i==="red\
o"?"undo":"redo"}function Or(i,e){const t={promise:e,observed:!1};i.pendingTasks.add(t);const n=new Gc((r,o)=>{e.then(r,
o)},r=>{r&&(t.observed=!0)});return n.silenceUnhandledRejection(),n}class Gc extends Promise{#e;constructor(e,t){super(e),
this.#e=t}then(e,t){return this.#e?.(typeof t=="function"),super.then(e,t)}silenceUnhandledRejection(){super.then(void 0,
Gn)}}function Vi(i,e,t,n,r,o){return{phase:i,direction:e,entry:We(t),failedEntry:We(n),error:Pt(r),compensationFailures:o}}
function Pt(i){if(i instanceof Error)return{name:i.name||"Error",message:i.message};if(typeof i=="string")return{name:"E\
rror",message:i};try{return{name:"Error",message:JSON.stringify(i)??String(i)}}catch{return{name:"Error",message:String(
i)}}}function he(i){return{...i,entry:{...i.entry},failedEntry:{...i.failedEntry},error:{...i.error},compensationFailures:i.
compensationFailures.map(e=>({entry:{...e.entry},error:{...e.error}}))}}function Vc(i){return{sequence:i.sequence,entry:{
...i.entry}}}function Kc(i){try{const e=i();return Number.isFinite(e)?e:void 0}catch{return}}function Uo(i){return(typeof i==
"object"&&i!==null||typeof i=="function")&&"then"in i&&typeof i.then=="function"}class Go extends Error{constructor(e){super(
`History step "${e.label}" returned a promise inside transactionSync.`),this.entry=e,this.name="AsyncHistoryStepInSyncSc\
opeError"}}function Gn(){}function Xc(i,e){const t=ke(i);return t===e?i:t<e?i+" ".repeat(Math.max(0,e-t)):`${fo(i).slice(
0,Math.max(0,e-1))}…`}function Ti(i,e={}){const t=i.trim();return e.compact?`[${t}]`:`[ ${t} ]`}function Yc(i,e,t,n,r={}){
i.length=0;const o=Math.max(0,Math.floor(r.gap??1)),s=t.column+Math.max(0,Math.floor(t.width)),a=t.row+Math.max(0,Math.floor(
t.height));let c=Math.max(t.row,Math.floor(n)),d=t.column;for(const l of e){if(c>=a||t.width<=0)break;const u=Math.min(ke(
Ti(l.label)),Math.max(0,t.width));if(u<=0)continue;if(d>t.column&&d+u>s&&(c+=1,d=t.column),c>=a)break;const h=l.disabled?
"disabled":l.active?"active":"base";i.push({item:l,rect:{column:d,row:c,width:u,height:1},state:h,tone:l.tone}),d+=u+o}return Math.
min(a,c+1)}function Jc(i,e){return Qc(i,{row:e.row,column:e.column,width:e.width,prefix:e.prefix??"minimized ",entries:e.
entries,mode:"shelf"})}function Zc(){return{buttons:[],items:[],placements:[]}}function Qc(i,e){const t=e.column+Math.max(
0,e.width),n=Math.min(ke(e.prefix),Math.max(0,t-e.column)),r=i.items;r.length=e.entries.length;for(let c=0;c<e.entries.length;c+=
1){const d=e.entries[c],l=e.mode==="tabs",u=e.mode==="shelf",h=d.title;r[c]={action:d.id,label:h,selected:l,hidden:u}}const o={
column:e.column+n,row:e.row,width:Math.max(0,e.width-n),height:1};Yc(i.placements,r,o,e.row);const s=i.placements,a=i.buttons;
a.length=s.length;for(let c=0;c<s.length;c+=1){const d=s[c],l=d.item;a[c]={id:l.action,label:l.label,rect:d.rect,selected:l.
selected,hidden:l.hidden}}return{prefix:e.prefix,prefixRect:{column:e.column,row:e.row,width:n,height:1},buttons:a}}const Vn={
kind:"close",label:"x",accessibilityLabel:"Close window",shortcut:"C",tone:"danger",compact:!0},Vo={kind:"restore",label:"\
R",accessibilityLabel:"Restore window",shortcut:"R",tone:"muted",compact:!0},Ko={kind:"maximize",label:"M",accessibilityLabel:"\
Maximize window",shortcut:"F",tone:"success",compact:!0},Kn={kind:"minimize",label:"-",accessibilityLabel:"Minimize wind\
ow",shortcut:"M",tone:"warning",compact:!0},ed={kind:"always-on-top",label:"^",accessibilityLabel:"Keep window always on\
 top",shortcut:"P",tone:"default",compact:!0},td={kind:"always-on-top",label:"v",accessibilityLabel:"Return window to no\
rmal stacking",shortcut:"P",tone:"success",compact:!0},id=[Vn,Vo,Ko,Kn],nd=[Vn,Ko,Kn],rd=[Vn,Vo,Kn];function od(){return{
buttons:[],hasWindowControls:!1}}function sd(i,e){const t=e.maximized===void 0?id:e.maximized?rd:nd,n=e.alwaysOnTop===void 0?
t:[...t.slice(0,t.length-1),e.alwaysOnTop?td:ed,t[t.length-1]],r=e.controlsMinWidth??n.length*4,o=e.configLabel??"config",
s=i.buttons;let a=0;const c=e.rect.row,d=e.rect.column+e.rect.width-1,l=e.rect.width>=r;i.hasWindowControls=l;let u=d;if(l){
let w=d;for(let g=0;g<n.length;g+=1){const R=n[g],m=ke(Ti(R.label,{compact:R.compact})),M=w-m;Er(s,n.length-g-1,R,M,c,m),
u=M,w=M-1}a=n.length}const h=ke(Ti(o)),f=u-h-1,p=e.rect.column+ke(e.title)+3;if(e.showConfig&&f>p)if(l){for(let w=a;w>0;w-=
1)s[w]=s[w-1];s[0]=cd({kind:"config",label:o,accessibilityLabel:e.configAccessibilityLabel??"Configure renderer",shortcut:e.
configShortcut??"G",tone:"default",compact:!1},f,c,h),a+=1}else Er(s,0,{kind:"config",label:o,accessibilityLabel:e.configAccessibilityLabel??
"Configure renderer",shortcut:e.configShortcut??"G",tone:"default",compact:!1},f,c,h),a=1;return s.length=a,i}function ad(i,e){
let t=0;for(let n=0;n<e.buttons.length;n+=1){const r=e.buttons[n],o=Ti(r.label,{compact:r.compact}),s=Math.max(0,Math.min(
ke(o),r.rect.width));if(s<=0)continue;const a=i[t]??{button:r,kind:r.kind,label:"",accessibilityLabel:"",shortcut:void 0,
text:"",rect:{column:0,row:0,width:0,height:1},hitRect:{column:0,row:0,width:0,height:1},tone:r.tone,compact:r.compact};
a.button=r,a.kind=r.kind,a.label=r.label,a.accessibilityLabel=r.accessibilityLabel,a.shortcut=r.shortcut,a.text=Xc(o,s),
a.tone=r.tone,a.compact=r.compact,br(a.rect,r.rect.column,r.rect.row,s,1),br(a.hitRect,r.rect.column,r.rect.row,s,1),i[t]=
a,t+=1}return i.length=t,i}function Er(i,e,t,n,r,o){const s=i[e]??{kind:t.kind,label:t.label,tone:t.tone,compact:t.compact,
rect:{column:n,row:r,width:o,height:1}};s.kind=t.kind,s.label=t.label,s.accessibilityLabel=t.accessibilityLabel,s.shortcut=
t.shortcut,s.tone=t.tone,s.compact=t.compact,s.rect.column=n,s.rect.row=r,s.rect.width=o,s.rect.height=1,i[e]=s}function cd(i,e,t,n){
return{kind:i.kind,label:i.label,accessibilityLabel:i.accessibilityLabel,shortcut:i.shortcut,tone:i.tone,compact:i.compact,
rect:{column:e,row:t,width:n,height:1}}}class dd extends Ie{#e=0;#t;get value(){return super.value}set value(e){this.#i(
e),super.value=e}jink(e){this.#i(e),super.jink(e)}get externalMutationRevision(){return this.#e}get lastExternallyAssignedValue(){
return this.#t}publishOwned(e,t){t?super.value=e:super.jink(e)}#i(e){this.#t=e,this.#e=hd(this.#e)}}const ld={workspace:0,
window:1e3,chrome:2e3,popover:3e3,modal:4e3,system:5e3};function hd(i){return i===Number.MAX_SAFE_INTEGER?0:i+1}function Xo(i){
return ld[i]}function Yo(i,e){return i.column>=e.column&&i.column<e.column+e.width&&i.row>=e.row&&i.row<e.row+e.height}function Jo(i){
const e=[];for(let t=0;t<i.length;t+=1)e.push(ft(i[t]));return e.sort((t,n)=>t.zIndex-n.zIndex||t.order-n.order||t.id.localeCompare(
n.id)),e}class ud{surfaces;activeId;#e;#t;#i=0;#o=1;#n=new Map;#s=!1;#r;#a;#d;#u;constructor(e={}){const t=e.surfaces??[],
n=[],r=new Set;for(let o=0;o<t.length;o+=1){const s=t[o],a=ft(s,s.order??o);if(wi(a,`Overlay surface ${o}`),r.has(a.id))
throw new TypeError(`Overlay stack contains duplicate surface id ${JSON.stringify(a.id)}.`);r.add(a.id),this.#i=ti(this.#i,
a.order,!1),n.push(a),this.#n.set(a.id,this.#f())}this.#e=new fd(n,(o,s)=>{this.#g(o,s)},()=>{this.#c(),this.#m()}),this.
surfaces=this.#e,this.#t=new dd(e.activeId&&n.some(o=>o.id===e.activeId)?e.activeId:void 0),this.activeId=this.#t}register(e,t={}){
const n=this.surfaces.peek(),r=Ct(n,e.id);r||Cn(this.#i);const o=ft(e,r?.order??this.#i);wi(o,"Registered overlay surfac\
e");const s=ti(this.#i,o.order,!r),a=this.#f();this.#n.set(o.id,a),this.#i=s;const c=r?Ki(n,e.id,o):md(n,o);try{this.#l(
c,t)}finally{o.visible&&this.#h(o.id,t.synchronizeFocus)}return o}update(e,t,n={}){const r=this.surfaces.peek(),o=Ct(r,e);
if(!o)return;const s=ft({...o,...t,id:e},o.order);wi(s,"Updated overlay surface");const a=ti(this.#i,s.order,!1);return this.#i=
a,this.#l(Ki(r,e,s),n),s}open(e,t={}){return this.update(e,{visible:!0},t)&&this.bringToFront(e,t),this.surface(e)}close(e,t={}){
const n=this.surface(e);return this.#p(e,t),n}toggle(e,t={}){return this.surface(e)?.visible?this.close(e,t):this.open(e,
t)}remove(e,t={}){const n=this.surface(e);if(!n)return;this.#n.delete(e);const r=gd(this.surfaces.peek(),e),o=this.activeId.
peek()===e?ei(r):this.activeId.peek();try{this.#l(r,t)}finally{this.#h(o,t.synchronizeFocus)}return n}bringToFront(e,t={}){
const n=this.surface(e);if(!n)return;const r=this.#w(),o=ft({...n,order:r,zIndex:void 0},r);try{this.#l(Ki(this.surfaces.
peek(),e,o),t)}finally{this.#h(e,t.synchronizeFocus)}return o}surface(e){return Ct(this.surfaces.peek(),e)}registrationGeneration(e){
return this.#n.get(e)}activeMutationRevision(){return this.#t.externalMutationRevision}lastExternallyAssignedActiveId(){
return this.#t.lastExternallyAssignedValue}synchronizeActiveId(e,t={}){const n=e===void 0?void 0:e&&this.surface(e)?e:ei(
this.surfaces.peek());this.#t.publishOwned(n,t.propagate??!0)}zOrder(){const e=this.#y(),t=[];for(let n=0;n<e.length;n+=
1)t.push(e[n]);return t}top(){const e=this.#y();return e[e.length-1]}topModal(){return zn(this.#y())}hitTest(e,t={}){return pd(
this.#v(),e,t.respectModal)}handlePointerDown(e){const t=this.#y(),n=zn(t),r=n?Qo(t,n.id):void 0,o=n&&r?t.some(a=>r.has(
a.id)&&Yo(e,a.rect)):!1;if(n&&!o)return n.closeOnOutsideClick?{blockingModal:n,closedIds:this.#p(n.id)}:{blockingModal:n,
closedIds:[]};const s=this.hitTest(e,{respectModal:!!n});return s&&this.bringToFront(s.surface.id),{hit:s,blockingModal:n,
closedIds:[]}}inspect(){const e=this.surfaces.peek(),t=new Array(e.length);for(let a=0;a<e.length;a+=1){const c=e[a];t[a]=
Xe(c)}const n=[];for(const a of e)a.visible&&n.push(Xe(a));const r=this.#y(),o=new Array(r.length);for(let a=0;a<r.length;a+=
1){const c=r[a];o[a]=Xe(c)}const s=o[o.length-1];return{activeId:this.activeId.peek(),surfaces:t,visible:n,zOrder:o,top:s?
Xe(s):void 0}}snapshot(){const e=this.surfaces.peek(),t=this.activeId.peek();return es({activeId:t&&Ct(e,t)?t:void 0,nextOrder:this.#i,
surfaces:e})}restoreSnapshot(e,t={}){const n=vd(e),r=this.surfaces.peek(),o=new Map;for(const s of n.surfaces){const a=Ct(
r,s.id),c=this.#n.get(s.id);o.set(s.id,a&&c!==void 0&&kd(a,s)?c:this.#f())}this.#i=n.nextOrder,this.#n=o;try{this.#l(n.surfaces.
map(Xe),t)}finally{this.#h(n.activeId,t.synchronizeFocus)}}dispose(){this.#n.clear(),this.surfaces.dispose(),this.activeId.
dispose()}#w(){Cn(this.#i);const e=this.#i;return this.#i=e+1,e}#f(){if(!Number.isSafeInteger(this.#o))throw new RangeError(
"Overlay registration generation space exhausted.");return this.#o++}#p(e,t={}){const n=this.surfaces.peek(),r=Zo(n,e),o=new Set(
r),s=new Array(n.length);for(let d=0;d<n.length;d+=1){const l=n[d];s[d]=o.has(l.id)?ft({...l,visible:!1},l.order):l}const a=this.
activeId.peek(),c=a&&o.has(a)?ei(s):a;try{this.#l(s,t)}finally{this.#h(c,t.synchronizeFocus)}return r}#g(e,t){wd(t.surfaces,
"Externally assigned overlay surfaces");const n=new Map(this.#n);let r=this.#o,o=this.#i;for(const s of[...n.keys()])t.byId.
has(s)||n.delete(s);for(const[s,a]of t.byId)if(o=ti(o,a.order,!1),!(e.byId.get(s)===a&&n.has(s))){if(!Number.isSafeInteger(
r))throw new RangeError("Overlay registration generation space exhausted.");n.set(s,r++)}this.#n=n,this.#o=r,this.#i=o}#m(){
const e=this.activeId.peek();!e||this.surface(e)||this.#h(e,this.#s)}#h(e,t=!1){const n=e===void 0?void 0:e&&this.surface(
e)?e:ei(this.surfaces.peek());t?this.#t.publishOwned(n,!0):this.#t.value=n}#l(e,t={}){const n=this.#s;this.#s=t.synchronizeFocus??
!1;try{this.#e.publishOwned(e)}finally{this.#s=n}}#c(){this.#r=void 0,this.#a=void 0,this.#d=void 0,this.#u=void 0}#v(){
const e=this.surfaces.peek();return this.#r!==e&&(this.#r=e,this.#a=Jo(e),this.#d=void 0,this.#u=void 0),this.#a??[]}#y(){
const e=this.surfaces.peek();if(this.#d!==e){const t=this.#v(),n=[];for(const r of t)r.visible&&n.push(r);this.#d=e,this.#u=
n}return this.#u??[]}}class fd extends Ie{#e;#t;#i=new WeakMap;#o;constructor(e,t,n){super(e),this.#e=t,this.#t=n,this.$value=
this.#n(e),this.#o=Le(this.peek())}get value(){return super.value}set value(e){const t=this.#n(e),n=Le(t);this.#e(this.#o,
n),this.#o=n;try{super.value=t}finally{this.#o=Le(this.peek()),this.#t()}}jink(e){const t=this.#n(e),n=Le(t);this.#e(this.#o,
n),this.#o=n,super.jink(t),this.#t()}propagate(){try{this.#s(this.peek());const e=Le(this.peek());this.#e(this.#o,e),this.#o=
e,this.#t()}catch(e){const t=this.#n(this.#o.rollback.map(Xe));throw super.jink(t),this.#o=Le(t),this.#t(),e}super.propagate()}publishOwned(e){
const t=this.#n(e);this.#o=Le(t);try{super.value=t}finally{this.#o=Le(this.peek()),this.#t()}}#n(e){if(this.#i.get(e))return this.#s(
e),e;const n=[...e];for(let o=0;o<n.length;o+=1)n[o]=this.#r(n[o]);const r=Qe(n,this);return this.#i.set(r,n),r}#s(e){const t=this.#i.
get(e)??e;for(let n=0;n<e.length;n+=1)t[n]=this.#r(e[n])}#r(e){const t=this.#i.get(e);if(t)return t.rect=this.#a(e.rect),
e;const n={...e};n.rect=this.#a(n.rect);const r=Qe(n,this);return this.#i.set(r,n),r}#a(e){if(this.#i.get(e))return e;const n={
...e},r=Qe(n,this);return this.#i.set(r,n),r}}function Le(i){return{surfaces:[...i],byId:new Map(i.map(e=>[e.id,e])),rollback:i.
map(Xe)}}function pd(i,e,t){const n=t===!1?void 0:zn(i),r=n?Qo(i,n.id):void 0;for(let o=i.length-1;o>=0;o-=1){const s=i[o];
if(s.visible&&!(r&&!r.has(s.id))&&Yo(e,s.rect))return xd(s,e)}}function Zo(i,e,t=!1){const n=new Map;for(const s of i){if(!s.
ownerId||t&&!s.visible)continue;const a=n.get(s.ownerId);a?a.push(s.id):n.set(s.ownerId,[s.id])}const r=new Set([e]),o=[
e];for(let s=0;s<o.length;s+=1)for(const a of n.get(o[s])??[])r.has(a)||(r.add(a),o.push(a));return o}function Qo(i,e){return new Set(
Zo(i,e,!0))}function ei(i){const e=Jo(i).filter(t=>t.visible);return e[e.length-1]?.id}function wd(i,e){const t=new Set;
for(let n=0;n<i.length;n+=1){const r=i[n];if(wi(r,`${e} entry ${n}`),t.has(r.id))throw new TypeError(`${e} contains dupl\
icate id ${JSON.stringify(r.id)}.`);t.add(r.id)}}function wi(i,e){if(typeof i.id!="string")throw new TypeError(`${e} id \
must be a string.`);if(!ns(i.layer))throw new TypeError(`${e} layer is invalid.`);if(!rs(i.kind))throw new TypeError(`${e}\
 kind is invalid.`);if(!Number.isSafeInteger(i.zIndex))throw new TypeError(`${e} zIndex must be a safe integer.`);if(!Number.
isSafeInteger(i.order)||i.order<0||i.order>=Number.MAX_SAFE_INTEGER)throw new TypeError(`${e} order must be a bounded no\
n-negative safe integer.`);for(const[t,n]of Object.entries(i.rect))if(typeof n!="number"||!Number.isFinite(n))throw new TypeError(
`${e} rect ${t} must be finite.`);if(typeof i.visible!="boolean"||typeof i.modal!="boolean")throw new TypeError(`${e} vi\
sibility and modal flags must be boolean.`);if(typeof i.closeOnOutsideClick!="boolean")throw new TypeError(`${e} closeOn\
OutsideClick must be boolean.`);if(i.ownerId!==void 0&&typeof i.ownerId!="string")throw new TypeError(`${e} ownerId must\
 be a string when present.`)}function Ct(i,e){for(let t=0;t<i.length;t+=1){const n=i[t];if(n.id===e)return n}}function Ki(i,e,t){
const n=new Array(i.length);for(let r=0;r<i.length;r+=1){const o=i[r];n[r]=o.id===e?t:o}return n}function md(i,e){const t=new Array(
i.length+1);for(let n=0;n<i.length;n+=1)t[n]=i[n];return t[i.length]=e,t}function gd(i,e){let t=0;for(let o=0;o<i.length;o+=
1)i[o].id!==e&&(t+=1);const n=new Array(t);let r=0;for(let o=0;o<i.length;o+=1){const s=i[o];s.id!==e&&(n[r++]=s)}return n}
function Xe(i){return{...i,rect:{...i.rect}}}function es(i){const e=i.surfaces.map(t=>Object.freeze({...t,rect:Object.freeze(
{...t.rect})}));return Object.freeze({activeId:i.activeId,nextOrder:i.nextOrder,surfaces:Object.freeze(e)})}function vd(i){
const e=Tn(i,["activeId","nextOrder","surfaces"],["nextOrder","surfaces"],"overlay stack snapshot"),t=is(e.nextOrder,"ov\
erlay stack snapshot nextOrder");if(!Array.isArray(e.surfaces))throw new TypeError("Overlay stack snapshot surfaces must\
 be an array.");bd(e.surfaces,"overlay stack snapshot surfaces");const n=[],r=new Set;let o=-1;for(let a=0;a<e.surfaces.
length;a+=1){const c=yd(e.surfaces[a],a);if(r.has(c.id))throw new TypeError(`Overlay stack snapshot contains duplicate s\
urface id ${JSON.stringify(c.id)}.`);r.add(c.id),o=Math.max(o,c.order),n.push(c)}if(n.length>0&&t<=o)throw new RangeError(
"Overlay stack snapshot nextOrder must be greater than every surface order.");const s=e.activeId;if(s!==void 0&&typeof s!=
"string")throw new TypeError("Overlay stack snapshot activeId must be a string when present.");if(s!==void 0&&!r.has(s))
throw new TypeError(`Overlay stack snapshot activeId ${JSON.stringify(s)} is not registered.`);return es({activeId:s,nextOrder:t,
surfaces:n})}function yd(i,e){const t=`overlay stack snapshot surface ${e}`,n=Tn(i,["id","rect","layer","kind","zIndex",
"order","visible","modal","closeOnOutsideClick","ownerId"],["id","rect","layer","kind","zIndex","order","visible","modal",
"closeOnOutsideClick"],t);if(typeof n.id!="string")throw new TypeError(`${t} id must be a string.`);if(!ns(n.layer))throw new TypeError(
`${t} layer is invalid.`);if(!rs(n.kind))throw new TypeError(`${t} kind is invalid.`);if(n.ownerId!==void 0&&typeof n.ownerId!=
"string")throw new TypeError(`${t} ownerId must be a string when present.`);const r=Tn(n.rect,["column","row","width","h\
eight"],["column","row","width","height"],`${t} rect`);return{id:n.id,rect:{column:Nt(r.column,`${t} rect column`),row:Nt(
r.row,`${t} rect row`),width:Nt(r.width,`${t} rect width`),height:Nt(r.height,`${t} rect height`)},layer:n.layer,kind:n.
kind,zIndex:ts(n.zIndex,`${t} zIndex`),order:is(n.order,`${t} order`),visible:Xi(n.visible,`${t} visible`),modal:Xi(n.modal,
`${t} modal`),closeOnOutsideClick:Xi(n.closeOnOutsideClick,`${t} closeOnOutsideClick`),ownerId:n.ownerId}}function Tn(i,e,t,n){
if(!i||typeof i!="object"||Object.getPrototypeOf(i)!==Object.prototype)throw new TypeError(`${n} must be a plain object.`);
const r=i,o=new Set(e),s=Reflect.ownKeys(r);for(const a of s){if(typeof a!="string"||!o.has(a))throw new TypeError(`${n}\
 has an unexpected property.`);const c=Object.getOwnPropertyDescriptor(r,a);if(!c||!("value"in c)||!c.enumerable)throw new TypeError(
`${n} properties must be enumerable data properties.`)}for(const a of t)if(!Object.hasOwn(r,a))throw new TypeError(`${n}\
 is missing property ${JSON.stringify(a)}.`);return r}function bd(i,e){if(Object.getPrototypeOf(i)!==Array.prototype)throw new TypeError(
`${e} must be a plain array.`);const t=Reflect.ownKeys(i);for(let n=0;n<i.length;n+=1){const r=String(n);if(!Object.hasOwn(
i,r))throw new TypeError(`${e} must not contain holes.`);const o=Object.getOwnPropertyDescriptor(i,r);if(!o||!("value"in
o)||!o.enumerable)throw new TypeError(`${e} entries must be enumerable data properties.`)}for(const n of t)if(n!=="lengt\
h"&&(typeof n!="string"||!/^(0|[1-9]\d*)$/.test(n)||Number(n)>=i.length))throw new TypeError(`${e} has an unexpected pro\
perty.`)}function Nt(i,e){if(typeof i!="number"||!Number.isFinite(i))throw new TypeError(`${e} must be finite.`);return i}
function ts(i,e){const t=Nt(i,e);if(!Number.isSafeInteger(t))throw new TypeError(`${e} must be a safe integer.`);return t}
function is(i,e){const t=ts(i,e);if(t<0)throw new TypeError(`${e} must be non-negative.`);return t}function Xi(i,e){if(typeof i!=
"boolean")throw new TypeError(`${e} must be a boolean.`);return i}function ti(i,e,t){if(!Number.isSafeInteger(i)||i<0)throw new RangeError(
"Overlay next-order allocator is outside the safe integer range.");if(!Number.isSafeInteger(e)||e<0||e>=Number.MAX_SAFE_INTEGER)
throw new RangeError("Overlay surface order cannot leave room for a safe next-order allocation.");t&&Cn(i);const n=t?i+1:
i;return Math.max(n,e+1)}function Cn(i){if(!Number.isSafeInteger(i)||i<0||i>=Number.MAX_SAFE_INTEGER)throw new RangeError(
"Overlay order allocator is exhausted.")}function ns(i){return i==="workspace"||i==="window"||i==="chrome"||i==="popover"||
i==="modal"||i==="system"}function rs(i){return i==="workspace"||i==="window"||i==="titlebar"||i==="shelf"||i==="tab"||i===
"menu"||i==="popover"||i==="modal"||i==="toast"||i==="tooltip"||i==="custom"}function ft(i,e=i.order??0){const t=i.layer??
Id(i.kind),n=Math.max(0,Math.floor(i.order??e)),r=Math.floor(i.zIndex??Xo(t)+n);return{id:i.id,rect:{...i.rect},layer:t,
kind:i.kind??"custom",zIndex:r,order:n,visible:i.visible??!0,modal:i.modal??i.kind==="modal",closeOnOutsideClick:i.closeOnOutsideClick??
!1,ownerId:i.ownerId}}function kd(i,e){return i.id===e.id&&i.layer===e.layer&&i.kind===e.kind&&i.modal===e.modal&&i.ownerId===
e.ownerId}function Id(i){switch(i){case"workspace":return"workspace";case"window":return"window";case"titlebar":case"she\
lf":case"tab":return"chrome";case"menu":case"popover":case"tooltip":return"popover";case"modal":return"modal";case"toast":
return"system";case"custom":case void 0:return"window"}}function xd(i,e){return{surface:i,column:e.column,row:e.row,localColumn:e.
column-i.rect.column,localRow:e.row-i.rect.row}}function zn(i){for(let e=i.length-1;e>=0;e-=1){const t=i[e];if(t.visible&&
t.modal)return t}}const Rd={unit:"auto",value:0},Yi={top:0,right:0,bottom:0,left:0};function wt(i){return{unit:"cell",value:Math.
max(0,Math.floor(Od(i,0)))}}function ve(){return{...Rd}}function os(){return{display:"block",position:"relative",flexDirection:"\
row",flexWrap:"nowrap",flexGrow:0,flexShrink:1,flexBasis:ve(),order:0,alignItems:"stretch",alignContent:"start",justifyContent:"\
start",alignSelf:"stretch",justifySelf:"stretch",gridTemplateColumns:[],gridTemplateRows:[],gridTemplateAreas:[],gridAutoColumns:ve(),
gridAutoRows:ve(),direction:"ltr",gridAutoFlow:"row",gridAutoFlowDense:!1,gridColumn:{},gridRow:{},width:ve(),height:ve(),
minWidth:wt(0),minHeight:wt(0),maxWidth:ve(),maxHeight:ve(),aspectRatio:void 0,boxSizing:"border-box",inset:{top:ve(),right:ve(),
bottom:ve(),left:ve()},offsetX:0,offsetY:0,margin:{...Yi},padding:{...Yi},border:{...Yi},gap:0,rowGap:0,columnGap:0,overflowX:"\
visible",overflowY:"visible",zIndex:0,opacity:1,visibility:"visible",whiteSpace:"normal",overflowWrap:"normal",variables:{}}}
function Md(i){const e={...i,flexBasis:se(i.flexBasis),gridTemplateColumns:ii(i.gridTemplateColumns),gridTemplateRows:ii(
i.gridTemplateRows),gridTemplateAreas:Ed(i.gridTemplateAreas),...i.gridTemplateColumnsAutoRepeat?{gridTemplateColumnsAutoRepeat:{
mode:i.gridTemplateColumnsAutoRepeat.mode,tracks:ii(i.gridTemplateColumnsAutoRepeat.tracks),insertAt:i.gridTemplateColumnsAutoRepeat.
insertAt}}:{},...i.gridTemplateColumnsLineNames?{gridTemplateColumnsLineNames:i.gridTemplateColumnsLineNames.map(n=>[...n])}:
{},...i.gridTemplateRowsLineNames?{gridTemplateRowsLineNames:i.gridTemplateRowsLineNames.map(n=>[...n])}:{},...i.gridTemplateRowsAutoRepeat?
{gridTemplateRowsAutoRepeat:{mode:i.gridTemplateRowsAutoRepeat.mode,tracks:ii(i.gridTemplateRowsAutoRepeat.tracks),insertAt:i.
gridTemplateRowsAutoRepeat.insertAt}}:{},direction:i.direction,...i.logicalEdges?{logicalEdges:{...i.logicalEdges}}:{},gridAutoFlowDense:i.
gridAutoFlowDense,gridAutoColumns:se(i.gridAutoColumns),gridAutoRows:se(i.gridAutoRows),gridColumn:{...i.gridColumn},gridRow:{
...i.gridRow},width:se(i.width),height:se(i.height),minWidth:se(i.minWidth),minHeight:se(i.minHeight),maxWidth:se(i.maxWidth),
maxHeight:se(i.maxHeight),inset:Ji(i.inset),hatch:i.hatch?{...i.hatch}:void 0,layers:i.layers?[...i.layers]:void 0,margin:{
...i.margin},padding:{...i.padding},border:{...i.border},variables:{...i.variables}},t=Sd(i);return t&&(e.__layoutLengths=
{margin:t.margin?Ji(t.margin):void 0,padding:t.padding?Ji(t.padding):void 0,rowGap:t.rowGap?{...t.rowGap}:void 0,columnGap:t.
columnGap?{...t.columnGap}:void 0}),e}function Sd(i){return i.__layoutLengths}function se(i){const e=i.terms?{...i,terms:i.
terms.map(t=>({...t}))}:{...i};return i.minTrack&&(e.minTrack=se(i.minTrack)),i.maxTrack&&(e.maxTrack=se(i.maxTrack)),i.
limitTrack&&(e.limitTrack=se(i.limitTrack)),e}function Ji(i){return{top:se(i.top),right:se(i.right),bottom:se(i.bottom),
left:se(i.left)}}function Od(i,e){return Number.isFinite(i)?i:e}function ii(i){const e=new Array(i.length);for(let t=0;t<
i.length;t+=1)e[t]=se(i[t]);return e}function Ed(i){const e=new Array(i.length);for(let t=0;t<i.length;t+=1){const n=i[t],
r=new Array(n.length);for(let o=0;o<n.length;o+=1)r[o]=n[o];e[t]=r}return e}function Tr(i){const e={...i.attributes??{}},
t=i.id??e.id??i.tag;e.id||(e.id=t);const n=i.classes??Td(e.class);return{id:t,tag:i.tag,classes:n.slice(),attributes:e,text:i.
text,style:i.style?Md(i.style):os(),children:[...i.children??[]],intrinsic:i.intrinsic?{...i.intrinsic}:void 0}}function Td(i){
if(!i)return[];const e=[];let t=-1;for(let n=0;n<=i.length;n+=1){const r=n<i.length?i[n]:" ";if(r!==void 0&&!Us(r)){t<0&&
(t=n);continue}t>=0&&(e.push(i.slice(t,n)),t=-1)}return e}function Pe(i,e,t){return e>=i.column&&t>=i.row&&e<i.column+Math.
max(0,i.width)&&t<i.row+Math.max(0,i.height)}const Cd=400;function zd(){return{}}const De={kind:"none"};function Cr(i,e,t={}){
const n=t.doubleClickMs??Cd;switch(e.kind){case"down":{const r=e.id;if(r===void 0)return{state:{lastClick:i.lastClick},outcome:De};
const o={id:r,column:e.column,row:e.row,moved:!1};return i.held?{state:{held:o,lastClick:i.lastClick},outcome:{kind:"rec\
overed",id:i.held.id}}:{state:{held:o,lastClick:i.lastClick},outcome:De}}case"move":{const r=i.held;return r?r.moved?{state:i,
outcome:De}:e.column===r.column&&e.row===r.row?{state:i,outcome:De}:{state:{held:{...r,moved:!0},lastClick:void 0},outcome:{
kind:"drag",id:r.id}}:{state:i,outcome:De}}case"up":{const r=i.held;if(!r)return{state:i,outcome:De};if(r.moved)return{state:{
lastClick:void 0},outcome:De};const o=i.lastClick;return o!==void 0&&o.id===r.id&&e.timestamp>=o.at&&e.timestamp-o.at<=n?
{state:{},outcome:{kind:"double-click",id:r.id}}:{state:{lastClick:{id:r.id,at:e.timestamp}},outcome:{kind:"click",id:r.
id}}}case"cancel":return{state:{lastClick:i.lastClick},outcome:De}}}class Ye extends Error{constructor(e,t,n,r){super(t),
this.code=e,this.result=n,this.cause=r,this.name="MarkupWindowHistoryRestoreError"}}class lt extends Ye{constructor(e){super(
"snapshot-mismatch",e),this.name="MarkupWindowHistoryReplayConflictError"}}const _e=128,Xn=512,$d=32,Ad=256,ss=Symbol("M\
arkupWindowHistorySemanticId"),zr=new WeakMap;class Wd{controller;history;#e;#t;#i;#o;#n;#s=!1;#r=0;#a=0;#d=0;#u=0;#w;#f;#p;#g;#m;constructor(e){
this.controller=e.controller,this.history=e.history,this.#e=tn(e.idPrefix,"window",_e),this.#t=tn(e.group,"windows",_e),
this.#i=e.label,this.#n=Nd(this.controller),this.#o=e.restoreSnapshot??(t=>this.controller.restoreSnapshot(t))}get disposed(){
return this.#s}focus(e){const t=re("focus",e);return this.#h(t,()=>this.controller.focus(e))}move(e,t){const n=re("move",
e,void 0,{delta:t});return this.#h(n,()=>this.controller.move(e,t))}swap(e,t){const n=re("swap",e,t);return this.#h(n,()=>this.
controller.swap(e,t))}dock(e,t,n,r={}){const o={edge:n};r.ratio!==void 0&&(o.ratio=r.ratio);const s=re("dock",e,t,o);return this.#h(
s,()=>this.controller.dock(e,t,n,r))}resize(e,t,n,r={}){const o={delta:t,column:n.column,row:n.row,width:n.width,height:n.
height};r.gap!==void 0&&(o.gap=r.gap),r.separatorHitSize!==void 0&&(o.separatorHitSize=r.separatorHitSize),r.compactMode!==
void 0&&(o.compactMode=r.compactMode);const s=re("resize",e,void 0,o);return this.#h(s,()=>this.controller.resize(e,t,n,
r))}resizeRatio(e,t){const n=re("resize-ratio",e,void 0,{delta:t});return this.#h(n,()=>this.controller.resizeRatio(e,t))}minimize(e){
const t=re("minimize",e);return this.#h(t,()=>this.controller.minimize(e))}maximize(e){const t=re("maximize",e);return this.#h(
t,()=>this.controller.maximize(e))}restore(e){const t=re("restore",e);return this.#h(t,()=>this.controller.restore(e))}close(e){
const t=re("close",e);return this.#h(t,()=>this.controller.close(e))}setPlacement(e,t,n={}){const r=re("set-placement",e,
void 0,{placement:t,...Ld(n.rect)});return this.#h(r,()=>this.controller.setPlacement(e,t,n))}setFloatingRect(e,t){const n=re(
"set-floating-rect",e,void 0,mi(t));return this.#h(n,()=>this.controller.setFloatingRect(e,t))}moveBy(e,t){const n=re("m\
ove-by",e,void 0,Ar(t));return this.#h(n,()=>this.controller.moveBy(e,t))}resizeWindow(e,t,n){const r=re("resize-window",
e,void 0,{edge:t,...Ar(n)});return this.#h(r,()=>this.controller.resizeWindow(e,t,n))}snap(e,t,n){const r=t.kind==="dock"?
t.targetId:void 0,o={targetKind:t.kind,...mi(n,"bounds")};t.kind==="corner"?o.corner=t.corner:o.edge=t.edge,t.kind==="do\
ck"&&t.ratio!==void 0&&(o.ratio=t.ratio);const s=re("snap",e,r,o);return this.#h(s,()=>this.controller.snap(e,t,n))}setAlwaysOnTop(e,t){
const n=re("set-always-on-top",e,void 0,{value:t?1:0});return this.#h(n,()=>this.controller.setAlwaysOnTop(e,t))}setGroup(e,t){
const n=re("set-group",e,void 0,{groupId:t??""});return this.#h(n,()=>this.controller.setGroup(e,t))}recoverBounds(e,t,n={}){
const r=mi(t,"bounds");n.margin!==void 0&&(r.margin=n.margin),n.titleBarHeight!==void 0&&(r.titleBarHeight=n.titleBarHeight);
const o=re("recover-bounds",e,void 0,r);return this.#h(o,()=>this.controller.recoverBounds(e,t,n))}beginGesture(e){const t=as(
e);if(this.#r+=1,this.#w=gi(t),this.#p=void 0,this.#s||this.controller.disposed||this.controller.mutationInProgress||this.#n.
lease){const p=this.#s?"window-history-adapter-disposed":this.controller.disposed?"window-controller-disposed":this.controller.
mutationInProgress?"window-controller-mutation-in-progress":Zi(this.#n.lease.kind);return this.#d+=1,this.#f=Qi(t,p,this.#s||
this.controller.disposed?"disposed":"blocked"),Fd(t,p)}const n=Symbol("MarkupWindowHistoryGesture");this.#n.lease={token:n,
kind:"gesture"},this.#g=n;let r;try{r=ee(this.#c())}catch(p){throw this.#g===n&&(this.#g=void 0),this.#m=void 0,this.#n.
lease?.token===n&&(this.#n.lease=void 0),this.#u+=1,p}const o=$r(t,r);let s="active",a,c,d,l=!1;const u=p=>{s=p,this.#g===
n&&(this.#g=void 0),this.#m=void 0,this.#n.lease?.token===n&&(this.#n.lease=void 0)},h=p=>{throw this.#u+=1,this.#p=void 0,
c=Jd(p),u("failed"),p},f=Object.freeze({commit:()=>{if(s!=="active"||d)return!1;d="commit";try{if(this.#s){try{const g=ee(
this.#c());this.#b(en(r,g,t),g,o)}catch(g){return h(g)}return a=!1,c="window-history-adapter-disposed",this.#d+=1,this.#f=
ni(t,c),u("cancelled"),!1}let p;try{p=ee(this.#c())}catch(g){return h(g)}if(a=!Ke(r,p),!a)return this.#d+=1,this.#f=ri(t,
"unchanged","gesture-produced-no-state-change"),u("committed"),!1;let w;try{if(w=this.#l(t),s!=="active"||this.#n.lease?.
token!==n)return!1;const g=ee(this.#c());if(l)return this.#b(en(r,g,t),g,o),a=!1,c="gesture-cancelled-during-commit",this.#d+=
1,this.#f=ri(t,"unchanged",c),u("cancelled"),!1;if(!Ke(p,g))throw this.#b(r,g,o),new Error("window-history-metadata-muta\
ted-managed-state");const R=ee(r),m=ee(p),M=this.#x(R,m,o,n);this.history.push({...w,...M})}catch(g){if(s!=="active")return!1;
try{this.#b(r,p,o)}catch(R){return h(rn(g,R))}return h(g)}return this.#a+=1,this.#p={...w},this.#f=ri(t,"applied"),u("co\
mmitted"),!0}finally{d=void 0}},cancel:()=>{if(s!=="active")return!1;if(d==="commit")return l=!0,!1;if(d)return!1;d="can\
cel";try{const p=ee(this.#c());Ke(r,p)||this.#b(en(r,p,t),p,o)}catch(p){return h(p)}finally{d=void 0}return a=!1,c="gest\
ure-cancelled",this.#d+=1,this.#f=ri(t,"unchanged",c),u("cancelled"),!0},inspect:()=>({state:s,operation:gi(t),...a===void 0?
{}:{changed:a},...c===void 0?{}:{reason:c}})});return this.#m=f.cancel,f}inspect(){return{disposed:this.#s,idPrefix:this.#e,
group:this.#t,attemptedActions:this.#r,recordedActions:this.#a,skippedActions:this.#d,failedActions:this.#u,lastOperation:this.#w?
structuredClone(this.#w):void 0,lastResult:this.#f?{...this.#f}:void 0,lastEntry:this.#p?{...this.#p}:void 0,history:this.
history.inspect()}}dispose(){this.#s||(this.#s=!0,this.#m?.())}#h(e,t){if(this.#r+=1,this.#w=structuredClone(e),this.#s){
const l=ni(e,"window-history-adapter-disposed");return this.#d+=1,this.#f=l,this.#p=void 0,l}if(this.controller.disposed){
const l=ni(e,"window-controller-disposed");return this.#d+=1,this.#f=l,this.#p=void 0,l}if(this.controller.mutationInProgress){
const l=Qi(e,"window-controller-mutation-in-progress","blocked");return this.#d+=1,this.#f=l,this.#p=void 0,l}if(this.#n.
lease){const l=Zi(this.#n.lease.kind),u=Qi(e,l,"blocked");return this.#d+=1,this.#f=u,this.#p=void 0,u}const n=Symbol("M\
arkupWindowHistoryAction");this.#n.lease={token:n,kind:"action"};let r,o,s=!1,a,c=!0;try{a=ee(this.#c()),c=$r(e,a),r=this.#l(
e);const l=ee(this.#c());if(!Ke(a,l))throw this.#b(a,l,c),new Error("window-history-metadata-mutated-managed-state");const u=a,
h=r;this.history.transactionSync(h,f=>{const p=ee(u);let w=ee(p),g=!0,R,m,M=!0,I,E;if(f.apply({...h,undo:()=>{if(I){const $=I;
I=void 0,$==="restore"&&(w=this.#y(w,void 0,c,n));return}if(M)try{w=this.#y(p,m,c,n)}catch($){throw E=$ instanceof lt?"n\
oop":"restore",$}},redo:()=>{if(E){const $=E;E=void 0,$==="restore"&&m&&(m=this.#y(m,void 0,c,n));return}if(g){g=!1,o=t(),
R=ee(this.#c()),m=ee(R),M=!Ke(p,R);return}if(!R)throw new Error(`Window action ${e.action} has no captured redo snapshot\
.`);try{m=this.#y(R,w,c,n)}catch($){throw I=$ instanceof lt?"noop":"restore",$}}}),o?.status!=="applied"||!M){o?.status===
"applied"&&(o={...o,status:"unchanged",ok:!0}),f.discard();return}s=!0})}catch(l){let u=l;if(a&&!this.history.isPoisoned())
try{const h=ee(this.#c());Ke(a,h)||this.#b(a,h,c)}catch(h){u=rn(l,h)}throw this.#u+=1,this.#f=o?{...o}:void 0,this.#p=void 0,
u}finally{this.#n.lease?.token===n&&(this.#n.lease=void 0)}const d=o??ni(e,"controller-returned-no-result");return this.#f=
{...d},s?(this.#a+=1,this.#p={...r}):(this.#d+=1,this.#p=void 0),d}#l(e){const t=tn(this.#i?.(gi(e)),"",Xn);return{id:jd(
this.#e,e),label:t||Dd(Bd(e)),group:this.#t}}#c(){const e=structuredClone(this.controller.snapshot()),t=this.controller.
inspect().modals.filter(n=>n.registered).map(n=>n.id);return{controller:e,workspaceRegistrations:e.windowIds.map(n=>({id:n,
generation:this.controller.workspace.windowRegistrationGeneration(n)})),overlays:Gd(t,this.controller.overlays,this.controller.
overlays.snapshot())}}#v(e,t,n=!1){const r=this.controller.overlays.activeMutationRevision(),o=this.controller.overlays.
snapshot(),s=new Map(o.surfaces.map(u=>[u.id,this.controller.overlays.registrationGeneration(u.id)])),a=ee(e);Pr(a,t,this.
controller.workspace),Lr(a.overlays,t?.overlays,o,this.controller.overlays),Vd(a.overlays,t?.overlays,o,n);let c;try{c=this.#o(
structuredClone(a.controller))}catch(u){throw new Ye("controller-threw","Markup window controller threw while restoring \
a history snapshot.",void 0,u)}if(!c.ok)throw new Ye("controller-rejected",`Markup window controller rejected history re\
storation with status ${c.status}.`,{...c});Pr(a,t,this.controller.workspace);const d=this.controller.overlays.snapshot();
Lr(a.overlays,t?.overlays,d,this.controller.overlays),Kd(a.overlays,o,s,d,this.controller.overlays);try{if(Xd(this.controller.
overlays,a.overlays,d),this.controller.overlays.activeMutationRevision()!==r){const u=this.controller.overlays.snapshot(),
h=this.controller.overlays.lastExternallyAssignedActiveId(),f=h&&u.surfaces.some(w=>w.id===h)?h:void 0;this.controller.overlays.
synchronizeActiveId(f);const p=this.controller.overlays.snapshot();Yn(a.overlays,p.activeId,be(p.surfaces,a.overlays.rootIds))}}catch(u){
throw new Ye("overlay-threw","Overlay stack threw while restoring managed window-history surfaces.",void 0,u)}const l=this.#c();
if(!Ke(l,a))throw new Ye("snapshot-mismatch","Markup window history restoration did not reproduce the required exact sna\
pshot.");return ee(l)}#y(e,t,n,r){if(this.#n.lease){if(this.#n.lease.token===r)return this.#v(e,t,n);throw new lt(`Marku\
p window replay is blocked by ${Zi(this.#n.lease.kind)}.`)}if(t){let s;try{s=this.controller.snapshot()}catch(a){throw new Ye(
"controller-threw","Markup window controller threw while checking replay ownership.",void 0,a)}if(JSON.stringify(s)!==JSON.
stringify(t.controller))throw new lt("Markup window replay was rejected because managed controller or shared workspace s\
tate diverged.")}const o=Symbol("MarkupWindowHistoryReplay");this.#n.lease={token:o,kind:"replay"};try{return this.#v(e,
t,n)}finally{this.#n.lease?.token===o&&(this.#n.lease=void 0)}}#x(e,t,n,r){let o=ee(e),s=ee(t),a,c;return{undo:()=>{if(a){
const d=a;a=void 0,d==="restore"&&(o=this.#y(o,void 0,n,r));return}try{o=this.#y(e,s,n,r)}catch(d){throw c=d instanceof lt?
"noop":"restore",d}},redo:()=>{if(c){const d=c;c=void 0,d==="restore"&&(s=this.#y(s,void 0,n,r));return}try{s=this.#y(t,
o,n,r)}catch(d){throw a=d instanceof lt?"noop":"restore",d}}}}#b(e,t,n=!1){try{this.#v(e,t,n)}catch(r){try{this.#v(t,e,n)}catch(o){
throw rn(r,o)}throw r}}}function Pd(i){return new Wd(i)}function Nd(i){let e=zr.get(i);return e||(e={},zr.set(i,e)),e}function Zi(i){
return i==="gesture"?"window-history-gesture-active":i==="replay"?"window-history-replay-active":"window-history-operati\
on-active"}function $r(i,e){const t=i[ss]??i.id;return!(t!==void 0&&e.overlays.rootIds.includes(t))||i.action!=="focus"&&
i.action!=="close"&&i.action!=="restore"}function re(i,e,t,n){return as({action:i,id:e,targetId:t,parameters:n?{...n}:void 0})}
function ni(i,e){return{action:i.action,status:"disposed",ok:!1,id:i.id,targetId:i.targetId,reason:e}}function Qi(i,e,t){
return{action:i.action,status:t,ok:!1,id:i.id,targetId:i.targetId,reason:e}}function jd(i,e){const t=[i,e.action];return e.
id&&t.push(nn(e.id)),e.targetId&&t.push(nn(e.targetId)),e.action==="dock"&&e.parameters?.edge&&t.push(nn(String(e.parameters.
edge))),t.join(".")}function Bd(i){const e=Wr(i.id??"unknown"),t=Wr(i.targetId??"unknown");switch(i.action){case"focus":
return`Focus surface ${e}`;case"move":return`Move window ${e}`;case"swap":return`Swap windows ${e} and ${t}`;case"dock":
return`Dock window ${e} ${String(i.parameters?.edge??"beside")} ${t}`;case"resize":return`Resize split ${e}`;case"resize\
-ratio":return`Resize split ratio ${e}`;case"minimize":return`Minimize surface ${e}`;case"maximize":return`Maximize wind\
ow ${e}`;case"restore":return`Restore surface ${e}`;case"close":return`Close surface ${e}`;case"set-placement":return`${i.
parameters?.placement==="floating"?"Float":"Tile"} window ${e}`;case"set-floating-rect":return`Set floating rectangle ${e}`;case"\
move-by":return`Move floating window ${e}`;case"resize-window":return`Resize floating window ${e}`;case"snap":return`Sna\
p window ${e}`;case"set-always-on-top":return`${i.parameters?.value===1?"Pin":"Unpin"} window ${e}`;case"set-group":return`${i.
parameters?.groupId?"Group":"Ungroup"} window ${e}`;case"recover-bounds":return`Recover window bounds ${e}`;default:return`\
Update window ${e}`}}function mi(i,e=""){const t=n=>e?`${e}${n[0].toUpperCase()}${n.slice(1)}`:n;return{[t("column")]:i.
column,[t("row")]:i.row,[t("width")]:i.width,[t("height")]:i.height}}function Ld(i){return i?mi(i):{}}function Ar(i){return{
columns:i.columns,rows:i.rows}}function ee(i){return structuredClone(i)}function en(i,e,t){const n=ee(i);return t.action!==
"move-by"&&t.action!=="resize-window"||(n.controller.workspace=structuredClone(e.controller.workspace),n.controller.modals=
e.controller.modals.map(r=>({...r})),n.overlays=structuredClone(e.overlays)),n}function Ke(i,e){return JSON.stringify(i.
controller)===JSON.stringify(e.controller)&&JSON.stringify(i.workspaceRegistrations)===JSON.stringify(e.workspaceRegistrations)&&
JSON.stringify({activeId:i.overlays.activeId,externalActiveId:i.overlays.externalActiveId,rootIds:i.overlays.rootIds,registrations:i.
overlays.registrations,surfaces:i.overlays.surfaces})===JSON.stringify({activeId:e.overlays.activeId,externalActiveId:e.
overlays.externalActiveId,rootIds:e.overlays.rootIds,registrations:e.overlays.registrations,surfaces:e.overlays.surfaces})}
function tn(i,e,t){return Ne(i,t)||e}function nn(i){return encodeURIComponent(Ne(i,_e)).replaceAll(".","%2E")}function Wr(i){
return JSON.stringify(Ne(i,_e))}function as(i){const e={};let t=0,n=0;const r=i.parameters??{};for(const a in r){if(n>=$d)
break;if(n+=1,!Object.hasOwn(r,a))continue;const c=r[a],d=Ne(a,_e);if(d){if(typeof c=="number"){if(!Number.isFinite(c))continue;
e[d]=c}else e[d]=Ne(String(c),_e);t+=1}}const o=typeof i.id=="string"?i.id.trim().slice(0,Ad):void 0,s={action:i.action,
id:o===void 0?void 0:Ne(o,_e),targetId:i.targetId===void 0?void 0:Ne(i.targetId,_e),...t===0?{}:{parameters:e}};return o!==
void 0&&Object.defineProperty(s,ss,{value:o}),s}function gi(i){return{...i,...i.parameters?{parameters:{...i.parameters}}:
{}}}function Dd(i){return Ne(i,Xn)||"Update window"}function Ne(i,e){if(typeof i!="string"||e<=0)return"";const t=Math.min(
i.length,e*4);let n="";for(let r=0;r<t&&n.length<e;r+=1){const o=i.charCodeAt(r);if(o>=55296&&o<=56319){const s=r+1<t?i.
charCodeAt(r+1):-1;s>=56320&&s<=57343&&n.length+2<=e?(n+=i[r]+i[r+1],r+=1):n+="�";continue}n+=o>=56320&&o<=57343?"�":
i[r]}return n.trim()}function ri(i,e,t){return{action:i.action,status:e,ok:!0,id:i.id,targetId:i.targetId,...t===void 0?
{}:{reason:t}}}function Fd(i,e){const t={state:"unavailable",operation:gi(i),changed:!1,reason:e};return Object.freeze({
commit:()=>!1,cancel:()=>!1,inspect:()=>structuredClone(t)})}function Pr(i,e,t){const n=new Map((e?.workspaceRegistrations??
i.workspaceRegistrations).map(I=>[I.id,I.generation])),r=new Set;for(const I of i.workspaceRegistrations){const E=n.get(
I.id)??I.generation;t.windowRegistrationGeneration(I.id)!==E&&r.add(I.id)}const o=t.snapshot(),s=new Map,a=[],c=o.layout.
root?[o.layout.root]:[];for(;c.length>0;){const I=c.pop();I.kind==="pane"?(s.set(I.windowId,structuredClone(I)),a.push({
id:I.windowId,minWidth:I.minWidth,minHeight:I.minHeight})):c.push(I.second,I.first)}const d=new Set(Nr(i.controller.workspace.
layout.root).map(({id:I})=>I)),l=new Set([...i.workspaceRegistrations.map(({id:I})=>I),...e?.workspaceRegistrations.map(
({id:I})=>I)??[]]),u=a.filter(({id:I})=>!d.has(I)&&!l.has(I));if(r.size===0&&u.length===0)return;if(r.size>0){i.controller.
workspace.layout.root=qt(i.controller.workspace.layout.root,r,s);const I=new Set(i.controller.windowIds.filter(E=>!r.has(
E)));if(i.controller.windowIds=i.controller.windowIds.filter(E=>I.has(E)),i.controller.minimizedWindowIds=i.controller.minimizedWindowIds.
filter(E=>I.has(E)),i.controller.closedWindowIds=i.controller.closedWindowIds.filter(E=>I.has(E)),i.controller.focusOrderWindowIds=
i.controller.focusOrderWindowIds.filter(E=>I.has(E)),i.controller.placements=i.controller.placements.filter(E=>I.has(E.id)).
map(E=>E.snapTarget?.kind==="dock"&&r.has(E.snapTarget.targetId)?{...E,snapTarget:void 0}:E),i.workspaceRegistrations=i.
workspaceRegistrations.filter(E=>I.has(E.id)),i.controller.maximizedWindowId&&r.has(i.controller.maximizedWindowId)&&(i.
controller.maximizedWindowId=void 0),!i.controller.activeWindowId||r.has(i.controller.activeWindowId)){const E=e?.controller.
activeWindowId;i.controller.activeWindowId=E&&I.has(E)?E:[...i.controller.focusOrderWindowIds].reverse().find($=>!i.controller.
minimizedWindowIds.includes($)&&!i.controller.closedWindowIds.includes($))}}const h=new Set(u.map(({id:I})=>I));u.length>
0&&(i.controller.workspace.layout.root=Hd(i.controller.workspace.layout.root,o.layout.root,h));const f=qd(o.layout.root,
o.layout.activePaneId),p=f&&h.has(f)?f:void 0;if(u.length>0){const I=Nr(i.controller.workspace.layout.root),E=new Set(I.
map(({id:$})=>$));i.controller.workspace.layout=ui(i.controller.workspace.layout,[...I,...u.filter(({id:$})=>!E.has($))],
{activeWindowId:p})}const w=i.controller.activeWindowId,g=i.controller.placements.find(I=>I.id===w)?.placement,R=p?jr(i.
controller.workspace.layout.root,p):w&&g==="tiled"?jr(i.controller.workspace.layout.root,w):void 0,m=Br(i.controller.workspace.
layout.root,i.controller.workspace.layout.activePaneId)?i.controller.workspace.layout.activePaneId:void 0,M=Br(i.controller.
workspace.layout.root,o.layout.activePaneId)?o.layout.activePaneId:void 0;i.controller.workspace.layout.activePaneId=R??
m??M??Ud(i.controller.workspace.layout.root)}function Nr(i){const e=[],t=i?[i]:[];for(;t.length>0;){const n=t.pop();n.kind===
"pane"?e.push({id:n.windowId,minWidth:n.minWidth,minHeight:n.minHeight}):t.push(n.second,n.first)}return e}function Hd(i,e,t){
if(!i||!e||t.size===0)return i;const n=new Map;for(const a of _d(i))n.set(a.windowId,a);const r=new Set;let o=i;const s=a=>{
if(a.kind==="pane")return;const c=$n(a,n,t);if(c.hasAddition&&!c.unsafe&&c.anchors.size===1){const d=c.anchors.values().
next().value,l=n.get(d);if(l&&!r.has(d)){const u=new Set([d]),h=qt(structuredClone(a),u,new Map([[d,l]]));h&&(o=qt(o,u,new Map(
[[d,h]]))??o,r.add(d))}return}s(a.first),s(a.second)};return s(e),o}function $n(i,e,t){if(i.kind==="pane")return t.has(i.
windowId)?{hasAddition:!0,anchors:new Set,unsafe:!1}:e.has(i.windowId)?{hasAddition:!1,anchors:new Set([i.windowId]),unsafe:!1}:
{hasAddition:!1,anchors:new Set,unsafe:!0};const n=$n(i.first,e,t),r=$n(i.second,e,t);return{hasAddition:n.hasAddition||
r.hasAddition,anchors:new Set([...n.anchors,...r.anchors]),unsafe:n.unsafe||r.unsafe}}function _d(i){const e=[],t=i?[i]:
[];for(;t.length>0;){const n=t.pop();n.kind==="pane"?e.push(n):t.push(n.second,n.first)}return e}function qd(i,e){if(!i||
!e)return;const t=[i];for(;t.length>0;){const n=t.pop();if(n.kind==="pane"){if(n.id===e)return n.windowId}else t.push(n.
second,n.first)}}function qt(i,e,t){if(!i)return;if(i.kind==="pane")return e.has(i.windowId)?structuredClone(t.get(i.windowId)):
i;const n=qt(i.first,e,t),r=qt(i.second,e,t);return!n||!r?n??r:{...i,first:n,second:r}}function jr(i,e){if(!i)return;const t=[
i];for(;t.length>0;){const n=t.pop();if(n.kind==="pane"){if(n.windowId===e)return n.id}else t.push(n.second,n.first)}}function Br(i,e){
if(!i||!e)return!1;const t=[i];for(;t.length>0;){const n=t.pop();if(n.kind==="pane"){if(n.id===e)return!0}else t.push(n.
second,n.first)}return!1}function Ud(i){if(!i)return;const e=[i];for(;e.length>0;){const t=e.pop();if(t.kind==="pane")return t.
id;e.push(t.second,t.first)}}function Gd(i,e,t){const n=i.slice(),r=be(t.surfaces,n),o=t.activeId&&r.has(t.activeId)?t.activeId:
void 0;return{activeId:o,externalActiveId:t.activeId!==void 0&&o===void 0?t.activeId:void 0,nextOrder:t.nextOrder,rootIds:n.
slice(),registrations:t.surfaces.filter(s=>r.has(s.id)).map(s=>({id:s.id,generation:e.registrationGeneration(s.id)})),surfaces:t.
surfaces.filter(s=>r.has(s.id)).map(tt)}}function Lr(i,e,t,n){const r=i.activeId,o=new Map(i.registrations.map(w=>[w.id,
w.generation])),s=e?new Map(e.surfaces.map(w=>[w.id,w])):void 0,a=new Map(t.surfaces.map(w=>[w.id,w])),c=new Map(i.surfaces.
map(w=>[w.id,w])),d=new Set,l=new Set;for(const w of i.rootIds){const g=a.get(w),R=o.get(w),m=s?.get(w);if(!(g&&n.registrationGeneration(
w)===R&&(!s||m&&Yd(m,g))))for(const M of be(i.surfaces,[w]))d.add(M),l.add(M)}d.size>0&&(i.rootIds=i.rootIds.filter(w=>!d.
has(w)),i.surfaces=i.surfaces.filter(w=>!d.has(w.id)),i.registrations=i.registrations.filter(w=>!d.has(w.id)),i.activeId&&
d.has(i.activeId)&&(i.activeId=void 0));const u=be(t.surfaces,i.rootIds),h=be(i.surfaces,i.rootIds);for(const w of h){if(i.
rootIds.includes(w))continue;const g=a.get(w);if(!g){for(const I of be(i.surfaces,[w]))d.add(I),l.add(I);continue}const R=n.
registrationGeneration(w),m=o.get(w),M=s?.get(w);if(!(R===m&&(!s||M&&Jn(M,g))))if(l.add(w),u.has(w)&&R!==void 0)c.set(w,
tt(g)),o.set(w,R);else for(const I of be(i.surfaces,[w]))d.add(I),l.add(I)}for(const w of t.surfaces){if(!u.has(w.id)||h.
has(w.id))continue;const g=n.registrationGeneration(w.id);g!==void 0&&(l.add(w.id),i.surfaces.push(tt(w)),i.registrations.
push({id:w.id,generation:g}),c.set(w.id,tt(w)),o.set(w.id,g))}d.size>0&&(i.surfaces=i.surfaces.filter(w=>!d.has(w.id)),i.
registrations=i.registrations.filter(w=>!d.has(w.id))),i.surfaces=i.surfaces.map(w=>c.get(w.id)??w),i.registrations=i.registrations.
map(w=>({id:w.id,generation:o.get(w.id)??w.generation}));const f=be(i.surfaces,i.rootIds),p=r!==void 0&&!f.has(r);i.activeId&&
!f.has(i.activeId)&&(i.activeId=void 0),t.activeId&&l.has(t.activeId)?f.has(t.activeId)?(i.activeId=t.activeId,i.externalActiveId=
void 0):(i.activeId=void 0,i.externalActiveId=t.activeId):p&&t.activeId&&f.has(t.activeId)&&(i.activeId=t.activeId,i.externalActiveId=
void 0)}function Vd(i,e,t,n){const r=be(t.surfaces,i.rootIds),o=e?.externalActiveId??e?.activeId,s=e!==void 0&&t.activeId!==
o;n||s?Yn(i,t.activeId,r):i.externalActiveId&&!t.surfaces.some(a=>a.id===i.externalActiveId)&&(i.externalActiveId=void 0)}
function Kd(i,e,t,n,r){i.externalActiveId&&!n.surfaces.some(d=>d.id===i.externalActiveId)&&(i.externalActiveId=void 0);const o=n.
activeId;if(!o||o===e.activeId)return;const s=e.surfaces.find(d=>d.id===o),a=n.surfaces.find(d=>d.id===o),c=r.registrationGeneration(
o)!==t.get(o);s&&a&&!c&&Jn(s,a)||Yn(i,o,be(n.surfaces,i.rootIds))}function Yn(i,e,t){e&&t.has(e)?(i.activeId=e,i.externalActiveId=
void 0):(i.activeId=void 0,i.externalActiveId=e)}function Xd(i,e,t=i.snapshot()){const n=t,r=be(n.surfaces,e.rootIds),o=[];
let s=!1;for(const u of n.surfaces){if(r.has(u.id)){if(!s){for(const h of e.surfaces)o.push(tt(h));s=!0}continue}o.push(
tt(u))}if(!s)for(const u of e.surfaces)o.push(tt(u));let a=e.nextOrder;for(const u of o)a=Math.max(a,u.order+1);const c=new Set(
e.surfaces.map(u=>u.id)),l=(e.externalActiveId&&o.some(u=>u.id===e.externalActiveId)?e.externalActiveId:void 0)??(e.activeId&&
c.has(e.activeId)?e.activeId:void 0);i.restoreSnapshot({activeId:l,nextOrder:a,surfaces:o},{synchronizeFocus:!0})}function be(i,e){
const t=new Set(e),n=new Map;for(const o of i){if(!o.ownerId)continue;const s=n.get(o.ownerId);s?s.push(o.id):n.set(o.ownerId,
[o.id])}const r=[...t];for(let o=0;o<r.length;o+=1)for(const s of n.get(r[o])??[])t.has(s)||(t.add(s),r.push(s));return t}
function tt(i){return{...i,rect:{...i.rect}}}function Yd(i,e){return Jn(i,e)&&i.rect.column===e.rect.column&&i.rect.row===
e.rect.row&&i.rect.width===e.rect.width&&i.rect.height===e.rect.height&&i.closeOnOutsideClick===e.closeOnOutsideClick}function Jn(i,e){
return i.id===e.id&&i.layer===e.layer&&i.kind===e.kind&&i.modal===e.modal&&i.ownerId===e.ownerId}function rn(i,e){return new Ye(
"snapshot-mismatch","Window gesture restoration failed and compensation could not restore the prior snapshot.",void 0,new AggregateError(
[i,e],"Window gesture restoration and compensation both failed."))}function Jd(i){return Ne(i instanceof Error?i.message:
String(i),Xn)||"window-history-gesture-failed"}const Zd="markup-floating-windows",Qd=2,el=1,tl=1,il=.2,nl=4,Te=1e9,rl=128,
Dr=64;function on(i,e,t={}){const n=ds(e),r=cs(t);if(!(!n||!r)&&!i.topModalId)for(let o=i.floatingZOrder.length-1;o>=0;o-=
1){const s=i.floatingZOrder[o];if(!(!s.visible||!wl(s.rect,n)))return Object.freeze({id:s.id,region:sl(s,n,r),rect:Object.
freeze(Se(s.rect)),zIndex:s.zIndex,alwaysOnTop:s.alwaysOnTop})}}class ol{controller;capture;history;#e;#t;#i;#o;#n;#s;#r=!1;#a;#d;#u=new Map;#w;#f=!1;#p=!1;constructor(e){
if(!e||typeof e!="object")throw new TypeError("Window interaction options are required.");if(this.controller=e.controller,
this.capture=e.capture,this.history=e.history,this.history&&this.history.controller!==this.controller)throw new TypeError(
"Window interaction history must wrap the same window controller.");this.#e=al(e);const t=this.capture.registerOwner({id:this.#e.
ownerId,onPointer:n=>{const r=this.#n,o=this.#s;if(!(!r||!o||this.#r||n.pointerId!==o.pointerId||n.kind!==o.kind||n.sequence!==
o.sequence)){this.#r=!0;try{this.#a=this.#h(n,r)}catch(s){this.#a=this.#M(n,s)}}}});this.#t=t;try{this.#i=this.capture.subscribe(
n=>this.#m(n))}catch(n){throw t.dispose(),n}}hitTest(e,t){if(!this.#f){this.#f=!0;try{if(this.#C()||this.controller.overlays.
topModal())return;const n=Fr(t);if(!n)return;try{const r=on(this.controller.project(n),e,this.#e);return this.#C()?void 0:
r}catch{return}}finally{this.#f=!1}}}handlePointer(e,t){if(this.#f)return q({status:"blocked",handled:!1,reason:"interac\
tion-route-is-reentrant"});this.#f=!0;try{return this.#g(e,t)}finally{this.#f=!1}}#g(e,t){let n=this.#C(),r;try{r=Ai(e)}catch{
return n?this.#I(q({status:"disposed",handled:!1,reason:"interaction-dependency-disposed"})):this.#I(q({status:"ignored",
handled:!1,reason:"pointer-event-is-invalid"}))}n=this.#C()||n;const o=this.#u.get(r.pointerId);if(o?.pointerId===r.pointerId&&
r.kind!=="down")return this.#u.delete(r.pointerId),this.#I(q({...o,pointerKind:o.pointerKind??r.kind}));if(o?.pointerId===
r.pointerId&&this.#u.delete(r.pointerId),r.kind==="down"&&this.#u.size>=Dr)return this.#I(q({status:"blocked",handled:!1,
pointerId:r.pointerId,pointerKind:r.kind,reason:"pending-lifecycle-settlement-capacity-exhausted"}));if(n)return this.#I(
q({status:"disposed",handled:!1,pointerId:r.pointerId,pointerKind:r.kind,reason:"interaction-dependency-disposed"}));if(this.#n)
return this.#I(q({status:"blocked",handled:!1,pointerId:r.pointerId,pointerKind:r.kind,reason:"interaction-route-is-reen\
trant"}));let s=Fr(t);if(this.#C()){const u=this.#u.get(r.pointerId);return u&&r.kind!=="down"?(this.#u.delete(r.pointerId),
this.#I(q({...u,pointerKind:u.pointerKind??r.kind}))):(u&&this.#u.delete(r.pointerId),this.#I(q({status:"disposed",handled:!1,
pointerId:r.pointerId,pointerKind:r.kind,reason:"interaction-dependency-disposed"})))}const a=this.capture.captureOwner(
r.pointerId)===this.#e.ownerId;if(!s&&a&&this.#o?.pointerId===r.pointerId&&(r.kind==="up"||r.kind==="cancel")&&(s=Se(this.#o.
bounds)),!s)return this.#I(q({status:"ignored",handled:!1,pointerId:r.pointerId,pointerKind:r.kind,reason:"bounds-are-in\
valid-or-empty"}));let c;if(r.kind==="down"){if(!ml(r))return this.#I($t(r,"pointer-is-not-a-primary-activation"));const u=zt(
r);if(!u)return this.#I($t(r,"pointer-has-no-finite-cell-coordinate"));const h=this.controller.overlays.topModal();if(h)
return this.#I(q({status:"blocked",handled:!1,pointerId:r.pointerId,pointerKind:r.kind,reason:`pointer-blocked-by-modal-\
overlay:${h.id}`}));let f;try{f=this.controller.project(s)}catch(w){return this.#I(q({status:"failed",handled:!1,pointerId:r.
pointerId,pointerKind:r.kind,reason:`window-projection-failed:${ue(w)}`}))}const p=on(f,u,this.#e);if(!p)return this.#I(
$t(r,"pointer-did-not-hit-a-floating-window"));if(p.region==="client")return this.#I(q({status:"ignored",handled:!1,pointerId:r.
pointerId,pointerKind:r.kind,windowId:p.id,region:p.region,reason:"client-hit-is-not-a-window-geometry-gesture"}));if(f.
floatingZOrder.find(w=>w.id===p.id)?.state==="maximized")return this.#I(q({status:"blocked",handled:!1,pointerId:r.pointerId,
pointerKind:r.kind,windowId:p.id,region:p.region,reason:"maximized-window-geometry-is-not-interactive"}));c=this.#e.ownerId}else if(!a)
return this.#I($t(r,"pointer-is-not-captured-by-this-controller"));this.#n=s,this.#s={kind:r.kind,pointerId:r.pointerId,
sequence:r.sequence},this.#r=!1,this.#a=void 0;let d;try{d=this.capture.route(r,c).error?.message}catch(u){d=ue(u)}finally{
this.#n=void 0,this.#s=void 0,this.#r=!1}const l=this.#a;return this.#a=void 0,l?this.#I(l):this.#I(q({status:d?"failed":
"ignored",handled:!1,pointerId:r.pointerId,pointerKind:r.kind,reason:d?`pointer-route-failed:${d}`:"pointer-route-had-no\
-owner"}))}inspect(){return this.#C(),{disposed:this.#p,ownerId:this.#e.ownerId,titleBarHeight:this.#e.titleBarHeight,resizeMargin:this.#e.
resizeMargin,snapDistance:this.#e.snapDistance,snapEdgeSpanRatio:this.#e.snapEdgeSpanRatio,snapCornerReach:this.#e.snapCornerReach,
snapOnRelease:this.#e.snapOnRelease,active:this.#o?gl(this.#o):void 0,lastResult:this.#d?vi(this.#d):void 0}}dispose(){if(this.#p)
return;const e=this.#w;if(e){this.#T(e,!0),this.#i(),this.#t.dispose(),this.#p=!0;return}const t=this.#o,n=t?this.#k(t,"\
lifecycle","rollback"):void 0;try{if(t){try{this.#O(t);const r=q({status:"cancelled",handled:!0,pointerId:t.pointerId,windowId:t.
windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:"controller-disposed"});this.#d=
r,this.#A(r)}catch(r){const o=q({status:"failed",handled:!0,pointerId:t.pointerId,windowId:t.windowId,mode:t.mode,region:t.
region,updateCount:t.updateCount,reason:`dispose-cancellation-failed:${ue(r)}`});this.#d=o,this.#A(o)}this.#o=void 0}this.#i(),
this.#t.dispose(),this.#p=!0}finally{n&&this.#S(n)}}#m(e){const t=this.#o,n=e.previousOwnerId===this.#e.ownerId&&e.nextOwnerId!==
this.#e.ownerId;if(t&&n&&e.pointerId===t.pointerId)if(this.#w?.active===t)this.#T(this.#w,e.kind==="owner-disposed");else{
const r=this.#k(t,"lifecycle","rollback");let o=`pointer-capture-${e.kind}`,s=!1;try{try{this.#O(t)}catch(c){s=!0,o+=`;c\
ancel:${ue(c)}`}this.#o=void 0;const a=q({status:s?"failed":e.kind==="owner-disposed"?"disposed":"cancelled",handled:!0,
pointerId:t.pointerId,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:o});
this.#d=a,this.#A(a)}finally{this.#S(r)}}e.kind==="owner-disposed"&&e.previousOwnerId===this.#e.ownerId&&(this.#i(),this.#p=
!0)}#h(e,t){if(e.kind==="down")return this.#l(e,t);const n=this.#o;if(!n||n.pointerId!==e.pointerId)return $t(e,"pointer\
-does-not-own-the-active-window-gesture");n.bounds=Se(t);const r=n.historyGesture?.inspect();return r?.state==="cancelle\
d"||r?.state==="unavailable"?(this.#o=void 0,this.#W(e.pointerId),q({status:"cancelled",handled:!0,pointerId:e.pointerId,
pointerKind:e.kind,windowId:n.windowId,mode:n.mode,region:n.region,updateCount:n.updateCount,historyRecorded:!1,reason:r.
reason??"window-history-gesture-cancelled"})):r?.state==="failed"?this.#M(e,new Error(r.reason??"window-history-gesture-\
failed")):e.kind==="cancel"?this.#j(e,n):e.kind==="move"?this.#b(e,n,t):e.kind==="up"?this.#$(e,n,t):q({status:"ignored",
handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:n.windowId,mode:n.mode,region:n.region,updateCount:n.updateCount,
reason:"pointer-kind-does-not-update-window-geometry"})}#l(e,t){if(this.#o)return q({status:"blocked",handled:!1,pointerId:e.
pointerId,pointerKind:e.kind,reason:"another-window-gesture-is-active"});const n=zt(e),r=this.#c(n,t);if(typeof r=="stri\
ng")return this.#x(e,r);try{this.capture.capture(e.pointerId,this.#e.ownerId)}catch(l){return q({status:"blocked",handled:!1,
pointerId:e.pointerId,pointerKind:e.kind,windowId:r.hit.id,mode:r.mode,region:r.hit.region,reason:`pointer-capture-faile\
d:${ue(l)}`})}const o=this.#c(n,t,r);if(typeof o=="string"||this.capture.captureOwner(e.pointerId)!==this.#e.ownerId)return this.#W(
e.pointerId),this.#x(e,typeof o=="string"?o:"pointer-capture-was-lost-during-gesture-start",r);let s,a,c,d;try{if(this.history){
if(s=this.history.beginGesture({action:o.mode==="move"?"move-by":"resize-window",id:o.hit.id,parameters:o.mode==="resize"?
{edge:o.hit.region}:void 0}),s.inspect().state!=="active")throw new Error(s.inspect().reason??"window-history-gesture-un\
available")}else a=this.controller.snapshot();const l=this.controller.focus(o.hit.id);if(!l.ok)throw new Error(l.reason??
`focus-${l.status}`);const u=this.#c(n,t,o);typeof u=="string"?d=u:c=u;const h=s?.inspect();h&&h.state!=="active"&&(d=h.
reason??`window-history-gesture-${h.state}`),this.capture.captureOwner(e.pointerId)!==this.#e.ownerId&&(d="pointer-captu\
re-was-lost-during-gesture-start")}catch(l){d=`gesture-start-failed:${ue(l)}`}if(d||!c){let l;try{this.#y(s,a)}catch(u){
l=ue(u)}return this.#W(e.pointerId),q({status:l?"failed":this.#v()?"disposed":"blocked",handled:!1,pointerId:e.pointerId,
pointerKind:e.kind,windowId:o.hit.id,mode:o.mode,region:o.hit.region,historyRecorded:!1,reason:`${d??"gesture-start-inva\
lidated"}${l?`;cancel:${l}`:""}`})}return this.#o={pointerId:e.pointerId,windowId:c.hit.id,mode:c.mode,region:c.hit.region,
resizeEdge:c.mode==="resize"?c.hit.region:void 0,start:n,current:n,startRect:Se(c.hit.rect),bounds:Se(t),updateCount:0,geometryPrepared:!1,
groupId:c.projectedWindow.groupId,before:a,historyGesture:s},q({status:"started",handled:!0,pointerId:e.pointerId,pointerKind:e.
kind,windowId:c.hit.id,mode:c.mode,region:c.hit.region,updateCount:0})}#c(e,t,n){if(this.#v())return"interaction-depende\
ncy-disposed-during-gesture-start";const r=this.controller.overlays.topModal();if(r)return`pointer-blocked-by-modal-over\
lay:${r.id}`;let o;try{o=this.controller.project(t)}catch(d){return`window-projection-failed:${ue(d)}`}const s=on(o,e,this.#e);
if(!s||s.region==="client")return"gesture-hit-is-no-longer-actionable";const a=o.floatingZOrder.find(d=>d.id===s.id);if(!a)
return"window-is-no-longer-visible";const c=s.region==="title-bar"?"move":"resize";return n&&(s.id!==n.hit.id||s.region!==
n.hit.region||c!==n.mode)?"gesture-target-changed-during-start":a.state==="maximized"?"maximized-window-geometry-is-not-\
interactive":c==="move"&&a.groupId&&o.floatingWindows.some(d=>d.groupId===a.groupId&&d.snapTarget!==void 0)?"snapped-win\
dow-group-move-is-ambiguous":{hit:s,projectedWindow:a,mode:c}}#v(){return this.#p||this.capture.disposed||this.#t.isDisposed()||
this.controller.disposed||!!this.history?.disposed}#y(e,t){if(e){const r=e.inspect();if(r.state==="active"){if(!e.cancel()&&
e.inspect().state==="failed")throw new Error(e.inspect().reason??"history-gesture-cancel-failed")}else if(r.state==="fai\
led")throw new Error(r.reason??"history-gesture-failed");return}if(!t)return;const n=this.controller.restoreSnapshot(t);
if(!n.ok)throw new Error(n.reason??`snapshot-${n.status}`)}#x(e,t,n){return q({status:this.#v()?"disposed":"blocked",handled:!1,
pointerId:e.pointerId,pointerKind:e.kind,windowId:n?.hit.id,mode:n?.mode,region:n?.hit.region,reason:t})}#b(e,t,n){const{
projection:r,projectedWindow:o}=this.#N(t,n),s=zt(e);if(!s)return q({status:"ignored",handled:!1,pointerId:e.pointerId,pointerKind:e.
kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,reason:"pointer-has-no-finite-cell-coordi\
nate"});const a=dl(t.current,s);if(a.columns===0&&a.rows===0)return q({status:"ignored",handled:!1,pointerId:e.pointerId,
pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,reason:"pointer-cell-did-no\
t-change"});let c,d=Se(o.floatingRect);if(!t.geometryPrepared){const h=t.mode==="move"&&t.groupId?r.floatingWindows.filter(
f=>f.visible&&f.groupId===t.groupId):[o];for(const f of h){const p=f.id===t.windowId&&t.mode==="move"&&f.snapTarget&&f.restoreRect?
ll(f.restoreRect,t.startRect,t.start):f.rect,w=this.controller.setFloatingRect(f.id,p);if(!w.ok)throw new Error(w.reason??
`window-${w.status}`);f.id===t.windowId&&(c=w,d=Se(p))}t.geometryPrepared=!0}const l=t.mode==="move"?this.controller.moveBy(
t.windowId,a):this.controller.resizeWindow(t.windowId,t.resizeEdge,a);if(!l.ok)throw new Error(l.reason??`window-${l.status}`);
if(t.mode==="move")t.current=s;else{const h=this.controller.project(n).floatingWindows.find(w=>w.id===t.windowId)?.floatingRect??
d,f=hl(t.resizeEdge),p=ul(t.resizeEdge);t.current.column=f?t.current.column+fl(t.resizeEdge,d,h):s.column,t.current.row=
p?t.current.row+pl(t.resizeEdge,d,h):s.row}t.bounds=Se(n);const u=c?.status==="applied"||l.status==="applied";return u&&
(t.updateCount+=1),q({status:u?"updated":"ignored",handled:u,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,
mode:t.mode,region:t.region,updateCount:t.updateCount,action:l,reason:!u&&l.status==="unchanged"?"window-geometry-was-cl\
amped-or-unchanged":void 0})}#N(e,t){const n=e.historyGesture?.inspect().state;if(n&&n!=="active")throw new Error(`windo\
w-history-gesture-${n}`);const r=this.controller.project(t),o=this.controller.overlays.topModal();if(o)throw new Error(`\
window-gesture-blocked-by-modal:${o.id}`);const s=r.floatingZOrder.find(a=>a.id===e.windowId);if(!s||s.state==="maximize\
d")throw new Error(s?"maximized-window-geometry-is-not-interactive":"window-is-no-longer-visible");if(e.mode==="move"&&e.
groupId&&r.floatingWindows.some(a=>a.groupId===e.groupId&&a.snapTarget!==void 0))throw new Error("snapped-window-group-m\
ove-is-ambiguous");return{projection:r,projectedWindow:s}}#$(e,t,n){const r=this.#k(t,"return","commit");try{return this.#U(
e,t,n,r)}finally{this.#S(r)}}#U(e,t,n,r){const o=zt(e);o||this.#N(t,n);const s=o?this.#b(e,t,n):void 0;if(s?.status==="f\
ailed"||s?.status==="blocked")return this.#M(e,new Error(s.reason??"final-window-update-failed"));let a,c;if(t.mode==="m\
ove"&&t.updateCount>0&&!t.groupId&&this.#e.snapOnRelease){const u=zt(e)??t.current;if(a=ls(u,n,this.#e.snapDistance,this.#e.
snapEdgeSpanRatio,this.#e.snapCornerReach),a&&(c=this.controller.snap(t.windowId,a,n),!c.ok))return this.#M(e,new Error(
c.reason??`snap-${c.status}`))}let d=!1;try{d=t.historyGesture?.commit()??!1}catch(u){return this.#M(e,u)}if(r.cancellationError)
return this.#M(e,new Error(`settlement-cancellation-failed:${r.cancellationError}`));const l=t.historyGesture?.inspect();
if(r.cancellationRequested&&!t.historyGesture){try{this.#O(t)}catch(u){return this.#M(e,u)}return this.#o=void 0,q({status:"\
cancelled",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.
updateCount,historyRecorded:!1,reason:r.disposalRequested?"controller-disposed-during-commit":"interaction-cancelled-dur\
ing-commit"})}return this.#o=void 0,l?.state==="cancelled"||l?.state==="unavailable"?q({status:"cancelled",handled:!0,pointerId:e.
pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,
reason:l.reason??"window-history-gesture-cancelled"}):q({status:"committed",handled:!0,pointerId:e.pointerId,pointerKind:e.
kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:d,snapTarget:a,action:c??
s?.action})}#j(e,t){const n=this.#k(t,"return","rollback");try{try{this.#O(t)}catch(r){return this.#M(e,r)}return this.#o=
void 0,q({status:"cancelled",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.
region,updateCount:t.updateCount,historyRecorded:!1,reason:"pointer-cancelled"})}finally{this.#S(n)}}#O(e){let t,n;if(!this.
controller.disposed)try{t=this.controller.snapshot()}catch(c){n=c}let r;try{if(e.historyGesture){if(!e.historyGesture.cancel()&&
e.historyGesture.inspect().state==="failed")throw new Error(e.historyGesture.inspect().reason??"history-gesture-cancel-f\
ailed")}else if(e.before){const c=this.controller.restoreSnapshot(e.before);if(!c.ok)throw new Error(c.reason??`snapshot\
-${c.status}`)}}catch(c){r=c}if(r&&n)throw new AggregateError([n,r],"Gesture dependency capture and cancellation both fa\
iled.");if(r)throw r;if(n)throw n;if(!t||this.controller.disposed)return;const o=this.controller.snapshot();if(JSON.stringify(
o.workspace)===JSON.stringify(t.workspace)&&JSON.stringify(o.modals)===JSON.stringify(t.modals))return;const s={...o,workspace:structuredClone(
t.workspace),modals:t.modals.map(c=>({...c}))},a=this.controller.restoreSnapshot(s);if(!a.ok)throw new Error(a.reason??`\
dependency-snapshot-${a.status}`)}#M(e,t){const n=this.#o,r=n?this.#k(n,"return","rollback"):void 0;r&&(r.phase="rollbac\
k");let o;try{if(n){try{this.#O(n)}catch(s){o=ue(s)}this.#o=void 0}return this.#W(e.pointerId),q({status:"failed",handled:!!n,
pointerId:e.pointerId,pointerKind:e.kind,windowId:n?.windowId,mode:n?.mode,region:n?.region,updateCount:n?.updateCount,reason:`${ue(
t)}${o?`;cancel:${o}`:""}`})}finally{r&&this.#S(r)}}#W(e){if(!(this.capture.disposed||this.capture.captureOwner(e)!==this.#e.
ownerId))try{this.capture.release(e,this.#e.ownerId)}catch{}}#C(){if(this.#p)return!0;this.#B();const e=this.controller.
disposed,t=this.history?.disposed??!1;if(!this.capture.disposed&&!this.#t.isDisposed()&&!e&&!t)return!1;const n=this.#o;
let r;if(n)if(this.#w?.active===n)this.#T(this.#w,!0);else{const o=this.#k(n,"lifecycle","rollback");try{try{this.#O(n)}catch(a){
r=ue(a)}this.#o=void 0;const s=q({status:r?"failed":"disposed",handled:!0,pointerId:n.pointerId,windowId:n.windowId,mode:n.
mode,region:n.region,updateCount:n.updateCount,historyRecorded:!1,reason:r?`dependency-disposal-cancellation-failed:${r}`:
"interaction-dependency-disposed"});this.#d=s,this.#A(s)}finally{this.#S(o)}}return this.#i(),this.#t.dispose(),this.#p=
!0,!0}#B(){const e=this.#o;if(!e?.historyGesture)return;let t;try{t=e.historyGesture.inspect()}catch(r){t={state:"failed",
operation:{action:"move-by",id:e.windowId},reason:ue(r)}}if(t.state==="active"||t.state==="committed")return;this.#o=void 0,
this.#W(e.pointerId);const n=q({status:t.state==="failed"?"failed":"cancelled",handled:!0,pointerId:e.pointerId,windowId:e.
windowId,mode:e.mode,region:e.region,updateCount:e.updateCount,historyRecorded:!1,reason:t.reason??`window-history-gestu\
re-${t.state}`});this.#d=n,this.#A(n)}#k(e,t,n){if(this.#w){if(this.#w.active!==e)throw new Error("A different window in\
teraction is already settling.");return this.#w.claims+=1,this.#w}const r={active:e,delivery:t,phase:n,claims:1};return this.#w=
r,r}#S(e){e.claims=Math.max(0,e.claims-1),e.claims===0&&this.#w===e&&(this.#w=void 0)}#T(e,t=!1){if(e.cancellationRequested=
!0,t&&(e.disposalRequested=!0),!(e.phase!=="commit"||!e.active.historyGesture))try{e.active.historyGesture.cancel()}catch(n){
e.cancellationError=ue(n)}}#A(e){e.pointerId!==void 0&&(this.#u.delete(e.pointerId),!(this.#u.size>=Dr)&&this.#u.set(e.pointerId,
vi(e)))}#I(e){return e.pointerId!==void 0&&e.status!=="started"&&e.status!=="updated"&&this.#u.delete(e.pointerId),this.#d=
vi(e),e}}function sl(i,e,t){const n=i.rect,r=e.column-n.column,o=n.column+n.width-1-e.column,s=e.row-n.row,a=n.row+n.height-
1-e.row,c=Math.min(t.resizeMargin,Math.ceil(n.width/2)),d=Math.min(t.resizeMargin,Math.ceil(n.height/2)),l=r<c,u=o<c,h=s<
d,f=a<d,p=l&&u?r<=o?"left":"right":l?"left":u?"right":void 0;if((!p||n.width<=c*2)&&s<Math.min(t.titleBarHeight,n.height))
return"title-bar";const w=h&&f?s<=a?"top":"bottom":h?"top":f?"bottom":void 0;return p&&w?`${w}-${p}`:p||w||"client"}function al(i){
let e,t,n,r,o,s,a;try{e=i.ownerId,t=i.titleBarHeight,n=i.resizeMargin,r=i.snapDistance,o=i.snapEdgeSpanRatio,s=i.snapCornerReach,
a=i.snapOnRelease}catch{throw new TypeError("Window interaction options could not be read safely.")}const c=cs({titleBarHeight:t,
resizeMargin:n});if(!c)throw new RangeError("Window title-bar and resize metrics must be bounded non-negative integers.");
const d=cl(e),l=r??tl;if(!Number.isSafeInteger(l)||l<0||l>Te)throw new RangeError("Window snap distance must be a bounde\
d non-negative integer.");if(a!==void 0&&typeof a!="boolean")throw new TypeError("Window snapOnRelease must be boolean.");
const u=o??il;if(!Number.isFinite(u)||u<=0||u>1)throw new RangeError("Window snap edge span ratio must be in (0, 1].");const h=s??
nl;if(!Number.isSafeInteger(h)||h<1||h>Te)throw new RangeError("Window snap corner reach must be a bounded positive inte\
ger.");return{ownerId:d,...c,snapDistance:l,snapEdgeSpanRatio:u,snapCornerReach:h,snapOnRelease:a??!0}}function cs(i){try{
const e=i.titleBarHeight??Qd,t=i.resizeMargin??el;return!Number.isSafeInteger(e)||e<1||e>Te||!Number.isSafeInteger(t)||t<
0||t>Te?void 0:{titleBarHeight:e,resizeMargin:t}}catch{return}}function cl(i){const e=i?.trim()||Zd;if(e.length>rl||vl(e))
throw new TypeError("Window interaction owner id is invalid or too long.");return e}function Fr(i){try{const e=mt(i,"col\
umn"),t=mt(i,"row"),n=mt(i,"width"),r=mt(i,"height");if(e===void 0||t===void 0||n===void 0||r===void 0||![e,t,n,r].every(
Number.isFinite))return;const o={column:Math.floor(e),row:Math.floor(t),width:Math.floor(n),height:Math.floor(r)};return!Number.
isSafeInteger(o.column)||!Number.isSafeInteger(o.row)||o.width<1||o.height<1||o.width>Te||o.height>Te||Math.abs(o.column)>
Te||Math.abs(o.row)>Te?void 0:o}catch{return}}function ds(i){try{const e=mt(i,"column"),t=mt(i,"row");if(e===void 0||t===
void 0||!Number.isFinite(e)||!Number.isFinite(t))return;const n={column:Math.floor(e),row:Math.floor(t)};return!Number.isSafeInteger(
n.column)||!Number.isSafeInteger(n.row)||Math.abs(n.column)>Te||Math.abs(n.row)>Te?void 0:n}catch{return}}function mt(i,e){
const t=Object.getOwnPropertyDescriptor(i,e);return t&&"value"in t&&typeof t.value=="number"?t.value:void 0}function zt(i){
const e=i.coordinates.cell;return e?ds({column:e.x,row:e.y}):void 0}function dl(i,e){return{columns:e.column-i.column,rows:e.
row-i.row}}function ll(i,e,t){const n=e.width<=1?0:Math.max(0,Math.min(1,(t.column-e.column)/(e.width-1))),r=Math.round(
n*Math.max(0,i.width-1)),o=Math.max(0,Math.min(i.height-1,t.row-e.row));return{...Se(i),column:t.column-r,row:t.row-o}}function hl(i){
return i==="left"||i==="right"||i.endsWith("-left")||i.endsWith("-right")}function ul(i){return i==="top"||i==="bottom"||
i.startsWith("top-")||i.startsWith("bottom-")}function fl(i,e,t){return i==="left"||i.endsWith("-left")?t.column-e.column:
t.column+t.width-(e.column+e.width)}function pl(i,e,t){return i==="top"||i.startsWith("top-")?t.row-e.row:t.row+t.height-
(e.row+e.height)}function wl(i,e){return e.column>=i.column&&e.row>=i.row&&e.column<i.column+i.width&&e.row<i.row+i.height}
function ml(i){return i.primary&&(i.button===0||i.device!=="mouse"&&i.button===null)}function ls(i,e,t,n,r){const o=e.column,
s=e.column+e.width-1,a=e.row,c=e.row+e.height-1,d=i.column>=o-t&&i.column<=s+t,l=i.row>=a-t&&i.row<=c+t,u=l&&Math.abs(i.
column-o)<=t,h=l&&Math.abs(i.column-s)<=t,f=d&&i.row<=a&&i.row>=a-t,p=d&&i.row>=c&&i.row<=c+t,w=i.column<=o+r-1,g=i.column>=
s-r+1,R=i.row<=a+r-1,m=i.row>=c-r+1,M=f&&w||u&&R?"top-left":f&&g||h&&R?"top-right":p&&w||u&&m?"bottom-left":p&&g||h&&m?"\
bottom-right":void 0;if(M)return{kind:"corner",corner:M};const I=Math.max(1,Math.round(e.width*n/2)),E=o+(e.width-1)/2,$=Math.
abs(i.column-E)<=I;if(f&&$)return{kind:"workspace",edge:"top"};if(p&&$)return{kind:"workspace",edge:"bottom"};if(u&&h)return{
kind:"workspace",edge:Math.abs(i.column-o)<=Math.abs(i.column-s)?"left":"right"};if(u)return{kind:"workspace",edge:"left"};
if(h)return{kind:"workspace",edge:"right"}}function $t(i,e){return q({status:"ignored",handled:!1,pointerId:i.pointerId,
pointerKind:i.kind,reason:e})}function q(i){const e=vi(i);return e.action&&Object.freeze(e.action),e.snapTarget&&Object.
freeze(e.snapTarget),Object.freeze(e)}function vi(i){return{...i,action:i.action?{...i.action}:void 0,snapTarget:i.snapTarget?
{...i.snapTarget}:void 0}}function gl(i){return{pointerId:i.pointerId,windowId:i.windowId,mode:i.mode,region:i.region,resizeEdge:i.
resizeEdge,start:{...i.start},current:{...i.current},startRect:Se(i.startRect),updateCount:i.updateCount}}function Se(i){
return{column:i.column,row:i.row,width:i.width,height:i.height}}function vl(i){for(let e=0;e<i.length;e+=1){const t=i.charCodeAt(
e);if(t<=31||t===127)return!0}return!1}function ue(i){try{const e=i instanceof Error?i.message:String(i);return e.length>
512?`${e.slice(0,511)}…`:e}catch{return"uninspectable-window-interaction-error"}}const yi=2,Ci=1,Hr={column:0,row:0,width:0,
height:0},te=1e6,hs=256,yl=128,Ut=1024,An=4096,Wn=64,bl={margin:0,titleBarHeight:1};class kl{workspace;overlays;#e=new Map;#t=new Map;#i=new Set;#o=new Map;#n=new Set;#s=new Map;#r=new Set;#a=new Set;#d=new Map;#u=new Map;#w=new Map;#f=new Map;#p=new Map;#g=new Set;#m=new Map;#h=[];#l;#c;#v;#y=[];#x=!1;#b=!1;constructor(e){
this.workspace=e.workspace,this.overlays=e.overlays,this.#v=so(e.compactMode),this.reconcile(e.root,{layout:e.layout})}get disposed(){
return this.#b}get mutationInProgress(){return this.#x}reconcile(e,t={}){this.#Q("reconcile");const n=this.#C();this.#x=
!0;try{try{return this.#N(e,t)}catch(r){try{this.#B(n)}catch(o){throw new AggregateError([r,o],"Window reconciliation an\
d rollback publication failed.")}throw r}}finally{this.#x=!1}}#N(e,t){this.#V(),this.#L();const n=Il(e,t.layout),r=this.#e,
o=this.#t,s=this.#i,a=this.#n,c=n.diagnostics.slice(),d=new Set(this.workspace.inspect().windows.filter(h=>!s.has(h.id)).
map(h=>h.id)),l=new Map;for(const h of n.windows){if(d.has(h.id)){c.push({code:"workspace-id-conflict",severity:"error",
id:h.id,message:`Workspace window id "${h.id}" is already owned outside the declarative integration.`});continue}const f=r.
get(h.id);l.set(h.id,h),f?h.stateToken!==void 0&&h.stateToken!==f.stateToken&&this.#$(h,c):(this.#$(h,c),this.#U(h)),f&&
(h.placementToken!==void 0&&h.placementToken!==f.placementToken&&this.#u.set(h.id,h.declaredPlacement),h.geometryToken!==
void 0&&h.geometryToken!==f.geometryToken&&this.#k(h.id,h.declaredFloatingRect??ht(h)),h.alwaysOnTopToken!==void 0&&h.alwaysOnTopToken!==
f.alwaysOnTopToken&&this.#S(h.id,h.declaredAlwaysOnTop),h.groupToken!==void 0&&h.groupToken!==f.groupToken&&this.#T(h.id,
h.declaredGroupId))}this.#e=l,this.#j(),this.#O();const u=new Map;for(const h of n.modals){const f=o.get(h.id),p=h.rect||
!f?.rect?h:{...h,rect:Q(f.rect)};u.set(p.id,p),f?p.openToken!==void 0&&p.openToken!==f.openToken&&this.#d.set(p.id,p.defaultOpen):
this.#d.set(p.id,p.defaultOpen)}return this.#t=u,this.#A(),this.#I(s),this.#E(a,c),this.#X(),this.#y=c,this.inspect()}focus(e){
const t=this.#F("focus",e);if(t)return t;if(this.#e.has(e)){if(!this.#z(e))return k("focus","blocked",e,void 0,"window-n\
ot-visible");if(this.#c&&this.#c!==e)return k("focus","blocked",e,void 0,"window-hidden-by-maximized-window");const o=this.#l===
e,s=this.#te(e);return this.#R(e)==="tiled"&&!this.workspace.focus(e)?k("focus","not-found",e):(this.#D(e),k("focus",o&&
s?"unchanged":"applied",e))}return this.#t.get(e)?(this.#H(),(this.#n.has(e)?this.overlays.surface(e):void 0)?.visible?(this.
overlays.bringToFront(e),k("focus","applied",e)):k("focus","blocked",e,void 0,"modal-not-visible")):k("focus","not-found",
e)}move(e,t){const n=this.#q("move",e);return n||(!Number.isFinite(t)||Math.trunc(t)===0?k("move","invalid",e,void 0,"de\
lta-must-be-a-non-zero-finite-number"):this.workspace.move(e,t)?(this.#D(e),k("move","applied",e)):k("move","unchanged",
e))}setPlacement(e,t,n={}){const r=this.#q("set-placement",e);if(r)return r;if(t!=="tiled"&&t!=="floating")return k("set\
-placement","invalid",e,void 0,"placement-is-invalid");const o=this.#e.get(e);let s;if(n.rect!==void 0&&(s=gt(n.rect,o),
!s))return k("set-placement","invalid",e,void 0,"floating-rect-is-invalid");const a=this.#R(e),c=this.#w.get(e);return a===
t&&(!s||jt(c,s))?k("set-placement","unchanged",e):(s?this.#k(e,s):t==="floating"&&!c&&this.#k(e,ht(o)),this.#u.set(e,t),
this.#p.delete(e),this.#D(e),this.#G(),k("set-placement","applied",e))}setFloatingRect(e,t){const n=this.#J("set-floatin\
g-rect",e);if(n)return n;const r=gt(t,this.#e.get(e));return r?jt(this.#w.get(e),r)&&!this.#p.has(e)?k("set-floating-rec\
t","unchanged",e):(this.#k(e,r),this.#p.delete(e),k("set-floating-rect","applied",e)):k("set-floating-rect","invalid",e,
void 0,"floating-rect-is-invalid")}moveBy(e,t){const n=this.#J("move-by",e);if(n)return n;const r=Gr(t);if(!r)return k("\
move-by","invalid",e,void 0,"delta-must-use-non-zero-safe-cell-integers");const o=this.#m.get(e),s=o?[...this.#e.keys()].
filter(c=>this.#m.get(c)===o&&this.#R(c)==="floating"):[e],a=new Map;for(const c of s){const d=this.#K(c),l=Cl(d,r);if(!l)
return k("move-by","invalid",e,void 0,"floating-rect-exceeds-cell-bounds");a.set(c,l)}for(const[c,d]of a)this.#k(c,d),this.#p.
delete(c);return k("move-by","applied",e)}resizeWindow(e,t,n){const r=this.#J("resize-window",e);if(r)return r;if(!Bl(t))
return k("resize-window","invalid",e,void 0,"resize-edge-is-invalid");const o=Gr(n);if(!o)return k("resize-window","inva\
lid",e,void 0,"delta-must-use-non-zero-safe-cell-integers");const s=this.#K(e),a=zl(s,t,o,this.#e.get(e));return a?jt(s,
a)&&!this.#p.has(e)?k("resize-window","unchanged",e):(this.#k(e,a),this.#p.delete(e),k("resize-window","applied",e)):k("\
resize-window","invalid",e,void 0,"floating-rect-exceeds-cell-bounds")}snap(e,t,n){const r=this.#q("snap",e);if(r)return r;
const o=Wl(t);if(!o)return k("snap","invalid",e,void 0,"snap-target-is-invalid");const s=sn(n);if(!s||s.width===0||s.height===
0)return k("snap","invalid",e,void 0,"bounds-must-be-a-non-empty-finite-cell-rectangle");if(o.kind==="dock")return this.#e.
has(o.targetId)?!this.#z(o.targetId)||this.#R(o.targetId)!=="tiled"?k("snap","blocked",e,o.targetId,"target-window-not-t\
iled-and-visible"):e===o.targetId||!this.workspace.dock(e,o.targetId,o.edge,{ratio:o.ratio})?k("snap","unchanged",e,o.targetId):
(this.#u.set(e,"tiled"),this.#p.set(e,Je(o)),this.#D(e),this.#G(),k("snap","applied",e,o.targetId)):k("snap","not-found",
e,o.targetId);const a=this.#e.get(e),c=this.#K(e),d=Kr(o,s,a);return d?(this.#p.has(e)||this.#f.set(e,Q(c)),this.#w.set(
e,d),this.#u.set(e,"floating"),this.#p.set(e,Je(o)),this.#D(e),this.#G(),k("snap","applied",e)):k("snap","invalid",e,void 0,
"snap-geometry-exceeds-cell-bounds")}setAlwaysOnTop(e,t){const n=this.#q("set-always-on-top",e);return n||(typeof t!="bo\
olean"?k("set-always-on-top","invalid",e,void 0,"always-on-top-must-be-boolean"):this.#g.has(e)===t?k("set-always-on-top",
"unchanged",e):(this.#S(e,t),!this.#D(e)&&this.#l&&this.#_(this.#l),k("set-always-on-top","applied",e)))}setGroup(e,t){const n=this.#F(
"set-group",e);if(n)return n;if(!this.#e.has(e))return k("set-group","not-found",e);const r=Zn(t);return t!==void 0&&r===
void 0&&t.trim()!==""?k("set-group","invalid",e,void 0,"group-id-is-invalid-or-too-long"):this.#m.get(e)===r?k("set-grou\
p","unchanged",e):(this.#T(e,r),k("set-group","applied",e))}recoverBounds(e,t,n={}){const r=this.#J("recover-bounds",e);
if(r)return r;const o=sn(t),s=$l(n);if(!o||!s)return k("recover-bounds","invalid",e,void 0,"bounds-or-recovery-options-a\
re-invalid");const a=this.#K(e),c=Vr(a,o,s);return c?jt(a,c)&&!this.#p.has(e)?k("recover-bounds","unchanged",e):(this.#k(
e,c),this.#p.delete(e),k("recover-bounds","applied",e)):k("recover-bounds","invalid",e,void 0,"recovered-geometry-exceed\
s-cell-bounds")}swap(e,t){const n=this.#q("swap",e,t);return n||(this.#e.has(t)?this.#z(t)?e===t||!this.workspace.swap(e,
t)?k("swap","unchanged",e,t):(this.#D(e),k("swap","applied",e,t)):k("swap","blocked",e,t,"target-window-not-visible"):k(
"swap","not-found",e,t))}dock(e,t,n,r={}){const o=this.#q("dock",e,t);if(o)return o;if(!xt(n))return k("dock","invalid",
e,t,"dock-edge-is-invalid");if(!this.#e.has(t))return k("dock","not-found",e,t);if(!this.#z(t)||this.#R(t)!=="tiled")return k(
"dock","blocked",e,t,"target-window-not-visible");if(e===t)return k("dock","unchanged",e,t);let s;try{const a=r.ratio;if(a!==
void 0){if(typeof a!="number"||!Number.isFinite(a))return k("dock","invalid",e,t,"dock-ratio-must-be-finite");s=Math.max(
.05,Math.min(.95,a))}}catch{return k("dock","invalid",e,t,"dock-options-are-invalid")}return this.workspace.dock(e,t,n,{
ratio:s})?(this.#u.set(e,"tiled"),this.#p.set(e,s===void 0?{kind:"dock",targetId:t,edge:n}:{kind:"dock",targetId:t,edge:n,
ratio:s}),this.#D(e),k("dock","applied",e,t)):k("dock","unchanged",e,t)}resize(e,t,n,r={}){const o=this.#F("resize",e);if(o)
return o;if(!Number.isFinite(t)||Math.trunc(t)===0)return k("resize","invalid",e,void 0,"delta-must-be-a-non-zero-finite\
-number");const s=this.project(n,r);return s.workspace.separators.some(c=>c.splitId===e)?this.workspace.resizeSplit(e,t,
n,{gap:r.gap,separatorHitSize:r.separatorHitSize,visibleWindowIds:s.visibleWindowIds})?k("resize","applied",e):k("resize",
"unchanged",e):k("resize","blocked",e,void 0,"split-not-visible")}resizeRatio(e,t){const n=this.#F("resize-ratio",e);return n||
(!Number.isFinite(t)||t===0?k("resize-ratio","invalid",e,void 0,"delta-must-be-a-non-zero-finite-number"):this.#P(e)?this.
workspace.resizeSplitRatio(e,t)?k("resize-ratio","applied",e):k("resize-ratio","unchanged",e):k("resize-ratio","blocked",
e,void 0,"split-is-not-declaratively-owned"))}minimize(e){const t=this.#F("minimize",e);return t||(this.#e.has(e)?this.#a.
has(e)?k("minimize","blocked",e,void 0,"window-closed"):this.#r.has(e)?k("minimize","unchanged",e):(this.#r.add(e),this.#c===
e&&(this.#c=void 0),this.#l===e&&(this.#l=void 0),this.#X(),this.#G(),k("minimize","applied",e)):k("minimize","not-found",
e))}maximize(e){const t=this.#q("maximize",e);return t||(this.#c===e?k("maximize","unchanged",e):(this.#c=e,this.#l=e,this.#_(
e),this.#R(e)==="tiled"&&this.workspace.focus(e),this.#G(),k("maximize","applied",e)))}restore(e){const t=this.#F("resto\
re",e);if(t)return t;const n=this.#e.get(e);if(n){if(!n.declaredVisible)return k("restore","blocked",e,void 0,"window-hi\
dden-by-declaration");const s=this.#a.delete(e),a=this.#r.delete(e),c=this.#c===e;return c&&(this.#c=void 0),!s&&!a&&!c?
k("restore","unchanged",e):(this.#D(e),this.#G(),k("restore","applied",e))}const r=this.#t.get(e);return r?r.declaredVisible?
r.rect?(this.#H(),this.#n.has(e)?this.overlays.surface(e)?.visible?(this.#d.set(e,!0),k("restore","unchanged",e)):(this.#d.
set(e,!0),this.overlays.open(e),k("restore","applied",e)):k("restore","blocked",e,void 0,"modal-overlay-id-conflict")):k(
"restore","unsupported",e,void 0,"modal-layout-geometry-unavailable"):k("restore","blocked",e,void 0,"modal-hidden-by-de\
claration"):k("restore","not-found",e)}close(e){const t=this.#F("close",e);if(t)return t;if(this.#e.has(e))return this.#a.
has(e)?k("close","unchanged",e):(this.#a.add(e),this.#r.delete(e),this.#c===e&&(this.#c=void 0),this.#l===e&&(this.#l=void 0),
this.#X(),this.#G(),k("close","applied",e));if(!this.#t.has(e))return k("close","not-found",e);if(this.#H(),!this.#n.has(
e))return k("close","blocked",e,void 0,"modal-overlay-id-conflict");const n=this.overlays.surface(e);return this.#d.set(
e,!1),n?.visible?(this.overlays.close(e),k("close","applied",e)):k("close","unchanged",e)}project(e,t={}){this.#Q("proje\
ct"),this.#V(),this.#H();const n=sn(e)??Q(Hr),r=so(t.compactMode??this.#v),o=this.#ie(),s=Gl(t.visibleWindowIds,o),a=this.#c?
this.#R(this.#c):void 0;let c=this.#c?a==="tiled"&&o.includes(this.#c)?[this.#c]:[]:s,d=this.workspace.layout(n,{gap:t.gap,
separatorHitSize:t.separatorHitSize,visibleWindowIds:c});const l=!this.#c&&c.length>1&&(r==="always"||r==="auto"&&!d.fitsMinimumSize);
let u;l&&(u=d.activeWindowId&&c.includes(d.activeWindowId)?d.activeWindowId:c[0],c=u?[u]:[],d=this.workspace.layout(n,{gap:t.
gap,separatorHitSize:t.separatorHitSize,visibleWindowIds:c}));const h=[];for(const m of this.#e.values()){if(this.#R(m.id)!==
"floating")continue;const M=this.#ee(m.id),E=this.#z(m.id)&&(!this.#c||this.#c===m.id),$=this.#K(m.id),F=this.#p.get(m.id),
L=E&&this.#c===m.id?Q(n):F&&F.kind!=="dock"?Kr(F,n,m)??$:$,G=E&&this.#c===m.id?Q(n):Vr(L,n,bl)??Q(L),v=this.#h.indexOf(m.
id);h.push({id:m.id,rect:G,floatingRect:Q($),restoreRect:Dt(this.#f.get(m.id)),snapTarget:F?Je(F):void 0,state:M,active:this.#l===
m.id,visible:E,alwaysOnTop:this.#g.has(m.id),groupId:this.#m.get(m.id),focusOrder:v,zIndex:0,constraintsSatisfied:cn(G,m)})}
const f=h.filter(m=>m.visible).sort(jl);for(let m=0;m<f.length;m+=1){const M=f[m];M.zIndex=(M.alwaysOnTop?2e3:1e3)+m}const p=new Set(
[...c,...f.map(m=>m.id)]),w=[];for(const m of this.#ne())p.has(m)||w.push(m);const g=this.#n,R=this.overlays.zOrder().filter(
m=>g.has(m.id)).map(di);return{compact:l,compactMode:r,compactWindowId:u,maximizedWindowId:this.#c,eligibleWindowIds:o,visibleWindowIds:c.
slice(),hiddenWindowIds:w,workspace:d,floatingWindows:h,floatingZOrder:f,modals:R,topModalId:this.overlays.topModal()?.id}}inspect(){
this.#V(),this.#L();const e=this.workspace.inspect(),t=this.#l&&this.#z(this.#l)?this.#l:void 0,n=[];for(const o of this.#e.
values()){const s=this.#ee(o.id),a=this.#R(o.id),c={id:o.id,title:o.title,minWidth:o.minWidth,minHeight:o.minHeight,declaredVisible:o.
declaredVisible,state:s,placement:a,alwaysOnTop:this.#g.has(o.id),focusOrder:this.#h.indexOf(o.id),active:t===o.id,visible:this.#z(
o.id)&&(!this.#c||this.#c===o.id)};if(o.maxWidth!==void 0&&(c.maxWidth=o.maxWidth),o.maxHeight!==void 0&&(c.maxHeight=o.
maxHeight),a==="floating"){c.floatingRect=this.#K(o.id);const u=this.#f.get(o.id);u&&(c.restoreRect=Q(u))}const d=this.#p.
get(o.id);d&&(c.snapTarget=Je(d));const l=this.#m.get(o.id);l&&(c.groupId=l),n.push(c)}const r=[];for(const o of this.#t.
values()){const s=this.#n.has(o.id)?this.overlays.surface(o.id):void 0;r.push({id:o.id,title:o.title,ownerId:o.ownerId,declaredVisible:o.
declaredVisible,requestedOpen:this.#d.get(o.id)??!1,registered:this.#n.has(o.id),visible:s?.visible??!1,closeOnOutsideClick:o.
closeOnOutsideClick,rect:o.rect?Q(o.rect):void 0,surface:s?di(s):void 0})}return{disposed:this.#b,compactMode:this.#v,activeWindowId:t,
maximizedWindowId:this.#c,windows:n,modals:r,diagnostics:this.#y.map(dn),workspace:e}}snapshot(){this.#Q("snapshot"),this.#V(),
this.#L();const e=[...this.#e.keys()],t=this.workspace.snapshot();if(this.#l&&this.#R(this.#l)==="tiled"){const o=_l(t,this.#l);
o&&(t.layout.activePaneId=o)}const n={version:yi,compactMode:this.#v,windowIds:e,minimizedWindowIds:e.filter(o=>this.#r.
has(o)),closedWindowIds:e.filter(o=>this.#a.has(o)),maximizedWindowId:this.#c,activeWindowId:this.#l,focusOrderWindowIds:this.#h.
slice(),placements:e.map(o=>({id:o,placement:this.#R(o),floatingRect:Dt(this.#w.get(o)),restoreRect:Dt(this.#f.get(o)),snapTarget:Pl(
this.#p.get(o)),alwaysOnTop:this.#g.has(o),groupId:this.#m.get(o)})),modals:[...this.#t.keys()].map(o=>({id:o,open:this.#d.
get(o)??!1})),workspace:t},r=to(n);if(!r.ok)throw new RangeError(`Current declarative-window state is not snapshot-safe:\
 ${r.reason}`);return r.snapshot}restoreSnapshot(e){const t=this.#F("restore-snapshot");if(t)return t;this.#x=!0;try{this.#H();
const n=to(e);if(!n.ok)return k("restore-snapshot",n.status,void 0,void 0,n.reason);const r=this.#W(n.snapshot);if(r)return k(
"restore-snapshot","invalid",void 0,void 0,r);const o=this.#C();try{return this.#M(n.snapshot),k("restore-snapshot","app\
lied")}catch{try{this.#B(o)}catch{return k("restore-snapshot","invalid",void 0,void 0,"snapshot-restore-and-rollback-fai\
led")}return k("restore-snapshot","invalid",void 0,void 0,"snapshot-restore-failed")}}finally{this.#x=!1}}dispose(){if(this.#x)
throw new Error("MarkupWindowController cannot dispose during a state mutation.");if(this.#V(),this.#H(),this.#b&&this.#i.
size===0&&this.#n.size===0)return;this.#b=!0;let e;if(this.#i.size>0){const t=this.workspace.inspect().windows.filter(n=>!this.#i.
has(n.id));try{this.workspace.reconcile(t)}catch(n){e=n}finally{this.#i.clear()}}for(const t of[...this.#n])try{this.overlays.
remove(t,{synchronizeFocus:!0})}catch(n){e??=n}finally{this.#n.delete(t),this.#s.delete(t)}if(e!==void 0)throw e}#$(e,t){
const n=e.declaredState??"normal";this.#r.delete(e.id),this.#a.delete(e.id),this.#c===e.id&&(this.#c=void 0),n==="minimi\
zed"&&this.#r.add(e.id),n==="closed"&&this.#a.add(e.id),n==="maximized"&&(this.#c&&this.#c!==e.id?t.push({code:"multiple\
-maximized-windows",severity:"warning",id:e.id,message:`Window "${e.id}" requested maximize while "${this.#c}" is alread\
y maximized.`}):this.#c=e.id)}#U(e){this.#u.set(e.id,e.declaredPlacement),this.#k(e.id,e.declaredFloatingRect??ht(e)),this.#S(
e.id,e.declaredAlwaysOnTop),this.#T(e.id,e.declaredGroupId),this.#h.includes(e.id)||this.#h.push(e.id)}#j(){const e=new Set(
this.#e.keys());this.#r=new Set([...this.#r].filter(t=>e.has(t))),this.#a=new Set([...this.#a].filter(t=>e.has(t))),this.#c&&
!e.has(this.#c)&&(this.#c=void 0),this.#l&&!e.has(this.#l)&&(this.#l=void 0)}#O(){const e=new Set(this.#e.keys());this.#u=
new Map([...this.#u].filter(([t])=>e.has(t))),this.#w=new Map([...this.#w].filter(([t])=>e.has(t))),this.#f=new Map([...this.#f].
filter(([t])=>e.has(t))),this.#p=new Map([...this.#p].filter(([t])=>e.has(t)));for(const[t,n]of this.#p)n.kind==="dock"&&
(!e.has(n.targetId)||n.targetId===t)&&this.#p.delete(t);this.#g=new Set([...this.#g].filter(t=>e.has(t))),this.#m=new Map(
[...this.#m].filter(([t])=>e.has(t))),this.#h=this.#h.filter(t=>e.has(t));for(const t of this.#e.values()){if(this.#u.has(
t.id)||this.#u.set(t.id,t.declaredPlacement),!this.#w.has(t.id))this.#k(t.id,t.declaredFloatingRect??ht(t));else{this.#w.
set(t.id,gt(this.#w.get(t.id),t));const n=this.#f.get(t.id);n&&this.#f.set(t.id,gt(n,t))}this.#h.includes(t.id)||this.#h.
push(t.id)}}#M(e){const t=new Set(this.#e.keys()),n=new Set(e.windowIds),r=this.#Y(this.#i);this.workspace.restore(e.workspace,
r),this.#v=e.compactMode,this.#r=new Set(e.minimizedWindowIds.filter(d=>t.has(d))),this.#a=new Set(e.closedWindowIds.filter(
d=>t.has(d))),this.#c=e.maximizedWindowId&&t.has(e.maximizedWindowId)&&!this.#r.has(e.maximizedWindowId)&&!this.#a.has(e.
maximizedWindowId)?e.maximizedWindowId:void 0;const o=new Map(e.placements.map(d=>[d.id,d]));for(const d of this.#e.values()){
if(!n.has(d.id))continue;const l=o.get(d.id);this.#u.set(d.id,l?.placement??"tiled");const u=l?.floatingRect??this.#w.get(
d.id)??ht(d);this.#w.set(d.id,Q(u)),l?.restoreRect?this.#f.set(d.id,Q(l.restoreRect)):this.#f.delete(d.id),l?.snapTarget?
this.#p.set(d.id,Je(l.snapTarget)):this.#p.delete(d.id),this.#S(d.id,l?.alwaysOnTop??!1),this.#T(d.id,l?.groupId)}const s=[];
for(const d of e.focusOrderWindowIds)t.has(d)&&!s.includes(d)&&s.push(d);for(const d of this.#e.keys())s.includes(d)||s.
push(d);this.#h=s,this.#l=e.activeWindowId&&t.has(e.activeWindowId)?e.activeWindowId:void 0;const a=new Set(this.#t.keys());
for(const d of e.modals)a.has(d.id)&&this.#d.set(d.id,d.open);const c=this.#y.filter(d=>d.code!=="missing-modal-geometry");
this.#E(this.#n,c,!1),this.#y=c,this.#X()}#W(e){const t=new Set(this.#e.keys());if(e.windowIds.length!==t.size||e.windowIds.
some(r=>!t.has(r)))return"snapshot-window-ids-do-not-match-declarations";const n=new Map(e.placements.map(r=>[r.id,r]));
for(const r of this.#e.values()){const o=n.get(r.id);if(o?.floatingRect&&!cn(o.floatingRect,r))return`snapshot-floating-\
rect-violates-constraints:${r.id}`;if(o?.restoreRect&&!cn(o.restoreRect,r))return`snapshot-restore-rect-violates-constra\
ints:${r.id}`}}#C(){return{windows:Qr(this.#e),modals:eo(this.#t),managedWindowIds:new Set(this.#i),managedWindowGenerations:new Map(
this.#o),managedModalIds:new Set(this.#n),managedModalSignatures:Zr(this.#s),minimizedWindowIds:new Set(this.#r),closedWindowIds:new Set(
this.#a),modalRequestedOpen:new Map(this.#d),placements:new Map(this.#u),floatingRects:ai(this.#w),restoreRects:ai(this.#f),
snapTargets:Xr(this.#p),alwaysOnTopWindowIds:new Set(this.#g),windowGroups:new Map(this.#m),focusOrderWindowIds:this.#h.
slice(),activeWindowId:this.#l,maximizedWindowId:this.#c,compactMode:this.#v,diagnostics:this.#y.map(dn),workspace:this.
workspace.snapshot(),overlays:this.overlays.snapshot()}}#B(e){this.#e=Qr(e.windows),this.#t=eo(e.modals),this.#i=new Set(
e.managedWindowIds),this.#o=new Map(e.managedWindowGenerations),this.#n=new Set(e.managedModalIds),this.#s=Zr(e.managedModalSignatures),
this.#r=new Set(e.minimizedWindowIds),this.#a=new Set(e.closedWindowIds),this.#d=new Map(e.modalRequestedOpen),this.#u=new Map(
e.placements),this.#w=ai(e.floatingRects),this.#f=ai(e.restoreRects),this.#p=Xr(e.snapTargets),this.#g=new Set(e.alwaysOnTopWindowIds),
this.#m=new Map(e.windowGroups),this.#h=e.focusOrderWindowIds.slice(),this.#l=e.activeWindowId,this.#c=e.maximizedWindowId,
this.#v=e.compactMode,this.#y=e.diagnostics.map(dn);let t=!1;try{this.workspace.restore(e.workspace)}catch{this.workspace.
gap.jink(e.workspace.gap),this.workspace.state.jink(structuredClone(e.workspace.layout));try{this.workspace.gap.propagate()}catch{
t=!0}try{this.workspace.state.propagate()}catch{t=!0}}try{this.overlays.restoreSnapshot(e.overlays,{synchronizeFocus:!0})}catch{
this.overlays.surfaces.jink(e.overlays.surfaces.map(di)),this.overlays.synchronizeActiveId(e.overlays.activeId,{propagate:!1});
try{this.overlays.surfaces.propagate()}catch{t=!0}try{this.overlays.activeId.propagate()}catch{t=!0}}this.overlays.surfaces.
jink(e.overlays.surfaces.map(di)),this.overlays.synchronizeActiveId(e.overlays.activeId,{propagate:!1}),this.#o.clear();
for(const n of this.#i){const r=this.workspace.windowRegistrationGeneration(n);r!==void 0&&this.#o.set(n,r)}this.#s.clear();
for(const n of this.#n){const r=this.overlays.surface(n),o=this.overlays.registrationGeneration(n);r&&o!==void 0&&this.#s.
set(n,Yr(r,o))}if(t)throw new Error("rollback-signal-publication-failed")}#k(e,t){this.#w.set(e,Q(t)),this.#f.set(e,Q(t))}#S(e,t){
t?this.#g.add(e):this.#g.delete(e)}#T(e,t){t?this.#m.set(e,t):this.#m.delete(e)}#A(){const e=new Set(this.#t.keys());this.#d=
new Map([...this.#d].filter(([t])=>e.has(t)))}#I(e){this.workspace.reconcile(this.#Y(e),{activeWindowId:this.#c}),this.#i=
new Set(this.#e.keys()),this.#o=new Map([...this.#i].map(t=>[t,this.workspace.windowRegistrationGeneration(t)]))}#Y(e){const t=new Set(
this.#e.keys()),n=this.workspace.inspect().windows.filter(r=>!e.has(r.id)&&!t.has(r.id));for(const r of this.#e.values())
n.push({id:r.id,minWidth:r.minWidth,minHeight:r.minHeight});return n}#P(e){const t=this.workspace.inspect().layout.root;
if(!t)return!1;const n=[t];for(;n.length>0;){const r=n.pop();if(r.kind==="pane")continue;if(r.id!==e){n.push(r.second,r.
first);continue}const o=[r.first,r.second];let s=0;for(;o.length>0;){const a=o.pop();if(a.kind==="pane"){if(s+=1,!this.#i.
has(a.windowId))return!1}else o.push(a.second,a.first)}return s>=2}return!1}#E(e,t,n=!0){const r=this.overlays.activeId.
peek(),o=new Set;for(const a of e){const c=this.overlays.surface(a),d=this.#s.get(a),l=!!(c&&d&&Jr(d,c,this.overlays.registrationGeneration(
a)));if(!this.#t.has(a)){l&&this.overlays.remove(a,{synchronizeFocus:!0}),this.#s.delete(a);continue}if(l){o.add(a);continue}
this.#s.delete(a),c&&an(t,a,`Overlay id "${a}" changed ownership after declarative registration; the replacement was pre\
served.`)}const s=new Set;for(const a of this.#t.values()){const c=this.overlays.surface(a.id);if(!c&&!o.has(a.id)&&!n)continue;
if(c&&!o.has(a.id)){an(t,a.id,`Overlay id "${a.id}" is already owned outside the declarative integration.`);continue}a.rect||
t.push({code:"missing-modal-geometry",severity:"warning",id:a.id,message:`Modal "${a.id}" has no computed or explicit re\
ctangle and was registered closed.`});const d=!!(a.rect&&a.declaredVisible&&this.#Z(a)&&this.#d.get(a.id)),l={id:a.id,rect:a.
rect?Q(a.rect):Q(Hr),layer:"modal",kind:"modal",zIndex:a.zIndex,visible:d,modal:!0,closeOnOutsideClick:a.closeOnOutsideClick,
ownerId:a.ownerId},u=o.has(a.id)?this.overlays.update(a.id,l,{synchronizeFocus:!0}):this.overlays.register(l,{synchronizeFocus:!0});
u.visible&&this.overlays.synchronizeActiveId(u.id),s.add(a.id),this.#s.set(a.id,Yr(u,this.overlays.registrationGeneration(
a.id)))}this.#n=s;for(const a of[...this.#s.keys()])s.has(a)||this.#s.delete(a);r&&this.overlays.surface(r)?.visible&&this.
overlays.synchronizeActiveId(r)}#L(){this.#H();for(const e of this.#n){const t=this.#t.get(e),n=this.overlays.surface(e);
t?.declaredVisible&&t.rect&&this.#Z(t)&&n&&this.#d.set(e,n.visible)}}#G(){this.#H();for(const e of this.#n){const t=this.#t.
get(e),n=this.overlays.surface(e);if(!t||!n)continue;const r=!!(t.rect&&t.declaredVisible&&this.#Z(t)&&this.#d.get(e));r!==
n.visible&&(r?this.overlays.open(e,{synchronizeFocus:!0}):this.overlays.update(e,{visible:!1},{synchronizeFocus:!0}))}}#V(){
const e=new Set(this.workspace.windowIds());let t=!1;for(const n of[...this.#i]){const r=this.#o.get(n);e.has(n)&&r!==void 0&&
this.workspace.windowRegistrationGeneration(n)===r||(this.#i.delete(n),this.#o.delete(n),this.#e.delete(n),Nl(this.#y,n,
`Workspace window id "${n}" changed ownership after declarative registration; the replacement was preserved.`),t=!0)}t&&
(this.#j(),this.#O(),this.#X())}#H(){for(const e of[...this.#n]){const t=this.overlays.surface(e),n=this.#s.get(e);t&&n&&
Jr(n,t,this.overlays.registrationGeneration(e))||(this.#n.delete(e),this.#s.delete(e),this.#t.has(e)&&an(this.#y,e,t?`Ov\
erlay id "${e}" changed ownership after declarative registration; the replacement was preserved.`:`Declaratively registe\
red overlay id "${e}" was removed outside the window controller.`))}}#Z(e){return!e.ownerId||!this.#e.has(e.ownerId)?!0:
this.#z(e.ownerId)&&(!this.#c||this.#c===e.ownerId)}#X(){if(this.#c)if(!this.#z(this.#c))this.#c=void 0;else{this.#l=this.#c,
this.#_(this.#c),this.#R(this.#c)==="tiled"&&this.workspace.focus(this.#c);return}if(this.#l&&this.#z(this.#l)){this.#R(
this.#l)==="tiled"?this.workspace.focus(this.#l):this.#_(this.#l);return}const e=this.workspace.inspect().activeWindowId;
if(e){if(!this.#e.has(e)){this.#l=void 0;return}if(this.#z(e)&&this.#R(e)==="tiled"){this.#l=e,this.#_(e);return}}for(const t of this.
workspace.windowIds())if(this.#e.has(t)&&this.#z(t)&&this.#R(t)==="tiled"){this.#l=t,this.#_(t),this.workspace.focus(t);
return}for(let t=this.#h.length-1;t>=0;t-=1){const n=this.#h[t];if(this.#z(n)){this.#l=n,this.#_(n),this.#R(n)==="tiled"&&
this.workspace.focus(n);return}}this.#l=void 0}#ie(){const e=[];for(const t of this.workspace.windowIds())(!this.#e.has(
t)||this.#z(t)&&this.#R(t)==="tiled")&&e.push(t);return e}#ne(){const e=this.workspace.windowIds(),t=new Set(e);for(const n of this.#e.
keys())t.has(n)||e.push(n);return e}#z(e){return!!(this.#e.get(e)?.declaredVisible&&!this.#a.has(e)&&!this.#r.has(e))}#ee(e){
return this.#a.has(e)?"closed":this.#r.has(e)?"minimized":this.#c===e?"maximized":"normal"}#R(e){return this.#u.get(e)??
"tiled"}#K(e){const t=this.#w.get(e);if(t)return Q(t);const n=this.#e.get(e);return n?ht(n):{column:0,row:0,width:1,height:1}}#D(e){
return this.#c&&this.#c!==e?(this.#l=this.#c,this.#R(this.#c)==="tiled"&&this.workspace.focus(this.#c),!1):(this.#l=e,this.#_(
e),this.#R(e)==="tiled"&&this.workspace.focus(e),!0)}#_(e){const t=this.#h.indexOf(e);return t<0?(this.#h.push(e),!0):this.#te(
e)?!1:(this.#h.splice(t,1),this.#h.push(e),!0)}#te(e){const t=this.#g.has(e);for(let n=this.#h.length-1;n>=0;n-=1){const r=this.#h[n];
if(this.#g.has(r)===t)return r===e}return!1}#J(e,t){const n=this.#q(e,t);if(n)return n;if(this.#R(t)!=="floating")return k(
e,"blocked",t,void 0,"window-not-floating")}#q(e,t,n){const r=this.#F(e,t,n);if(r)return r;if(!this.#e.has(t))return k(e,
"not-found",t,n);if(!this.#z(t))return k(e,"blocked",t,n,"window-not-visible")}#F(e,t,n){if(this.#b)return k(e,"disposed",
t,n,"controller-disposed");if(this.#x)return k(e,"blocked",t,n,"controller-mutation-in-progress");this.#V()}#Q(e){if(this.#b)
throw new Error(`MarkupWindowController is disposed; cannot ${e}.`);if(this.#x)throw new Error(`MarkupWindowController c\
annot ${e} during a state mutation.`)}}function Il(i,e){const t=[],n=[],r=[],o=new Set,s=new WeakSet,a=[{node:i,ancestors:[],
depth:0}];let c=0;for(;a.length>0;){const{node:d,ancestors:l,depth:u}=a.pop();if(u>Wn){oi(r,{code:"layout-depth-exceeded",
severity:"error",message:`Declarative window discovery exceeds the bounded depth of ${Wn}.`});continue}if(s.has(d)){oi(r,
{code:"layout-cycle-detected",severity:"error",message:"Declarative window discovery rejected a cyclic or multiply refer\
enced layout node."});continue}if(s.add(d),c+=1,c>An){oi(r,{code:"layout-node-limit-exceeded",severity:"error",message:`\
Declarative window discovery exceeds the bounded node limit of ${An}.`});break}const h=ws(d.tag);if(h==="window"||h==="m\
odal"||h==="dialog"){const p=d.id.trim();p?Qn(p)?o.has(p)?r.push({code:"duplicate-surface-id",severity:"error",id:p,message:`\
Declarative surface id "${p}" is duplicated; the first declaration remains authoritative.`}):(o.add(p),t.length+n.length>=
Ut?oi(r,{code:"surface-limit-exceeded",severity:"error",message:`Declarative window surfaces exceed the bounded limit of\
 ${Ut}.`}):h==="window"?t.push(xl(d,e)):n.push(Rl(d,h,l,e))):r.push({code:"invalid-surface-id",severity:"error",message:`\
Declarative <${h}> nodes require an id of at most ${hs} non-control characters.`}):r.push({code:"empty-surface-id",severity:"\
error",message:`Declarative <${h}> nodes require a non-empty stable id.`})}const f=[...l,d];for(let p=d.children.length-
1;p>=0;p-=1)a.push({node:d.children[p],ancestors:f,depth:u+1})}return{windows:t,modals:n,diagnostics:r}}function oi(i,e){
i.some(t=>t.code===e.code)||i.push(e)}function xl(i,e){const t=Ml(i.attributes),n=El(i.attributes),r=fs(i.attributes),o=e?.
byId.get(i.id)?.rect,s=_r(i.style.minWidth),a=_r(i.style.minHeight),c=qr(i.style.maxWidth),d=qr(i.style.maxHeight),l=c===
void 0?void 0:Math.max(s??1,c),u=d===void 0?void 0:Math.max(a??1,d),h=r??(o?nr(o):void 0),f=h?gt(h,{minWidth:s,minHeight:a,
maxWidth:l,maxHeight:u}):void 0,p=Ur(i.attributes,"always-on-top","pinned"),w=Ur(i.attributes,"group-id","group");return{
id:i.id.trim(),title:Nn(i.attributes.title??i.attributes["aria-label"]),minWidth:s,minHeight:a,maxWidth:l,maxHeight:u,declaredVisible:us(
i),declaredState:t?.state,stateToken:t?.token,declaredPlacement:n.placement,placementToken:n.token,declaredFloatingRect:f,
geometryToken:r&&f?Tl(f):void 0,declaredAlwaysOnTop:p?Ue(i.attributes,p,!0):!1,alwaysOnTopToken:p?`${p}:${Ue(i.attributes,
p,!0)}`:void 0,declaredGroupId:w?Zn(i.attributes[w]):void 0,groupToken:w?`${w}:${i.attributes[w]}`:void 0}}function Rl(i,e,t,n){
const r=Sl(i.attributes,e),o=n?.byId.get(i.id),s=o?nr(o.rect):fs(i.attributes),a=Ol(t);return{id:i.id.trim(),title:Nn(i.
attributes.title??i.attributes["aria-label"]),ownerId:Nn(i.attributes["owner-id"]??a?.id),declaredVisible:us(i),defaultOpen:r.
open,openToken:r.token,closeOnOutsideClick:Ue(i.attributes,"close-on-outside-click",!1),rect:s,zIndex:Xo("modal")+Math.floor(
Bt(i.style.zIndex,0))}}function Ml(i){const e=i.state?.trim().toLowerCase();if(e==="normal"||e==="minimized"||e==="maxim\
ized"||e==="closed")return{state:e,token:`state:${e}`};for(const t of["closed","minimized","maximized"])if(t in i){const n=Ue(
i,t,!1);return{state:n?t:"normal",token:`${t}:${n}`}}}function Sl(i,e){const t=i.state?.trim().toLowerCase();if(t==="ope\
n"||t==="closed")return{open:t==="open",token:`state:${t}`};if("open"in i){const n=Ue(i,"open",!0);return{open:n,token:`\
open:${n}`}}return{open:e==="modal"}}function us(i){return i.style.display!=="none"&&i.style.visibility!=="hidden"&&!Ue(
i.attributes,"hidden",!1)&&!Ue(i.attributes,"aria-hidden",!1)}function Ol(i){for(let e=i.length-1;e>=0;e-=1)if(ws(i[e].tag)===
"window")return i[e]}function _r(i){if(!(i.unit!=="cell"||!Number.isFinite(i.value)||i.value<=0))return Math.min(te,Math.
max(1,Math.floor(i.value)))}function qr(i){if(!(i.unit!=="cell"||!Number.isFinite(i.value)||i.value<=0))return Math.min(
te,Math.max(1,Math.floor(i.value)))}function fs(i){const e=ut(i,"column")??ut(i,"x"),t=ut(i,"row")??ut(i,"y"),n=ut(i,"wi\
dth"),r=ut(i,"height");if(!(e===void 0||t===void 0||n===void 0||r===void 0))return nr({column:e,row:t,width:n,height:r})}
function El(i){const e=i.placement?.trim().toLowerCase();if(e==="floating"||e==="tiled")return{placement:e,token:`placem\
ent:${e}`};if("floating"in i){const t=Ue(i,"floating",!0);return{placement:t?"floating":"tiled",token:`floating:${t}`}}return{
placement:"tiled"}}function Ur(i,...e){return e.find(t=>t in i)}function Tl(i){return`${i.column}:${i.row}:${i.width}:${i.
height}`}function ht(i){const e=ji(i);return{column:0,row:0,width:Math.max(e.minWidth,Math.min(e.maxWidth,40)),height:Math.
max(e.minHeight,Math.min(e.maxHeight,12))}}function ji(i){const e=si(i.minWidth??1),t=si(i.minHeight??1);return{minWidth:e,
minHeight:t,maxWidth:Math.max(e,si(i.maxWidth??te)),maxHeight:Math.max(t,si(i.maxHeight??te))}}function si(i){return Math.
min(te,Math.max(1,Math.floor(i)))}function gt(i,e){const t=St(i,!1);if(!t||t.width<=0||t.height<=0)return;const n=ji(e);
return{column:t.column,row:t.row,width:Math.max(n.minWidth,Math.min(n.maxWidth,t.width)),height:Math.max(n.minHeight,Math.
min(n.maxHeight,t.height))}}function sn(i){const e=St(i,!0);if(!e)return;const t=e.width>0?e.column+e.width-1:e.column,n=e.
height>0?e.row+e.height-1:e.row;if(!(Math.abs(t)>te||Math.abs(n)>te))return e}function St(i,e){try{if([i.column,i.row,i.
width,i.height].some(a=>typeof a!="number"||!Number.isFinite(a)))return;const n=Math.floor(i.column),r=Math.floor(i.row),
o=Math.floor(i.width),s=Math.floor(i.height);return Math.abs(n)>te||Math.abs(r)>te||o>te||s>te||o<(e?0:1)||s<(e?0:1)?void 0:
{column:n,row:r,width:o,height:s}}catch{return}}function Gr(i){try{return!Number.isSafeInteger(i.columns)||!Number.isSafeInteger(
i.rows)||Math.abs(i.columns)>te||Math.abs(i.rows)>te||i.columns===0&&i.rows===0?void 0:{columns:i.columns,rows:i.rows}}catch{
return}}function Cl(i,e){const t=i.column+e.columns,n=i.row+e.rows;if(!(!Number.isSafeInteger(t)||!Number.isSafeInteger(
n)||Math.abs(t)>te||Math.abs(n)>te))return{...i,column:t,row:n}}function zl(i,e,t,n){const r=ji(n),o=e==="left"||e==="to\
p-left"||e==="bottom-left",s=e==="right"||e==="top-right"||e==="bottom-right",a=e==="top"||e==="top-left"||e==="top-righ\
t",c=e==="bottom"||e==="bottom-left"||e==="bottom-right";let d=i.width+(s?t.columns:0)-(o?t.columns:0),l=i.height+(c?t.rows:
0)-(a?t.rows:0);d=Math.max(r.minWidth,Math.min(r.maxWidth,d)),l=Math.max(r.minHeight,Math.min(r.maxHeight,l));const u=o?
i.column+i.width-d:i.column,h=a?i.row+i.height-l:i.row;return St({column:u,row:h,width:d,height:l},!1)}function Vr(i,e,t){
if(e.width<=0||e.height<=0)return Q(i);const n=e.column+Math.min(t.margin,Math.max(0,e.width-1)),r=e.column+e.width-1-Math.
min(t.margin,Math.max(0,e.width-1)),o=e.row+Math.min(t.margin,Math.max(0,e.height-1)),s=e.row+e.height-1-Math.min(t.margin,
Math.max(0,e.height-1)),a=Math.floor((i.width-1)/2),c=n-a,d=r-a,l=Math.max(1,Math.min(i.height,t.titleBarHeight)),u=Math.
max(o,s-l+1);return St({...i,column:Math.max(c,Math.min(d,i.column)),row:Math.max(o,Math.min(u,i.row))},!1)}function $l(i){
try{const e=i.margin??0,t=i.titleBarHeight??1;return!Number.isSafeInteger(e)||e<0||e>te||!Number.isSafeInteger(t)||t<1||
t>te?void 0:{margin:e,titleBarHeight:t}}catch{return}}function Al(i,e){const t=Math.max(1,Math.ceil(e.width/2)),n=Math.max(
1,Math.floor(e.width/2)),r=Math.max(1,Math.ceil(e.height/2)),o=Math.max(1,Math.floor(e.height/2));if(i.kind==="workspace")
switch(i.edge){case"left":return{...e,width:t};case"right":return{...e,column:e.column+e.width-n,width:n};case"top":return{
...e,height:r};case"bottom":return{...e,row:e.row+e.height-o,height:o}}const s=i.corner==="top-right"||i.corner==="botto\
m-right",a=i.corner==="bottom-left"||i.corner==="bottom-right",c=s?n:t,d=a?o:r;return{column:s?e.column+e.width-c:e.column,
row:a?e.row+e.height-d:e.row,width:c,height:d}}function Kr(i,e,t){const n=gt(Al(i,e),t);if(!n)return;const r=i.kind==="w\
orkspace"?i.edge==="right":i.corner==="top-right"||i.corner==="bottom-right",o=i.kind==="workspace"?i.edge==="bottom":i.
corner==="bottom-left"||i.corner==="bottom-right";return r?n.column=e.column+e.width-n.width:n.column=e.column,o?n.row=e.
row+e.height-n.height:n.row=e.row,St(n,!1)}function Wl(i){try{if(!i||typeof i!="object")return;if(i.kind==="workspace"&&
xt(i.edge))return{kind:"workspace",edge:i.edge};if(i.kind==="corner"&&er(i.corner))return{kind:"corner",corner:i.corner};
if(i.kind==="dock"&&Qn(i.targetId)&&xt(i.edge)&&(i.ratio===void 0||Number.isFinite(i.ratio)&&i.ratio>=.05&&i.ratio<=.95))
return i.ratio===void 0?{kind:"dock",targetId:i.targetId.trim(),edge:i.edge}:{kind:"dock",targetId:i.targetId.trim(),edge:i.
edge,ratio:i.ratio}}catch{}}function Je(i){return i.kind==="dock"&&i.ratio!==void 0?{...i}:{...i}}function Pl(i){return i?
Je(i):void 0}function Dt(i){return i?Q(i):void 0}function ai(i){return new Map([...i].map(([e,t])=>[e,Q(t)]))}function Xr(i){
return new Map([...i].map(([e,t])=>[e,Je(t)]))}function Yr(i,e){return{registrationGeneration:e,rect:Q(i.rect),layer:i.layer,
kind:i.kind,modal:i.modal,closeOnOutsideClick:i.closeOnOutsideClick,ownerId:i.ownerId}}function Jr(i,e,t){return i.registrationGeneration===
t&&jt(i.rect,e.rect)&&i.layer===e.layer&&i.kind===e.kind&&i.modal===e.modal&&i.closeOnOutsideClick===e.closeOnOutsideClick&&
i.ownerId===e.ownerId}function Zr(i){return new Map([...i].map(([e,t])=>[e,{...t,rect:Q(t.rect)}]))}function an(i,e,t){i.
some(n=>n.code==="overlay-id-conflict"&&n.id===e)||i.push({code:"overlay-id-conflict",severity:"error",id:e,message:t})}
function Nl(i,e,t){i.some(n=>n.code==="workspace-id-conflict"&&n.id===e)||i.push({code:"workspace-id-conflict",severity:"\
error",id:e,message:t})}function Qr(i){return new Map([...i].map(([e,t])=>[e,{...t,declaredFloatingRect:Dt(t.declaredFloatingRect)}]))}
function eo(i){return new Map([...i].map(([e,t])=>[e,{...t,rect:Dt(t.rect)}]))}function jt(i,e){return!!(i&&e&&i.column===
e.column&&i.row===e.row&&i.width===e.width&&i.height===e.height)}function cn(i,e){const t=ji(e);return i.width>=t.minWidth&&
i.width<=t.maxWidth&&i.height>=t.minHeight&&i.height<=t.maxHeight}function jl(i,e){return Number(i.alwaysOnTop)-Number(e.
alwaysOnTop)||i.focusOrder-e.focusOrder||i.id.localeCompare(e.id)}function Zn(i){const e=i?.trim();if(!(!e||e.length>yl||
ps(e)))return e}function Qn(i){return typeof i=="string"&&i.trim().length>0&&i.trim().length<=hs&&!ps(i)}function ps(i){
for(let e=0;e<i.length;e+=1){const t=i.charCodeAt(e);if(t<=31||t===127)return!0}return!1}function xt(i){return i==="left"||
i==="right"||i==="top"||i==="bottom"}function er(i){return i==="top-left"||i==="top-right"||i==="bottom-left"||i==="bott\
om-right"}function Bl(i){return xt(i)||er(i)}function to(i){try{const e=qe(i,["version","compactMode","windowIds","minim\
izedWindowIds","closedWindowIds","maximizedWindowId","activeWindowId","focusOrderWindowIds","placements","modals","works\
pace"],["version","compactMode","windowIds","minimizedWindowIds","closedWindowIds","modals","workspace"],"markup window \
snapshot"),t=e.version;if(t!==yi&&t!==Ci)return{ok:!1,status:"unsupported",reason:`unsupported-snapshot-version:${String(
t)}`};const n=Ul(e.compactMode),r=ci(e.windowIds,"windowIds"),o=new Set(r),s=ci(e.minimizedWindowIds,"minimizedWindowIds",
o),a=ci(e.closedWindowIds,"closedWindowIds",o);if(s.some(w=>a.includes(w)))throw new TypeError("minimized and closed win\
dow ids must be disjoint");const c=ro(e.maximizedWindowId,o,"maximizedWindowId");if(c&&(s.includes(c)||a.includes(c)))throw new TypeError(
"maximized window cannot also be hidden");const d=Fl(e.modals),l=Hl(e.workspace);if(t===Ci){if(Object.hasOwn(e,"activeWi\
ndowId")||Object.hasOwn(e,"focusOrderWindowIds")||Object.hasOwn(e,"placements"))throw new TypeError("V1 snapshot contain\
s V2-only state");const w=io(l),g=c??w;return{ok:!0,snapshot:{version:yi,compactMode:n,windowIds:r,minimizedWindowIds:s,
closedWindowIds:a,maximizedWindowId:c,activeWindowId:g&&o.has(g)&&!s.includes(g)&&!a.includes(g)?g:void 0,focusOrderWindowIds:r.
slice(),placements:r.map(R=>({id:R,placement:"tiled",alwaysOnTop:!1})),modals:d,workspace:l}}}if(!("focusOrderWindowIds"in
e)||!("placements"in e))throw new TypeError("V2 snapshot is missing focus or placement state");const u=ci(e.focusOrderWindowIds,
"focusOrderWindowIds",o);if(u.length!==r.length)throw new TypeError("focus order must contain every window exactly once");
const h=ro(e.activeWindowId,o,"activeWindowId");if(h&&(s.includes(h)||a.includes(h)))throw new TypeError("active window \
cannot also be hidden");if(c&&h!==c)throw new TypeError("maximized window must be the active window");const f=Ll(e.placements,
o);if(f.length!==r.length)throw new TypeError("placements must contain every window exactly once");const p=h?f.find(w=>w.
id===h)?.placement:void 0;if(h&&p==="tiled"&&io(l)!==h)throw new TypeError("active tiled window must match workspace act\
ive pane");if(h&&p==="floating"){const w=new Map(f.map(m=>[m.id,m])),g=w.get(h),R=u.indexOf(h);for(let m=R+1;m<u.length;m+=
1){const M=w.get(u[m]);if(M?.placement==="floating"&&M.alwaysOnTop===g.alwaysOnTop)throw new TypeError("active floating \
window must be frontmost in its z-order tier")}}return{ok:!0,snapshot:{version:yi,compactMode:n,windowIds:r,minimizedWindowIds:s,
closedWindowIds:a,maximizedWindowId:c,activeWindowId:h,focusOrderWindowIds:u,placements:f,modals:d,workspace:l}}}catch{return{
ok:!1,status:"invalid",reason:"snapshot-schema-is-invalid"}}}function Ll(i,e){const t=ir(i,"placements");if(t.length>Ut)
throw new RangeError("too many placements");const n=[],r=new Set;for(let o=0;o<t.length;o+=1){const s=qe(t[o],["id","pla\
cement","floatingRect","restoreRect","snapTarget","alwaysOnTop","groupId"],["id","placement","alwaysOnTop"],`placement ${o}`),
a=tr(s.id,e,`placement ${o} id`);if(r.has(a))throw new TypeError("duplicate placement id");if(r.add(a),s.placement!=="ti\
led"&&s.placement!=="floating")throw new TypeError("invalid placement");if(typeof s.alwaysOnTop!="boolean")throw new TypeError(
"invalid alwaysOnTop");const c=s.floatingRect===void 0?void 0:no(s.floatingRect);if(s.placement==="floating"&&!c)throw new TypeError(
"floating placement requires rect");const d=s.restoreRect===void 0?void 0:no(s.restoreRect),l=s.snapTarget===void 0?void 0:
Dl(s.snapTarget);if(l?.kind==="dock"){if(s.placement!=="tiled"||!e.has(l.targetId)||l.targetId===a)throw new TypeError("\
dock snap requires a distinct tiled inventory target")}else if(l&&s.placement!=="floating")throw new TypeError("workspac\
e and corner snaps require floating placement");const u=s.groupId===void 0?void 0:ql(s.groupId);n.push({id:a,placement:s.
placement,floatingRect:c,restoreRect:d,snapTarget:l,alwaysOnTop:s.alwaysOnTop,groupId:u})}return n}function Dl(i){const e=qe(
i,["kind","edge","corner","targetId","ratio"],["kind"],"snapTarget");if(e.kind==="workspace"){if(!xt(e.edge)||e.corner!==
void 0||e.targetId!==void 0||e.ratio!==void 0)throw new TypeError("invalid workspace snap");return{kind:"workspace",edge:e.
edge}}if(e.kind==="corner"){if(!er(e.corner)||e.edge!==void 0||e.targetId!==void 0||e.ratio!==void 0)throw new TypeError(
"invalid corner snap");return{kind:"corner",corner:e.corner}}if(e.kind==="dock"){const t=rt(e.targetId,"dock targetId");
if(!xt(e.edge)||e.corner!==void 0)throw new TypeError("invalid dock snap");if(e.ratio!==void 0&&(typeof e.ratio!="number"||
!Number.isFinite(e.ratio)||e.ratio<.05||e.ratio>.95))throw new TypeError("invalid dock ratio");return e.ratio===void 0?{
kind:"dock",targetId:t,edge:e.edge}:{kind:"dock",targetId:t,edge:e.edge,ratio:e.ratio}}throw new TypeError("invalid snap\
 kind")}function Fl(i){const e=ir(i,"modals");if(e.length>Ut)throw new RangeError("too many modals");const t=[],n=new Set;
for(let r=0;r<e.length;r+=1){const o=qe(e[r],["id","open"],["id","open"],`modal ${r}`),s=rt(o.id,`modal ${r} id`);if(n.has(
s)||typeof o.open!="boolean")throw new TypeError("invalid modal snapshot");n.add(s),t.push({id:s,open:o.open})}return t}
function Hl(i){const e=qe(i,["version","gap","layout"],["version","gap","layout"],"workspace");if(e.version!==mn)throw new TypeError(
"unsupported workspace version");if(!Number.isSafeInteger(e.gap)||e.gap<0||e.gap>te)throw new TypeError("invalid workspa\
ce gap");const t=qe(e.layout,["root","activePaneId"],[],"workspace layout"),n=new Set,r=new Set,o=new WeakSet,s={value:0},
a=t.root===void 0?void 0:Pn(t.root,0,s,o,n,r);let c;if(t.activePaneId!==void 0&&(c=rt(t.activePaneId,"activePaneId"),!n.
has(c)))throw new TypeError("active pane is missing");return{version:mn,gap:e.gap,layout:{root:a,activePaneId:c}}}function Pn(i,e,t,n,r,o){
if(e>Wn||++t.value>An)throw new RangeError("workspace layout limit exceeded");if(!i||typeof i!="object"||n.has(i))throw new TypeError(
"invalid or cyclic workspace node");n.add(i);const s=qe(i,["kind","id","windowId","minWidth","minHeight","direction","ra\
tio","first","second"],["kind","id"],"workspace node"),a=rt(s.id,"workspace node id");if(r.has(a))throw new TypeError("d\
uplicate workspace node id");if(r.add(a),s.kind==="pane"){const c=rt(s.windowId,"workspace window id");if(o.has(c)||s.direction!==
void 0||s.ratio!==void 0||s.first!==void 0||s.second!==void 0)throw new TypeError("invalid workspace pane");return o.add(
c),{kind:"pane",id:a,windowId:c,minWidth:oo(s.minWidth,"pane minWidth"),minHeight:oo(s.minHeight,"pane minHeight")}}if(s.
kind!=="split"||s.direction!=="row"&&s.direction!=="column"||typeof s.ratio!="number"||!Number.isFinite(s.ratio)||s.ratio<
.05||s.ratio>.95||s.windowId!==void 0||s.minWidth!==void 0||s.minHeight!==void 0||s.first===void 0||s.second===void 0)throw new TypeError(
"invalid workspace split");return{kind:"split",id:a,direction:s.direction,ratio:s.ratio,first:Pn(s.first,e+1,t,n,r,o),second:Pn(
s.second,e+1,t,n,r,o)}}function io(i){const e=i.layout.activePaneId;if(!e||!i.layout.root)return;const t=[i.layout.root];
for(;t.length>0;){const n=t.pop();if(n.kind==="pane"){if(n.id===e)return n.windowId}else t.push(n.second,n.first)}}function _l(i,e){
if(!i.layout.root)return;const t=[i.layout.root];for(;t.length>0;){const n=t.pop();if(n.kind==="pane"){if(n.windowId===e)
return n.id}else t.push(n.second,n.first)}}function no(i){const e=qe(i,["column","row","width","height"],["column","row",
"width","height"],"rect"),t=St(e,!1);if(!t)throw new TypeError("invalid rect");return t}function ci(i,e,t){const n=ir(i,
e);if(n.length>Ut)throw new RangeError(`${e} is too large`);const r=[],o=new Set;for(const s of n){const a=t?tr(s,t,e):rt(
s,e);if(o.has(a))throw new TypeError(`${e} contains duplicates`);o.add(a),r.push(a)}return r}function ro(i,e,t){return i===
void 0?void 0:tr(i,e,t)}function tr(i,e,t){const n=rt(i,t);if(!e.has(n))throw new TypeError(`${t} is outside the snapsho\
t inventory`);return n}function rt(i,e){if(!Qn(i))throw new TypeError(`${e} is invalid`);return i.trim()}function ql(i){
if(typeof i!="string")throw new TypeError("group id must be a string");const e=Zn(i);if(!e)throw new TypeError("group id\
 is invalid");return e}function oo(i,e){if(i!==void 0){if(!Number.isSafeInteger(i)||i<1||i>te)throw new TypeError(`${e} \
is invalid`);return i}}function Ul(i){if(i!=="auto"&&i!=="always"&&i!=="never")throw new TypeError("invalid compact mode");
return i}function ir(i,e){if(!Array.isArray(i)||Object.getPrototypeOf(i)!==Array.prototype)throw new TypeError(`${e} mus\
t be a plain array`);for(let t=0;t<i.length;t+=1){const n=Object.getOwnPropertyDescriptor(i,String(t));if(!n||!("value"in
n)||!n.enumerable)throw new TypeError(`${e} must be dense data`)}for(const t of Reflect.ownKeys(i))if(t!=="length"&&(typeof t!=
"string"||!/^(0|[1-9]\d*)$/.test(t)||Number(t)>=i.length))throw new TypeError(`${e} has an unexpected property`);return i}
function qe(i,e,t,n){if(!i||typeof i!="object"||Object.getPrototypeOf(i)!==Object.prototype)throw new TypeError(`${n} mu\
st be a plain object`);const r=i,o=new Set(e);for(const s of Reflect.ownKeys(r)){if(typeof s!="string"||!o.has(s))throw new TypeError(
`${n} has an unexpected property`);const a=Object.getOwnPropertyDescriptor(r,s);if(!a||!("value"in a)||!a.enumerable)throw new TypeError(
`${n} properties must be enumerable data`)}for(const s of t)if(!Object.hasOwn(r,s))throw new TypeError(`${n} is missing ${s}`);
return r}function k(i,e,t,n,r){const o={action:i,status:e,ok:e==="applied"||e==="unchanged"};return t!==void 0&&(o.id=t),
n!==void 0&&(o.targetId=n),r!==void 0&&(o.reason=r),o}function dn(i){return{...i}}function di(i){return{...i,rect:Q(i.rect)}}
function Q(i){return{column:i.column,row:i.row,width:i.width,height:i.height}}function nr(i){return{column:Math.floor(Bt(
i.column,0)),row:Math.floor(Bt(i.row,0)),width:Math.max(0,Math.floor(Bt(i.width,0))),height:Math.max(0,Math.floor(Bt(i.height,
0)))}}function so(i){return i==="always"||i==="never"?i:"auto"}function Gl(i,e){if(i===void 0)return e.slice();if(!Array.
isArray(i))return[];const t=new Set(e),n=new Set,r=[];for(const o of i)typeof o!="string"||!t.has(o)||n.has(o)||(n.add(o),
r.push(o));return r}function ut(i,e){const t=i[e];if(t===void 0)return;const n=Number(t);return Number.isFinite(n)?n:void 0}
function Ue(i,e,t){if(!(e in i))return t;const n=i[e]?.trim().toLowerCase();return n!=="false"&&n!=="0"&&n!=="no"&&n!=="\
off"}function Nn(i){const e=i?.trim();return e||void 0}function ws(i){return i.trim().toLowerCase()}function Bt(i,e){return Number.
isFinite(i)?i:e}function Vl(i,e,t){const n=[...i.tiledWindows,...i.floatingWindows];for(let r=n.length-1;r>=0;r-=1){const o=n[r];
if(Pe(o.rect,e,t)){if(t!==o.rect.row||Pe(o.clientRect,e,t))return;for(const s of o.controls)if(Pe(s.hitRect,e,t))return;
return o.id}}}const Kl=64,Xl=1;let Yl=0;function ao(i,e="workbench-window-host"){const t=i.map(n=>{const r=os();Lt(n.minWidth)&&
(r.minWidth=wt(Math.floor(n.minWidth))),Lt(n.minHeight)&&(r.minHeight=wt(Math.floor(n.minHeight))),Lt(n.maxWidth)&&(r.maxWidth=
wt(Math.floor(n.maxWidth))),Lt(n.maxHeight)&&(r.maxHeight=wt(Math.floor(n.maxHeight)));const o={title:String(n.title??"")};
return n.state!==void 0&&(o.state=n.state),n.placement!==void 0&&(o.placement=n.placement),n.alwaysOnTop!==void 0&&(o["a\
lways-on-top"]=String(n.alwaysOnTop)),n.groupId!==void 0&&(o["group-id"]=n.groupId),n.floatingRect&&(o.column=String(n.floatingRect.
column),o.row=String(n.floatingRect.row),o.width=String(n.floatingRect.width),o.height=String(n.floatingRect.height)),Tr(
{id:n.id,tag:"window",attributes:o,style:r})});return Tr({id:e,tag:"main",children:t})}class Jl{workspace;overlays;history;capture;controller;windowHistory;interactions;commitRevision=new Ie(
0);viewRevision=new Ie(0);#e;#t;#i;#o;#n;#s;#r;#a=zd();#d=new Map;#u=new Map;#w=Zc();#f;#p;#g;#m;#h;#l;#c=!1;constructor(e){
if(!e?.workspace)throw new TypeError("Workbench window host requires an existing tiled workspace.");if(e.root===void 0==
(e.windows===void 0))throw new TypeError("Workbench window host requires exactly one of root or windows.");this.workspace=
e.workspace,this.#e=e.overlays===void 0,this.#t=!0,this.#i=e.capture===void 0,this.overlays=e.overlays??new ud,this.history=
new Fc({capacity:e.historyCapacity??Kl}),this.capture=e.capture??new nc,this.#n=Lt(e.commandStep)?Math.max(1,Math.floor(
e.commandStep)):Xl,this.#s=e.now??Date.now,this.#o=new bo({now:this.#s});const t=e.windowConfigButton??!1;this.#g=typeof t==
"function"?t:()=>t,this.#m=e.windowConfigLabel??"config";const n=new kl({root:e.root??ao(e.windows,e.rootId),workspace:this.
workspace,overlays:this.overlays,compactMode:e.compactMode}),r=e.ownerId??`workbench-window-host-${++Yl}`,o=th(r,"separa\
tor");let s,a,c;try{if(e.initialWorkspace){const d=n.snapshot(),l=n.restoreSnapshot({version:Ci,compactMode:d.compactMode,
windowIds:d.windowIds,minimizedWindowIds:d.minimizedWindowIds,closedWindowIds:d.closedWindowIds,maximizedWindowId:d.maximizedWindowId,
modals:d.modals,workspace:e.initialWorkspace});if(!l.ok)throw new TypeError(`Initial workbench workspace was rejected: ${l.
reason}`)}s=Pd({controller:n,history:this.history,idPrefix:"workbench-window",group:"workbench-windows"}),c=this.capture.
registerOwner({id:o,onPointer:()=>{}}),a=new ol({controller:n,capture:this.capture,history:s,ownerId:r,titleBarHeight:1,
resizeMargin:1,snapDistance:e.snapDistance,snapEdgeSpanRatio:e.snapEdgeSpanRatio,snapCornerReach:e.snapCornerReach,snapOnRelease:e.
snapOnRelease})}catch(d){throw pe(()=>a?.dispose()),pe(()=>c?.dispose()),pe(()=>s?.dispose()),pe(()=>n.dispose()),this.#i&&
pe(()=>this.capture.dispose()),this.#e&&pe(()=>this.overlays.dispose()),pe(()=>this.commitRevision.dispose()),pe(()=>this.
viewRevision.dispose()),d}this.controller=n,this.windowHistory=s,this.interactions=a,this.#f=o,this.#p=c}project(e,t={}){
this.#L("project"),this.viewRevision.value;const n=this.controller.project(e,t),r=this.controller.inspect(),o=new Map(r.
windows.map(h=>[h.id,h])),s=[],a=[],c=[];let d=0;for(const h of n.workspace.panes){const f=o.get(h.windowId);if(!f)continue;
const p=this.#y(f.id,f.title??f.id,"tiled",h.rect,d++,f,t.titleAdornments?.(f.id)??[]);a.push(p),s.push(p)}for(const h of n.
floatingZOrder){const f=o.get(h.id);if(!f)continue;const p=this.#y(f.id,f.title??f.id,"floating",h.rect,h.zIndex,f,t.titleAdornments?.(
f.id)??[]);c.push(p),s.push(p)}const l=this.#x(r,t.shelfBounds),u=n.workspace.separators.map(Ql);return{bounds:Ee(e),compact:n.
compact,compactWindowId:n.compactWindowId,topModalId:n.topModalId,windows:s,tiledWindows:a,floatingWindows:c,separators:u,
shelf:l,switcher:this.#b(r,t),snapPreview:this.#N(e,r),core:n}}execute(e,t,n={}){if(this.#c)return A("disposed",!1,e,void 0,
void 0,"window-host-disposed");if(this.#M())return A("blocked",!1,e,void 0,void 0,"window-gesture-active");try{if(e.kind===
"switcher-open"||e.kind==="switcher-step")return this.#k(e.direction,e,n);if(e.kind==="switcher-cancel"){const a=this.#h!==
void 0;return this.#h=void 0,a&&this.#E(),A(a?"applied":"unchanged",a,e)}if(e.kind==="switcher-accept")return this.#S(e,
t,n);if(e.kind==="recover-all")return this.#I(e,t);if(e.kind==="focus-next")return this.#B(e,t,n);if(e.kind==="restore-f\
loating")return this.#Y(e);if(e.kind==="resize-split")return this.#C(e,this.windowHistory.resize(e.splitId,e.delta,t,n));
const r=e.id??this.controller.inspect().activeWindowId;if(!r)return A("blocked",!1,e,void 0,void 0,"no-active-window");const o=this.
controller.inspect().windows.find(a=>a.id===r);let s;switch(e.kind){case"focus":s=this.windowHistory.focus(r);break;case"\
nudge":s=this.windowHistory.moveBy(r,e.delta);break;case"resize":s=this.windowHistory.resizeWindow(r,e.edge,e.delta);break;case"\
snap":s=this.windowHistory.snap(r,e.target,t);break;case"dock":s=this.windowHistory.dock(r,e.targetId,e.edge,{ratio:e.ratio});
break;case"set-placement":s=this.windowHistory.setPlacement(r,e.placement,{rect:e.rect});break;case"toggle-placement":{if(!o)
return A("invalid",!1,e,void 0,void 0,"window-not-found");const a=o.placement==="floating"?"tiled":"floating";s=this.windowHistory.
setPlacement(r,a,{rect:e.rect});break}case"minimize":s=this.windowHistory.minimize(r);break;case"maximize":s=this.windowHistory.
maximize(r);break;case"toggle-maximize":s=o?.state==="maximized"?this.windowHistory.restore(r):this.windowHistory.maximize(
r);break;case"restore":s=this.windowHistory.restore(r);break;case"close":s=this.windowHistory.close(r);break;case"recove\
r-bounds":s=this.windowHistory.recoverBounds(r,t,{titleBarHeight:1});break;case"toggle-always-on-top":if(!o)return A("in\
valid",!1,e,void 0,void 0,"window-not-found");s=this.windowHistory.setAlwaysOnTop(r,!o.alwaysOnTop);break;case"set-group":
s=this.windowHistory.setGroup(r,e.groupId);break;default:return A("invalid",!1,e,void 0,void 0,"unsupported-window-comma\
nd")}return this.#C(e,s)}catch(r){return A("failed",!1,e,void 0,void 0,Me(r))}}handleKey(e,t,n={}){if(this.#h){if(e.key===
"escape")return this.execute({kind:"switcher-cancel"},t,n);if(e.key==="return"||e.key==="space")return this.execute({kind:"\
switcher-accept"},t,n);if(e.key==="tab"||e.key==="right"||e.key==="down")return this.execute({kind:"switcher-step",direction:e.
shift?-1:1},t,n);if(e.key==="left"||e.key==="up")return this.execute({kind:"switcher-step",direction:-1},t,n)}if(!e.meta||
!(e.shift||e.key==="tab"))return A("ignored",!1,void 0,void 0,void 0,"window-modifier-not-held");if(e.key==="tab")return this.
execute({kind:"switcher-open",direction:e.shift?-1:1},t,n);const r=rh(e.key);if(r)return e.ctrl?this.execute({kind:"nudg\
e",delta:oh(r,this.#n)},t,n):this.execute({kind:"snap",target:this.#v(r)},t,n);switch(e.key.toLowerCase()){case"m":return this.
execute({kind:"minimize"},t,n);case"f":return this.execute({kind:"toggle-maximize"},t,n);case"c":return this.execute({kind:"\
close"},t,n);case"r":return this.execute({kind:"recover-bounds"},t,n);case"p":return this.execute({kind:"toggle-always-o\
n-top"},t,n);case"d":return this.execute({kind:"toggle-placement"},t,n);default:return A("ignored",!1,void 0,void 0,void 0,
"unbound-window-key")}}#v(e){const t=this.#s(),n=this.#r,r=this.controller.inspect().activeWindowId;if(this.#r={edge:e,at:t,
id:r},n&&n.id===r&&t-n.at>=0&&t-n.at<=nh&&li(n.edge)!==li(e)){const o=li(e)?e:n.edge,s=li(e)?n.edge:e;return this.#r=void 0,
{kind:"corner",corner:`${o}-${s}`}}return{kind:"workspace",edge:e}}handlePointer(e,t,n={}){if(this.#c)return A("disposed",
!1,void 0,void 0,void 0,"window-host-disposed");let r;try{r=Ai(e)}catch{return A("invalid",!1,void 0,void 0,void 0,"poin\
ter-event-is-invalid")}if(this.#l)return this.#j(r,t);if(r.kind!=="down"&&n.doubleClickMaximizeMs!==void 0){const o=r.coordinates.
cell,s=Cr(this.#a,{kind:r.kind==="move"?"move":r.kind==="up"?"up":"cancel",column:o?.x??Number.NaN,row:o?.y??Number.NaN,
timestamp:r.timestamp},{doubleClickMs:n.doubleClickMaximizeMs});if(this.#a=s.state,s.outcome.kind==="double-click")return this.
interactions.inspect().active&&this.#$(r,t),this.execute({kind:"toggle-maximize",id:s.outcome.id},t,n)}if(this.interactions.
inspect().active)return this.#$(r,t);if(r.kind==="down"){const o=r.coordinates.cell;if(!o)return A("ignored",!1,void 0,void 0,
void 0,"pointer-has-no-cell-coordinate");const s=this.project(t,n);if(s.topModalId)return A("blocked",!1,void 0,void 0,void 0,
`pointer-blocked-by-modal:${s.topModalId}`);const a=r.primary&&(r.button===0||r.device!=="mouse"&&r.button===null);if(a)
for(let d=s.shelf.length-1;d>=0;d-=1){const l=s.shelf[d];if(l.rect&&Pe(l.rect,o.x,o.y))return this.execute(l.command,t)}
if(a&&r.device==="mouse"&&n.doubleClickMaximizeMs!==void 0){const d=Cr(this.#a,{kind:"down",id:Vl(s,o.x,o.y),column:o.x,
row:o.y,timestamp:r.timestamp},{doubleClickMs:n.doubleClickMaximizeMs});this.#a=d.state}const c=d=>{if(!Pe(d.rect,o.x,o.
y))return;for(let u=d.controls.length-1;u>=0;u-=1){const h=d.controls[u];if(a&&h.command&&Pe(h.hitRect,o.x,o.y))return this.
execute(h.command,t)}if(!a)return A("ignored",!1,void 0,void 0,void 0,"pointer-is-not-a-primary-activation");if(d.placement===
"floating"){const u=this.interactions.hitTest({column:o.x,row:o.y},t);if(u&&u.region!=="client")return this.#$(r,t)}const l=this.
execute({kind:"focus",id:d.id},t);return Pe(d.clientRect,o.x,o.y)?{...l,handled:!1,reason:"window-client-focus-pass-thro\
ugh"}:l};for(let d=s.floatingWindows.length-1;d>=0;d-=1){const l=c(s.floatingWindows[d]);if(l)return l}if(a)for(let d=s.
separators.length-1;d>=0;d-=1){const l=s.separators[d];if(Pe(l.hitRect,o.x,o.y))return this.#U(l,r,n)}for(let d=s.tiledWindows.
length-1;d>=0;d-=1){const l=c(s.tiledWindows[d]);if(l)return l}}return this.#$(r,t)}handleMouse(e,t,n,r={}){try{const o=e===
"terminal"?this.#o.terminal(t):this.#o.browser(t);return this.handlePointer(ic(o,t),n,r)}catch(o){return A("invalid",!1,
void 0,void 0,void 0,Me(o))}}reconcileWindows(e,t="workbench-window-host"){if(this.#c)return A("disposed",!1,void 0,void 0,
void 0,"window-host-disposed");let n;try{n=ao(e,t)}catch(r){return A("failed",!1,void 0,void 0,void 0,Me(r))}return this.
reconcileRoot(n)}reconcileRoot(e,t={}){if(this.#c)return A("disposed",!1,void 0,void 0,void 0,"window-host-disposed");if(this.#M())
return A("blocked",!1,void 0,void 0,void 0,"window-gesture-active");if(this.controller.mutationInProgress)return A("bloc\
ked",!1,void 0,void 0,void 0,"window-controller-mutation-in-progress");const n=this.history.inspect();if(n.operation||n.
transaction)return A("blocked",!1,void 0,void 0,void 0,"window-history-active");try{const r=this.controller.reconcile(e,
t);return this.history.clear(),this.#W(r),this.#P(),A("applied",!0,void 0,void 0,void 0,"windows-reconciled")}catch(r){return A(
"failed",!1,void 0,void 0,void 0,Me(r))}}restoreSnapshot(e){if(this.#L("restore snapshot"),this.#M())return{action:"rest\
ore-snapshot",status:"blocked",ok:!1,reason:"window-gesture-active"};const t=this.controller.restoreSnapshot(e);return t.
ok&&(this.history.clear(),this.#P()),t}restoreLegacyWorkspace(e){this.#L("restore legacy workspace");const t=this.controller.
snapshot();return this.restoreSnapshot({version:Ci,compactMode:t.compactMode,windowIds:t.windowIds,minimizedWindowIds:t.
minimizedWindowIds,closedWindowIds:t.closedWindowIds,maximizedWindowId:t.maximizedWindowId,modals:t.modals,workspace:e})}snapshot(){
return this.controller.snapshot()}async undo(){if(this.#L("undo"),this.#M())return!1;const e=await this.history.undo();return e&&
this.#P(),e}async redo(){if(this.#L("redo"),this.#M())return!1;const e=await this.history.redo();return e&&this.#P(),e}inspect(){
return{disposed:this.#c,ownsOverlays:this.#e,ownsHistory:this.#t,ownsCapture:this.#i,commitRevision:this.commitRevision.
peek(),viewRevision:this.viewRevision.peek(),switcherOpen:this.#h!==void 0,controller:this.controller.inspect(),interaction:this.
interactions.inspect(),history:this.history.inspect(),separatorResize:this.#l?{pointerId:this.#l.pointerId,splitId:this.#l.
splitId,direction:this.#l.direction,delta:this.#l.delta}:void 0}}dispose(){this.#c||(this.#c=!0,this.#O(),this.interactions.
dispose(),this.#p.dispose(),this.windowHistory.dispose(),this.history.clear(),this.controller.dispose(),this.#i&&this.capture.
dispose(),this.#e&&this.overlays.dispose(),this.commitRevision.dispose(),this.viewRevision.dispose())}#y(e,t,n,r,o,s,a=[]){
const c=this.#d.get(e)??od();this.#d.set(e,c),sd(c,{rect:r,title:t,maximized:s.state==="maximized",alwaysOnTop:n==="floa\
ting"?s.alwaysOnTop:void 0,showConfig:this.#g(e),configLabel:this.#m,configAccessibilityLabel:`Configure ${t}`});const d=this.#u.
get(e)??[];this.#u.set(e,d);const l=ad(d,c),u=r.column+Math.floor((Math.max(1,r.width)-1)/2),h=l.filter(p=>!(p.hitRect.row===
r.row&&Pe(p.hitRect,u,r.row))).map(p=>{const w=Zl(e,p.kind,n,s.state);return{kind:p.kind,text:p.text,rect:Ee(p.rect),hitRect:Ee(
p.hitRect),tone:p.tone,command:w,semantic:{id:`${e}:control:${p.kind}`,role:"button",label:p.accessibilityLabel,shortcut:p.
shortcut?`Shift+Alt+${p.shortcut}`:void 0}}}),f=[n==="floating"?"Floating window":"Tiled window",s.active?"active":void 0,
s.alwaysOnTop?"always on top":void 0,s.groupId?`group ${s.groupId}`:void 0].filter(Boolean).join(", ");return{id:e,title:t,
placement:n,state:s.state,rect:Ee(r),titleBarRect:{column:r.column,row:r.row,width:Math.max(0,r.width),height:r.height>0?
1:0},clientRect:ih(r,1),active:s.active,alwaysOnTop:s.alwaysOnTop,groupId:s.groupId,zIndex:o,controls:h,titleAdornments:a,
semantic:{id:`${e}:window`,role:"window",label:t,description:f,selected:s.active}}}#x(e,t){const n=e.windows.filter(o=>o.
state==="minimized"&&o.declaredVisible);let r=new Map;if(t&&t.width>0&&t.height>0){const o=Jc(this.#w,{row:t.row,column:t.
column,width:t.width,entries:n.map(s=>({id:s.id,title:s.title??s.id}))});r=new Map(o.buttons.map(s=>[s.id,Ee(s.rect)]))}
return n.map((o,s)=>({id:o.id,title:o.title??o.id,active:o.active,placement:o.placement,rect:r.get(o.id),command:{kind:"\
restore",id:o.id},semantic:{id:`${o.id}:shelf`,role:"button",label:`Restore ${o.title??o.id}`,positionInSet:s+1,setSize:n.
length}}))}#b(e,t){const n=this.#A(e,t);if(!n)return;const r=new Map(e.windows.map(s=>[s.id,s])),o=n.ids.flatMap((s,a)=>{
const c=r.get(s);if(!c)return[];const d=a===n.selectedIndex;return[{id:s,title:c.title??s,selected:d,state:c.state,semantic:{
id:`${s}:switcher`,role:"option",label:c.title??s,selected:d,positionInSet:a+1,setSize:n.ids.length}}]});return{selectedIndex:Math.
min(n.selectedIndex,Math.max(0,o.length-1)),items:o,semantic:{id:"window-switcher",role:"listbox",label:"Windows"}}}#N(e,t){
const n=this.interactions.inspect();if(!n.snapOnRelease)return;const r=n.active;if(!r||r.mode!=="move"||r.updateCount===
0)return;const o=ls({column:r.current.column,row:r.current.row},e,n.snapDistance,n.snapEdgeSpanRatio,n.snapCornerReach);
if(!o)return;const s=t.windows.find(c=>c.id===r.windowId);if(!s||s.groupId)return;const a=sh(o,e,s);return a?{windowId:r.
windowId,target:o,rect:a}:void 0}#$(e,t){const n=this.interactions.handlePointer(e,t);return n.status==="committed"?this.#P():
n.handled&&this.#E(),{status:n.status==="failed"?"failed":n.status==="blocked"?"blocked":n.status==="disposed"?"disposed":
n.handled?"applied":"ignored",handled:n.handled,interaction:n,reason:n.reason}}#U(e,t,n){const r=t.coordinates.cell;let o;
try{if(o=this.windowHistory.beginGesture({action:"resize",id:e.splitId,parameters:{pointer:t.pointerId}}),o.inspect().state!==
"active")return A("blocked",!1,e.command,void 0,void 0,o.inspect().reason);this.capture.capture(t.pointerId,this.#f)}catch(s){
return pe(()=>o?.cancel()),A("blocked",!1,e.command,void 0,void 0,Me(s))}return this.#l={pointerId:t.pointerId,splitId:e.
splitId,direction:e.direction,startPointerColumn:r.x,startPointerRow:r.y,startSeparatorColumn:e.rect.column,startSeparatorRow:e.
rect.row,delta:0,options:eh(n),gesture:o},this.#E(),A("applied",!0,e.command,void 0,void 0,"separator-resize-started")}#j(e,t){
const n=this.#l,r={kind:"resize-split",splitId:n.splitId,delta:0};if(e.pointerId!==n.pointerId)return A("blocked",!1,r,void 0,
void 0,"another-pointer-owns-separator-resize");if(this.capture.captureOwner(n.pointerId)!==this.#f)return this.#O()&&this.#E(),
A("blocked",!1,r,void 0,void 0,"separator-pointer-capture-lost");if(e.kind==="cancel")return this.#O()&&this.#E(),A("app\
lied",!0,r,void 0,void 0,"separator-resize-cancelled");if(e.kind!=="move"&&e.kind!=="up")return A("ignored",!1,r,void 0,
void 0,"separator-resize-event-ignored");let o;const s=e.coordinates.cell;if(s){const d=(n.direction==="row"?s.x-n.startPointerColumn:
s.y-n.startPointerRow)-n.delta;if(d!==0){if(o=this.controller.resize(n.splitId,d,t,n.options),!o.ok){const l=o.reason;return this.#O(),
this.#E(),A("blocked",!0,{...r,delta:d},o,void 0,l)}if(o.status==="applied"){const l=this.controller.project(t,n.options).
workspace.separators.find(u=>u.splitId===n.splitId);if(!l)return this.#O(),this.#E(),A("blocked",!0,{...r,delta:n.delta},
o,void 0,"separator-disappeared-during-resize");n.delta=n.direction==="row"?l.rect.column-n.startSeparatorColumn:l.rect.
row-n.startSeparatorRow}}}if(e.kind==="move")return o?.status==="applied"&&this.#E(),A(o?.status==="applied"?"applied":"\
unchanged",!0,{...r,delta:n.delta},o);let a=!1;try{a=n.gesture.commit()}catch(c){return pe(()=>this.capture.release(n.pointerId,
this.#f)),this.#l=void 0,A("failed",!0,{...r,delta:n.delta},o,void 0,Me(c))}return pe(()=>this.capture.release(n.pointerId,
this.#f)),this.#l=void 0,a?this.#P():this.#E(),A(a?"applied":"unchanged",!0,{...r,delta:n.delta},o,void 0,"separator-res\
ize-committed")}#O(){const e=this.#l;if(!e)return!1;this.#l=void 0;let t=!1;try{t=e.gesture.cancel()}finally{this.capture.
disposed||pe(()=>this.capture.release(e.pointerId,this.#f))}return t}#M(){return this.#l!==void 0||this.interactions.inspect().
active!==void 0}#W(e){const t=new Set(e.windows.map(a=>a.id));for(const a of this.#d.keys())t.has(a)||this.#d.delete(a);
for(const a of this.#u.keys())t.has(a)||this.#u.delete(a);this.#w.buttons.length=0,this.#w.items.length=0,this.#w.placements.
length=0;const n=this.#h;if(!n)return;const r=n.ids[n.selectedIndex],o=n.ids.filter(a=>t.has(a));if(o.length===0){this.#h=
void 0;return}const s=r===void 0?-1:o.indexOf(r);this.#h={ids:o,selectedIndex:s>=0?s:0}}#C(e,t){return t.status==="appli\
ed"?this.#P():t.ok&&this.#E(),A(t.status==="applied"?"applied":t.status==="unchanged"?"unchanged":t.status==="disposed"?
"disposed":t.status==="invalid"?"invalid":"blocked",t.ok,e,t,void 0,t.reason)}#B(e,t,n){const r=this.controller.inspect(),
o=this.#T(r,n);if(o.length===0)return A("blocked",!1,e,void 0,void 0,"no-focusable-windows");const s=o.findIndex(d=>d.id===
r.activeWindowId),a=s<0?e.direction>0?0:o.length-1:(s+e.direction+o.length)%o.length,c=o[a];return c.state==="minimized"&&
this.execute({kind:"restore",id:c.id},t,n),this.execute({kind:"focus",id:c.id},t,n)}#k(e,t,n){const r=this.controller.inspect(),
o=this.#T(r,n).map(s=>s.id);if(o.length===0)return this.#h=void 0,A("blocked",!1,t,void 0,void 0,"no-switcher-windows");
if(this.#h){const s=this.#h.ids[this.#h.selectedIndex],a=o.indexOf(s??""),c=a>=0?a:Math.max(0,o.indexOf(r.activeWindowId??
""));this.#h={ids:o,selectedIndex:(c+e+o.length)%o.length}}else{const s=Math.max(0,o.indexOf(r.activeWindowId??""));this.#h=
{ids:o,selectedIndex:(s+e+o.length)%o.length}}return this.#E(),A("applied",!0,t)}#S(e,t,n){const r=this.controller.inspect(),
o=this.#A(r,n),s=o?.ids[o.selectedIndex];if(this.#h=void 0,this.#E(),!s)return A("unchanged",!1,e,void 0,void 0,"switche\
r-is-closed");const a=this.#T(r,n).find(c=>c.id===s);return a?(a.state==="minimized"&&this.execute({kind:"restore",id:s},
t,n),this.execute({kind:"focus",id:s},t,n)):A("blocked",!1,e,void 0,void 0,"switcher-window-not-visible")}#T(e,t){const n=t.
visibleWindowIds?new Set(t.visibleWindowIds):void 0;return e.windows.filter(r=>r.declaredVisible&&r.state!=="closed"&&(r.
placement==="floating"||!n||n.has(r.id))).sort((r,o)=>o.focusOrder-r.focusOrder||r.id.localeCompare(o.id))}#A(e,t){const n=this.#h;
if(!n)return;const r=this.#T(e,t).map(c=>c.id);if(r.length===0){this.#h=void 0;return}const o=n.ids[n.selectedIndex],s=r.
indexOf(o??""),a=r.indexOf(e.activeWindowId??"");return this.#h={ids:r,selectedIndex:s>=0?s:a>=0?a:0},this.#h}#I(e,t){const n=this.
controller.inspect().windows.filter(s=>s.placement==="floating"&&s.declaredVisible&&s.state!=="minimized"&&s.state!=="cl\
osed");let r;try{r=this.windowHistory.beginGesture({action:"recover-bounds",parameters:{all:1}})}catch(s){return A("bloc\
ked",!1,e,void 0,void 0,Me(s))}if(r.inspect().state!=="active")return A("blocked",!1,e,void 0,void 0,r.inspect().reason);
let o=!1;try{for(const a of n){const c=this.controller.recoverBounds(a.id,t,{titleBarHeight:1});if(!c.ok)return r.cancel(),
A("blocked",!1,e,c,void 0,c.reason);o||=c.status==="applied"}const s=r.commit();return o||s?this.#P():this.#E(),A(o?"app\
lied":"unchanged",o,e)}catch(s){try{r.cancel()}catch{}return A("failed",!1,e,void 0,void 0,Me(s))}}#Y(e){const t=e.id??this.
controller.inspect().activeWindowId;if(!t)return A("blocked",!1,e,void 0,void 0,"no-active-window");let n;try{n=this.windowHistory.
beginGesture({action:"set-placement",id:t,parameters:{placement:"floating",restore:1}})}catch(r){return A("blocked",!1,e,
void 0,void 0,Me(r))}if(n.inspect().state!=="active")return A("blocked",!1,e,void 0,void 0,n.inspect().reason);try{const r=this.
controller.restore(t);if(!r.ok)return n.cancel(),A("blocked",!1,e,r,void 0,r.reason);const o=this.controller.setPlacement(
t,"floating");if(!o.ok)return n.cancel(),A("blocked",!1,e,o,void 0,o.reason);const s=r.status==="applied"||o.status==="a\
pplied",a=n.commit();return s||a?this.#P():this.#E(),A(s?"applied":"unchanged",s,e,o)}catch(r){try{n.cancel()}catch{}return A(
"failed",!1,e,void 0,void 0,Me(r))}}#P(){this.commitRevision.value=this.commitRevision.peek()+1,this.#E()}#E(){this.viewRevision.
value=this.viewRevision.peek()+1}#L(e){if(this.#c)throw new Error(`Workbench window host is disposed; cannot ${e}.`)}}function Zl(i,e,t,n){
if(e!=="config")return e==="maximize"?{kind:"maximize",id:i}:e==="restore"?t==="tiled"&&n==="maximized"?{kind:"restore-f\
loating",id:i}:{kind:"restore",id:i}:e==="minimize"?{kind:"minimize",id:i}:e==="close"?{kind:"close",id:i}:{kind:"toggle\
-always-on-top",id:i}}function Ql(i){const e=i.axis==="column"?"horizontally":"vertically";return{splitId:i.splitId,direction:i.
direction,axis:i.axis,ratio:i.ratio,bounds:Ee(i.bounds),firstRect:Ee(i.firstRect),rect:Ee(i.rect),hitRect:Ee(i.hitRect),
secondRect:Ee(i.secondRect),command:{kind:"resize-split",splitId:i.splitId,delta:1},semantic:{id:`${i.splitId}:separator`,
role:"separator",label:`Resize split ${e}`,description:`Drag ${e} to resize adjacent tiled windows`}}}function A(i,e,t,n,r,o){
return{status:i,handled:e,command:t,action:n,interaction:r,reason:o}}function Lt(i){return typeof i=="number"&&Number.isFinite(
i)&&i>0}function Ee(i){return{column:i.column,row:i.row,width:i.width,height:i.height}}function eh(i){return{gap:i.gap,separatorHitSize:i.
separatorHitSize,compactMode:i.compactMode,visibleWindowIds:i.visibleWindowIds?[...i.visibleWindowIds]:void 0}}function th(i,e){
const r=Math.max(1,127-e.length);return`${i.slice(0,r)}:${e}`}function pe(i){try{i()}catch{}}function ih(i,e){return{column:i.
column+Math.min(e,Math.max(0,i.width)),row:i.row+Math.min(e,Math.max(0,i.height)),width:Math.max(0,i.width-e*2),height:Math.
max(0,i.height-e*2)}}const nh=250;function li(i){return i==="top"||i==="bottom"}function rh(i){return i==="left"||i==="r\
ight"||i==="top"||i==="bottom"?i:i==="up"?"top":i==="down"?"bottom":void 0}function oh(i,e){return{columns:i==="left"?-e:
i==="right"?e:0,rows:i==="top"?-e:i==="bottom"?e:0}}function sh(i,e,t){if(i.kind==="dock"||e.width<=0||e.height<=0)return;
const n=Math.max(1,Math.ceil(e.width/2)),r=Math.max(1,Math.floor(e.width/2)),o=Math.max(1,Math.ceil(e.height/2)),s=Math.
max(1,Math.floor(e.height/2)),a=i.kind==="workspace"?i.edge==="right":i.corner==="top-right"||i.corner==="bottom-right",
c=i.kind==="workspace"?i.edge==="bottom":i.corner==="bottom-left"||i.corner==="bottom-right";let d=i.kind==="workspace"&&
(i.edge==="top"||i.edge==="bottom")?e.width:a?r:n,l=i.kind==="workspace"&&(i.edge==="left"||i.edge==="right")?e.height:c?
s:o;return d=Math.max(t.minWidth??1,Math.min(t.maxWidth??1e6,d)),l=Math.max(t.minHeight??1,Math.min(t.maxHeight??1e6,l)),
{column:a?e.column+e.width-d:e.column,row:c?e.row+e.height-l:e.row,width:d,height:l}}function Me(i){return i instanceof Error&&
Array.from(i.message,t=>{const n=t.charCodeAt(0);return n<=31||n===127?" ":t}).join("").trim().slice(0,256)||"window-hos\
t-operation-failed"}function co(i){return()=>i}const hi=new Map,ah=4096;function jn(i){const e=i.codePointAt(0);if(e===void 0||
e<128)return 1;const t=hi.get(i);if(t!==void 0)return t;const n=ke(i)>1?2:1;return hi.size>=ah&&hi.clear(),hi.set(i,n),n}
function Bn(i,e){const t=Math.max(0,Math.floor(e));if(t===0)return"";let n=0;for(const c of i)n+=jn(c);if(n<=t)return i;
const r=t>3?"...":"",o=t-r.length;let s="",a=0;for(const c of i){const d=jn(c);if(a+d>o)break;s+=c,a+=d}return s+r}function ch(i,e,t,n){
for(let r=0;r<e.height;r+=1)for(let o=0;o<e.width;o+=1){const s=e.column+o,a=e.row+r;i.write(s,a," ",{foreground:t,background:n(
s,a)})}}function lo(i,e,t,n,r,o){const s=[...n];for(let a=0;a<s.length;a+=1)i.write(e+a,t,s[a],{foreground:r.foreground,
background:o(e+a,t),bold:r.bold})}function dh(i,e,t,n,r,o){if(e.width<=0||e.height<=0)return;const s=e.column+e.width-1,
a=e.row+e.height-1,c=(d,l,u)=>{i.cell(d,l,u,{foreground:n,background:r(d,l),bold:o})};for(let d=e.column+1;d<s;d+=1)c(d,
e.row,t.top),c(d,a,t.bottom);for(let d=e.row+1;d<a;d+=1)c(e.column,d,t.left),c(s,d,t.right);c(e.column,e.row,t.topLeft),
c(s,e.row,t.topRight),c(e.column,a,t.bottomLeft),c(s,a,t.bottomRight)}function lh(i,e,t){i.fill(e.rect," ",t.surfaceFill),
dh(i,e.rect,t.borderGlyphs,t.borderForeground,t.chromeGround,e.active),ch(i,e.titleBarRect,t.titleBarFillForeground,t.titleBarGround);
const n=e.controls.reduce((o,s)=>Math.min(o,s.rect.column),e.titleBarRect.column+e.titleBarRect.width),r=Math.max(0,n-e.
titleBarRect.column-2);lo(i,e.titleBarRect.column+1,e.titleBarRect.row,Bn(t.titleText,r),{foreground:t.titleForeground,bold:t.
titleBold},t.titleBarGround);for(const o of e.controls)lo(i,o.rect.column,o.rect.row,Bn(o.text,o.rect.width),{foreground:t.
controlForeground,bold:t.controlBold(o)},t.titleBarGround)}function hh(i,e,t,n,r=0){const o=[];let s=e.column;const a=e.
column+e.width-r;for(const c of t){const d=` ${c.label} `,l=[...d].reduce((u,h)=>u+jn(h),0);if(s+l>=a)break;i.write(s,e.
row,d,c.active?n.activeTab:c.dimmed?n.dimmedTab:n.tab),o.push({id:c.id,rect:{column:s,row:e.row,width:l,height:1}}),s+=l+
1}return o}const uh=Object.freeze({topLeft:"╔",top:"═",topRight:"╗",left:"║",right:"║",bottomLeft:"╚",bottom:"\
═",bottomRight:"╝"}),fh=Object.freeze({topLeft:"┌",top:"─",topRight:"┐",left:"│",right:"│",bottomLeft:"└",
bottom:"─",bottomRight:"┘"}),ph="peercompute-atlas-demo:",wh="peercompute.atlas.return.v1",ln=9,hn=18;function ms(){
try{const i=new URLSearchParams(window.location.search);if(i.get("embedded")==="1"||i.get("embed")==="1"||window.name&&window.
name.startsWith(ph)||window.self!==window.top)return!0}catch{return!0}return!1}function mh(){try{if(window.parent&&window.
parent!==window)return window.parent.postMessage(wh,"*"),!0}catch{}return!1}function ye(i=[14,21,34]){return`rgb(${i[0]}\
, ${i[1]}, ${i[2]})`}function gh(i,e,t){const n=Array.from({length:e},()=>Array.from({length:i},()=>({char:" ",background:t})));
return{frame:n,surface:{cell(o,s,a,c={}){const d=Math.floor(o),l=Math.floor(s);l<0||l>=e||d<0||d>=i||(n[l][d]={char:a||"\
 ",foreground:c.foreground,background:c.background??t,bold:!!c.bold})},write(o,s,a,c={}){const d=Math.floor(s);if(d<0||d>=
e)return;let l=Math.floor(o);for(const u of String(a??"")){if(l>=i)break;l>=0&&(n[d][l]={char:u,foreground:c.foreground,
background:c.background??t,bold:!!c.bold}),l+=1}},fill(o,s,a={}){if(!o)return;const c=Math.max(0,Math.floor(o.column)),d=Math.
max(0,Math.floor(o.row)),l=Math.min(i,Math.floor(o.column+o.width)),u=Math.min(e,Math.floor(o.row+o.height));for(let h=d;h<
u;h+=1)for(let f=c;f<l;f+=1)n[h][f]={char:s||" ",foreground:a.foreground,background:a.background??t,bold:!!a.bold}}}}}function ho(i,e,t,n=0,r=!1){
const o=i.column/e.columns,s=(i.column+i.width)/e.columns,a=i.row/e.rows,c=(i.row+i.height)/e.rows;if(!n)return{left:t.left+
o*t.width,top:t.top+a*t.height,width:Math.max(0,(s-o)*t.width),height:Math.max(0,(c-a)*t.height)};function d(m,M){const I=2*
m-1,E=2*M-1,$=n*(I*I+E*E);let F=1;for(let L=0;L<4;L+=1){const G=$*F*F;F-=((1-n+G)*F-1)/(1-n+3*G)}return{x:(1+I*F)/2,y:(1+
E*F)/2}}const l=[o,Math.max(o,Math.min(.5,s)),s],u=[a,Math.max(a,Math.min(.5,c)),c],h=r?Math.min:Math.max,f=r?Math.max:Math.
min,p=h(...u.map(m=>d(o,m).x)),w=f(...u.map(m=>d(s,m).x)),g=h(...l.map(m=>d(m,a).y)),R=f(...l.map(m=>d(m,c).y));return{left:t.
left+p*t.width,top:t.top+g*t.height,width:Math.max(0,(w-p)*t.width),height:Math.max(0,(R-g)*t.height)}}function vh(i,e){
const t=i.left+i.width,n=i.top+i.height,r=Math.max(i.left,e.left),o=Math.max(i.top,e.top),s=Math.min(t,e.left+e.width),a=Math.
min(n,e.top+e.height);return s<=r||a<=o?[i]:[{left:i.left,top:i.top,width:i.width,height:o-i.top},{left:i.left,top:a,width:i.
width,height:n-a},{left:i.left,top:o,width:r-i.left,height:a-o},{left:s,top:o,width:t-s,height:a-o}].filter(c=>c.width>.5&&
c.height>.5)}function uo(i){let e=document.head.querySelector("style[data-vibeslopdb-theme-css]");e||(e=document.createElement(
"style"),e.setAttribute("data-vibeslopdb-theme-css","1"),document.head.append(e)),e.textContent=`.vs-scope, .vs-models-h\
ost, .vs-models-dialog {
  --vs-bg: ${ye(i.background)};
  --vs-surface: ${ye(i.surface)};
  --vs-surface-strong: ${ye(i.surfaceStrong)};
  --vs-border: ${ye(i.border)};
  --vs-text: ${ye(i.text)};
  --vs-muted: ${ye(i.muted)};
  --vs-accent: ${ye(i.accent)};
  --vs-accent-fg: ${ye(po(i))};
  --vs-success: ${ye(i.success)};
  --vs-warning: ${ye(i.warning)};
  --vs-danger: ${ye(i.danger)};
}`}function yh({surfaceElement:i,stageLayerElement:e,initialThemeId:t="matrix",embedded:n=ms(),onThemeChange:r,onWindowClosed:o}={}){
let s=sr(t);uo(s);let a=!1,c=null,d=!1,l=0,u=!1,h=!0,f="",p=[];const w=new Map;let g=[];const R=new Cc({gap:0}),m=new Jl(
{workspace:R,windows:[],snapOnRelease:!0});function M(){if(!c)return{column:0,row:0,width:140,height:42};const b=c.size();
return{column:0,row:0,width:Math.max(20,b.columns),height:Math.max(8,b.rows-1)}}function I(){if(!c)return{column:0,row:42,
width:140,height:1};const b=c.size();return{column:0,row:Math.max(0,b.rows-1),width:Math.max(20,b.columns),height:1}}function E(){
return g.map(b=>w.get(b)?.descriptor).filter(Boolean)}function $(){m.reconcileWindows(E()),h=!0,f=""}function F(b,O){const T=document.
createElement("section");T.className="vs-win-stage",T.dataset.windowId=b,T.setAttribute("aria-label",O);const _=document.
createElement("div");_.className="vs-win-content";const K=document.createElement("button");return K.type="button",K.className=
"vs-win-focus-shield",K.setAttribute("aria-label",`Focus ${O}`),K.hidden=!0,K.addEventListener("pointerdown",X=>{X.stopPropagation(),
y(b)}),T.addEventListener("pointerdown",()=>{m.controller.inspect().activeWindowId!==b&&y(b)},{capture:!0}),T.append(_,K),
e.append(T),{stage:T,content:_,shield:K}}function L({id:b,title:O,tabLabel:T,placement:_="tiled",floatingRect:K,minWidth:X=24,
minHeight:ne=8,closable:le=!1,onMount:xe}){if(w.has(b))return y(b),w.get(b);const me={id:b,title:O,placement:_,minWidth:X,
minHeight:ne,...K?{floatingRect:K}:{}},{stage:ge,content:V,shield:z}=F(b,O),Y={id:b,descriptor:me,tabLabel:T||O,stage:ge,
content:V,shield:z,closable:le};return w.set(b,Y),g.push(b),$(),typeof xe=="function"&&xe(V,Y),y(b),U(),Y}function G(b,O){
const T=w.get(b);T&&(T.descriptor.title=O,T.stage.setAttribute("aria-label",O),$())}function v(b){const O=w.get(b);O&&(O.
stage.remove(),w.delete(b),g=g.filter(T=>T!==b),$(),o?.(b))}function y(b){if(!w.has(b))return;const O=m.controller.inspect().
windows.find(T=>T.id===b);O&&(O.state==="minimized"||O.state==="closed")&&m.execute({kind:"restore",id:b},M()),m.execute(
{kind:"focus",id:b},M()),h=!0,U()}function x(){const b=M(),O=g.filter(T=>w.has(T));for(const T of O)m.execute({kind:"res\
tore",id:T},b),m.execute({kind:"set-placement",id:T,placement:"tiled"},b);O.length>=2&&m.execute({kind:"dock",id:O[1],targetId:O[0],
edge:"right",ratio:.48},b),O.length>=3&&m.execute({kind:"dock",id:O[2],targetId:O[0],edge:"bottom",ratio:.44},b),O.length>=
4&&m.execute({kind:"dock",id:O[3],targetId:O[1],edge:"bottom",ratio:.42},b);for(let T=4;T<O.length;T+=1)m.execute({kind:"\
dock",id:O[T],targetId:O[2],edge:"bottom",ratio:.5},b);O.length>0&&m.execute({kind:"focus",id:O[0]},b),h=!0,f="",U()}function D(){
const b=M(),O=g.filter(K=>w.has(K)),T=Math.max(36,Math.floor(b.width*.62)),_=Math.max(14,Math.floor(b.height*.64));O.forEach(
(K,X)=>{const ne=Math.min(Math.max(1,b.width-T-1),2+X*5),le=Math.min(Math.max(1,b.height-_-1),1+X*2);m.execute({kind:"re\
store",id:K},b),m.execute({kind:"set-placement",id:K,placement:"floating",rect:{column:ne,row:le,width:T,height:_}},b)}),
O.length&&m.execute({kind:"focus",id:O[O.length-1]},b),h=!0,f="",U()}function C(b){s=sr(b),uo(s),h=!0,f="",r?.(s),U()}function N(b){
if(a=!!b,c?.shader)try{c.shader.setEnabled(a?["crt"]:[])}catch{}h=!0,f="",U()}function B(){if(!c?.host?.element)return;const b=c.
size(),O=c.host.element,T=`${b.columns*ln}px`,_=`${b.rows*hn}px`;O.style.width!==T&&(O.style.width=T),O.style.height!==_&&
(O.style.height=_)}function H(b){if(d||!c){e.classList.add("is-fallback-grid");for(const z of w.values())z.stage.hidden=
!1,z.stage.style.cssText="",z.shield.hidden=!0;return}B();const O=c.size(),T=!!(a&&c.shader?.isPresenting?.()),K=(T?i:c.
host?.element||i).getBoundingClientRect(),X=e.getBoundingClientRect(),ne={left:K.left-X.left,top:K.top-X.top,width:K.width,
height:K.height},le=T&&c.shader?.enabled?.().includes("crt")?c.shader.option("crt","curve")??0:0,xe=m.controller.inspect();
for(const z of xe.windows)if(z.state==="closed"&&w.get(z.id)?.closable){v(z.id);return}const me=[O.columns,O.rows,Math.round(
ne.left),Math.round(ne.top),Math.round(ne.width),Math.round(ne.height),s.id,le,...b.windows.map(z=>`${z.id}:${z.active}:${z.
placement}:${z.zIndex}:${z.rect.column},${z.rect.row},${z.rect.width},${z.rect.height}:${z.clientRect.column},${z.clientRect.
row},${z.clientRect.width},${z.clientRect.height}`)].join("|");if(me===f)return;f=me;const ge=b.windows.map(z=>ho(z.rect,
O,ne,le,!0)),V=new Set;for(let z=0;z<b.windows.length;z+=1){const Y=b.windows[z],ae=w.get(Y.id);if(!ae)continue;V.add(Y.
id);const oe=ho(Y.clientRect,O,ne,le,!1),Bi=oe.width<24||oe.height<18,$e=ge.slice(z+1).reduce((Li,Ge)=>Li.flatMap(vs=>vh(
vs,Ge)),[oe]),rr=$e.length===0;ae.stage.hidden=Bi||rr,ae.stage.style.left=`${oe.left.toFixed(1)}px`,ae.stage.style.top=`${oe.
top.toFixed(1)}px`,ae.stage.style.width=`${oe.width.toFixed(1)}px`,ae.stage.style.height=`${oe.height.toFixed(1)}px`,ae.
stage.style.zIndex=String(10+z),ae.stage.classList.toggle("is-active",Y.active);const gs=$e.length===1&&Math.abs($e[0].left-
oe.left)<.5&&Math.abs($e[0].top-oe.top)<.5&&Math.abs($e[0].width-oe.width)<.5&&Math.abs($e[0].height-oe.height)<.5;if(rr)
ae.stage.style.clipPath="inset(50%)";else if(gs)ae.stage.style.clipPath="";else{const Li=$e.map(Ge=>`M${(Ge.left-oe.left).
toFixed(1)},${(Ge.top-oe.top).toFixed(1)}h${Ge.width.toFixed(1)}v${Ge.height.toFixed(1)}h${(-Ge.width).toFixed(1)}Z`);ae.
stage.style.clipPath=`path("${Li.join(" ")}")`}ae.shield.hidden=Y.active||Y.placement==="tiled"}for(const[z,Y]of w.entries())
V.has(z)||(Y.stage.hidden=!0)}function J(){if(!c||u)return;const b=c.size();if(b.columns<10||b.rows<6)return;const O=M(),
T=I(),_=m.project(O,{shelfBounds:T,doubleClickMaximizeMs:320}),{frame:K,surface:X}=gh(b.columns,b.rows,s.background);for(let V=0;V<
O.height;V+=2)for(let z=0;z<O.width;z+=4)X.cell(z,V,"·",{foreground:s.surfaceStrong,background:s.background});for(const V of _.
separators){const z=V.axis==="column"?"│":"─";X.fill(V.rect,z,{foreground:s.border,background:s.background})}const ne=po(
s);for(const V of _.windows){const z=V.active,Y=z?s.accent:s.border,ae=z?s.accent:s.surfaceStrong,oe=z?ne:s.text,Bi=V.placement===
"floating"?"◈":"▪";lh(X,V,{surfaceFill:{foreground:s.text,background:s.surface},borderGlyphs:z?uh:fh,borderForeground:Y,
chromeGround:co(s.surface),titleBarGround:co(ae),titleBarFillForeground:oe,titleText:`${Bi} ${V.title}`,titleForeground:oe,
titleBold:z,controlBold:$e=>z||$e.tone==="danger",controlForeground:oe})}if(_.snapPreview){const V=_.snapPreview.rect;for(let z=V.
column;z<V.column+V.width;z+=1)X.cell(z,V.row,"░",{foreground:s.warning,background:s.background}),X.cell(z,V.row+V.height-
1,"░",{foreground:s.warning,background:s.background})}X.fill(T," ",{foreground:s.muted,background:s.surfaceStrong});const le=m.
controller.inspect(),xe=g.map(V=>{const z=w.get(V),Y=le.windows.find(ae=>ae.id===V);return!z||!Y?null:{id:V,label:`${Y.state===
"minimized"?"▽ ":Y.state==="closed"?"○ ":""}${z.tabLabel||z.descriptor.title}`,active:Y.id===le.activeWindowId&&Y.state!==
"minimized"&&Y.state!=="closed",dimmed:Y.state==="minimized"||Y.state==="closed"}}).filter(Boolean),me=` ${n?"EMBEDDED":
"STANDALONE"} · ExoWebTUI · ${s.label} `;p=hh(X,T,xe,{activeTab:{foreground:ne,background:s.accent,bold:!0},tab:{foreground:s.
text,background:s.surface},dimmedTab:{foreground:s.muted,background:s.background}},me.length+1);const ge=Math.max(0,T.width-
me.length);X.write(ge,T.row,Bn(me,T.width-ge),{foreground:s.muted,background:s.surfaceStrong}),c.present(K),H(_),h=!1}function U(){
if(!u){if(d){H(null);return}try{J()}catch(b){console.warn("[ExoWebTUI] Falling back to CSS grid layout:",b),d=!0,H(null)}}}
const Z=[];function de(b){if(u||d)return;const O=M(),T=I();if(b.kind==="down"&&b.coordinates?.cell){const{x:_,y:K}=b.coordinates.
cell;if(K===T.row){for(const X of p)if(_>=X.rect.column&&_<X.rect.column+X.rect.width){y(X.id);return}}}m.handlePointer(
b,O,{shelfBounds:T,doubleClickMaximizeMs:320}),h=!0,U()}const S=()=>e.classList.remove("is-shell-dragging"),P=()=>e.classList.
add("is-shell-dragging");i.addEventListener("pointerdown",P,{capture:!0}),window.addEventListener("pointerup",S,{capture:!0}),
window.addEventListener("pointercancel",S,{capture:!0}),window.addEventListener("blur",S);function ie(){i.style.width="",
i.style.height="";try{c=Ec({root:i,storeDatabase:"vibeslopdb-exowebtui",host:{platformOptions:{textInput:"target"},sinkOptions:{
cellWidth:ln,cellHeight:hn,font:"13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"}}}),B(),N(!1);const b=()=>{
if(!c?.host?.platform?.size)return;const ge=i.getBoundingClientRect(),V=Math.max(1,Math.floor(ge.width/ln)),z=Math.max(1,
Math.floor(ge.height/hn)),Y=c.host.platform.size.peek();(V!==Y.columns||z!==Y.rows)&&(Y.columns=V,Y.rows=z)},O=()=>{u||d||
(b(),B(),c?.host?.canvas?.rerenderAll?.(),h=!0,f="",U())};let T=0;const _=()=>{clearTimeout(T),T=window.setTimeout(O,24)};
Z.push(c.onPointer(ge=>de(ge))),Z.push(c.onResize(()=>{B(),c?.host?.canvas?.rerenderAll?.(),h=!0,f="",U()}));const K=new ResizeObserver(
()=>_());i.parentElement&&K.observe(i.parentElement),K.observe(i),window.addEventListener("resize",_);const X=window.visualViewport;
X?.addEventListener("resize",_),X?.addEventListener("scroll",_);let ne=null;const le=()=>{u||typeof window.matchMedia!="\
function"||(ne?.removeEventListener?.("change",xe),ne=window.matchMedia(`(resolution: ${window.devicePixelRatio||1}dppx)`),
ne.addEventListener?.("change",xe))},xe=()=>{_(),le()};le(),Z.push(()=>{clearTimeout(T),K.disconnect(),window.removeEventListener(
"resize",_),X?.removeEventListener("resize",_),X?.removeEventListener("scroll",_),ne?.removeEventListener?.("change",xe)});
const me=()=>{u||(h&&U(),l=requestAnimationFrame(me))};l=requestAnimationFrame(me)}catch(b){console.warn("[ExoWebTUI] we\
bPresenter unavailable, using CSS terminal fallback:",b),d=!0}}return ie(),{addWindow:L,removeWindow:v,focusWindow:y,setWindowTitle:G,
tileAll:x,cascadeAll:D,setTheme:C,setCrtEnabled:N,renderNow:U,isEmbedded:()=>n,isFallback:()=>d,getTheme:()=>s,getThemes:()=>Rs,
getWindowIds:()=>[...g],getActiveWindowId:()=>m.controller.inspect().activeWindowId,getWindowRects:()=>d||!c?[]:m.project(
M(),{shelfBounds:I()}).windows.map(O=>({id:O.id,title:O.title,placement:O.placement,active:O.active,rect:O.rect,clientRect:O.
clientRect})),dispose(){if(!u){u=!0,cancelAnimationFrame(l),i.removeEventListener("pointerdown",P,{capture:!0}),window.removeEventListener(
"pointerup",S,{capture:!0}),window.removeEventListener("pointercancel",S,{capture:!0}),window.removeEventListener("blur",
S);for(const b of Z)b();m.dispose(),c?.dispose?.();for(const b of w.values())b.stage.remove();w.clear()}}}}async function bh(){
const i=ms(),e=new URLSearchParams(window.location.search),t=Ms({docName:"vibeslopdb-local-state-v1"});await t.init();const n=t.
getAllPrefs(),r=e.get("engine"),o=e.get("starter"),s=e.get("theme"),a=["sqlite","pglite","indexeddb"].includes(r)?r:["sq\
lite","pglite","indexeddb"].includes(n.engineId)?n.engineId:"sqlite",c=o?null:t.loadDatabaseSnapshot(a),d=ot[o]?o:ot[c?.
starterId]?c.starterId:ot[n.starterId]?n.starterId:"startup_prod",l=s||n.themeId||"matrix",u=!i&&!!n.crtEnabled,h=n.yoloMode!==
!1,f=document.getElementById("btn-atlas-return"),p=document.getElementById("cap-badge"),w=document.getElementById("btn-n\
ew-query"),g=document.getElementById("btn-tile"),R=document.getElementById("btn-cascade"),m=document.getElementById("btn\
-peers"),M=document.getElementById("btn-models"),I=document.getElementById("theme-select"),E=document.getElementById("bt\
n-crt"),$=document.getElementById("exotui-surface"),F=document.getElementById("stage-layer");i&&(document.documentElement.
classList.add("is-embedded"),f.hidden=!1,f.addEventListener("click",()=>{mh()}));const L=new Ss({engineId:a,starterId:d}),
G=Ts({sessionManager:L,onCapabilitiesReady:S=>{const P=S?.tier||"unknown",ie=S?.cpu?.cores??S?.cpu?.logicalCores??navigator.
hardwareConcurrency??0,O=!!(S?.webgpu?.available||S?.gpu?.webgpu)?S?.webgpu?.adapter?.architecture||S?.webgpu?.adapter?.
vendor||S?.gpu?.adapterInfo?.vendor||"WebGPU":"CPU-only";p.textContent=`HW: ${P} · ${ie}c · ${O}`,p.title=JSON.stringify(
{tier:P,cpu:S?.cpu,webgpu:S?.webgpu},null,2)}});let v=null,y=null,x=null;const D=new Map;let C=0;const N=yh({surfaceElement:$,
stageLayerElement:F,initialThemeId:l,embedded:i,onThemeChange:S=>{t.setPref("themeId",S.id),v?.refresh({autoFit:!1})},onWindowClosed:S=>{
const P=D.get(S);P&&(P.dispose(),D.delete(S))}});for(const S of N.getThemes()){const P=document.createElement("option");
P.value=S.id,P.textContent=S.label,I.append(P)}I.value=N.getTheme().id,I.addEventListener("change",()=>{N.setTheme(I.value)});
let B=u;B&&(N.setCrtEnabled(!0),E.textContent="CRT: ON",E.classList.add("is-active")),E.addEventListener("click",()=>{B=
!B,N.setCrtEnabled(B),t.setPref("crtEnabled",B),E.textContent=B?"CRT: ON":"CRT: OFF",E.classList.toggle("is-active",B)});
function H(){const S=D.values().next().value;return S||J({initialSql:""})}function J({initialSql:S="",placement:P="tiled",
autoRun:ie=!1}={}){const b=++C,O=`query-${b}`,T=`SQL Query #${b}`;let _=null;return N.addWindow({id:O,title:T,tabLabel:`\
Query #${b}`,placement:P,minWidth:28,minHeight:10,closable:b>1,floatingRect:P==="floating"?{column:10+b%4*4,row:4+b%4*2,
width:64,height:22}:void 0,onMount:K=>{_=$s({container:K,sessionManager:L,initialSql:S,windowLabel:T}),D.set(O,_)}}),P===
"tiled"&&b>1&&N.tileAll(),ie&&_&&_.runSql(),_}N.addWindow({id:"schema",title:"Mermaid ER Schema (Live · Draggable)",tabLabel:"\
Schema ER",placement:"tiled",minWidth:32,minHeight:12,onMount:S=>{v=Os({container:S,sessionManager:L,getTheme:()=>N.getTheme(),
onOffsetsChange:P=>{t.setPref("diagramOffsets",P)},onSelectEntityQuery:P=>{const ie=H();ie.setSql(P),N.focusWindow(D.keys().
next().value),ie.runSql()}}),n.diagramOffsets&&v.stage.setCustomOffsets(n.diagramOffsets)}}),N.addWindow({id:"chat",title:"\
YOLO DBA Chat (PeerCompute LLM)",tabLabel:"YOLO Chat",placement:"tiled",minWidth:32,minHeight:12,onMount:S=>{y=Es({container:S,
sessionManager:L,aiBridge:G,initialYoloMode:h,onYoloChange:P=>{t.setPref("yoloMode",!!P)},onOpenModels:()=>{G.openModelsModal(
{managementOnly:!0})},onSendToQuery:P=>{H().setSql(P),N.focusWindow(D.keys().next().value)},onShowQueryResult:(P,ie)=>{H().
showExternalResult(P,ie)}})}}),J({initialSql:ot[d]?.defaultQuery||"",placement:"tiled"}),N.addWindow({id:"carnage",title:"\
Carnage Log · DB Engines · Time-Travel",tabLabel:"Carnage Log",placement:"tiled",minWidth:30,minHeight:10,onMount:S=>{
x=Cs({container:S,sessionManager:L,getPersistedSnapshot:P=>t.loadDatabaseSnapshot(P),onCopyMermaid:async()=>{const P=v?.
stage?.getMermaidSource()||"";if(!P)return!1;try{return await navigator.clipboard.writeText(P),!0}catch{return!1}},onReplaySql:P=>{
H().setSql(P),N.focusWindow(D.keys().next().value)},onEngineSwitched:(P,ie,{restored:b=!1}={})=>{if(t.setPref("engineId",
P),t.setPref("starterId",ie),!b){const O=ot[ie]?.defaultQuery||"",T=H();T.setSql(O),O&&!O.startsWith("--")&&T.runSql()}}})}}),
N.tileAll(),w.addEventListener("click",()=>{J({initialSql:`-- Independent query window
SELECT * FROM users LIMIT 10;`,placement:"floating"})}),g.addEventListener("click",()=>N.tileAll()),R.addEventListener("\
click",()=>N.cascadeAll()),m?.addEventListener("click",()=>{G.getModelStatus().networkConnected?G.refreshPeersNow():G.connectPeerNetwork()}),
G.subscribe(S=>{m&&(S.peerConnecting?(m.textContent="🌐 Connecting…",m.disabled=!0):S.networkConnected?(m.disabled=!1,
m.classList.add("is-active"),m.textContent=`🌐 Peers: ${S.peerCount} (${S.hostedModelCount} models)`):(m.disabled=!1,m.
classList.remove("is-active"),m.textContent="🌐 Connect Peers"))}),M.addEventListener("click",()=>{G.openModelsModal({
managementOnly:!0})}),(e.get("peers")==="1"||e.get("autoconnect")==="1")&&G.connectPeerNetwork(),window.addEventListener(
"keydown",S=>{if(!S.altKey)return;const P=S.key.toLowerCase();P==="n"?(S.preventDefault(),w.click()):P==="t"?(S.preventDefault(),
N.tileAll()):P==="m"&&(S.preventDefault(),G.openModelsModal({managementOnly:!0}))});let U=0;async function Z(){clearTimeout(
U),U=0;const S=L.getState();t.setPref("engineId",S.engineId),t.setPref("starterId",S.starterId);const P=await L.exportCurrentSnapshot();
P&&t.saveDatabaseSnapshot(S.engineId,{starterId:S.starterId,snapshot:P})}function de(){clearTimeout(U),U=window.setTimeout(
()=>{Z()},200)}if(L.subscribe(S=>{S.type==="schema-updated"&&S.reason!=="state-restore"&&de()}),G.initCapabilities(),await L.
init(a,d,{persistedSnapshot:c?.snapshot||null}),await v.refresh({autoFit:!0}),c?.snapshot){const S=L.getState().schema.tables[0]?.
name;S&&await H().runSql(`SELECT * FROM "${S}" LIMIT 25;`,"RESTORE")}else{const S=ot[d]?.defaultQuery||"";S&&!S.startsWith(
"--")&&await H().runSql(S,"SEED")}window.__vibeslopdb={embedded:i,localStore:t,persistNow:Z,sessionManager:L,aiBridge:G,
desktop:N,schemaWin:v,chatWin:y,carnageWin:x,queryWindows:D,spawnQueryWindow:J},window.addEventListener("pagehide",()=>{
Z(),G.dispose(),L.dispose(),t.dispose(),N.dispose(),zs()})}bh();
