/*! Built from Exotui 8637fcc39d19959550ca179fe91c258766c2fa62. See exowebtui-LICENSE.txt. */
var Tn,Ii=0;async function Ai(n,e,t){for(;Ii!==0;)await Promise.resolve();++Ii,Tn=n;try{t.call(e)}catch(r){throw Ii=0,r}Tn=void 0,--Ii}function kl(n,e=n){for(let t of e)"dependencies"in t?(n.delete(t),kl(n,t.dependencies)):n.add(t)}var Rn=Symbol("reactive"),Jn=Symbol("original_ref"),Eo=Symbol("connected_signal");function ny(n){return n instanceof Object&&Rn in n}function Ih(n,e,t=!1){Object.defineProperties(n,{[Rn]:{value:!0},[Jn]:{value:n},[Eo]:{value:e}});let r=n.set.bind(n),o;t?o=function(c,u){let h=n.get(c);return r(c,u),u!==h&&e.propagate(),n}:o=function(c,u){let{size:h}=n;return r(c,u),n.size>h&&e.propagate(),n};let i=n.delete.bind(n);function a(d){let c=i(d);return c&&e.propagate(),c}let s=n.clear.bind(n);function l(){let{size:d}=n;s(),d>0&&e.propagate()}return Object.defineProperties(n,{set:{value:o},delete:{value:a},clear:{value:l}}),n}function Ah(n,e){Object.defineProperties(n,{[Rn]:{value:!0},[Jn]:{value:n},[Eo]:{value:e}});let t=n.add.bind(n);function r(l){let{size:d}=n;return t(l),n.size>d&&e.propagate(),n}let o=n.delete.bind(n);function i(l){let d=o(l);return d&&e.propagate(),d}let a=n.clear.bind(n);function s(){let{size:l}=n;a(),l>0&&e.propagate()}return Object.defineProperties(n,{add:{value:r},delete:{value:i},clear:{value:s}}),n}function ry(n,e,t=!1){if(Object.defineProperties(n,{[Rn]:{value:!0},[Jn]:{value:n},[Eo]:{value:e}}),t)return Ht(n,e,!0);let r=n.push.bind(n);function o(...f){let p=r(...f);return p>0&&e.propagate(),p}let i=n.pop.bind(n);function a(){let{length:f}=n,p=i();return f>0&&e.propagate(),p}let s=n.splice.bind(n);function l(f,p,...m){let g=s(f,p,...m);return(g.length>0||m.length>0)&&e.propagate(),g}let d=Array.prototype.sort.bind(n);function c(f){let p=d(f);return e.propagate(),p}let u=Array.prototype.reverse.bind(n);function h(){let f=u();return e.propagate(),f}return Object.defineProperties(n,{push:{value:o},pop:{value:a},splice:{value:l},sort:{value:c},reverse:{value:h}}),n}function Ht(n,e,t=!1){if(typeof n!="object")throw new Error("parameter object needs to be typeof 'object'");if(Array.isArray(n)){if(ry(n,e),!t)return n}else ny(n)||Object.defineProperties(n,{[Rn]:{value:!0},[Jn]:{value:n},[Eo]:{value:e}});if(t){let o={set(i,a,s){return i[a]!==(i[a]=s)&&e.propagate(),!0}};return new Proxy(n,o)}let r={};Object.defineProperties(r,{[Rn]:{value:!0},[Jn]:{value:n},[Eo]:{value:e}});for(let o in n)Object.defineProperty(r,o,{enumerable:!0,get(){return n[o]},set(i){n[o]!==(n[o]=i)&&e.propagate()}});return r}var Ml=class extends Error{constructor(){super("You can only deeply observe value with typeof 'object'")}},Tl=class extends Error{path;constructor(e){super(`Recursive signal propagation detected: ${e.join(" -> ")}`),this.name="SignalRecursiveUpdateError",this.path=[...e]}},oy=32,Io=new Map,Sl=[],iy=0,ay=!1,sy=new Set;var Ee=class{$value;dependants;subscriptions;whenSubscriptions;forceUpdateValue;disposed=!1;constructor(e,t){if(t?.deepObserve){if(typeof e!="object")throw new Ml;e instanceof Set?e=Ah(e,this):e instanceof Map?e=Ih(e,this,t.watchMapUpdates):e=Ht(e,this,t.watchObjectIndex)}this.$value=e}when(e,t,r){this.whenSubscriptions??=new Map;let{whenSubscriptions:o}=this,i=o.get(e);i?i.add(t):(i=new Set().add(t),o.set(e,i)),r?.addEventListener("abort",()=>{i?.delete(t)})}drop(e,t){this.whenSubscriptions?.get(e)?.delete(t)}subscribe(e,t){this.subscriptions??=new Set,this.subscriptions.add(e),t?.addEventListener("abort",()=>{this.subscriptions?.delete(e)})}unsubscribe(e){this.subscriptions?.delete(e)}inspect(){return{disposed:this.disposed,subscriptions:this.subscriptions?.size??0,whenSubscriptions:[...this.whenSubscriptions?.values()??[]].reduce((e,t)=>e+t.size,0),dependants:this.dependants?.size??0,reactive:typeof this.$value=="object"&&this.$value!==null&&Rn in this.$value}}depend(e){this.dependants??=new Set,this.dependants.add(e)}propagate(e){if(iy>0&&!ay){sy.add(this);return}let t=ly(this),{subscriptions:r,whenSubscriptions:o,dependants:i}=this;try{let a=this.$value;if(r?.size)for(let l of r)l(a);let s=o?.get(a);if(s)for(let l of s)l(a);if(!i?.size)return;for(let l of i)"forceUpdateValue"in l&&(l.forceUpdateValue=!0),l.update(e??this)}finally{t()}}dispose(){let{$value:e}=this;this.disposed=!0,typeof e=="object"&&e!==null&&(e=e?.[Jn]??e),this.$value=e,Object.defineProperty(this,"value",{value:e});let{dependants:t,subscriptions:r,whenSubscriptions:o}=this;if(r?.clear(),o?.clear(),!!t)for(let i of[...t])t.delete(i),i.dependencies.delete(this),i.dependencies||i.dispose()}get value(){return Tn?.add(this),this.$value}set value(e){Tn?.add(this),(this.$value!==(this.$value=e)||this.forceUpdateValue)&&this.propagate()}peek(){return this.$value}jink(e){this.$value=e}valueOf(){return this.$value}toString(){return`${this.$value}`}};function ly(n){let e=Io.get(n)??0;if(e>=oy)throw new Tl([...Sl,n].map(dy));return Io.set(n,e+1),Sl.push(n),()=>{Sl.pop();let t=(Io.get(n)??1)-1;t<=0?Io.delete(n):Io.set(n,t)}}function dy(n){return n.constructor?.name||"unknown"}var Oi=class extends Error{constructor(){super("Computed is read-only, you can't (and shouldn't!) directly modify its value")}},sn=class extends Ee{computable;dependencies;constructor(e){super(void 0);let t=e(this);super.value=t,this.computable=e,this.dependencies=new Set,Ai(this.dependencies,this,e).then(()=>{for(let r of this.dependencies)r.depend(this)})}get value(){return Tn?.add(this),this.$value}set value(e){throw new Oi}jink(e){throw new Oi}update(e){Tn?.add(this),(this.$value!==(this.$value=this.computable(e))||this.forceUpdateValue)&&this.propagate(e)}dispose(){super.dispose();let{dependencies:e}=this;for(let t of[...e])t.dependants?.delete(this),e.delete(t)}};var Rl=class extends Error{constructor(){super("Cannot update an effect while it is paused."),this.name="EffectPausedUpdateError"}},Ao=class{$effectable;dependencies;paused;constructor(e){this.$effectable=e,this.dependencies=new Set,this.paused=!1,Ai(this.dependencies,this,e).then(()=>{for(let t of this.dependencies)t.dependants?.delete(this);if(kl(this.dependencies),!this.paused)for(let t of this.dependencies)t.depend(this)})}update(e){if(this.paused)throw new Rl;this.$effectable(e)}dispose(){let{dependencies:e}=this;for(let t of e)t.dependants?.delete(this);e.clear()}pause(){this.paused=!0;for(let e of this.dependencies)e.dependants?.delete(this)}resume(){this.paused=!1;for(let e of this.dependencies)e.depend(this)}};function Oh(n){return{column:Math.floor(n.column),row:Math.floor(n.row),width:Math.max(0,Math.floor(n.width)),height:Math.max(0,Math.floor(n.height))}}function Oo(n,e,t,r,o){n.column=e,n.row=t,n.width=r,n.height=o}var No=1,_l=class{state;gap;#e;#t;#i=1;#r=new Map;constructor(e={}){let t=Vi(e.layout??{});this.#t=new Cl(Di(e.gap)),this.gap=this.#t;let r=e.windows===void 0?Dh(t,e.activeWindowId):Lo(t,e.windows,{activeWindowId:e.activeWindowId});this.#e=new El(r,(o,i)=>{this.#s(o,i)}),this.state=this.#e,this.#o(this.state.peek())}windowIds(){return Zn(this.state.peek().root).map(e=>e.windowId)}windowRegistrationGeneration(e){return this.#r.get(e)}reconcile(e,t={}){let r=Lo(this.state.peek(),e,t);return this.#o(r),this.#n(r),this.inspect()}focus(e){let t=Bt(this.state.peek().root,e);return!t||this.state.peek().activePaneId===t.id?t!==void 0:(this.#n({...this.state.peek(),activePaneId:t.id}),!0)}activatePane(e){let t=bt(this.state.peek().root,e);return!t||this.state.peek().activePaneId===t.id?t!==void 0:(this.#n({...this.state.peek(),activePaneId:t.id}),!0)}remove(e){let t=this.state.peek(),r=Bt(t.root,e);if(!r)return!1;let o=Pi(t.root,r.id),i=t.activePaneId?bt(o,t.activePaneId):void 0,a={root:o,activePaneId:i?.id??Er(o)?.id};return this.#o(a),this.#n(a),!0}move(e,t){if(!Number.isFinite(t)||Math.trunc(t)===0)return!1;let r=this.state.peek(),o=Zn(r.root),i=o.findIndex(d=>d.windowId===e);if(i<0||o.length<2)return!1;let a=Math.max(0,Math.min(o.length-1,i+Math.trunc(t)));if(a===i)return!1;let s=o[i],l=[...o];return l.splice(i,1),l.splice(a,0,s),this.#n({root:Pl(r.root,l,{value:0}),activePaneId:s.id}),!0}swap(e,t){if(e===t)return!1;let r=this.state.peek(),o=Bt(r.root,e),i=Bt(r.root,t);return!o||!i?!1:(this.#n({root:gy(r.root,o.id,i.id),activePaneId:o.id}),!0)}dock(e,t,r,o={}){if(e===t)return!1;let i=this.state.peek(),a=Bt(i.root,e),s=Bt(i.root,t);if(!a||!s)return!1;let l=Pi(i.root,a.id),d=bt(l,s.id);if(!l||!d)return!1;let c=r==="left"||r==="top",u=Hl(o.ratio??.5),h={kind:"split",id:Bh("split",l),direction:r==="left"||r==="right"?"row":"column",ratio:c?u:1-u,first:Qe(c?a:d),second:Qe(c?d:a)};return this.#n({root:Ni(l,d.id,h),activePaneId:a.id}),!0}setSplitRatio(e,t){let r=this.state.peek(),o=Hl(t),i=Wl(r.root,e,o);return i.changed?(this.#n({...r,root:i.node}),!0):!1}resizeSplitRatio(e,t){let r=Wi(this.state.peek().root,e);return!r||!Number.isFinite(t)||t===0?!1:this.setSplitRatio(e,r.ratio+t)}resizeSplit(e,t,r,o={}){if(!Number.isFinite(t)||Math.trunc(t)===0)return!1;let a=this.layout(r,o).separators.find(p=>p.splitId===e),s=Wh(this.state.peek(),o.visibleWindowIds),l=Wi(s.root,e);if(!a||!l)return!1;let d=l.direction==="row"?a.firstRect.width+a.secondRect.width:a.firstRect.height+a.secondRect.height;if(d<=0)return!1;let c=l.direction==="row"?a.firstRect.width:a.firstRect.height,u=Qn(l.first,o.gap??this.gap.peek()),h=Qn(l.second,o.gap??this.gap.peek()),f=zh(d,c+Math.trunc(t),l.direction==="row"?u.width:u.height,l.direction==="row"?h.width:h.height);return f===c?!1:this.setSplitRatio(e,f/d)}layout(e,t={}){return uy(this.state.peek(),e,{...t,gap:t.gap??this.gap.peek()})}inspect(){let e=Hh(this.state.peek()),t=Zn(e.root),r=e.activePaneId?bt(e.root,e.activePaneId):void 0;return{layout:e,activePaneId:r?.id,activeWindowId:r?.windowId,windows:t.map(by),count:t.length}}snapshot(){return Lh({version:No,gap:this.gap.peek(),layout:this.state.peek()})}restore(e,t){let r=Lh(e),o=t===void 0?r.layout:Lo(r.layout,t);this.#o(o);let i=this.gap.peek(),a=this.#t.externalMutationRevision;this.#t.jinkOwned(r.gap);try{this.#n(o)}finally{i!==r.gap&&this.#t.externalMutationRevision===a&&this.gap.peek()===r.gap&&this.gap.propagate()}return this.inspect()}dispose(){this.#r.clear(),this.state.dispose(),this.gap.dispose()}#o(e){let t=new Set(Zn(e.root).map(r=>r.windowId));for(let r of[...this.#r.keys()])t.has(r)||this.#r.delete(r);for(let r of t)if(!this.#r.has(r)){if(!Number.isSafeInteger(this.#i))throw new RangeError("Tiled workspace registration generation space exhausted.");this.#r.set(r,this.#i++)}}#s(e,t){let r=new Map(this.#r),o=this.#i;for(let i of[...r.keys()])t.byId.has(i)||r.delete(i);for(let[i,a]of t.byId)if(!(e.byId.get(i)===a&&r.has(i))){if(!Number.isSafeInteger(o))throw new RangeError("Tiled workspace registration generation space exhausted.");r.set(i,o++)}this.#r=r,this.#i=o}#n(e){this.#e.publishOwned(e)}},Cl=class extends Ee{#e=0;get value(){return super.value}set value(e){this.#t(),super.value=e}jink(e){this.#t(),super.jink(e)}get externalMutationRevision(){return this.#e}jinkOwned(e){super.jink(e)}#t(){this.#e=this.#e===Number.MAX_SAFE_INTEGER?0:this.#e+1}},El=class extends Ee{#e;#t=new WeakMap;#i;constructor(e,t){super(e),this.#e=t,this.$value=this.#r(e),this.#i=_n(this.peek())}get value(){return super.value}set value(e){let t=this.#r(e),r=_n(t);this.#e(this.#i,r),this.#i=r;try{super.value=t}finally{this.#i=_n(this.peek())}}jink(e){let t=this.#r(e),r=_n(t);this.#e(this.#i,r),this.#i=r,super.jink(t)}propagate(){try{this.#o(this.peek());let e=_n(this.peek());this.#e(this.#i,e),this.#i=e}catch(e){let t=this.#r(this.#i.rollback);throw super.jink(t),this.#i=_n(t),e}super.propagate()}publishOwned(e){let t=this.#r(e);this.#i=_n(t);try{super.value=t}finally{this.#i=_n(this.peek())}}#r(e){if(this.#t.get(e))return this.#o(e),e;let r={...e};r.root&&(r.root=this.#s(r.root));let o=Ht(r,this,!0);return this.#t.set(o,r),o}#o(e){if(!e.root)return;let t=this.#t.get(e)??e;t.root=this.#s(e.root)}#s(e){let t=this.#t.get(e);if(t){if(e.kind==="split"){let i=t;i.first=this.#s(e.first),i.second=this.#s(e.second)}return e}let r={...e};r.kind==="split"&&(r.first=this.#s(r.first),r.second=this.#s(r.second));let o=Ht(r,this);return this.#t.set(o,r),o}};function _n(n){let e=Zn(n.root),t=new Map;for(let r of e){let o=Cr(r.windowId);if(!o||o!==r.windowId)throw new TypeError("Tiled workspace pane window ids must be non-empty normalized strings.");if(t.has(o))throw new TypeError(`Tiled workspace contains duplicate window id ${JSON.stringify(o)}.`);t.set(o,r)}return{byId:t,rollback:Hh(n)}}function Nh(n={}){return new _l(n)}function Lh(n){return{version:No,gap:Di(n.gap),layout:Vi(n.layout)}}function Vi(n={},e,t={}){let r=new Set,o=new Set,i=Li(n.root,r,o),a={root:i,activePaneId:n.activePaneId&&bt(i,n.activePaneId)?n.activePaneId:Er(i)?.id};return e===void 0?Dh(a,t.activeWindowId):Vh(a,e,t)}function Lo(n,e,t={}){return Vh(Vi(n),e,t)}function Qn(n,e=1){if(!n)return{width:0,height:0};if(n.kind==="pane")return{width:Ph(n.minWidth),height:Ph(n.minHeight)};let t=Qn(n.first,e),r=Qn(n.second,e),o=Di(e);return n.direction==="row"?{width:t.width+o+r.width,height:Math.max(t.height,r.height)}:{width:Math.max(t.width,r.width),height:t.height+o+r.height}}function uy(n,e,t={}){let r=Wh(n,t.visibleWindowIds),o=Oh(e),i=Di(t.gap),a=Qn(r.root,i),s=r.activePaneId?bt(r.root,r.activePaneId):void 0,l={bounds:Bl(o),minimumSize:a,fitsMinimumSize:o.width>=a.width&&o.height>=a.height,activePaneId:s?.id,activeWindowId:s?.windowId,panes:[],separators:[]};return r.root&&Ll(r.root,o,i,yy(t.separatorHitSize),r.activePaneId,l),l}function Wh(n,e){let t=Vi(n);if(e===void 0)return t;let r=new Set;for(let a of e){let s=Cr(a);s&&r.add(s)}let o=Il(t.root,r),i=t.activePaneId?bt(o,t.activePaneId):void 0;return{root:o,activePaneId:i?.id??Er(o)?.id}}function Il(n,e){if(!n)return;if(n.kind==="pane")return e.has(n.windowId)?Qe(n):void 0;let t=Il(n.first,e),r=Il(n.second,e);return!t||!r?t??r:{...n,first:t,second:r}}function Vh(n,e,t){let r=hy(e),o=new Map(r.map(c=>[c.id,c])),i=Al(n.root,o,new Set),a=new Set(Zn(i).map(c=>c.windowId)),s=r.filter(c=>!a.has(c.id));if(!i&&s.length>0)i=Ol(s,0,{value:1});else for(let c of s)i=fy(i,$h(c));i=Li(i,new Set,new Set);let l=t.activeWindowId?Bt(i,t.activeWindowId):void 0,d=n.activePaneId?bt(i,n.activePaneId):void 0;return{root:i,activePaneId:l?.id??d?.id??Er(i)?.id}}function Dh(n,e){let t=e?Bt(n.root,e):void 0,r=n.activePaneId?bt(n.root,n.activePaneId):void 0;return{root:n.root?Ft(n.root):void 0,activePaneId:t?.id??r?.id??Er(n.root)?.id}}function Li(n,e,t){if(!n||n.kind!=="pane"&&n.kind!=="split")return;if(n.kind==="pane"){let i=Cr(n.windowId);return!i||t.has(i)?void 0:(t.add(i),{kind:"pane",id:zl(Cr(n.id)||`pane-${Fh(i)}`,e),windowId:i,minWidth:Po(n.minWidth),minHeight:Po(n.minHeight)})}let r=Li(n.first,e,t),o=Li(n.second,e,t);return!r||!o?r??o:{kind:"split",id:zl(Cr(n.id)||"split",e),direction:n.direction==="column"?"column":"row",ratio:Hl(n.ratio),first:r,second:o}}function hy(n){let e=[],t=new Set;for(let r of n){let o=Cr(r.id);!o||t.has(o)||(t.add(o),e.push({id:o,minWidth:Po(r.minWidth),minHeight:Po(r.minHeight)}))}return e}function Al(n,e,t){if(!n)return;if(n.kind==="pane"){let i=e.get(n.windowId);return!i||t.has(i.id)?void 0:(t.add(i.id),{...Qe(n),minWidth:i.minWidth,minHeight:i.minHeight})}let r=Al(n.first,e,t),o=Al(n.second,e,t);return!r||!o?r??o:{...n,first:r,second:o}}function Ol(n,e,t){if(n.length===1)return $h(n[0]);let r=Math.ceil(n.length/2),o=Ol(n.slice(0,r),e+1,t),i=Ol(n.slice(r),e+1,t),a=`split-${t.value}`;return t.value+=1,{kind:"split",id:a,direction:e%2===0?"row":"column",ratio:r/n.length,first:o,second:i}}function fy(n,e){if(!n)return e;let t=Zn(n).at(-1),r=Dl(n,t.id),o={kind:"split",id:Bh("split",n),direction:r?.direction==="row"?"column":"row",ratio:.5,first:Qe(t),second:e};return Ni(n,t.id,o)}function Ll(n,e,t,r,o,i){if(n.kind==="pane"){i.panes.push({pane:Qe(n),windowId:n.windowId,rect:Bl(e),active:n.id===o});return}let a=my(n,e,t,r);i.separators.push(a),Ll(n.first,a.firstRect,t,r,o,i),Ll(n.second,a.secondRect,t,r,o,i)}function my(n,e,t,r){let o=n.direction==="row"?e.width:e.height,i=Math.min(t,Math.max(0,o-1)),a=Math.max(0,o-i),s=Qn(n.first,t),l=Qn(n.second,t),d=Math.floor(a*n.ratio),c=zh(a,d,n.direction==="row"?s.width:s.height,n.direction==="row"?l.width:l.height),u=Math.max(0,a-c),h,f,p;return n.direction==="row"?(h={...e,width:c},f={column:e.column+c,row:e.row,width:i,height:e.height},p={column:f.column+i,row:e.row,width:u,height:e.height}):(h={...e,height:c},f={column:e.column,row:e.row+c,width:e.width,height:i},p={column:e.column,row:f.row+i,width:e.width,height:u}),{splitId:n.id,direction:n.direction,axis:n.direction==="row"?"column":"row",ratio:a<=0?0:c/a,bounds:Bl(e),firstRect:h,rect:f,hitRect:py(e,f,n.direction,r),secondRect:p}}function py(n,e,t,r){if(t==="row"){let s=Math.min(n.width,Math.max(e.width,r));if(s<=0)return{column:n.column,row:n.row,width:0,height:n.height};let l=e.column+e.width/2;return{column:Math.max(n.column,Math.min(n.column+n.width-s,Math.floor(l-s/2))),row:n.row,width:s,height:n.height}}let o=Math.min(n.height,Math.max(e.height,r));if(o<=0)return{column:n.column,row:n.row,width:n.width,height:0};let i=e.row+e.height/2,a=Math.max(n.row,Math.min(n.row+n.height-o,Math.floor(i-o/2)));return{column:n.column,row:a,width:n.width,height:o}}function zh(n,e,t,r){if(n<=0)return 0;let o=Math.max(0,Math.floor(t)),i=Math.max(0,Math.floor(r));if(o+i<=n)return Math.max(o,Math.min(n-i,Math.floor(e)));let a=o+i;return a<=0?Math.max(0,Math.min(n,Math.floor(e))):Math.max(0,Math.min(n,Math.round(n*o/a)))}function Pi(n,e){if(!n)return;if(n.kind==="pane")return n.id===e?void 0:Qe(n);let t=Pi(n.first,e),r=Pi(n.second,e);return!t||!r?t??r:{...n,first:t,second:r}}function Ni(n,e,t){return n.kind==="pane"?n.id===e?Ft(t):Qe(n):{...n,first:Ni(n.first,e,t),second:Ni(n.second,e,t)}}function gy(n,e,t){if(!n)return;let r=bt(n,e),o=bt(n,t);return!r||!o?Ft(n):Nl(n,r,o)}function Pl(n,e,t){if(n){if(n.kind==="pane"){let r=e[t.value];return t.value+=1,Qe(r||n)}return{...n,first:Pl(n.first,e,t)??Ft(n.first),second:Pl(n.second,e,t)??Ft(n.second)}}}function Nl(n,e,t){return n.kind==="pane"?n.id===e.id?Qe(t):n.id===t.id?Qe(e):Qe(n):{...n,first:Nl(n.first,e,t),second:Nl(n.second,e,t)}}function Wl(n,e,t){if(!n||n.kind==="pane")return{node:n,changed:!1};if(n.id===e)return n.ratio===t?{node:Ft(n),changed:!1}:{node:{...n,ratio:t},changed:!0};let r=Wl(n.first,e,t);if(r.changed)return{node:{...n,first:r.node??n.first},changed:!0};let o=Wl(n.second,e,t);return o.changed?{node:{...n,second:o.node??n.second},changed:!0}:{node:Ft(n),changed:!1}}function Zn(n){let e=[];return Vl(n,e),e}function Vl(n,e){if(n){if(n.kind==="pane"){e.push(n);return}Vl(n.first,e),Vl(n.second,e)}}function bt(n,e){if(n)return n.kind==="pane"?n.id===e?n:void 0:bt(n.first,e)??bt(n.second,e)}function Bt(n,e){if(n)return n.kind==="pane"?n.windowId===e?n:void 0:Bt(n.first,e)??Bt(n.second,e)}function Wi(n,e){if(!(!n||n.kind==="pane"))return n.id===e?n:Wi(n.first,e)??Wi(n.second,e)}function Dl(n,e){if(!(!n||n.kind==="pane"))return n.first.kind==="pane"&&n.first.id===e||n.second.kind==="pane"&&n.second.id===e?n:Dl(n.first,e)??Dl(n.second,e)}function Er(n){if(n)return n.kind==="pane"?n:Er(n.first)}function $h(n){return{kind:"pane",id:`pane-${Fh(n.id)}`,windowId:n.id,minWidth:n.minWidth,minHeight:n.minHeight}}function by(n){return{id:n.windowId,minWidth:n.minWidth,minHeight:n.minHeight}}function Hh(n){return{root:n.root?Ft(n.root):void 0,activePaneId:n.activePaneId}}function Ft(n){return n.kind==="pane"?Qe(n):{kind:"split",id:n.id,direction:n.direction,ratio:n.ratio,first:Ft(n.first),second:Ft(n.second)}}function Qe(n){return{kind:"pane",id:n.id,windowId:n.windowId,minWidth:n.minWidth,minHeight:n.minHeight}}function Bl(n){return{column:n.column,row:n.row,width:n.width,height:n.height}}function zl(n,e){let t=n,r=2;for(;e.has(t);)t=`${n}-${r}`,r+=1;return e.add(t),t}function Bh(n,e){let t=new Set;return $l(e,t),zl(n,t)}function $l(n,e){n&&(e.add(n.id),n.kind==="split"&&($l(n.first,e),$l(n.second,e)))}function Cr(n){return typeof n=="string"?n.trim():""}function Fh(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"window"}function Po(n){return Number.isFinite(n)?Math.max(1,Math.floor(n)):void 0}function Ph(n){return Po(n)??1}function Di(n){return Number.isFinite(n)?Math.max(0,Math.floor(n)):1}function yy(n){return Number.isFinite(n)?Math.max(1,Math.floor(n)):1}function Hl(n){return Number.isFinite(n)?Math.max(.05,Math.min(.95,n)):.5}var In=class extends Error{constructor(t,r,o){super(r);this.code=t;this.cause=o;this.name="HistoryStackError"}},Cn=class extends In{constructor(t,r){super("busy",r?`History ${t} is blocked while ${r} is active.`:`History ${t} is blocked by an active transaction.`);this.operation=t;this.activeOperation=r;this.name="HistoryBusyError"}},En=class extends In{constructor(e){super("scope-closed",e),this.name="HistoryScopeError"}},Or=class extends In{constructor(t,r,o){super(r?"poisoned":"operation-failed",r?`History ${t.phase} failed and compensation could not restore a known state.`:`History ${t.phase} failed; compensation restored the prior state.`,o);this.failure=t;this.poisoned=r;this.name="HistoryOperationError"}},$i=class extends In{constructor(t,r){super("transaction-aborted",`History transaction "${t.label}" was rolled back.`,r);this.entry=t;this.name="HistoryTransactionAbortedError"}},jt=class extends In{constructor(t,r){super("poisoned","History is poisoned; call clear() or recoverPoison() before further mutation.",r);this.poison=t;this.name="HistoryPoisonedError"}},Lr=class extends In{constructor(t,r){super("unsafe-replay",`History entry "${t.label}" has an unsafe replay declaration: ${r}.`);this.entry=t;this.name="HistoryReplaySafetyError"}},Pr=Symbol("HistoryStack.composite"),qh=Symbol("HistoryStack.coalesced"),Hi=class{#e=[];#t=[];#i;#r;#o=new WeakMap;#s=[];#n;#a;#l=0;#c=0;#d;constructor(e={}){this.#i=Math.max(1,Math.floor(e.capacity??100)),this.#r=vy(e.coalescing)}get undoDepth(){return this.#e.length}get redoDepth(){return this.#t.length}canUndo(){return!this.#a&&!this.#n&&this.#s.length===0&&this.#e.length>0}canRedo(){return!this.#a&&!this.#n&&this.#s.length===0&&this.#t.length>0}push(e){this.#b("push"),this.#h(Ar(e))}async apply(e){this.#b("apply");let t=Ar(e);this.#n="apply";try{await this.#O(t,"redo","apply"),this.#h(t)}finally{this.#n=void 0}}async undo(){this.#b("undo");let e=this.#e.at(-1);if(!e)return!1;this.#n="undo";try{await this.#O(e,"undo","undo")}finally{this.#n=void 0}return this.#e.pop(),this.#t.push(e),this.#p(),!0}async redo(){this.#b("redo");let e=this.#t.at(-1);if(!e)return!1;this.#n="redo";try{await this.#O(e,"redo","redo")}finally{this.#n=void 0}return this.#t.pop(),this.#e.push(e),this.#p(),!0}markCoalescingBoundary(){this.#b("markCoalescingBoundary"),this.#p()}async transaction(e,t){return this.#b("transaction"),await this.#w(void 0,e,t)}transactionSync(e,t){return this.#b("transactionSync"),this.#x(void 0,e,t)}clear(){this.#f("clear"),this.#e.length=0,this.#t.length=0,this.#a=void 0,this.#d=void 0,this.#p()}recoverPoison(e){if(this.#f("recoverPoison"),e!=="clear-history"&&e!=="retain-history")throw new TypeError(`Unknown history poison recovery policy: ${String(e)}`);return this.#a?(e==="clear-history"&&(this.#e.length=0,this.#t.length=0,this.#d=void 0),this.#a=void 0,this.#p(),!0):!1}isPoisoned(){return this.#a!==void 0}inspect(){let e={canUndo:this.canUndo(),canRedo:this.canRedo(),undoDepth:this.undoDepth,redoDepth:this.redoDepth,nextUndo:ln(this.#e.at(-1)),nextRedo:ln(this.#t.at(-1))},t=this.#s.at(-1);if(t){let r={...Ir(t.options),mode:t.mode,depth:this.#s.length,entryCount:t.entries.length};t.discardRequested&&(r.discardRequested=!0),e.transaction=r}return this.#n&&(e.operation=this.#n),this.#a&&(e.poisoned=yt(this.#a)),this.#d&&(e.replayBarrier=Sy(this.#d)),e}#h(e){if(Zh(e)){this.#u(e);return}let t=this.#t.length>0,r=e.coalesce,o=r&&this.#r?My(this.#r.now):void 0,i=this.#e.at(-1),a=i?this.#o.get(i):void 0,s=e;for(!t&&r&&o!==void 0&&i&&a&&a.key===r.key&&a.boundary===r.boundary&&a.boundarySequence===this.#l&&i.group===e.group&&o>=a.committedAt&&o-a.committedAt<=this.#r.idleIntervalMs?(s=ky(i,e),this.#e[this.#e.length-1]=s):this.#e.push(s),r&&o!==void 0&&this.#o.set(s,{...r,boundarySequence:this.#l,committedAt:o});this.#e.length>this.#i;)this.#e.shift();this.#t.length=0}#u(e){this.#e.length=0,this.#t.length=0;let t=ln(e);t.replaySafety="non-replayable",this.#d={sequence:++this.#c,entry:t},this.#p()}#p(){this.#l+=1}#b(e){if(this.#a)throw new jt(yt(this.#a));if(this.#n)throw new Cn(e,this.#n);if(this.#s.length>0)throw new Cn(e)}#f(e){if(this.#n)throw new Cn(e,this.#n);if(this.#s.length>0)throw new Cn(e)}#g(e,t){if(this.#a)throw new jt(yt(this.#a));if(e.state!=="active"||this.#s.at(-1)!==e)throw new En(`Cannot ${t}: the transaction scope is closed or not current.`);if(e.discardRequested)throw new En(`Cannot ${t}: the transaction scope is marked for discard.`);if(this.#n)throw new Cn(t,this.#n)}#m(e){if(e.state!=="active"||this.#s.at(-1)!==e)throw new En("Cannot discard: the transaction scope is closed or not current.");if(!e.discardRequested){if(this.#n)throw new Cn("discard",this.#n);e.discardRequested=!0}}async#w(e,t,r){e&&this.#g(e,"start a nested transaction");let o=this.#y(e,t,"async"),i=this.#P(o),a,s;try{a=await r(i)}catch(d){s=d}let l=await this.#v(o);if(s===void 0&&l!==void 0&&(s=l),s===void 0&&this.#a&&(s=new jt(yt(this.#a))),s!==void 0&&await this.#k(o,s),o.discardRequested)return await this.#_(o),a;try{this.#A(o)}catch(d){throw o.state==="active"&&this.#s.at(-1)===o&&await this.#k(o,d),d}return a}async#v(e){let t,r=!1;for(;;){let o=[...e.pendingTasks];if(o.length===0){if(r)return t;r=!0,await Promise.resolve();continue}r=!1;let i=await Promise.allSettled(o.map(a=>a.promise));for(let a=0;a<o.length;a+=1){let s=o[a];e.pendingTasks.delete(s);let l=i[a];t===void 0&&l.status==="rejected"&&!s.observed&&(t=l.reason)}}}#x(e,t,r){e&&this.#g(e,"start a nested synchronous transaction");let o=this.#y(e,t,"sync"),i=this.#I(o),a;try{if(a=r(i),Qh(a))throw Promise.resolve(a).catch(Gl),new En("transactionSync callback returned a promise; use transaction() instead.")}catch(s){this.#T(o,s)}return this.#a&&this.#T(o,new jt(yt(this.#a))),o.discardRequested?(this.#C(o),a):(this.#A(o),a)}#y(e,t,r){let i={options:wy(t),mode:r,parent:e,entries:[],pendingTasks:new Set,discardRequested:!1,state:"active"};return this.#s.push(i),i}#P(e){return Object.freeze({depth:this.#s.length,entry:Ir(e.options),get discarded(){return e.discardRequested},push:t=>{this.#g(e,"push"),e.entries.push(Ar(t))},apply:t=>{let r=this.#S(e,t);return Kh(e,r)},discard:()=>{this.#m(e)},transaction:(t,r)=>{this.#g(e,"start a nested transaction");let o=this.#w(e,t,r);return Kh(e,o)},transactionSync:(t,r)=>this.#x(e,t,r)})}async#S(e,t){this.#g(e,"apply");let r=Ar(t);this.#n="transaction-apply";try{await this.#O(r,"redo","transaction-apply"),e.entries.push(r)}finally{this.#n=void 0}}#I(e){return Object.freeze({depth:this.#s.length,entry:Ir(e.options),get discarded(){return e.discardRequested},push:t=>{this.#g(e,"push"),e.entries.push(Ar(t))},apply:t=>{this.#g(e,"apply");let r=Ar(t);this.#n="transaction-apply";try{this.#D(r,"redo","transaction-apply"),e.entries.push(r)}finally{this.#n=void 0}},discard:()=>{this.#m(e)},transaction:(t,r)=>this.#x(e,t,r)})}#A(e){if(this.#g(e,"commit"),e.entries.length===0&&e.options.replaySafety?.strategy!=="non-replayable"){this.#R(e);return}let t=zi(e.options,e.entries);e.parent?e.parent.entries.push(t):this.#h(t),this.#R(e)}async#k(e,t){throw await this.#_(e,t),new $i(Ir(e.options),t)}async#_(e,t){this.#$(e);let r;if(e.entries.length>0){this.#n="transaction-rollback";try{await this.#O(zi(e.options,e.entries),"undo","transaction-rollback")}catch(o){r=o}finally{this.#n=void 0}}if(this.#R(e),r)throw this.#N(e.options,r),new jt(yt(this.#a),r);if(this.#a)throw new jt(yt(this.#a),t)}#T(e,t){throw this.#C(e,t),new $i(Ir(e.options),t)}#C(e,t){this.#$(e);let r;if(e.entries.length>0){this.#n="transaction-rollback";try{this.#D(zi(e.options,e.entries),"undo","transaction-rollback")}catch(o){r=o}finally{this.#n=void 0}}if(this.#R(e),r)throw this.#N(e.options,r),new jt(yt(this.#a),r);if(this.#a)throw new jt(yt(this.#a),t)}#$(e){if(e.state!=="active"||this.#s.at(-1)!==e)throw new En("Cannot abort a transaction while a nested scope is still active.")}#R(e){if(this.#s.at(-1)!==e)throw new En("Transaction scopes must close in nesting order.");this.#s.pop(),e.state="closed"}async#O(e,t,r){let o=Bi(e,t),i=[];for(let a of o)try{await jh(a,t),i.push(a)}catch(s){let l=[],d=[a,...i.slice().reverse()];for(let u of d)try{await jh(u,Uh(t))}catch(h){l.push({entry:ln(u),error:Wo(h)})}let c=Fl(r,t,e,a,s,l);throw l.length>0&&(this.#a=yt({...c,reason:"compensation-failed"})),new Or(c,l.length>0,s)}}#D(e,t,r){let o=Bi(e,t),i=[];for(let a of o)try{Gh(a,t),i.push(a)}catch(s){if(s instanceof Fi){let c=Fl(r,t,e,a,s,[{entry:ln(a),error:Wo(s)}]);throw this.#a=yt({...c,reason:"async-in-sync-scope"}),new Or(c,!0,s)}let l=[];for(let c of[a,...i.slice().reverse()])try{Gh(c,Uh(t))}catch(u){l.push({entry:ln(c),error:Wo(u)})}let d=Fl(r,t,e,a,s,l);throw l.length>0&&(this.#a=yt({...d,reason:"compensation-failed"})),new Or(d,l.length>0,s)}}#N(e,t){if(this.#a)return;let r=Ir(e),o=t instanceof Or?t.failure:{phase:"transaction-rollback",direction:"undo",entry:r,failedEntry:r,error:Wo(t),compensationFailures:[]};this.#a=yt({...o,reason:"rollback-failed"})}};function ln(n){if(!n)return;let e={id:n.id,label:n.label,group:n.group};return n.coalesce&&(e.coalesceKey=n.coalesce.key,n.coalesce.boundary!==void 0&&(e.coalesceBoundary=n.coalesce.boundary)),n.replaySafety&&(e.replaySafety=n.replaySafety.strategy),ji(n)&&(e.composite=!0,e.operationCount=Bi(n,"redo").length),Jh(n)&&(e.coalesced=!0),e}function Ir(n){let e={id:n.id,label:n.label,group:n.group};return n.coalesce&&(e.coalesceKey=n.coalesce.key,n.coalesce.boundary!==void 0&&(e.coalesceBoundary=n.coalesce.boundary)),n.replaySafety&&(e.replaySafety=n.replaySafety.strategy),e}function wy(n){let e=n.label.trim();if(!e)throw new TypeError("History transaction label must not be empty.");return{id:n.id?.trim()||void 0,label:e,group:n.group?.trim()||void 0,coalesce:Yh(n.coalesce),replaySafety:Xh(n.replaySafety,e)}}function vy(n){if(n!==void 0){if(!Number.isFinite(n.idleIntervalMs)||n.idleIntervalMs<0)throw new TypeError("History coalescing idleIntervalMs must be a non-negative finite number.");if(n.now!==void 0&&typeof n.now!="function")throw new TypeError("History coalescing now must be a function.");return{idleIntervalMs:n.idleIntervalMs,now:n.now??Date.now}}}function Yh(n){if(n===void 0)return;if(typeof n!="object"||n===null)throw new TypeError("History coalescing metadata must be an object.");let e=typeof n.key=="string"?n.key.trim():"";if(!e)throw new TypeError("History coalescing key must not be empty.");if(n.boundary!==void 0&&typeof n.boundary!="string")throw new TypeError("History coalescing boundary must be a string when provided.");let t=n.boundary?.trim()||void 0;return t===void 0?{key:e}:{key:e,boundary:t}}function Xh(n,e){if(n===void 0)return;let t={label:e};if(typeof n!="object"||n===null)throw new Lr(t,"metadata must be an object");if(n.sideEffectful!==!0)throw new Lr(t,"sideEffectful must be true");if(!xy(n.strategy))throw new Lr(t,"strategy must be idempotent, compensatable, or non-replayable");return{sideEffectful:!0,strategy:n.strategy}}function Ar(n){let e=typeof n.label=="string"?n.label:String(n.label),t=Xh(n.replaySafety,e);if(t&&(typeof n.undo!="function"||typeof n.redo!="function"))throw new Lr({id:n.id,label:e,group:n.group,replaySafety:t.strategy},"side-effectful entries require both undo and redo callbacks");return{...n,coalesce:Yh(n.coalesce),replaySafety:t,undo:()=>n.undo(),redo:()=>n.redo()}}function xy(n){return n==="idempotent"||n==="compensatable"||n==="non-replayable"}function zi(n,e){let t=e.slice();return{...n,[Pr]:t,async undo(){for(let r=t.length-1;r>=0;r-=1)await t[r].undo()},async redo(){for(let r of t)await r.redo()}}}function ji(n){return Pr in n}function ky(n,e){let t=Jh(n)?[...n[Pr],e]:[n,e];return{...zi({id:e.id,label:e.label,group:e.group,coalesce:e.coalesce,replaySafety:e.replaySafety},t),[qh]:!0}}function Jh(n){return ji(n)&&qh in n}function Zh(n){return n.replaySafety?.strategy==="non-replayable"?!0:ji(n)&&n[Pr].some(Zh)}function Bi(n,e){if(!ji(n))return[n];let t=e==="redo"?n[Pr]:n[Pr].slice().reverse(),r=[];for(let o of t)r.push(...Bi(o,e));return r}async function jh(n,e){await n[e]()}function Gh(n,e){let t=n[e]();if(Qh(t))throw Promise.resolve(t).catch(Gl),new Fi(ln(n))}function Uh(n){return n==="redo"?"undo":"redo"}function Kh(n,e){let t={promise:e,observed:!1};n.pendingTasks.add(t);let r=new jl((o,i)=>{e.then(o,i)},o=>{o&&(t.observed=!0)});return r.silenceUnhandledRejection(),r}var jl=class extends Promise{#e;constructor(e,t){super(e),this.#e=t}then(e,t){return this.#e?.(typeof t=="function"),super.then(e,t)}silenceUnhandledRejection(){super.then(void 0,Gl)}};function Fl(n,e,t,r,o,i){return{phase:n,direction:e,entry:ln(t),failedEntry:ln(r),error:Wo(o),compensationFailures:i}}function Wo(n){if(n instanceof Error)return{name:n.name||"Error",message:n.message};if(typeof n=="string")return{name:"Error",message:n};try{return{name:"Error",message:JSON.stringify(n)??String(n)}}catch{return{name:"Error",message:String(n)}}}function yt(n){return{...n,entry:{...n.entry},failedEntry:{...n.failedEntry},error:{...n.error},compensationFailures:n.compensationFailures.map(e=>({entry:{...e.entry},error:{...e.error}}))}}function Sy(n){return{sequence:n.sequence,entry:{...n.entry}}}function My(n){try{let e=n();return Number.isFinite(e)?e:void 0}catch{return}}function Qh(n){return(typeof n=="object"&&n!==null||typeof n=="function")&&"then"in n&&typeof n.then=="function"}var Fi=class extends Error{constructor(t){super(`History step "${t.label}" returned a promise inside transactionSync.`);this.entry=t;this.name="AsyncHistoryStepInSyncScopeError"}};function Gl(){}var JT=new RegExp("\x1B\\[[0-?]*[ -/]*[@-~]","g");function Gi(n){return n===0?0:55+n*40}function St(n,e){if(n.charCodeAt(e)!==27||n[e+1]!=="[")return;let t=e+2;for(;t<n.length;){let o=n.charCodeAt(t);if(o>=48&&o<=63){t+=1;continue}break}for(;t<n.length;){let o=n.charCodeAt(t);if(o>=32&&o<=47){t+=1;continue}break}let r=n.charCodeAt(t);if(r>=64&&r<=126)return n.slice(e,t+1)}function er(n){return n.split(";")}function Nr(n,e){let t=n[e].split(":"),r=t.length>1,o=Number(r?t[1]:n[e+1]),i=r?1:Math.min(n.length-e,o===2?5:o===5?3:2),a=r?t.slice(2):n.slice(e+2,e+i);if(o===2&&r&&a.length===4){if(a[0]!==""&&a[0]!=="0")return{consumed:i};a.shift()}let s=a.every(d=>/^\d+$/.test(d)&&Number.isSafeInteger(Number(d))),l=d=>Math.max(0,Math.min(255,Number(d)));return s&&o===2&&a.length===3?{consumed:i,rgb:a.map(l)}:s&&o===5&&a.length===1?{consumed:i,palette:l(a[0])}:{consumed:i}}function Vo(n,e){let t={bold:!1,italic:!1,underline:"",underlineColor:[],overline:!1,inverse:!1,foreground:[],background:[],extra:[]};return Ty(t,n),ef(t,e),_y(t)}function Ul(n){return er(n.slice(2,-1)).every(e=>e===""||/^0+$/.test(e))}function Ty(n,e){for(let t=0;t<e.length;){let r=St(e,t);if(!r||!r.endsWith("m")){t+=1;continue}ef(n,r),t+=r.length}}function ef(n,e){let t=er(e.slice(2,-1));for(let r=0;r<t.length;r+=1){let o=t[r],i=o.split(":"),a=Number(i[0]);if(i.length>1&&a===4){i.length===2&&/^[0-5]$/.test(i[1])&&(n.underline=i[1]==="0"?"":i[1]==="1"?"4":o);continue}if(a===38||a===48||a===58){let s=Nr(t,r),l=a===38?n.foreground:a===48?n.background:n.underlineColor;(s.rgb||s.palette!==void 0)&&(l.length=0,l.push(String(a),s.rgb?"2":"5",...(s.rgb??[s.palette]).map(String))),r+=s.consumed-1;continue}if(i.length>1){n.extra.includes(o)||n.extra.push(o);continue}if(a===0){Ry(n);continue}a===1?n.bold=!0:a===22?(n.bold=!1,n.extra=n.extra.filter(s=>s!=="2")):a===3?n.italic=!0:a===23?n.italic=!1:a===4?n.underline="4":a===21?n.underline="4:2":a===24?n.underline="":a===29?n.extra=n.extra.filter(s=>s!=="9"):a===53?n.overline=!0:a===55?n.overline=!1:a===59?n.underlineColor=[]:a===7?n.inverse=!0:a===27?n.inverse=!1:a>=30&&a<=37||a>=90&&a<=97?n.foreground=[String(a)]:a>=40&&a<=47||a>=100&&a<=107?n.background=[String(a)]:a===39?n.foreground=[]:a===49?n.background=[]:Number.isSafeInteger(a)&&a>=0&&!n.extra.includes(o)&&n.extra.push(o)}}function Ry(n){n.bold=!1,n.italic=!1,n.underline="",n.underlineColor=[],n.overline=!1,n.inverse=!1,n.foreground=[],n.background=[],n.extra=[]}function _y(n){let e=[];return n.bold&&e.push("1"),n.italic&&e.push("3"),n.underline&&e.push(n.underline),n.overline&&e.push("53"),n.inverse&&e.push("7"),e.push(...n.foreground,...n.background,...n.underlineColor,...n.extra),e.length?`\x1B[${e.join(";")}m`:""}var tf="deno-tui.unicode-data-pack";var Lt=Object.freeze({maxPacks:32,maxSources:16,maxEmojiProperties:64,maxRangesPerTable:1e5,maxTotalRanges:25e4,maxDepth:8,maxStringLength:256,maxUrlLength:2048}),Kl=class extends TypeError{constructor(t,r){super(`Invalid Unicode data pack at ${t}: ${r}`);this.path=t;this.name="UnicodeDataPackValidationError"}code="UNICODE_DATA_PACK_INVALID"},ql=class extends Error{code="UNICODE_DATA_PACK_NOT_FOUND";constructor(){super("No Unicode data pack matches the requested selector."),this.name="UnicodeDataPackNotFoundError"}},Ui=1114111,Yl=/^[A-Za-z][A-Za-z0-9_-]{0,63}$/,Ki=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,Xl=/^[0-9a-f]{64}$/,Cy=new Set(["A","F","H","N","Na","W"]);function Z(n,e){throw new Kl(n,e)}function cn(n,e,t,r,o=t){r>Lt.maxDepth&&Z(e,"maximum nesting depth exceeded"),(n===null||typeof n!="object")&&Z(e,"expected an object");let i,a;try{i=Object.getPrototypeOf(n),a=Object.getOwnPropertyDescriptors(n)}catch{return Z(e,"object descriptors could not be inspected safely")}i!==Object.prototype&&i!==null&&Z(e,"expected a plain object");let s=new Set(t),l=Object.create(null);for(let d of Reflect.ownKeys(a)){typeof d!="string"&&Z(e,"symbol keys are not allowed"),s.has(d)||Z(`${e}.${d}`,"unknown property");let c=a[d];(c===void 0||!("value"in c)||c.get!==void 0||c.set!==void 0)&&Z(`${e}.${d}`,"accessors are not allowed"),c.enumerable!==!0&&Z(`${e}.${d}`,"properties must be enumerable"),l[d]=c.value}for(let d of o)Object.hasOwn(l,d)||Z(`${e}.${d}`,"required property is missing");return l}function Do(n,e,t,r){r>Lt.maxDepth&&Z(e,"maximum nesting depth exceeded");let o=!1;try{o=Array.isArray(n)}catch{return Z(e,"array identity could not be inspected safely")}o||Z(e,"expected an array");let i,a;try{i=Object.getPrototypeOf(n),a=Object.getOwnPropertyDescriptors(n)}catch{return Z(e,"array descriptors could not be inspected safely")}i!==Array.prototype&&i!==null&&Z(e,"expected a plain array");let s=a.length;(s===void 0||!("value"in s))&&Z(`${e}.length`,"missing length");let l=s.value;(!Number.isSafeInteger(l)||l<0||l>t)&&Z(`${e}.length`,`must be an integer from 0 through ${t}`);let d=new Array(l);for(let c of Reflect.ownKeys(a)){if(typeof c!="string"&&Z(e,"symbol keys are not allowed"),c==="length")continue;/^(0|[1-9]\d*)$/.test(c)||Z(`${e}.${c}`,"custom array properties are not allowed");let u=Number(c);(!Number.isSafeInteger(u)||u<0||u>=l||String(u)!==c)&&Z(`${e}.${c}`,"invalid array index");let h=a[c];(h===void 0||!("value"in h)||h.get!==void 0||h.set!==void 0)&&Z(`${e}[${u}]`,"accessors are not allowed"),h.enumerable!==!0&&Z(`${e}[${u}]`,"items must be enumerable"),d[u]=h.value}for(let c=0;c<l;c++)Object.hasOwn(d,c)||Z(`${e}[${c}]`,"sparse arrays are not allowed");return d}function dn(n,e,t=Lt.maxStringLength){return typeof n!="string"&&Z(e,"expected a string"),(n.length===0||n.length>t)&&Z(e,`length must be from 1 through ${t}`),n}function qi(n,e,t,r){return(!Number.isSafeInteger(n)||n<t||n>r)&&Z(e,`must be an integer from ${t} through ${r}`),n}function Ey(n,e){return Object.freeze({start:n,end:e})}function Iy(n,e,t){let r=cn(n,e,["start","end"],t),o=qi(r.start,`${e}.start`,0,Ui),i=qi(r.end,`${e}.end`,0,Ui);return i<o&&Z(e,"range end precedes its start"),Ey(o,i)}function nf(n,e,t,r){let o=Do(n,e,Lt.maxRangesPerTable,t),i=[],a=-1;for(let s=0;s<o.length;s++){let l=`${e}[${s}]`,d=cn(o[s],l,["start","end","value"],t+1),c=qi(d.start,`${l}.start`,0,Ui),u=qi(d.end,`${l}.end`,0,Ui);u<c&&Z(l,"range end precedes its start"),c<=a&&Z(l,"ranges must be sorted and non-overlapping");let h=dn(d.value,`${l}.value`,64);Yl.test(h)||Z(`${l}.value`,"expected a Unicode property token"),r!==void 0&&!r.has(h)&&Z(`${l}.value`,"unsupported property value"),i.push(Object.freeze({start:c,end:u,value:h})),a=u}return Object.freeze(i)}function Ay(n,e,t){let r=Do(n,e,Lt.maxRangesPerTable,t),o=[],i=-1;for(let a=0;a<r.length;a++){let s=Iy(r[a],`${e}[${a}]`,t+1);s.start<=i&&Z(`${e}[${a}]`,"ranges must be sorted and non-overlapping"),o.push(s),i=s.end}return Object.freeze(o)}function Oy(n,e,t){let r=Do(n,e,Lt.maxSources,t);r.length===0&&Z(e,"at least one source is required");let o=[],i="",a=new Set;for(let s=0;s<r.length;s++){let l=`${e}[${s}]`,d=cn(r[s],l,["name","url","sha256"],t+1),c=dn(d.name,`${l}.name`,64);Yl.test(c)||Z(`${l}.name`,"expected a source token"),c<=i&&Z(`${l}.name`,"sources must be uniquely sorted by name");let u=dn(d.url,`${l}.url`,Lt.maxUrlLength);/^https:\/\/[^\s]+$/.test(u)||Z(`${l}.url`,"expected an HTTPS URL"),a.has(u)&&Z(`${l}.url`,"source URLs must be unique");let h=dn(d.sha256,`${l}.sha256`,64);Xl.test(h)||Z(`${l}.sha256`,"expected a lowercase SHA-256 digest"),o.push(Object.freeze({name:c,url:u,sha256:h})),i=c,a.add(u)}return Object.freeze(o)}function Ly(n,e,t){let r=Do(n,e,Lt.maxEmojiProperties,t);r.length===0&&Z(e,"at least one emoji property is required");let o=[],i="",a=0;for(let s=0;s<r.length;s++){let l=`${e}[${s}]`,d=cn(r[s],l,["property","ranges"],t+1),c=dn(d.property,`${l}.property`,64);Yl.test(c)||Z(`${l}.property`,"expected a Unicode property token"),c<=i&&Z(`${l}.property`,"properties must be uniquely sorted by name");let u=Ay(d.ranges,`${l}.ranges`,t+1);a+=u.length,a>Lt.maxTotalRanges&&Z(e,"total range limit exceeded"),o.push(Object.freeze({property:c,ranges:u})),i=c}return Object.freeze(o)}function Py(n,e="$",t=0){let r=cn(n,e,["schema","schemaVersion","unicodeVersion","sources","tables"],t);r.schema!==tf&&Z(`${e}.schema`,"unsupported schema identifier"),r.schemaVersion!==1&&Z(`${e}.schemaVersion`,"unsupported schema version");let o=dn(r.unicodeVersion,`${e}.unicodeVersion`,32),i=Ki.exec(o);(i===null||i.slice(1).some(f=>Number(f)>999))&&Z(`${e}.unicodeVersion`,"expected a bounded major.minor.patch version");let a=Oy(r.sources,`${e}.sources`,t+1),s=cn(r.tables,`${e}.tables`,["graphemeBreak","eastAsianWidth","emoji"],t+1),l=nf(s.graphemeBreak,`${e}.tables.graphemeBreak`,t+2),d=nf(s.eastAsianWidth,`${e}.tables.eastAsianWidth`,t+2,Cy),c=Ly(s.emoji,`${e}.tables.emoji`,t+2);l.length+d.length+c.reduce((f,p)=>f+p.ranges.length,0)>Lt.maxTotalRanges&&Z(`${e}.tables`,"total range limit exceeded");let h=Object.freeze({graphemeBreak:l,eastAsianWidth:d,emoji:c});return Object.freeze({schema:tf,schemaVersion:1,unicodeVersion:o,sources:a,tables:h})}var Ny=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function Gt(n,e){return n>>>e|n<<32-e}function zo(n){let e=typeof n=="string"?new TextEncoder().encode(n):n,t=Math.ceil((e.length+9)/64)*64,r=new Uint8Array(t);r.set(e),r[e.length]=128;let o=e.length*8,i=new DataView(r.buffer);i.setUint32(t-8,Math.floor(o/4294967296),!1),i.setUint32(t-4,o>>>0,!1);let a=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),s=new Uint32Array(64);for(let l=0;l<t;l+=64){for(let y=0;y<16;y++)s[y]=i.getUint32(l+y*4,!1);for(let y=16;y<64;y++){let b=s[y-15],w=s[y-2],x=Gt(b,7)^Gt(b,18)^b>>>3,k=Gt(w,17)^Gt(w,19)^w>>>10;s[y]=s[y-16]+x+s[y-7]+k>>>0}let[d,c,u,h,f,p,m,g]=a;for(let y=0;y<64;y++){let b=Gt(f,6)^Gt(f,11)^Gt(f,25),w=f&p^~f&m,x=g+b+w+Ny[y]+s[y]>>>0,k=Gt(d,2)^Gt(d,13)^Gt(d,22),C=d&c^d&u^c&u,T=k+C>>>0;g=m,m=p,p=f,f=h+x>>>0,h=u,u=c,c=d,d=x+T>>>0}a[0]=a[0]+d>>>0,a[1]=a[1]+c>>>0,a[2]=a[2]+u>>>0,a[3]=a[3]+h>>>0,a[4]=a[4]+f>>>0,a[5]=a[5]+p>>>0,a[6]=a[6]+m>>>0,a[7]=a[7]+g>>>0}return Array.from(a,l=>l.toString(16).padStart(8,"0")).join("")}function Wr(n){let e=cn(n,"$",["schema","schemaVersion","unicodeVersion","fingerprint","sources","tables"],0),t=Py({schema:e.schema,schemaVersion:e.schemaVersion,unicodeVersion:e.unicodeVersion,sources:e.sources,tables:e.tables}),r=dn(e.fingerprint,"$.fingerprint",64);Xl.test(r)||Z("$.fingerprint","expected a lowercase SHA-256 digest");let o=zo(JSON.stringify(t));return r!==o&&Z("$.fingerprint","does not match normalized pack content"),Object.freeze({schema:t.schema,schemaVersion:t.schemaVersion,unicodeVersion:t.unicodeVersion,fingerprint:r,sources:t.sources,tables:t.tables})}function Jl(n){let e=Wr(n),t=Object.freeze(e.sources.map(o=>Object.freeze({...o}))),r=Object.freeze(e.tables.emoji.map(o=>o.property));return Object.freeze({schema:e.schema,schemaVersion:e.schemaVersion,unicodeVersion:e.unicodeVersion,fingerprint:e.fingerprint,sources:t,graphemeBreakRanges:e.tables.graphemeBreak.length,eastAsianWidthRanges:e.tables.eastAsianWidth.length,emojiProperties:r,emojiRanges:e.tables.emoji.reduce((o,i)=>o+i.ranges.length,0)})}function Wy(n,e){let t=n.split(".").map(Number),r=e.split(".").map(Number);for(let o=0;o<3;o++)if(t[o]!==r[o])return t[o]-r[o];return 0}function Vy(n){if(n===void 0)return Object.freeze({});if(typeof n=="string")return Ki.test(n)||Z("$.selector","expected a major.minor.patch version"),Object.freeze({unicodeVersion:n});let e=cn(n,"$.selector",["unicodeVersion","fingerprint"],0,[]);!Object.hasOwn(e,"unicodeVersion")&&!Object.hasOwn(e,"fingerprint")&&Z("$.selector","at least one selector field is required");let t,r;return Object.hasOwn(e,"unicodeVersion")&&(t=dn(e.unicodeVersion,"$.selector.unicodeVersion",32),Ki.test(t)||Z("$.selector.unicodeVersion","invalid version")),Object.hasOwn(e,"fingerprint")&&(r=dn(e.fingerprint,"$.selector.fingerprint",64),Xl.test(r)||Z("$.selector.fingerprint","invalid fingerprint")),Object.freeze({unicodeVersion:t,fingerprint:r})}var Yi=class n{#e;#t;constructor(e,t={}){let r=Do(e,"$.packs",Lt.maxPacks,0);r.length===0&&Z("$.packs","at least one pack is required");let o=r.map(s=>Wr(s));o.sort((s,l)=>Wy(s.unicodeVersion,l.unicodeVersion));for(let s=1;s<o.length;s++)o[s-1].unicodeVersion===o[s].unicodeVersion&&Z("$.packs","Unicode versions must be unique"),o[s-1].fingerprint===o[s].fingerprint&&Z("$.packs","pack fingerprints must be unique");let a=cn(t,"$.options",["defaultUnicodeVersion"],0,[]).defaultUnicodeVersion??o.at(-1).unicodeVersion;(typeof a!="string"||!Ki.test(a))&&Z("$.options.defaultUnicodeVersion","expected a registered major.minor.patch version"),o.some(s=>s.unicodeVersion===a)||Z("$.options.defaultUnicodeVersion","version is not registered"),this.#e=Object.freeze(o),this.#t=a,Object.freeze(this)}get defaultUnicodeVersion(){return this.#t}get versions(){return Object.freeze(this.#e.map(e=>e.unicodeVersion))}select(e){let t=Vy(e),r=t.unicodeVersion??(t.fingerprint===void 0?this.#t:void 0),o=this.#e.find(i=>(r===void 0||i.unicodeVersion===r)&&(t.fingerprint===void 0||i.fingerprint===t.fingerprint));if(o===void 0)throw new ql;return o}withPack(e,t={}){return new n([...this.#e,e],{defaultUnicodeVersion:t.defaultUnicodeVersion??this.#t})}inspect(){let e=Object.freeze(this.#e.map(t=>Jl(t)));return Object.freeze({defaultUnicodeVersion:this.#t,versions:Object.freeze(this.#e.map(t=>t.unicodeVersion)),packs:e})}};var rf=JSON.parse(String.raw`{"schema":"deno-tui.unicode-grapheme-data","schemaVersion":1,"unicodeVersion":"17.0.0","dataPackFingerprint":"4c885bc9201552e99c0797a4b8ea72db55fc2c315af3347ad53a9743c65bbfc2","indicConjunctBreakFingerprint":"bfa679b9dd050b8de3a16881433fc28d48ec81cb01d46dd44c1f5bc4888f49e3","graphemeBreakValues":["CR","Control","Extend","L","LF","LV","LVT","Other","Prepend","Regional_Indicator","SpacingMark","T","V","ZWJ"],"indicConjunctBreakValues":["Consonant","Extend","Linker"],"graphemeBreakRanges":[0,9,1,0,0,4,0,1,1,0,0,0,0,17,1,95,32,1,13,0,1,594,111,2,275,6,2,263,44,2,1,0,2,1,1,2,1,1,2,1,0,2,56,5,8,10,10,2,1,0,1,46,20,2,16,0,2,101,6,2,0,0,8,1,5,2,2,1,2,1,3,2,33,0,8,1,0,2,30,26,2,91,10,2,58,8,2,9,0,2,24,3,2,1,8,2,1,2,2,1,4,2,43,2,2,52,1,8,5,8,2,42,23,2,0,0,8,0,31,2,0,0,10,54,0,2,0,0,10,0,0,2,1,2,10,0,7,2,0,3,10,0,0,2,0,1,10,1,6,2,10,1,2,29,0,2,0,1,10,56,0,2,1,0,2,0,1,10,0,3,2,2,1,10,2,1,10,0,0,2,9,0,2,10,1,2,26,0,2,2,1,2,0,0,10,56,0,2,1,2,10,0,1,2,4,1,2,2,2,2,3,0,2,30,1,2,3,0,2,11,1,2,0,0,10,56,0,2,1,2,10,0,4,2,1,1,2,0,0,10,1,1,10,0,0,2,20,1,2,22,5,2,1,0,2,0,1,10,56,0,2,1,1,2,0,0,10,0,3,2,2,1,10,2,1,10,0,0,2,7,2,2,10,1,2,30,0,2,59,0,2,0,0,10,0,0,2,0,1,10,3,2,10,1,2,10,0,0,2,9,0,2,40,0,2,0,2,10,0,0,2,55,0,2,1,2,2,0,3,10,1,2,2,1,3,2,7,1,2,11,1,2,29,0,2,0,1,10,56,0,2,1,0,10,0,1,2,0,0,10,0,0,2,0,1,10,1,2,2,1,3,2,7,1,2,11,1,2,15,0,10,12,1,2,0,1,10,55,1,2,1,0,2,0,1,10,0,3,2,1,2,10,1,2,10,0,0,2,0,0,8,8,0,2,10,1,2,29,0,2,0,1,10,70,0,2,4,0,2,0,1,10,0,2,2,1,0,2,1,6,10,0,0,2,18,1,10,61,0,2,1,0,10,0,6,2,12,7,2,98,0,2,1,0,10,0,8,2,11,6,2,73,1,2,27,0,2,1,0,2,1,0,2,4,1,10,49,13,2,0,0,10,0,4,2,1,1,2,5,10,2,1,35,2,9,0,2,102,3,2,0,0,10,0,5,2,1,1,2,0,1,10,0,1,2,23,1,10,0,1,2,4,2,2,16,3,2,13,0,2,1,0,10,0,1,2,6,0,2,15,0,2,98,95,3,0,71,12,0,87,11,349,2,2,946,3,2,28,2,2,29,1,2,30,1,2,64,1,2,0,0,10,0,6,2,0,7,10,0,0,2,0,1,10,0,10,2,9,0,2,45,2,2,0,0,1,0,0,2,117,1,2,34,0,2,118,2,2,0,3,10,0,1,2,0,2,10,4,1,10,0,0,2,0,5,10,0,2,2,219,1,2,0,1,10,0,0,2,57,0,10,0,0,2,0,0,10,0,6,2,1,0,2,1,0,2,2,7,2,0,5,10,0,9,2,2,0,2,48,45,2,2,11,2,20,3,2,0,0,10,47,9,2,0,3,10,0,2,2,38,8,2,12,1,2,0,0,10,30,0,10,0,3,2,0,1,10,0,5,2,56,0,2,0,0,10,0,1,2,0,2,10,0,0,2,0,0,10,0,4,2,48,7,10,0,7,2,0,1,10,0,1,2,152,2,2,1,12,2,0,0,10,0,6,2,4,0,2,6,0,2,2,0,10,0,1,2,198,63,2,523,0,1,0,0,2,0,0,13,0,1,1,24,6,1,49,15,1,96,32,2,3070,2,2,141,0,2,96,31,2,554,5,2,105,1,2,30164,3,2,1,9,2,32,1,2,80,1,2,272,0,2,3,0,2,4,0,2,23,1,10,0,1,2,0,0,10,4,0,2,83,1,10,50,15,10,0,1,2,26,17,2,13,0,2,38,7,2,25,10,2,0,0,10,0,0,2,12,28,3,3,2,2,0,0,10,47,0,2,0,1,10,0,3,2,0,1,10,0,1,2,0,1,10,0,0,2,36,0,2,67,5,2,0,1,10,0,1,2,0,1,10,0,1,2,12,0,2,8,0,2,0,0,10,46,0,2,51,0,2,1,2,2,2,1,2,5,1,2,1,0,2,41,0,10,0,1,2,0,1,10,5,0,10,0,0,2,236,1,10,0,0,2,0,1,10,0,0,2,0,1,10,1,0,10,0,0,2,18,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,0,0,5,0,26,6,12,22,12,4,48,11,8994,0,2,737,15,2,16,15,2,207,0,1,158,1,2,80,11,1,513,0,2,226,0,2,149,4,2,1670,2,2,1,1,2,5,3,2,40,2,2,4,0,2,165,1,2,573,3,2,65,4,2,317,1,2,77,5,2,70,10,2,49,3,2,122,0,10,0,0,2,0,0,10,53,14,2,41,0,2,2,1,2,10,2,2,0,0,10,45,2,10,0,3,2,0,1,10,0,1,2,2,0,8,4,0,2,10,0,8,50,2,2,36,4,2,0,0,10,0,7,2,16,1,10,44,0,2,12,1,2,0,0,10,48,2,10,0,8,2,0,0,10,0,0,2,1,1,8,5,3,2,1,0,10,0,0,2,92,2,10,0,2,2,0,1,10,0,3,2,6,0,2,2,0,2,157,0,2,0,2,10,0,7,2,21,1,2,0,1,10,55,1,2,1,0,2,0,0,10,0,0,2,0,3,10,2,1,10,2,1,10,0,0,2,9,0,2,10,1,10,2,6,2,3,4,2,67,0,2,0,1,10,0,5,2,1,0,2,2,0,2,1,2,2,0,0,10,1,1,10,0,2,2,0,0,8,0,0,2,14,1,2,82,2,10,0,7,2,0,1,10,0,2,2,0,0,10,0,0,2,23,0,2,81,0,2,0,1,10,0,5,2,0,0,10,0,0,2,0,1,10,0,0,2,0,0,10,0,1,2,0,0,10,0,1,2,235,0,2,0,1,10,0,3,2,2,3,10,0,1,2,0,0,10,0,1,2,27,1,2,82,2,10,0,7,2,0,1,10,0,0,2,0,0,10,0,1,2,106,0,2,0,0,10,0,0,2,0,1,10,0,7,2,101,0,2,0,0,10,0,0,2,2,3,2,0,0,10,0,4,2,256,2,10,0,8,2,0,0,10,0,1,2,245,0,2,0,4,10,1,1,10,2,3,2,0,0,8,0,0,10,0,0,8,0,0,10,0,0,2,141,2,10,0,3,2,2,1,2,0,3,10,0,0,2,3,0,10,28,9,2,40,5,2,0,0,10,1,3,2,8,0,2,9,5,2,0,1,10,0,2,2,40,5,8,0,12,2,0,0,10,0,1,2,198,0,2,0,0,10,0,2,2,0,0,10,0,0,2,0,0,10,199,0,10,0,6,2,1,5,2,0,0,10,0,0,2,82,21,2,1,0,10,0,6,2,0,0,10,0,1,2,0,0,10,0,1,2,122,5,2,3,0,2,1,1,2,1,6,2,0,0,8,0,0,2,66,4,10,1,1,2,1,1,10,0,0,2,0,0,10,0,0,2,347,1,2,0,1,10,9,1,2,0,0,8,0,0,10,48,1,10,0,4,2,3,1,10,0,2,2,23,0,2,5333,15,1,0,0,2,6,14,2,11464,11,2,0,2,10,0,2,2,2496,4,2,59,6,2,556,0,12,3,3,12,484,0,2,1,54,10,7,3,2,81,0,2,11,1,2,19627,1,2,1,3,1,4700,45,2,2,22,2,542,4,2,3,5,2,0,7,1,0,7,2,2,6,2,30,3,2,148,2,2,1979,54,2,4,49,2,8,0,2,14,0,2,22,4,2,1,14,2,1360,6,2,1,16,2,2,6,2,1,1,2,1,4,2,100,0,2,160,6,2,375,0,2,61,3,2,508,3,2,254,1,2,243,0,2,2,0,2,7,1,2,5,0,2,474,6,2,109,6,2,2203,25,9,507,4,2,789504,31,1,0,95,2,0,127,1,0,239,2,0,3599,1],"extendedPictographicRanges":[169,0,4,0,8077,0,12,0,216,0,22,0,90,5,15,1,367,1,12,0,166,0,25,10,4,2,199,0,231,1,10,0,9,0,58,3,1,4,9,0,2,0,2,1,2,0,4,0,2,0,1,1,2,0,3,0,3,1,8,2,5,0,1,0,5,11,11,1,2,0,1,1,1,0,18,0,2,1,18,5,1,0,1,1,3,1,5,0,2,1,4,1,11,1,5,1,2,0,5,1,1,0,1,1,20,1,5,5,1,3,2,0,4,0,2,0,2,5,1,0,2,0,1,0,1,0,6,0,3,0,6,0,10,1,15,0,2,0,4,0,1,0,4,2,1,0,11,1,48,2,9,0,14,0,14,0,372,1,463,2,19,1,51,0,4,0,1242,0,12,0,601,0,1,0,114026,0,39,3,100,11,15,1,15,0,14,1,37,9,112,1,12,1,14,0,2,9,19,55,27,14,10,0,20,0,2,8,1,3,9,22,6,187,2,111,2,1,1,2,2,82,2,2,1,3,5,253,1,62,11,5,1,23,7,1,2,7,12,0,2,3,2,0,4,1,13,1,2,0,8,1,9,0,5,2,12,2,8,2,2,0,1,0,4,0,6,0,3,0,6,85,48,69,5,7,2,16,3,0,1,5,2,12,218,37,12,3,56,7,10,5,40,7,30,1,12,3,2,13,9,38,12,46,1,9,1,184,88,7,14,145,256,1021],"indicConjunctBreakRanges":[768,111,1,275,6,1,263,44,1,1,0,1,1,1,1,1,1,1,1,0,1,72,10,1,48,20,1,16,0,1,101,6,1,2,5,1,2,1,1,1,3,1,35,0,1,30,26,1,91,10,1,58,8,1,9,0,1,24,3,1,1,8,1,1,2,1,1,4,1,43,2,1,59,8,1,42,23,1,1,31,1,18,36,0,0,0,1,1,0,1,4,7,1,4,0,2,3,6,1,0,7,0,2,1,1,20,7,0,1,0,1,19,19,0,1,6,0,1,0,0,3,3,0,2,0,1,1,0,1,2,3,1,8,0,2,9,0,1,4,1,0,1,0,0,2,1,1,12,1,0,12,0,1,2,1,1,57,0,1,4,1,1,4,1,1,2,2,1,3,0,1,30,1,1,3,0,1,11,1,1,18,19,0,1,6,0,1,1,0,1,4,0,2,0,1,4,4,1,1,1,1,4,0,2,20,1,1,21,0,0,0,5,1,1,0,1,19,19,0,1,6,0,1,1,0,1,4,0,2,0,1,1,1,1,1,3,1,8,0,2,7,2,1,4,1,0,1,0,0,2,1,1,13,0,0,16,0,1,59,0,1,1,0,1,12,0,1,9,0,1,40,0,1,3,0,1,16,19,0,1,15,0,2,0,1,1,2,1,5,2,1,1,2,1,0,0,2,7,1,1,1,2,0,7,1,1,29,0,1,58,0,1,2,1,1,1,0,1,3,2,1,1,3,1,7,1,1,11,1,1,28,1,1,19,37,0,0,1,1,1,0,1,2,3,1,8,0,2,9,0,1,10,1,1,29,0,1,72,0,1,4,0,1,2,2,1,1,0,1,8,0,1,81,0,1,2,6,1,12,7,1,98,0,1,2,8,1,11,6,1,73,1,1,27,0,1,1,0,1,1,0,1,55,13,1,1,4,1,1,1,1,5,10,1,1,35,1,9,0,1,57,42,0,2,3,1,1,5,1,1,0,2,0,0,1,2,1,1,0,0,0,16,5,0,2,1,1,0,3,0,0,2,1,0,0,0,3,1,0,7,2,0,0,3,1,0,12,0,0,0,1,2,1,1,6,0,1,0,0,0,14,0,1,703,2,1,946,3,1,28,2,1,29,1,1,30,1,1,12,51,0,0,1,1,1,6,1,8,0,1,2,8,1,0,0,2,0,0,1,9,0,1,45,2,1,1,0,1,117,1,1,34,0,1,118,2,1,4,1,1,9,0,1,6,2,1,219,1,1,2,0,1,4,52,0,1,0,1,1,6,1,1,0,2,1,0,1,2,7,1,6,9,1,2,0,1,48,45,1,2,11,1,20,3,1,7,1,0,6,32,0,0,9,1,4,1,1,0,0,2,0,7,0,30,8,1,12,1,1,1,29,0,1,3,1,2,2,1,0,0,2,0,1,1,0,1,0,11,2,0,40,0,1,1,1,1,3,0,1,1,4,1,56,7,1,2,1,1,152,2,1,1,12,1,1,6,1,4,0,1,6,0,1,3,1,1,198,63,1,525,0,1,194,32,1,3070,2,1,141,0,1,96,31,1,554,5,1,105,1,1,30164,3,1,1,9,1,32,1,1,80,1,1,272,0,1,3,0,1,4,0,1,25,1,1,5,0,1,151,1,1,26,17,1,13,0,1,38,7,1,25,10,1,1,0,1,44,2,1,6,2,0,3,35,0,0,0,1,2,3,1,2,1,1,2,0,2,31,4,0,0,0,1,1,8,0,10,4,0,42,5,1,2,1,1,2,1,1,12,0,1,8,0,1,19,15,0,1,2,0,6,0,0,1,0,1,1,1,0,48,0,1,1,2,1,2,1,1,5,1,1,1,0,1,30,10,0,1,1,1,8,0,2,201,26,0,10,0,1,2,0,1,4,0,1,20272,0,1,737,15,1,16,15,1,366,1,1,605,0,1,226,0,1,149,4,1,1669,0,0,0,2,1,1,1,1,5,3,1,0,3,0,1,2,0,1,28,0,2,2,1,4,0,2,165,1,1,573,3,1,65,4,1,317,1,1,77,5,1,70,10,1,49,3,1,123,0,1,54,14,1,41,0,1,2,1,1,10,2,1,49,3,1,2,1,1,7,0,1,61,2,1,0,35,0,0,4,1,1,5,1,0,0,2,0,0,1,15,0,0,2,0,0,43,0,1,12,1,1,52,8,1,1,0,1,8,3,1,2,0,1,95,2,1,2,3,1,6,0,1,2,0,1,157,0,1,3,7,1,21,1,1,57,1,1,1,0,1,1,0,1,12,0,1,9,0,1,14,6,1,3,4,1,11,9,0,1,0,0,2,0,0,1,37,0,2,0,1,2,5,1,1,0,1,2,0,1,1,2,1,4,1,1,0,0,2,1,0,1,14,1,1,85,7,1,2,2,1,1,0,1,23,0,1,81,0,1,2,5,1,1,0,1,2,0,1,1,1,1,1,1,1,235,0,1,2,3,1,6,1,1,1,1,1,27,1,1,85,7,1,2,0,1,1,1,1,106,0,1,1,0,1,2,7,1,101,0,1,1,0,1,2,3,1,1,4,1,259,8,1,1,1,1,197,6,0,2,0,0,2,7,0,1,1,0,1,23,0,0,0,1,10,2,1,0,0,2,4,0,1,144,3,1,2,1,1,4,0,1,31,0,0,0,9,1,0,39,0,0,5,1,2,3,1,8,0,2,8,0,0,0,5,1,2,2,1,0,39,0,6,12,1,1,0,1,0,0,2,198,0,1,1,2,1,1,0,1,201,6,1,1,5,1,1,0,1,82,21,1,2,6,1,1,1,1,1,1,1,122,5,1,3,0,1,1,1,1,1,6,1,1,0,1,72,1,1,3,0,1,1,0,1,347,1,1,11,1,1,2,12,0,1,33,0,2,4,1,5,1,1,0,0,2,23,0,1,5349,0,1,6,14,1,11464,11,1,3,2,1,2496,4,1,59,6,1,1048,0,1,63,3,1,81,0,1,11,1,1,19627,1,1,4705,45,1,2,22,1,542,4,1,3,5,1,8,7,1,2,6,1,30,3,1,148,2,1,1979,54,1,4,49,1,8,0,1,14,0,1,22,4,1,1,14,1,1360,6,1,1,16,1,2,6,1,1,1,1,1,4,1,100,0,1,160,6,1,375,0,1,61,3,1,508,3,1,254,1,1,243,0,1,2,0,1,7,1,1,5,0,1,474,6,1,109,6,1,2736,4,1,789536,95,1,128,239,1],"fingerprint":"bc25cd592433e9c0ee1835efcdf7e8b5f9edb462bbb971ae07c20fb16e479dc6"}`);var Ql=class extends TypeError{code="UNICODE_GRAPHEME_DATA_INVALID";constructor(e){super(`Invalid Unicode grapheme data: ${e}`),this.name="UnicodeGraphemeDataError"}},Dy=new Set(["CR","Control","Extend","L","LF","LV","LVT","Other","Prepend","Regional_Indicator","SpacingMark","T","V","ZWJ"]),of=new Set(["Control","CR","LF"]),af="17.0.0",zy="4c885bc9201552e99c0797a4b8ea72db55fc2c315af3347ad53a9743c65bbfc2",$y="bfa679b9dd050b8de3a16881433fc28d48ec81cb01d46dd44c1f5bc4888f49e3",Hy="bc25cd592433e9c0ee1835efcdf7e8b5f9edb462bbb971ae07c20fb16e479dc6",By=Object.freeze(["CR","Control","Extend","L","LF","LV","LVT","Other","Prepend","Regional_Indicator","SpacingMark","T","V","ZWJ"]),Fy=Object.freeze(["Consonant","Extend","Linker"]);function we(n){throw new Ql(n)}function jy(n,e,t){(n===null||typeof n!="object"||Array.isArray(n))&&we(`${e} must be a plain object`);let r,o;try{r=Object.getPrototypeOf(n),o=Object.getOwnPropertyDescriptors(n)}catch{return we(`${e} could not be inspected safely`)}r!==Object.prototype&&r!==null&&we(`${e} must be a plain object`);let i=new Set(t),a=Object.create(null);for(let s of Reflect.ownKeys(o)){(typeof s!="string"||!i.has(s))&&we(`${e} has an unknown property`);let l=o[s];(l===void 0||!("value"in l)||l.get!==void 0||l.set!==void 0)&&we(`${e}.${s} must be a data property`),a[s]=l.value}for(let s of t)Object.hasOwn(a,s)||we(`${e}.${s} is required`);return a}function cf(n,e){Array.isArray(n)||we(`${e} must be an array`);let t,r;try{t=Object.getPrototypeOf(n),r=Object.getOwnPropertyDescriptors(n)}catch{return we(`${e} could not be inspected safely`)}t!==Array.prototype&&t!==null&&we(`${e} must be a plain array`);let o=r.length?.value;(!Number.isSafeInteger(o)||o<1||o>1e5)&&we(`${e}.length is outside the supported range`);let i=new Array(o);for(let a of Reflect.ownKeys(r)){if(a==="length")continue;(typeof a!="string"||!/^(0|[1-9]\d*)$/.test(a))&&we(`${e} has a custom property`);let s=Number(a),l=r[a];(!Number.isSafeInteger(s)||s<0||s>=o||l===void 0||!("value"in l)||l.get!==void 0||l.set!==void 0)&&we(`${e}[${a}] must be a dense data property`),i[s]=l.value}for(let a=0;a<o;a++)Object.hasOwn(i,a)||we(`${e} must not be sparse`);return i}function sf(n,e,t){let r=cf(n,t);r.length!==e.length&&we(`${t} does not match the pinned property codec`);for(let o=0;o<r.length;o++)r[o]!==e[o]&&we(`${t} does not match the pinned property codec`);return e}function Zl(n,e,t){let r=cf(n,e);r.length%t!==0&&we(`${e} length must be divisible by ${t}`);let o=[];for(let i=0;i<r.length;i++){let a=r[i];(!Number.isSafeInteger(a)||a<0)&&we(`${e}[${i}] must be a non-negative safe integer`),o.push(a)}return Object.freeze(o)}function lf(n,e,t){let r=[],o=-1;for(let i=0;i<n.length;i+=3){let a=o+1+n[i],s=a+n[i+1],l=e[n[i+2]];(!Number.isSafeInteger(a)||!Number.isSafeInteger(s)||a<0||s>1114111)&&we(`${t}[${i/3}] is outside the Unicode code-point range`),l===void 0&&we(`${t}[${i/3}] has an unsupported property code`),r.push(Object.freeze({start:a,end:s,value:l})),o=s}return Object.freeze(r)}function Gy(n,e){let t=[],r=-1;for(let o=0;o<n.length;o+=2){let i=r+1+n[o],a=i+n[o+1];(!Number.isSafeInteger(i)||!Number.isSafeInteger(a)||i<0||a>1114111)&&we(`${e}[${o/2}] is outside the Unicode code-point range`),t.push(Object.freeze({start:i,end:a})),r=a}return Object.freeze(t)}function Uy(n){let t=jy(n,"$.graphemeData",["schema","schemaVersion","unicodeVersion","dataPackFingerprint","indicConjunctBreakFingerprint","graphemeBreakValues","indicConjunctBreakValues","graphemeBreakRanges","extendedPictographicRanges","indicConjunctBreakRanges","fingerprint"]);(t.schema!=="deno-tui.unicode-grapheme-data"||t.schemaVersion!==1)&&we("compact grapheme schema must be deno-tui.unicode-grapheme-data version 1"),t.unicodeVersion!==af&&we(`compact grapheme Unicode version must be ${af}`),t.dataPackFingerprint!==zy&&we("compact grapheme data-pack fingerprint is not pinned"),t.indicConjunctBreakFingerprint!==$y&&we("compact Indic_Conjunct_Break fingerprint is not pinned"),t.fingerprint!==Hy&&we("compact grapheme content fingerprint is not pinned");let r=sf(t.graphemeBreakValues,By,"$.graphemeData.graphemeBreakValues"),o=sf(t.indicConjunctBreakValues,Fy,"$.graphemeData.indicConjunctBreakValues"),i=Zl(t.graphemeBreakRanges,"$.graphemeData.graphemeBreakRanges",3),a=Zl(t.extendedPictographicRanges,"$.graphemeData.extendedPictographicRanges",2),s=Zl(t.indicConjunctBreakRanges,"$.graphemeData.indicConjunctBreakRanges",3),l={schema:t.schema,schemaVersion:t.schemaVersion,unicodeVersion:t.unicodeVersion,dataPackFingerprint:t.dataPackFingerprint,indicConjunctBreakFingerprint:t.indicConjunctBreakFingerprint,graphemeBreakValues:r,indicConjunctBreakValues:o,graphemeBreakRanges:i,extendedPictographicRanges:a,indicConjunctBreakRanges:s};return zo(JSON.stringify(l))!==t.fingerprint&&we("compact grapheme fingerprint does not match its encoded content"),Object.freeze({unicodeVersion:t.unicodeVersion,dataPackFingerprint:t.dataPackFingerprint,indicConjunctBreakFingerprint:t.indicConjunctBreakFingerprint,graphemeBreak:lf(i,r,"$.graphemeData.graphemeBreakRanges"),extendedPictographic:Gy(a,"$.graphemeData.extendedPictographicRanges"),indicConjunctBreak:lf(s,o,"$.graphemeData.indicConjunctBreakRanges")})}var Ut=Uy(rf);function Ky(n){if(!Number.isInteger(n)||n<0||n>1114111)throw new RangeError("Unicode code point must be an integer from 0 through 1114111.")}function nd(n,e){let t=0,r=n.length-1;for(;t<=r;){let o=t+(r-t>>>1),i=n[o];if(e<i.start)r=o-1;else if(e>i.end)t=o+1;else return i}}function qy(n){return Ky(n),nd(Ut.indicConjunctBreak,n)?.value??"None"}function Yy(n){let e=n.length;for(let r=0;r<e;r+=1)if(n.charCodeAt(r)>127)return;let t=[];for(let r=0;r<e;r+=1)r>0&&n.charCodeAt(r-1)===13&&n.charCodeAt(r)===10||t.push(r);return t.push(e),Object.freeze(t)}function An(n){if(typeof n!="string")throw new TypeError("Grapheme input must be a primitive string.")}function Vr(n,e,t="offset"){if(!Number.isSafeInteger(e)||e<0||e>n.length)throw new RangeError(`${t} must be an integer from 0 through the input's UTF-16 length (${n.length}).`)}function df(n,e){if(!Number.isSafeInteger(n)||n<0)throw new RangeError(`${e} must be a non-negative safe integer.`)}function Xy(n){if(n!=="backward"&&n!=="forward"&&n!=="nearest")throw new TypeError('Grapheme boundary bias must be "backward", "forward", or "nearest".');return n}function Jy(n,e){return nd(n.graphemeBreak,e)?.value??"Other"}function Zy(n,e){return nd(n.extendedPictographic,e)!==void 0}function Qy(n,e,t,r,o,i,a,s){return n==="CR"&&e==="LF"?!1:of.has(n)||of.has(e)?!0:n==="L"&&(e==="L"||e==="V"||e==="LV"||e==="LVT")||(n==="LV"||n==="V")&&(e==="V"||e==="T")||(n==="LVT"||n==="T")&&e==="T"||e==="Extend"||e==="ZWJ"||e==="SpacingMark"||n==="Prepend"||s==="Consonant"&&i&&a||t&&o?!1:n==="Regional_Indicator"&&e==="Regional_Indicator"?r%2===0:!0}var ed=class{#e;#t;#i=0;#r=!1;#o=!1;#s=!1;#n=!1;constructor(e){this.#e=e}consume(e){let t=Jy(this.#e,e),r=qy(e),o=Zy(this.#e,e),i=this.#t!==void 0&&Qy(this.#t,t,o,this.#i,this.#o,this.#s,this.#n,r),a=t==="ZWJ"&&this.#r;return o?this.#r=!0:t!=="Extend"&&(this.#r=!1),r==="Consonant"?(this.#s=!0,this.#n=!1):r==="Extend"||r==="Linker"?this.#s&&r==="Linker"&&(this.#n=!0):(this.#s=!1,this.#n=!1),this.#i=t==="Regional_Indicator"?(this.#i+1)%2:0,this.#t=t,this.#o=a,i}};function ew(n,e){if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t].start!==e[t].start||n[t].end!==e[t].end)return!1;return!0}function tw(n,e){if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t].start!==e[t].start||n[t].end!==e[t].end||n[t].value!==e[t].value)return!1;return!0}function nw(n){tw(n.tables.graphemeBreak,Ut.graphemeBreak)||we("pack Grapheme_Cluster_Break table does not match the pinned Unicode 17.0.0 algorithm data");let e=n.tables.emoji.find(t=>t.property==="Extended_Pictographic");(e===void 0||!ew(e.ranges,Ut.extendedPictographic))&&we("pack Extended_Pictographic table does not match the pinned Unicode 17.0.0 algorithm data")}var rw=new WeakMap;function Xi(n,e){let t=0,r=n.length;for(;t<r;){let o=t+(r-t>>>1);n[o]<e?t=o+1:r=o}return{found:n[t]===e,index:t}}var td=class{#e;#t;constructor(e){let t,r;if(e===void 0)t=Ut,r=Ut.dataPackFingerprint;else{let o=Wr(e);o.unicodeVersion!==Ut.unicodeVersion&&we(`pack version ${o.unicodeVersion} has no matching Indic_Conjunct_Break table; expected ${Ut.unicodeVersion}`);for(let a=0;a<o.tables.graphemeBreak.length;a++){let s=o.tables.graphemeBreak[a].value;Dy.has(s)||we(`pack Grapheme_Cluster_Break range ${a} has unsupported value ${JSON.stringify(s)}`)}nw(o);let i=o.tables.emoji.find(a=>a.property==="Extended_Pictographic");t=Object.freeze({graphemeBreak:o.tables.graphemeBreak,extendedPictographic:i.ranges}),r=o.fingerprint}this.#e=t,this.#t=Object.freeze({unicodeVersion:Ut.unicodeVersion,dataPackFingerprint:r,indicConjunctBreakFingerprint:Ut.indicConjunctBreakFingerprint,indicConjunctBreakRanges:Ut.indicConjunctBreak.length}),rw.set(this,t),Object.freeze(this)}inspect(){return this.#t}boundaries(e){An(e);let t=Yy(e);if(t)return t;let r=[0],o=0,i=new ed(this.#e);for(let a of e){let s=a.codePointAt(0),l=o;i.consume(s)&&r.push(l),o+=a.length}return r[r.length-1]!==e.length&&r.push(e.length),Object.freeze(r)}*iterate(e){let t=this.boundaries(e);for(let r=0;r+1<t.length;r++){let o=t[r],i=t[r+1];yield Object.freeze({segment:e.slice(o,i),start:o,end:i,index:r})}}segments(e){return Object.freeze(Array.from(this.iterate(e)))}count(e){return this.boundaries(e).length-1}isBoundary(e,t){return An(e),Vr(e,t),Xi(this.boundaries(e),t).found}previousBoundary(e,t){An(e),Vr(e,t);let r=this.boundaries(e),i=Xi(r,t).index-1;return r[Math.max(0,i)]}nextBoundary(e,t){An(e),Vr(e,t);let r=this.boundaries(e),o=Xi(r,t),i=o.found?o.index+1:o.index;return r[Math.min(r.length-1,i)]}resolveBoundary(e,t,r){An(e),Vr(e,t);let o=Xy(r),i=this.boundaries(e),a=Xi(i,t);if(a.found)return t;let s=i[a.index-1],l=i[a.index];return o==="backward"?s:o==="forward"?l:t-s<=l-t?s:l}coveringRange(e,t,r){if(An(e),Vr(e,t,"start"),Vr(e,r,"end"),r<t)throw new RangeError("Grapheme range end must not precede start.");return Object.freeze({start:this.resolveBoundary(e,t,"backward"),end:this.resolveBoundary(e,r,"forward")})}truncateClusters(e,t){An(e),df(t,"maximumClusters");let r=this.boundaries(e);return t>=r.length-1?e:e.slice(0,r[t])}truncateUtf16(e,t){return An(e),df(t,"maximumCodeUnits"),t>=e.length?e:e.slice(0,this.resolveBoundary(e,t,"backward"))}},rd=new td;var uf=Object.freeze([0,31,95,32,13,0,594,111,275,6,263,44,1,0,1,1,1,1,1,0,72,10,1,0,46,20,16,0,101,6,2,5,2,1,1,3,35,0,30,26,91,10,58,8,9,0,24,3,1,8,1,2,1,4,43,2,59,8,42,23,1,31,55,0,1,0,4,7,4,0,3,6,10,1,29,0,58,0,4,3,8,0,20,1,26,0,2,1,57,0,4,1,4,1,2,2,3,0,30,1,3,0,11,1,57,0,4,4,1,1,4,0,20,1,22,5,1,0,58,0,2,0,1,3,8,0,7,1,11,1,30,0,61,0,12,0,50,0,3,0,55,0,1,2,5,2,1,3,7,1,11,1,29,0,58,0,2,0,6,0,5,1,20,1,28,1,57,1,4,3,8,0,20,1,29,0,72,0,7,2,1,0,90,0,2,6,12,7,98,0,2,8,11,6,73,1,27,0,1,0,1,0,55,13,1,4,1,1,5,10,1,35,9,0,102,3,1,5,1,1,2,1,25,1,4,2,16,3,13,0,2,1,6,0,15,0,194,159,349,2,946,2,29,1,30,1,30,1,64,1,1,6,8,0,2,10,9,0,45,4,117,1,34,0,118,2,4,1,9,0,6,2,219,1,2,0,58,0,1,6,1,0,1,0,2,7,6,9,2,0,48,45,2,11,20,3,48,0,1,4,1,0,5,0,40,8,12,1,32,3,2,1,1,2,56,0,1,1,3,0,1,2,58,7,2,1,152,2,1,12,1,6,4,0,6,0,3,1,198,63,523,4,24,6,49,4,1,9,96,32,3070,2,141,0,96,31,554,3,107,1,30164,3,1,9,32,1,80,1,272,0,3,0,4,0,25,1,5,0,151,1,26,17,13,0,38,7,25,10,46,2,48,0,2,3,2,1,39,0,67,5,2,1,2,1,12,0,8,0,47,0,51,0,1,2,2,1,5,1,1,0,42,1,8,0,238,0,2,0,4,0,11202,22,4,48,8994,0,737,15,16,15,207,0,249,2,513,0,226,0,149,4,1670,2,1,1,5,3,40,2,4,0,165,1,573,3,65,4,317,1,77,5,70,10,49,3,123,0,54,14,41,0,2,1,10,2,49,3,2,1,7,0,61,2,36,4,1,7,62,0,12,1,52,8,10,3,2,0,95,2,2,0,1,1,6,0,2,0,157,0,3,7,21,1,57,1,3,0,37,6,3,4,70,5,13,0,1,0,1,0,14,1,85,7,2,2,1,0,23,0,84,5,1,0,4,1,1,1,238,3,6,1,1,1,27,1,85,7,2,0,1,1,106,0,1,0,2,5,1,0,101,0,1,0,2,3,1,4,259,8,1,1,256,1,1,0,4,0,144,3,2,1,4,0,32,9,40,5,2,3,8,0,9,5,2,2,46,12,1,1,198,0,1,2,1,0,201,6,1,5,1,0,82,21,2,6,1,1,1,1,122,5,3,0,1,1,1,6,1,0,72,1,3,0,1,0,347,1,11,1,52,4,5,0,1,0,23,0,5333,16,6,14,11464,11,3,2,2496,4,59,6,556,0,3,3,484,0,63,3,81,0,19640,1,1,3,4700,45,2,22,544,2,9,15,2,6,30,3,148,2,1979,54,4,49,8,0,14,0,22,4,1,14,1360,6,1,16,2,6,1,1,1,4,100,0,160,6,375,0,61,3,508,3,254,1,243,0,2,0,7,1,5,0,474,6,109,6,792246,0,30,95,128,239]);var hf=Object.freeze([4352,95,4538,1,13,1,190,3,3,0,2,0,521,1,21,1,26,7,16,11,43,0,10,5,3,0,13,0,8,1,17,1,5,1,8,0,5,0,21,0,7,1,1,0,4,0,2,0,7,0,4,1,28,0,35,0,1,0,4,2,1,0,61,2,24,0,14,0,859,1,51,0,4,0,810,25,1,88,12,213,26,78,2,85,2,102,5,42,1,93,1,85,9,47,1,39,8,29244,3,54,1177,28,643,11171,8540,365,2,105,822,9,22,34,1,18,1,3,149,95,127,6,28665,4,11,6,9,7381,41,31,97,114,8701,3,1,6,1,1,1,290,15,0,29,2,2,0,14,3,8,395,8196,86,9,22,7309,0,202,0,190,0,2,9,101,2,13,43,4,8,7,1,14,5,154,32,12,8,1,69,1,21,12,42,4,4,12,16,3,0,3,70,1,0,1,186,2,62,13,3,1,23,18,0,26,1,13,0,86,84,48,69,6,0,3,2,2,3,3,3,11,1,7,8,227,11,4,0,283,46,1,9,1,184,112,12,3,10,3,56,1,0,4,15,2,11,4,9,1287,42719,32,4381,2,5773,2,7472,15,621,2466,541,1506,4938,5,8489]);var ow=ff(uf),iw=ff(hf);function ff(n){let e=new Uint32Array(n.length),t=-1;for(let r=0;r<e.length;r+=2)e[r]=t+1+n[r],t=e[r]+n[r+1],e[r+1]=t;return e}function mf(n){return gf(ow,n)}function pf(n){return gf(iw,n)}function gf(n,e){let t=0,r=n.length/2;for(;t<r;){let o=t+r>>>1,i=o*2;if(e<n[i])r=o;else if(e>n[i+1])t=o+1;else return!0}return!1}var od=class{#e=0;#t=0;#i=0;#r=!0;#o=!1;#s=!1;#n=!1;#a=!1;reset(){this.#e=this.#i=0,this.#t=0,this.#r=!0,this.#o=this.#s=this.#n=this.#a=!1}push(e){return this.#i===0&&(this.#e=e),this.#i=Math.min(3,this.#i+1),this.#t||(this.#t=yf(e)),e===8205&&(this.#o=!0),e===65039&&(this.#s=!0),aw(e)&&(this.#n=!0),(e<127462||e>127487)&&(this.#r=!1),e===8419&&(this.#e>=48&&this.#e<=57||this.#e===35||this.#e===42)&&(this.#a=!0),this.#o&&this.#n||this.#a||this.#r&&this.#i===2||this.#s&&this.#n?2:this.#t}};function bf(n){if(!n)return 0;let e=n.codePointAt(0);if(n.length===(e>65535?2:1))return yf(e);let t=new od,r=0;for(let o of n)r=t.push(o.codePointAt(0));return r}function yf(n){return n<128?n>=32&&n<127?1:0:mf(n)||n>=127995&&n<=127999?0:pf(n)||n>=127462&&n<=127487?2:1}function aw(n){return 9728<=n&&n<=10175||126976<=n&&n<=129791}var sw=[],id="\\x1b",wf="\\x07",lw=new RegExp(`${id}\\[[0-?]*[ -/]*[@-~]`,"g"),dw=new RegExp(`${id}\\][^${wf}]*(?:${wf}|${id}\\\\)`,"g");function xf(n){if(!n)return sw;if(n.includes("\x1B"))return uw(n);let e=cw(n);return e||Array.from(rd.iterate(n),t=>t.segment)}function cw(n){let e=new Array(n.length);for(let t=0;t<n.length;t+=1){let r=n.charCodeAt(t);if(r>=128||r===13)return;e[t]=n[t]??""}return e}function uw(n){let e=hw(n);if(e)return e;if(gw(n))return bw(n);let t=[],r="",o="",i="",a="";for(let s=0;s<n.length;){if(n.charCodeAt(s)===27){let d=St(n,s);if(d){d.endsWith("m")&&(r=Vo(r,d)),s+=d.length;continue}}let l=n[s];r===o&&l===i||(o=r,i=l,a=r?`${r}${l}\x1B[0m`:l),t.push(a),s+=l.length}return t}function hw(n){if(n.charCodeAt(0)!==27)return;let e="",t=0;for(let l=0;l<n.length;){let d=St(n,l);if(!d||!d.endsWith("m"))break;e=Vo(e,d),l+=d.length,t=l}if(t<=0||t>=n.length)return;let r=n.length;for(;r>t;){let l=yw(n,r);if(l===void 0||l<t)break;let d=n.slice(l,r);if(!d.endsWith("m")||!Ul(d))break;r=l}if(r<=t)return;for(let l=t;l<r;l+=1){let d=n.charCodeAt(l);if(d<32||d===127||d>=128)return}let o=r-t,i=new Array(o);if(!e){for(let l=0;l<o;l+=1)i[l]=n[t+l]??"";return i}let a="",s="";for(let l=0;l<o;l+=1){let d=n[t+l]??"";if(d===a){i[l]=s;continue}a=d,s=`${e}${d}\x1B[0m`,i[l]=s}return i}function $o(n){return n.replace(lw,"").replace(dw,"")}function Ue(n,e=0){if(!n)return 0;let t=fw(n,e);if(t!==void 0)return t;let r=mw(n,e);if(r!==void 0)return r;let o=0;for(let{char:i}of kf(n,Math.max(0,Math.floor(e)))){if(i.includes(`
`))break;o+=Ho(i)}return o}function fw(n,e=0){let t=Math.max(0,Math.floor(e));for(let r=t;r<n.length;r+=1){let o=n.charCodeAt(r);if(o===10)return r-t;if(o<32||o===127||o>=128)return}return Math.max(0,n.length-t)}function mw(n,e=0){let t=0;for(let r=Math.max(0,Math.floor(e));r<n.length;){let o=n.charCodeAt(r);if(o===10)return t;if(o===27){let i=Sf(n,r);if(!i)return;r+=i.length;continue}if(pw(o)){t+=1,r+=1;continue}return}return t}function pw(n){return n>=32&&n<127||n===9608||n===9607}function gw(n){for(let e=0;e<n.length;e++)if(n.charCodeAt(e)>=128||n.charCodeAt(e)===13)return!0;return!1}function*kf(n,e=0){let t=[],r="";for(let s=e;s<n.length;){let l=Sf(n,s);if(l){s+=l.length;continue}let d=s;for(s++;s<n.length&&n.charCodeAt(s)!==27;)s++;let c=n.slice(d,s),u=r.length;r+=c,t.push({start:u,end:r.length,rawStart:d})}let o=0,i=0,a=e;for(let s of rd.iterate(r)){for(;s.start>=t[o].end;)o++;for(;s.end>t[i].end;)i++;let l=t[o],d=t[i],c=l.rawStart+s.start-l.start,u=d.rawStart+s.end-d.start;yield{char:s.segment,prefix:n.slice(a,c),raw:n.slice(c,u),rawEnd:u},a=u}}function vf(n,e){for(let t=e.indexOf("\x1B");t!==-1;t=e.indexOf("\x1B",t+1)){let r=St(e,t);r?.endsWith("m")&&(n=Vo(n,r))}return n}function bw(n){let e=[],t="";for(let{char:r,prefix:o,raw:i}of kf(n))t=vf(t,o),e.push(t?`${t}${r}\x1B[0m`:r),t=vf(t,i);return e}function Sf(n,e){return St(n,e)??ww(n,e)}function yw(n,e){let t=n.lastIndexOf("\x1B[",e-1);if(t<0)return;let r=St(n,t);return r&&t+r.length===e?t:void 0}function ww(n,e){if(!n.startsWith("\x1B]",e))return;let t=e+2,r=n.indexOf("\x07",t),o=n.indexOf("\x1B\\",t),i=r>=0&&o>=0?Math.min(r,o):r>=0?r:o;if(!(i<0))return n.slice(e,i+(i===o?2:1))}function Ho(n){return bf(n.includes("\x1B")?$o(n):n)}function Ji(n,e){let t=Ue(n);return t===e?n:t<e?n+" ".repeat(Math.max(0,e-t)):`${$o(n).slice(0,Math.max(0,e-1))}\u2026`}function tr(n,e={}){let t=n.trim();return e.compact?`[${t}]`:`[ ${t} ]`}function Mf(n,e,t,r,o={}){n.length=0;let i=Math.max(0,Math.floor(o.gap??1)),a=t.column+Math.max(0,Math.floor(t.width)),s=t.row+Math.max(0,Math.floor(t.height)),l=Math.max(t.row,Math.floor(r)),d=t.column;for(let c of e){if(l>=s||t.width<=0)break;let u=Math.min(Ue(tr(c.label)),Math.max(0,t.width));if(u<=0)continue;if(d>t.column&&d+u>a&&(l+=1,d=t.column),l>=s)break;let h=c.disabled?"disabled":c.active?"active":"base";n.push({item:c,rect:{column:d,row:l,width:u,height:1},state:h,tone:c.tone}),d+=u+i}return Math.min(s,l+1)}function Tf(n,e){return vw(n,{row:e.row,column:e.column,width:e.width,prefix:e.prefix??"minimized ",entries:e.entries,mode:"shelf"})}function Rf(){return{buttons:[],items:[],placements:[]}}function vw(n,e){let t=e.column+Math.max(0,e.width),r=Math.min(Ue(e.prefix),Math.max(0,t-e.column)),o=n.items;o.length=e.entries.length;for(let l=0;l<e.entries.length;l+=1){let d=e.entries[l],c=d,u=e.mode==="tabs"&&c.selected===!0,h=e.mode==="shelf"||e.mode==="tabs"&&c.hidden===!0,f=e.mode==="tabs"?`${u?"\u25CF":h?"\u25CB":" "} ${d.title}`:d.title;o[l]={action:d.id,label:f,selected:u,hidden:h}}let i={column:e.column+r,row:e.row,width:Math.max(0,e.width-r),height:1};Mf(n.placements,o,i,e.row);let a=n.placements,s=n.buttons;s.length=a.length;for(let l=0;l<a.length;l+=1){let d=a[l],c=d.item;s[l]={id:c.action,label:c.label,rect:d.rect,selected:c.selected,hidden:c.hidden}}return{prefix:e.prefix,prefixRect:{column:e.column,row:e.row,width:r,height:1},buttons:s}}var ad={kind:"close",label:"x",accessibilityLabel:"Close window",shortcut:"C",tone:"danger",compact:!0},Cf={kind:"restore",label:"R",accessibilityLabel:"Restore window",shortcut:"R",tone:"muted",compact:!0},Ef={kind:"maximize",label:"M",accessibilityLabel:"Maximize window",shortcut:"F",tone:"success",compact:!0},sd={kind:"minimize",label:"-",accessibilityLabel:"Minimize window",shortcut:"M",tone:"warning",compact:!0},xw={kind:"always-on-top",label:"^",accessibilityLabel:"Keep window always on top",shortcut:"P",tone:"default",compact:!0},kw={kind:"always-on-top",label:"v",accessibilityLabel:"Return window to normal stacking",shortcut:"P",tone:"success",compact:!0},Sw=[ad,Cf,Ef,sd],Mw=[ad,Ef,sd],Tw=[ad,Cf,sd];function If(){return{buttons:[],hasWindowControls:!1}}function Af(n,e){let t=e.maximized===void 0?Sw:e.maximized?Tw:Mw,r=e.alwaysOnTop===void 0?t:[...t.slice(0,t.length-1),e.alwaysOnTop?kw:xw,t[t.length-1]],o=e.controlsMinWidth??r.length*4,i=e.configLabel??"config",a=n.buttons,s=0,l=e.rect.row,d=e.rect.column+e.rect.width-1,c=e.rect.width>=o;n.hasWindowControls=c;let u=d;if(c){let m=d;for(let g=0;g<r.length;g+=1){let y=r[g],b=Ue(tr(y.label,{compact:y.compact})),w=m-b;_f(a,r.length-g-1,y,w,l,b),u=w,m=w-1}s=r.length}let h=Ue(tr(i)),f=u-h-1,p=e.rect.column+Ue(e.title)+3;if(e.showConfig&&f>p)if(c){for(let m=s;m>0;m-=1)a[m]=a[m-1];a[0]=Rw({kind:"config",label:i,accessibilityLabel:e.configAccessibilityLabel??"Configure renderer",shortcut:e.configShortcut??"G",tone:"default",compact:!1},f,l,h),s+=1}else _f(a,0,{kind:"config",label:i,accessibilityLabel:e.configAccessibilityLabel??"Configure renderer",shortcut:e.configShortcut??"G",tone:"default",compact:!1},f,l,h),s=1;return a.length=s,n}function Of(n,e){let t=0;for(let r=0;r<e.buttons.length;r+=1){let o=e.buttons[r],i=tr(o.label,{compact:o.compact}),a=Math.max(0,Math.min(Ue(i),o.rect.width));if(a<=0)continue;let s=n[t]??{button:o,kind:o.kind,label:"",accessibilityLabel:"",shortcut:void 0,text:"",rect:{column:0,row:0,width:0,height:1},hitRect:{column:0,row:0,width:0,height:1},tone:o.tone,compact:o.compact};s.button=o,s.kind=o.kind,s.label=o.label,s.accessibilityLabel=o.accessibilityLabel,s.shortcut=o.shortcut,s.text=Ji(i,a),s.tone=o.tone,s.compact=o.compact,Oo(s.rect,o.rect.column,o.rect.row,a,1),Oo(s.hitRect,o.rect.column,o.rect.row,a,1),n[t]=s,t+=1}return n.length=t,n}function _f(n,e,t,r,o,i){let a=n[e]??{kind:t.kind,label:t.label,tone:t.tone,compact:t.compact,rect:{column:r,row:o,width:i,height:1}};a.kind=t.kind,a.label=t.label,a.accessibilityLabel=t.accessibilityLabel,a.shortcut=t.shortcut,a.tone=t.tone,a.compact=t.compact,a.rect.column=r,a.rect.row=o,a.rect.width=i,a.rect.height=1,n[e]=a}function Rw(n,e,t,r){return{kind:n.kind,label:n.label,accessibilityLabel:n.accessibilityLabel,shortcut:n.shortcut,tone:n.tone,compact:n.compact,rect:{column:e,row:t,width:r,height:1}}}var le=class extends Error{constructor(t,r,o="$",i){super(`${r} at ${o}`,{cause:i});this.code=t;this.path=o;this.cause=i;this.name="InputEnvelopeError"}},Pf=["terminal","browser","remote","test"],_w=["keyboard","mouse","touch","pen","clipboard","window","unknown"],Cw=["trusted","untrusted","synthetic"],Ew=["key","text","pointer","scroll","paste","focus","resize","composition","drop"],ld=["alt","ctrl","meta","shift"],Iw=["schemaVersion","sequence","timestamp","source","device","trust","modifiers","kind"],Aw=["data","raw"],Ow=["encoding","data"],Lw=["__proto__","constructor","prototype"],On="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Zi=Object.freeze({maxBytes:64*1024,maxDepth:16,maxNodes:4096,maxRawBytes:4*1024}),Dr=class{#e;#t;#i;#r;#o;#s;#n=0;constructor(e){if(!e||typeof e.now!="function")throw new le("invalid-value","factory now must be a function","$.now");let t=e.initialSequence??1;zf(t,"$.initialSequence");let r=e.sequenceOverflowPolicy??"throw";if(r!=="throw")throw new le("invalid-value","sequenceOverflowPolicy must be throw","$.sequenceOverflowPolicy");this.#e=e.now,this.#r=t,this.#i=r,this.#t=$f(e.limits)}create(e,t,r={}){Fo(e,Pf,"source","$.source");let o=r.trust??jw(e),i=r.device??t.device,a=zw(t.modifiers,r.modifiers),s={schemaVersion:1,sequence:this.#a(),timestamp:0,source:e,device:i,trust:o,modifiers:a,kind:t.kind};t.data!==void 0&&(s.data=t.data),r.includeRaw===!0&&t.raw!==void 0&&(s.raw=Hw(t.raw,this.#t.maxRawBytes));let l=this.#l();s.timestamp=l;let d=Nf(s,this.#t);return this.#c(d.sequence,l),d}terminal(e,t={}){return this.create("terminal",Pw(e,{includeRaw:t.includeRaw}),t)}browser(e,t={}){return this.create("browser",Nw(e,{includeRaw:t.includeRaw}),t)}remote(e,t={}){return this.create("remote",Ww(e,{includeRaw:t.includeRaw}),t)}test(e,t={}){return this.create("test",Vw(e,{includeRaw:t.includeRaw}),t)}inspect(){let e=Object.freeze({...this.#t}),t={schemaVersion:1,emitted:this.#n,exhausted:this.#r===void 0,nextSequence:this.#r,lastSequence:this.#o,lastTimestamp:this.#s,sequenceOverflowPolicy:this.#i,limits:e};return Object.freeze(t)}#a(){if(this.#r===void 0)throw new le("sequence-overflow","input sequence exhausted at Number.MAX_SAFE_INTEGER","$.sequence");return this.#r}#l(){let e;try{e=this.#e()}catch(t){throw new le("clock-failed","input clock threw","$.timestamp",t)}if(!Number.isFinite(e))throw new le("clock-failed","input clock must return a finite number","$.timestamp");return Object.is(e,-0)&&(e=0),this.#s===void 0?e:Math.max(this.#s,e)}#c(e,t){this.#o=e,this.#s=t,this.#r=e===Number.MAX_SAFE_INTEGER?void 0:e+1,this.#n+=1}};function Pw(n,e={}){return ea(n,e.includeRaw===!0)}function Nw(n,e={}){return ea(n,e.includeRaw===!0)}function Ww(n,e={}){if(!n||typeof n!="object")throw new le("invalid-shape","remote input must be an object","$.input");let t=ea(n.event,e.includeRaw===!0);if(!(n.kind==="keyPress"&&t.kind==="key"||n.kind==="mousePress"&&t.kind==="pointer"||n.kind==="mouseScroll"&&t.kind==="scroll"||n.kind==="paste"&&t.kind==="paste"||n.kind==="terminalFocus"&&t.kind==="focus"))throw new le("invalid-value",`remote kind ${String(n.kind)} does not match its event`,"$.input.kind");return t}function Vw(n,e={}){return ea(n,e.includeRaw===!0)}function ud(n,e){return Nf(n,$f(e))}function Nf(n,e){let t=ta(n,"$","input envelope");if(fd(t,Iw,Aw,"$","input envelope"),t.schemaVersion!==1)throw new le("unsupported-version",`unsupported input envelope schema version ${String(t.schemaVersion)}`,"$.schemaVersion");if(zf(t.sequence,"$.sequence"),typeof t.timestamp!="number"||!Number.isFinite(t.timestamp))throw new le("invalid-value","timestamp must be finite","$.timestamp");let r=Object.is(t.timestamp,-0)?0:t.timestamp,o=Fo(t.source,Pf,"source","$.source"),i=Fo(t.device,_w,"device","$.device"),a=Fo(t.trust,Cw,"trust","$.trust"),s=Fo(t.kind,Ew,"kind","$.kind"),l=cd(t.modifiers,"$.modifiers",!1),d={nodes:0,ancestors:new WeakSet,limits:e},c=t.data===void 0?void 0:Bw(t.data,"$.data",0,d),u=t.raw===void 0?void 0:$w(t.raw,e),h={schemaVersion:1,sequence:t.sequence,timestamp:r,source:o,device:i,trust:a,modifiers:l,kind:s};c!==void 0&&(h.data=c),u!==void 0&&(h.raw=u);let f=Object.freeze(h),p=JSON.stringify(f);return Gw(p,e.maxBytes,"$","canonical envelope"),f}function ea(n,e){if(!n||typeof n!="object")throw new le("invalid-shape","input event must be an object","$.event");let t=e?Dw(n):void 0;if(n.key==="paste")return Bo({kind:"paste",device:"clipboard",modifiers:Lf(),data:{text:n.text}},t);if(n.key==="focus")return Bo({kind:"focus",device:"window",modifiers:Lf(),data:{focused:n.focused}},t);if(n.key==="apc")throw new le("invalid-shape","terminal APC replies are not semantic input; subscribe to terminalApc instead","$.event");if(n.key!=="mouse")return Bo({kind:"key",device:"keyboard",modifiers:dd(n),data:{key:n.key}},t);let r={x:n.x,y:n.y,movementX:n.movementX,movementY:n.movementY};if("scroll"in n)return Bo({kind:"scroll",device:"mouse",modifiers:dd(n),data:{...r,direction:n.scroll,drag:n.drag}},t);let o="release"in n;return Bo({kind:"pointer",device:"mouse",modifiers:dd(n),data:{...r,phase:o?n.release?"up":n.drag?"move":"down":"move",button:o?n.button??null:null,drag:o?n.drag:!1}},t)}function Bo(n,e){return e===void 0?n:{...n,raw:e}}function Dw(n){if(!(n.buffer instanceof Uint8Array))throw new le("invalid-value","input event buffer must be Uint8Array","$.event.buffer");return new Uint8Array(n.buffer)}function dd(n){return{alt:!1,ctrl:n.ctrl,meta:n.meta,shift:n.shift}}function Lf(){return{alt:!1,ctrl:!1,meta:!1,shift:!1}}function zw(n,e){let t=cd(n??{},"$.event.modifiers",!0),r=cd(e??{},"$.options.modifiers",!0);return{alt:e?.alt===void 0?t.alt:r.alt,ctrl:e?.ctrl===void 0?t.ctrl:r.ctrl,meta:e?.meta===void 0?t.meta:r.meta,shift:e?.shift===void 0?t.shift:r.shift}}function cd(n,e,t){let r=ta(n,e,"modifiers");fd(r,t?[]:ld,t?ld:[],e,"modifiers");let o={alt:!1,ctrl:!1,meta:!1,shift:!1};for(let i of ld){let a=r[i];if(!(a===void 0&&t)){if(typeof a!="boolean")throw new le("invalid-value",`${i} modifier must be boolean`,`${e}.${i}`);o[i]=a}}return Object.freeze(o)}function $w(n,e){let t=ta(n,"$.raw","raw payload");if(fd(t,Ow,[],"$.raw","raw payload"),t.encoding!=="base64")throw new le("invalid-value","raw encoding must be base64","$.raw.encoding");if(typeof t.data!="string")throw new le("invalid-value","raw data must be a string","$.raw.data");return Uw(t.data,e.maxRawBytes,"$.raw.data"),Object.freeze({encoding:"base64",data:t.data})}function Hw(n,e){if(!(n instanceof Uint8Array))throw new le("invalid-value","raw input must be Uint8Array","$.event.raw");if(n.byteLength>e)throw new le("limit-exceeded",`raw payload exceeds ${e} bytes`,"$.raw.data");return Object.freeze({encoding:"base64",data:Hf(n)})}function Bw(n,e,t,r){let o=hd(n,e,t,r);if(o===null||Array.isArray(o)||typeof o!="object")throw new le("invalid-shape","semantic data must be a plain JSON object",e);return o}function hd(n,e,t,r){if(t>r.limits.maxDepth)throw new le("limit-exceeded",`semantic data exceeds depth ${r.limits.maxDepth}`,e);if(r.nodes+=1,r.nodes>r.limits.maxNodes)throw new le("limit-exceeded",`semantic data exceeds ${r.limits.maxNodes} nodes`,e);if(n===null||typeof n=="boolean"||typeof n=="string")return n;if(typeof n=="number"){if(!Number.isFinite(n))throw new le("invalid-value","JSON numbers must be finite",e);return Object.is(n,-0)?0:n}if(typeof n!="object")throw new le("invalid-value",`unsupported JSON value ${typeof n}`,e);if(r.ancestors.has(n))throw new le("invalid-value","cyclic JSON value",e);r.ancestors.add(n);try{if(Array.isArray(n))return Fw(n,e,t,r);let o=ta(n,e,"JSON object"),i={};for(let a of Object.keys(o).sort()){if(Yw(a))throw new le("invalid-value",`reserved object key ${a}`,`${e}.${a}`);i[a]=hd(o[a],nr(e,a),t+1,r)}return Object.freeze(i)}finally{r.ancestors.delete(n)}}function Fw(n,e,t,r){if(Object.getPrototypeOf(n)!==Array.prototype)throw new le("invalid-shape","JSON arrays must use Array.prototype",e);if(n.length>r.limits.maxNodes)throw new le("limit-exceeded",`JSON array exceeds ${r.limits.maxNodes} entries`,e);let o=Vf(n,e);for(let a of o){if(typeof a!="string")throw new le("invalid-shape","JSON arrays cannot contain symbol properties",e);if(a!=="length"&&!qw(a,n.length))throw new le("invalid-shape",`unexpected array property ${a}`,nr(e,a))}let i=[];for(let a=0;a<n.length;a+=1){let s=Df(n,String(a),`${e}[${a}]`);if(!s)throw new le("invalid-shape","sparse JSON arrays are not allowed",`${e}[${a}]`);Wf(s,`${e}[${a}]`),i.push(hd(s.value,`${e}[${a}]`,t+1,r))}return Object.freeze(i)}function ta(n,e,t){if(typeof n!="object"||n===null||Array.isArray(n))throw new le("invalid-shape",`${t} must be a plain object`,e);let r;try{r=Object.getPrototypeOf(n)}catch(o){throw new le("invalid-shape",`${t} prototype is not inspectable`,e,o)}if(r!==Object.prototype&&r!==null)throw new le("invalid-shape",`${t} cannot be an exotic or class instance`,e);for(let o of Vf(n,e)){if(typeof o!="string")throw new le("invalid-shape",`${t} cannot contain symbol properties`,e);let i=Df(n,o,nr(e,o));if(!i)throw new le("invalid-shape",`${t} property disappeared`,nr(e,o));Wf(i,nr(e,o))}return n}function Wf(n,e){if(!("value"in n)||!n.enumerable)throw new le("invalid-shape","JSON properties must be enumerable data properties without accessors",e)}function Vf(n,e){try{return Reflect.ownKeys(n)}catch(t){throw new le("invalid-shape","object keys are not inspectable",e,t)}}function Df(n,e,t){try{return Object.getOwnPropertyDescriptor(n,e)}catch(r){throw new le("invalid-shape","property descriptor is not inspectable",t,r)}}function fd(n,e,t,r,o){let i=[...e,...t];for(let a of Object.keys(n))if(!i.includes(a))throw new le("unknown-field",`${o} contains unknown field ${a}`,nr(r,a));for(let a of e)if(!Object.hasOwn(n,a))throw new le("invalid-shape",`${o} is missing ${a}`,nr(r,a))}function zf(n,e){if(typeof n!="number"||!Number.isSafeInteger(n)||n<0||Object.is(n,-0))throw new le("invalid-value","sequence must be a non-negative safe integer",e)}function Fo(n,e,t,r){if(typeof n!="string"||!e.includes(n))throw new le("invalid-value",`${t} is not supported`,r);return n}function $f(n){let e={maxBytes:Qi(n?.maxBytes,Zi.maxBytes,"$.limits.maxBytes",1),maxDepth:Qi(n?.maxDepth,Zi.maxDepth,"$.limits.maxDepth",0),maxNodes:Qi(n?.maxNodes,Zi.maxNodes,"$.limits.maxNodes",1),maxRawBytes:Qi(n?.maxRawBytes,Zi.maxRawBytes,"$.limits.maxRawBytes",0)};return Object.freeze(e)}function Qi(n,e,t,r){if(n===void 0)return e;if(!Number.isSafeInteger(n)||n<r)throw new le("invalid-value",`limit must be a safe integer >= ${r}`,t);return n}function jw(n){return n==="remote"?"untrusted":n==="test"?"synthetic":"trusted"}function Gw(n,e,t,r){if(new TextEncoder().encode(n).byteLength>e)throw new le("limit-exceeded",`${r} exceeds ${e} UTF-8 bytes`,t)}function Uw(n,e,t){if(n.length%4!==0||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(n))throw new le("invalid-value","raw data must be canonical base64",t);let r=n.endsWith("==")?2:n.endsWith("=")?1:0,o=n.length===0?0:n.length/4*3-r;if(o>e)throw new le("limit-exceeded",`raw payload exceeds ${e} bytes`,t);let i=Kw(n,o);if(Hf(i)!==n)throw new le("invalid-value","raw data must use canonical base64 padding bits",t)}function Hf(n){let e="";for(let t=0;t<n.length;t+=3){let r=n[t],o=n[t+1],i=n[t+2],a=r<<16|(o??0)<<8|(i??0);e+=On[a>>>18&63],e+=On[a>>>12&63],e+=o===void 0?"=":On[a>>>6&63],e+=i===void 0?"=":On[a&63]}return e}function Kw(n,e){let t=new Uint8Array(e),r=0;for(let o=0;o<n.length;o+=4){let i=On.indexOf(n[o]),a=On.indexOf(n[o+1]),s=n[o+2]==="="?0:On.indexOf(n[o+2]),l=n[o+3]==="="?0:On.indexOf(n[o+3]),d=i<<18|a<<12|s<<6|l;r<e&&(t[r++]=d>>>16&255),r<e&&(t[r++]=d>>>8&255),r<e&&(t[r++]=d&255)}return t}function qw(n,e){if(!/^(?:0|[1-9][0-9]*)$/.test(n))return!1;let t=Number(n);return Number.isSafeInteger(t)&&t>=0&&t<e&&String(t)===n}function Yw(n){return Lw.includes(n)}function nr(n,e){return/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(e)?`${n}.${e}`:`${n}[${JSON.stringify(e)}]`}var gd=class extends Ee{#e=0;#t;get value(){return super.value}set value(e){this.#i(e),super.value=e}jink(e){this.#i(e),super.jink(e)}get externalMutationRevision(){return this.#e}get lastExternallyAssignedValue(){return this.#t}publishOwned(e,t){t?super.value=e:super.jink(e)}#i(e){this.#t=e,this.#e=Jw(this.#e)}},Xw={workspace:0,window:1e3,chrome:2e3,popover:3e3,modal:4e3,system:5e3};function Jw(n){return n===Number.MAX_SAFE_INTEGER?0:n+1}function xd(n){return Xw[n]}function Bf(n,e){return n.column>=e.column&&n.column<e.column+e.width&&n.row>=e.row&&n.row<e.row+e.height}function Ff(n){let e=[];for(let t=0;t<n.length;t+=1)e.push(zr(n[t]));return e.sort((t,r)=>t.zIndex-r.zIndex||t.order-r.order||t.id.localeCompare(r.id)),e}var ia=class{surfaces;activeId;#e;#t;#i=0;#r=1;#o=new Map;#s=!1;#n;#a;#l;#c;constructor(e={}){let t=e.surfaces??[],r=[],o=new Set;for(let i=0;i<t.length;i+=1){let a=t[i],s=zr(a,a.order??i);if(oa(s,`Overlay surface ${i}`),o.has(s.id))throw new TypeError(`Overlay stack contains duplicate surface id ${JSON.stringify(s.id)}.`);o.add(s.id),this.#i=ra(this.#i,s.order,!1),r.push(s),this.#o.set(s.id,this.#h())}this.#e=new bd(r,(i,a)=>{this.#p(i,a)},()=>{this.#m(),this.#b()}),this.surfaces=this.#e,this.#t=new gd(e.activeId&&r.some(i=>i.id===e.activeId)?e.activeId:void 0),this.activeId=this.#t}register(e,t={}){let r=this.surfaces.peek(),o=jo(r,e.id);o||wd(this.#i);let i=zr(e,o?.order??this.#i);oa(i,"Registered overlay surface");let a=ra(this.#i,i.order,!o),s=this.#h();this.#o.set(i.id,s),this.#i=a;let l=o?md(r,e.id,i):e2(r,i);try{this.#g(l,t)}finally{i.visible&&this.#f(i.id,t.synchronizeFocus)}return i}update(e,t,r={}){let o=this.surfaces.peek(),i=jo(o,e);if(!i)return;let a=zr({...i,...t,id:e},i.order);oa(a,"Updated overlay surface");let s=ra(this.#i,a.order,!1);return this.#i=s,this.#g(md(o,e,a),r),a}open(e,t={}){return this.update(e,{visible:!0},t)&&this.bringToFront(e,t),this.surface(e)}close(e,t={}){let r=this.surface(e);return this.#u(e,t),r}toggle(e,t={}){return this.surface(e)?.visible?this.close(e,t):this.open(e,t)}remove(e,t={}){let r=this.surface(e);if(!r)return;this.#o.delete(e);let o=t2(this.surfaces.peek(),e),i=this.activeId.peek()===e?na(o):this.activeId.peek();try{this.#g(o,t)}finally{this.#f(i,t.synchronizeFocus)}return r}bringToFront(e,t={}){let r=this.surface(e);if(!r)return;let o=this.#d(),i=zr({...r,order:o,zIndex:void 0},o);try{this.#g(md(this.surfaces.peek(),e,i),t)}finally{this.#f(e,t.synchronizeFocus)}return i}surface(e){return jo(this.surfaces.peek(),e)}registrationGeneration(e){return this.#o.get(e)}activeMutationRevision(){return this.#t.externalMutationRevision}lastExternallyAssignedActiveId(){return this.#t.lastExternallyAssignedValue}synchronizeActiveId(e,t={}){let r=e===void 0?void 0:e&&this.surface(e)?e:na(this.surfaces.peek());this.#t.publishOwned(r,t.propagate??!0)}zOrder(){let e=this.#v(),t=[];for(let r=0;r<e.length;r+=1)t.push(e[r]);return t}top(){let e=this.#v();return e[e.length-1]}topModal(){return vd(this.#v())}hitTest(e,t={}){return Zw(this.#w(),e,t.respectModal)}handlePointerDown(e){let t=this.#v(),r=vd(t),o=r?Gf(t,r.id):void 0,i=r&&o?t.some(s=>o.has(s.id)&&Bf(e,s.rect)):!1;if(r&&!i)return r.closeOnOutsideClick?{blockingModal:r,closedIds:this.#u(r.id)}:{blockingModal:r,closedIds:[]};let a=this.hitTest(e,{respectModal:!!r});return a&&this.bringToFront(a.surface.id),{hit:a,blockingModal:r,closedIds:[]}}inspect(){let e=this.surfaces.peek(),t=new Array(e.length);for(let s=0;s<e.length;s+=1){let l=e[s];t[s]=rr(l)}let r=[];for(let s of e)s.visible&&r.push(rr(s));let o=this.#v(),i=new Array(o.length);for(let s=0;s<o.length;s+=1){let l=o[s];i[s]=rr(l)}let a=i[i.length-1];return{activeId:this.activeId.peek(),surfaces:t,visible:r,zOrder:i,top:a?rr(a):void 0}}snapshot(){let e=this.surfaces.peek(),t=this.activeId.peek();return Uf({activeId:t&&jo(e,t)?t:void 0,nextOrder:this.#i,surfaces:e})}restoreSnapshot(e,t={}){let r=n2(e),o=this.surfaces.peek(),i=new Map;for(let a of r.surfaces){let s=jo(o,a.id),l=this.#o.get(a.id);i.set(a.id,s&&l!==void 0&&i2(s,a)?l:this.#h())}this.#i=r.nextOrder,this.#o=i;try{this.#g(r.surfaces.map(rr),t)}finally{this.#f(r.activeId,t.synchronizeFocus)}}dispose(){this.#o.clear(),this.surfaces.dispose(),this.activeId.dispose()}#d(){wd(this.#i);let e=this.#i;return this.#i=e+1,e}#h(){if(!Number.isSafeInteger(this.#r))throw new RangeError("Overlay registration generation space exhausted.");return this.#r++}#u(e,t={}){let r=this.surfaces.peek(),o=jf(r,e),i=new Set(o),a=new Array(r.length);for(let d=0;d<r.length;d+=1){let c=r[d];a[d]=i.has(c.id)?zr({...c,visible:!1},c.order):c}let s=this.activeId.peek(),l=s&&i.has(s)?na(a):s;try{this.#g(a,t)}finally{this.#f(l,t.synchronizeFocus)}return o}#p(e,t){Qw(t.surfaces,"Externally assigned overlay surfaces");let r=new Map(this.#o),o=this.#r,i=this.#i;for(let a of[...r.keys()])t.byId.has(a)||r.delete(a);for(let[a,s]of t.byId)if(i=ra(i,s.order,!1),!(e.byId.get(a)===s&&r.has(a))){if(!Number.isSafeInteger(o))throw new RangeError("Overlay registration generation space exhausted.");r.set(a,o++)}this.#o=r,this.#r=o,this.#i=i}#b(){let e=this.activeId.peek();!e||this.surface(e)||this.#f(e,this.#s)}#f(e,t=!1){let r=e===void 0?void 0:e&&this.surface(e)?e:na(this.surfaces.peek());t?this.#t.publishOwned(r,!0):this.#t.value=r}#g(e,t={}){let r=this.#s;this.#s=t.synchronizeFocus??!1;try{this.#e.publishOwned(e)}finally{this.#s=r}}#m(){this.#n=void 0,this.#a=void 0,this.#l=void 0,this.#c=void 0}#w(){let e=this.surfaces.peek();return this.#n!==e&&(this.#n=e,this.#a=Ff(e),this.#l=void 0,this.#c=void 0),this.#a??[]}#v(){let e=this.surfaces.peek();if(this.#l!==e){let t=this.#w(),r=[];for(let o of t)o.visible&&r.push(o);this.#l=e,this.#c=r}return this.#c??[]}},bd=class extends Ee{#e;#t;#i=new WeakMap;#r;constructor(e,t,r){super(e),this.#e=t,this.#t=r,this.$value=this.#o(e),this.#r=Ln(this.peek())}get value(){return super.value}set value(e){let t=this.#o(e),r=Ln(t);this.#e(this.#r,r),this.#r=r;try{super.value=t}finally{this.#r=Ln(this.peek()),this.#t()}}jink(e){let t=this.#o(e),r=Ln(t);this.#e(this.#r,r),this.#r=r,super.jink(t),this.#t()}propagate(){try{this.#s(this.peek());let e=Ln(this.peek());this.#e(this.#r,e),this.#r=e,this.#t()}catch(e){let t=this.#o(this.#r.rollback.map(rr));throw super.jink(t),this.#r=Ln(t),this.#t(),e}super.propagate()}publishOwned(e){let t=this.#o(e);this.#r=Ln(t);try{super.value=t}finally{this.#r=Ln(this.peek()),this.#t()}}#o(e){if(this.#i.get(e))return this.#s(e),e;let r=[...e];for(let i=0;i<r.length;i+=1)r[i]=this.#n(r[i]);let o=Ht(r,this);return this.#i.set(o,r),o}#s(e){let t=this.#i.get(e)??e;for(let r=0;r<e.length;r+=1)t[r]=this.#n(e[r])}#n(e){let t=this.#i.get(e);if(t)return t.rect=this.#a(e.rect),e;let r={...e};r.rect=this.#a(r.rect);let o=Ht(r,this);return this.#i.set(o,r),o}#a(e){if(this.#i.get(e))return e;let r={...e},o=Ht(r,this);return this.#i.set(o,r),o}};function Ln(n){return{surfaces:[...n],byId:new Map(n.map(e=>[e.id,e])),rollback:n.map(rr)}}function Zw(n,e,t){let r=t===!1?void 0:vd(n),o=r?Gf(n,r.id):void 0;for(let i=n.length-1;i>=0;i-=1){let a=n[i];if(a.visible&&!(o&&!o.has(a.id))&&Bf(e,a.rect))return s2(a,e)}}function jf(n,e,t=!1){let r=new Map;for(let a of n){if(!a.ownerId||t&&!a.visible)continue;let s=r.get(a.ownerId);s?s.push(a.id):r.set(a.ownerId,[a.id])}let o=new Set([e]),i=[e];for(let a=0;a<i.length;a+=1)for(let s of r.get(i[a])??[])o.has(s)||(o.add(s),i.push(s));return i}function Gf(n,e){return new Set(jf(n,e,!0))}function na(n){let e=Ff(n).filter(t=>t.visible);return e[e.length-1]?.id}function Qw(n,e){let t=new Set;for(let r=0;r<n.length;r+=1){let o=n[r];if(oa(o,`${e} entry ${r}`),t.has(o.id))throw new TypeError(`${e} contains duplicate id ${JSON.stringify(o.id)}.`);t.add(o.id)}}function oa(n,e){if(typeof n.id!="string")throw new TypeError(`${e} id must be a string.`);if(!Yf(n.layer))throw new TypeError(`${e} layer is invalid.`);if(!Xf(n.kind))throw new TypeError(`${e} kind is invalid.`);if(!Number.isSafeInteger(n.zIndex))throw new TypeError(`${e} zIndex must be a safe integer.`);if(!Number.isSafeInteger(n.order)||n.order<0||n.order>=Number.MAX_SAFE_INTEGER)throw new TypeError(`${e} order must be a bounded non-negative safe integer.`);for(let[t,r]of Object.entries(n.rect))if(typeof r!="number"||!Number.isFinite(r))throw new TypeError(`${e} rect ${t} must be finite.`);if(typeof n.visible!="boolean"||typeof n.modal!="boolean")throw new TypeError(`${e} visibility and modal flags must be boolean.`);if(typeof n.closeOnOutsideClick!="boolean")throw new TypeError(`${e} closeOnOutsideClick must be boolean.`);if(n.ownerId!==void 0&&typeof n.ownerId!="string")throw new TypeError(`${e} ownerId must be a string when present.`)}function jo(n,e){for(let t=0;t<n.length;t+=1){let r=n[t];if(r.id===e)return r}}function md(n,e,t){let r=new Array(n.length);for(let o=0;o<n.length;o+=1){let i=n[o];r[o]=i.id===e?t:i}return r}function e2(n,e){let t=new Array(n.length+1);for(let r=0;r<n.length;r+=1)t[r]=n[r];return t[n.length]=e,t}function t2(n,e){let t=0;for(let i=0;i<n.length;i+=1)n[i].id!==e&&(t+=1);let r=new Array(t),o=0;for(let i=0;i<n.length;i+=1){let a=n[i];a.id!==e&&(r[o++]=a)}return r}function rr(n){return{...n,rect:{...n.rect}}}function Uf(n){let e=n.surfaces.map(t=>Object.freeze({...t,rect:Object.freeze({...t.rect})}));return Object.freeze({activeId:n.activeId,nextOrder:n.nextOrder,surfaces:Object.freeze(e)})}function n2(n){let e=yd(n,["activeId","nextOrder","surfaces"],["nextOrder","surfaces"],"overlay stack snapshot"),t=qf(e.nextOrder,"overlay stack snapshot nextOrder");if(!Array.isArray(e.surfaces))throw new TypeError("Overlay stack snapshot surfaces must be an array.");o2(e.surfaces,"overlay stack snapshot surfaces");let r=[],o=new Set,i=-1;for(let s=0;s<e.surfaces.length;s+=1){let l=r2(e.surfaces[s],s);if(o.has(l.id))throw new TypeError(`Overlay stack snapshot contains duplicate surface id ${JSON.stringify(l.id)}.`);o.add(l.id),i=Math.max(i,l.order),r.push(l)}if(r.length>0&&t<=i)throw new RangeError("Overlay stack snapshot nextOrder must be greater than every surface order.");let a=e.activeId;if(a!==void 0&&typeof a!="string")throw new TypeError("Overlay stack snapshot activeId must be a string when present.");if(a!==void 0&&!o.has(a))throw new TypeError(`Overlay stack snapshot activeId ${JSON.stringify(a)} is not registered.`);return Uf({activeId:a,nextOrder:t,surfaces:r})}function r2(n,e){let t=`overlay stack snapshot surface ${e}`,r=yd(n,["id","rect","layer","kind","zIndex","order","visible","modal","closeOnOutsideClick","ownerId"],["id","rect","layer","kind","zIndex","order","visible","modal","closeOnOutsideClick"],t);if(typeof r.id!="string")throw new TypeError(`${t} id must be a string.`);if(!Yf(r.layer))throw new TypeError(`${t} layer is invalid.`);if(!Xf(r.kind))throw new TypeError(`${t} kind is invalid.`);if(r.ownerId!==void 0&&typeof r.ownerId!="string")throw new TypeError(`${t} ownerId must be a string when present.`);let o=yd(r.rect,["column","row","width","height"],["column","row","width","height"],`${t} rect`);return{id:r.id,rect:{column:Go(o.column,`${t} rect column`),row:Go(o.row,`${t} rect row`),width:Go(o.width,`${t} rect width`),height:Go(o.height,`${t} rect height`)},layer:r.layer,kind:r.kind,zIndex:Kf(r.zIndex,`${t} zIndex`),order:qf(r.order,`${t} order`),visible:pd(r.visible,`${t} visible`),modal:pd(r.modal,`${t} modal`),closeOnOutsideClick:pd(r.closeOnOutsideClick,`${t} closeOnOutsideClick`),ownerId:r.ownerId}}function yd(n,e,t,r){if(!n||typeof n!="object"||Object.getPrototypeOf(n)!==Object.prototype)throw new TypeError(`${r} must be a plain object.`);let o=n,i=new Set(e),a=Reflect.ownKeys(o);for(let s of a){if(typeof s!="string"||!i.has(s))throw new TypeError(`${r} has an unexpected property.`);let l=Object.getOwnPropertyDescriptor(o,s);if(!l||!("value"in l)||!l.enumerable)throw new TypeError(`${r} properties must be enumerable data properties.`)}for(let s of t)if(!Object.hasOwn(o,s))throw new TypeError(`${r} is missing property ${JSON.stringify(s)}.`);return o}function o2(n,e){if(Object.getPrototypeOf(n)!==Array.prototype)throw new TypeError(`${e} must be a plain array.`);let t=Reflect.ownKeys(n);for(let r=0;r<n.length;r+=1){let o=String(r);if(!Object.hasOwn(n,o))throw new TypeError(`${e} must not contain holes.`);let i=Object.getOwnPropertyDescriptor(n,o);if(!i||!("value"in i)||!i.enumerable)throw new TypeError(`${e} entries must be enumerable data properties.`)}for(let r of t)if(r!=="length"&&(typeof r!="string"||!/^(0|[1-9]\d*)$/.test(r)||Number(r)>=n.length))throw new TypeError(`${e} has an unexpected property.`)}function Go(n,e){if(typeof n!="number"||!Number.isFinite(n))throw new TypeError(`${e} must be finite.`);return n}function Kf(n,e){let t=Go(n,e);if(!Number.isSafeInteger(t))throw new TypeError(`${e} must be a safe integer.`);return t}function qf(n,e){let t=Kf(n,e);if(t<0)throw new TypeError(`${e} must be non-negative.`);return t}function pd(n,e){if(typeof n!="boolean")throw new TypeError(`${e} must be a boolean.`);return n}function ra(n,e,t){if(!Number.isSafeInteger(n)||n<0)throw new RangeError("Overlay next-order allocator is outside the safe integer range.");if(!Number.isSafeInteger(e)||e<0||e>=Number.MAX_SAFE_INTEGER)throw new RangeError("Overlay surface order cannot leave room for a safe next-order allocation.");t&&wd(n);let r=t?n+1:n;return Math.max(r,e+1)}function wd(n){if(!Number.isSafeInteger(n)||n<0||n>=Number.MAX_SAFE_INTEGER)throw new RangeError("Overlay order allocator is exhausted.")}function Yf(n){return n==="workspace"||n==="window"||n==="chrome"||n==="popover"||n==="modal"||n==="system"}function Xf(n){return n==="workspace"||n==="window"||n==="titlebar"||n==="shelf"||n==="tab"||n==="menu"||n==="popover"||n==="modal"||n==="toast"||n==="tooltip"||n==="custom"}function zr(n,e=n.order??0){let t=n.layer??a2(n.kind),r=Math.max(0,Math.floor(n.order??e)),o=Math.floor(n.zIndex??xd(t)+r);return{id:n.id,rect:{...n.rect},layer:t,kind:n.kind??"custom",zIndex:o,order:r,visible:n.visible??!0,modal:n.modal??n.kind==="modal",closeOnOutsideClick:n.closeOnOutsideClick??!1,ownerId:n.ownerId}}function i2(n,e){return n.id===e.id&&n.layer===e.layer&&n.kind===e.kind&&n.modal===e.modal&&n.ownerId===e.ownerId}function a2(n){switch(n){case"workspace":return"workspace";case"window":return"window";case"titlebar":case"shelf":case"tab":return"chrome";case"menu":case"popover":case"tooltip":return"popover";case"modal":return"modal";case"toast":return"system";case"custom":case void 0:return"window"}}function s2(n,e){return{surface:n,column:e.column,row:e.row,localColumn:e.column-n.rect.column,localRow:e.row-n.rect.row}}function vd(n){for(let e=n.length-1;e>=0;e-=1){let t=n[e];if(t.visible&&t.modal)return t}}function kd(n){return n instanceof Error?n.message:String(n)}function Jf(n){return n===" "||n===`
`||n==="	"||n==="\r"||n==="\f"}function aa(n,e,t){return t.width!==0&&t.height!==0&&n>=t.column&&n<t.column+t.width&&e>=t.row&&e<t.row+t.height}function $r(n,e){return n===e||n.column===e.column&&n.row===e.row&&n.width===e.width&&n.height===e.height}var Uo={column:0,row:0,width:0,height:0};function or(n,e,t){let{column:r,row:o,width:i,height:a}=n,{column:s,row:l,width:d,height:c}=e;if(r>=s+d||s>=r+i||o>=l+c||l>=o+a)return!1;if(!t)return!0;let u=Math.min(r+i,s+d),h=Math.min(o+a,l+c),f=Math.max(0,u-Math.max(r,s));if(f===0)return!1;let p=Math.max(0,h-Math.max(o,l));return p===0?!1:(Uo.column=u-f,Uo.row=h-p,Uo.width=f,Uo.height=p,Uo)}var GR=Object.freeze({left:"\u2572",right:"\u2571",cross:"\u2573",horizontal:"\u2500",vertical:"\u2502"}),l2={unit:"auto",value:0},Sd={top:0,right:0,bottom:0,left:0};function ir(n){return{unit:"cell",value:Math.max(0,Math.floor(c2(n,0)))}}function Pt(){return{...l2}}function la(){return{display:"block",position:"relative",flexDirection:"row",flexWrap:"nowrap",flexGrow:0,flexShrink:1,flexBasis:Pt(),order:0,alignItems:"stretch",alignContent:"start",justifyContent:"start",alignSelf:"stretch",justifySelf:"stretch",gridTemplateColumns:[],gridTemplateRows:[],gridTemplateAreas:[],gridAutoColumns:Pt(),gridAutoRows:Pt(),direction:"ltr",gridAutoFlow:"row",gridAutoFlowDense:!1,gridColumn:{},gridRow:{},width:Pt(),height:Pt(),minWidth:ir(0),minHeight:ir(0),maxWidth:Pt(),maxHeight:Pt(),aspectRatio:void 0,boxSizing:"border-box",inset:{top:Pt(),right:Pt(),bottom:Pt(),left:Pt()},offsetX:0,offsetY:0,margin:{...Sd},padding:{...Sd},border:{...Sd},gap:0,rowGap:0,columnGap:0,overflowX:"visible",overflowY:"visible",zIndex:0,opacity:1,visibility:"visible",whiteSpace:"normal",overflowWrap:"normal",variables:{}}}function Zf(n){let e={...n,flexBasis:Ke(n.flexBasis),gridTemplateColumns:sa(n.gridTemplateColumns),gridTemplateRows:sa(n.gridTemplateRows),gridTemplateAreas:u2(n.gridTemplateAreas),...n.gridTemplateColumnsAutoRepeat?{gridTemplateColumnsAutoRepeat:{mode:n.gridTemplateColumnsAutoRepeat.mode,tracks:sa(n.gridTemplateColumnsAutoRepeat.tracks),insertAt:n.gridTemplateColumnsAutoRepeat.insertAt}}:{},...n.gridTemplateColumnsLineNames?{gridTemplateColumnsLineNames:n.gridTemplateColumnsLineNames.map(r=>[...r])}:{},...n.gridTemplateRowsLineNames?{gridTemplateRowsLineNames:n.gridTemplateRowsLineNames.map(r=>[...r])}:{},...n.gridTemplateRowsAutoRepeat?{gridTemplateRowsAutoRepeat:{mode:n.gridTemplateRowsAutoRepeat.mode,tracks:sa(n.gridTemplateRowsAutoRepeat.tracks),insertAt:n.gridTemplateRowsAutoRepeat.insertAt}}:{},direction:n.direction,...n.logicalEdges?{logicalEdges:{...n.logicalEdges}}:{},gridAutoFlowDense:n.gridAutoFlowDense,gridAutoColumns:Ke(n.gridAutoColumns),gridAutoRows:Ke(n.gridAutoRows),gridColumn:{...n.gridColumn},gridRow:{...n.gridRow},width:Ke(n.width),height:Ke(n.height),minWidth:Ke(n.minWidth),minHeight:Ke(n.minHeight),maxWidth:Ke(n.maxWidth),maxHeight:Ke(n.maxHeight),inset:Md(n.inset),hatch:n.hatch?{...n.hatch}:void 0,layers:n.layers?[...n.layers]:void 0,margin:{...n.margin},padding:{...n.padding},border:{...n.border},variables:{...n.variables}},t=d2(n);return t&&(e.__layoutLengths={margin:t.margin?Md(t.margin):void 0,padding:t.padding?Md(t.padding):void 0,rowGap:t.rowGap?{...t.rowGap}:void 0,columnGap:t.columnGap?{...t.columnGap}:void 0}),e}var UR=Object.freeze({visualOnly:!0,documentOrder:"source order, always",focusOrder:"source order, always",guidance:"Use dense only where visual position does not encode meaning; readers and keyboard users traverse the source order."}),KR=Object.freeze({cells:"visual, always",resolution:"logical names map to physical edges at computed-value time from the final direction",ordering:"document and focus order are source order; RTL flips flex row axes only",hitTesting:"untouched \u2014 computed rects are physical",bidiText:"text reordering is out of scope for cell ordering"});function d2(n){return n.__layoutLengths}function Ke(n){let e=n.terms?{...n,terms:n.terms.map(t=>({...t}))}:{...n};return n.minTrack&&(e.minTrack=Ke(n.minTrack)),n.maxTrack&&(e.maxTrack=Ke(n.maxTrack)),n.limitTrack&&(e.limitTrack=Ke(n.limitTrack)),e}function Md(n){return{top:Ke(n.top),right:Ke(n.right),bottom:Ke(n.bottom),left:Ke(n.left)}}function c2(n,e){return Number.isFinite(n)?n:e}function sa(n){let e=new Array(n.length);for(let t=0;t<n.length;t+=1)e[t]=Ke(n[t]);return e}function u2(n){let e=new Array(n.length);for(let t=0;t<n.length;t+=1){let r=n[t],o=new Array(r.length);for(let i=0;i<r.length;i+=1)o[i]=r[i];e[t]=o}return e}function Td(n){let e={...n.attributes??{}},t=n.id??e.id??n.tag;e.id||(e.id=t);let r=n.classes??h2(e.class);return{id:t,tag:n.tag,classes:r.slice(),attributes:e,text:n.text,style:n.style?Zf(n.style):la(),children:[...n.children??[]],intrinsic:n.intrinsic?{...n.intrinsic}:void 0}}function h2(n){if(!n)return[];let e=[],t=-1;for(let r=0;r<=n.length;r+=1){let o=r<n.length?n[r]:" ";if(o!==void 0&&!Jf(o)){t<0&&(t=r);continue}t>=0&&(e.push(n.slice(t,r)),t=-1)}return e}var _d=1,m2=1,ne=class extends Error{constructor(t,r,o="$",i){super(`${r} at ${o}`,{cause:i});this.code=t;this.path=o;this.cause=i;this.name="PointerInputError"}},rm=["mouse","touch","pen"],p2=["down","move","up","cancel","enter","leave","wheel"],g2=["screen","cell","local"],b2=["pixel","line","page","cell"],y2=["schemaVersion","sequence","timestamp","source","trust","modifiers","pointerId","device","kind","coordinates","primary","button","buttons"],w2=["raw","pressure","tangentialPressure","tiltX","tiltY","twist","contact","wheel"],v2=["pointerId","kind","coordinates","primary","button","buttons"],Qf=["pressure","tangentialPressure","tiltX","tiltY","twist","contact","wheel"],Rd=["key","buffer","x","y","movementX","movementY","meta","ctrl","shift"],em=128,x2=80,k2=512;function Fr(n,e){let t=Kt(n,"$","pointer event");if(Mt(t,y2,w2,"$","pointer event"),t.schemaVersion!==_d)throw new ne("invalid-value",`unsupported pointer schema version ${String(t.schemaVersion)}`,"$.schemaVersion");let r=fa(t.device,rm,"pointer device","$.device"),o=fa(t.kind,p2,"pointer kind","$.kind"),i={schemaVersion:1,sequence:t.sequence,timestamp:t.timestamp,source:t.source,device:r,trust:t.trust,modifiers:t.modifiers,kind:sm(o)};t.raw!==void 0&&(i.raw=t.raw);let a=ud(i,e),s=Hr(t.pointerId,"$.pointerId"),l=S2(t.coordinates,"$.coordinates");if(typeof t.primary!="boolean")throw new ne("invalid-value","primary must be boolean","$.primary");let d=E2(t.button,"$.button"),c=Cd(t.buttons,0,63,"buttons","$.buttons"),u=ca(t.pressure,0,1,"pressure","$.pressure"),h=ca(t.tangentialPressure,-1,1,"tangentialPressure","$.tangentialPressure"),f=ca(t.tiltX,-90,90,"tiltX","$.tiltX"),p=ca(t.tiltY,-90,90,"tiltY","$.tiltY"),m=t.twist===void 0?void 0:Cd(t.twist,0,359,"twist","$.twist");if(r!=="pen"&&(h!==void 0||f!==void 0||p!==void 0||m!==void 0))throw new ne("invalid-value","tangential pressure, tilt, and twist are only valid for pen input","$.device");let g=t.contact===void 0?void 0:T2(t.contact,"$.contact"),y=t.wheel===void 0?void 0:R2(t.wheel,"$.wheel");if(o==="wheel"&&y===void 0)throw new ne("invalid-shape","wheel events require a wheel delta","$.wheel");if(o!=="wheel"&&y!==void 0)throw new ne("invalid-value","wheel delta is only valid for wheel events","$.wheel");let b={schemaVersion:_d,sequence:a.sequence,timestamp:a.timestamp,source:a.source,trust:a.trust,modifiers:a.modifiers,pointerId:s,device:r,kind:o,coordinates:l,primary:t.primary,button:d,buttons:c};return a.raw!==void 0&&(b.raw=a.raw),u!==void 0&&(b.pressure=u),h!==void 0&&(b.tangentialPressure=h),f!==void 0&&(b.tiltX=f),p!==void 0&&(b.tiltY=p),m!==void 0&&(b.twist=m),g!==void 0&&(b.contact=g),y!==void 0&&(b.wheel=y),Object.freeze(b)}function Id(n,e){return Ad(n,"mouse",e)}function om(n,e){return Ad(n,"touch",e)}function im(n,e){return Ad(n,"pen",e)}function Ad(n,e,t){let r=fa(e,rm,"pointer device","$.device"),o=Kt(t,"$.input","pointer adapter input");Mt(o,v2,Qf,"$.input","pointer adapter input");let i=ud(n);if(i.device!==r)throw new ne("invalid-value",`envelope device ${i.device} does not match ${r} adapter`,"$.envelope.device");let a={schemaVersion:_d,sequence:i.sequence,timestamp:i.timestamp,source:i.source,trust:i.trust,modifiers:i.modifiers,pointerId:o.pointerId,device:r,kind:o.kind,coordinates:o.coordinates,primary:o.primary,button:o.button,buttons:o.buttons};i.raw!==void 0&&(a.raw=i.raw);for(let d of Qf)o[d]!==void 0&&(a[d]=o[d]);let s=Fr(a),l=sm(s.kind);if(i.kind!==l)throw new ne("invalid-value",`envelope kind ${i.kind} does not match pointer kind ${s.kind}`,"$.envelope.kind");return s}function am(n,e,t={}){let r=_2(e),o=Kt(t,"$.options","terminal mouse pointer options");Mt(o,[],["pointerId","screen","local"],"$.options","terminal mouse pointer options");let i={cell:Object.freeze({space:"cell",x:r.x,y:r.y})};o.screen!==void 0&&(i.screen=o.screen),o.local!==void 0&&(i.local=o.local);let a,s=null,l=0,d;"scroll"in r?(a="wheel",d=Object.freeze({deltaX:0,deltaY:r.scroll,unit:"line"})):"release"in r?(a=r.release?"up":r.drag?"move":"down",(a==="down"||a==="up")&&(s=r.button??null),(a==="down"||a==="move")&&(l=C2(r.button))):a="move";let c={pointerId:o.pointerId===void 0?m2:Hr(o.pointerId,"$.options.pointerId"),kind:a,coordinates:i,primary:!0,button:s,buttons:l,...d===void 0?{}:{wheel:d}};return Id(n,c)}var da=Object.freeze({maxOwners:256,maxCaptures:256,maxListeners:256,maxDiagnostics:64}),ha=class{#e;#t=new Map;#i=new Map;#r=new Set;#o=[];#s=new Set;#n=0;#a=0;#l=!1;#c=!1;#d=!1;constructor(e={}){this.#e=A2(e)}get disposed(){return this.#l}registerOwner(e){this.#w("registerOwner");let t=Kt(e,"$.owner","pointer capture owner");Mt(t,["id","onPointer"],[],"$.owner","pointer capture owner");let r=ar(t.id,"$.owner.id");if(typeof t.onPointer!="function")throw new ne("invalid-value","owner onPointer must be a function","$.owner.onPointer");if(this.#t.has(r))throw new ne("duplicate",`pointer owner ${r} is already registered`,"$.owner.id");if(this.#t.size>=this.#e.maxOwners)throw new ne("limit-exceeded",`pointer owners exceed ${this.#e.maxOwners}`,"$.owner");let o={id:r,onPointer:t.onPointer,active:!0};return this.#t.set(r,o),Object.freeze({id:r,dispose:()=>{o.active&&this.#u(o)},isDisposed:()=>!o.active})}disposeOwner(e){this.#w("disposeOwner");let t=ar(e,"$.ownerId"),r=this.#t.get(t);return r?(this.#u(r),!0):!1}subscribe(e){if(this.#w("subscribe"),typeof e!="function")throw new ne("invalid-value","capture listener must be a function","$.listener");if(this.#r.has(e))throw new ne("duplicate","capture listener is already registered","$.listener");if(this.#r.size>=this.#e.maxListeners)throw new ne("limit-exceeded",`capture listeners exceed ${this.#e.maxListeners}`,"$.listener");this.#r.add(e);let t=!0;return()=>{t&&(t=!1,this.#r.delete(e))}}capture(e,t){this.#w("capture");let r=Hr(e,"$.pointerId"),o=ar(t,"$.ownerId");this.#f(r,"capture");let i=this.#h(o),a=this.#i.get(r);if(a){let s=a===i?"duplicate":"capture-conflict";throw new ne(s,`pointer ${r} is already captured by ${a.id}`,"$.pointerId")}if(this.#i.size>=this.#e.maxCaptures)throw new ne("limit-exceeded",`pointer captures exceed ${this.#e.maxCaptures}`,"$.pointerId");this.#i.set(r,i),this.#g("captured",r,void 0,i.id)}transfer(e,t,r){this.#w("transfer");let o=Hr(e,"$.pointerId"),i=ar(t,"$.fromOwnerId"),a=ar(r,"$.toOwnerId");if(this.#f(o,"transfer"),i===a)throw new ne("duplicate","capture transfer owners must differ","$.toOwnerId");let s=this.#h(i),l=this.#h(a),d=this.#i.get(o);if(!d)throw new ne("not-found",`pointer ${o} is not captured`,"$.pointerId");if(d!==s)throw new ne("capture-conflict",`pointer ${o} is captured by ${d.id}, not ${i}`,"$.fromOwnerId");this.#i.set(o,l),this.#g("transferred",o,s.id,l.id)}release(e,t){this.#w("release");let r=Hr(e,"$.pointerId"),o=ar(t,"$.ownerId"),i=this.#i.get(r);if(!i)return!1;if(i.id!==o)throw new ne("capture-conflict",`pointer ${r} is captured by ${i.id}, not ${o}`,"$.ownerId");return this.#i.delete(r),this.#g("released",r,i.id,void 0),!0}cancelAll(){return this.#w("cancelAll"),this.#b()}captureOwner(e){let t=Hr(e,"$.pointerId");return this.#i.get(t)?.id}route(e,t){this.#w("route");let r=Fr(e),o=t===void 0?void 0:ar(t,"$.hitOwnerId"),i=this.#i.get(r.pointerId),a=i!==void 0&&i.active,s=a?i:o===void 0?void 0:this.#t.get(o),l=r.kind==="up"||r.kind==="cancel",d=l&&!this.#s.has(r.pointerId);d&&this.#s.add(r.pointerId);let c,u=!1;try{if(s?.active){u=!0;let f=Object.freeze({ownerId:s.id,...o===void 0?{}:{hitOwnerId:o},captured:a});try{s.onPointer(r,f)}catch(p){c=nm(p),this.#m("owner-handler",p,r.pointerId,s.id)}}}finally{l&&this.#p(r.pointerId,"auto-released"),d&&this.#s.delete(r.pointerId)}let h={pointerId:r.pointerId,kind:r.kind,delivered:u,captured:a};return o!==void 0&&(h.hitOwnerId=o),s!==void 0&&(h.ownerId=s.id),c!==void 0&&(h.error=c),Object.freeze(h)}inspect(){let e=[...this.#i.entries()].sort(([i],[a])=>i-a),t=Object.freeze(e.map(([i,a])=>Object.freeze({pointerId:i,ownerId:a.id}))),r=Object.freeze([...this.#t.values()].sort((i,a)=>i.id.localeCompare(a.id)).map(i=>{let a=Object.freeze(e.filter(([,s])=>s===i).map(([s])=>s));return Object.freeze({id:i.id,capturedPointerIds:a})})),o=Object.freeze(this.#o.map(O2));return Object.freeze({disposed:this.#l,revision:this.#n,listenerCount:this.#r.size,owners:r,captures:t,diagnostics:o})}clearDiagnostics(){this.#w("clearDiagnostics"),this.#o.length=0}dispose(){if(!(this.#l||this.#c)){this.#c=!0;try{this.#d||this.#b()}finally{for(let e of this.#t.values())e.active=!1;this.#t.clear(),this.#i.clear(),this.#r.clear(),this.#s.clear(),this.#l=!0,this.#c=!1}}}#h(e){let t=this.#t.get(e);if(!t?.active)throw new ne("not-found",`pointer owner ${e} is not registered`,"$.ownerId");return t}#u(e){if(!e.active)return;e.active=!1,this.#t.get(e.id)===e&&this.#t.delete(e.id);let t=[...this.#i.entries()].filter(([,o])=>o===e).sort(([o],[i])=>o-i),r=[];for(let[o]of t)this.#i.delete(o),this.#s.has(o)||(this.#s.add(o),r.push(o));try{for(let[o]of t)this.#g("owner-disposed",o,e.id,void 0)}finally{for(let o of r)this.#s.delete(o)}}#p(e,t){let r=this.#i.get(e);r&&(this.#i.delete(e),this.#g(t,e,r.id,void 0))}#b(){if(this.#d)throw new ne("invalid-state","capture cancellation is already in progress","$.controller");let e=[...this.#i.entries()].sort(([t],[r])=>t-r);this.#d=!0,this.#i.clear();try{for(let[t,r]of e)this.#g("cancelled",t,r.id,void 0)}finally{this.#d=!1}return e.length}#f(e,t){if(this.#d||this.#s.has(e))throw new ne("invalid-state",`cannot ${t} pointer ${e} during terminal capture cleanup`,"$.pointerId")}#g(e,t,r,o){this.#n=tm(this.#n,"capture revision");let i=Object.freeze({revision:this.#n,kind:e,pointerId:t,...r===void 0?{}:{previousOwnerId:r},...o===void 0?{}:{nextOwnerId:o}}),a=[...this.#r];for(let s of a)try{s(i)}catch(l){this.#m("capture-listener",l,t,o??r)}}#m(e,t,r,o){if(this.#e.maxDiagnostics===0)return;this.#a=tm(this.#a,"diagnostic sequence");let i=Object.freeze({sequence:this.#a,phase:e,...r===void 0?{}:{pointerId:r},...o===void 0?{}:{ownerId:o},error:nm(t)});this.#o.length===this.#e.maxDiagnostics&&this.#o.shift(),this.#o.push(i)}#w(e){if(this.#l||this.#c)throw new ne("disposed",`cannot ${e} a disposed capture controller`,"$.controller")}};function S2(n,e){let t=Kt(n,e,"pointer coordinates");Mt(t,[],["screen","cell","local"],e,"pointer coordinates");let r={};for(let o of g2)t[o]!==void 0&&(r[o]=M2(t[o],o,`${e}.${o}`));if(r.screen===void 0&&r.cell===void 0&&r.local===void 0)throw new ne("invalid-shape","at least one coordinate space is required",e);return Object.freeze(r)}function M2(n,e,t){let r=Kt(n,t,`${e} coordinate`);if(Mt(r,["space","x","y"],[],t,`${e} coordinate`),r.space!==e)throw new ne("invalid-value",`${e} coordinate must declare space ${e}`,`${t}.space`);return Object.freeze({space:e,x:Br(r.x,"x",`${t}.x`),y:Br(r.y,"y",`${t}.y`)})}function T2(n,e){let t=Kt(n,e,"pointer contact");return Mt(t,["width","height"],[],e,"pointer contact"),Object.freeze({width:Ed(t.width,0,Number.MAX_VALUE,"contact width",`${e}.width`),height:Ed(t.height,0,Number.MAX_VALUE,"contact height",`${e}.height`)})}function R2(n,e){let t=Kt(n,e,"pointer wheel delta");return Mt(t,["deltaX","deltaY","unit"],[],e,"pointer wheel delta"),Object.freeze({deltaX:Br(t.deltaX,"wheel deltaX",`${e}.deltaX`),deltaY:Br(t.deltaY,"wheel deltaY",`${e}.deltaY`),unit:fa(t.unit,b2,"wheel unit",`${e}.unit`)})}function _2(n){let e=Kt(n,"$.event","terminal mouse event");if(Object.hasOwn(e,"scroll")?Mt(e,[...Rd,"drag","scroll"],[],"$.event","mouse scroll event"):Object.hasOwn(e,"release")||Object.hasOwn(e,"button")?Mt(e,[...Rd,"drag","release","button"],[],"$.event","mouse press event"):Mt(e,Rd,[],"$.event","mouse move event"),e.key!=="mouse")throw new ne("invalid-value","terminal mouse key must be mouse","$.event.key");if(!(e.buffer instanceof Uint8Array))throw new ne("invalid-value","terminal mouse buffer must be Uint8Array","$.event.buffer");for(let t of["x","y","movementX","movementY"])Br(e[t],t,`$.event.${t}`);for(let t of["meta","ctrl","shift"])if(typeof e[t]!="boolean")throw new ne("invalid-value",`${t} must be boolean`,`$.event.${t}`);if(Object.hasOwn(e,"scroll")){if(typeof e.drag!="boolean")throw new ne("invalid-value","drag must be boolean","$.event.drag");if(e.scroll!==-1&&e.scroll!==0&&e.scroll!==1)throw new ne("invalid-value","scroll must be -1, 0, or 1","$.event.scroll")}else if(Object.hasOwn(e,"release")){if(typeof e.drag!="boolean"||typeof e.release!="boolean")throw new ne("invalid-value","drag and release must be boolean","$.event");if(e.button!==void 0&&e.button!==0&&e.button!==1&&e.button!==2)throw new ne("invalid-value","terminal mouse button must be 0, 1, 2, or undefined","$.event.button");if(!e.release&&e.button===void 0)throw new ne("invalid-value","non-release mouse events require a button","$.event.button")}return e}function sm(n){return n==="wheel"?"scroll":"pointer"}function C2(n){return n===0?1:n===1?4:n===2?2:0}function Hr(n,e){if(typeof n!="number"||!Number.isSafeInteger(n)||n<0||Object.is(n,-0))throw new ne("invalid-value","pointerId must be a non-negative safe integer",e);return n}function E2(n,e){return n===null?null:Cd(n,0,5,"button",e)}function Cd(n,e,t,r,o){if(typeof n!="number"||!Number.isSafeInteger(n)||n<e||n>t)throw new ne("invalid-value",`${r} must be an integer from ${e} through ${t}`,o);return n}function Br(n,e,t){if(typeof n!="number"||!Number.isFinite(n))throw new ne("invalid-value",`${e} must be finite`,t);return Object.is(n,-0)?0:n}function Ed(n,e,t,r,o){let i=Br(n,r,o);if(i<e||i>t)throw new ne("invalid-value",`${r} must be from ${e} through ${t}`,o);return i}function ca(n,e,t,r,o){return n===void 0?void 0:Ed(n,e,t,r,o)}function ar(n,e){if(typeof n!="string"||n.length===0||n.length>em||I2(n))throw new ne("invalid-value",`owner id must be 1-${em} printable characters`,e);return n}function I2(n){for(let e=0;e<n.length;e+=1)if(n.charCodeAt(e)<=31)return!0;return!1}function A2(n){let e=Kt(n,"$.options","pointer capture options");return Mt(e,[],["maxOwners","maxCaptures","maxListeners","maxDiagnostics"],"$.options","pointer capture options"),Object.freeze({maxOwners:ua(e.maxOwners,da.maxOwners,1,"$.options.maxOwners"),maxCaptures:ua(e.maxCaptures,da.maxCaptures,1,"$.options.maxCaptures"),maxListeners:ua(e.maxListeners,da.maxListeners,1,"$.options.maxListeners"),maxDiagnostics:ua(e.maxDiagnostics,da.maxDiagnostics,0,"$.options.maxDiagnostics")})}function ua(n,e,t,r){if(n===void 0)return e;if(typeof n!="number"||!Number.isSafeInteger(n)||n<t||n>1e5)throw new ne("invalid-value",`controller limit must be an integer from ${t} through 100000`,r);return n}function tm(n,e){if(n===Number.MAX_SAFE_INTEGER)throw new ne("limit-exceeded",`${e} exhausted`,"$.controller");return n+1}function nm(n){let e="Error",t="pointer callback failed";try{n instanceof Error?(e=typeof n.name=="string"&&n.name.length>0?n.name:e,t=typeof n.message=="string"?n.message:t):t=String(n)}catch{}return Object.freeze({name:e.slice(0,x2),message:t.slice(0,k2)})}function O2(n){return Object.freeze({sequence:n.sequence,phase:n.phase,...n.pointerId===void 0?{}:{pointerId:n.pointerId},...n.ownerId===void 0?{}:{ownerId:n.ownerId},error:Object.freeze({...n.error})})}function Kt(n,e,t){if(typeof n!="object"||n===null||Array.isArray(n))throw new ne("invalid-shape",`${t} must be a plain object`,e);let r;try{r=Object.getPrototypeOf(n)}catch(a){throw new ne("invalid-shape",`${t} prototype is not inspectable`,e,a)}if(r!==Object.prototype&&r!==null)throw new ne("invalid-shape",`${t} cannot be an exotic or class instance`,e);let o;try{o=Reflect.ownKeys(n)}catch(a){throw new ne("invalid-shape",`${t} keys are not inspectable`,e,a)}let i=Object.create(null);for(let a of o){if(typeof a!="string")throw new ne("invalid-shape",`${t} cannot contain symbol properties`,e);let s;try{s=Object.getOwnPropertyDescriptor(n,a)}catch(l){throw new ne("invalid-shape",`${t} property is not inspectable`,ma(e,a),l)}if(!s||!("value"in s)||!s.enumerable)throw new ne("invalid-shape",`${t} properties must be enumerable data properties without accessors`,ma(e,a));i[a]=s.value}return i}function Mt(n,e,t,r,o){let i=[...e,...t];for(let a of Object.keys(n))if(!i.includes(a))throw new ne("unknown-field",`${o} contains unknown field ${a}`,ma(r,a));for(let a of e)if(!Object.hasOwn(n,a))throw new ne("invalid-shape",`${o} is missing ${a}`,ma(r,a))}function fa(n,e,t,r){if(typeof n!="string"||!e.includes(n))throw new ne("invalid-value",`${t} is not supported`,r);return n}function ma(n,e){return/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(e)?`${n}.${e}`:`${n}[${JSON.stringify(e)}]`}function ct(n,e,t){return e>=n.column&&t>=n.row&&e<n.column+Math.max(0,n.width)&&t<n.row+Math.max(0,n.height)}function Od(n,e){return n.column<e.column+e.width&&n.column+n.width>e.column&&n.row<e.row+e.height&&n.row+n.height>e.row}function lm(){return{}}var Pn={kind:"none"};function Ld(n,e,t={}){let r=t.doubleClickMs??400;switch(e.kind){case"down":{let o=e.id;if(o===void 0)return{state:{lastClick:n.lastClick},outcome:Pn};let i={id:o,column:e.column,row:e.row,moved:!1};return n.held?{state:{held:i,lastClick:n.lastClick},outcome:{kind:"recovered",id:n.held.id}}:{state:{held:i,lastClick:n.lastClick},outcome:Pn}}case"move":{let o=n.held;return o?o.moved?{state:n,outcome:Pn}:e.column===o.column&&e.row===o.row?{state:n,outcome:Pn}:{state:{held:{...o,moved:!0},lastClick:void 0},outcome:{kind:"drag",id:o.id}}:{state:n,outcome:Pn}}case"up":{let o=n.held;if(!o)return{state:n,outcome:Pn};if(o.moved)return{state:{lastClick:void 0},outcome:Pn};let i=n.lastClick;return i!==void 0&&i.id===o.id&&e.timestamp>=i.at&&e.timestamp-i.at<=r?{state:{},outcome:{kind:"double-click",id:o.id}}:{state:{lastClick:{id:o.id,at:e.timestamp}},outcome:{kind:"click",id:o.id}}}case"cancel":return{state:{lastClick:n.lastClick},outcome:Pn}}}var un=class extends Error{constructor(t,r,o,i){super(r);this.code=t;this.result=o;this.cause=i;this.name="MarkupWindowHistoryRestoreError"}},Nn=class extends un{constructor(e){super("snapshot-mismatch",e),this.name="MarkupWindowHistoryReplayConflictError"}},Wn=128,Bd=512,L2=32,P2=256,ym=Symbol("MarkupWindowHistorySemanticId"),dm=new WeakMap,$d=class{controller;history;#e;#t;#i;#r;#o;#s=!1;#n=0;#a=0;#l=0;#c=0;#d;#h;#u;#p;#b;constructor(e){this.controller=e.controller,this.history=e.history,this.#e=Vd(e.idPrefix,"window",Wn),this.#t=Vd(e.group,"windows",Wn),this.#i=e.label,this.#o=N2(this.controller),this.#r=e.restoreSnapshot??(t=>this.controller.restoreSnapshot(t))}get disposed(){return this.#s}focus(e){let t=Ge("focus",e);return this.#f(t,()=>this.controller.focus(e))}move(e,t){let r=Ge("move",e,void 0,{delta:t});return this.#f(r,()=>this.controller.move(e,t))}swap(e,t){let r=Ge("swap",e,t);return this.#f(r,()=>this.controller.swap(e,t))}dock(e,t,r,o={}){let i={edge:r};o.ratio!==void 0&&(i.ratio=o.ratio);let a=Ge("dock",e,t,i);return this.#f(a,()=>this.controller.dock(e,t,r,o))}resize(e,t,r,o={}){let i={delta:t,column:r.column,row:r.row,width:r.width,height:r.height};o.gap!==void 0&&(i.gap=o.gap),o.separatorHitSize!==void 0&&(i.separatorHitSize=o.separatorHitSize),o.compactMode!==void 0&&(i.compactMode=o.compactMode);let a=Ge("resize",e,void 0,i);return this.#f(a,()=>this.controller.resize(e,t,r,o))}resizeRatio(e,t){let r=Ge("resize-ratio",e,void 0,{delta:t});return this.#f(r,()=>this.controller.resizeRatio(e,t))}minimize(e){let t=Ge("minimize",e);return this.#f(t,()=>this.controller.minimize(e))}maximize(e){let t=Ge("maximize",e);return this.#f(t,()=>this.controller.maximize(e))}restore(e){let t=Ge("restore",e);return this.#f(t,()=>this.controller.restore(e))}close(e){let t=Ge("close",e);return this.#f(t,()=>this.controller.close(e))}setPlacement(e,t,r={}){let o=Ge("set-placement",e,void 0,{placement:t,...D2(r.rect)});return this.#f(o,()=>this.controller.setPlacement(e,t,r))}setFloatingRect(e,t){let r=Ge("set-floating-rect",e,void 0,ba(t));return this.#f(r,()=>this.controller.setFloatingRect(e,t))}moveBy(e,t){let r=Ge("move-by",e,void 0,um(t));return this.#f(r,()=>this.controller.moveBy(e,t))}resizeWindow(e,t,r){let o=Ge("resize-window",e,void 0,{edge:t,...um(r)});return this.#f(o,()=>this.controller.resizeWindow(e,t,r))}snap(e,t,r){let o=t.kind==="dock"?t.targetId:void 0,i={targetKind:t.kind,...ba(r,"bounds")};t.kind==="corner"?i.corner=t.corner:i.edge=t.edge,t.kind==="dock"&&t.ratio!==void 0&&(i.ratio=t.ratio);let a=Ge("snap",e,o,i);return this.#f(a,()=>this.controller.snap(e,t,r))}setAlwaysOnTop(e,t){let r=Ge("set-always-on-top",e,void 0,{value:t?1:0});return this.#f(r,()=>this.controller.setAlwaysOnTop(e,t))}setGroup(e,t){let r=Ge("set-group",e,void 0,{groupId:t??""});return this.#f(r,()=>this.controller.setGroup(e,t))}recoverBounds(e,t,r={}){let o=ba(t,"bounds");r.margin!==void 0&&(o.margin=r.margin),r.titleBarHeight!==void 0&&(o.titleBarHeight=r.titleBarHeight);let i=Ge("recover-bounds",e,void 0,o);return this.#f(i,()=>this.controller.recoverBounds(e,t,r))}beginGesture(e){let t=vm(e);if(this.#n+=1,this.#d=ya(t),this.#u=void 0,this.#s||this.controller.disposed||this.controller.mutationInProgress||this.#o.lease){let p=this.#s?"window-history-adapter-disposed":this.controller.disposed?"window-controller-disposed":this.controller.mutationInProgress?"window-controller-mutation-in-progress":Pd(this.#o.lease.kind);return this.#l+=1,this.#h=Nd(t,p,this.#s||this.controller.disposed?"disposed":"blocked"),$2(t,p)}let r=Symbol("MarkupWindowHistoryGesture");this.#o.lease={token:r,kind:"gesture"},this.#p=r;let o;try{o=ze(this.#m())}catch(p){throw this.#p===r&&(this.#p=void 0),this.#b=void 0,this.#o.lease?.token===r&&(this.#o.lease=void 0),this.#c+=1,p}let i=cm(t,o),a="active",s,l,d,c=!1,u=p=>{a=p,this.#p===r&&(this.#p=void 0),this.#b=void 0,this.#o.lease?.token===r&&(this.#o.lease=void 0)},h=p=>{throw this.#c+=1,this.#u=void 0,l=X2(p),u("failed"),p},f=Object.freeze({commit:()=>{if(a!=="active"||d)return!1;d="commit";try{if(this.#s){try{let g=ze(this.#m());this.#y(Wd(o,g,t),g,i)}catch(g){return h(g)}return s=!1,l="window-history-adapter-disposed",this.#l+=1,this.#h=pa(t,l),u("cancelled"),!1}let p;try{p=ze(this.#m())}catch(g){return h(g)}if(s=!sr(o,p),!s)return this.#l+=1,this.#h=ga(t,"unchanged","gesture-produced-no-state-change"),u("committed"),!1;let m;try{if(m=this.#g(t),a!=="active"||this.#o.lease?.token!==r)return!1;let g=ze(this.#m());if(c)return this.#y(Wd(o,g,t),g,i),s=!1,l="gesture-cancelled-during-commit",this.#l+=1,this.#h=ga(t,"unchanged",l),u("cancelled"),!1;if(!sr(p,g))throw this.#y(o,g,i),new Error("window-history-metadata-mutated-managed-state");let y=ze(o),b=ze(p),w=this.#x(y,b,i,r);this.history.push({...m,...w})}catch(g){if(a!=="active")return!1;try{this.#y(o,p,i)}catch(y){return h(zd(g,y))}return h(g)}return this.#a+=1,this.#u={...m},this.#h=ga(t,"applied"),u("committed"),!0}finally{d=void 0}},cancel:()=>{if(a!=="active")return!1;if(d==="commit")return c=!0,!1;if(d)return!1;d="cancel";try{let p=ze(this.#m());sr(o,p)||this.#y(Wd(o,p,t),p,i)}catch(p){return h(p)}finally{d=void 0}return s=!1,l="gesture-cancelled",this.#l+=1,this.#h=ga(t,"unchanged",l),u("cancelled"),!0},inspect:()=>({state:a,operation:ya(t),...s===void 0?{}:{changed:s},...l===void 0?{}:{reason:l}})});return this.#b=f.cancel,f}inspect(){return{disposed:this.#s,idPrefix:this.#e,group:this.#t,attemptedActions:this.#n,recordedActions:this.#a,skippedActions:this.#l,failedActions:this.#c,lastOperation:this.#d?structuredClone(this.#d):void 0,lastResult:this.#h?{...this.#h}:void 0,lastEntry:this.#u?{...this.#u}:void 0,history:this.history.inspect()}}dispose(){this.#s||(this.#s=!0,this.#b?.())}#f(e,t){if(this.#n+=1,this.#d=structuredClone(e),this.#s){let c=pa(e,"window-history-adapter-disposed");return this.#l+=1,this.#h=c,this.#u=void 0,c}if(this.controller.disposed){let c=pa(e,"window-controller-disposed");return this.#l+=1,this.#h=c,this.#u=void 0,c}if(this.controller.mutationInProgress){let c=Nd(e,"window-controller-mutation-in-progress","blocked");return this.#l+=1,this.#h=c,this.#u=void 0,c}if(this.#o.lease){let c=Pd(this.#o.lease.kind),u=Nd(e,c,"blocked");return this.#l+=1,this.#h=u,this.#u=void 0,u}let r=Symbol("MarkupWindowHistoryAction");this.#o.lease={token:r,kind:"action"};let o,i,a=!1,s,l=!0;try{s=ze(this.#m()),l=cm(e,s),o=this.#g(e);let c=ze(this.#m());if(!sr(s,c))throw this.#y(s,c,l),new Error("window-history-metadata-mutated-managed-state");let u=s,h=o;this.history.transactionSync(h,f=>{let p=ze(u),m=ze(p),g=!0,y,b,w=!0,x,k;if(f.apply({...h,undo:()=>{if(x){let C=x;x=void 0,C==="restore"&&(m=this.#v(m,void 0,l,r));return}if(w)try{m=this.#v(p,b,l,r)}catch(C){throw k=C instanceof Nn?"noop":"restore",C}},redo:()=>{if(k){let C=k;k=void 0,C==="restore"&&b&&(b=this.#v(b,void 0,l,r));return}if(g){g=!1,i=t(),y=ze(this.#m()),b=ze(y),w=!sr(p,y);return}if(!y)throw new Error(`Window action ${e.action} has no captured redo snapshot.`);try{b=this.#v(y,m,l,r)}catch(C){throw x=C instanceof Nn?"noop":"restore",C}}}),i?.status!=="applied"||!w){i?.status==="applied"&&(i={...i,status:"unchanged",ok:!0}),f.discard();return}a=!0})}catch(c){let u=c;if(s&&!this.history.isPoisoned())try{let h=ze(this.#m());sr(s,h)||this.#y(s,h,l)}catch(h){u=zd(c,h)}throw this.#c+=1,this.#h=i?{...i}:void 0,this.#u=void 0,u}finally{this.#o.lease?.token===r&&(this.#o.lease=void 0)}let d=i??pa(e,"controller-returned-no-result");return this.#h={...d},a?(this.#a+=1,this.#u={...o}):(this.#l+=1,this.#u=void 0),d}#g(e){let t=Vd(this.#i?.(ya(e)),"",Bd);return{id:W2(this.#e,e),label:t||z2(V2(e)),group:this.#t}}#m(){let e=structuredClone(this.controller.snapshot()),t=this.controller.inspect().modals.filter(r=>r.registered).map(r=>r.id);return{controller:e,workspaceRegistrations:e.windowIds.map(r=>({id:r,generation:this.controller.workspace.windowRegistrationGeneration(r)})),overlays:G2(t,this.controller.overlays,this.controller.overlays.snapshot())}}#w(e,t,r=!1){let o=this.controller.overlays.activeMutationRevision(),i=this.controller.overlays.snapshot(),a=new Map(i.surfaces.map(u=>[u.id,this.controller.overlays.registrationGeneration(u.id)])),s=ze(e);fm(s,t,this.controller.workspace),bm(s.overlays,t?.overlays,i,this.controller.overlays),U2(s.overlays,t?.overlays,i,r);let l;try{l=this.#r(structuredClone(s.controller))}catch(u){throw new un("controller-threw","Markup window controller threw while restoring a history snapshot.",void 0,u)}if(!l.ok)throw new un("controller-rejected",`Markup window controller rejected history restoration with status ${l.status}.`,{...l});fm(s,t,this.controller.workspace);let d=this.controller.overlays.snapshot();bm(s.overlays,t?.overlays,d,this.controller.overlays),K2(s.overlays,i,a,d,this.controller.overlays);try{if(q2(this.controller.overlays,s.overlays,d),this.controller.overlays.activeMutationRevision()!==o){let u=this.controller.overlays.snapshot(),h=this.controller.overlays.lastExternallyAssignedActiveId(),f=h&&u.surfaces.some(m=>m.id===h)?h:void 0;this.controller.overlays.synchronizeActiveId(f);let p=this.controller.overlays.snapshot();Fd(s.overlays,p.activeId,Nt(p.surfaces,s.overlays.rootIds))}}catch(u){throw new un("overlay-threw","Overlay stack threw while restoring managed window-history surfaces.",void 0,u)}let c=this.#m();if(!sr(c,s))throw new un("snapshot-mismatch","Markup window history restoration did not reproduce the required exact snapshot.");return ze(c)}#v(e,t,r,o){if(this.#o.lease){if(this.#o.lease.token===o)return this.#w(e,t,r);throw new Nn(`Markup window replay is blocked by ${Pd(this.#o.lease.kind)}.`)}if(t){let a;try{a=this.controller.snapshot()}catch(s){throw new un("controller-threw","Markup window controller threw while checking replay ownership.",void 0,s)}if(JSON.stringify(a)!==JSON.stringify(t.controller))throw new Nn("Markup window replay was rejected because managed controller or shared workspace state diverged.")}let i=Symbol("MarkupWindowHistoryReplay");this.#o.lease={token:i,kind:"replay"};try{return this.#w(e,t,r)}finally{this.#o.lease?.token===i&&(this.#o.lease=void 0)}}#x(e,t,r,o){let i=ze(e),a=ze(t),s,l;return{undo:()=>{if(s){let d=s;s=void 0,d==="restore"&&(i=this.#v(i,void 0,r,o));return}try{i=this.#v(e,a,r,o)}catch(d){throw l=d instanceof Nn?"noop":"restore",d}},redo:()=>{if(l){let d=l;l=void 0,d==="restore"&&(a=this.#v(a,void 0,r,o));return}try{a=this.#v(t,i,r,o)}catch(d){throw s=d instanceof Nn?"noop":"restore",d}}}}#y(e,t,r=!1){try{this.#w(e,t,r)}catch(o){try{this.#w(t,e,r)}catch(i){throw zd(o,i)}throw o}}};function wm(n){return new $d(n)}function N2(n){let e=dm.get(n);return e||(e={},dm.set(n,e)),e}function Pd(n){return n==="gesture"?"window-history-gesture-active":n==="replay"?"window-history-replay-active":"window-history-operation-active"}function cm(n,e){let t=n[ym]??n.id;return!(t!==void 0&&e.overlays.rootIds.includes(t))||n.action!=="focus"&&n.action!=="close"&&n.action!=="restore"}function Ge(n,e,t,r){return vm({action:n,id:e,targetId:t,parameters:r?{...r}:void 0})}function pa(n,e){return{action:n.action,status:"disposed",ok:!1,id:n.id,targetId:n.targetId,reason:e}}function Nd(n,e,t){return{action:n.action,status:t,ok:!1,id:n.id,targetId:n.targetId,reason:e}}function W2(n,e){let t=[n,e.action];return e.id&&t.push(Dd(e.id)),e.targetId&&t.push(Dd(e.targetId)),e.action==="dock"&&e.parameters?.edge&&t.push(Dd(String(e.parameters.edge))),t.join(".")}function V2(n){let e=hm(n.id??"unknown"),t=hm(n.targetId??"unknown");switch(n.action){case"focus":return`Focus surface ${e}`;case"move":return`Move window ${e}`;case"swap":return`Swap windows ${e} and ${t}`;case"dock":return`Dock window ${e} ${String(n.parameters?.edge??"beside")} ${t}`;case"resize":return`Resize split ${e}`;case"resize-ratio":return`Resize split ratio ${e}`;case"minimize":return`Minimize surface ${e}`;case"maximize":return`Maximize window ${e}`;case"restore":return`Restore surface ${e}`;case"close":return`Close surface ${e}`;case"set-placement":return`${n.parameters?.placement==="floating"?"Float":"Tile"} window ${e}`;case"set-floating-rect":return`Set floating rectangle ${e}`;case"move-by":return`Move floating window ${e}`;case"resize-window":return`Resize floating window ${e}`;case"snap":return`Snap window ${e}`;case"set-always-on-top":return`${n.parameters?.value===1?"Pin":"Unpin"} window ${e}`;case"set-group":return`${n.parameters?.groupId?"Group":"Ungroup"} window ${e}`;case"recover-bounds":return`Recover window bounds ${e}`;default:return`Update window ${e}`}}function ba(n,e=""){let t=r=>e?`${e}${r[0].toUpperCase()}${r.slice(1)}`:r;return{[t("column")]:n.column,[t("row")]:n.row,[t("width")]:n.width,[t("height")]:n.height}}function D2(n){return n?ba(n):{}}function um(n){return{columns:n.columns,rows:n.rows}}function ze(n){return structuredClone(n)}function Wd(n,e,t){let r=ze(n);return t.action!=="move-by"&&t.action!=="resize-window"||(r.controller.workspace=structuredClone(e.controller.workspace),r.controller.modals=e.controller.modals.map(o=>({...o})),r.overlays=structuredClone(e.overlays)),r}function sr(n,e){return JSON.stringify(n.controller)===JSON.stringify(e.controller)&&JSON.stringify(n.workspaceRegistrations)===JSON.stringify(e.workspaceRegistrations)&&JSON.stringify({activeId:n.overlays.activeId,externalActiveId:n.overlays.externalActiveId,rootIds:n.overlays.rootIds,registrations:n.overlays.registrations,surfaces:n.overlays.surfaces})===JSON.stringify({activeId:e.overlays.activeId,externalActiveId:e.overlays.externalActiveId,rootIds:e.overlays.rootIds,registrations:e.overlays.registrations,surfaces:e.overlays.surfaces})}function Vd(n,e,t){return hn(n,t)||e}function Dd(n){return encodeURIComponent(hn(n,Wn)).replaceAll(".","%2E")}function hm(n){return JSON.stringify(hn(n,Wn))}function vm(n){let e={},t=0,r=0,o=n.parameters??{};for(let s in o){if(r>=L2)break;if(r+=1,!Object.hasOwn(o,s))continue;let l=o[s],d=hn(s,Wn);if(d){if(typeof l=="number"){if(!Number.isFinite(l))continue;e[d]=l}else e[d]=hn(String(l),Wn);t+=1}}let i=typeof n.id=="string"?n.id.trim().slice(0,P2):void 0,a={action:n.action,id:i===void 0?void 0:hn(i,Wn),targetId:n.targetId===void 0?void 0:hn(n.targetId,Wn),...t===0?{}:{parameters:e}};return i!==void 0&&Object.defineProperty(a,ym,{value:i}),a}function ya(n){return{...n,...n.parameters?{parameters:{...n.parameters}}:{}}}function z2(n){return hn(n,Bd)||"Update window"}function hn(n,e){if(typeof n!="string"||e<=0)return"";let t=Math.min(n.length,e*4),r="";for(let o=0;o<t&&r.length<e;o+=1){let i=n.charCodeAt(o);if(i>=55296&&i<=56319){let a=o+1<t?n.charCodeAt(o+1):-1;a>=56320&&a<=57343&&r.length+2<=e?(r+=n[o]+n[o+1],o+=1):r+="\uFFFD";continue}r+=i>=56320&&i<=57343?"\uFFFD":n[o]}return r.trim()}function ga(n,e,t){return{action:n.action,status:e,ok:!0,id:n.id,targetId:n.targetId,...t===void 0?{}:{reason:t}}}function $2(n,e){let t={state:"unavailable",operation:ya(n),changed:!1,reason:e};return Object.freeze({commit:()=>!1,cancel:()=>!1,inspect:()=>structuredClone(t)})}function fm(n,e,t){let r=new Map((e?.workspaceRegistrations??n.workspaceRegistrations).map(x=>[x.id,x.generation])),o=new Set;for(let x of n.workspaceRegistrations){let k=r.get(x.id)??x.generation;t.windowRegistrationGeneration(x.id)!==k&&o.add(x.id)}let i=t.snapshot(),a=new Map,s=[],l=i.layout.root?[i.layout.root]:[];for(;l.length>0;){let x=l.pop();x.kind==="pane"?(a.set(x.windowId,structuredClone(x)),s.push({id:x.windowId,minWidth:x.minWidth,minHeight:x.minHeight})):l.push(x.second,x.first)}let d=new Set(mm(n.controller.workspace.layout.root).map(({id:x})=>x)),c=new Set([...n.workspaceRegistrations.map(({id:x})=>x),...e?.workspaceRegistrations.map(({id:x})=>x)??[]]),u=s.filter(({id:x})=>!d.has(x)&&!c.has(x));if(o.size===0&&u.length===0)return;if(o.size>0){n.controller.workspace.layout.root=Ko(n.controller.workspace.layout.root,o,a);let x=new Set(n.controller.windowIds.filter(k=>!o.has(k)));if(n.controller.windowIds=n.controller.windowIds.filter(k=>x.has(k)),n.controller.minimizedWindowIds=n.controller.minimizedWindowIds.filter(k=>x.has(k)),n.controller.closedWindowIds=n.controller.closedWindowIds.filter(k=>x.has(k)),n.controller.focusOrderWindowIds=n.controller.focusOrderWindowIds.filter(k=>x.has(k)),n.controller.placements=n.controller.placements.filter(k=>x.has(k.id)).map(k=>k.snapTarget?.kind==="dock"&&o.has(k.snapTarget.targetId)?{...k,snapTarget:void 0}:k),n.workspaceRegistrations=n.workspaceRegistrations.filter(k=>x.has(k.id)),n.controller.maximizedWindowId&&o.has(n.controller.maximizedWindowId)&&(n.controller.maximizedWindowId=void 0),!n.controller.activeWindowId||o.has(n.controller.activeWindowId)){let k=e?.controller.activeWindowId;n.controller.activeWindowId=k&&x.has(k)?k:[...n.controller.focusOrderWindowIds].reverse().find(C=>!n.controller.minimizedWindowIds.includes(C)&&!n.controller.closedWindowIds.includes(C))}}let h=new Set(u.map(({id:x})=>x));u.length>0&&(n.controller.workspace.layout.root=H2(n.controller.workspace.layout.root,i.layout.root,h));let f=F2(i.layout.root,i.layout.activePaneId),p=f&&h.has(f)?f:void 0;if(u.length>0){let x=mm(n.controller.workspace.layout.root),k=new Set(x.map(({id:C})=>C));n.controller.workspace.layout=Lo(n.controller.workspace.layout,[...x,...u.filter(({id:C})=>!k.has(C))],{activeWindowId:p})}let m=n.controller.activeWindowId,g=n.controller.placements.find(x=>x.id===m)?.placement,y=p?pm(n.controller.workspace.layout.root,p):m&&g==="tiled"?pm(n.controller.workspace.layout.root,m):void 0,b=gm(n.controller.workspace.layout.root,n.controller.workspace.layout.activePaneId)?n.controller.workspace.layout.activePaneId:void 0,w=gm(n.controller.workspace.layout.root,i.layout.activePaneId)?i.layout.activePaneId:void 0;n.controller.workspace.layout.activePaneId=y??b??w??j2(n.controller.workspace.layout.root)}function mm(n){let e=[],t=n?[n]:[];for(;t.length>0;){let r=t.pop();r.kind==="pane"?e.push({id:r.windowId,minWidth:r.minWidth,minHeight:r.minHeight}):t.push(r.second,r.first)}return e}function H2(n,e,t){if(!n||!e||t.size===0)return n;let r=new Map;for(let s of B2(n))r.set(s.windowId,s);let o=new Set,i=n,a=s=>{if(s.kind==="pane")return;let l=Hd(s,r,t);if(l.hasAddition&&!l.unsafe&&l.anchors.size===1){let d=l.anchors.values().next().value,c=r.get(d);if(c&&!o.has(d)){let u=new Set([d]),h=Ko(structuredClone(s),u,new Map([[d,c]]));h&&(i=Ko(i,u,new Map([[d,h]]))??i,o.add(d))}return}a(s.first),a(s.second)};return a(e),i}function Hd(n,e,t){if(n.kind==="pane")return t.has(n.windowId)?{hasAddition:!0,anchors:new Set,unsafe:!1}:e.has(n.windowId)?{hasAddition:!1,anchors:new Set([n.windowId]),unsafe:!1}:{hasAddition:!1,anchors:new Set,unsafe:!0};let r=Hd(n.first,e,t),o=Hd(n.second,e,t);return{hasAddition:r.hasAddition||o.hasAddition,anchors:new Set([...r.anchors,...o.anchors]),unsafe:r.unsafe||o.unsafe}}function B2(n){let e=[],t=n?[n]:[];for(;t.length>0;){let r=t.pop();r.kind==="pane"?e.push(r):t.push(r.second,r.first)}return e}function F2(n,e){if(!n||!e)return;let t=[n];for(;t.length>0;){let r=t.pop();if(r.kind==="pane"){if(r.id===e)return r.windowId}else t.push(r.second,r.first)}}function Ko(n,e,t){if(!n)return;if(n.kind==="pane")return e.has(n.windowId)?structuredClone(t.get(n.windowId)):n;let r=Ko(n.first,e,t),o=Ko(n.second,e,t);return!r||!o?r??o:{...n,first:r,second:o}}function pm(n,e){if(!n)return;let t=[n];for(;t.length>0;){let r=t.pop();if(r.kind==="pane"){if(r.windowId===e)return r.id}else t.push(r.second,r.first)}}function gm(n,e){if(!n||!e)return!1;let t=[n];for(;t.length>0;){let r=t.pop();if(r.kind==="pane"){if(r.id===e)return!0}else t.push(r.second,r.first)}return!1}function j2(n){if(!n)return;let e=[n];for(;e.length>0;){let t=e.pop();if(t.kind==="pane")return t.id;e.push(t.second,t.first)}}function G2(n,e,t){let r=n.slice(),o=Nt(t.surfaces,r),i=t.activeId&&o.has(t.activeId)?t.activeId:void 0;return{activeId:i,externalActiveId:t.activeId!==void 0&&i===void 0?t.activeId:void 0,nextOrder:t.nextOrder,rootIds:r.slice(),registrations:t.surfaces.filter(a=>o.has(a.id)).map(a=>({id:a.id,generation:e.registrationGeneration(a.id)})),surfaces:t.surfaces.filter(a=>o.has(a.id)).map(lr)}}function bm(n,e,t,r){let o=n.activeId,i=new Map(n.registrations.map(m=>[m.id,m.generation])),a=e?new Map(e.surfaces.map(m=>[m.id,m])):void 0,s=new Map(t.surfaces.map(m=>[m.id,m])),l=new Map(n.surfaces.map(m=>[m.id,m])),d=new Set,c=new Set;for(let m of n.rootIds){let g=s.get(m),y=i.get(m),b=a?.get(m);if(!(g&&r.registrationGeneration(m)===y&&(!a||b&&Y2(b,g))))for(let w of Nt(n.surfaces,[m]))d.add(w),c.add(w)}d.size>0&&(n.rootIds=n.rootIds.filter(m=>!d.has(m)),n.surfaces=n.surfaces.filter(m=>!d.has(m.id)),n.registrations=n.registrations.filter(m=>!d.has(m.id)),n.activeId&&d.has(n.activeId)&&(n.activeId=void 0));let u=Nt(t.surfaces,n.rootIds),h=Nt(n.surfaces,n.rootIds);for(let m of h){if(n.rootIds.includes(m))continue;let g=s.get(m);if(!g){for(let x of Nt(n.surfaces,[m]))d.add(x),c.add(x);continue}let y=r.registrationGeneration(m),b=i.get(m),w=a?.get(m);if(!(y===b&&(!a||w&&jd(w,g))))if(c.add(m),u.has(m)&&y!==void 0)l.set(m,lr(g)),i.set(m,y);else for(let x of Nt(n.surfaces,[m]))d.add(x),c.add(x)}for(let m of t.surfaces){if(!u.has(m.id)||h.has(m.id))continue;let g=r.registrationGeneration(m.id);g!==void 0&&(c.add(m.id),n.surfaces.push(lr(m)),n.registrations.push({id:m.id,generation:g}),l.set(m.id,lr(m)),i.set(m.id,g))}d.size>0&&(n.surfaces=n.surfaces.filter(m=>!d.has(m.id)),n.registrations=n.registrations.filter(m=>!d.has(m.id))),n.surfaces=n.surfaces.map(m=>l.get(m.id)??m),n.registrations=n.registrations.map(m=>({id:m.id,generation:i.get(m.id)??m.generation}));let f=Nt(n.surfaces,n.rootIds),p=o!==void 0&&!f.has(o);n.activeId&&!f.has(n.activeId)&&(n.activeId=void 0),t.activeId&&c.has(t.activeId)?f.has(t.activeId)?(n.activeId=t.activeId,n.externalActiveId=void 0):(n.activeId=void 0,n.externalActiveId=t.activeId):p&&t.activeId&&f.has(t.activeId)&&(n.activeId=t.activeId,n.externalActiveId=void 0)}function U2(n,e,t,r){let o=Nt(t.surfaces,n.rootIds),i=e?.externalActiveId??e?.activeId,a=e!==void 0&&t.activeId!==i;r||a?Fd(n,t.activeId,o):n.externalActiveId&&!t.surfaces.some(s=>s.id===n.externalActiveId)&&(n.externalActiveId=void 0)}function K2(n,e,t,r,o){n.externalActiveId&&!r.surfaces.some(d=>d.id===n.externalActiveId)&&(n.externalActiveId=void 0);let i=r.activeId;if(!i||i===e.activeId)return;let a=e.surfaces.find(d=>d.id===i),s=r.surfaces.find(d=>d.id===i),l=o.registrationGeneration(i)!==t.get(i);a&&s&&!l&&jd(a,s)||Fd(n,i,Nt(r.surfaces,n.rootIds))}function Fd(n,e,t){e&&t.has(e)?(n.activeId=e,n.externalActiveId=void 0):(n.activeId=void 0,n.externalActiveId=e)}function q2(n,e,t=n.snapshot()){let r=t,o=Nt(r.surfaces,e.rootIds),i=[],a=!1;for(let u of r.surfaces){if(o.has(u.id)){if(!a){for(let h of e.surfaces)i.push(lr(h));a=!0}continue}i.push(lr(u))}if(!a)for(let u of e.surfaces)i.push(lr(u));let s=e.nextOrder;for(let u of i)s=Math.max(s,u.order+1);let l=new Set(e.surfaces.map(u=>u.id)),c=(e.externalActiveId&&i.some(u=>u.id===e.externalActiveId)?e.externalActiveId:void 0)??(e.activeId&&l.has(e.activeId)?e.activeId:void 0);n.restoreSnapshot({activeId:c,nextOrder:s,surfaces:i},{synchronizeFocus:!0})}function Nt(n,e){let t=new Set(e),r=new Map;for(let i of n){if(!i.ownerId)continue;let a=r.get(i.ownerId);a?a.push(i.id):r.set(i.ownerId,[i.id])}let o=[...t];for(let i=0;i<o.length;i+=1)for(let a of r.get(o[i])??[])t.has(a)||(t.add(a),o.push(a));return t}function lr(n){return{...n,rect:{...n.rect}}}function Y2(n,e){return jd(n,e)&&n.rect.column===e.rect.column&&n.rect.row===e.rect.row&&n.rect.width===e.rect.width&&n.rect.height===e.rect.height&&n.closeOnOutsideClick===e.closeOnOutsideClick}function jd(n,e){return n.id===e.id&&n.layer===e.layer&&n.kind===e.kind&&n.modal===e.modal&&n.ownerId===e.ownerId}function zd(n,e){return new un("snapshot-mismatch","Window gesture restoration failed and compensation could not restore the prior snapshot.",void 0,new AggregateError([n,e],"Window gesture restoration and compensation both failed."))}function X2(n){return hn(n instanceof Error?n.message:String(n),Bd)||"window-history-gesture-failed"}var J2="markup-floating-windows",Z2=2,Q2=1,ev=1,tv=.2,nv=4,Yt=1e9,rv=128,xm=64;function Gd(n,e,t={}){let r=Mm(e),o=Sm(t);if(!(!r||!o)&&!n.topModalId)for(let i=n.floatingZOrder.length-1;i>=0;i-=1){let a=n.floatingZOrder[i];if(!(!a.visible||!fv(a.rect,r)))return Object.freeze({id:a.id,region:ov(a,r,o),rect:Object.freeze(qt(a.rect)),zIndex:a.zIndex,alwaysOnTop:a.alwaysOnTop})}}var va=class{controller;capture;history;#e;#t;#i;#r;#o;#s;#n=!1;#a;#l;#c=new Map;#d;#h=!1;#u=!1;constructor(e){if(!e||typeof e!="object")throw new TypeError("Window interaction options are required.");if(this.controller=e.controller,this.capture=e.capture,this.history=e.history,this.history&&this.history.controller!==this.controller)throw new TypeError("Window interaction history must wrap the same window controller.");this.#e=iv(e);let t=this.capture.registerOwner({id:this.#e.ownerId,onPointer:r=>{let o=this.#o,i=this.#s;if(!(!o||!i||this.#n||r.pointerId!==i.pointerId||r.kind!==i.kind||r.sequence!==i.sequence)){this.#n=!0;try{this.#a=this.#f(r,o)}catch(a){this.#a=this.#_(r,a)}}}});this.#t=t;try{this.#i=this.capture.subscribe(r=>this.#b(r))}catch(r){throw t.dispose(),r}}hitTest(e,t){if(!this.#h){this.#h=!0;try{if(this.#C()||this.controller.overlays.topModal())return;let r=km(t);if(!r)return;try{let o=Gd(this.controller.project(r),e,this.#e);return this.#C()?void 0:o}catch{return}}finally{this.#h=!1}}}handlePointer(e,t){if(this.#h)return fe({status:"blocked",handled:!1,reason:"interaction-route-is-reentrant"});this.#h=!0;try{return this.#p(e,t)}finally{this.#h=!1}}#p(e,t){let r=this.#C(),o;try{o=Fr(e)}catch{return r?this.#M(fe({status:"disposed",handled:!1,reason:"interaction-dependency-disposed"})):this.#M(fe({status:"ignored",handled:!1,reason:"pointer-event-is-invalid"}))}r=this.#C()||r;let i=this.#c.get(o.pointerId);if(i?.pointerId===o.pointerId&&o.kind!=="down")return this.#c.delete(o.pointerId),this.#M(fe({...i,pointerKind:i.pointerKind??o.kind}));if(i?.pointerId===o.pointerId&&this.#c.delete(o.pointerId),o.kind==="down"&&this.#c.size>=xm)return this.#M(fe({status:"blocked",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:"pending-lifecycle-settlement-capacity-exhausted"}));if(r)return this.#M(fe({status:"disposed",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:"interaction-dependency-disposed"}));if(this.#o)return this.#M(fe({status:"blocked",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:"interaction-route-is-reentrant"}));let a=km(t);if(this.#C()){let u=this.#c.get(o.pointerId);return u&&o.kind!=="down"?(this.#c.delete(o.pointerId),this.#M(fe({...u,pointerKind:u.pointerKind??o.kind}))):(u&&this.#c.delete(o.pointerId),this.#M(fe({status:"disposed",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:"interaction-dependency-disposed"})))}let s=this.capture.captureOwner(o.pointerId)===this.#e.ownerId;if(!a&&s&&this.#r?.pointerId===o.pointerId&&(o.kind==="up"||o.kind==="cancel")&&(a=qt(this.#r.bounds)),!a)return this.#M(fe({status:"ignored",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:"bounds-are-invalid-or-empty"}));let l;if(o.kind==="down"){if(!mv(o))return this.#M(Yo(o,"pointer-is-not-a-primary-activation"));let u=qo(o);if(!u)return this.#M(Yo(o,"pointer-has-no-finite-cell-coordinate"));let h=this.controller.overlays.topModal();if(h)return this.#M(fe({status:"blocked",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:`pointer-blocked-by-modal-overlay:${h.id}`}));let f;try{f=this.controller.project(a)}catch(m){return this.#M(fe({status:"failed",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:`window-projection-failed:${wt(m)}`}))}let p=Gd(f,u,this.#e);if(!p)return this.#M(Yo(o,"pointer-did-not-hit-a-floating-window"));if(p.region==="client")return this.#M(fe({status:"ignored",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,windowId:p.id,region:p.region,reason:"client-hit-is-not-a-window-geometry-gesture"}));if(f.floatingZOrder.find(m=>m.id===p.id)?.state==="maximized")return this.#M(fe({status:"blocked",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,windowId:p.id,region:p.region,reason:"maximized-window-geometry-is-not-interactive"}));l=this.#e.ownerId}else if(!s)return this.#M(Yo(o,"pointer-is-not-captured-by-this-controller"));this.#o=a,this.#s={kind:o.kind,pointerId:o.pointerId,sequence:o.sequence},this.#n=!1,this.#a=void 0;let d;try{d=this.capture.route(o,l).error?.message}catch(u){d=wt(u)}finally{this.#o=void 0,this.#s=void 0,this.#n=!1}let c=this.#a;return this.#a=void 0,c?this.#M(c):this.#M(fe({status:d?"failed":"ignored",handled:!1,pointerId:o.pointerId,pointerKind:o.kind,reason:d?`pointer-route-failed:${d}`:"pointer-route-had-no-owner"}))}inspect(){return this.#C(),{disposed:this.#u,ownerId:this.#e.ownerId,titleBarHeight:this.#e.titleBarHeight,resizeMargin:this.#e.resizeMargin,snapDistance:this.#e.snapDistance,snapEdgeSpanRatio:this.#e.snapEdgeSpanRatio,snapCornerReach:this.#e.snapCornerReach,snapOnRelease:this.#e.snapOnRelease,active:this.#r?pv(this.#r):void 0,lastResult:this.#l?wa(this.#l):void 0}}dispose(){if(this.#u)return;let e=this.#d;if(e){this.#D(e,!0),this.#i(),this.#t.dispose(),this.#u=!0;return}let t=this.#r,r=t?this.#R(t,"lifecycle","rollback"):void 0;try{if(t){try{this.#k(t);let o=fe({status:"cancelled",handled:!0,pointerId:t.pointerId,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:"controller-disposed"});this.#l=o,this.#N(o)}catch(o){let i=fe({status:"failed",handled:!0,pointerId:t.pointerId,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,reason:`dispose-cancellation-failed:${wt(o)}`});this.#l=i,this.#N(i)}this.#r=void 0}this.#i(),this.#t.dispose(),this.#u=!0}finally{r&&this.#O(r)}}#b(e){let t=this.#r,r=e.previousOwnerId===this.#e.ownerId&&e.nextOwnerId!==this.#e.ownerId;if(t&&r&&e.pointerId===t.pointerId)if(this.#d?.active===t)this.#D(this.#d,e.kind==="owner-disposed");else{let o=this.#R(t,"lifecycle","rollback"),i=`pointer-capture-${e.kind}`,a=!1;try{try{this.#k(t)}catch(l){a=!0,i+=`;cancel:${wt(l)}`}this.#r=void 0;let s=fe({status:a?"failed":e.kind==="owner-disposed"?"disposed":"cancelled",handled:!0,pointerId:t.pointerId,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:i});this.#l=s,this.#N(s)}finally{this.#O(o)}}e.kind==="owner-disposed"&&e.previousOwnerId===this.#e.ownerId&&(this.#i(),this.#u=!0)}#f(e,t){if(e.kind==="down")return this.#g(e,t);let r=this.#r;if(!r||r.pointerId!==e.pointerId)return Yo(e,"pointer-does-not-own-the-active-window-gesture");r.bounds=qt(t);let o=r.historyGesture?.inspect();return o?.state==="cancelled"||o?.state==="unavailable"?(this.#r=void 0,this.#T(e.pointerId),fe({status:"cancelled",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:r.windowId,mode:r.mode,region:r.region,updateCount:r.updateCount,historyRecorded:!1,reason:o.reason??"window-history-gesture-cancelled"})):o?.state==="failed"?this.#_(e,new Error(o.reason??"window-history-gesture-failed")):e.kind==="cancel"?this.#A(e,r):e.kind==="move"?this.#y(e,r,t):e.kind==="up"?this.#S(e,r,t):fe({status:"ignored",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:r.windowId,mode:r.mode,region:r.region,updateCount:r.updateCount,reason:"pointer-kind-does-not-update-window-geometry"})}#g(e,t){if(this.#r)return fe({status:"blocked",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,reason:"another-window-gesture-is-active"});let r=qo(e),o=this.#m(r,t);if(typeof o=="string")return this.#x(e,o);try{this.capture.capture(e.pointerId,this.#e.ownerId)}catch(c){return fe({status:"blocked",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:o.hit.id,mode:o.mode,region:o.hit.region,reason:`pointer-capture-failed:${wt(c)}`})}let i=this.#m(r,t,o);if(typeof i=="string"||this.capture.captureOwner(e.pointerId)!==this.#e.ownerId)return this.#T(e.pointerId),this.#x(e,typeof i=="string"?i:"pointer-capture-was-lost-during-gesture-start",o);let a,s,l,d;try{if(this.history){if(a=this.history.beginGesture({action:i.mode==="move"?"move-by":"resize-window",id:i.hit.id,parameters:i.mode==="resize"?{edge:i.hit.region}:void 0}),a.inspect().state!=="active")throw new Error(a.inspect().reason??"window-history-gesture-unavailable")}else s=this.controller.snapshot();let c=this.controller.focus(i.hit.id);if(!c.ok)throw new Error(c.reason??`focus-${c.status}`);let u=this.#m(r,t,i);typeof u=="string"?d=u:l=u;let h=a?.inspect();h&&h.state!=="active"&&(d=h.reason??`window-history-gesture-${h.state}`),this.capture.captureOwner(e.pointerId)!==this.#e.ownerId&&(d="pointer-capture-was-lost-during-gesture-start")}catch(c){d=`gesture-start-failed:${wt(c)}`}if(d||!l){let c;try{this.#v(a,s)}catch(u){c=wt(u)}return this.#T(e.pointerId),fe({status:c?"failed":this.#w()?"disposed":"blocked",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:i.hit.id,mode:i.mode,region:i.hit.region,historyRecorded:!1,reason:`${d??"gesture-start-invalidated"}${c?`;cancel:${c}`:""}`})}return this.#r={pointerId:e.pointerId,windowId:l.hit.id,mode:l.mode,region:l.hit.region,resizeEdge:l.mode==="resize"?l.hit.region:void 0,start:r,current:r,startRect:qt(l.hit.rect),bounds:qt(t),updateCount:0,geometryPrepared:!1,groupId:l.projectedWindow.groupId,before:s,historyGesture:a},fe({status:"started",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:l.hit.id,mode:l.mode,region:l.hit.region,updateCount:0})}#m(e,t,r){if(this.#w())return"interaction-dependency-disposed-during-gesture-start";let o=this.controller.overlays.topModal();if(o)return`pointer-blocked-by-modal-overlay:${o.id}`;let i;try{i=this.controller.project(t)}catch(d){return`window-projection-failed:${wt(d)}`}let a=Gd(i,e,this.#e);if(!a||a.region==="client")return"gesture-hit-is-no-longer-actionable";let s=i.floatingZOrder.find(d=>d.id===a.id);if(!s)return"window-is-no-longer-visible";let l=a.region==="title-bar"?"move":"resize";return r&&(a.id!==r.hit.id||a.region!==r.hit.region||l!==r.mode)?"gesture-target-changed-during-start":s.state==="maximized"?"maximized-window-geometry-is-not-interactive":l==="move"&&s.groupId&&i.floatingWindows.some(d=>d.groupId===s.groupId&&d.snapTarget!==void 0)?"snapped-window-group-move-is-ambiguous":{hit:a,projectedWindow:s,mode:l}}#w(){return this.#u||this.capture.disposed||this.#t.isDisposed()||this.controller.disposed||!!this.history?.disposed}#v(e,t){if(e){let o=e.inspect();if(o.state==="active"){if(!e.cancel()&&e.inspect().state==="failed")throw new Error(e.inspect().reason??"history-gesture-cancel-failed")}else if(o.state==="failed")throw new Error(o.reason??"history-gesture-failed");return}if(!t)return;let r=this.controller.restoreSnapshot(t);if(!r.ok)throw new Error(r.reason??`snapshot-${r.status}`)}#x(e,t,r){return fe({status:this.#w()?"disposed":"blocked",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:r?.hit.id,mode:r?.mode,region:r?.hit.region,reason:t})}#y(e,t,r){let{projection:o,projectedWindow:i}=this.#P(t,r),a=qo(e);if(!a)return fe({status:"ignored",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,reason:"pointer-has-no-finite-cell-coordinate"});let s=sv(t.current,a);if(s.columns===0&&s.rows===0)return fe({status:"ignored",handled:!1,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,reason:"pointer-cell-did-not-change"});let l,d=qt(i.floatingRect);if(!t.geometryPrepared){let h=t.mode==="move"&&t.groupId?o.floatingWindows.filter(f=>f.visible&&f.groupId===t.groupId):[i];for(let f of h){let p=f.id===t.windowId&&t.mode==="move"&&f.snapTarget&&f.restoreRect?lv(f.restoreRect,t.startRect,t.start):f.rect,m=this.controller.setFloatingRect(f.id,p);if(!m.ok)throw new Error(m.reason??`window-${m.status}`);f.id===t.windowId&&(l=m,d=qt(p))}t.geometryPrepared=!0}let c=t.mode==="move"?this.controller.moveBy(t.windowId,s):this.controller.resizeWindow(t.windowId,t.resizeEdge,s);if(!c.ok)throw new Error(c.reason??`window-${c.status}`);if(t.mode==="move")t.current=a;else{let h=this.controller.project(r).floatingWindows.find(m=>m.id===t.windowId)?.floatingRect??d,f=dv(t.resizeEdge),p=cv(t.resizeEdge);t.current.column=f?t.current.column+uv(t.resizeEdge,d,h):a.column,t.current.row=p?t.current.row+hv(t.resizeEdge,d,h):a.row}t.bounds=qt(r);let u=l?.status==="applied"||c.status==="applied";return u&&(t.updateCount+=1),fe({status:u?"updated":"ignored",handled:u,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,action:c,reason:!u&&c.status==="unchanged"?"window-geometry-was-clamped-or-unchanged":void 0})}#P(e,t){let r=e.historyGesture?.inspect().state;if(r&&r!=="active")throw new Error(`window-history-gesture-${r}`);let o=this.controller.project(t),i=this.controller.overlays.topModal();if(i)throw new Error(`window-gesture-blocked-by-modal:${i.id}`);let a=o.floatingZOrder.find(s=>s.id===e.windowId);if(!a||a.state==="maximized")throw new Error(a?"maximized-window-geometry-is-not-interactive":"window-is-no-longer-visible");if(e.mode==="move"&&e.groupId&&o.floatingWindows.some(s=>s.groupId===e.groupId&&s.snapTarget!==void 0))throw new Error("snapped-window-group-move-is-ambiguous");return{projection:o,projectedWindow:a}}#S(e,t,r){let o=this.#R(t,"return","commit");try{return this.#I(e,t,r,o)}finally{this.#O(o)}}#I(e,t,r,o){let i=qo(e);i||this.#P(t,r);let a=i?this.#y(e,t,r):void 0;if(a?.status==="failed"||a?.status==="blocked")return this.#_(e,new Error(a.reason??"final-window-update-failed"));let s,l;if(t.mode==="move"&&t.updateCount>0&&!t.groupId&&this.#e.snapOnRelease){let u=qo(e)??t.current;if(s=Ud(u,r,this.#e.snapDistance,this.#e.snapEdgeSpanRatio,this.#e.snapCornerReach),s&&(l=this.controller.snap(t.windowId,s,r),!l.ok))return this.#_(e,new Error(l.reason??`snap-${l.status}`))}let d=!1;try{d=t.historyGesture?.commit()??!1}catch(u){return this.#_(e,u)}if(o.cancellationError)return this.#_(e,new Error(`settlement-cancellation-failed:${o.cancellationError}`));let c=t.historyGesture?.inspect();if(o.cancellationRequested&&!t.historyGesture){try{this.#k(t)}catch(u){return this.#_(e,u)}return this.#r=void 0,fe({status:"cancelled",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:o.disposalRequested?"controller-disposed-during-commit":"interaction-cancelled-during-commit"})}return this.#r=void 0,c?.state==="cancelled"||c?.state==="unavailable"?fe({status:"cancelled",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:c.reason??"window-history-gesture-cancelled"}):fe({status:"committed",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:d,snapTarget:s,action:l??a?.action})}#A(e,t){let r=this.#R(t,"return","rollback");try{try{this.#k(t)}catch(o){return this.#_(e,o)}return this.#r=void 0,fe({status:"cancelled",handled:!0,pointerId:e.pointerId,pointerKind:e.kind,windowId:t.windowId,mode:t.mode,region:t.region,updateCount:t.updateCount,historyRecorded:!1,reason:"pointer-cancelled"})}finally{this.#O(r)}}#k(e){let t,r;if(!this.controller.disposed)try{t=this.controller.snapshot()}catch(l){r=l}let o;try{if(e.historyGesture){if(!e.historyGesture.cancel()&&e.historyGesture.inspect().state==="failed")throw new Error(e.historyGesture.inspect().reason??"history-gesture-cancel-failed")}else if(e.before){let l=this.controller.restoreSnapshot(e.before);if(!l.ok)throw new Error(l.reason??`snapshot-${l.status}`)}}catch(l){o=l}if(o&&r)throw new AggregateError([r,o],"Gesture dependency capture and cancellation both failed.");if(o)throw o;if(r)throw r;if(!t||this.controller.disposed)return;let i=this.controller.snapshot();if(JSON.stringify(i.workspace)===JSON.stringify(t.workspace)&&JSON.stringify(i.modals)===JSON.stringify(t.modals))return;let a={...i,workspace:structuredClone(t.workspace),modals:t.modals.map(l=>({...l}))},s=this.controller.restoreSnapshot(a);if(!s.ok)throw new Error(s.reason??`dependency-snapshot-${s.status}`)}#_(e,t){let r=this.#r,o=r?this.#R(r,"return","rollback"):void 0;o&&(o.phase="rollback");let i;try{if(r){try{this.#k(r)}catch(a){i=wt(a)}this.#r=void 0}return this.#T(e.pointerId),fe({status:"failed",handled:!!r,pointerId:e.pointerId,pointerKind:e.kind,windowId:r?.windowId,mode:r?.mode,region:r?.region,updateCount:r?.updateCount,reason:`${wt(t)}${i?`;cancel:${i}`:""}`})}finally{o&&this.#O(o)}}#T(e){if(!(this.capture.disposed||this.capture.captureOwner(e)!==this.#e.ownerId))try{this.capture.release(e,this.#e.ownerId)}catch{}}#C(){if(this.#u)return!0;this.#$();let e=this.controller.disposed,t=this.history?.disposed??!1;if(!this.capture.disposed&&!this.#t.isDisposed()&&!e&&!t)return!1;let r=this.#r,o;if(r)if(this.#d?.active===r)this.#D(this.#d,!0);else{let i=this.#R(r,"lifecycle","rollback");try{try{this.#k(r)}catch(s){o=wt(s)}this.#r=void 0;let a=fe({status:o?"failed":"disposed",handled:!0,pointerId:r.pointerId,windowId:r.windowId,mode:r.mode,region:r.region,updateCount:r.updateCount,historyRecorded:!1,reason:o?`dependency-disposal-cancellation-failed:${o}`:"interaction-dependency-disposed"});this.#l=a,this.#N(a)}finally{this.#O(i)}}return this.#i(),this.#t.dispose(),this.#u=!0,!0}#$(){let e=this.#r;if(!e?.historyGesture)return;let t;try{t=e.historyGesture.inspect()}catch(o){t={state:"failed",operation:{action:"move-by",id:e.windowId},reason:wt(o)}}if(t.state==="active"||t.state==="committed")return;this.#r=void 0,this.#T(e.pointerId);let r=fe({status:t.state==="failed"?"failed":"cancelled",handled:!0,pointerId:e.pointerId,windowId:e.windowId,mode:e.mode,region:e.region,updateCount:e.updateCount,historyRecorded:!1,reason:t.reason??`window-history-gesture-${t.state}`});this.#l=r,this.#N(r)}#R(e,t,r){if(this.#d){if(this.#d.active!==e)throw new Error("A different window interaction is already settling.");return this.#d.claims+=1,this.#d}let o={active:e,delivery:t,phase:r,claims:1};return this.#d=o,o}#O(e){e.claims=Math.max(0,e.claims-1),e.claims===0&&this.#d===e&&(this.#d=void 0)}#D(e,t=!1){if(e.cancellationRequested=!0,t&&(e.disposalRequested=!0),!(e.phase!=="commit"||!e.active.historyGesture))try{e.active.historyGesture.cancel()}catch(r){e.cancellationError=wt(r)}}#N(e){e.pointerId!==void 0&&(this.#c.delete(e.pointerId),!(this.#c.size>=xm)&&this.#c.set(e.pointerId,wa(e)))}#M(e){return e.pointerId!==void 0&&e.status!=="started"&&e.status!=="updated"&&this.#c.delete(e.pointerId),this.#l=wa(e),e}};function ov(n,e,t){let r=n.rect,o=e.column-r.column,i=r.column+r.width-1-e.column,a=e.row-r.row,s=r.row+r.height-1-e.row,l=Math.min(t.resizeMargin,Math.ceil(r.width/2)),d=Math.min(t.resizeMargin,Math.ceil(r.height/2)),c=o<l,u=i<l,h=a<d,f=s<d,p=c&&u?o<=i?"left":"right":c?"left":u?"right":void 0;if((!p||r.width<=l*2)&&a<Math.min(t.titleBarHeight,r.height))return"title-bar";let m=h&&f?a<=s?"top":"bottom":h?"top":f?"bottom":void 0;return p&&m?`${m}-${p}`:p||m||"client"}function iv(n){let e,t,r,o,i,a,s;try{e=n.ownerId,t=n.titleBarHeight,r=n.resizeMargin,o=n.snapDistance,i=n.snapEdgeSpanRatio,a=n.snapCornerReach,s=n.snapOnRelease}catch{throw new TypeError("Window interaction options could not be read safely.")}let l=Sm({titleBarHeight:t,resizeMargin:r});if(!l)throw new RangeError("Window title-bar and resize metrics must be bounded non-negative integers.");let d=av(e),c=o??ev;if(!Number.isSafeInteger(c)||c<0||c>Yt)throw new RangeError("Window snap distance must be a bounded non-negative integer.");if(s!==void 0&&typeof s!="boolean")throw new TypeError("Window snapOnRelease must be boolean.");let u=i??tv;if(!Number.isFinite(u)||u<=0||u>1)throw new RangeError("Window snap edge span ratio must be in (0, 1].");let h=a??nv;if(!Number.isSafeInteger(h)||h<1||h>Yt)throw new RangeError("Window snap corner reach must be a bounded positive integer.");return{ownerId:d,...l,snapDistance:c,snapEdgeSpanRatio:u,snapCornerReach:h,snapOnRelease:s??!0}}function Sm(n){try{let e=n.titleBarHeight??Z2,t=n.resizeMargin??Q2;return!Number.isSafeInteger(e)||e<1||e>Yt||!Number.isSafeInteger(t)||t<0||t>Yt?void 0:{titleBarHeight:e,resizeMargin:t}}catch{return}}function av(n){let e=n?.trim()||J2;if(e.length>rv||gv(e))throw new TypeError("Window interaction owner id is invalid or too long.");return e}function km(n){try{let e=jr(n,"column"),t=jr(n,"row"),r=jr(n,"width"),o=jr(n,"height");if(e===void 0||t===void 0||r===void 0||o===void 0||![e,t,r,o].every(Number.isFinite))return;let i={column:Math.floor(e),row:Math.floor(t),width:Math.floor(r),height:Math.floor(o)};return!Number.isSafeInteger(i.column)||!Number.isSafeInteger(i.row)||i.width<1||i.height<1||i.width>Yt||i.height>Yt||Math.abs(i.column)>Yt||Math.abs(i.row)>Yt?void 0:i}catch{return}}function Mm(n){try{let e=jr(n,"column"),t=jr(n,"row");if(e===void 0||t===void 0||!Number.isFinite(e)||!Number.isFinite(t))return;let r={column:Math.floor(e),row:Math.floor(t)};return!Number.isSafeInteger(r.column)||!Number.isSafeInteger(r.row)||Math.abs(r.column)>Yt||Math.abs(r.row)>Yt?void 0:r}catch{return}}function jr(n,e){let t=Object.getOwnPropertyDescriptor(n,e);return t&&"value"in t&&typeof t.value=="number"?t.value:void 0}function qo(n){let e=n.coordinates.cell;return e?Mm({column:e.x,row:e.y}):void 0}function sv(n,e){return{columns:e.column-n.column,rows:e.row-n.row}}function lv(n,e,t){let r=e.width<=1?0:Math.max(0,Math.min(1,(t.column-e.column)/(e.width-1))),o=Math.round(r*Math.max(0,n.width-1)),i=Math.max(0,Math.min(n.height-1,t.row-e.row));return{...qt(n),column:t.column-o,row:t.row-i}}function dv(n){return n==="left"||n==="right"||n.endsWith("-left")||n.endsWith("-right")}function cv(n){return n==="top"||n==="bottom"||n.startsWith("top-")||n.startsWith("bottom-")}function uv(n,e,t){return n==="left"||n.endsWith("-left")?t.column-e.column:t.column+t.width-(e.column+e.width)}function hv(n,e,t){return n==="top"||n.startsWith("top-")?t.row-e.row:t.row+t.height-(e.row+e.height)}function fv(n,e){return e.column>=n.column&&e.row>=n.row&&e.column<n.column+n.width&&e.row<n.row+n.height}function mv(n){return n.primary&&(n.button===0||n.device!=="mouse"&&n.button===null)}function Ud(n,e,t,r,o){let i=e.column,a=e.column+e.width-1,s=e.row,l=e.row+e.height-1,d=n.column>=i-t&&n.column<=a+t,c=n.row>=s-t&&n.row<=l+t,u=c&&Math.abs(n.column-i)<=t,h=c&&Math.abs(n.column-a)<=t,f=d&&n.row<=s&&n.row>=s-t,p=d&&n.row>=l&&n.row<=l+t,m=n.column<=i+o-1,g=n.column>=a-o+1,y=n.row<=s+o-1,b=n.row>=l-o+1,w=f&&m||u&&y?"top-left":f&&g||h&&y?"top-right":p&&m||u&&b?"bottom-left":p&&g||h&&b?"bottom-right":void 0;if(w)return{kind:"corner",corner:w};let x=Math.max(1,Math.round(e.width*r/2)),k=i+(e.width-1)/2,C=Math.abs(n.column-k)<=x;if(f&&C)return{kind:"workspace",edge:"top"};if(p&&C)return{kind:"workspace",edge:"bottom"};if(u&&h)return{kind:"workspace",edge:Math.abs(n.column-i)<=Math.abs(n.column-a)?"left":"right"};if(u)return{kind:"workspace",edge:"left"};if(h)return{kind:"workspace",edge:"right"}}function Yo(n,e){return fe({status:"ignored",handled:!1,pointerId:n.pointerId,pointerKind:n.kind,reason:e})}function fe(n){let e=wa(n);return e.action&&Object.freeze(e.action),e.snapTarget&&Object.freeze(e.snapTarget),Object.freeze(e)}function wa(n){return{...n,action:n.action?{...n.action}:void 0,snapTarget:n.snapTarget?{...n.snapTarget}:void 0}}function pv(n){return{pointerId:n.pointerId,windowId:n.windowId,mode:n.mode,region:n.region,resizeEdge:n.resizeEdge,start:{...n.start},current:{...n.current},startRect:qt(n.startRect),updateCount:n.updateCount}}function qt(n){return{column:n.column,row:n.row,width:n.width,height:n.height}}function gv(n){for(let e=0;e<n.length;e+=1){let t=n.charCodeAt(e);if(t<=31||t===127)return!0}return!1}function wt(n){try{let e=n instanceof Error?n.message:String(n);return e.length>512?`${e.slice(0,511)}\u2026`:e}catch{return"uninspectable-window-interaction-error"}}var Ra=2,Qo=1,Tm={column:0,row:0,width:0,height:0},$e=1e6,jm=256,bv=128,ei=1024,Jd=4096,Zd=64,yv={margin:0,titleBarHeight:1},_a=class{workspace;overlays;#e=new Map;#t=new Map;#i=new Set;#r=new Map;#o=new Set;#s=new Map;#n=new Set;#a=new Set;#l=new Map;#c=new Map;#d=new Map;#h=new Map;#u=new Map;#p=new Set;#b=new Map;#f=[];#g;#m;#w;#v=[];#x=!1;#y=!1;constructor(e){this.workspace=e.workspace,this.overlays=e.overlays,this.#w=Fm(e.compactMode),this.reconcile(e.root,{layout:e.layout})}get disposed(){return this.#y}get mutationInProgress(){return this.#x}reconcile(e,t={}){this.#ne("reconcile");let r=this.#C();this.#x=!0;try{try{return this.#P(e,t)}catch(o){try{this.#$(r)}catch(i){throw new AggregateError([o,i],"Window reconciliation and rollback publication failed.")}throw o}}finally{this.#x=!1}}#P(e,t){this.#j(),this.#Y();let r=wv(e,t.layout),o=this.#e,i=this.#t,a=this.#i,s=this.#o,l=r.diagnostics.slice(),d=new Set(this.workspace.inspect().windows.filter(h=>!a.has(h.id)).map(h=>h.id)),c=new Map;for(let h of r.windows){if(d.has(h.id)){l.push({code:"workspace-id-conflict",severity:"error",id:h.id,message:`Workspace window id "${h.id}" is already owned outside the declarative integration.`});continue}let f=o.get(h.id);c.set(h.id,h),f?h.stateToken!==void 0&&h.stateToken!==f.stateToken&&this.#S(h,l):(this.#S(h,l),this.#I(h)),f&&(h.placementToken!==void 0&&h.placementToken!==f.placementToken&&this.#c.set(h.id,h.declaredPlacement),h.geometryToken!==void 0&&h.geometryToken!==f.geometryToken&&this.#R(h.id,h.declaredFloatingRect??Gr(h)),h.alwaysOnTopToken!==void 0&&h.alwaysOnTopToken!==f.alwaysOnTopToken&&this.#O(h.id,h.declaredAlwaysOnTop),h.groupToken!==void 0&&h.groupToken!==f.groupToken&&this.#D(h.id,h.declaredGroupId))}this.#e=c,this.#A(),this.#k();let u=new Map;for(let h of r.modals){let f=i.get(h.id),p=h.rect||!f?.rect?h:{...h,rect:Oe(f.rect)};u.set(p.id,p),f?p.openToken!==void 0&&p.openToken!==f.openToken&&this.#l.set(p.id,p.defaultOpen):this.#l.set(p.id,p.defaultOpen)}return this.#t=u,this.#N(),this.#M(a),this.#te(s,l),this.#H(),this.#v=l,this.inspect()}focus(e){let t=this.#U("focus",e);if(t)return t;if(this.#e.has(e)){if(!this.#V(e))return D("focus","blocked",e,void 0,"window-not-visible");if(this.#m&&this.#m!==e)return D("focus","blocked",e,void 0,"window-hidden-by-maximized-window");let i=this.#g===e,a=this.#ie(e);return this.#L(e)==="tiled"&&!this.workspace.focus(e)?D("focus","not-found",e):(this.#K(e),D("focus",i&&a?"unchanged":"applied",e))}return this.#t.get(e)?(this.#B(),(this.#o.has(e)?this.overlays.surface(e):void 0)?.visible?(this.overlays.bringToFront(e),D("focus","applied",e)):D("focus","blocked",e,void 0,"modal-not-visible")):D("focus","not-found",e)}move(e,t){let r=this.#G("move",e);return r||(!Number.isFinite(t)||Math.trunc(t)===0?D("move","invalid",e,void 0,"delta-must-be-a-non-zero-finite-number"):this.workspace.move(e,t)?(this.#K(e),D("move","applied",e)):D("move","unchanged",e))}setPlacement(e,t,r={}){let o=this.#G("set-placement",e);if(o)return o;if(t!=="tiled"&&t!=="floating")return D("set-placement","invalid",e,void 0,"placement-is-invalid");let i=this.#e.get(e),a;if(r.rect!==void 0&&(a=Kr(r.rect,i),!a))return D("set-placement","invalid",e,void 0,"floating-rect-is-invalid");let s=this.#L(e),l=this.#d.get(e);return s===t&&(!a||Xo(l,a))?D("set-placement","unchanged",e):(a?this.#R(e,a):t==="floating"&&!l&&this.#R(e,Gr(i)),this.#c.set(e,t),this.#u.delete(e),this.#K(e),this.#W(),D("set-placement","applied",e))}setFloatingRect(e,t){let r=this.#J("set-floating-rect",e);if(r)return r;let o=Kr(t,this.#e.get(e));return o?Xo(this.#d.get(e),o)&&!this.#u.has(e)?D("set-floating-rect","unchanged",e):(this.#R(e,o),this.#u.delete(e),D("set-floating-rect","applied",e)):D("set-floating-rect","invalid",e,void 0,"floating-rect-is-invalid")}moveBy(e,t){let r=this.#J("move-by",e);if(r)return r;let o=Em(t);if(!o)return D("move-by","invalid",e,void 0,"delta-must-use-non-zero-safe-cell-integers");let i=this.#b.get(e),a=i?[...this.#e.keys()].filter(l=>this.#b.get(l)===i&&this.#L(l)==="floating"):[e],s=new Map;for(let l of a){let d=this.#z(l),c=_v(d,o);if(!c)return D("move-by","invalid",e,void 0,"floating-rect-exceeds-cell-bounds");s.set(l,c)}for(let[l,d]of s)this.#R(l,d),this.#u.delete(l);return D("move-by","applied",e)}resizeWindow(e,t,r){let o=this.#J("resize-window",e);if(o)return o;if(!Nv(t))return D("resize-window","invalid",e,void 0,"resize-edge-is-invalid");let i=Em(r);if(!i)return D("resize-window","invalid",e,void 0,"delta-must-use-non-zero-safe-cell-integers");let a=this.#z(e),s=Cv(a,t,i,this.#e.get(e));return s?Xo(a,s)&&!this.#u.has(e)?D("resize-window","unchanged",e):(this.#R(e,s),this.#u.delete(e),D("resize-window","applied",e)):D("resize-window","invalid",e,void 0,"floating-rect-exceeds-cell-bounds")}snap(e,t,r){let o=this.#G("snap",e);if(o)return o;let i=Av(t);if(!i)return D("snap","invalid",e,void 0,"snap-target-is-invalid");let a=Kd(r);if(!a||a.width===0||a.height===0)return D("snap","invalid",e,void 0,"bounds-must-be-a-non-empty-finite-cell-rectangle");if(i.kind==="dock")return this.#e.has(i.targetId)?!this.#V(i.targetId)||this.#L(i.targetId)!=="tiled"?D("snap","blocked",e,i.targetId,"target-window-not-tiled-and-visible"):e===i.targetId||!this.workspace.dock(e,i.targetId,i.edge,{ratio:i.ratio})?D("snap","unchanged",e,i.targetId):(this.#c.set(e,"tiled"),this.#u.set(e,dr(i)),this.#K(e),this.#W(),D("snap","applied",e,i.targetId)):D("snap","not-found",e,i.targetId);let s=this.#e.get(e),l=this.#z(e),d=Am(i,a,s);return d?(this.#u.has(e)||this.#h.set(e,Oe(l)),this.#d.set(e,d),this.#c.set(e,"floating"),this.#u.set(e,dr(i)),this.#K(e),this.#W(),D("snap","applied",e)):D("snap","invalid",e,void 0,"snap-geometry-exceeds-cell-bounds")}setAlwaysOnTop(e,t){let r=this.#G("set-always-on-top",e);return r||(typeof t!="boolean"?D("set-always-on-top","invalid",e,void 0,"always-on-top-must-be-boolean"):this.#p.has(e)===t?D("set-always-on-top","unchanged",e):(this.#O(e,t),!this.#K(e)&&this.#g&&this.#q(this.#g),D("set-always-on-top","applied",e)))}setGroup(e,t){let r=this.#U("set-group",e);if(r)return r;if(!this.#e.has(e))return D("set-group","not-found",e);let o=tc(t);return t!==void 0&&o===void 0&&t.trim()!==""?D("set-group","invalid",e,void 0,"group-id-is-invalid-or-too-long"):this.#b.get(e)===o?D("set-group","unchanged",e):(this.#D(e,o),D("set-group","applied",e))}recoverBounds(e,t,r={}){let o=this.#J("recover-bounds",e);if(o)return o;let i=Kd(t),a=Ev(r);if(!i||!a)return D("recover-bounds","invalid",e,void 0,"bounds-or-recovery-options-are-invalid");let s=this.#z(e),l=Im(s,i,a);return l?Xo(s,l)&&!this.#u.has(e)?D("recover-bounds","unchanged",e):(this.#R(e,l),this.#u.delete(e),D("recover-bounds","applied",e)):D("recover-bounds","invalid",e,void 0,"recovered-geometry-exceeds-cell-bounds")}swap(e,t){let r=this.#G("swap",e,t);return r||(this.#e.has(t)?this.#V(t)?e===t||!this.workspace.swap(e,t)?D("swap","unchanged",e,t):(this.#K(e),D("swap","applied",e,t)):D("swap","blocked",e,t,"target-window-not-visible"):D("swap","not-found",e,t))}dock(e,t,r,o={}){let i=this.#G("dock",e,t);if(i)return i;if(!qr(r))return D("dock","invalid",e,t,"dock-edge-is-invalid");if(!this.#e.has(t))return D("dock","not-found",e,t);if(!this.#V(t)||this.#L(t)!=="tiled")return D("dock","blocked",e,t,"target-window-not-visible");if(e===t)return D("dock","unchanged",e,t);let a;try{let s=o.ratio;if(s!==void 0){if(typeof s!="number"||!Number.isFinite(s))return D("dock","invalid",e,t,"dock-ratio-must-be-finite");a=Math.max(.05,Math.min(.95,s))}}catch{return D("dock","invalid",e,t,"dock-options-are-invalid")}return this.workspace.dock(e,t,r,{ratio:a})?(this.#c.set(e,"tiled"),this.#u.set(e,a===void 0?{kind:"dock",targetId:t,edge:r}:{kind:"dock",targetId:t,edge:r,ratio:a}),this.#K(e),D("dock","applied",e,t)):D("dock","unchanged",e,t)}resize(e,t,r,o={}){let i=this.#U("resize",e);if(i)return i;if(!Number.isFinite(t)||Math.trunc(t)===0)return D("resize","invalid",e,void 0,"delta-must-be-a-non-zero-finite-number");let a=this.project(r,o);return a.workspace.separators.some(l=>l.splitId===e)?this.workspace.resizeSplit(e,t,r,{gap:o.gap,separatorHitSize:o.separatorHitSize,visibleWindowIds:a.visibleWindowIds})?D("resize","applied",e):D("resize","unchanged",e):D("resize","blocked",e,void 0,"split-not-visible")}resizeRatio(e,t){let r=this.#U("resize-ratio",e);return r||(!Number.isFinite(t)||t===0?D("resize-ratio","invalid",e,void 0,"delta-must-be-a-non-zero-finite-number"):this.#re(e)?this.workspace.resizeSplitRatio(e,t)?D("resize-ratio","applied",e):D("resize-ratio","unchanged",e):D("resize-ratio","blocked",e,void 0,"split-is-not-declaratively-owned"))}minimize(e){let t=this.#U("minimize",e);return t||(this.#e.has(e)?this.#a.has(e)?D("minimize","blocked",e,void 0,"window-closed"):this.#n.has(e)?D("minimize","unchanged",e):(this.#n.add(e),this.#m===e&&(this.#m=void 0),this.#g===e&&(this.#g=void 0),this.#H(),this.#W(),D("minimize","applied",e)):D("minimize","not-found",e))}maximize(e){let t=this.#G("maximize",e);return t||(this.#m===e?D("maximize","unchanged",e):(this.#m=e,this.#g=e,this.#q(e),this.#L(e)==="tiled"&&this.workspace.focus(e),this.#W(),D("maximize","applied",e)))}restore(e){let t=this.#U("restore",e);if(t)return t;let r=this.#e.get(e);if(r){if(!r.declaredVisible)return D("restore","blocked",e,void 0,"window-hidden-by-declaration");let a=this.#a.delete(e),s=this.#n.delete(e),l=this.#m===e;return l&&(this.#m=void 0),!a&&!s&&!l?D("restore","unchanged",e):(this.#K(e),this.#W(),D("restore","applied",e))}let o=this.#t.get(e);return o?o.declaredVisible?o.rect?(this.#B(),this.#o.has(e)?this.overlays.surface(e)?.visible?(this.#l.set(e,!0),D("restore","unchanged",e)):(this.#l.set(e,!0),this.overlays.open(e),D("restore","applied",e)):D("restore","blocked",e,void 0,"modal-overlay-id-conflict")):D("restore","unsupported",e,void 0,"modal-layout-geometry-unavailable"):D("restore","blocked",e,void 0,"modal-hidden-by-declaration"):D("restore","not-found",e)}close(e){let t=this.#U("close",e);if(t)return t;if(this.#e.has(e))return this.#a.has(e)?D("close","unchanged",e):(this.#a.add(e),this.#n.delete(e),this.#m===e&&(this.#m=void 0),this.#g===e&&(this.#g=void 0),this.#H(),this.#W(),D("close","applied",e));if(!this.#t.has(e))return D("close","not-found",e);if(this.#B(),!this.#o.has(e))return D("close","blocked",e,void 0,"modal-overlay-id-conflict");let r=this.overlays.surface(e);return this.#l.set(e,!1),r?.visible?(this.overlays.close(e),D("close","applied",e)):D("close","unchanged",e)}project(e,t={}){this.#ne("project"),this.#j(),this.#B();let r=Kd(e)??Oe(Tm),o=Fm(t.compactMode??this.#w),i=this.#oe(),a=Fv(t.visibleWindowIds,i),s=this.#m?this.#L(this.#m):void 0,l=this.#m?s==="tiled"&&i.includes(this.#m)?[this.#m]:[]:a,d=this.workspace.layout(r,{gap:t.gap,separatorHitSize:t.separatorHitSize,visibleWindowIds:l}),c=!this.#m&&l.length>1&&(o==="always"||o==="auto"&&!d.fitsMinimumSize),u;c&&(u=d.activeWindowId&&l.includes(d.activeWindowId)?d.activeWindowId:l[0],l=u?[u]:[],d=this.workspace.layout(r,{gap:t.gap,separatorHitSize:t.separatorHitSize,visibleWindowIds:l}));let h=[];for(let b of this.#e.values()){if(this.#L(b.id)!=="floating")continue;let w=this.#X(b.id),k=this.#V(b.id)&&(!this.#m||this.#m===b.id),C=this.#z(b.id),T=this.#u.get(b.id),S=k&&this.#m===b.id?Oe(r):T&&T.kind!=="dock"?Am(T,r,b)??C:C,A=k&&this.#m===b.id?Oe(r):Im(S,r,yv)??Oe(S),I=this.#f.indexOf(b.id);h.push({id:b.id,rect:A,floatingRect:Oe(C),restoreRect:Zo(this.#h.get(b.id)),snapTarget:T?dr(T):void 0,state:w,active:this.#g===b.id,visible:k,alwaysOnTop:this.#p.has(b.id),groupId:this.#b.get(b.id),focusOrder:I,zIndex:0,constraintsSatisfied:Yd(A,b)})}let f=h.filter(b=>b.visible).sort(Pv);for(let b=0;b<f.length;b+=1){let w=f[b];w.zIndex=(w.alwaysOnTop?2e3:1e3)+b}let p=new Set([...l,...f.map(b=>b.id)]),m=[];for(let b of this.#ee())p.has(b)||m.push(b);let g=this.#o,y=this.overlays.zOrder().filter(b=>g.has(b.id)).map(Ta);return{compact:c,compactMode:o,compactWindowId:u,maximizedWindowId:this.#m,eligibleWindowIds:i,visibleWindowIds:l.slice(),hiddenWindowIds:m,workspace:d,floatingWindows:h,floatingZOrder:f,modals:y,topModalId:this.overlays.topModal()?.id}}inspect(){this.#j(),this.#Y();let e=this.workspace.inspect(),t=this.#g&&this.#V(this.#g)?this.#g:void 0,r=[];for(let i of this.#e.values()){let a=this.#X(i.id),s=this.#L(i.id),l={id:i.id,title:i.title,minWidth:i.minWidth,minHeight:i.minHeight,declaredVisible:i.declaredVisible,state:a,placement:s,alwaysOnTop:this.#p.has(i.id),focusOrder:this.#f.indexOf(i.id),active:t===i.id,visible:this.#V(i.id)&&(!this.#m||this.#m===i.id)};if(i.maxWidth!==void 0&&(l.maxWidth=i.maxWidth),i.maxHeight!==void 0&&(l.maxHeight=i.maxHeight),s==="floating"){l.floatingRect=this.#z(i.id);let u=this.#h.get(i.id);u&&(l.restoreRect=Oe(u))}let d=this.#u.get(i.id);d&&(l.snapTarget=dr(d));let c=this.#b.get(i.id);c&&(l.groupId=c),r.push(l)}let o=[];for(let i of this.#t.values()){let a=this.#o.has(i.id)?this.overlays.surface(i.id):void 0;o.push({id:i.id,title:i.title,ownerId:i.ownerId,declaredVisible:i.declaredVisible,requestedOpen:this.#l.get(i.id)??!1,registered:this.#o.has(i.id),visible:a?.visible??!1,closeOnOutsideClick:i.closeOnOutsideClick,rect:i.rect?Oe(i.rect):void 0,surface:a?Ta(a):void 0})}return{disposed:this.#y,compactMode:this.#w,activeWindowId:t,maximizedWindowId:this.#m,windows:r,modals:o,diagnostics:this.#v.map(Xd),workspace:e}}snapshot(){this.#ne("snapshot"),this.#j(),this.#Y();let e=[...this.#e.keys()],t=this.workspace.snapshot();if(this.#g&&this.#L(this.#g)==="tiled"){let i=$v(t,this.#g);i&&(t.layout.activePaneId=i)}let r={version:Ra,compactMode:this.#w,windowIds:e,minimizedWindowIds:e.filter(i=>this.#n.has(i)),closedWindowIds:e.filter(i=>this.#a.has(i)),maximizedWindowId:this.#m,activeWindowId:this.#g,focusOrderWindowIds:this.#f.slice(),placements:e.map(i=>({id:i,placement:this.#L(i),floatingRect:Zo(this.#d.get(i)),restoreRect:Zo(this.#h.get(i)),snapTarget:Ov(this.#u.get(i)),alwaysOnTop:this.#p.has(i),groupId:this.#b.get(i)})),modals:[...this.#t.keys()].map(i=>({id:i,open:this.#l.get(i)??!1})),workspace:t},o=Dm(r);if(!o.ok)throw new RangeError(`Current declarative-window state is not snapshot-safe: ${o.reason}`);return o.snapshot}restoreSnapshot(e){let t=this.#U("restore-snapshot");if(t)return t;this.#x=!0;try{this.#B();let r=Dm(e);if(!r.ok)return D("restore-snapshot",r.status,void 0,void 0,r.reason);let o=this.#T(r.snapshot);if(o)return D("restore-snapshot","invalid",void 0,void 0,o);let i=this.#C();try{return this.#_(r.snapshot),D("restore-snapshot","applied")}catch{try{this.#$(i)}catch{return D("restore-snapshot","invalid",void 0,void 0,"snapshot-restore-and-rollback-failed")}return D("restore-snapshot","invalid",void 0,void 0,"snapshot-restore-failed")}}finally{this.#x=!1}}dispose(){if(this.#x)throw new Error("MarkupWindowController cannot dispose during a state mutation.");if(this.#j(),this.#B(),this.#y&&this.#i.size===0&&this.#o.size===0)return;this.#y=!0;let e;if(this.#i.size>0){let t=this.workspace.inspect().windows.filter(r=>!this.#i.has(r.id));try{this.workspace.reconcile(t)}catch(r){e=r}finally{this.#i.clear()}}for(let t of[...this.#o])try{this.overlays.remove(t,{synchronizeFocus:!0})}catch(r){e??=r}finally{this.#o.delete(t),this.#s.delete(t)}if(e!==void 0)throw e}#S(e,t){let r=e.declaredState??"normal";this.#n.delete(e.id),this.#a.delete(e.id),this.#m===e.id&&(this.#m=void 0),r==="minimized"&&this.#n.add(e.id),r==="closed"&&this.#a.add(e.id),r==="maximized"&&(this.#m&&this.#m!==e.id?t.push({code:"multiple-maximized-windows",severity:"warning",id:e.id,message:`Window "${e.id}" requested maximize while "${this.#m}" is already maximized.`}):this.#m=e.id)}#I(e){this.#c.set(e.id,e.declaredPlacement),this.#R(e.id,e.declaredFloatingRect??Gr(e)),this.#O(e.id,e.declaredAlwaysOnTop),this.#D(e.id,e.declaredGroupId),this.#f.includes(e.id)||this.#f.push(e.id)}#A(){let e=new Set(this.#e.keys());this.#n=new Set([...this.#n].filter(t=>e.has(t))),this.#a=new Set([...this.#a].filter(t=>e.has(t))),this.#m&&!e.has(this.#m)&&(this.#m=void 0),this.#g&&!e.has(this.#g)&&(this.#g=void 0)}#k(){let e=new Set(this.#e.keys());this.#c=new Map([...this.#c].filter(([t])=>e.has(t))),this.#d=new Map([...this.#d].filter(([t])=>e.has(t))),this.#h=new Map([...this.#h].filter(([t])=>e.has(t))),this.#u=new Map([...this.#u].filter(([t])=>e.has(t)));for(let[t,r]of this.#u)r.kind==="dock"&&(!e.has(r.targetId)||r.targetId===t)&&this.#u.delete(t);this.#p=new Set([...this.#p].filter(t=>e.has(t))),this.#b=new Map([...this.#b].filter(([t])=>e.has(t))),this.#f=this.#f.filter(t=>e.has(t));for(let t of this.#e.values()){if(this.#c.has(t.id)||this.#c.set(t.id,t.declaredPlacement),!this.#d.has(t.id))this.#R(t.id,t.declaredFloatingRect??Gr(t));else{this.#d.set(t.id,Kr(this.#d.get(t.id),t));let r=this.#h.get(t.id);r&&this.#h.set(t.id,Kr(r,t))}this.#f.includes(t.id)||this.#f.push(t.id)}}#_(e){let t=new Set(this.#e.keys()),r=new Set(e.windowIds),o=this.#F(this.#i);this.workspace.restore(e.workspace,o),this.#w=e.compactMode,this.#n=new Set(e.minimizedWindowIds.filter(d=>t.has(d))),this.#a=new Set(e.closedWindowIds.filter(d=>t.has(d))),this.#m=e.maximizedWindowId&&t.has(e.maximizedWindowId)&&!this.#n.has(e.maximizedWindowId)&&!this.#a.has(e.maximizedWindowId)?e.maximizedWindowId:void 0;let i=new Map(e.placements.map(d=>[d.id,d]));for(let d of this.#e.values()){if(!r.has(d.id))continue;let c=i.get(d.id);this.#c.set(d.id,c?.placement??"tiled");let u=c?.floatingRect??this.#d.get(d.id)??Gr(d);this.#d.set(d.id,Oe(u)),c?.restoreRect?this.#h.set(d.id,Oe(c.restoreRect)):this.#h.delete(d.id),c?.snapTarget?this.#u.set(d.id,dr(c.snapTarget)):this.#u.delete(d.id),this.#O(d.id,c?.alwaysOnTop??!1),this.#D(d.id,c?.groupId)}let a=[];for(let d of e.focusOrderWindowIds)t.has(d)&&!a.includes(d)&&a.push(d);for(let d of this.#e.keys())a.includes(d)||a.push(d);this.#f=a,this.#g=e.activeWindowId&&t.has(e.activeWindowId)?e.activeWindowId:void 0;let s=new Set(this.#t.keys());for(let d of e.modals)s.has(d.id)&&this.#l.set(d.id,d.open);let l=this.#v.filter(d=>d.code!=="missing-modal-geometry");this.#te(this.#o,l,!1),this.#v=l,this.#H()}#T(e){let t=new Set(this.#e.keys());if(e.windowIds.length!==t.size||e.windowIds.some(o=>!t.has(o)))return"snapshot-window-ids-do-not-match-declarations";let r=new Map(e.placements.map(o=>[o.id,o]));for(let o of this.#e.values()){let i=r.get(o.id);if(i?.floatingRect&&!Yd(i.floatingRect,o))return`snapshot-floating-rect-violates-constraints:${o.id}`;if(i?.restoreRect&&!Yd(i.restoreRect,o))return`snapshot-restore-rect-violates-constraints:${o.id}`}}#C(){return{windows:Wm(this.#e),modals:Vm(this.#t),managedWindowIds:new Set(this.#i),managedWindowGenerations:new Map(this.#r),managedModalIds:new Set(this.#o),managedModalSignatures:Nm(this.#s),minimizedWindowIds:new Set(this.#n),closedWindowIds:new Set(this.#a),modalRequestedOpen:new Map(this.#l),placements:new Map(this.#c),floatingRects:Sa(this.#d),restoreRects:Sa(this.#h),snapTargets:Om(this.#u),alwaysOnTopWindowIds:new Set(this.#p),windowGroups:new Map(this.#b),focusOrderWindowIds:this.#f.slice(),activeWindowId:this.#g,maximizedWindowId:this.#m,compactMode:this.#w,diagnostics:this.#v.map(Xd),workspace:this.workspace.snapshot(),overlays:this.overlays.snapshot()}}#$(e){this.#e=Wm(e.windows),this.#t=Vm(e.modals),this.#i=new Set(e.managedWindowIds),this.#r=new Map(e.managedWindowGenerations),this.#o=new Set(e.managedModalIds),this.#s=Nm(e.managedModalSignatures),this.#n=new Set(e.minimizedWindowIds),this.#a=new Set(e.closedWindowIds),this.#l=new Map(e.modalRequestedOpen),this.#c=new Map(e.placements),this.#d=Sa(e.floatingRects),this.#h=Sa(e.restoreRects),this.#u=Om(e.snapTargets),this.#p=new Set(e.alwaysOnTopWindowIds),this.#b=new Map(e.windowGroups),this.#f=e.focusOrderWindowIds.slice(),this.#g=e.activeWindowId,this.#m=e.maximizedWindowId,this.#w=e.compactMode,this.#v=e.diagnostics.map(Xd);let t=!1;try{this.workspace.restore(e.workspace)}catch{this.workspace.gap.jink(e.workspace.gap),this.workspace.state.jink(structuredClone(e.workspace.layout));try{this.workspace.gap.propagate()}catch{t=!0}try{this.workspace.state.propagate()}catch{t=!0}}try{this.overlays.restoreSnapshot(e.overlays,{synchronizeFocus:!0})}catch{this.overlays.surfaces.jink(e.overlays.surfaces.map(Ta)),this.overlays.synchronizeActiveId(e.overlays.activeId,{propagate:!1});try{this.overlays.surfaces.propagate()}catch{t=!0}try{this.overlays.activeId.propagate()}catch{t=!0}}this.overlays.surfaces.jink(e.overlays.surfaces.map(Ta)),this.overlays.synchronizeActiveId(e.overlays.activeId,{propagate:!1}),this.#r.clear();for(let r of this.#i){let o=this.workspace.windowRegistrationGeneration(r);o!==void 0&&this.#r.set(r,o)}this.#s.clear();for(let r of this.#o){let o=this.overlays.surface(r),i=this.overlays.registrationGeneration(r);o&&i!==void 0&&this.#s.set(r,Lm(o,i))}if(t)throw new Error("rollback-signal-publication-failed")}#R(e,t){this.#d.set(e,Oe(t)),this.#h.set(e,Oe(t))}#O(e,t){t?this.#p.add(e):this.#p.delete(e)}#D(e,t){t?this.#b.set(e,t):this.#b.delete(e)}#N(){let e=new Set(this.#t.keys());this.#l=new Map([...this.#l].filter(([t])=>e.has(t)))}#M(e){this.workspace.reconcile(this.#F(e),{activeWindowId:this.#m}),this.#i=new Set(this.#e.keys()),this.#r=new Map([...this.#i].map(t=>[t,this.workspace.windowRegistrationGeneration(t)]))}#F(e){let t=new Set(this.#e.keys()),r=this.workspace.inspect().windows.filter(o=>!e.has(o.id)&&!t.has(o.id));for(let o of this.#e.values())r.push({id:o.id,minWidth:o.minWidth,minHeight:o.minHeight});return r}#re(e){let t=this.workspace.inspect().layout.root;if(!t)return!1;let r=[t];for(;r.length>0;){let o=r.pop();if(o.kind==="pane")continue;if(o.id!==e){r.push(o.second,o.first);continue}let i=[o.first,o.second],a=0;for(;i.length>0;){let s=i.pop();if(s.kind==="pane"){if(a+=1,!this.#i.has(s.windowId))return!1}else i.push(s.second,s.first)}return a>=2}return!1}#te(e,t,r=!0){let o=this.overlays.activeId.peek(),i=new Set;for(let s of e){let l=this.overlays.surface(s),d=this.#s.get(s),c=!!(l&&d&&Pm(d,l,this.overlays.registrationGeneration(s)));if(!this.#t.has(s)){c&&this.overlays.remove(s,{synchronizeFocus:!0}),this.#s.delete(s);continue}if(c){i.add(s);continue}this.#s.delete(s),l&&qd(t,s,`Overlay id "${s}" changed ownership after declarative registration; the replacement was preserved.`)}let a=new Set;for(let s of this.#t.values()){let l=this.overlays.surface(s.id);if(!l&&!i.has(s.id)&&!r)continue;if(l&&!i.has(s.id)){qd(t,s.id,`Overlay id "${s.id}" is already owned outside the declarative integration.`);continue}s.rect||t.push({code:"missing-modal-geometry",severity:"warning",id:s.id,message:`Modal "${s.id}" has no computed or explicit rectangle and was registered closed.`});let d=!!(s.rect&&s.declaredVisible&&this.#Q(s)&&this.#l.get(s.id)),c={id:s.id,rect:s.rect?Oe(s.rect):Oe(Tm),layer:"modal",kind:"modal",zIndex:s.zIndex,visible:d,modal:!0,closeOnOutsideClick:s.closeOnOutsideClick,ownerId:s.ownerId},u=i.has(s.id)?this.overlays.update(s.id,c,{synchronizeFocus:!0}):this.overlays.register(c,{synchronizeFocus:!0});u.visible&&this.overlays.synchronizeActiveId(u.id),a.add(s.id),this.#s.set(s.id,Lm(u,this.overlays.registrationGeneration(s.id)))}this.#o=a;for(let s of[...this.#s.keys()])a.has(s)||this.#s.delete(s);o&&this.overlays.surface(o)?.visible&&this.overlays.synchronizeActiveId(o)}#Y(){this.#B();for(let e of this.#o){let t=this.#t.get(e),r=this.overlays.surface(e);t?.declaredVisible&&t.rect&&this.#Q(t)&&r&&this.#l.set(e,r.visible)}}#W(){this.#B();for(let e of this.#o){let t=this.#t.get(e),r=this.overlays.surface(e);if(!t||!r)continue;let o=!!(t.rect&&t.declaredVisible&&this.#Q(t)&&this.#l.get(e));o!==r.visible&&(o?this.overlays.open(e,{synchronizeFocus:!0}):this.overlays.update(e,{visible:!1},{synchronizeFocus:!0}))}}#j(){let e=new Set(this.workspace.windowIds()),t=!1;for(let r of[...this.#i]){let o=this.#r.get(r);e.has(r)&&o!==void 0&&this.workspace.windowRegistrationGeneration(r)===o||(this.#i.delete(r),this.#r.delete(r),this.#e.delete(r),Lv(this.#v,r,`Workspace window id "${r}" changed ownership after declarative registration; the replacement was preserved.`),t=!0)}t&&(this.#A(),this.#k(),this.#H())}#B(){for(let e of[...this.#o]){let t=this.overlays.surface(e),r=this.#s.get(e);t&&r&&Pm(r,t,this.overlays.registrationGeneration(e))||(this.#o.delete(e),this.#s.delete(e),this.#t.has(e)&&qd(this.#v,e,t?`Overlay id "${e}" changed ownership after declarative registration; the replacement was preserved.`:`Declaratively registered overlay id "${e}" was removed outside the window controller.`))}}#Q(e){return!e.ownerId||!this.#e.has(e.ownerId)?!0:this.#V(e.ownerId)&&(!this.#m||this.#m===e.ownerId)}#H(){if(this.#m)if(!this.#V(this.#m))this.#m=void 0;else{this.#g=this.#m,this.#q(this.#m),this.#L(this.#m)==="tiled"&&this.workspace.focus(this.#m);return}if(this.#g&&this.#V(this.#g)){this.#L(this.#g)==="tiled"?this.workspace.focus(this.#g):this.#q(this.#g);return}let e=this.workspace.inspect().activeWindowId;if(e){if(!this.#e.has(e)){this.#g=void 0;return}if(this.#V(e)&&this.#L(e)==="tiled"){this.#g=e,this.#q(e);return}}for(let t of this.workspace.windowIds())if(this.#e.has(t)&&this.#V(t)&&this.#L(t)==="tiled"){this.#g=t,this.#q(t),this.workspace.focus(t);return}for(let t=this.#f.length-1;t>=0;t-=1){let r=this.#f[t];if(this.#V(r)){this.#g=r,this.#q(r),this.#L(r)==="tiled"&&this.workspace.focus(r);return}}this.#g=void 0}#oe(){let e=[];for(let t of this.workspace.windowIds())(!this.#e.has(t)||this.#V(t)&&this.#L(t)==="tiled")&&e.push(t);return e}#ee(){let e=this.workspace.windowIds(),t=new Set(e);for(let r of this.#e.keys())t.has(r)||e.push(r);return e}#V(e){return!!(this.#e.get(e)?.declaredVisible&&!this.#a.has(e)&&!this.#n.has(e))}#X(e){return this.#a.has(e)?"closed":this.#n.has(e)?"minimized":this.#m===e?"maximized":"normal"}#L(e){return this.#c.get(e)??"tiled"}#z(e){let t=this.#d.get(e);if(t)return Oe(t);let r=this.#e.get(e);return r?Gr(r):{column:0,row:0,width:1,height:1}}#K(e){return this.#m&&this.#m!==e?(this.#g=this.#m,this.#L(this.#m)==="tiled"&&this.workspace.focus(this.#m),!1):(this.#g=e,this.#q(e),this.#L(e)==="tiled"&&this.workspace.focus(e),!0)}#q(e){let t=this.#f.indexOf(e);return t<0?(this.#f.push(e),!0):this.#ie(e)?!1:(this.#f.splice(t,1),this.#f.push(e),!0)}#ie(e){let t=this.#p.has(e);for(let r=this.#f.length-1;r>=0;r-=1){let o=this.#f[r];if(this.#p.has(o)===t)return o===e}return!1}#J(e,t){let r=this.#G(e,t);if(r)return r;if(this.#L(t)!=="floating")return D(e,"blocked",t,void 0,"window-not-floating")}#G(e,t,r){let o=this.#U(e,t,r);if(o)return o;if(!this.#e.has(t))return D(e,"not-found",t,r);if(!this.#V(t))return D(e,"blocked",t,r,"window-not-visible")}#U(e,t,r){if(this.#y)return D(e,"disposed",t,r,"controller-disposed");if(this.#x)return D(e,"blocked",t,r,"controller-mutation-in-progress");this.#j()}#ne(e){if(this.#y)throw new Error(`MarkupWindowController is disposed; cannot ${e}.`);if(this.#x)throw new Error(`MarkupWindowController cannot ${e} during a state mutation.`)}};function wv(n,e){let t=[],r=[],o=[],i=new Set,a=new WeakSet,s=[{node:n,ancestors:[],depth:0}],l=0;for(;s.length>0;){let{node:d,ancestors:c,depth:u}=s.pop();if(u>Zd){xa(o,{code:"layout-depth-exceeded",severity:"error",message:`Declarative window discovery exceeds the bounded depth of ${Zd}.`});continue}if(a.has(d)){xa(o,{code:"layout-cycle-detected",severity:"error",message:"Declarative window discovery rejected a cyclic or multiply referenced layout node."});continue}if(a.add(d),l+=1,l>Jd){xa(o,{code:"layout-node-limit-exceeded",severity:"error",message:`Declarative window discovery exceeds the bounded node limit of ${Jd}.`});break}let h=qm(d.tag);if(h==="window"||h==="modal"||h==="dialog"){let p=d.id.trim();p?nc(p)?i.has(p)?o.push({code:"duplicate-surface-id",severity:"error",id:p,message:`Declarative surface id "${p}" is duplicated; the first declaration remains authoritative.`}):(i.add(p),t.length+r.length>=ei?xa(o,{code:"surface-limit-exceeded",severity:"error",message:`Declarative window surfaces exceed the bounded limit of ${ei}.`}):h==="window"?t.push(vv(d,e)):r.push(xv(d,h,c,e))):o.push({code:"invalid-surface-id",severity:"error",message:`Declarative <${h}> nodes require an id of at most ${jm} non-control characters.`}):o.push({code:"empty-surface-id",severity:"error",message:`Declarative <${h}> nodes require a non-empty stable id.`})}let f=[...c,d];for(let p=d.children.length-1;p>=0;p-=1)s.push({node:d.children[p],ancestors:f,depth:u+1})}return{windows:t,modals:r,diagnostics:o}}function xa(n,e){n.some(t=>t.code===e.code)||n.push(e)}function vv(n,e){let t=kv(n.attributes),r=Tv(n.attributes),o=Um(n.attributes),i=e?.byId.get(n.id)?.rect,a=Rm(n.style.minWidth),s=Rm(n.style.minHeight),l=_m(n.style.maxWidth),d=_m(n.style.maxHeight),c=l===void 0?void 0:Math.max(a??1,l),u=d===void 0?void 0:Math.max(s??1,d),h=o??(i?ac(i):void 0),f=h?Kr(h,{minWidth:a,minHeight:s,maxWidth:c,maxHeight:u}):void 0,p=Cm(n.attributes,"always-on-top","pinned"),m=Cm(n.attributes,"group-id","group");return{id:n.id.trim(),title:ec(n.attributes.title??n.attributes["aria-label"]),minWidth:a,minHeight:s,maxWidth:c,maxHeight:u,declaredVisible:Gm(n),declaredState:t?.state,stateToken:t?.token,declaredPlacement:r.placement,placementToken:r.token,declaredFloatingRect:f,geometryToken:o&&f?Rv(f):void 0,declaredAlwaysOnTop:p?Dn(n.attributes,p,!0):!1,alwaysOnTopToken:p?`${p}:${Dn(n.attributes,p,!0)}`:void 0,declaredGroupId:m?tc(n.attributes[m]):void 0,groupToken:m?`${m}:${n.attributes[m]}`:void 0}}function xv(n,e,t,r){let o=Sv(n.attributes,e),i=r?.byId.get(n.id),a=i?ac(i.rect):Um(n.attributes),s=Mv(t);return{id:n.id.trim(),title:ec(n.attributes.title??n.attributes["aria-label"]),ownerId:ec(n.attributes["owner-id"]??s?.id),declaredVisible:Gm(n),defaultOpen:o.open,openToken:o.token,closeOnOutsideClick:Dn(n.attributes,"close-on-outside-click",!1),rect:a,zIndex:xd("modal")+Math.floor(Jo(n.style.zIndex,0))}}function kv(n){let e=n.state?.trim().toLowerCase();if(e==="normal"||e==="minimized"||e==="maximized"||e==="closed")return{state:e,token:`state:${e}`};for(let t of["closed","minimized","maximized"])if(t in n){let r=Dn(n,t,!1);return{state:r?t:"normal",token:`${t}:${r}`}}}function Sv(n,e){let t=n.state?.trim().toLowerCase();if(t==="open"||t==="closed")return{open:t==="open",token:`state:${t}`};if("open"in n){let r=Dn(n,"open",!0);return{open:r,token:`open:${r}`}}return{open:e==="modal"}}function Gm(n){return n.style.display!=="none"&&n.style.visibility!=="hidden"&&!Dn(n.attributes,"hidden",!1)&&!Dn(n.attributes,"aria-hidden",!1)}function Mv(n){for(let e=n.length-1;e>=0;e-=1)if(qm(n[e].tag)==="window")return n[e]}function Rm(n){if(!(n.unit!=="cell"||!Number.isFinite(n.value)||n.value<=0))return Math.min($e,Math.max(1,Math.floor(n.value)))}function _m(n){if(!(n.unit!=="cell"||!Number.isFinite(n.value)||n.value<=0))return Math.min($e,Math.max(1,Math.floor(n.value)))}function Um(n){let e=Ur(n,"column")??Ur(n,"x"),t=Ur(n,"row")??Ur(n,"y"),r=Ur(n,"width"),o=Ur(n,"height");if(!(e===void 0||t===void 0||r===void 0||o===void 0))return ac({column:e,row:t,width:r,height:o})}function Tv(n){let e=n.placement?.trim().toLowerCase();if(e==="floating"||e==="tiled")return{placement:e,token:`placement:${e}`};if("floating"in n){let t=Dn(n,"floating",!0);return{placement:t?"floating":"tiled",token:`floating:${t}`}}return{placement:"tiled"}}function Cm(n,...e){return e.find(t=>t in n)}function Rv(n){return`${n.column}:${n.row}:${n.width}:${n.height}`}function Gr(n){let e=Ca(n);return{column:0,row:0,width:Math.max(e.minWidth,Math.min(e.maxWidth,40)),height:Math.max(e.minHeight,Math.min(e.maxHeight,12))}}function Ca(n){let e=ka(n.minWidth??1),t=ka(n.minHeight??1);return{minWidth:e,minHeight:t,maxWidth:Math.max(e,ka(n.maxWidth??$e)),maxHeight:Math.max(t,ka(n.maxHeight??$e))}}function ka(n){return Math.min($e,Math.max(1,Math.floor(n)))}function Kr(n,e){let t=Yr(n,!1);if(!t||t.width<=0||t.height<=0)return;let r=Ca(e);return{column:t.column,row:t.row,width:Math.max(r.minWidth,Math.min(r.maxWidth,t.width)),height:Math.max(r.minHeight,Math.min(r.maxHeight,t.height))}}function Kd(n){let e=Yr(n,!0);if(!e)return;let t=e.width>0?e.column+e.width-1:e.column,r=e.height>0?e.row+e.height-1:e.row;if(!(Math.abs(t)>$e||Math.abs(r)>$e))return e}function Yr(n,e){try{if([n.column,n.row,n.width,n.height].some(s=>typeof s!="number"||!Number.isFinite(s)))return;let r=Math.floor(n.column),o=Math.floor(n.row),i=Math.floor(n.width),a=Math.floor(n.height);return Math.abs(r)>$e||Math.abs(o)>$e||i>$e||a>$e||i<(e?0:1)||a<(e?0:1)?void 0:{column:r,row:o,width:i,height:a}}catch{return}}function Em(n){try{return!Number.isSafeInteger(n.columns)||!Number.isSafeInteger(n.rows)||Math.abs(n.columns)>$e||Math.abs(n.rows)>$e||n.columns===0&&n.rows===0?void 0:{columns:n.columns,rows:n.rows}}catch{return}}function _v(n,e){let t=n.column+e.columns,r=n.row+e.rows;if(!(!Number.isSafeInteger(t)||!Number.isSafeInteger(r)||Math.abs(t)>$e||Math.abs(r)>$e))return{...n,column:t,row:r}}function Cv(n,e,t,r){let o=Ca(r),i=e==="left"||e==="top-left"||e==="bottom-left",a=e==="right"||e==="top-right"||e==="bottom-right",s=e==="top"||e==="top-left"||e==="top-right",l=e==="bottom"||e==="bottom-left"||e==="bottom-right",d=n.width+(a?t.columns:0)-(i?t.columns:0),c=n.height+(l?t.rows:0)-(s?t.rows:0);d=Math.max(o.minWidth,Math.min(o.maxWidth,d)),c=Math.max(o.minHeight,Math.min(o.maxHeight,c));let u=i?n.column+n.width-d:n.column,h=s?n.row+n.height-c:n.row;return Yr({column:u,row:h,width:d,height:c},!1)}function Im(n,e,t){if(e.width<=0||e.height<=0)return Oe(n);let r=e.column+Math.min(t.margin,Math.max(0,e.width-1)),o=e.column+e.width-1-Math.min(t.margin,Math.max(0,e.width-1)),i=e.row+Math.min(t.margin,Math.max(0,e.height-1)),a=e.row+e.height-1-Math.min(t.margin,Math.max(0,e.height-1)),s=Math.floor((n.width-1)/2),l=r-s,d=o-s,c=Math.max(1,Math.min(n.height,t.titleBarHeight)),u=Math.max(i,a-c+1);return Yr({...n,column:Math.max(l,Math.min(d,n.column)),row:Math.max(i,Math.min(u,n.row))},!1)}function Ev(n){try{let e=n.margin??0,t=n.titleBarHeight??1;return!Number.isSafeInteger(e)||e<0||e>$e||!Number.isSafeInteger(t)||t<1||t>$e?void 0:{margin:e,titleBarHeight:t}}catch{return}}function Iv(n,e){let t=Math.max(1,Math.ceil(e.width/2)),r=Math.max(1,Math.floor(e.width/2)),o=Math.max(1,Math.ceil(e.height/2)),i=Math.max(1,Math.floor(e.height/2));if(n.kind==="workspace")switch(n.edge){case"left":return{...e,width:t};case"right":return{...e,column:e.column+e.width-r,width:r};case"top":return{...e,height:o};case"bottom":return{...e,row:e.row+e.height-i,height:i}}let a=n.corner==="top-right"||n.corner==="bottom-right",s=n.corner==="bottom-left"||n.corner==="bottom-right",l=a?r:t,d=s?i:o;return{column:a?e.column+e.width-l:e.column,row:s?e.row+e.height-d:e.row,width:l,height:d}}function Am(n,e,t){let r=Kr(Iv(n,e),t);if(!r)return;let o=n.kind==="workspace"?n.edge==="right":n.corner==="top-right"||n.corner==="bottom-right",i=n.kind==="workspace"?n.edge==="bottom":n.corner==="bottom-left"||n.corner==="bottom-right";return o?r.column=e.column+e.width-r.width:r.column=e.column,i?r.row=e.row+e.height-r.height:r.row=e.row,Yr(r,!1)}function Av(n){try{if(!n||typeof n!="object")return;if(n.kind==="workspace"&&qr(n.edge))return{kind:"workspace",edge:n.edge};if(n.kind==="corner"&&rc(n.corner))return{kind:"corner",corner:n.corner};if(n.kind==="dock"&&nc(n.targetId)&&qr(n.edge)&&(n.ratio===void 0||Number.isFinite(n.ratio)&&n.ratio>=.05&&n.ratio<=.95))return n.ratio===void 0?{kind:"dock",targetId:n.targetId.trim(),edge:n.edge}:{kind:"dock",targetId:n.targetId.trim(),edge:n.edge,ratio:n.ratio}}catch{}}function dr(n){return n.kind==="dock"&&n.ratio!==void 0?{...n}:{...n}}function Ov(n){return n?dr(n):void 0}function Zo(n){return n?Oe(n):void 0}function Sa(n){return new Map([...n].map(([e,t])=>[e,Oe(t)]))}function Om(n){return new Map([...n].map(([e,t])=>[e,dr(t)]))}function Lm(n,e){return{registrationGeneration:e,rect:Oe(n.rect),layer:n.layer,kind:n.kind,modal:n.modal,closeOnOutsideClick:n.closeOnOutsideClick,ownerId:n.ownerId}}function Pm(n,e,t){return n.registrationGeneration===t&&Xo(n.rect,e.rect)&&n.layer===e.layer&&n.kind===e.kind&&n.modal===e.modal&&n.closeOnOutsideClick===e.closeOnOutsideClick&&n.ownerId===e.ownerId}function Nm(n){return new Map([...n].map(([e,t])=>[e,{...t,rect:Oe(t.rect)}]))}function qd(n,e,t){n.some(r=>r.code==="overlay-id-conflict"&&r.id===e)||n.push({code:"overlay-id-conflict",severity:"error",id:e,message:t})}function Lv(n,e,t){n.some(r=>r.code==="workspace-id-conflict"&&r.id===e)||n.push({code:"workspace-id-conflict",severity:"error",id:e,message:t})}function Wm(n){return new Map([...n].map(([e,t])=>[e,{...t,declaredFloatingRect:Zo(t.declaredFloatingRect)}]))}function Vm(n){return new Map([...n].map(([e,t])=>[e,{...t,rect:Zo(t.rect)}]))}function Xo(n,e){return!!(n&&e&&n.column===e.column&&n.row===e.row&&n.width===e.width&&n.height===e.height)}function Yd(n,e){let t=Ca(e);return n.width>=t.minWidth&&n.width<=t.maxWidth&&n.height>=t.minHeight&&n.height<=t.maxHeight}function Pv(n,e){return Number(n.alwaysOnTop)-Number(e.alwaysOnTop)||n.focusOrder-e.focusOrder||n.id.localeCompare(e.id)}function tc(n){let e=n?.trim();if(!(!e||e.length>bv||Km(e)))return e}function nc(n){return typeof n=="string"&&n.trim().length>0&&n.trim().length<=jm&&!Km(n)}function Km(n){for(let e=0;e<n.length;e+=1){let t=n.charCodeAt(e);if(t<=31||t===127)return!0}return!1}function qr(n){return n==="left"||n==="right"||n==="top"||n==="bottom"}function rc(n){return n==="top-left"||n==="top-right"||n==="bottom-left"||n==="bottom-right"}function Nv(n){return qr(n)||rc(n)}function Dm(n){try{let e=Vn(n,["version","compactMode","windowIds","minimizedWindowIds","closedWindowIds","maximizedWindowId","activeWindowId","focusOrderWindowIds","placements","modals","workspace"],["version","compactMode","windowIds","minimizedWindowIds","closedWindowIds","modals","workspace"],"markup window snapshot"),t=e.version;if(t!==Ra&&t!==Qo)return{ok:!1,status:"unsupported",reason:`unsupported-snapshot-version:${String(t)}`};let r=Bv(e.compactMode),o=Ma(e.windowIds,"windowIds"),i=new Set(o),a=Ma(e.minimizedWindowIds,"minimizedWindowIds",i),s=Ma(e.closedWindowIds,"closedWindowIds",i);if(a.some(m=>s.includes(m)))throw new TypeError("minimized and closed window ids must be disjoint");let l=Hm(e.maximizedWindowId,i,"maximizedWindowId");if(l&&(a.includes(l)||s.includes(l)))throw new TypeError("maximized window cannot also be hidden");let d=Dv(e.modals),c=zv(e.workspace);if(t===Qo){if(Object.hasOwn(e,"activeWindowId")||Object.hasOwn(e,"focusOrderWindowIds")||Object.hasOwn(e,"placements"))throw new TypeError("V1 snapshot contains V2-only state");let m=zm(c),g=l??m;return{ok:!0,snapshot:{version:Ra,compactMode:r,windowIds:o,minimizedWindowIds:a,closedWindowIds:s,maximizedWindowId:l,activeWindowId:g&&i.has(g)&&!a.includes(g)&&!s.includes(g)?g:void 0,focusOrderWindowIds:o.slice(),placements:o.map(y=>({id:y,placement:"tiled",alwaysOnTop:!1})),modals:d,workspace:c}}}if(!("focusOrderWindowIds"in e)||!("placements"in e))throw new TypeError("V2 snapshot is missing focus or placement state");let u=Ma(e.focusOrderWindowIds,"focusOrderWindowIds",i);if(u.length!==o.length)throw new TypeError("focus order must contain every window exactly once");let h=Hm(e.activeWindowId,i,"activeWindowId");if(h&&(a.includes(h)||s.includes(h)))throw new TypeError("active window cannot also be hidden");if(l&&h!==l)throw new TypeError("maximized window must be the active window");let f=Wv(e.placements,i);if(f.length!==o.length)throw new TypeError("placements must contain every window exactly once");let p=h?f.find(m=>m.id===h)?.placement:void 0;if(h&&p==="tiled"&&zm(c)!==h)throw new TypeError("active tiled window must match workspace active pane");if(h&&p==="floating"){let m=new Map(f.map(b=>[b.id,b])),g=m.get(h),y=u.indexOf(h);for(let b=y+1;b<u.length;b+=1){let w=m.get(u[b]);if(w?.placement==="floating"&&w.alwaysOnTop===g.alwaysOnTop)throw new TypeError("active floating window must be frontmost in its z-order tier")}}return{ok:!0,snapshot:{version:Ra,compactMode:r,windowIds:o,minimizedWindowIds:a,closedWindowIds:s,maximizedWindowId:l,activeWindowId:h,focusOrderWindowIds:u,placements:f,modals:d,workspace:c}}}catch{return{ok:!1,status:"invalid",reason:"snapshot-schema-is-invalid"}}}function Wv(n,e){let t=ic(n,"placements");if(t.length>ei)throw new RangeError("too many placements");let r=[],o=new Set;for(let i=0;i<t.length;i+=1){let a=Vn(t[i],["id","placement","floatingRect","restoreRect","snapTarget","alwaysOnTop","groupId"],["id","placement","alwaysOnTop"],`placement ${i}`),s=oc(a.id,e,`placement ${i} id`);if(o.has(s))throw new TypeError("duplicate placement id");if(o.add(s),a.placement!=="tiled"&&a.placement!=="floating")throw new TypeError("invalid placement");if(typeof a.alwaysOnTop!="boolean")throw new TypeError("invalid alwaysOnTop");let l=a.floatingRect===void 0?void 0:$m(a.floatingRect);if(a.placement==="floating"&&!l)throw new TypeError("floating placement requires rect");let d=a.restoreRect===void 0?void 0:$m(a.restoreRect),c=a.snapTarget===void 0?void 0:Vv(a.snapTarget);if(c?.kind==="dock"){if(a.placement!=="tiled"||!e.has(c.targetId)||c.targetId===s)throw new TypeError("dock snap requires a distinct tiled inventory target")}else if(c&&a.placement!=="floating")throw new TypeError("workspace and corner snaps require floating placement");let u=a.groupId===void 0?void 0:Hv(a.groupId);r.push({id:s,placement:a.placement,floatingRect:l,restoreRect:d,snapTarget:c,alwaysOnTop:a.alwaysOnTop,groupId:u})}return r}function Vv(n){let e=Vn(n,["kind","edge","corner","targetId","ratio"],["kind"],"snapTarget");if(e.kind==="workspace"){if(!qr(e.edge)||e.corner!==void 0||e.targetId!==void 0||e.ratio!==void 0)throw new TypeError("invalid workspace snap");return{kind:"workspace",edge:e.edge}}if(e.kind==="corner"){if(!rc(e.corner)||e.edge!==void 0||e.targetId!==void 0||e.ratio!==void 0)throw new TypeError("invalid corner snap");return{kind:"corner",corner:e.corner}}if(e.kind==="dock"){let t=cr(e.targetId,"dock targetId");if(!qr(e.edge)||e.corner!==void 0)throw new TypeError("invalid dock snap");if(e.ratio!==void 0&&(typeof e.ratio!="number"||!Number.isFinite(e.ratio)||e.ratio<.05||e.ratio>.95))throw new TypeError("invalid dock ratio");return e.ratio===void 0?{kind:"dock",targetId:t,edge:e.edge}:{kind:"dock",targetId:t,edge:e.edge,ratio:e.ratio}}throw new TypeError("invalid snap kind")}function Dv(n){let e=ic(n,"modals");if(e.length>ei)throw new RangeError("too many modals");let t=[],r=new Set;for(let o=0;o<e.length;o+=1){let i=Vn(e[o],["id","open"],["id","open"],`modal ${o}`),a=cr(i.id,`modal ${o} id`);if(r.has(a)||typeof i.open!="boolean")throw new TypeError("invalid modal snapshot");r.add(a),t.push({id:a,open:i.open})}return t}function zv(n){let e=Vn(n,["version","gap","layout"],["version","gap","layout"],"workspace");if(e.version!==No)throw new TypeError("unsupported workspace version");if(!Number.isSafeInteger(e.gap)||e.gap<0||e.gap>$e)throw new TypeError("invalid workspace gap");let t=Vn(e.layout,["root","activePaneId"],[],"workspace layout"),r=new Set,o=new Set,i=new WeakSet,a={value:0},s=t.root===void 0?void 0:Qd(t.root,0,a,i,r,o),l;if(t.activePaneId!==void 0&&(l=cr(t.activePaneId,"activePaneId"),!r.has(l)))throw new TypeError("active pane is missing");return{version:No,gap:e.gap,layout:{root:s,activePaneId:l}}}function Qd(n,e,t,r,o,i){if(e>Zd||++t.value>Jd)throw new RangeError("workspace layout limit exceeded");if(!n||typeof n!="object"||r.has(n))throw new TypeError("invalid or cyclic workspace node");r.add(n);let a=Vn(n,["kind","id","windowId","minWidth","minHeight","direction","ratio","first","second"],["kind","id"],"workspace node"),s=cr(a.id,"workspace node id");if(o.has(s))throw new TypeError("duplicate workspace node id");if(o.add(s),a.kind==="pane"){let l=cr(a.windowId,"workspace window id");if(i.has(l)||a.direction!==void 0||a.ratio!==void 0||a.first!==void 0||a.second!==void 0)throw new TypeError("invalid workspace pane");return i.add(l),{kind:"pane",id:s,windowId:l,minWidth:Bm(a.minWidth,"pane minWidth"),minHeight:Bm(a.minHeight,"pane minHeight")}}if(a.kind!=="split"||a.direction!=="row"&&a.direction!=="column"||typeof a.ratio!="number"||!Number.isFinite(a.ratio)||a.ratio<.05||a.ratio>.95||a.windowId!==void 0||a.minWidth!==void 0||a.minHeight!==void 0||a.first===void 0||a.second===void 0)throw new TypeError("invalid workspace split");return{kind:"split",id:s,direction:a.direction,ratio:a.ratio,first:Qd(a.first,e+1,t,r,o,i),second:Qd(a.second,e+1,t,r,o,i)}}function zm(n){let e=n.layout.activePaneId;if(!e||!n.layout.root)return;let t=[n.layout.root];for(;t.length>0;){let r=t.pop();if(r.kind==="pane"){if(r.id===e)return r.windowId}else t.push(r.second,r.first)}}function $v(n,e){if(!n.layout.root)return;let t=[n.layout.root];for(;t.length>0;){let r=t.pop();if(r.kind==="pane"){if(r.windowId===e)return r.id}else t.push(r.second,r.first)}}function $m(n){let e=Vn(n,["column","row","width","height"],["column","row","width","height"],"rect"),t=Yr(e,!1);if(!t)throw new TypeError("invalid rect");return t}function Ma(n,e,t){let r=ic(n,e);if(r.length>ei)throw new RangeError(`${e} is too large`);let o=[],i=new Set;for(let a of r){let s=t?oc(a,t,e):cr(a,e);if(i.has(s))throw new TypeError(`${e} contains duplicates`);i.add(s),o.push(s)}return o}function Hm(n,e,t){return n===void 0?void 0:oc(n,e,t)}function oc(n,e,t){let r=cr(n,t);if(!e.has(r))throw new TypeError(`${t} is outside the snapshot inventory`);return r}function cr(n,e){if(!nc(n))throw new TypeError(`${e} is invalid`);return n.trim()}function Hv(n){if(typeof n!="string")throw new TypeError("group id must be a string");let e=tc(n);if(!e)throw new TypeError("group id is invalid");return e}function Bm(n,e){if(n!==void 0){if(!Number.isSafeInteger(n)||n<1||n>$e)throw new TypeError(`${e} is invalid`);return n}}function Bv(n){if(n!=="auto"&&n!=="always"&&n!=="never")throw new TypeError("invalid compact mode");return n}function ic(n,e){if(!Array.isArray(n)||Object.getPrototypeOf(n)!==Array.prototype)throw new TypeError(`${e} must be a plain array`);for(let t=0;t<n.length;t+=1){let r=Object.getOwnPropertyDescriptor(n,String(t));if(!r||!("value"in r)||!r.enumerable)throw new TypeError(`${e} must be dense data`)}for(let t of Reflect.ownKeys(n))if(t!=="length"&&(typeof t!="string"||!/^(0|[1-9]\d*)$/.test(t)||Number(t)>=n.length))throw new TypeError(`${e} has an unexpected property`);return n}function Vn(n,e,t,r){if(!n||typeof n!="object"||Object.getPrototypeOf(n)!==Object.prototype)throw new TypeError(`${r} must be a plain object`);let o=n,i=new Set(e);for(let a of Reflect.ownKeys(o)){if(typeof a!="string"||!i.has(a))throw new TypeError(`${r} has an unexpected property`);let s=Object.getOwnPropertyDescriptor(o,a);if(!s||!("value"in s)||!s.enumerable)throw new TypeError(`${r} properties must be enumerable data`)}for(let a of t)if(!Object.hasOwn(o,a))throw new TypeError(`${r} is missing ${a}`);return o}function D(n,e,t,r,o){let i={action:n,status:e,ok:e==="applied"||e==="unchanged"};return t!==void 0&&(i.id=t),r!==void 0&&(i.targetId=r),o!==void 0&&(i.reason=o),i}function Xd(n){return{...n}}function Ta(n){return{...n,rect:Oe(n.rect)}}function Oe(n){return{column:n.column,row:n.row,width:n.width,height:n.height}}function ac(n){return{column:Math.floor(Jo(n.column,0)),row:Math.floor(Jo(n.row,0)),width:Math.max(0,Math.floor(Jo(n.width,0))),height:Math.max(0,Math.floor(Jo(n.height,0)))}}function Fm(n){return n==="always"||n==="never"?n:"auto"}function Fv(n,e){if(n===void 0)return e.slice();if(!Array.isArray(n))return[];let t=new Set(e),r=new Set,o=[];for(let i of n)typeof i!="string"||!t.has(i)||r.has(i)||(r.add(i),o.push(i));return o}function Ur(n,e){let t=n[e];if(t===void 0)return;let r=Number(t);return Number.isFinite(r)?r:void 0}function Dn(n,e,t){if(!(e in n))return t;let r=n[e]?.trim().toLowerCase();return r!=="false"&&r!=="0"&&r!=="no"&&r!=="off"}function ec(n){let e=n?.trim();return e||void 0}function qm(n){return n.trim().toLowerCase()}function Jo(n,e){return Number.isFinite(n)?n:e}function jv(n,e,t){let r=[...n.tiledWindows,...n.floatingWindows];for(let o=r.length-1;o>=0;o-=1){let i=r[o];if(ct(i.rect,e,t)){if(t!==i.rect.row||ct(i.clientRect,e,t))return;for(let a of i.controls)if(ct(a.hitRect,e,t))return;return i.id}}}var Gv=64,Uv=1,Kv=0;function Ym(n,e="workbench-window-host"){let t=n.map(r=>{let o=la();ti(r.minWidth)&&(o.minWidth=ir(Math.floor(r.minWidth))),ti(r.minHeight)&&(o.minHeight=ir(Math.floor(r.minHeight))),ti(r.maxWidth)&&(o.maxWidth=ir(Math.floor(r.maxWidth))),ti(r.maxHeight)&&(o.maxHeight=ir(Math.floor(r.maxHeight)));let i={title:String(r.title??"")};return r.state!==void 0&&(i.state=r.state),r.placement!==void 0&&(i.placement=r.placement),r.alwaysOnTop!==void 0&&(i["always-on-top"]=String(r.alwaysOnTop)),r.groupId!==void 0&&(i["group-id"]=r.groupId),r.floatingRect&&(i.column=String(r.floatingRect.column),i.row=String(r.floatingRect.row),i.width=String(r.floatingRect.width),i.height=String(r.floatingRect.height)),Td({id:r.id,tag:"window",attributes:i,style:o})});return Td({id:e,tag:"main",children:t})}var sc=class{workspace;overlays;history;capture;controller;windowHistory;interactions;commitRevision=new Ee(0);viewRevision=new Ee(0);#e;#t;#i;#r;#o;#s=lm();#n=new Map;#a=new Map;#l=Rf();#c;#d;#h;#u;#p;#b;#f=!1;constructor(e){if(!e?.workspace)throw new TypeError("Workbench window host requires an existing tiled workspace.");if(e.root===void 0==(e.windows===void 0))throw new TypeError("Workbench window host requires exactly one of root or windows.");this.workspace=e.workspace,this.#e=e.overlays===void 0,this.#t=!0,this.#i=e.capture===void 0,this.overlays=e.overlays??new ia,this.history=new Hi({capacity:e.historyCapacity??Gv}),this.capture=e.capture??new ha,this.#o=ti(e.commandStep)?Math.max(1,Math.floor(e.commandStep)):Uv,this.#r=new Dr({now:e.now??Date.now});let t=e.windowConfigButton??!1;this.#h=typeof t=="function"?t:()=>t,this.#u=e.windowConfigLabel??"config";let r=new _a({root:e.root??Ym(e.windows,e.rootId),workspace:this.workspace,overlays:this.overlays,compactMode:e.compactMode}),o=e.ownerId??`workbench-window-host-${++Kv}`,i=Jv(o,"separator"),a,s,l;try{if(e.initialWorkspace){let d=r.snapshot(),c=r.restoreSnapshot({version:Qo,compactMode:d.compactMode,windowIds:d.windowIds,minimizedWindowIds:d.minimizedWindowIds,closedWindowIds:d.closedWindowIds,maximizedWindowId:d.maximizedWindowId,modals:d.modals,workspace:e.initialWorkspace});if(!c.ok)throw new TypeError(`Initial workbench workspace was rejected: ${c.reason}`)}a=wm({controller:r,history:this.history,idPrefix:"workbench-window",group:"workbench-windows"}),l=this.capture.registerOwner({id:i,onPointer:()=>{}}),s=new va({controller:r,capture:this.capture,history:a,ownerId:o,titleBarHeight:1,resizeMargin:1,snapDistance:e.snapDistance,snapEdgeSpanRatio:e.snapEdgeSpanRatio,snapCornerReach:e.snapCornerReach,snapOnRelease:e.snapOnRelease})}catch(d){throw Tt(()=>s?.dispose()),Tt(()=>l?.dispose()),Tt(()=>a?.dispose()),Tt(()=>r.dispose()),this.#i&&Tt(()=>this.capture.dispose()),this.#e&&Tt(()=>this.overlays.dispose()),Tt(()=>this.commitRevision.dispose()),Tt(()=>this.viewRevision.dispose()),d}this.controller=r,this.windowHistory=a,this.interactions=s,this.#c=i,this.#d=l}project(e,t={}){this.#F("project"),this.viewRevision.value;let r=this.controller.project(e,t),o=this.controller.inspect(),i=new Map(o.windows.map(h=>[h.id,h])),a=[],s=[],l=[],d=0;for(let h of r.workspace.panes){let f=i.get(h.windowId);if(!f)continue;let p=this.#g(f.id,f.title??f.id,"tiled",h.rect,d++,f,t.titleAdornments?.(f.id)??[]);s.push(p),a.push(p)}for(let h of r.floatingZOrder){let f=i.get(h.id);if(!f)continue;let p=this.#g(f.id,f.title??f.id,"floating",h.rect,h.zIndex,f,t.titleAdornments?.(f.id)??[]);l.push(p),a.push(p)}let c=this.#m(o,t.shelfBounds),u=r.workspace.separators.map(Yv);return{bounds:Jt(e),compact:r.compact,compactWindowId:r.compactWindowId,topModalId:r.topModalId,windows:a,tiledWindows:s,floatingWindows:l,separators:u,shelf:c,switcher:this.#w(o,t),snapPreview:this.#v(e,o),core:r}}execute(e,t,r={}){if(this.#f)return ee("disposed",!1,e,void 0,void 0,"window-host-disposed");if(this.#I())return ee("blocked",!1,e,void 0,void 0,"window-gesture-active");try{if(e.kind==="switcher-open"||e.kind==="switcher-step")return this.#T(e.direction,e,r);if(e.kind==="switcher-cancel"){let s=this.#p!==void 0;return this.#p=void 0,s&&this.#M(),ee(s?"applied":"unchanged",s,e)}if(e.kind==="switcher-accept")return this.#C(e,t,r);if(e.kind==="recover-all")return this.#O(e,t);if(e.kind==="focus-next")return this.#_(e,t,r);if(e.kind==="restore-floating")return this.#D(e);if(e.kind==="resize-split")return this.#k(e,this.windowHistory.resize(e.splitId,e.delta,t,r));let o=e.id??this.controller.inspect().activeWindowId;if(!o)return ee("blocked",!1,e,void 0,void 0,"no-active-window");let i=this.controller.inspect().windows.find(s=>s.id===o),a;switch(e.kind){case"focus":a=this.windowHistory.focus(o);break;case"nudge":a=this.windowHistory.moveBy(o,e.delta);break;case"resize":a=this.windowHistory.resizeWindow(o,e.edge,e.delta);break;case"snap":a=this.windowHistory.snap(o,e.target,t);break;case"dock":a=this.windowHistory.dock(o,e.targetId,e.edge,{ratio:e.ratio});break;case"set-placement":a=this.windowHistory.setPlacement(o,e.placement,{rect:e.rect});break;case"toggle-placement":{if(!i)return ee("invalid",!1,e,void 0,void 0,"window-not-found");let s=i.placement==="floating"?"tiled":"floating";a=this.windowHistory.setPlacement(o,s,{rect:e.rect});break}case"minimize":a=this.windowHistory.minimize(o);break;case"maximize":a=this.windowHistory.maximize(o);break;case"toggle-maximize":a=i?.state==="maximized"?this.windowHistory.restore(o):this.windowHistory.maximize(o);break;case"restore":a=this.windowHistory.restore(o);break;case"close":a=this.windowHistory.close(o);break;case"recover-bounds":a=this.windowHistory.recoverBounds(o,t,{titleBarHeight:1});break;case"toggle-always-on-top":if(!i)return ee("invalid",!1,e,void 0,void 0,"window-not-found");a=this.windowHistory.setAlwaysOnTop(o,!i.alwaysOnTop);break;case"set-group":a=this.windowHistory.setGroup(o,e.groupId);break;default:return ee("invalid",!1,e,void 0,void 0,"unsupported-window-command")}return this.#k(e,a)}catch(o){return ee("failed",!1,e,void 0,void 0,Xt(o))}}handleKey(e,t,r={}){if(this.#p){if(e.key==="escape")return this.execute({kind:"switcher-cancel"},t,r);if(e.key==="return"||e.key==="space")return this.execute({kind:"switcher-accept"},t,r);if(e.key==="tab"||e.key==="right"||e.key==="down")return this.execute({kind:"switcher-step",direction:e.shift?-1:1},t,r);if(e.key==="left"||e.key==="up")return this.execute({kind:"switcher-step",direction:-1},t,r)}if(!e.meta)return ee("ignored",!1,void 0,void 0,void 0,"window-modifier-not-held");if(e.key==="tab")return this.execute({kind:"switcher-open",direction:e.shift?-1:1},t,r);let o=Qv(e.key);if(o)return e.ctrl?this.execute({kind:"snap",target:{kind:"workspace",edge:o}},t,r):e.shift?this.execute({kind:"resize",edge:o,delta:ex(o,this.#o)},t,r):this.execute({kind:"nudge",delta:Jm(o,this.#o)},t,r);switch(e.key.toLowerCase()){case"m":return this.execute({kind:"minimize"},t,r);case"f":return this.execute({kind:"toggle-maximize"},t,r);case"c":return this.execute({kind:"close"},t,r);case"r":return this.execute({kind:"recover-bounds"},t,r);case"p":return this.execute({kind:"toggle-always-on-top"},t,r);case"d":return this.execute({kind:"toggle-placement"},t,r);default:return ee("ignored",!1,void 0,void 0,void 0,"unbound-window-key")}}handlePointer(e,t,r={}){if(this.#f)return ee("disposed",!1,void 0,void 0,void 0,"window-host-disposed");let o;try{o=Fr(e)}catch{return ee("invalid",!1,void 0,void 0,void 0,"pointer-event-is-invalid")}if(this.#b)return this.#P(o,t);if(o.kind!=="down"&&r.doubleClickMaximizeMs!==void 0){let i=o.coordinates.cell,a=Ld(this.#s,{kind:o.kind==="move"?"move":o.kind==="up"?"up":"cancel",column:i?.x??Number.NaN,row:i?.y??Number.NaN,timestamp:o.timestamp},{doubleClickMs:r.doubleClickMaximizeMs});if(this.#s=a.state,a.outcome.kind==="double-click")return this.interactions.inspect().active&&this.#x(o,t),this.execute({kind:"toggle-maximize",id:a.outcome.id},t,r)}if(this.interactions.inspect().active)return this.#x(o,t);if(o.kind==="down"){let i=o.coordinates.cell;if(!i)return ee("ignored",!1,void 0,void 0,void 0,"pointer-has-no-cell-coordinate");let a=this.project(t,r);if(a.topModalId)return ee("blocked",!1,void 0,void 0,void 0,`pointer-blocked-by-modal:${a.topModalId}`);let s=o.primary&&(o.button===0||o.device!=="mouse"&&o.button===null);if(s)for(let d=a.shelf.length-1;d>=0;d-=1){let c=a.shelf[d];if(c.rect&&ct(c.rect,i.x,i.y))return this.execute(c.command,t)}if(s&&o.device==="mouse"&&r.doubleClickMaximizeMs!==void 0){let d=Ld(this.#s,{kind:"down",id:jv(a,i.x,i.y),column:i.x,row:i.y,timestamp:o.timestamp},{doubleClickMs:r.doubleClickMaximizeMs});this.#s=d.state}let l=d=>{if(!ct(d.rect,i.x,i.y))return;for(let u=d.controls.length-1;u>=0;u-=1){let h=d.controls[u];if(s&&h.command&&ct(h.hitRect,i.x,i.y))return this.execute(h.command,t)}if(!s)return ee("ignored",!1,void 0,void 0,void 0,"pointer-is-not-a-primary-activation");if(d.placement==="floating"){let u=this.interactions.hitTest({column:i.x,row:i.y},t);if(u&&u.region!=="client")return this.#x(o,t)}let c=this.execute({kind:"focus",id:d.id},t);return ct(d.clientRect,i.x,i.y)?{...c,handled:!1,reason:"window-client-focus-pass-through"}:c};for(let d=a.floatingWindows.length-1;d>=0;d-=1){let c=l(a.floatingWindows[d]);if(c)return c}if(s)for(let d=a.separators.length-1;d>=0;d-=1){let c=a.separators[d];if(ct(c.hitRect,i.x,i.y))return this.#y(c,o,r)}for(let d=a.tiledWindows.length-1;d>=0;d-=1){let c=l(a.tiledWindows[d]);if(c)return c}}return this.#x(o,t)}handleMouse(e,t,r,o={}){try{let i=e==="terminal"?this.#r.terminal(t):this.#r.browser(t);return this.handlePointer(am(i,t),r,o)}catch(i){return ee("invalid",!1,void 0,void 0,void 0,Xt(i))}}reconcileWindows(e,t="workbench-window-host"){if(this.#f)return ee("disposed",!1,void 0,void 0,void 0,"window-host-disposed");let r;try{r=Ym(e,t)}catch(o){return ee("failed",!1,void 0,void 0,void 0,Xt(o))}return this.reconcileRoot(r)}reconcileRoot(e,t={}){if(this.#f)return ee("disposed",!1,void 0,void 0,void 0,"window-host-disposed");if(this.#I())return ee("blocked",!1,void 0,void 0,void 0,"window-gesture-active");if(this.controller.mutationInProgress)return ee("blocked",!1,void 0,void 0,void 0,"window-controller-mutation-in-progress");let r=this.history.inspect();if(r.operation||r.transaction)return ee("blocked",!1,void 0,void 0,void 0,"window-history-active");try{let o=this.controller.reconcile(e,t);return this.history.clear(),this.#A(o),this.#N(),ee("applied",!0,void 0,void 0,void 0,"windows-reconciled")}catch(o){return ee("failed",!1,void 0,void 0,void 0,Xt(o))}}restoreSnapshot(e){if(this.#F("restore snapshot"),this.#I())return{action:"restore-snapshot",status:"blocked",ok:!1,reason:"window-gesture-active"};let t=this.controller.restoreSnapshot(e);return t.ok&&(this.history.clear(),this.#N()),t}restoreLegacyWorkspace(e){this.#F("restore legacy workspace");let t=this.controller.snapshot();return this.restoreSnapshot({version:Qo,compactMode:t.compactMode,windowIds:t.windowIds,minimizedWindowIds:t.minimizedWindowIds,closedWindowIds:t.closedWindowIds,maximizedWindowId:t.maximizedWindowId,modals:t.modals,workspace:e})}snapshot(){return this.controller.snapshot()}async undo(){if(this.#F("undo"),this.#I())return!1;let e=await this.history.undo();return e&&this.#N(),e}async redo(){if(this.#F("redo"),this.#I())return!1;let e=await this.history.redo();return e&&this.#N(),e}inspect(){return{disposed:this.#f,ownsOverlays:this.#e,ownsHistory:this.#t,ownsCapture:this.#i,commitRevision:this.commitRevision.peek(),viewRevision:this.viewRevision.peek(),switcherOpen:this.#p!==void 0,controller:this.controller.inspect(),interaction:this.interactions.inspect(),history:this.history.inspect(),separatorResize:this.#b?{pointerId:this.#b.pointerId,splitId:this.#b.splitId,direction:this.#b.direction,delta:this.#b.delta}:void 0}}dispose(){this.#f||(this.#f=!0,this.#S(),this.interactions.dispose(),this.#d.dispose(),this.windowHistory.dispose(),this.history.clear(),this.controller.dispose(),this.#i&&this.capture.dispose(),this.#e&&this.overlays.dispose(),this.commitRevision.dispose(),this.viewRevision.dispose())}#g(e,t,r,o,i,a,s=[]){let l=this.#n.get(e)??If();this.#n.set(e,l),Af(l,{rect:o,title:t,maximized:a.state==="maximized",alwaysOnTop:r==="floating"?a.alwaysOnTop:void 0,showConfig:this.#h(e),configLabel:this.#u,configAccessibilityLabel:`Configure ${t}`});let d=this.#a.get(e)??[];this.#a.set(e,d);let c=Of(d,l),u=o.column+Math.floor((Math.max(1,o.width)-1)/2),h=c.filter(p=>!(p.hitRect.row===o.row&&ct(p.hitRect,u,o.row))).map(p=>{let m=qv(e,p.kind,r,a.state);return{kind:p.kind,text:p.text,rect:Jt(p.rect),hitRect:Jt(p.hitRect),tone:p.tone,command:m,semantic:{id:`${e}:control:${p.kind}`,role:"button",label:p.accessibilityLabel,shortcut:p.shortcut?`Alt+${p.shortcut}`:void 0}}}),f=[r==="floating"?"Floating window":"Tiled window",a.active?"active":void 0,a.alwaysOnTop?"always on top":void 0,a.groupId?`group ${a.groupId}`:void 0].filter(Boolean).join(", ");return{id:e,title:t,placement:r,state:a.state,rect:Jt(o),titleBarRect:{column:o.column,row:o.row,width:Math.max(0,o.width),height:o.height>0?1:0},clientRect:Zv(o,1),active:a.active,alwaysOnTop:a.alwaysOnTop,groupId:a.groupId,zIndex:i,controls:h,titleAdornments:s,semantic:{id:`${e}:window`,role:"window",label:t,description:f,selected:a.active}}}#m(e,t){let r=e.windows.filter(i=>i.state==="minimized"&&i.declaredVisible),o=new Map;if(t&&t.width>0&&t.height>0){let i=Tf(this.#l,{row:t.row,column:t.column,width:t.width,entries:r.map(a=>({id:a.id,title:a.title??a.id}))});o=new Map(i.buttons.map(a=>[a.id,Jt(a.rect)]))}return r.map((i,a)=>({id:i.id,title:i.title??i.id,active:i.active,placement:i.placement,rect:o.get(i.id),command:{kind:"restore",id:i.id},semantic:{id:`${i.id}:shelf`,role:"button",label:`Restore ${i.title??i.id}`,positionInSet:a+1,setSize:r.length}}))}#w(e,t){let r=this.#R(e,t);if(!r)return;let o=new Map(e.windows.map(a=>[a.id,a])),i=r.ids.flatMap((a,s)=>{let l=o.get(a);if(!l)return[];let d=s===r.selectedIndex;return[{id:a,title:l.title??a,selected:d,state:l.state,semantic:{id:`${a}:switcher`,role:"option",label:l.title??a,selected:d,positionInSet:s+1,setSize:r.ids.length}}]});return{selectedIndex:Math.min(r.selectedIndex,Math.max(0,i.length-1)),items:i,semantic:{id:"window-switcher",role:"listbox",label:"Windows"}}}#v(e,t){let r=this.interactions.inspect();if(!r.snapOnRelease)return;let o=r.active;if(!o||o.mode!=="move"||o.updateCount===0)return;let i=Ud({column:o.current.column,row:o.current.row},e,r.snapDistance,r.snapEdgeSpanRatio,r.snapCornerReach);if(!i)return;let a=t.windows.find(l=>l.id===o.windowId);if(!a||a.groupId)return;let s=tx(i,e,a);return s?{windowId:o.windowId,target:i,rect:s}:void 0}#x(e,t){let r=this.interactions.handlePointer(e,t);return r.status==="committed"?this.#N():r.handled&&this.#M(),{status:r.status==="failed"?"failed":r.status==="blocked"?"blocked":r.status==="disposed"?"disposed":r.handled?"applied":"ignored",handled:r.handled,interaction:r,reason:r.reason}}#y(e,t,r){let o=t.coordinates.cell,i;try{if(i=this.windowHistory.beginGesture({action:"resize",id:e.splitId,parameters:{pointer:t.pointerId}}),i.inspect().state!=="active")return ee("blocked",!1,e.command,void 0,void 0,i.inspect().reason);this.capture.capture(t.pointerId,this.#c)}catch(a){return Tt(()=>i?.cancel()),ee("blocked",!1,e.command,void 0,void 0,Xt(a))}return this.#b={pointerId:t.pointerId,splitId:e.splitId,direction:e.direction,startPointerColumn:o.x,startPointerRow:o.y,startSeparatorColumn:e.rect.column,startSeparatorRow:e.rect.row,delta:0,options:Xv(r),gesture:i},this.#M(),ee("applied",!0,e.command,void 0,void 0,"separator-resize-started")}#P(e,t){let r=this.#b,o={kind:"resize-split",splitId:r.splitId,delta:0};if(e.pointerId!==r.pointerId)return ee("blocked",!1,o,void 0,void 0,"another-pointer-owns-separator-resize");if(this.capture.captureOwner(r.pointerId)!==this.#c)return this.#S()&&this.#M(),ee("blocked",!1,o,void 0,void 0,"separator-pointer-capture-lost");if(e.kind==="cancel")return this.#S()&&this.#M(),ee("applied",!0,o,void 0,void 0,"separator-resize-cancelled");if(e.kind!=="move"&&e.kind!=="up")return ee("ignored",!1,o,void 0,void 0,"separator-resize-event-ignored");let i,a=e.coordinates.cell;if(a){let d=(r.direction==="row"?a.x-r.startPointerColumn:a.y-r.startPointerRow)-r.delta;if(d!==0){if(i=this.controller.resize(r.splitId,d,t,r.options),!i.ok){let c=i.reason;return this.#S(),this.#M(),ee("blocked",!0,{...o,delta:d},i,void 0,c)}if(i.status==="applied"){let c=this.controller.project(t,r.options).workspace.separators.find(u=>u.splitId===r.splitId);if(!c)return this.#S(),this.#M(),ee("blocked",!0,{...o,delta:r.delta},i,void 0,"separator-disappeared-during-resize");r.delta=r.direction==="row"?c.rect.column-r.startSeparatorColumn:c.rect.row-r.startSeparatorRow}}}if(e.kind==="move")return i?.status==="applied"&&this.#M(),ee(i?.status==="applied"?"applied":"unchanged",!0,{...o,delta:r.delta},i);let s=!1;try{s=r.gesture.commit()}catch(l){return Tt(()=>this.capture.release(r.pointerId,this.#c)),this.#b=void 0,ee("failed",!0,{...o,delta:r.delta},i,void 0,Xt(l))}return Tt(()=>this.capture.release(r.pointerId,this.#c)),this.#b=void 0,s?this.#N():this.#M(),ee(s?"applied":"unchanged",!0,{...o,delta:r.delta},i,void 0,"separator-resize-committed")}#S(){let e=this.#b;if(!e)return!1;this.#b=void 0;let t=!1;try{t=e.gesture.cancel()}finally{this.capture.disposed||Tt(()=>this.capture.release(e.pointerId,this.#c))}return t}#I(){return this.#b!==void 0||this.interactions.inspect().active!==void 0}#A(e){let t=new Set(e.windows.map(s=>s.id));for(let s of this.#n.keys())t.has(s)||this.#n.delete(s);for(let s of this.#a.keys())t.has(s)||this.#a.delete(s);this.#l.buttons.length=0,this.#l.items.length=0,this.#l.placements.length=0;let r=this.#p;if(!r)return;let o=r.ids[r.selectedIndex],i=r.ids.filter(s=>t.has(s));if(i.length===0){this.#p=void 0;return}let a=o===void 0?-1:i.indexOf(o);this.#p={ids:i,selectedIndex:a>=0?a:0}}#k(e,t){return t.status==="applied"?this.#N():t.ok&&this.#M(),ee(t.status==="applied"?"applied":t.status==="unchanged"?"unchanged":t.status==="disposed"?"disposed":t.status==="invalid"?"invalid":"blocked",t.ok,e,t,void 0,t.reason)}#_(e,t,r){let o=this.controller.inspect(),i=this.#$(o,r);if(i.length===0)return ee("blocked",!1,e,void 0,void 0,"no-focusable-windows");let a=i.findIndex(d=>d.id===o.activeWindowId),s=a<0?e.direction>0?0:i.length-1:(a+e.direction+i.length)%i.length,l=i[s];return l.state==="minimized"&&this.execute({kind:"restore",id:l.id},t,r),this.execute({kind:"focus",id:l.id},t,r)}#T(e,t,r){let o=this.controller.inspect(),i=this.#$(o,r).map(a=>a.id);if(i.length===0)return this.#p=void 0,ee("blocked",!1,t,void 0,void 0,"no-switcher-windows");if(this.#p){let a=this.#p.ids[this.#p.selectedIndex],s=i.indexOf(a??""),l=s>=0?s:Math.max(0,i.indexOf(o.activeWindowId??""));this.#p={ids:i,selectedIndex:(l+e+i.length)%i.length}}else{let a=Math.max(0,i.indexOf(o.activeWindowId??""));this.#p={ids:i,selectedIndex:(a+e+i.length)%i.length}}return this.#M(),ee("applied",!0,t)}#C(e,t,r){let o=this.controller.inspect(),i=this.#R(o,r),a=i?.ids[i.selectedIndex];if(this.#p=void 0,this.#M(),!a)return ee("unchanged",!1,e,void 0,void 0,"switcher-is-closed");let s=this.#$(o,r).find(l=>l.id===a);return s?(s.state==="minimized"&&this.execute({kind:"restore",id:a},t,r),this.execute({kind:"focus",id:a},t,r)):ee("blocked",!1,e,void 0,void 0,"switcher-window-not-visible")}#$(e,t){let r=t.visibleWindowIds?new Set(t.visibleWindowIds):void 0;return e.windows.filter(o=>o.declaredVisible&&o.state!=="closed"&&(o.placement==="floating"||!r||r.has(o.id))).sort((o,i)=>i.focusOrder-o.focusOrder||o.id.localeCompare(i.id))}#R(e,t){let r=this.#p;if(!r)return;let o=this.#$(e,t).map(l=>l.id);if(o.length===0){this.#p=void 0;return}let i=r.ids[r.selectedIndex],a=o.indexOf(i??""),s=o.indexOf(e.activeWindowId??"");return this.#p={ids:o,selectedIndex:a>=0?a:s>=0?s:0},this.#p}#O(e,t){let r=this.controller.inspect().windows.filter(a=>a.placement==="floating"&&a.declaredVisible&&a.state!=="minimized"&&a.state!=="closed"),o;try{o=this.windowHistory.beginGesture({action:"recover-bounds",parameters:{all:1}})}catch(a){return ee("blocked",!1,e,void 0,void 0,Xt(a))}if(o.inspect().state!=="active")return ee("blocked",!1,e,void 0,void 0,o.inspect().reason);let i=!1;try{for(let s of r){let l=this.controller.recoverBounds(s.id,t,{titleBarHeight:1});if(!l.ok)return o.cancel(),ee("blocked",!1,e,l,void 0,l.reason);i||=l.status==="applied"}let a=o.commit();return i||a?this.#N():this.#M(),ee(i?"applied":"unchanged",i,e)}catch(a){try{o.cancel()}catch{}return ee("failed",!1,e,void 0,void 0,Xt(a))}}#D(e){let t=e.id??this.controller.inspect().activeWindowId;if(!t)return ee("blocked",!1,e,void 0,void 0,"no-active-window");let r;try{r=this.windowHistory.beginGesture({action:"set-placement",id:t,parameters:{placement:"floating",restore:1}})}catch(o){return ee("blocked",!1,e,void 0,void 0,Xt(o))}if(r.inspect().state!=="active")return ee("blocked",!1,e,void 0,void 0,r.inspect().reason);try{let o=this.controller.restore(t);if(!o.ok)return r.cancel(),ee("blocked",!1,e,o,void 0,o.reason);let i=this.controller.setPlacement(t,"floating");if(!i.ok)return r.cancel(),ee("blocked",!1,e,i,void 0,i.reason);let a=o.status==="applied"||i.status==="applied",s=r.commit();return a||s?this.#N():this.#M(),ee(a?"applied":"unchanged",a,e,i)}catch(o){try{r.cancel()}catch{}return ee("failed",!1,e,void 0,void 0,Xt(o))}}#N(){this.commitRevision.value=this.commitRevision.peek()+1,this.#M()}#M(){this.viewRevision.value=this.viewRevision.peek()+1}#F(e){if(this.#f)throw new Error(`Workbench window host is disposed; cannot ${e}.`)}};function Xm(n){return new sc(n)}function qv(n,e,t,r){if(e!=="config")return e==="maximize"?{kind:"maximize",id:n}:e==="restore"?t==="tiled"&&r==="maximized"?{kind:"restore-floating",id:n}:{kind:"restore",id:n}:e==="minimize"?{kind:"minimize",id:n}:e==="close"?{kind:"close",id:n}:{kind:"toggle-always-on-top",id:n}}function Yv(n){let e=n.axis==="column"?"horizontally":"vertically";return{splitId:n.splitId,direction:n.direction,axis:n.axis,ratio:n.ratio,bounds:Jt(n.bounds),firstRect:Jt(n.firstRect),rect:Jt(n.rect),hitRect:Jt(n.hitRect),secondRect:Jt(n.secondRect),command:{kind:"resize-split",splitId:n.splitId,delta:1},semantic:{id:`${n.splitId}:separator`,role:"separator",label:`Resize split ${e}`,description:`Drag ${e} to resize adjacent tiled windows`}}}function ee(n,e,t,r,o,i){return{status:n,handled:e,command:t,action:r,interaction:o,reason:i}}function ti(n){return typeof n=="number"&&Number.isFinite(n)&&n>0}function Jt(n){return{column:n.column,row:n.row,width:n.width,height:n.height}}function Xv(n){return{gap:n.gap,separatorHitSize:n.separatorHitSize,compactMode:n.compactMode,visibleWindowIds:n.visibleWindowIds?[...n.visibleWindowIds]:void 0}}function Jv(n,e){let o=Math.max(1,127-e.length);return`${n.slice(0,o)}:${e}`}function Tt(n){try{n()}catch{}}function Zv(n,e){return{column:n.column+Math.min(e,Math.max(0,n.width)),row:n.row+Math.min(e,Math.max(0,n.height)),width:Math.max(0,n.width-e*2),height:Math.max(0,n.height-e*2)}}function Qv(n){return n==="left"||n==="right"||n==="top"||n==="bottom"?n:n==="up"?"top":n==="down"?"bottom":void 0}function Jm(n,e){return{columns:n==="left"?-e:n==="right"?e:0,rows:n==="top"?-e:n==="bottom"?e:0}}function ex(n,e){return Jm(n,e)}function tx(n,e,t){if(n.kind==="dock"||e.width<=0||e.height<=0)return;let r=Math.max(1,Math.ceil(e.width/2)),o=Math.max(1,Math.floor(e.width/2)),i=Math.max(1,Math.ceil(e.height/2)),a=Math.max(1,Math.floor(e.height/2)),s=n.kind==="workspace"?n.edge==="right":n.corner==="top-right"||n.corner==="bottom-right",l=n.kind==="workspace"?n.edge==="bottom":n.corner==="bottom-left"||n.corner==="bottom-right",d=n.kind==="workspace"&&(n.edge==="top"||n.edge==="bottom")?e.width:s?o:r,c=n.kind==="workspace"&&(n.edge==="left"||n.edge==="right")?e.height:l?a:i;return d=Math.max(t.minWidth??1,Math.min(t.maxWidth??1e6,d)),c=Math.max(t.minHeight??1,Math.min(t.maxHeight??1e6,c)),{column:s?e.column+e.width-d:e.column,row:l?e.row+e.height-c:e.row,width:d,height:c}}function Xt(n){return n instanceof Error&&Array.from(n.message,t=>{let r=t.charCodeAt(0);return r<=31||r===127?" ":t}).join("").trim().slice(0,256)||"window-host-operation-failed"}var R8=Object.freeze(["0d","0dt","1d","1dt","2d","2dt","3d","3dt"]);function Ea(n){return Number(n[0])}function Ia(n){return n.endsWith("t")}function Zm(n,e){return`${n}d${e?"t":""}`}function nx(n,e){return Ea(n)!==Ea(e)?!1:Ia(n)||!Ia(e)}function Qm(n,e){let t=typeof e=="string"?[e]:e;return t.find(r=>r===n)??t.find(r=>nx(n,r))}function ep(n){if(typeof n=="number")return[];if(!Array.isArray(n))return[];let e=n[0];return[n.length,...ep(e)]}function tp(n){let e=ep(n);return Math.min(3,e.length)}function*lc(n){if(typeof n=="number"){Number.isFinite(n)&&(yield n);return}if(Array.isArray(n))for(let e of n)yield*lc(e)}var rx=512,Xr=class{rank;label;capacity;#e;#t=[];constructor(e,t={}){this.rank=e,this.label=t.label??"",this.capacity=Math.max(1,Math.floor(t.capacity??rx)),t.domain&&(this.#e=t.domain)}get kind(){return Zm(this.rank,!0)}get length(){return this.#t.length}get domain(){return this.#e}push(e,t=Date.now()){let r=tp(e);if(r!==this.rank)throw new TypeError(`stream of rank ${this.rank} was pushed a rank ${r} reading`);this.#t.push({at:t,value:e}),this.#t.length>this.capacity&&(this.#t=this.#t.slice(this.#t.length-this.capacity))}latest(){return this.#t.at(-1)?.value}latestSample(){return this.#t.at(-1)}history(e){return e===void 0||e>=this.#t.length?this.#t:this.#t.slice(this.#t.length-Math.max(0,e))}values(e){return this.history(e).map(t=>t.value)}since(e){let t=this.#t.at(-1);if(!t)return[];let r=t.at-e,o=this.#t.length;for(;o>0&&this.#t[o-1].at>=r;)o-=1;return this.#t.slice(o)}clear(){this.#t=[]}};function dc(n){return new Xr(0,n)}function np(n){return new Xr(1,n)}function rp(n){return new Xr(2,n)}function op(n){return new Xr(3,n)}function vt(n,e){let t=Math.max(0,Math.floor(e));if(t===0)return[];if(n.length===0)return new Array(t).fill(0);if(n.length===t)return[...n];if(n.length<t)return Array.from({length:t},(o,i)=>{let a=Math.min(n.length-1,Math.floor(i*n.length/t));return n[a]});let r=[];for(let o=0;o<t;o+=1){let i=Math.floor(o*n.length/t),a=Math.max(i+1,Math.floor((o+1)*n.length/t)),s=0;for(let c=i;c<a;c+=1)s+=n[c];let l=s/(a-i),d=n[i];for(let c=i;c<a;c+=1)Math.abs(n[c]-l)>Math.abs(d-l)&&(d=n[c]);r.push(d)}return r}function Me(n){if(!Number.isFinite(n.min)||!Number.isFinite(n.max))return{min:0,max:1};if(n.max>n.min)return n;let e=n.min;return{min:e-.5,max:e+.5}}function He(n){let e=1/0,t=-1/0;for(let r of n)for(let o of lc(r))o<e&&(e=o),o>t&&(t=o);return Me({min:e,max:t})}function fn(n,e){if(e)return Me(e);let t=He(n);return Me({min:Math.min(0,t.min),max:Math.max(0,t.max)})}function ve(n,e){let t=Me(e);return Number.isFinite(n)?Math.min(1,Math.max(0,(n-t.min)/(t.max-t.min))):0}function cc(n){return[...n].sort()}var Jr=[ue("box","Box","primitive","Filled rectangular surface for backgrounds and panels.",["component","themeable"]),ue("button","Button","input","Clickable and focusable command button.",["component","controller","keyboard","mouse","themeable"]),ue("checkbox","CheckBox","input","Boolean input with keyboard and mouse toggling.",["component","controller","keyboard","mouse","themeable"]),ue("combobox","ComboBox","input","Text input with selectable suggestions.",["component","controller","keyboard","mouse","selection","themeable"]),ue("input","Input","input","Single-line text entry.",["component","controller","keyboard","themeable"]),ue("textbox","TextBox","input","Multi-line text editor with cursor, line numbers, and selection.",["component","controller","keyboard","themeable"]),ue("slider","Slider","input","Horizontal or vertical numeric slider.",["component","controller","keyboard","mouse","themeable"]),ue("radio-group","RadioGroup","input","Single-choice option group renderer.",["component","controller","render-helper","selection","keyboard","mouse","themeable"]),ue("list","List","data","Selectable list component.",["component","controller","selection","themeable"]),ue("virtual-list","VirtualList","data","Windowed list component for large item sets.",["component","controller","selection","virtualized","themeable"]),ue("table","Table","data","Scrollable table component with headers and selection.",["component","controller","selection","themeable"]),ue("data-table","DataTable","data","Filtering, sorting, pagination, and row formatting helpers.",["controller","render-helper","selection"]),ue("tree","Tree","data","Hierarchical rows with expansion state.",["component","controller","render-helper","selection","keyboard","themeable"]),ue("file-explorer","FileExplorer","data","Path-aware tree controller for project and file browsers.",["controller","selection","keyboard","mouse","themeable"]),ue("tabs","Tabs","navigation","Segmented route or view selector.",["controller","render-helper","selection","keyboard","themeable"]),ue("breadcrumbs","Breadcrumbs","navigation","Truncated path and route trail renderer.",["render-helper"]),ue("stepper","Stepper","navigation","Sequential workflow step indicator.",["controller","render-helper","selection"]),ue("menu-bar","MenuBar","navigation","Top-level command menu row.",["controller","render-helper","selection","keyboard"]),ue("key-help","KeyHelp","navigation","Formatted key binding help rows.",["render-helper","keyboard"]),ue("command-palette","CommandPalette","overlay","Filterable command surface.",["controller","render-helper","selection","keyboard","async"]),ue("context-menu","ContextMenu","overlay","Selectable contextual command list.",["controller","render-helper","selection","keyboard","mouse"]),ue("modal","Modal","overlay","Centered overlay frame and focus target.",["controller","render-helper","keyboard","mouse","themeable"]),ue("toast","ToastStack","overlay","Transient notification stack renderer.",["controller","render-helper","async"]),ue("empty-state","EmptyState","feedback","Centered empty, loading, or fallback message.",["render-helper","async"]),ue("spinner","Spinner","feedback","Animated status indicator renderer.",["render-helper","async"]),ue("progressbar","ProgressBar","feedback","Horizontal or vertical progress component.",["component","controller","themeable"]),ue("statusbar","StatusBar","feedback","Left/right status row renderer.",["component","render-helper","themeable"]),ue("sparkline","Sparkline","visualization","Compact trend renderer for metric arrays.",["component","render-helper","dashboard"]),ue("gauge","Gauge","visualization","Compact labeled value bar renderer.",["render-helper","dashboard"]),ue("chart","Chart","visualization","Text bar chart renderer.",["render-helper","dashboard"]),ue("log-viewer","LogViewer","data","Tail-following log row window helpers.",["controller","render-helper","virtualized","dashboard"]),ue("metric-series","MetricSeries","data","Bounded metric history controller and statistics.",["controller","dashboard"]),ue("three-ascii","ThreeAscii","visualization","Three.js scene renderer for terminal ASCII output.",["component","three","dashboard"]),ue("frame","Frame","layout","Bordered component frame.",["component","themeable"]),ue("window-manager","WindowManager","layout","Tiling window state, fullscreen tabs, and chrome model.",["controller","keyboard","mouse"]),ue("scroll-area","ScrollArea","layout","Viewport and scrollbar helper renderers.",["controller","render-helper","virtualized"]),ue("pad","Pad","layout","Off-screen scrollable text surface with viewport slicing and cursor reveal.",["controller","render-helper","virtualized","keyboard","mouse"]),ue("label","Label","primitive","Aligned text component.",["component","themeable"]),ue("text","Text","primitive","Raw text draw object.",["component","themeable"])],D8=ix(Jr),z8=ax(Jr),$8=sx(Jr),H8=lx(Jr);function ue(n,e,t,r,o){return{id:n,name:e,category:t,description:r,capabilities:o}}function ur(n){return n.toLowerCase().replace(/[\s_-]+/g,"")}function ix(n){let e=new Map;for(let t=0;t<n.length;t+=1){let r=n[t];e.set(ur(r.id),r),e.set(ur(r.name),r)}return e}function ax(n){let e=new Map;for(let t=0;t<n.length;t+=1){let r=n[t],o=`${ur(r.id)} ${ur(r.name)} ${ur(r.description)} ${ur(r.category)}`;for(let i=0;i<r.capabilities.length;i+=1)o+=` ${ur(r.capabilities[i])}`;e.set(r,o)}return e}function sx(n){let e=new Set;for(let t=0;t<n.length;t+=1)e.add(n[t].category);return cc(e)}function lx(n){let e=new Set;for(let t=0;t<n.length;t+=1){let r=n[t].capabilities;for(let o=0;o<r.length;o+=1)e.add(r[o])}return cc(e)}var dp=["black","red","green","yellow","blue","magenta","cyan","white","brightBlack","brightRed","brightGreen","brightYellow","brightBlue","brightMagenta","brightCyan","brightWhite"];function mn(n){return n}function cp(n){let e=dx(n);if(e.length===0)return mn;let t=`\x1B[${e.join(";")}m`;return r=>`${t}${r}\x1B[0m`}function up(n){return cp(n)}function ip(n){let e={};for(let[t,r]of Object.entries(n))e[t]=cp(r);return e}function dx(n){let e=[];if(n.bold&&e.push(1),n.dim&&e.push(2),n.italic&&e.push(3),n.underline){let t=n.underlineStyle??"solid",r=["solid","double","wavy","dotted","dashed"].indexOf(t);e.push(r<=0?4:`4:${r+1}`)}if(n.overline&&e.push(53),n.inverse&&e.push(7),n.strikethrough&&e.push(9),n.foreground!==void 0&&e.push(...uc(n.foreground,!1)),n.background!==void 0&&e.push(...uc(n.background,!0)),n.underlineColor!==void 0){let t=n.underlineColor;e.push(58,...typeof t=="string"?[5,Math.max(0,dp.indexOf(t))]:uc(t,!1).slice(1))}return e}function uc(n,e){if(typeof n=="number")return[e?48:38,5,Aa(n)];if(typeof n!="string"){let[t,r,o]=n;return[e?48:38,2,Aa(t),Aa(r),Aa(o)]}return[cx(n,e)]}function cx(n,e){let t=dp.indexOf(n),r=e?40:30;return t<8?r+t:r+60+t-8}function Aa(n){return Math.max(0,Math.min(255,Math.round(n)))}var hc=["foreground","muted","accent","success","warning","danger","surface"];var Y8={plain:{foreground:mn,muted:mn,accent:mn,success:mn,warning:mn,danger:mn,surface:mn},neon:{...ip({foreground:{foreground:[230,255,246]},muted:{foreground:[104,124,132]},accent:{foreground:[31,231,210]},success:{foreground:[156,255,58]},warning:{foreground:[255,196,87]},danger:{foreground:[255,79,216]},surface:{background:[7,16,23]}})},terminal:{...ip({foreground:{foreground:"white"},muted:{foreground:"brightBlack"},accent:{foreground:"cyan"},success:{foreground:"green"},warning:{foreground:"yellow"},danger:{foreground:"red"}}),surface:mn}};function ux(n={},e={}){let t={...n.variants??{}};for(let[r,o]of Object.entries(e.variants??{}))t[r]={...t[r]??{},...o};return{extends:fx(n.extends,e.extends),base:{...n.base??{},...e.base??{}},variants:t}}function hx(...n){let e={},t={};for(let r of n){Object.assign(e,r.tokens??{});for(let[o,i]of Object.entries(r.components??{}))t[o]=ux(t[o],i)}return{tokens:e,components:t}}function fx(n,e){let t=[...ap(n),...ap(e)];return t.length===0?void 0:[...new Set(t)]}function ap(n){return n===void 0?[]:typeof n=="string"?[n]:[...n]}function mx(...n){return hx(...n)}var fc=[...Jr].sort((n,e)=>n.name.localeCompare(e.name)),X8=fc.map(n=>n.name),px=new Set(fc.flatMap(n=>[Zr(n.id),Zr(n.name)]));function gx(n={}){let e=n.components?new Set([...n.components].map(Zr)):void 0,t={};for(let r of fc)e&&!e.has(Zr(r.id))&&!e.has(Zr(r.name))||(t[r.name]=bx(r));if(e)for(let r of n.components??[])px.has(Zr(r))||(t[r]=hp());return t}function ni(n={}){return mx({components:gx()},n)}function bx(n){return n.name==="Button"?lp():n.name==="Frame"||n.name==="Box"||n.name==="WindowManager"?sp():n.category==="data"?yx():n.category==="input"||n.capabilities.includes("selection")?lp():n.category==="overlay"?wx():n.category==="feedback"||n.category==="visualization"?vx():n.category==="navigation"||n.category==="layout"?sp():hp()}function hp(){return{base:{base:"foreground",focused:"accent",active:"success",disabled:"muted"},variants:{muted:{base:"muted"},danger:{base:"danger"},warning:{base:"warning"},success:{base:"success"}}}}function sp(){return{base:{base:["surface","foreground"],focused:["surface","accent"],active:["surface","success"],disabled:["surface","muted"]},variants:{chrome:{base:["surface","accent"],active:["surface","success"]},quiet:{base:"muted",focused:"accent"},danger:{base:["surface","danger"],focused:["surface","warning"]}}}}function lp(){return{base:{base:["surface","foreground"],focused:["surface","accent"],active:["surface","success"],disabled:["surface","muted"]},variants:{primary:{base:["surface","accent"],active:["surface","success"]},quiet:{base:"muted",focused:"accent"},danger:{base:"danger",focused:"warning",active:"danger"},warning:{base:"warning",focused:"accent",active:"warning"},success:{base:"success",focused:"accent",active:"success"}}}}function yx(){return{base:{base:"foreground",focused:"accent",active:["surface","foreground"],disabled:"muted"},variants:{header:{base:["surface","accent"],active:["surface","success"]},selected:{base:["surface","foreground"],focused:["surface","accent"],active:["surface","success"]},stale:{base:"warning",focused:"accent"},danger:{base:"danger",focused:"warning"}}}}function wx(){return{base:{base:["surface","foreground"],focused:["surface","accent"],active:["surface","success"],disabled:["surface","muted"]},variants:{palette:{base:["surface","foreground"],focused:["surface","accent"],active:["surface","success"]},warning:{base:["surface","warning"],focused:["surface","accent"]},danger:{base:["surface","danger"],focused:["surface","warning"]}}}}function vx(){return{base:{base:"foreground",focused:"accent",active:"success",disabled:"muted"},variants:{info:{base:"accent",active:"accent"},success:{base:"success",active:"success"},warning:{base:"warning",active:"warning"},danger:{base:"danger",active:"danger"}}}}function Zr(n){return n.toLowerCase().replaceAll(/[^a-z0-9]/g,"")}var J8=[{id:"plain",label:"Plain",palette:"plain",options:ni()},{id:"neon",label:"Neon",palette:"neon",options:ni()},{id:"terminal",label:"Terminal",palette:"terminal",options:ni()}];var Oa=new Set(hc),mc=class n{#e;constructor(e){this.#e=e??new Map}declare(e,t){if(!e.includes(":"))throw new TypeError(`token "${e}" must be namespaced as "namespace:name"`);if(Oa.has(e))throw new TypeError(`token "${e}" collides with the compatibility profile`);if(this.#e.has(e))throw new TypeError(`token "${e}" is already declared`);if(!Oa.has(t.fallback)&&!this.#e.has(t.fallback))throw new TypeError(`fallback "${t.fallback}" is not a known token`);let r=new Map(this.#e);return r.set(e,{fallback:t.fallback,description:t.description}),new n(r)}has(e){return Oa.has(e)||this.#e.has(e)}known(){return[...hc,...this.#e.keys()]}chain(e){let t=[e],r=e;for(;!Oa.has(r);){let o=this.#e.get(r);if(!o)break;r=o.fallback,t.push(r)}return t}style(e,t){for(let r of this.chain(e)){let o=t[r];if(o!==void 0)return o}}};function fp(){return new mc}var n7=Object.freeze({chrome:"Chrome basics",window:"Windows",button:"Buttons",menu:"Menus",control:"Controls",scrollbar:"Scrollbars",desktop:"Desktop",status:"Status",viz:"Visualisations"}),xx=[{name:"chrome:background",group:"chrome",label:"Panel background",fallback:"surface",role:"background",description:"The ground every panel, window body and control sits on."},{name:"desktop:background",group:"chrome",label:"Desktop background",fallback:"surface",role:"background",description:"Behind every window, where the wallpaper or animation shows."},{name:"chrome:foreground",group:"chrome",label:"Text",fallback:"foreground",role:"foreground",against:"chrome:background",description:"Body text on a panel."},{name:"chrome:muted",group:"chrome",label:"Secondary text",fallback:"muted",role:"foreground",against:"chrome:background",description:"Labels, hints and anything meant to sit behind the body text."},{name:"chrome:line",group:"chrome",label:"Lines and borders",fallback:"muted",role:"line",against:"chrome:background",description:"Frames, separators and rules."},{name:"chrome:accent",group:"chrome",label:"Accent fill",fallback:"accent",role:"background",description:"The colour that marks what is focused, selected or active."},{name:"chrome:on-accent",group:"chrome",label:"Text on accent",fallback:"surface",role:"foreground",against:"chrome:accent",description:"Text drawn on top of an accent fill."}],kx=[{name:"window:background",group:"window",label:"Window body",fallback:"chrome:background",role:"background"},{name:"window:foreground",group:"window",label:"Window text",fallback:"chrome:foreground",role:"foreground",against:"window:background"},{name:"window:border",group:"window",label:"Border",fallback:"chrome:line",role:"line"},{name:"window:border-active",group:"window",label:"Active border",fallback:"chrome:accent",role:"line",description:"The frame around the window with focus."},{name:"window:titlebar-background",group:"window",label:"Title bar",fallback:"chrome:background",role:"background"},{name:"window:titlebar-foreground",group:"window",label:"Title bar text",fallback:"chrome:foreground",role:"foreground",against:"window:titlebar-background"},{name:"window:titlebar-background-active",group:"window",label:"Active title bar",fallback:"chrome:accent",role:"background"},{name:"window:titlebar-foreground-active",group:"window",label:"Active title bar text",fallback:"chrome:on-accent",role:"foreground",against:"window:titlebar-background-active"},{name:"button:background",group:"button",label:"Button",fallback:"chrome:background",role:"background"},{name:"button:foreground",group:"button",label:"Button text",fallback:"chrome:foreground",role:"foreground",against:"button:background"},{name:"button:border",group:"button",label:"Button border",fallback:"chrome:line",role:"line"},{name:"button:background-active",group:"button",label:"Pressed button",fallback:"chrome:accent",role:"background"},{name:"button:foreground-active",group:"button",label:"Pressed button text",fallback:"chrome:on-accent",role:"foreground",against:"button:background-active"},{name:"button:background-disabled",group:"button",label:"Disabled button",fallback:"chrome:background",role:"background"},{name:"button:foreground-disabled",group:"button",label:"Disabled button text",fallback:"chrome:muted",role:"foreground",against:"button:background-disabled"},{name:"menu:background",group:"menu",label:"Menu",fallback:"chrome:background",role:"background"},{name:"menu:foreground",group:"menu",label:"Menu item",fallback:"chrome:foreground",role:"foreground",against:"menu:background"},{name:"menu:background-selected",group:"menu",label:"Highlighted item",fallback:"chrome:accent",role:"background"},{name:"menu:foreground-selected",group:"menu",label:"Highlighted item text",fallback:"chrome:on-accent",role:"foreground",against:"menu:background-selected"},{name:"menu:border",group:"menu",label:"Menu border",fallback:"chrome:line",role:"line"},{name:"menu:shortcut",group:"menu",label:"Shortcut hint",fallback:"chrome:muted",role:"foreground",against:"menu:background"},{name:"control:background",group:"control",label:"Control",fallback:"chrome:background",role:"background"},{name:"control:foreground",group:"control",label:"Control text",fallback:"chrome:foreground",role:"foreground",against:"control:background"},{name:"control:background-selected",group:"control",label:"Selected row",fallback:"chrome:accent",role:"background"},{name:"control:foreground-selected",group:"control",label:"Selected row text",fallback:"chrome:on-accent",role:"foreground",against:"control:background-selected"},{name:"control:background-selected-unfocused",group:"control",label:"Selected row, unfocused",fallback:"chrome:muted",role:"background",description:"The current row of a list that does not hold the keyboard."},{name:"control:foreground-selected-unfocused",group:"control",label:"Selected row text, unfocused",fallback:"chrome:on-accent",role:"foreground",against:"control:background-selected-unfocused"},{name:"control:border-focused",group:"control",label:"Focus ring",fallback:"chrome:accent",role:"line"},{name:"control:placeholder",group:"control",label:"Placeholder text",fallback:"chrome:muted",role:"foreground",against:"control:background"},{name:"control:selection-background",group:"control",label:"Text selection",fallback:"chrome:accent",role:"background"},{name:"control:selection-foreground",group:"control",label:"Selected text",fallback:"chrome:on-accent",role:"foreground",against:"control:selection-background"},{name:"scrollbar:track",group:"scrollbar",label:"Track",fallback:"chrome:background",role:"background"},{name:"scrollbar:thumb",group:"scrollbar",label:"Thumb",fallback:"chrome:muted",role:"foreground",against:"scrollbar:track"},{name:"scrollbar:thumb-active",group:"scrollbar",label:"Dragged thumb",fallback:"chrome:accent",role:"foreground",against:"scrollbar:track"},{name:"desktop:topbar-background",group:"desktop",label:"Top bar",fallback:"chrome:background",role:"background"},{name:"desktop:topbar-foreground",group:"desktop",label:"Top bar text",fallback:"chrome:foreground",role:"foreground",against:"desktop:topbar-background"},{name:"desktop:statusbar-background",group:"desktop",label:"Status bar",fallback:"chrome:background",role:"background"},{name:"desktop:statusbar-foreground",group:"desktop",label:"Status bar text",fallback:"chrome:muted",role:"foreground",against:"desktop:statusbar-background"},{name:"status:success",group:"status",label:"Success",fallback:"success",role:"foreground",against:"chrome:background"},{name:"status:warning",group:"status",label:"Warning",fallback:"warning",role:"foreground",against:"chrome:background"},{name:"status:danger",group:"status",label:"Danger",fallback:"danger",role:"foreground",against:"chrome:background"},{name:"status:info",group:"status",label:"Info",fallback:"chrome:accent",role:"foreground",against:"chrome:background"}],Sx=[{name:"viz:background",group:"viz",label:"Chart ground",fallback:"chrome:background",role:"background"},{name:"viz:foreground",group:"viz",label:"Chart text",fallback:"chrome:foreground",role:"foreground",against:"viz:background"},{name:"viz:grid",group:"viz",label:"Grid lines",fallback:"chrome:line",role:"line"},{name:"viz:axis",group:"viz",label:"Axis and ticks",fallback:"chrome:muted",role:"foreground",against:"viz:background"},{name:"viz:series",group:"viz",label:"Series",fallback:"chrome:accent",role:"foreground",against:"viz:background"},{name:"viz:series-alt",group:"viz",label:"Second series",fallback:"status:info",role:"foreground",against:"viz:background"},{name:"viz:calm",group:"viz",label:"Calm",fallback:"status:success",role:"foreground",against:"viz:background"},{name:"viz:warn",group:"viz",label:"Warning",fallback:"status:warning",role:"foreground",against:"viz:background"},{name:"viz:alarm",group:"viz",label:"Alarm",fallback:"status:danger",role:"foreground",against:"viz:background"}],mp=Object.freeze([...xx,...kx,...Sx]),r7=new Map(mp.map(n=>[n.name,n]));var La;function Mx(){if(La)return La;let n=fp();for(let e of mp)n=n.declare(e.name,{fallback:e.fallback,...e.description!==void 0?{description:e.description}:{}});return La=n,La}function Tx(n){let e=Mx();return e.has(n)?e.chain(n):[n]}function pp(n,e){for(let t of Tx(n)){let r=e[t];if(r)return r}}var pn=Object.freeze({background:[16,18,24],foreground:[220,226,240],grid:[44,52,68],axis:[110,122,148],series:[96,176,255],seriesAlt:[126,220,200],ramp:[[90,200,120],[230,180,70],[230,90,90]]});function Pa(n){let e=(t,r)=>{let o=pp(t,n);return o?[o[0],o[1],o[2]]:r};return{background:e("viz:background",pn.background),foreground:e("viz:foreground",pn.foreground),grid:e("viz:grid",pn.grid),axis:e("viz:axis",pn.axis),series:e("viz:series",pn.series),seriesAlt:e("viz:series-alt",pn.seriesAlt),ramp:[e("viz:calm",pn.ramp[0]),e("viz:warn",pn.ramp[1]),e("viz:alarm",pn.ramp[2])]}}function zn(n,e,t){let r=Math.min(1,Math.max(0,t));return[Math.round(n[0]+(e[0]-n[0])*r),Math.round(n[1]+(e[1]-n[1])*r),Math.round(n[2]+(e[2]-n[2])*r)]}var gp=32;function xe(n,e){let t=Math.round(Math.min(1,Math.max(0,e))*gp)/gp,r=n.ramp.length-1,o=t*r,i=Math.min(r-1,Math.floor(o));return zn(n.ramp[i],n.ramp[i+1],o-i)}function ke(n,e={char:" "}){let t=Math.max(0,Math.floor(n.width)),r=Math.max(0,Math.floor(n.height));return Array.from({length:r},()=>Array.from({length:t},()=>e))}function ge(n,e,t,r,o={}){let i=n[t];if(i)for(let a=0;a<r.length;a+=1){let s=e+a;s<0||s>=i.length||(i[s]={char:r[a],...o})}}function pc(n,e){let t=Math.round(e.column),r=Math.round(e.row),o=Math.round(n.column),i=Math.round(n.row),a=Math.abs(t-o),s=Math.abs(r-i),l=o<t?1:-1,d=i<r?1:-1,c=a-s,u=[],h=a+s+1;for(let f=0;f<=h&&(u.push({column:o,row:i}),!(o===t&&i===r));f+=1){let p=2*c;p>-s&&(c-=s,o+=l),p<a&&(c+=a,i+=d)}return u}function gc(n){if(n.length===0)return[];if(n.length===1)return[{column:Math.round(n[0].column),row:Math.round(n[0].row)}];let e=[];for(let t=1;t<n.length;t+=1){let r=pc(n[t-1],n[t]);e.push(...t===1?r:r.slice(1))}return e}var Rx=[[1,8],[2,16],[4,32],[64,128]],_x=" \u2598\u259D\u2580\u2596\u258C\u259E\u259B\u2597\u259A\u2590\u259C\u2584\u2599\u259F\u2588";function Cx(n){if(n===0)return" ";if(n===63)return"\u2588";if(n===21)return"\u258C";if(n===42)return"\u2590";let e=n-1;return n>21&&(e-=1),n>42&&(e-=1),String.fromCodePoint(129792+e)}var bp={braille:{x:2,y:4},sextant:{x:2,y:3},quadrant:{x:2,y:2},"full-cell":{x:1,y:1}};function yp(n){return bp[n]}function bc(n,e){let t=o=>o==="braille"?e.braille??!1:o==="sextant"?e.sextants??!1:o==="quadrant"?e.quadrants??!1:!0;if(t(n))return{backend:n,degraded:!1};let r=["braille","sextant","quadrant","full-cell"];for(let o of r.slice(r.indexOf(n)+1))if(t(o))return{backend:o,degraded:!0};return{backend:"full-cell",degraded:!0}}var Na=class{#e=new Set;width;height;constructor(e){this.width=Math.max(1,e.width),this.height=Math.max(1,e.height)}plot(e,t){let r=Math.floor(e),o=Math.floor(t);r<0||o<0||r>=this.width||o>=this.height||this.#e.add(o*this.width+r)}hasDot(e,t){return this.#e.has(Math.floor(t)*this.width+Math.floor(e))}render(e,t={}){let{backend:r,degraded:o}=bc(e,t),{x:i,y:a}=bp[r],s=Math.ceil(this.width/i),l=Math.ceil(this.height/a),d=[];for(let c=0;c<l;c+=1){let u="";for(let h=0;h<s;h+=1)u+=this.#t(r,h*i,c*a,i,a);d.push(u)}return{backend:r,requested:e,degraded:o,lines:d}}#t(e,t,r,o,i){let a=0,s=!1;for(let l=0;l<i;l+=1)for(let d=0;d<o;d+=1)this.hasDot(t+d,r+l)&&(s=!0,e==="braille"?a|=Rx[l][d]:(e==="sextant"||e==="quadrant")&&(a|=1<<l*2+d));switch(e){case"braille":return a===0?" ":String.fromCodePoint(10240+a);case"sextant":return Cx(a);case"quadrant":return _x[a]??" ";case"full-cell":return s?"\u2588":" "}}};function gn(n,e,t,r,o={}){let i=n[Math.round(t)];if(!i)return;let a=Math.round(e);a<0||a>=i.length||(i[a]={char:r,...o})}function yc(n,e){let t=e.column-n.column,r=e.row-n.row;return Math.abs(t)>=Math.abs(r)*2?"\u2500":Math.abs(r)>=Math.abs(t)*2?"\u2502":t>0==r>0?"\u2572":"\u2571"}var Wa="auto";function ri(n,e,t,r,o={}){let i=r===Wa?yc(e,t):r;for(let a of pc(e,t))gn(n,a.column,a.row,i,o)}function wc(n,e,t,r,o={}){let i=o.from??0,s=(o.to??1)-i;if(s===0)return;let l=Math.max(8,Math.round(Math.max(t.column,t.row)*8*Math.abs(s)));for(let d=0;d<=l;d+=1){let c=d/l,u=(i+s*c)*Math.PI*2;gn(n,e.column+Math.cos(u)*t.column,e.row+Math.sin(u)*t.row,r,o.styleAt?.(c)??{...o.foreground?{foreground:o.foreground}:{},...o.background?{background:o.background}:{}})}}function wp(n,e,t,r={}){for(let o=e.row;o<e.row+e.height;o+=1)for(let i=e.column;i<e.column+e.width;i+=1)gn(n,i,o,t,r)}var hr=class{#e;#t=new Map;#i;#r;#o;constructor(e,t={}){let{backend:r}=bc(t.backend??"braille",t.capabilities??{braille:!0,sextants:!0,quadrants:!0});this.#i=r,this.#r=yp(r),this.#o={width:Math.max(1,e.width),height:Math.max(1,e.height)},this.#e=new Na({width:this.#o.width*this.#r.x,height:this.#o.height*this.#r.y})}get resolution(){return{width:this.#o.width*this.#r.x,height:this.#o.height*this.#r.y}}get backend(){return this.#i}plot(e,t,r){if(this.#e.plot(e,t),!r)return;let o=Math.floor(t/this.#r.y)*this.#o.width+Math.floor(e/this.#r.x);this.#t.set(o,r)}paint(e,t={column:0,row:0},r={}){let{lines:o}=this.#e.render(this.#i,{braille:!0,sextants:!0,quadrants:!0});for(let i=0;i<o.length;i+=1){let a=o[i];for(let s=0;s<a.length;s+=1){let l=a[s];if(l===" ")continue;let d=this.#t.get(i*this.#o.width+s)??r.foreground;gn(e,t.column+s,t.row+i,l,{...r,...d?{foreground:d}:{}})}}}};var vc=["\u258F","\u258E","\u258D","\u258C","\u258B","\u258A","\u2589","\u2588"],Ex={id:"meter",label:"Meter",accepts:"0d",minimum:{width:3,height:1},weight:.5,render(n,e){let{width:t,height:r}=e.size,o=ke(e.size,{char:" ",background:e.theme.background});if(t<=0||r<=0)return o;let i=ve(n,Me(e.domain??{min:0,max:1})),a=xe(e.theme,i),s=i*t,l=Math.floor(s),d=s-l,c=o[0];for(let u=0;u<t;u+=1)if(u<l)c[u]={char:"\u2588",foreground:a,background:e.theme.background};else if(u===l&&d>0){let h=Math.min(vc.length-1,Math.floor(d*vc.length));c[u]={char:vc[h],foreground:a,background:e.theme.background}}else c[u]={char:"\xB7",foreground:e.theme.grid,background:e.theme.background};return e.label&&r>1&&ge(o,0,1,e.label,{foreground:e.theme.axis}),o}},xc=["\u2581","\u2582","\u2583","\u2584","\u2585","\u2586","\u2587","\u2588"],Ix={id:"sparkline",label:"Sparkline",accepts:"0dt",minimum:{width:2,height:1},weight:.7,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=vt(n.map(l=>l.value),r),a=Me(e.domain??He(i)),s=t[o-1];for(let l=0;l<r;l+=1){let d=ve(i[l]??0,a),c=Math.min(xc.length-1,Math.round(d*(xc.length-1)));s[l]={char:xc[c],foreground:xe(e.theme,d),background:e.theme.background}}return t}},kc=["\u2581","\u2582","\u2583","\u2584","\u2585","\u2586","\u2587","\u2588"],Ax={id:"area",label:"Area",accepts:"0dt",minimum:{width:4,height:2},weight:1.1,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=vt(n.map(s=>s.value),r),a=fn(i,e.domain);for(let s=0;s<r;s+=1){let l=ve(i[s]??0,a),d=xe(e.theme,l),c=zn(d,e.theme.background,.55),u=l*o,h=Math.min(o,Math.floor(u));for(let f=0;f<h;f+=1)t[o-1-f][s]={char:"\u2588",foreground:c,background:e.theme.background};if(h<o){let f=u-h,p=Math.max(0,Math.min(kc.length-1,Math.floor(f*kc.length)));t[o-1-h][s]={char:kc[p],foreground:d,background:e.theme.background}}}return t}},vp=["\u25A0","\u25CF","\u25B2","\u25C6","\u25BC","\u2605"],Ox="\u254B";function Lx(n){let e=n[0];if(e===void 0)return[];if(Array.isArray(e))return n.map(i=>[...i]);let t=n;if(typeof t[0].value=="number")return[t.map(i=>i.value)];let o=Math.max(...t.map(i=>i.value.length));return Array.from({length:o},(i,a)=>t.map(s=>s.value[a]??0))}var Px={id:"psychograph",label:"Psychograph",accepts:["0dt","1dt","2d"],minimum:{width:8,height:4},weight:1,perEntry:{rows:1},suits:n=>Ea(n.kind)===0||(n.extent?.[0]??1)<=8,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=Lx(n);if(i.length===0)return t;let a=Me(e.domain??He(i)),s=[e.theme.series,e.theme.seriesAlt,...e.theme.ramp],l=i.length===1,d=new Int8Array(r*o).fill(-1);for(let c=0;c<i.length;c+=1){let u=vt(i[c],r),h=l?"\u25A0":vp[c%vp.length],f=s[c%s.length];for(let p=0;p<r;p+=1){let m=ve(u[p]??0,a),g=Math.min(o-1,Math.max(0,Math.round((1-m)*(o-1)))),y=g*r+p,b=d[y];if(b>=0&&b!==c){t[g][p]={char:Ox,foreground:zn(s[b%s.length],f,.5),background:e.theme.background};continue}d[y]=c,t[g][p]={char:h,foreground:l?xe(e.theme,m):f,background:e.theme.background}}}return t}},Nx={id:"readout",label:"Readout",accepts:"0d",minimum:{width:1,height:1},weight:.2,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=Me(e.domain??{min:0,max:1}),a=ve(n,i),s=e.format?.(n)??`${Math.round(a*100)}%`,l=s.length>r?s.slice(s.length-r):s.padStart(r);return ge(t,0,0,l,{foreground:xe(e.theme,a),background:e.theme.background}),t}},Wx={id:"dial",label:"Dial",accepts:"0d",minimum:{width:9,height:5},weight:.65,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=ve(n,Me(e.domain??{min:0,max:1})),a={column:(r-1)/2,row:(o-1)/2},s={column:Math.max(2,(r-1)/2-1),row:Math.max(1,(o-1)/2)},l=.375,d=.75;wc(t,a,s,"\xB7",{from:l,to:l+d,foreground:e.theme.grid,background:e.theme.background}),i>0&&wc(t,a,s,"\u25CF",{from:l,to:l+d*i,styleAt:u=>({foreground:xe(e.theme,i*u),background:e.theme.background})});let c=e.format?.(n)??`${Math.round(i*100)}%`;return c.length<=r-2&&ge(t,Math.round(a.column-(c.length-1)/2),Math.round(a.row),c,{foreground:xe(e.theme,i),background:e.theme.background}),t}},xp=Object.freeze({0:["\u250F\u2501\u2513","\u2503 \u2503","\u2517\u2501\u251B"],1:[" \u2513 "," \u2503 "," \u2579 "],2:["\u250F\u2501\u2513","\u250F\u2501\u251B","\u2517\u2501\u2578"],3:["\u250F\u2501\u2513"," \u2501\u252B","\u2517\u2501\u251B"],4:["\u257B \u257B","\u2517\u2501\u252B","  \u2579"],5:["\u250F\u2501\u2578","\u2517\u2501\u2513","\u2517\u2501\u251B"],6:["\u250F\u2501\u2578","\u2523\u2501\u2513","\u2517\u2501\u251B"],7:["\u250F\u2501\u2513","  \u2503","  \u2579"],8:["\u250F\u2501\u2513","\u2523\u2501\u252B","\u2517\u2501\u251B"],9:["\u250F\u2501\u2513","\u2517\u2501\u252B","\u2517\u2501\u251B"],"%":["\u257B \u2571"," \u2571 ","\u2571 \u2579"],".":["   ","   "," \u257A "],"-":["   ","\u257A\u2501\u2578","   "],"\xB0":["\u250F\u2513 ","\u2517\u251B ","   "]," ":["   ","   ","   "]}),Vx={id:"odometer",label:"Odometer",accepts:"0d",minimum:{width:12,height:3},weight:.55,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=ve(n,Me(e.domain??{min:0,max:1})),s=[...e.format?.(n)??`${Math.round(i*100)}%`].map(h=>xp[h]??xp[" "]),l=s.reduce((h,f)=>h+f[0].length,0),d={foreground:xe(e.theme,i),background:e.theme.background},c=r-l,u=Math.max(0,Math.floor((o-3)/2));for(let h of s){for(let f=0;f<h.length;f+=1)ge(t,c,u+f,h[f],d);c+=h[0].length}return t}},Dx={id:"strip",label:"Strip",accepts:"0dt",minimum:{width:6,height:3},weight:.9,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0)return t;let i=vt(n.map(d=>d.value),r),a=Me(e.domain??He(i)),s=i.map((d,c)=>({column:c,row:Math.min(o-1,Math.max(0,Math.round((1-ve(d,a))*(o-1)))),value:d}));for(let d=1;d<s.length;d+=1){let c=s[d];ri(t,s[d-1],c,"\u2500",{foreground:xe(e.theme,ve(c.value,a)),background:e.theme.background})}let l=s.at(-1);return l&&gn(t,l.column,l.row,"\u25CF",{foreground:xe(e.theme,ve(l.value,a)),background:e.theme.background}),t}},kp=Object.freeze([Ex,Nx,Wx,Vx,Dx,Ix,Ax,Px]);var Va=3,Sc=2,Qr=8,Mc=["\u2581","\u2582","\u2583","\u2584","\u2585","\u2586","\u2587","\u2588"],eo=["\xB7","\u2591","\u2592","\u2593","\u2588"],zx={id:"bars",label:"Bars",accepts:"1d",minimum:{width:2,height:2},perEntry:{columns:1},weight:.8,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=fn([n],e.domain);for(let a=0;a<r;a+=1){let s=Math.min(n.length-1,Math.floor(a*n.length/r)),l=ve(n[s]??0,i),d=xe(e.theme,l),c=l*o,u=Math.floor(c);for(let h=0;h<o;h+=1){let f=o-1-h;if(f<u)t[h][a]={char:"\u2588",foreground:d,background:e.theme.background};else if(f===u){let p=c-u;if(p>0){let m=Math.min(Mc.length-1,Math.floor(p*Mc.length));t[h][a]={char:Mc[m],foreground:d,background:e.theme.background}}}}}return t}},$x={id:"rack",label:"Rack",accepts:"1d",minimum:{width:8,height:1},perEntry:{rows:1},weight:.6,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=fn([n],e.domain),a=Math.min(8,Math.max(0,r-6)),s=Math.max(1,r-a-5),l=Math.min(o,n.length);for(let d=0;d<l;d+=1){let c=ve(n[d]??0,i),u=xe(e.theme,c);if(a>0){let f=e.labels?.[d]??String(d);ge(t,0,d,f.padEnd(a).slice(0,a),{foreground:e.theme.axis,background:e.theme.background})}let h=Math.round(c*s);for(let f=0;f<s;f+=1)t[d][a+f]={char:f<h?"\u2588":"\xB7",foreground:f<h?u:e.theme.grid,background:e.theme.background};ge(t,a+s+1,d,String(Math.round(c*100)).padStart(3),{foreground:e.theme.foreground,background:e.theme.background})}return t}},Hx={id:"waterfall",label:"Waterfall",accepts:"1dt",minimum:{width:4,height:3},perEntry:{columns:1},minimumEntries:6,weight:1,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=Me(e.domain??He(n.map(s=>s.value))),a=n.slice(Math.max(0,n.length-o)).reverse();for(let s=0;s<Math.min(o,a.length);s+=1){let l=vt(a[s].value,r);for(let d=0;d<r;d+=1){let c=ve(l[d]??0,i),u=Math.min(eo.length-1,Math.round(c*(eo.length-1)));t[s][d]={char:eo[u],foreground:u===0?e.theme.grid:xe(e.theme,c),background:e.theme.background}}}return t}},Bx={id:"scope",label:"Scope",accepts:"1d",minimum:{width:8,height:3},minimumEntries:8,weight:.85,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=vt(n,r),a=Me(e.domain??He([n])),s;for(let l=0;l<r;l+=1){let d=ve(i[l]??0,a),c=Math.min(o-1,Math.max(0,Math.round((1-d)*(o-1)))),u=xe(e.theme,d);if(s!==void 0&&Math.abs(s-c)>1){let h=s<c?1:-1,f=zn(u,e.theme.background,.45);for(let p=s+h;p!==c;p+=h)t[p][l]={char:"\u2502",foreground:f,background:e.theme.background}}t[c][l]={char:"\u2500",foreground:u,background:e.theme.background},s=c}return t}},Fx={id:"hexgrid",label:"Honeycomb",accepts:"1d",minimum:{width:6,height:2},perEntry:{cells:Va*Sc},minimumEntries:4,weight:.75,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=fn([n],e.domain),a=Math.max(1,Math.floor((r-1)/Va));for(let s=0;s<n.length;s+=1){let l=Math.floor(s/a),d=l*Sc;if(d>=o)break;let c=s%a*Va+(l%2===0?0:1),u=ve(n[s]??0,i),h=eo[Math.min(eo.length-1,Math.round(u*(eo.length-1)))],f={foreground:xe(e.theme,u),background:e.theme.background};wp(t,{column:c,row:d,width:Va-1,height:Sc},h,f)}return t}},jx={id:"status-grid",label:"Status Grid",accepts:"1d",minimum:{width:8,height:1},perEntry:{cells:Qr},minimumEntries:3,weight:.7,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=fn([n],e.domain),a=Math.max(1,Math.floor(r/Qr));for(let s=0;s<n.length;s+=1){let l=Math.floor(s/a);if(l>=o)break;let d=s%a*Qr,c=ve(n[s]??0,i),u=xe(e.theme,c),h=(e.labels?.[s]??String(s)).slice(0,Qr-3);ge(t,d,l,"\u258C",{foreground:u,background:e.theme.background}),ge(t,d+1,l,h.padEnd(Qr-2).slice(0,Qr-2),{foreground:c>.66?u:e.theme.foreground,background:e.theme.background})}return t}},Sp=Object.freeze([zx,Bx,Fx,jx,$x,Hx]);var Tc=[" ","\u2591","\u2592","\u2593","\u2588"],Mp={id:"heatmap",label:"Heatmap",accepts:"2d",minimum:{width:2,height:2},render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=Me(e.domain??He([n]));for(let a=0;a<o;a+=1){let s=n[Math.min(n.length-1,Math.floor(a*n.length/o))];for(let l=0;l<r;l+=1){let d=s.length===0?0:Math.min(s.length-1,Math.floor(l*s.length/r)),c=ve(s[d]??0,i),u=Math.min(Tc.length-1,Math.round(c*(Tc.length-1)));t[a][l]={char:Tc[u],foreground:xe(e.theme,c),background:e.theme.background}}}return t}},Gx={id:"lattice",label:"Lattice (2D)",accepts:"1dt",minimum:{width:8,height:4},perEntry:{columns:1},minimumEntries:6,weight:.9,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=n.at(-1).value,a=Me(e.domain??He([i])),s=Math.floor(o/2);for(let l=0;l<r;l+=1)t[s][l]={char:"\u2500",foreground:e.theme.grid,background:e.theme.background};for(let l=0;l<r;l+=1){let d=i.length===0?0:Math.min(i.length-1,Math.floor(l*i.length/r)),c=ve(i[d]??0,a),u=Math.min(o-1,Math.max(0,Math.round((1-c)*(o-1))));t[u][l]={char:"\u2584",foreground:xe(e.theme,c),background:e.theme.background}}return t}},Ux={id:"volume-projection",label:"Volume (max projection)",accepts:"3d",minimum:{width:2,height:2},render(n,e){let t=[];for(let r of n)for(let o=0;o<r.length;o+=1){let i=t[o]??=[],a=r[o];for(let s=0;s<a.length;s+=1){let l=a[s]??0;(i[s]===void 0||l>i[s])&&(i[s]=l)}}return Mp.render(t,e)}},Kx={id:"overlay",label:"Overlay",accepts:["1dt","2d"],minimum:{width:8,height:4},perEntry:{rows:.25},suits:n=>(n.extent?.[0]??1)<=128,weight:1.05,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=qx(n);if(i.length===0)return t;let a=Me(e.domain??He(i)),s=Yx(e.theme,i.length),l=new hr(e.size),d=l.resolution.width,c=l.resolution.height;for(let u=0;u<i.length;u+=1){let h=vt(i[u],d),f=s[u],p=h.map((m,g)=>({column:g,row:Math.min(c-1,Math.max(0,Math.round((1-ve(m,a))*(c-1))))}));for(let m of gc(p))l.plot(m.column,m.row,f)}return l.paint(t,{column:0,row:0},{background:e.theme.background}),t}};function qx(n){let e=n[0];if(e===void 0)return[];if(Array.isArray(e))return n.map(o=>[...o]);let t=n,r=Math.max(...t.map(o=>o.value.length));return Array.from({length:r},(o,i)=>t.map(a=>a.value[i]??0))}function Yx(n,e){let t=[n.series,n.seriesAlt,...n.ramp];if(e<=t.length)return t.slice(0,e);let r=[...t];for(let o=t.length;o<e;o+=1)r.push(Xx(o*.618033988749895%1,.62,.68));return r}function Xx(n,e,t){let r=(1-Math.abs(2*t-1))*e,o=n*6,i=r*(1-Math.abs(o%2-1)),[a,s,l]=o<1?[r,i,0]:o<2?[i,r,0]:o<3?[0,r,i]:o<4?[0,i,r]:o<5?[i,0,r]:[r,0,i],d=t-r/2;return[Math.round((a+d)*255),Math.round((s+d)*255),Math.round((l+d)*255)]}var Jx={id:"scatter",label:"Scatter",accepts:"2d",minimum:{width:8,height:4},weight:.9,suits:n=>{let e=n.extent?.[1];return e===void 0||e===2||e===3},render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=new hr(e.size),a=n.map(f=>f[0]??0),s=n.map(f=>f[1]??0),l=Me(He([a])),d=Me(He([s])),c=n.map(f=>f[2]),h=c.some(f=>f!==void 0)?Me(e.domain??He([c.map(f=>f??0)])):void 0;for(let f=0;f<n.length;f+=1){let p=ve(a[f]??0,l),m=ve(s[f]??0,d),g=h?ve(c[f]??0,h):m;i.plot(Math.round(p*(i.resolution.width-1)),Math.round((1-m)*(i.resolution.height-1)),xe(e.theme,g))}return i.paint(t,{column:0,row:0},{background:e.theme.background}),t}},Tp=Object.freeze([Mp,Kx,Jx,Gx,Ux]);function oi(n,e={}){let t=(e.yaw??.12)*Math.PI*2,r=(e.pitch??.09)*Math.PI*2,o=e.distance??3.2,i=e.focal??1.6,a=e.cellAspect??2,s=(n.width-1)/2,l=(n.height-1)/2,d=n.width/2,c=n.height/2*a,u=Math.cos(t),h=Math.sin(t),f=Math.cos(r),p=Math.sin(r);return{project(m){let g=m.x*u-m.z*h,y=m.x*h+m.z*u,b=m.y*f+y*p,w=o+(y*f-m.y*p);if(w<=.05)return{column:0,row:0,depth:w,visible:!1};let x=i/w;return{column:s+g*x*d,row:l-b*x*c/a,depth:w,visible:!0}}}}function bn(n,e){let t=e.max-e.min;return t===0?0:(n-e.min)/t*2-1}function Rp(n,e,t){return t<=e?0:Math.min(1,Math.max(0,(n-e)/(t-e)))}var to=3.2;function Da(n,e,t){return zn(n,e,Rp(t,to-1.2,to+1.4)*.65)}var Zx={id:"surface",label:"Surface",accepts:"2d",minimum:{width:16,height:8},weight:.95,suits:n=>(n.extent?.[1]??0)!==2,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=Me(e.domain??He(n)),a=oi(e.size,{yaw:.06,pitch:.145,distance:to}),s=n.length,l=Math.min(Math.max(...n.map(h=>h.length)),Math.max(2,r));if(l===0)return t;let d=n.map((h,f)=>{let p=vt(h,l);return Array.from({length:l},(m,g)=>{let y=ve(p[g]??0,i),b={x:bn(g,{min:0,max:Math.max(1,l-1)}),y:-.55+y*1.1,z:bn(f,{min:0,max:Math.max(1,s-1)})};return{...a.project(b),heat:y}})}),c=new Array(r).fill(Number.POSITIVE_INFINITY),u=Array.from({length:s},(h,f)=>f).sort((h,f)=>(d[h][0]?.depth??0)-(d[f][0]?.depth??0));for(let h of u){let f=d[h];for(let p=0;p+1<l;p+=1){let m=f[p],g=f[p+1];if(!m.visible||!g.visible)continue;let b={foreground:Da(xe(e.theme,m.heat),e.theme.background,m.depth),background:e.theme.background},w=yc(m,g),x=Math.max(Math.abs(g.column-m.column),Math.abs(g.row-m.row),1);for(let k=0;k<=x;k+=1){let C=k/x,T=Math.round(m.column+(g.column-m.column)*C),S=Math.round(m.row+(g.row-m.row)*C);T<0||T>=r||S>=c[T]||(c[T]=S,gn(t,T,S,w,b))}}}return t}},Qx={id:"point-cloud",label:"Point Cloud",accepts:"3d",minimum:{width:12,height:6},weight:.9,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=fn(n,e.domain),a=oi(e.size,{yaw:.09,pitch:.1,distance:to}),s=n.length,l=new hr(e.size),d=[];for(let h=0;h<s;h+=1){let f=n[h]??[];for(let p=0;p<f.length;p+=1){let m=f[p]??[];for(let g=0;g<m.length;g+=1){let y=m[g]??0;if(y<=0)continue;let b=ve(y,i);d.push({at:a.project({x:bn(g,{min:0,max:Math.max(1,m.length-1)}),y:bn(p,{min:0,max:Math.max(1,f.length-1)}),z:bn(h,{min:0,max:Math.max(1,s-1)})}),heat:b})}}}d.sort((h,f)=>f.at.depth-h.at.depth);let c=l.resolution.width/r,u=l.resolution.height/o;for(let h of d)h.at.visible&&l.plot(Math.round(h.at.column*c),Math.round(h.at.row*u),Da(xe(e.theme,h.heat),e.theme.background,h.at.depth));return l.paint(t,{column:0,row:0},{background:e.theme.background}),t}},ek={id:"ring-volume",label:"Ring Volume",accepts:"2d",minimum:{width:14,height:7},weight:.85,suits:n=>(n.extent?.[1]??0)!==2,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=Me(e.domain??He(n)),a=oi(e.size,{yaw:.02,pitch:.2,distance:to+.4}),s=n.length,l=[];for(let d=0;d<s;d+=1){let c=n[d]??[],u=bn(d,{min:0,max:Math.max(1,s-1)}),h,f;for(let p=0;p<=c.length;p+=1){let m=p%Math.max(1,c.length),g=ve(c[m]??0,i),y=m/Math.max(1,c.length)*Math.PI*2,b=.58+g*.34,w=a.project({x:Math.cos(y)*b,y:u*.9,z:Math.sin(y)*b});p===0&&(f=w),l.push({at:w,heat:g,...h?{previous:h}:{}}),h=w}f&&h&&l.push({at:f,heat:0,previous:h})}l.sort((d,c)=>c.at.depth-d.at.depth);for(let d of l){if(!d.at.visible)continue;let c={foreground:Da(xe(e.theme,d.heat),e.theme.background,d.at.depth),background:e.theme.background};d.previous?.visible&&ri(t,d.previous,d.at,Wa,c)}return t}},tk={id:"vector-field",label:"Vector Field",accepts:"3d",minimum:{width:14,height:7},weight:.9,suits:n=>n.extent?.[2]===3,render(n,e){let t=ke(e.size,{char:" ",background:e.theme.background}),{width:r,height:o}=e.size;if(r<=0||o<=0||n.length===0)return t;let i=oi(e.size,{yaw:.1,pitch:.1,distance:to}),a=Math.min(n.length,Math.max(2,Math.floor(o/2))),s=n.flatMap(c=>c.map(u=>Math.hypot(u[0]??0,u[1]??0,u[2]??0))),l=Me(e.domain??He([s])),d=[];for(let c=0;c<a;c+=1){let u=n[Math.round(c*(n.length-1)/Math.max(1,a-1))]??[],h=Math.min(u.length,Math.max(2,Math.floor(r/6)));for(let f=0;f<h;f+=1){let p=Math.round(f*(u.length-1)/Math.max(1,h-1)),m=u[p]??[],g=Math.hypot(m[0]??0,m[1]??0,m[2]??0),y=ve(g,l),b={x:bn(f,{min:0,max:Math.max(1,h-1)}),y:0,z:bn(c,{min:0,max:Math.max(1,a-1)})},w=.22*(g===0?0:y/Math.max(g,1e-6));d.push({from:i.project(b),to:i.project({x:b.x+(m[0]??0)*w,y:b.y+(m[1]??0)*w,z:b.z+(m[2]??0)*w}),heat:y})}}d.sort((c,u)=>u.from.depth-c.from.depth);for(let c of d){if(!c.from.visible||!c.to.visible)continue;let u={foreground:Da(xe(e.theme,c.heat),e.theme.background,c.from.depth),background:e.theme.background};ri(t,c.from,c.to,Wa,u),gn(t,c.to.column,c.to.row,"\u25C6",u)}return t}},_p=Object.freeze([Zx,ek,Qx,tk]);var za=Object.freeze([...kp,...Sp,...Tp,..._p]);function Rc(n,e,t){let r=Qm(e.kind,n.accepts);if(r===void 0)throw new TypeError(`${n.id} draws ${typeof n.accepts=="string"?n.accepts:n.accepts.join(" or ")}, and was given a ${e.kind} stream`);let o=t.domain??e.domain,i=o?{...t,domain:o}:t;if(Ia(r))return n.render(e.history(),i);let a=e.latest();return a===void 0?n.render([],i):n.render(a,i)}var Cp=JSON.parse(String.raw`{
  "schema": "deno-tui.unicode-data-pack",
  "schemaVersion": 1,
  "unicodeVersion": "17.0.0",
  "fingerprint": "4c885bc9201552e99c0797a4b8ea72db55fc2c315af3347ad53a9743c65bbfc2",
  "sources": [
    {
      "name": "east-asian-width",
      "url": "https://www.unicode.org/Public/17.0.0/ucd/EastAsianWidth.txt",
      "sha256": "ea7ce50f3444a050333448dffef1cadd9325af55cbb764b4a2280faf52170a33"
    },
    {
      "name": "emoji-properties",
      "url": "https://www.unicode.org/Public/17.0.0/ucd/emoji/emoji-data.txt",
      "sha256": "2cb2bb9455cda83e8481541ecf5b6dfda66a3bb89efa3fa7c5297eccf607b72b"
    },
    {
      "name": "grapheme-break",
      "url": "https://www.unicode.org/Public/17.0.0/ucd/auxiliary/GraphemeBreakProperty.txt",
      "sha256": "d6b51d1d2ae5c33b451b7ed994b48f1f4dc62b2272a5831e7fd418514a6bae89"
    }
  ],
  "tables": {
    "graphemeBreak": [
      {
        "start": 0,
        "end": 9,
        "value": "Control"
      },
      {
        "start": 10,
        "end": 10,
        "value": "LF"
      },
      {
        "start": 11,
        "end": 12,
        "value": "Control"
      },
      {
        "start": 13,
        "end": 13,
        "value": "CR"
      },
      {
        "start": 14,
        "end": 31,
        "value": "Control"
      },
      {
        "start": 127,
        "end": 159,
        "value": "Control"
      },
      {
        "start": 173,
        "end": 173,
        "value": "Control"
      },
      {
        "start": 768,
        "end": 879,
        "value": "Extend"
      },
      {
        "start": 1155,
        "end": 1161,
        "value": "Extend"
      },
      {
        "start": 1425,
        "end": 1469,
        "value": "Extend"
      },
      {
        "start": 1471,
        "end": 1471,
        "value": "Extend"
      },
      {
        "start": 1473,
        "end": 1474,
        "value": "Extend"
      },
      {
        "start": 1476,
        "end": 1477,
        "value": "Extend"
      },
      {
        "start": 1479,
        "end": 1479,
        "value": "Extend"
      },
      {
        "start": 1536,
        "end": 1541,
        "value": "Prepend"
      },
      {
        "start": 1552,
        "end": 1562,
        "value": "Extend"
      },
      {
        "start": 1564,
        "end": 1564,
        "value": "Control"
      },
      {
        "start": 1611,
        "end": 1631,
        "value": "Extend"
      },
      {
        "start": 1648,
        "end": 1648,
        "value": "Extend"
      },
      {
        "start": 1750,
        "end": 1756,
        "value": "Extend"
      },
      {
        "start": 1757,
        "end": 1757,
        "value": "Prepend"
      },
      {
        "start": 1759,
        "end": 1764,
        "value": "Extend"
      },
      {
        "start": 1767,
        "end": 1768,
        "value": "Extend"
      },
      {
        "start": 1770,
        "end": 1773,
        "value": "Extend"
      },
      {
        "start": 1807,
        "end": 1807,
        "value": "Prepend"
      },
      {
        "start": 1809,
        "end": 1809,
        "value": "Extend"
      },
      {
        "start": 1840,
        "end": 1866,
        "value": "Extend"
      },
      {
        "start": 1958,
        "end": 1968,
        "value": "Extend"
      },
      {
        "start": 2027,
        "end": 2035,
        "value": "Extend"
      },
      {
        "start": 2045,
        "end": 2045,
        "value": "Extend"
      },
      {
        "start": 2070,
        "end": 2073,
        "value": "Extend"
      },
      {
        "start": 2075,
        "end": 2083,
        "value": "Extend"
      },
      {
        "start": 2085,
        "end": 2087,
        "value": "Extend"
      },
      {
        "start": 2089,
        "end": 2093,
        "value": "Extend"
      },
      {
        "start": 2137,
        "end": 2139,
        "value": "Extend"
      },
      {
        "start": 2192,
        "end": 2193,
        "value": "Prepend"
      },
      {
        "start": 2199,
        "end": 2207,
        "value": "Extend"
      },
      {
        "start": 2250,
        "end": 2273,
        "value": "Extend"
      },
      {
        "start": 2274,
        "end": 2274,
        "value": "Prepend"
      },
      {
        "start": 2275,
        "end": 2306,
        "value": "Extend"
      },
      {
        "start": 2307,
        "end": 2307,
        "value": "SpacingMark"
      },
      {
        "start": 2362,
        "end": 2362,
        "value": "Extend"
      },
      {
        "start": 2363,
        "end": 2363,
        "value": "SpacingMark"
      },
      {
        "start": 2364,
        "end": 2364,
        "value": "Extend"
      },
      {
        "start": 2366,
        "end": 2368,
        "value": "SpacingMark"
      },
      {
        "start": 2369,
        "end": 2376,
        "value": "Extend"
      },
      {
        "start": 2377,
        "end": 2380,
        "value": "SpacingMark"
      },
      {
        "start": 2381,
        "end": 2381,
        "value": "Extend"
      },
      {
        "start": 2382,
        "end": 2383,
        "value": "SpacingMark"
      },
      {
        "start": 2385,
        "end": 2391,
        "value": "Extend"
      },
      {
        "start": 2402,
        "end": 2403,
        "value": "Extend"
      },
      {
        "start": 2433,
        "end": 2433,
        "value": "Extend"
      },
      {
        "start": 2434,
        "end": 2435,
        "value": "SpacingMark"
      },
      {
        "start": 2492,
        "end": 2492,
        "value": "Extend"
      },
      {
        "start": 2494,
        "end": 2494,
        "value": "Extend"
      },
      {
        "start": 2495,
        "end": 2496,
        "value": "SpacingMark"
      },
      {
        "start": 2497,
        "end": 2500,
        "value": "Extend"
      },
      {
        "start": 2503,
        "end": 2504,
        "value": "SpacingMark"
      },
      {
        "start": 2507,
        "end": 2508,
        "value": "SpacingMark"
      },
      {
        "start": 2509,
        "end": 2509,
        "value": "Extend"
      },
      {
        "start": 2519,
        "end": 2519,
        "value": "Extend"
      },
      {
        "start": 2530,
        "end": 2531,
        "value": "Extend"
      },
      {
        "start": 2558,
        "end": 2558,
        "value": "Extend"
      },
      {
        "start": 2561,
        "end": 2562,
        "value": "Extend"
      },
      {
        "start": 2563,
        "end": 2563,
        "value": "SpacingMark"
      },
      {
        "start": 2620,
        "end": 2620,
        "value": "Extend"
      },
      {
        "start": 2622,
        "end": 2624,
        "value": "SpacingMark"
      },
      {
        "start": 2625,
        "end": 2626,
        "value": "Extend"
      },
      {
        "start": 2631,
        "end": 2632,
        "value": "Extend"
      },
      {
        "start": 2635,
        "end": 2637,
        "value": "Extend"
      },
      {
        "start": 2641,
        "end": 2641,
        "value": "Extend"
      },
      {
        "start": 2672,
        "end": 2673,
        "value": "Extend"
      },
      {
        "start": 2677,
        "end": 2677,
        "value": "Extend"
      },
      {
        "start": 2689,
        "end": 2690,
        "value": "Extend"
      },
      {
        "start": 2691,
        "end": 2691,
        "value": "SpacingMark"
      },
      {
        "start": 2748,
        "end": 2748,
        "value": "Extend"
      },
      {
        "start": 2750,
        "end": 2752,
        "value": "SpacingMark"
      },
      {
        "start": 2753,
        "end": 2757,
        "value": "Extend"
      },
      {
        "start": 2759,
        "end": 2760,
        "value": "Extend"
      },
      {
        "start": 2761,
        "end": 2761,
        "value": "SpacingMark"
      },
      {
        "start": 2763,
        "end": 2764,
        "value": "SpacingMark"
      },
      {
        "start": 2765,
        "end": 2765,
        "value": "Extend"
      },
      {
        "start": 2786,
        "end": 2787,
        "value": "Extend"
      },
      {
        "start": 2810,
        "end": 2815,
        "value": "Extend"
      },
      {
        "start": 2817,
        "end": 2817,
        "value": "Extend"
      },
      {
        "start": 2818,
        "end": 2819,
        "value": "SpacingMark"
      },
      {
        "start": 2876,
        "end": 2876,
        "value": "Extend"
      },
      {
        "start": 2878,
        "end": 2879,
        "value": "Extend"
      },
      {
        "start": 2880,
        "end": 2880,
        "value": "SpacingMark"
      },
      {
        "start": 2881,
        "end": 2884,
        "value": "Extend"
      },
      {
        "start": 2887,
        "end": 2888,
        "value": "SpacingMark"
      },
      {
        "start": 2891,
        "end": 2892,
        "value": "SpacingMark"
      },
      {
        "start": 2893,
        "end": 2893,
        "value": "Extend"
      },
      {
        "start": 2901,
        "end": 2903,
        "value": "Extend"
      },
      {
        "start": 2914,
        "end": 2915,
        "value": "Extend"
      },
      {
        "start": 2946,
        "end": 2946,
        "value": "Extend"
      },
      {
        "start": 3006,
        "end": 3006,
        "value": "Extend"
      },
      {
        "start": 3007,
        "end": 3007,
        "value": "SpacingMark"
      },
      {
        "start": 3008,
        "end": 3008,
        "value": "Extend"
      },
      {
        "start": 3009,
        "end": 3010,
        "value": "SpacingMark"
      },
      {
        "start": 3014,
        "end": 3016,
        "value": "SpacingMark"
      },
      {
        "start": 3018,
        "end": 3020,
        "value": "SpacingMark"
      },
      {
        "start": 3021,
        "end": 3021,
        "value": "Extend"
      },
      {
        "start": 3031,
        "end": 3031,
        "value": "Extend"
      },
      {
        "start": 3072,
        "end": 3072,
        "value": "Extend"
      },
      {
        "start": 3073,
        "end": 3075,
        "value": "SpacingMark"
      },
      {
        "start": 3076,
        "end": 3076,
        "value": "Extend"
      },
      {
        "start": 3132,
        "end": 3132,
        "value": "Extend"
      },
      {
        "start": 3134,
        "end": 3136,
        "value": "Extend"
      },
      {
        "start": 3137,
        "end": 3140,
        "value": "SpacingMark"
      },
      {
        "start": 3142,
        "end": 3144,
        "value": "Extend"
      },
      {
        "start": 3146,
        "end": 3149,
        "value": "Extend"
      },
      {
        "start": 3157,
        "end": 3158,
        "value": "Extend"
      },
      {
        "start": 3170,
        "end": 3171,
        "value": "Extend"
      },
      {
        "start": 3201,
        "end": 3201,
        "value": "Extend"
      },
      {
        "start": 3202,
        "end": 3203,
        "value": "SpacingMark"
      },
      {
        "start": 3260,
        "end": 3260,
        "value": "Extend"
      },
      {
        "start": 3262,
        "end": 3262,
        "value": "SpacingMark"
      },
      {
        "start": 3263,
        "end": 3264,
        "value": "Extend"
      },
      {
        "start": 3265,
        "end": 3265,
        "value": "SpacingMark"
      },
      {
        "start": 3266,
        "end": 3266,
        "value": "Extend"
      },
      {
        "start": 3267,
        "end": 3268,
        "value": "SpacingMark"
      },
      {
        "start": 3270,
        "end": 3272,
        "value": "Extend"
      },
      {
        "start": 3274,
        "end": 3277,
        "value": "Extend"
      },
      {
        "start": 3285,
        "end": 3286,
        "value": "Extend"
      },
      {
        "start": 3298,
        "end": 3299,
        "value": "Extend"
      },
      {
        "start": 3315,
        "end": 3315,
        "value": "SpacingMark"
      },
      {
        "start": 3328,
        "end": 3329,
        "value": "Extend"
      },
      {
        "start": 3330,
        "end": 3331,
        "value": "SpacingMark"
      },
      {
        "start": 3387,
        "end": 3388,
        "value": "Extend"
      },
      {
        "start": 3390,
        "end": 3390,
        "value": "Extend"
      },
      {
        "start": 3391,
        "end": 3392,
        "value": "SpacingMark"
      },
      {
        "start": 3393,
        "end": 3396,
        "value": "Extend"
      },
      {
        "start": 3398,
        "end": 3400,
        "value": "SpacingMark"
      },
      {
        "start": 3402,
        "end": 3404,
        "value": "SpacingMark"
      },
      {
        "start": 3405,
        "end": 3405,
        "value": "Extend"
      },
      {
        "start": 3406,
        "end": 3406,
        "value": "Prepend"
      },
      {
        "start": 3415,
        "end": 3415,
        "value": "Extend"
      },
      {
        "start": 3426,
        "end": 3427,
        "value": "Extend"
      },
      {
        "start": 3457,
        "end": 3457,
        "value": "Extend"
      },
      {
        "start": 3458,
        "end": 3459,
        "value": "SpacingMark"
      },
      {
        "start": 3530,
        "end": 3530,
        "value": "Extend"
      },
      {
        "start": 3535,
        "end": 3535,
        "value": "Extend"
      },
      {
        "start": 3536,
        "end": 3537,
        "value": "SpacingMark"
      },
      {
        "start": 3538,
        "end": 3540,
        "value": "Extend"
      },
      {
        "start": 3542,
        "end": 3542,
        "value": "Extend"
      },
      {
        "start": 3544,
        "end": 3550,
        "value": "SpacingMark"
      },
      {
        "start": 3551,
        "end": 3551,
        "value": "Extend"
      },
      {
        "start": 3570,
        "end": 3571,
        "value": "SpacingMark"
      },
      {
        "start": 3633,
        "end": 3633,
        "value": "Extend"
      },
      {
        "start": 3635,
        "end": 3635,
        "value": "SpacingMark"
      },
      {
        "start": 3636,
        "end": 3642,
        "value": "Extend"
      },
      {
        "start": 3655,
        "end": 3662,
        "value": "Extend"
      },
      {
        "start": 3761,
        "end": 3761,
        "value": "Extend"
      },
      {
        "start": 3763,
        "end": 3763,
        "value": "SpacingMark"
      },
      {
        "start": 3764,
        "end": 3772,
        "value": "Extend"
      },
      {
        "start": 3784,
        "end": 3790,
        "value": "Extend"
      },
      {
        "start": 3864,
        "end": 3865,
        "value": "Extend"
      },
      {
        "start": 3893,
        "end": 3893,
        "value": "Extend"
      },
      {
        "start": 3895,
        "end": 3895,
        "value": "Extend"
      },
      {
        "start": 3897,
        "end": 3897,
        "value": "Extend"
      },
      {
        "start": 3902,
        "end": 3903,
        "value": "SpacingMark"
      },
      {
        "start": 3953,
        "end": 3966,
        "value": "Extend"
      },
      {
        "start": 3967,
        "end": 3967,
        "value": "SpacingMark"
      },
      {
        "start": 3968,
        "end": 3972,
        "value": "Extend"
      },
      {
        "start": 3974,
        "end": 3975,
        "value": "Extend"
      },
      {
        "start": 3981,
        "end": 3991,
        "value": "Extend"
      },
      {
        "start": 3993,
        "end": 4028,
        "value": "Extend"
      },
      {
        "start": 4038,
        "end": 4038,
        "value": "Extend"
      },
      {
        "start": 4141,
        "end": 4144,
        "value": "Extend"
      },
      {
        "start": 4145,
        "end": 4145,
        "value": "SpacingMark"
      },
      {
        "start": 4146,
        "end": 4151,
        "value": "Extend"
      },
      {
        "start": 4153,
        "end": 4154,
        "value": "Extend"
      },
      {
        "start": 4155,
        "end": 4156,
        "value": "SpacingMark"
      },
      {
        "start": 4157,
        "end": 4158,
        "value": "Extend"
      },
      {
        "start": 4182,
        "end": 4183,
        "value": "SpacingMark"
      },
      {
        "start": 4184,
        "end": 4185,
        "value": "Extend"
      },
      {
        "start": 4190,
        "end": 4192,
        "value": "Extend"
      },
      {
        "start": 4209,
        "end": 4212,
        "value": "Extend"
      },
      {
        "start": 4226,
        "end": 4226,
        "value": "Extend"
      },
      {
        "start": 4228,
        "end": 4228,
        "value": "SpacingMark"
      },
      {
        "start": 4229,
        "end": 4230,
        "value": "Extend"
      },
      {
        "start": 4237,
        "end": 4237,
        "value": "Extend"
      },
      {
        "start": 4253,
        "end": 4253,
        "value": "Extend"
      },
      {
        "start": 4352,
        "end": 4447,
        "value": "L"
      },
      {
        "start": 4448,
        "end": 4519,
        "value": "V"
      },
      {
        "start": 4520,
        "end": 4607,
        "value": "T"
      },
      {
        "start": 4957,
        "end": 4959,
        "value": "Extend"
      },
      {
        "start": 5906,
        "end": 5909,
        "value": "Extend"
      },
      {
        "start": 5938,
        "end": 5940,
        "value": "Extend"
      },
      {
        "start": 5970,
        "end": 5971,
        "value": "Extend"
      },
      {
        "start": 6002,
        "end": 6003,
        "value": "Extend"
      },
      {
        "start": 6068,
        "end": 6069,
        "value": "Extend"
      },
      {
        "start": 6070,
        "end": 6070,
        "value": "SpacingMark"
      },
      {
        "start": 6071,
        "end": 6077,
        "value": "Extend"
      },
      {
        "start": 6078,
        "end": 6085,
        "value": "SpacingMark"
      },
      {
        "start": 6086,
        "end": 6086,
        "value": "Extend"
      },
      {
        "start": 6087,
        "end": 6088,
        "value": "SpacingMark"
      },
      {
        "start": 6089,
        "end": 6099,
        "value": "Extend"
      },
      {
        "start": 6109,
        "end": 6109,
        "value": "Extend"
      },
      {
        "start": 6155,
        "end": 6157,
        "value": "Extend"
      },
      {
        "start": 6158,
        "end": 6158,
        "value": "Control"
      },
      {
        "start": 6159,
        "end": 6159,
        "value": "Extend"
      },
      {
        "start": 6277,
        "end": 6278,
        "value": "Extend"
      },
      {
        "start": 6313,
        "end": 6313,
        "value": "Extend"
      },
      {
        "start": 6432,
        "end": 6434,
        "value": "Extend"
      },
      {
        "start": 6435,
        "end": 6438,
        "value": "SpacingMark"
      },
      {
        "start": 6439,
        "end": 6440,
        "value": "Extend"
      },
      {
        "start": 6441,
        "end": 6443,
        "value": "SpacingMark"
      },
      {
        "start": 6448,
        "end": 6449,
        "value": "SpacingMark"
      },
      {
        "start": 6450,
        "end": 6450,
        "value": "Extend"
      },
      {
        "start": 6451,
        "end": 6456,
        "value": "SpacingMark"
      },
      {
        "start": 6457,
        "end": 6459,
        "value": "Extend"
      },
      {
        "start": 6679,
        "end": 6680,
        "value": "Extend"
      },
      {
        "start": 6681,
        "end": 6682,
        "value": "SpacingMark"
      },
      {
        "start": 6683,
        "end": 6683,
        "value": "Extend"
      },
      {
        "start": 6741,
        "end": 6741,
        "value": "SpacingMark"
      },
      {
        "start": 6742,
        "end": 6742,
        "value": "Extend"
      },
      {
        "start": 6743,
        "end": 6743,
        "value": "SpacingMark"
      },
      {
        "start": 6744,
        "end": 6750,
        "value": "Extend"
      },
      {
        "start": 6752,
        "end": 6752,
        "value": "Extend"
      },
      {
        "start": 6754,
        "end": 6754,
        "value": "Extend"
      },
      {
        "start": 6757,
        "end": 6764,
        "value": "Extend"
      },
      {
        "start": 6765,
        "end": 6770,
        "value": "SpacingMark"
      },
      {
        "start": 6771,
        "end": 6780,
        "value": "Extend"
      },
      {
        "start": 6783,
        "end": 6783,
        "value": "Extend"
      },
      {
        "start": 6832,
        "end": 6877,
        "value": "Extend"
      },
      {
        "start": 6880,
        "end": 6891,
        "value": "Extend"
      },
      {
        "start": 6912,
        "end": 6915,
        "value": "Extend"
      },
      {
        "start": 6916,
        "end": 6916,
        "value": "SpacingMark"
      },
      {
        "start": 6964,
        "end": 6973,
        "value": "Extend"
      },
      {
        "start": 6974,
        "end": 6977,
        "value": "SpacingMark"
      },
      {
        "start": 6978,
        "end": 6980,
        "value": "Extend"
      },
      {
        "start": 7019,
        "end": 7027,
        "value": "Extend"
      },
      {
        "start": 7040,
        "end": 7041,
        "value": "Extend"
      },
      {
        "start": 7042,
        "end": 7042,
        "value": "SpacingMark"
      },
      {
        "start": 7073,
        "end": 7073,
        "value": "SpacingMark"
      },
      {
        "start": 7074,
        "end": 7077,
        "value": "Extend"
      },
      {
        "start": 7078,
        "end": 7079,
        "value": "SpacingMark"
      },
      {
        "start": 7080,
        "end": 7085,
        "value": "Extend"
      },
      {
        "start": 7142,
        "end": 7142,
        "value": "Extend"
      },
      {
        "start": 7143,
        "end": 7143,
        "value": "SpacingMark"
      },
      {
        "start": 7144,
        "end": 7145,
        "value": "Extend"
      },
      {
        "start": 7146,
        "end": 7148,
        "value": "SpacingMark"
      },
      {
        "start": 7149,
        "end": 7149,
        "value": "Extend"
      },
      {
        "start": 7150,
        "end": 7150,
        "value": "SpacingMark"
      },
      {
        "start": 7151,
        "end": 7155,
        "value": "Extend"
      },
      {
        "start": 7204,
        "end": 7211,
        "value": "SpacingMark"
      },
      {
        "start": 7212,
        "end": 7219,
        "value": "Extend"
      },
      {
        "start": 7220,
        "end": 7221,
        "value": "SpacingMark"
      },
      {
        "start": 7222,
        "end": 7223,
        "value": "Extend"
      },
      {
        "start": 7376,
        "end": 7378,
        "value": "Extend"
      },
      {
        "start": 7380,
        "end": 7392,
        "value": "Extend"
      },
      {
        "start": 7393,
        "end": 7393,
        "value": "SpacingMark"
      },
      {
        "start": 7394,
        "end": 7400,
        "value": "Extend"
      },
      {
        "start": 7405,
        "end": 7405,
        "value": "Extend"
      },
      {
        "start": 7412,
        "end": 7412,
        "value": "Extend"
      },
      {
        "start": 7415,
        "end": 7415,
        "value": "SpacingMark"
      },
      {
        "start": 7416,
        "end": 7417,
        "value": "Extend"
      },
      {
        "start": 7616,
        "end": 7679,
        "value": "Extend"
      },
      {
        "start": 8203,
        "end": 8203,
        "value": "Control"
      },
      {
        "start": 8204,
        "end": 8204,
        "value": "Extend"
      },
      {
        "start": 8205,
        "end": 8205,
        "value": "ZWJ"
      },
      {
        "start": 8206,
        "end": 8207,
        "value": "Control"
      },
      {
        "start": 8232,
        "end": 8238,
        "value": "Control"
      },
      {
        "start": 8288,
        "end": 8303,
        "value": "Control"
      },
      {
        "start": 8400,
        "end": 8432,
        "value": "Extend"
      },
      {
        "start": 11503,
        "end": 11505,
        "value": "Extend"
      },
      {
        "start": 11647,
        "end": 11647,
        "value": "Extend"
      },
      {
        "start": 11744,
        "end": 11775,
        "value": "Extend"
      },
      {
        "start": 12330,
        "end": 12335,
        "value": "Extend"
      },
      {
        "start": 12441,
        "end": 12442,
        "value": "Extend"
      },
      {
        "start": 42607,
        "end": 42610,
        "value": "Extend"
      },
      {
        "start": 42612,
        "end": 42621,
        "value": "Extend"
      },
      {
        "start": 42654,
        "end": 42655,
        "value": "Extend"
      },
      {
        "start": 42736,
        "end": 42737,
        "value": "Extend"
      },
      {
        "start": 43010,
        "end": 43010,
        "value": "Extend"
      },
      {
        "start": 43014,
        "end": 43014,
        "value": "Extend"
      },
      {
        "start": 43019,
        "end": 43019,
        "value": "Extend"
      },
      {
        "start": 43043,
        "end": 43044,
        "value": "SpacingMark"
      },
      {
        "start": 43045,
        "end": 43046,
        "value": "Extend"
      },
      {
        "start": 43047,
        "end": 43047,
        "value": "SpacingMark"
      },
      {
        "start": 43052,
        "end": 43052,
        "value": "Extend"
      },
      {
        "start": 43136,
        "end": 43137,
        "value": "SpacingMark"
      },
      {
        "start": 43188,
        "end": 43203,
        "value": "SpacingMark"
      },
      {
        "start": 43204,
        "end": 43205,
        "value": "Extend"
      },
      {
        "start": 43232,
        "end": 43249,
        "value": "Extend"
      },
      {
        "start": 43263,
        "end": 43263,
        "value": "Extend"
      },
      {
        "start": 43302,
        "end": 43309,
        "value": "Extend"
      },
      {
        "start": 43335,
        "end": 43345,
        "value": "Extend"
      },
      {
        "start": 43346,
        "end": 43346,
        "value": "SpacingMark"
      },
      {
        "start": 43347,
        "end": 43347,
        "value": "Extend"
      },
      {
        "start": 43360,
        "end": 43388,
        "value": "L"
      },
      {
        "start": 43392,
        "end": 43394,
        "value": "Extend"
      },
      {
        "start": 43395,
        "end": 43395,
        "value": "SpacingMark"
      },
      {
        "start": 43443,
        "end": 43443,
        "value": "Extend"
      },
      {
        "start": 43444,
        "end": 43445,
        "value": "SpacingMark"
      },
      {
        "start": 43446,
        "end": 43449,
        "value": "Extend"
      },
      {
        "start": 43450,
        "end": 43451,
        "value": "SpacingMark"
      },
      {
        "start": 43452,
        "end": 43453,
        "value": "Extend"
      },
      {
        "start": 43454,
        "end": 43455,
        "value": "SpacingMark"
      },
      {
        "start": 43456,
        "end": 43456,
        "value": "Extend"
      },
      {
        "start": 43493,
        "end": 43493,
        "value": "Extend"
      },
      {
        "start": 43561,
        "end": 43566,
        "value": "Extend"
      },
      {
        "start": 43567,
        "end": 43568,
        "value": "SpacingMark"
      },
      {
        "start": 43569,
        "end": 43570,
        "value": "Extend"
      },
      {
        "start": 43571,
        "end": 43572,
        "value": "SpacingMark"
      },
      {
        "start": 43573,
        "end": 43574,
        "value": "Extend"
      },
      {
        "start": 43587,
        "end": 43587,
        "value": "Extend"
      },
      {
        "start": 43596,
        "end": 43596,
        "value": "Extend"
      },
      {
        "start": 43597,
        "end": 43597,
        "value": "SpacingMark"
      },
      {
        "start": 43644,
        "end": 43644,
        "value": "Extend"
      },
      {
        "start": 43696,
        "end": 43696,
        "value": "Extend"
      },
      {
        "start": 43698,
        "end": 43700,
        "value": "Extend"
      },
      {
        "start": 43703,
        "end": 43704,
        "value": "Extend"
      },
      {
        "start": 43710,
        "end": 43711,
        "value": "Extend"
      },
      {
        "start": 43713,
        "end": 43713,
        "value": "Extend"
      },
      {
        "start": 43755,
        "end": 43755,
        "value": "SpacingMark"
      },
      {
        "start": 43756,
        "end": 43757,
        "value": "Extend"
      },
      {
        "start": 43758,
        "end": 43759,
        "value": "SpacingMark"
      },
      {
        "start": 43765,
        "end": 43765,
        "value": "SpacingMark"
      },
      {
        "start": 43766,
        "end": 43766,
        "value": "Extend"
      },
      {
        "start": 44003,
        "end": 44004,
        "value": "SpacingMark"
      },
      {
        "start": 44005,
        "end": 44005,
        "value": "Extend"
      },
      {
        "start": 44006,
        "end": 44007,
        "value": "SpacingMark"
      },
      {
        "start": 44008,
        "end": 44008,
        "value": "Extend"
      },
      {
        "start": 44009,
        "end": 44010,
        "value": "SpacingMark"
      },
      {
        "start": 44012,
        "end": 44012,
        "value": "SpacingMark"
      },
      {
        "start": 44013,
        "end": 44013,
        "value": "Extend"
      },
      {
        "start": 44032,
        "end": 44032,
        "value": "LV"
      },
      {
        "start": 44033,
        "end": 44059,
        "value": "LVT"
      },
      {
        "start": 44060,
        "end": 44060,
        "value": "LV"
      },
      {
        "start": 44061,
        "end": 44087,
        "value": "LVT"
      },
      {
        "start": 44088,
        "end": 44088,
        "value": "LV"
      },
      {
        "start": 44089,
        "end": 44115,
        "value": "LVT"
      },
      {
        "start": 44116,
        "end": 44116,
        "value": "LV"
      },
      {
        "start": 44117,
        "end": 44143,
        "value": "LVT"
      },
      {
        "start": 44144,
        "end": 44144,
        "value": "LV"
      },
      {
        "start": 44145,
        "end": 44171,
        "value": "LVT"
      },
      {
        "start": 44172,
        "end": 44172,
        "value": "LV"
      },
      {
        "start": 44173,
        "end": 44199,
        "value": "LVT"
      },
      {
        "start": 44200,
        "end": 44200,
        "value": "LV"
      },
      {
        "start": 44201,
        "end": 44227,
        "value": "LVT"
      },
      {
        "start": 44228,
        "end": 44228,
        "value": "LV"
      },
      {
        "start": 44229,
        "end": 44255,
        "value": "LVT"
      },
      {
        "start": 44256,
        "end": 44256,
        "value": "LV"
      },
      {
        "start": 44257,
        "end": 44283,
        "value": "LVT"
      },
      {
        "start": 44284,
        "end": 44284,
        "value": "LV"
      },
      {
        "start": 44285,
        "end": 44311,
        "value": "LVT"
      },
      {
        "start": 44312,
        "end": 44312,
        "value": "LV"
      },
      {
        "start": 44313,
        "end": 44339,
        "value": "LVT"
      },
      {
        "start": 44340,
        "end": 44340,
        "value": "LV"
      },
      {
        "start": 44341,
        "end": 44367,
        "value": "LVT"
      },
      {
        "start": 44368,
        "end": 44368,
        "value": "LV"
      },
      {
        "start": 44369,
        "end": 44395,
        "value": "LVT"
      },
      {
        "start": 44396,
        "end": 44396,
        "value": "LV"
      },
      {
        "start": 44397,
        "end": 44423,
        "value": "LVT"
      },
      {
        "start": 44424,
        "end": 44424,
        "value": "LV"
      },
      {
        "start": 44425,
        "end": 44451,
        "value": "LVT"
      },
      {
        "start": 44452,
        "end": 44452,
        "value": "LV"
      },
      {
        "start": 44453,
        "end": 44479,
        "value": "LVT"
      },
      {
        "start": 44480,
        "end": 44480,
        "value": "LV"
      },
      {
        "start": 44481,
        "end": 44507,
        "value": "LVT"
      },
      {
        "start": 44508,
        "end": 44508,
        "value": "LV"
      },
      {
        "start": 44509,
        "end": 44535,
        "value": "LVT"
      },
      {
        "start": 44536,
        "end": 44536,
        "value": "LV"
      },
      {
        "start": 44537,
        "end": 44563,
        "value": "LVT"
      },
      {
        "start": 44564,
        "end": 44564,
        "value": "LV"
      },
      {
        "start": 44565,
        "end": 44591,
        "value": "LVT"
      },
      {
        "start": 44592,
        "end": 44592,
        "value": "LV"
      },
      {
        "start": 44593,
        "end": 44619,
        "value": "LVT"
      },
      {
        "start": 44620,
        "end": 44620,
        "value": "LV"
      },
      {
        "start": 44621,
        "end": 44647,
        "value": "LVT"
      },
      {
        "start": 44648,
        "end": 44648,
        "value": "LV"
      },
      {
        "start": 44649,
        "end": 44675,
        "value": "LVT"
      },
      {
        "start": 44676,
        "end": 44676,
        "value": "LV"
      },
      {
        "start": 44677,
        "end": 44703,
        "value": "LVT"
      },
      {
        "start": 44704,
        "end": 44704,
        "value": "LV"
      },
      {
        "start": 44705,
        "end": 44731,
        "value": "LVT"
      },
      {
        "start": 44732,
        "end": 44732,
        "value": "LV"
      },
      {
        "start": 44733,
        "end": 44759,
        "value": "LVT"
      },
      {
        "start": 44760,
        "end": 44760,
        "value": "LV"
      },
      {
        "start": 44761,
        "end": 44787,
        "value": "LVT"
      },
      {
        "start": 44788,
        "end": 44788,
        "value": "LV"
      },
      {
        "start": 44789,
        "end": 44815,
        "value": "LVT"
      },
      {
        "start": 44816,
        "end": 44816,
        "value": "LV"
      },
      {
        "start": 44817,
        "end": 44843,
        "value": "LVT"
      },
      {
        "start": 44844,
        "end": 44844,
        "value": "LV"
      },
      {
        "start": 44845,
        "end": 44871,
        "value": "LVT"
      },
      {
        "start": 44872,
        "end": 44872,
        "value": "LV"
      },
      {
        "start": 44873,
        "end": 44899,
        "value": "LVT"
      },
      {
        "start": 44900,
        "end": 44900,
        "value": "LV"
      },
      {
        "start": 44901,
        "end": 44927,
        "value": "LVT"
      },
      {
        "start": 44928,
        "end": 44928,
        "value": "LV"
      },
      {
        "start": 44929,
        "end": 44955,
        "value": "LVT"
      },
      {
        "start": 44956,
        "end": 44956,
        "value": "LV"
      },
      {
        "start": 44957,
        "end": 44983,
        "value": "LVT"
      },
      {
        "start": 44984,
        "end": 44984,
        "value": "LV"
      },
      {
        "start": 44985,
        "end": 45011,
        "value": "LVT"
      },
      {
        "start": 45012,
        "end": 45012,
        "value": "LV"
      },
      {
        "start": 45013,
        "end": 45039,
        "value": "LVT"
      },
      {
        "start": 45040,
        "end": 45040,
        "value": "LV"
      },
      {
        "start": 45041,
        "end": 45067,
        "value": "LVT"
      },
      {
        "start": 45068,
        "end": 45068,
        "value": "LV"
      },
      {
        "start": 45069,
        "end": 45095,
        "value": "LVT"
      },
      {
        "start": 45096,
        "end": 45096,
        "value": "LV"
      },
      {
        "start": 45097,
        "end": 45123,
        "value": "LVT"
      },
      {
        "start": 45124,
        "end": 45124,
        "value": "LV"
      },
      {
        "start": 45125,
        "end": 45151,
        "value": "LVT"
      },
      {
        "start": 45152,
        "end": 45152,
        "value": "LV"
      },
      {
        "start": 45153,
        "end": 45179,
        "value": "LVT"
      },
      {
        "start": 45180,
        "end": 45180,
        "value": "LV"
      },
      {
        "start": 45181,
        "end": 45207,
        "value": "LVT"
      },
      {
        "start": 45208,
        "end": 45208,
        "value": "LV"
      },
      {
        "start": 45209,
        "end": 45235,
        "value": "LVT"
      },
      {
        "start": 45236,
        "end": 45236,
        "value": "LV"
      },
      {
        "start": 45237,
        "end": 45263,
        "value": "LVT"
      },
      {
        "start": 45264,
        "end": 45264,
        "value": "LV"
      },
      {
        "start": 45265,
        "end": 45291,
        "value": "LVT"
      },
      {
        "start": 45292,
        "end": 45292,
        "value": "LV"
      },
      {
        "start": 45293,
        "end": 45319,
        "value": "LVT"
      },
      {
        "start": 45320,
        "end": 45320,
        "value": "LV"
      },
      {
        "start": 45321,
        "end": 45347,
        "value": "LVT"
      },
      {
        "start": 45348,
        "end": 45348,
        "value": "LV"
      },
      {
        "start": 45349,
        "end": 45375,
        "value": "LVT"
      },
      {
        "start": 45376,
        "end": 45376,
        "value": "LV"
      },
      {
        "start": 45377,
        "end": 45403,
        "value": "LVT"
      },
      {
        "start": 45404,
        "end": 45404,
        "value": "LV"
      },
      {
        "start": 45405,
        "end": 45431,
        "value": "LVT"
      },
      {
        "start": 45432,
        "end": 45432,
        "value": "LV"
      },
      {
        "start": 45433,
        "end": 45459,
        "value": "LVT"
      },
      {
        "start": 45460,
        "end": 45460,
        "value": "LV"
      },
      {
        "start": 45461,
        "end": 45487,
        "value": "LVT"
      },
      {
        "start": 45488,
        "end": 45488,
        "value": "LV"
      },
      {
        "start": 45489,
        "end": 45515,
        "value": "LVT"
      },
      {
        "start": 45516,
        "end": 45516,
        "value": "LV"
      },
      {
        "start": 45517,
        "end": 45543,
        "value": "LVT"
      },
      {
        "start": 45544,
        "end": 45544,
        "value": "LV"
      },
      {
        "start": 45545,
        "end": 45571,
        "value": "LVT"
      },
      {
        "start": 45572,
        "end": 45572,
        "value": "LV"
      },
      {
        "start": 45573,
        "end": 45599,
        "value": "LVT"
      },
      {
        "start": 45600,
        "end": 45600,
        "value": "LV"
      },
      {
        "start": 45601,
        "end": 45627,
        "value": "LVT"
      },
      {
        "start": 45628,
        "end": 45628,
        "value": "LV"
      },
      {
        "start": 45629,
        "end": 45655,
        "value": "LVT"
      },
      {
        "start": 45656,
        "end": 45656,
        "value": "LV"
      },
      {
        "start": 45657,
        "end": 45683,
        "value": "LVT"
      },
      {
        "start": 45684,
        "end": 45684,
        "value": "LV"
      },
      {
        "start": 45685,
        "end": 45711,
        "value": "LVT"
      },
      {
        "start": 45712,
        "end": 45712,
        "value": "LV"
      },
      {
        "start": 45713,
        "end": 45739,
        "value": "LVT"
      },
      {
        "start": 45740,
        "end": 45740,
        "value": "LV"
      },
      {
        "start": 45741,
        "end": 45767,
        "value": "LVT"
      },
      {
        "start": 45768,
        "end": 45768,
        "value": "LV"
      },
      {
        "start": 45769,
        "end": 45795,
        "value": "LVT"
      },
      {
        "start": 45796,
        "end": 45796,
        "value": "LV"
      },
      {
        "start": 45797,
        "end": 45823,
        "value": "LVT"
      },
      {
        "start": 45824,
        "end": 45824,
        "value": "LV"
      },
      {
        "start": 45825,
        "end": 45851,
        "value": "LVT"
      },
      {
        "start": 45852,
        "end": 45852,
        "value": "LV"
      },
      {
        "start": 45853,
        "end": 45879,
        "value": "LVT"
      },
      {
        "start": 45880,
        "end": 45880,
        "value": "LV"
      },
      {
        "start": 45881,
        "end": 45907,
        "value": "LVT"
      },
      {
        "start": 45908,
        "end": 45908,
        "value": "LV"
      },
      {
        "start": 45909,
        "end": 45935,
        "value": "LVT"
      },
      {
        "start": 45936,
        "end": 45936,
        "value": "LV"
      },
      {
        "start": 45937,
        "end": 45963,
        "value": "LVT"
      },
      {
        "start": 45964,
        "end": 45964,
        "value": "LV"
      },
      {
        "start": 45965,
        "end": 45991,
        "value": "LVT"
      },
      {
        "start": 45992,
        "end": 45992,
        "value": "LV"
      },
      {
        "start": 45993,
        "end": 46019,
        "value": "LVT"
      },
      {
        "start": 46020,
        "end": 46020,
        "value": "LV"
      },
      {
        "start": 46021,
        "end": 46047,
        "value": "LVT"
      },
      {
        "start": 46048,
        "end": 46048,
        "value": "LV"
      },
      {
        "start": 46049,
        "end": 46075,
        "value": "LVT"
      },
      {
        "start": 46076,
        "end": 46076,
        "value": "LV"
      },
      {
        "start": 46077,
        "end": 46103,
        "value": "LVT"
      },
      {
        "start": 46104,
        "end": 46104,
        "value": "LV"
      },
      {
        "start": 46105,
        "end": 46131,
        "value": "LVT"
      },
      {
        "start": 46132,
        "end": 46132,
        "value": "LV"
      },
      {
        "start": 46133,
        "end": 46159,
        "value": "LVT"
      },
      {
        "start": 46160,
        "end": 46160,
        "value": "LV"
      },
      {
        "start": 46161,
        "end": 46187,
        "value": "LVT"
      },
      {
        "start": 46188,
        "end": 46188,
        "value": "LV"
      },
      {
        "start": 46189,
        "end": 46215,
        "value": "LVT"
      },
      {
        "start": 46216,
        "end": 46216,
        "value": "LV"
      },
      {
        "start": 46217,
        "end": 46243,
        "value": "LVT"
      },
      {
        "start": 46244,
        "end": 46244,
        "value": "LV"
      },
      {
        "start": 46245,
        "end": 46271,
        "value": "LVT"
      },
      {
        "start": 46272,
        "end": 46272,
        "value": "LV"
      },
      {
        "start": 46273,
        "end": 46299,
        "value": "LVT"
      },
      {
        "start": 46300,
        "end": 46300,
        "value": "LV"
      },
      {
        "start": 46301,
        "end": 46327,
        "value": "LVT"
      },
      {
        "start": 46328,
        "end": 46328,
        "value": "LV"
      },
      {
        "start": 46329,
        "end": 46355,
        "value": "LVT"
      },
      {
        "start": 46356,
        "end": 46356,
        "value": "LV"
      },
      {
        "start": 46357,
        "end": 46383,
        "value": "LVT"
      },
      {
        "start": 46384,
        "end": 46384,
        "value": "LV"
      },
      {
        "start": 46385,
        "end": 46411,
        "value": "LVT"
      },
      {
        "start": 46412,
        "end": 46412,
        "value": "LV"
      },
      {
        "start": 46413,
        "end": 46439,
        "value": "LVT"
      },
      {
        "start": 46440,
        "end": 46440,
        "value": "LV"
      },
      {
        "start": 46441,
        "end": 46467,
        "value": "LVT"
      },
      {
        "start": 46468,
        "end": 46468,
        "value": "LV"
      },
      {
        "start": 46469,
        "end": 46495,
        "value": "LVT"
      },
      {
        "start": 46496,
        "end": 46496,
        "value": "LV"
      },
      {
        "start": 46497,
        "end": 46523,
        "value": "LVT"
      },
      {
        "start": 46524,
        "end": 46524,
        "value": "LV"
      },
      {
        "start": 46525,
        "end": 46551,
        "value": "LVT"
      },
      {
        "start": 46552,
        "end": 46552,
        "value": "LV"
      },
      {
        "start": 46553,
        "end": 46579,
        "value": "LVT"
      },
      {
        "start": 46580,
        "end": 46580,
        "value": "LV"
      },
      {
        "start": 46581,
        "end": 46607,
        "value": "LVT"
      },
      {
        "start": 46608,
        "end": 46608,
        "value": "LV"
      },
      {
        "start": 46609,
        "end": 46635,
        "value": "LVT"
      },
      {
        "start": 46636,
        "end": 46636,
        "value": "LV"
      },
      {
        "start": 46637,
        "end": 46663,
        "value": "LVT"
      },
      {
        "start": 46664,
        "end": 46664,
        "value": "LV"
      },
      {
        "start": 46665,
        "end": 46691,
        "value": "LVT"
      },
      {
        "start": 46692,
        "end": 46692,
        "value": "LV"
      },
      {
        "start": 46693,
        "end": 46719,
        "value": "LVT"
      },
      {
        "start": 46720,
        "end": 46720,
        "value": "LV"
      },
      {
        "start": 46721,
        "end": 46747,
        "value": "LVT"
      },
      {
        "start": 46748,
        "end": 46748,
        "value": "LV"
      },
      {
        "start": 46749,
        "end": 46775,
        "value": "LVT"
      },
      {
        "start": 46776,
        "end": 46776,
        "value": "LV"
      },
      {
        "start": 46777,
        "end": 46803,
        "value": "LVT"
      },
      {
        "start": 46804,
        "end": 46804,
        "value": "LV"
      },
      {
        "start": 46805,
        "end": 46831,
        "value": "LVT"
      },
      {
        "start": 46832,
        "end": 46832,
        "value": "LV"
      },
      {
        "start": 46833,
        "end": 46859,
        "value": "LVT"
      },
      {
        "start": 46860,
        "end": 46860,
        "value": "LV"
      },
      {
        "start": 46861,
        "end": 46887,
        "value": "LVT"
      },
      {
        "start": 46888,
        "end": 46888,
        "value": "LV"
      },
      {
        "start": 46889,
        "end": 46915,
        "value": "LVT"
      },
      {
        "start": 46916,
        "end": 46916,
        "value": "LV"
      },
      {
        "start": 46917,
        "end": 46943,
        "value": "LVT"
      },
      {
        "start": 46944,
        "end": 46944,
        "value": "LV"
      },
      {
        "start": 46945,
        "end": 46971,
        "value": "LVT"
      },
      {
        "start": 46972,
        "end": 46972,
        "value": "LV"
      },
      {
        "start": 46973,
        "end": 46999,
        "value": "LVT"
      },
      {
        "start": 47000,
        "end": 47000,
        "value": "LV"
      },
      {
        "start": 47001,
        "end": 47027,
        "value": "LVT"
      },
      {
        "start": 47028,
        "end": 47028,
        "value": "LV"
      },
      {
        "start": 47029,
        "end": 47055,
        "value": "LVT"
      },
      {
        "start": 47056,
        "end": 47056,
        "value": "LV"
      },
      {
        "start": 47057,
        "end": 47083,
        "value": "LVT"
      },
      {
        "start": 47084,
        "end": 47084,
        "value": "LV"
      },
      {
        "start": 47085,
        "end": 47111,
        "value": "LVT"
      },
      {
        "start": 47112,
        "end": 47112,
        "value": "LV"
      },
      {
        "start": 47113,
        "end": 47139,
        "value": "LVT"
      },
      {
        "start": 47140,
        "end": 47140,
        "value": "LV"
      },
      {
        "start": 47141,
        "end": 47167,
        "value": "LVT"
      },
      {
        "start": 47168,
        "end": 47168,
        "value": "LV"
      },
      {
        "start": 47169,
        "end": 47195,
        "value": "LVT"
      },
      {
        "start": 47196,
        "end": 47196,
        "value": "LV"
      },
      {
        "start": 47197,
        "end": 47223,
        "value": "LVT"
      },
      {
        "start": 47224,
        "end": 47224,
        "value": "LV"
      },
      {
        "start": 47225,
        "end": 47251,
        "value": "LVT"
      },
      {
        "start": 47252,
        "end": 47252,
        "value": "LV"
      },
      {
        "start": 47253,
        "end": 47279,
        "value": "LVT"
      },
      {
        "start": 47280,
        "end": 47280,
        "value": "LV"
      },
      {
        "start": 47281,
        "end": 47307,
        "value": "LVT"
      },
      {
        "start": 47308,
        "end": 47308,
        "value": "LV"
      },
      {
        "start": 47309,
        "end": 47335,
        "value": "LVT"
      },
      {
        "start": 47336,
        "end": 47336,
        "value": "LV"
      },
      {
        "start": 47337,
        "end": 47363,
        "value": "LVT"
      },
      {
        "start": 47364,
        "end": 47364,
        "value": "LV"
      },
      {
        "start": 47365,
        "end": 47391,
        "value": "LVT"
      },
      {
        "start": 47392,
        "end": 47392,
        "value": "LV"
      },
      {
        "start": 47393,
        "end": 47419,
        "value": "LVT"
      },
      {
        "start": 47420,
        "end": 47420,
        "value": "LV"
      },
      {
        "start": 47421,
        "end": 47447,
        "value": "LVT"
      },
      {
        "start": 47448,
        "end": 47448,
        "value": "LV"
      },
      {
        "start": 47449,
        "end": 47475,
        "value": "LVT"
      },
      {
        "start": 47476,
        "end": 47476,
        "value": "LV"
      },
      {
        "start": 47477,
        "end": 47503,
        "value": "LVT"
      },
      {
        "start": 47504,
        "end": 47504,
        "value": "LV"
      },
      {
        "start": 47505,
        "end": 47531,
        "value": "LVT"
      },
      {
        "start": 47532,
        "end": 47532,
        "value": "LV"
      },
      {
        "start": 47533,
        "end": 47559,
        "value": "LVT"
      },
      {
        "start": 47560,
        "end": 47560,
        "value": "LV"
      },
      {
        "start": 47561,
        "end": 47587,
        "value": "LVT"
      },
      {
        "start": 47588,
        "end": 47588,
        "value": "LV"
      },
      {
        "start": 47589,
        "end": 47615,
        "value": "LVT"
      },
      {
        "start": 47616,
        "end": 47616,
        "value": "LV"
      },
      {
        "start": 47617,
        "end": 47643,
        "value": "LVT"
      },
      {
        "start": 47644,
        "end": 47644,
        "value": "LV"
      },
      {
        "start": 47645,
        "end": 47671,
        "value": "LVT"
      },
      {
        "start": 47672,
        "end": 47672,
        "value": "LV"
      },
      {
        "start": 47673,
        "end": 47699,
        "value": "LVT"
      },
      {
        "start": 47700,
        "end": 47700,
        "value": "LV"
      },
      {
        "start": 47701,
        "end": 47727,
        "value": "LVT"
      },
      {
        "start": 47728,
        "end": 47728,
        "value": "LV"
      },
      {
        "start": 47729,
        "end": 47755,
        "value": "LVT"
      },
      {
        "start": 47756,
        "end": 47756,
        "value": "LV"
      },
      {
        "start": 47757,
        "end": 47783,
        "value": "LVT"
      },
      {
        "start": 47784,
        "end": 47784,
        "value": "LV"
      },
      {
        "start": 47785,
        "end": 47811,
        "value": "LVT"
      },
      {
        "start": 47812,
        "end": 47812,
        "value": "LV"
      },
      {
        "start": 47813,
        "end": 47839,
        "value": "LVT"
      },
      {
        "start": 47840,
        "end": 47840,
        "value": "LV"
      },
      {
        "start": 47841,
        "end": 47867,
        "value": "LVT"
      },
      {
        "start": 47868,
        "end": 47868,
        "value": "LV"
      },
      {
        "start": 47869,
        "end": 47895,
        "value": "LVT"
      },
      {
        "start": 47896,
        "end": 47896,
        "value": "LV"
      },
      {
        "start": 47897,
        "end": 47923,
        "value": "LVT"
      },
      {
        "start": 47924,
        "end": 47924,
        "value": "LV"
      },
      {
        "start": 47925,
        "end": 47951,
        "value": "LVT"
      },
      {
        "start": 47952,
        "end": 47952,
        "value": "LV"
      },
      {
        "start": 47953,
        "end": 47979,
        "value": "LVT"
      },
      {
        "start": 47980,
        "end": 47980,
        "value": "LV"
      },
      {
        "start": 47981,
        "end": 48007,
        "value": "LVT"
      },
      {
        "start": 48008,
        "end": 48008,
        "value": "LV"
      },
      {
        "start": 48009,
        "end": 48035,
        "value": "LVT"
      },
      {
        "start": 48036,
        "end": 48036,
        "value": "LV"
      },
      {
        "start": 48037,
        "end": 48063,
        "value": "LVT"
      },
      {
        "start": 48064,
        "end": 48064,
        "value": "LV"
      },
      {
        "start": 48065,
        "end": 48091,
        "value": "LVT"
      },
      {
        "start": 48092,
        "end": 48092,
        "value": "LV"
      },
      {
        "start": 48093,
        "end": 48119,
        "value": "LVT"
      },
      {
        "start": 48120,
        "end": 48120,
        "value": "LV"
      },
      {
        "start": 48121,
        "end": 48147,
        "value": "LVT"
      },
      {
        "start": 48148,
        "end": 48148,
        "value": "LV"
      },
      {
        "start": 48149,
        "end": 48175,
        "value": "LVT"
      },
      {
        "start": 48176,
        "end": 48176,
        "value": "LV"
      },
      {
        "start": 48177,
        "end": 48203,
        "value": "LVT"
      },
      {
        "start": 48204,
        "end": 48204,
        "value": "LV"
      },
      {
        "start": 48205,
        "end": 48231,
        "value": "LVT"
      },
      {
        "start": 48232,
        "end": 48232,
        "value": "LV"
      },
      {
        "start": 48233,
        "end": 48259,
        "value": "LVT"
      },
      {
        "start": 48260,
        "end": 48260,
        "value": "LV"
      },
      {
        "start": 48261,
        "end": 48287,
        "value": "LVT"
      },
      {
        "start": 48288,
        "end": 48288,
        "value": "LV"
      },
      {
        "start": 48289,
        "end": 48315,
        "value": "LVT"
      },
      {
        "start": 48316,
        "end": 48316,
        "value": "LV"
      },
      {
        "start": 48317,
        "end": 48343,
        "value": "LVT"
      },
      {
        "start": 48344,
        "end": 48344,
        "value": "LV"
      },
      {
        "start": 48345,
        "end": 48371,
        "value": "LVT"
      },
      {
        "start": 48372,
        "end": 48372,
        "value": "LV"
      },
      {
        "start": 48373,
        "end": 48399,
        "value": "LVT"
      },
      {
        "start": 48400,
        "end": 48400,
        "value": "LV"
      },
      {
        "start": 48401,
        "end": 48427,
        "value": "LVT"
      },
      {
        "start": 48428,
        "end": 48428,
        "value": "LV"
      },
      {
        "start": 48429,
        "end": 48455,
        "value": "LVT"
      },
      {
        "start": 48456,
        "end": 48456,
        "value": "LV"
      },
      {
        "start": 48457,
        "end": 48483,
        "value": "LVT"
      },
      {
        "start": 48484,
        "end": 48484,
        "value": "LV"
      },
      {
        "start": 48485,
        "end": 48511,
        "value": "LVT"
      },
      {
        "start": 48512,
        "end": 48512,
        "value": "LV"
      },
      {
        "start": 48513,
        "end": 48539,
        "value": "LVT"
      },
      {
        "start": 48540,
        "end": 48540,
        "value": "LV"
      },
      {
        "start": 48541,
        "end": 48567,
        "value": "LVT"
      },
      {
        "start": 48568,
        "end": 48568,
        "value": "LV"
      },
      {
        "start": 48569,
        "end": 48595,
        "value": "LVT"
      },
      {
        "start": 48596,
        "end": 48596,
        "value": "LV"
      },
      {
        "start": 48597,
        "end": 48623,
        "value": "LVT"
      },
      {
        "start": 48624,
        "end": 48624,
        "value": "LV"
      },
      {
        "start": 48625,
        "end": 48651,
        "value": "LVT"
      },
      {
        "start": 48652,
        "end": 48652,
        "value": "LV"
      },
      {
        "start": 48653,
        "end": 48679,
        "value": "LVT"
      },
      {
        "start": 48680,
        "end": 48680,
        "value": "LV"
      },
      {
        "start": 48681,
        "end": 48707,
        "value": "LVT"
      },
      {
        "start": 48708,
        "end": 48708,
        "value": "LV"
      },
      {
        "start": 48709,
        "end": 48735,
        "value": "LVT"
      },
      {
        "start": 48736,
        "end": 48736,
        "value": "LV"
      },
      {
        "start": 48737,
        "end": 48763,
        "value": "LVT"
      },
      {
        "start": 48764,
        "end": 48764,
        "value": "LV"
      },
      {
        "start": 48765,
        "end": 48791,
        "value": "LVT"
      },
      {
        "start": 48792,
        "end": 48792,
        "value": "LV"
      },
      {
        "start": 48793,
        "end": 48819,
        "value": "LVT"
      },
      {
        "start": 48820,
        "end": 48820,
        "value": "LV"
      },
      {
        "start": 48821,
        "end": 48847,
        "value": "LVT"
      },
      {
        "start": 48848,
        "end": 48848,
        "value": "LV"
      },
      {
        "start": 48849,
        "end": 48875,
        "value": "LVT"
      },
      {
        "start": 48876,
        "end": 48876,
        "value": "LV"
      },
      {
        "start": 48877,
        "end": 48903,
        "value": "LVT"
      },
      {
        "start": 48904,
        "end": 48904,
        "value": "LV"
      },
      {
        "start": 48905,
        "end": 48931,
        "value": "LVT"
      },
      {
        "start": 48932,
        "end": 48932,
        "value": "LV"
      },
      {
        "start": 48933,
        "end": 48959,
        "value": "LVT"
      },
      {
        "start": 48960,
        "end": 48960,
        "value": "LV"
      },
      {
        "start": 48961,
        "end": 48987,
        "value": "LVT"
      },
      {
        "start": 48988,
        "end": 48988,
        "value": "LV"
      },
      {
        "start": 48989,
        "end": 49015,
        "value": "LVT"
      },
      {
        "start": 49016,
        "end": 49016,
        "value": "LV"
      },
      {
        "start": 49017,
        "end": 49043,
        "value": "LVT"
      },
      {
        "start": 49044,
        "end": 49044,
        "value": "LV"
      },
      {
        "start": 49045,
        "end": 49071,
        "value": "LVT"
      },
      {
        "start": 49072,
        "end": 49072,
        "value": "LV"
      },
      {
        "start": 49073,
        "end": 49099,
        "value": "LVT"
      },
      {
        "start": 49100,
        "end": 49100,
        "value": "LV"
      },
      {
        "start": 49101,
        "end": 49127,
        "value": "LVT"
      },
      {
        "start": 49128,
        "end": 49128,
        "value": "LV"
      },
      {
        "start": 49129,
        "end": 49155,
        "value": "LVT"
      },
      {
        "start": 49156,
        "end": 49156,
        "value": "LV"
      },
      {
        "start": 49157,
        "end": 49183,
        "value": "LVT"
      },
      {
        "start": 49184,
        "end": 49184,
        "value": "LV"
      },
      {
        "start": 49185,
        "end": 49211,
        "value": "LVT"
      },
      {
        "start": 49212,
        "end": 49212,
        "value": "LV"
      },
      {
        "start": 49213,
        "end": 49239,
        "value": "LVT"
      },
      {
        "start": 49240,
        "end": 49240,
        "value": "LV"
      },
      {
        "start": 49241,
        "end": 49267,
        "value": "LVT"
      },
      {
        "start": 49268,
        "end": 49268,
        "value": "LV"
      },
      {
        "start": 49269,
        "end": 49295,
        "value": "LVT"
      },
      {
        "start": 49296,
        "end": 49296,
        "value": "LV"
      },
      {
        "start": 49297,
        "end": 49323,
        "value": "LVT"
      },
      {
        "start": 49324,
        "end": 49324,
        "value": "LV"
      },
      {
        "start": 49325,
        "end": 49351,
        "value": "LVT"
      },
      {
        "start": 49352,
        "end": 49352,
        "value": "LV"
      },
      {
        "start": 49353,
        "end": 49379,
        "value": "LVT"
      },
      {
        "start": 49380,
        "end": 49380,
        "value": "LV"
      },
      {
        "start": 49381,
        "end": 49407,
        "value": "LVT"
      },
      {
        "start": 49408,
        "end": 49408,
        "value": "LV"
      },
      {
        "start": 49409,
        "end": 49435,
        "value": "LVT"
      },
      {
        "start": 49436,
        "end": 49436,
        "value": "LV"
      },
      {
        "start": 49437,
        "end": 49463,
        "value": "LVT"
      },
      {
        "start": 49464,
        "end": 49464,
        "value": "LV"
      },
      {
        "start": 49465,
        "end": 49491,
        "value": "LVT"
      },
      {
        "start": 49492,
        "end": 49492,
        "value": "LV"
      },
      {
        "start": 49493,
        "end": 49519,
        "value": "LVT"
      },
      {
        "start": 49520,
        "end": 49520,
        "value": "LV"
      },
      {
        "start": 49521,
        "end": 49547,
        "value": "LVT"
      },
      {
        "start": 49548,
        "end": 49548,
        "value": "LV"
      },
      {
        "start": 49549,
        "end": 49575,
        "value": "LVT"
      },
      {
        "start": 49576,
        "end": 49576,
        "value": "LV"
      },
      {
        "start": 49577,
        "end": 49603,
        "value": "LVT"
      },
      {
        "start": 49604,
        "end": 49604,
        "value": "LV"
      },
      {
        "start": 49605,
        "end": 49631,
        "value": "LVT"
      },
      {
        "start": 49632,
        "end": 49632,
        "value": "LV"
      },
      {
        "start": 49633,
        "end": 49659,
        "value": "LVT"
      },
      {
        "start": 49660,
        "end": 49660,
        "value": "LV"
      },
      {
        "start": 49661,
        "end": 49687,
        "value": "LVT"
      },
      {
        "start": 49688,
        "end": 49688,
        "value": "LV"
      },
      {
        "start": 49689,
        "end": 49715,
        "value": "LVT"
      },
      {
        "start": 49716,
        "end": 49716,
        "value": "LV"
      },
      {
        "start": 49717,
        "end": 49743,
        "value": "LVT"
      },
      {
        "start": 49744,
        "end": 49744,
        "value": "LV"
      },
      {
        "start": 49745,
        "end": 49771,
        "value": "LVT"
      },
      {
        "start": 49772,
        "end": 49772,
        "value": "LV"
      },
      {
        "start": 49773,
        "end": 49799,
        "value": "LVT"
      },
      {
        "start": 49800,
        "end": 49800,
        "value": "LV"
      },
      {
        "start": 49801,
        "end": 49827,
        "value": "LVT"
      },
      {
        "start": 49828,
        "end": 49828,
        "value": "LV"
      },
      {
        "start": 49829,
        "end": 49855,
        "value": "LVT"
      },
      {
        "start": 49856,
        "end": 49856,
        "value": "LV"
      },
      {
        "start": 49857,
        "end": 49883,
        "value": "LVT"
      },
      {
        "start": 49884,
        "end": 49884,
        "value": "LV"
      },
      {
        "start": 49885,
        "end": 49911,
        "value": "LVT"
      },
      {
        "start": 49912,
        "end": 49912,
        "value": "LV"
      },
      {
        "start": 49913,
        "end": 49939,
        "value": "LVT"
      },
      {
        "start": 49940,
        "end": 49940,
        "value": "LV"
      },
      {
        "start": 49941,
        "end": 49967,
        "value": "LVT"
      },
      {
        "start": 49968,
        "end": 49968,
        "value": "LV"
      },
      {
        "start": 49969,
        "end": 49995,
        "value": "LVT"
      },
      {
        "start": 49996,
        "end": 49996,
        "value": "LV"
      },
      {
        "start": 49997,
        "end": 50023,
        "value": "LVT"
      },
      {
        "start": 50024,
        "end": 50024,
        "value": "LV"
      },
      {
        "start": 50025,
        "end": 50051,
        "value": "LVT"
      },
      {
        "start": 50052,
        "end": 50052,
        "value": "LV"
      },
      {
        "start": 50053,
        "end": 50079,
        "value": "LVT"
      },
      {
        "start": 50080,
        "end": 50080,
        "value": "LV"
      },
      {
        "start": 50081,
        "end": 50107,
        "value": "LVT"
      },
      {
        "start": 50108,
        "end": 50108,
        "value": "LV"
      },
      {
        "start": 50109,
        "end": 50135,
        "value": "LVT"
      },
      {
        "start": 50136,
        "end": 50136,
        "value": "LV"
      },
      {
        "start": 50137,
        "end": 50163,
        "value": "LVT"
      },
      {
        "start": 50164,
        "end": 50164,
        "value": "LV"
      },
      {
        "start": 50165,
        "end": 50191,
        "value": "LVT"
      },
      {
        "start": 50192,
        "end": 50192,
        "value": "LV"
      },
      {
        "start": 50193,
        "end": 50219,
        "value": "LVT"
      },
      {
        "start": 50220,
        "end": 50220,
        "value": "LV"
      },
      {
        "start": 50221,
        "end": 50247,
        "value": "LVT"
      },
      {
        "start": 50248,
        "end": 50248,
        "value": "LV"
      },
      {
        "start": 50249,
        "end": 50275,
        "value": "LVT"
      },
      {
        "start": 50276,
        "end": 50276,
        "value": "LV"
      },
      {
        "start": 50277,
        "end": 50303,
        "value": "LVT"
      },
      {
        "start": 50304,
        "end": 50304,
        "value": "LV"
      },
      {
        "start": 50305,
        "end": 50331,
        "value": "LVT"
      },
      {
        "start": 50332,
        "end": 50332,
        "value": "LV"
      },
      {
        "start": 50333,
        "end": 50359,
        "value": "LVT"
      },
      {
        "start": 50360,
        "end": 50360,
        "value": "LV"
      },
      {
        "start": 50361,
        "end": 50387,
        "value": "LVT"
      },
      {
        "start": 50388,
        "end": 50388,
        "value": "LV"
      },
      {
        "start": 50389,
        "end": 50415,
        "value": "LVT"
      },
      {
        "start": 50416,
        "end": 50416,
        "value": "LV"
      },
      {
        "start": 50417,
        "end": 50443,
        "value": "LVT"
      },
      {
        "start": 50444,
        "end": 50444,
        "value": "LV"
      },
      {
        "start": 50445,
        "end": 50471,
        "value": "LVT"
      },
      {
        "start": 50472,
        "end": 50472,
        "value": "LV"
      },
      {
        "start": 50473,
        "end": 50499,
        "value": "LVT"
      },
      {
        "start": 50500,
        "end": 50500,
        "value": "LV"
      },
      {
        "start": 50501,
        "end": 50527,
        "value": "LVT"
      },
      {
        "start": 50528,
        "end": 50528,
        "value": "LV"
      },
      {
        "start": 50529,
        "end": 50555,
        "value": "LVT"
      },
      {
        "start": 50556,
        "end": 50556,
        "value": "LV"
      },
      {
        "start": 50557,
        "end": 50583,
        "value": "LVT"
      },
      {
        "start": 50584,
        "end": 50584,
        "value": "LV"
      },
      {
        "start": 50585,
        "end": 50611,
        "value": "LVT"
      },
      {
        "start": 50612,
        "end": 50612,
        "value": "LV"
      },
      {
        "start": 50613,
        "end": 50639,
        "value": "LVT"
      },
      {
        "start": 50640,
        "end": 50640,
        "value": "LV"
      },
      {
        "start": 50641,
        "end": 50667,
        "value": "LVT"
      },
      {
        "start": 50668,
        "end": 50668,
        "value": "LV"
      },
      {
        "start": 50669,
        "end": 50695,
        "value": "LVT"
      },
      {
        "start": 50696,
        "end": 50696,
        "value": "LV"
      },
      {
        "start": 50697,
        "end": 50723,
        "value": "LVT"
      },
      {
        "start": 50724,
        "end": 50724,
        "value": "LV"
      },
      {
        "start": 50725,
        "end": 50751,
        "value": "LVT"
      },
      {
        "start": 50752,
        "end": 50752,
        "value": "LV"
      },
      {
        "start": 50753,
        "end": 50779,
        "value": "LVT"
      },
      {
        "start": 50780,
        "end": 50780,
        "value": "LV"
      },
      {
        "start": 50781,
        "end": 50807,
        "value": "LVT"
      },
      {
        "start": 50808,
        "end": 50808,
        "value": "LV"
      },
      {
        "start": 50809,
        "end": 50835,
        "value": "LVT"
      },
      {
        "start": 50836,
        "end": 50836,
        "value": "LV"
      },
      {
        "start": 50837,
        "end": 50863,
        "value": "LVT"
      },
      {
        "start": 50864,
        "end": 50864,
        "value": "LV"
      },
      {
        "start": 50865,
        "end": 50891,
        "value": "LVT"
      },
      {
        "start": 50892,
        "end": 50892,
        "value": "LV"
      },
      {
        "start": 50893,
        "end": 50919,
        "value": "LVT"
      },
      {
        "start": 50920,
        "end": 50920,
        "value": "LV"
      },
      {
        "start": 50921,
        "end": 50947,
        "value": "LVT"
      },
      {
        "start": 50948,
        "end": 50948,
        "value": "LV"
      },
      {
        "start": 50949,
        "end": 50975,
        "value": "LVT"
      },
      {
        "start": 50976,
        "end": 50976,
        "value": "LV"
      },
      {
        "start": 50977,
        "end": 51003,
        "value": "LVT"
      },
      {
        "start": 51004,
        "end": 51004,
        "value": "LV"
      },
      {
        "start": 51005,
        "end": 51031,
        "value": "LVT"
      },
      {
        "start": 51032,
        "end": 51032,
        "value": "LV"
      },
      {
        "start": 51033,
        "end": 51059,
        "value": "LVT"
      },
      {
        "start": 51060,
        "end": 51060,
        "value": "LV"
      },
      {
        "start": 51061,
        "end": 51087,
        "value": "LVT"
      },
      {
        "start": 51088,
        "end": 51088,
        "value": "LV"
      },
      {
        "start": 51089,
        "end": 51115,
        "value": "LVT"
      },
      {
        "start": 51116,
        "end": 51116,
        "value": "LV"
      },
      {
        "start": 51117,
        "end": 51143,
        "value": "LVT"
      },
      {
        "start": 51144,
        "end": 51144,
        "value": "LV"
      },
      {
        "start": 51145,
        "end": 51171,
        "value": "LVT"
      },
      {
        "start": 51172,
        "end": 51172,
        "value": "LV"
      },
      {
        "start": 51173,
        "end": 51199,
        "value": "LVT"
      },
      {
        "start": 51200,
        "end": 51200,
        "value": "LV"
      },
      {
        "start": 51201,
        "end": 51227,
        "value": "LVT"
      },
      {
        "start": 51228,
        "end": 51228,
        "value": "LV"
      },
      {
        "start": 51229,
        "end": 51255,
        "value": "LVT"
      },
      {
        "start": 51256,
        "end": 51256,
        "value": "LV"
      },
      {
        "start": 51257,
        "end": 51283,
        "value": "LVT"
      },
      {
        "start": 51284,
        "end": 51284,
        "value": "LV"
      },
      {
        "start": 51285,
        "end": 51311,
        "value": "LVT"
      },
      {
        "start": 51312,
        "end": 51312,
        "value": "LV"
      },
      {
        "start": 51313,
        "end": 51339,
        "value": "LVT"
      },
      {
        "start": 51340,
        "end": 51340,
        "value": "LV"
      },
      {
        "start": 51341,
        "end": 51367,
        "value": "LVT"
      },
      {
        "start": 51368,
        "end": 51368,
        "value": "LV"
      },
      {
        "start": 51369,
        "end": 51395,
        "value": "LVT"
      },
      {
        "start": 51396,
        "end": 51396,
        "value": "LV"
      },
      {
        "start": 51397,
        "end": 51423,
        "value": "LVT"
      },
      {
        "start": 51424,
        "end": 51424,
        "value": "LV"
      },
      {
        "start": 51425,
        "end": 51451,
        "value": "LVT"
      },
      {
        "start": 51452,
        "end": 51452,
        "value": "LV"
      },
      {
        "start": 51453,
        "end": 51479,
        "value": "LVT"
      },
      {
        "start": 51480,
        "end": 51480,
        "value": "LV"
      },
      {
        "start": 51481,
        "end": 51507,
        "value": "LVT"
      },
      {
        "start": 51508,
        "end": 51508,
        "value": "LV"
      },
      {
        "start": 51509,
        "end": 51535,
        "value": "LVT"
      },
      {
        "start": 51536,
        "end": 51536,
        "value": "LV"
      },
      {
        "start": 51537,
        "end": 51563,
        "value": "LVT"
      },
      {
        "start": 51564,
        "end": 51564,
        "value": "LV"
      },
      {
        "start": 51565,
        "end": 51591,
        "value": "LVT"
      },
      {
        "start": 51592,
        "end": 51592,
        "value": "LV"
      },
      {
        "start": 51593,
        "end": 51619,
        "value": "LVT"
      },
      {
        "start": 51620,
        "end": 51620,
        "value": "LV"
      },
      {
        "start": 51621,
        "end": 51647,
        "value": "LVT"
      },
      {
        "start": 51648,
        "end": 51648,
        "value": "LV"
      },
      {
        "start": 51649,
        "end": 51675,
        "value": "LVT"
      },
      {
        "start": 51676,
        "end": 51676,
        "value": "LV"
      },
      {
        "start": 51677,
        "end": 51703,
        "value": "LVT"
      },
      {
        "start": 51704,
        "end": 51704,
        "value": "LV"
      },
      {
        "start": 51705,
        "end": 51731,
        "value": "LVT"
      },
      {
        "start": 51732,
        "end": 51732,
        "value": "LV"
      },
      {
        "start": 51733,
        "end": 51759,
        "value": "LVT"
      },
      {
        "start": 51760,
        "end": 51760,
        "value": "LV"
      },
      {
        "start": 51761,
        "end": 51787,
        "value": "LVT"
      },
      {
        "start": 51788,
        "end": 51788,
        "value": "LV"
      },
      {
        "start": 51789,
        "end": 51815,
        "value": "LVT"
      },
      {
        "start": 51816,
        "end": 51816,
        "value": "LV"
      },
      {
        "start": 51817,
        "end": 51843,
        "value": "LVT"
      },
      {
        "start": 51844,
        "end": 51844,
        "value": "LV"
      },
      {
        "start": 51845,
        "end": 51871,
        "value": "LVT"
      },
      {
        "start": 51872,
        "end": 51872,
        "value": "LV"
      },
      {
        "start": 51873,
        "end": 51899,
        "value": "LVT"
      },
      {
        "start": 51900,
        "end": 51900,
        "value": "LV"
      },
      {
        "start": 51901,
        "end": 51927,
        "value": "LVT"
      },
      {
        "start": 51928,
        "end": 51928,
        "value": "LV"
      },
      {
        "start": 51929,
        "end": 51955,
        "value": "LVT"
      },
      {
        "start": 51956,
        "end": 51956,
        "value": "LV"
      },
      {
        "start": 51957,
        "end": 51983,
        "value": "LVT"
      },
      {
        "start": 51984,
        "end": 51984,
        "value": "LV"
      },
      {
        "start": 51985,
        "end": 52011,
        "value": "LVT"
      },
      {
        "start": 52012,
        "end": 52012,
        "value": "LV"
      },
      {
        "start": 52013,
        "end": 52039,
        "value": "LVT"
      },
      {
        "start": 52040,
        "end": 52040,
        "value": "LV"
      },
      {
        "start": 52041,
        "end": 52067,
        "value": "LVT"
      },
      {
        "start": 52068,
        "end": 52068,
        "value": "LV"
      },
      {
        "start": 52069,
        "end": 52095,
        "value": "LVT"
      },
      {
        "start": 52096,
        "end": 52096,
        "value": "LV"
      },
      {
        "start": 52097,
        "end": 52123,
        "value": "LVT"
      },
      {
        "start": 52124,
        "end": 52124,
        "value": "LV"
      },
      {
        "start": 52125,
        "end": 52151,
        "value": "LVT"
      },
      {
        "start": 52152,
        "end": 52152,
        "value": "LV"
      },
      {
        "start": 52153,
        "end": 52179,
        "value": "LVT"
      },
      {
        "start": 52180,
        "end": 52180,
        "value": "LV"
      },
      {
        "start": 52181,
        "end": 52207,
        "value": "LVT"
      },
      {
        "start": 52208,
        "end": 52208,
        "value": "LV"
      },
      {
        "start": 52209,
        "end": 52235,
        "value": "LVT"
      },
      {
        "start": 52236,
        "end": 52236,
        "value": "LV"
      },
      {
        "start": 52237,
        "end": 52263,
        "value": "LVT"
      },
      {
        "start": 52264,
        "end": 52264,
        "value": "LV"
      },
      {
        "start": 52265,
        "end": 52291,
        "value": "LVT"
      },
      {
        "start": 52292,
        "end": 52292,
        "value": "LV"
      },
      {
        "start": 52293,
        "end": 52319,
        "value": "LVT"
      },
      {
        "start": 52320,
        "end": 52320,
        "value": "LV"
      },
      {
        "start": 52321,
        "end": 52347,
        "value": "LVT"
      },
      {
        "start": 52348,
        "end": 52348,
        "value": "LV"
      },
      {
        "start": 52349,
        "end": 52375,
        "value": "LVT"
      },
      {
        "start": 52376,
        "end": 52376,
        "value": "LV"
      },
      {
        "start": 52377,
        "end": 52403,
        "value": "LVT"
      },
      {
        "start": 52404,
        "end": 52404,
        "value": "LV"
      },
      {
        "start": 52405,
        "end": 52431,
        "value": "LVT"
      },
      {
        "start": 52432,
        "end": 52432,
        "value": "LV"
      },
      {
        "start": 52433,
        "end": 52459,
        "value": "LVT"
      },
      {
        "start": 52460,
        "end": 52460,
        "value": "LV"
      },
      {
        "start": 52461,
        "end": 52487,
        "value": "LVT"
      },
      {
        "start": 52488,
        "end": 52488,
        "value": "LV"
      },
      {
        "start": 52489,
        "end": 52515,
        "value": "LVT"
      },
      {
        "start": 52516,
        "end": 52516,
        "value": "LV"
      },
      {
        "start": 52517,
        "end": 52543,
        "value": "LVT"
      },
      {
        "start": 52544,
        "end": 52544,
        "value": "LV"
      },
      {
        "start": 52545,
        "end": 52571,
        "value": "LVT"
      },
      {
        "start": 52572,
        "end": 52572,
        "value": "LV"
      },
      {
        "start": 52573,
        "end": 52599,
        "value": "LVT"
      },
      {
        "start": 52600,
        "end": 52600,
        "value": "LV"
      },
      {
        "start": 52601,
        "end": 52627,
        "value": "LVT"
      },
      {
        "start": 52628,
        "end": 52628,
        "value": "LV"
      },
      {
        "start": 52629,
        "end": 52655,
        "value": "LVT"
      },
      {
        "start": 52656,
        "end": 52656,
        "value": "LV"
      },
      {
        "start": 52657,
        "end": 52683,
        "value": "LVT"
      },
      {
        "start": 52684,
        "end": 52684,
        "value": "LV"
      },
      {
        "start": 52685,
        "end": 52711,
        "value": "LVT"
      },
      {
        "start": 52712,
        "end": 52712,
        "value": "LV"
      },
      {
        "start": 52713,
        "end": 52739,
        "value": "LVT"
      },
      {
        "start": 52740,
        "end": 52740,
        "value": "LV"
      },
      {
        "start": 52741,
        "end": 52767,
        "value": "LVT"
      },
      {
        "start": 52768,
        "end": 52768,
        "value": "LV"
      },
      {
        "start": 52769,
        "end": 52795,
        "value": "LVT"
      },
      {
        "start": 52796,
        "end": 52796,
        "value": "LV"
      },
      {
        "start": 52797,
        "end": 52823,
        "value": "LVT"
      },
      {
        "start": 52824,
        "end": 52824,
        "value": "LV"
      },
      {
        "start": 52825,
        "end": 52851,
        "value": "LVT"
      },
      {
        "start": 52852,
        "end": 52852,
        "value": "LV"
      },
      {
        "start": 52853,
        "end": 52879,
        "value": "LVT"
      },
      {
        "start": 52880,
        "end": 52880,
        "value": "LV"
      },
      {
        "start": 52881,
        "end": 52907,
        "value": "LVT"
      },
      {
        "start": 52908,
        "end": 52908,
        "value": "LV"
      },
      {
        "start": 52909,
        "end": 52935,
        "value": "LVT"
      },
      {
        "start": 52936,
        "end": 52936,
        "value": "LV"
      },
      {
        "start": 52937,
        "end": 52963,
        "value": "LVT"
      },
      {
        "start": 52964,
        "end": 52964,
        "value": "LV"
      },
      {
        "start": 52965,
        "end": 52991,
        "value": "LVT"
      },
      {
        "start": 52992,
        "end": 52992,
        "value": "LV"
      },
      {
        "start": 52993,
        "end": 53019,
        "value": "LVT"
      },
      {
        "start": 53020,
        "end": 53020,
        "value": "LV"
      },
      {
        "start": 53021,
        "end": 53047,
        "value": "LVT"
      },
      {
        "start": 53048,
        "end": 53048,
        "value": "LV"
      },
      {
        "start": 53049,
        "end": 53075,
        "value": "LVT"
      },
      {
        "start": 53076,
        "end": 53076,
        "value": "LV"
      },
      {
        "start": 53077,
        "end": 53103,
        "value": "LVT"
      },
      {
        "start": 53104,
        "end": 53104,
        "value": "LV"
      },
      {
        "start": 53105,
        "end": 53131,
        "value": "LVT"
      },
      {
        "start": 53132,
        "end": 53132,
        "value": "LV"
      },
      {
        "start": 53133,
        "end": 53159,
        "value": "LVT"
      },
      {
        "start": 53160,
        "end": 53160,
        "value": "LV"
      },
      {
        "start": 53161,
        "end": 53187,
        "value": "LVT"
      },
      {
        "start": 53188,
        "end": 53188,
        "value": "LV"
      },
      {
        "start": 53189,
        "end": 53215,
        "value": "LVT"
      },
      {
        "start": 53216,
        "end": 53216,
        "value": "LV"
      },
      {
        "start": 53217,
        "end": 53243,
        "value": "LVT"
      },
      {
        "start": 53244,
        "end": 53244,
        "value": "LV"
      },
      {
        "start": 53245,
        "end": 53271,
        "value": "LVT"
      },
      {
        "start": 53272,
        "end": 53272,
        "value": "LV"
      },
      {
        "start": 53273,
        "end": 53299,
        "value": "LVT"
      },
      {
        "start": 53300,
        "end": 53300,
        "value": "LV"
      },
      {
        "start": 53301,
        "end": 53327,
        "value": "LVT"
      },
      {
        "start": 53328,
        "end": 53328,
        "value": "LV"
      },
      {
        "start": 53329,
        "end": 53355,
        "value": "LVT"
      },
      {
        "start": 53356,
        "end": 53356,
        "value": "LV"
      },
      {
        "start": 53357,
        "end": 53383,
        "value": "LVT"
      },
      {
        "start": 53384,
        "end": 53384,
        "value": "LV"
      },
      {
        "start": 53385,
        "end": 53411,
        "value": "LVT"
      },
      {
        "start": 53412,
        "end": 53412,
        "value": "LV"
      },
      {
        "start": 53413,
        "end": 53439,
        "value": "LVT"
      },
      {
        "start": 53440,
        "end": 53440,
        "value": "LV"
      },
      {
        "start": 53441,
        "end": 53467,
        "value": "LVT"
      },
      {
        "start": 53468,
        "end": 53468,
        "value": "LV"
      },
      {
        "start": 53469,
        "end": 53495,
        "value": "LVT"
      },
      {
        "start": 53496,
        "end": 53496,
        "value": "LV"
      },
      {
        "start": 53497,
        "end": 53523,
        "value": "LVT"
      },
      {
        "start": 53524,
        "end": 53524,
        "value": "LV"
      },
      {
        "start": 53525,
        "end": 53551,
        "value": "LVT"
      },
      {
        "start": 53552,
        "end": 53552,
        "value": "LV"
      },
      {
        "start": 53553,
        "end": 53579,
        "value": "LVT"
      },
      {
        "start": 53580,
        "end": 53580,
        "value": "LV"
      },
      {
        "start": 53581,
        "end": 53607,
        "value": "LVT"
      },
      {
        "start": 53608,
        "end": 53608,
        "value": "LV"
      },
      {
        "start": 53609,
        "end": 53635,
        "value": "LVT"
      },
      {
        "start": 53636,
        "end": 53636,
        "value": "LV"
      },
      {
        "start": 53637,
        "end": 53663,
        "value": "LVT"
      },
      {
        "start": 53664,
        "end": 53664,
        "value": "LV"
      },
      {
        "start": 53665,
        "end": 53691,
        "value": "LVT"
      },
      {
        "start": 53692,
        "end": 53692,
        "value": "LV"
      },
      {
        "start": 53693,
        "end": 53719,
        "value": "LVT"
      },
      {
        "start": 53720,
        "end": 53720,
        "value": "LV"
      },
      {
        "start": 53721,
        "end": 53747,
        "value": "LVT"
      },
      {
        "start": 53748,
        "end": 53748,
        "value": "LV"
      },
      {
        "start": 53749,
        "end": 53775,
        "value": "LVT"
      },
      {
        "start": 53776,
        "end": 53776,
        "value": "LV"
      },
      {
        "start": 53777,
        "end": 53803,
        "value": "LVT"
      },
      {
        "start": 53804,
        "end": 53804,
        "value": "LV"
      },
      {
        "start": 53805,
        "end": 53831,
        "value": "LVT"
      },
      {
        "start": 53832,
        "end": 53832,
        "value": "LV"
      },
      {
        "start": 53833,
        "end": 53859,
        "value": "LVT"
      },
      {
        "start": 53860,
        "end": 53860,
        "value": "LV"
      },
      {
        "start": 53861,
        "end": 53887,
        "value": "LVT"
      },
      {
        "start": 53888,
        "end": 53888,
        "value": "LV"
      },
      {
        "start": 53889,
        "end": 53915,
        "value": "LVT"
      },
      {
        "start": 53916,
        "end": 53916,
        "value": "LV"
      },
      {
        "start": 53917,
        "end": 53943,
        "value": "LVT"
      },
      {
        "start": 53944,
        "end": 53944,
        "value": "LV"
      },
      {
        "start": 53945,
        "end": 53971,
        "value": "LVT"
      },
      {
        "start": 53972,
        "end": 53972,
        "value": "LV"
      },
      {
        "start": 53973,
        "end": 53999,
        "value": "LVT"
      },
      {
        "start": 54000,
        "end": 54000,
        "value": "LV"
      },
      {
        "start": 54001,
        "end": 54027,
        "value": "LVT"
      },
      {
        "start": 54028,
        "end": 54028,
        "value": "LV"
      },
      {
        "start": 54029,
        "end": 54055,
        "value": "LVT"
      },
      {
        "start": 54056,
        "end": 54056,
        "value": "LV"
      },
      {
        "start": 54057,
        "end": 54083,
        "value": "LVT"
      },
      {
        "start": 54084,
        "end": 54084,
        "value": "LV"
      },
      {
        "start": 54085,
        "end": 54111,
        "value": "LVT"
      },
      {
        "start": 54112,
        "end": 54112,
        "value": "LV"
      },
      {
        "start": 54113,
        "end": 54139,
        "value": "LVT"
      },
      {
        "start": 54140,
        "end": 54140,
        "value": "LV"
      },
      {
        "start": 54141,
        "end": 54167,
        "value": "LVT"
      },
      {
        "start": 54168,
        "end": 54168,
        "value": "LV"
      },
      {
        "start": 54169,
        "end": 54195,
        "value": "LVT"
      },
      {
        "start": 54196,
        "end": 54196,
        "value": "LV"
      },
      {
        "start": 54197,
        "end": 54223,
        "value": "LVT"
      },
      {
        "start": 54224,
        "end": 54224,
        "value": "LV"
      },
      {
        "start": 54225,
        "end": 54251,
        "value": "LVT"
      },
      {
        "start": 54252,
        "end": 54252,
        "value": "LV"
      },
      {
        "start": 54253,
        "end": 54279,
        "value": "LVT"
      },
      {
        "start": 54280,
        "end": 54280,
        "value": "LV"
      },
      {
        "start": 54281,
        "end": 54307,
        "value": "LVT"
      },
      {
        "start": 54308,
        "end": 54308,
        "value": "LV"
      },
      {
        "start": 54309,
        "end": 54335,
        "value": "LVT"
      },
      {
        "start": 54336,
        "end": 54336,
        "value": "LV"
      },
      {
        "start": 54337,
        "end": 54363,
        "value": "LVT"
      },
      {
        "start": 54364,
        "end": 54364,
        "value": "LV"
      },
      {
        "start": 54365,
        "end": 54391,
        "value": "LVT"
      },
      {
        "start": 54392,
        "end": 54392,
        "value": "LV"
      },
      {
        "start": 54393,
        "end": 54419,
        "value": "LVT"
      },
      {
        "start": 54420,
        "end": 54420,
        "value": "LV"
      },
      {
        "start": 54421,
        "end": 54447,
        "value": "LVT"
      },
      {
        "start": 54448,
        "end": 54448,
        "value": "LV"
      },
      {
        "start": 54449,
        "end": 54475,
        "value": "LVT"
      },
      {
        "start": 54476,
        "end": 54476,
        "value": "LV"
      },
      {
        "start": 54477,
        "end": 54503,
        "value": "LVT"
      },
      {
        "start": 54504,
        "end": 54504,
        "value": "LV"
      },
      {
        "start": 54505,
        "end": 54531,
        "value": "LVT"
      },
      {
        "start": 54532,
        "end": 54532,
        "value": "LV"
      },
      {
        "start": 54533,
        "end": 54559,
        "value": "LVT"
      },
      {
        "start": 54560,
        "end": 54560,
        "value": "LV"
      },
      {
        "start": 54561,
        "end": 54587,
        "value": "LVT"
      },
      {
        "start": 54588,
        "end": 54588,
        "value": "LV"
      },
      {
        "start": 54589,
        "end": 54615,
        "value": "LVT"
      },
      {
        "start": 54616,
        "end": 54616,
        "value": "LV"
      },
      {
        "start": 54617,
        "end": 54643,
        "value": "LVT"
      },
      {
        "start": 54644,
        "end": 54644,
        "value": "LV"
      },
      {
        "start": 54645,
        "end": 54671,
        "value": "LVT"
      },
      {
        "start": 54672,
        "end": 54672,
        "value": "LV"
      },
      {
        "start": 54673,
        "end": 54699,
        "value": "LVT"
      },
      {
        "start": 54700,
        "end": 54700,
        "value": "LV"
      },
      {
        "start": 54701,
        "end": 54727,
        "value": "LVT"
      },
      {
        "start": 54728,
        "end": 54728,
        "value": "LV"
      },
      {
        "start": 54729,
        "end": 54755,
        "value": "LVT"
      },
      {
        "start": 54756,
        "end": 54756,
        "value": "LV"
      },
      {
        "start": 54757,
        "end": 54783,
        "value": "LVT"
      },
      {
        "start": 54784,
        "end": 54784,
        "value": "LV"
      },
      {
        "start": 54785,
        "end": 54811,
        "value": "LVT"
      },
      {
        "start": 54812,
        "end": 54812,
        "value": "LV"
      },
      {
        "start": 54813,
        "end": 54839,
        "value": "LVT"
      },
      {
        "start": 54840,
        "end": 54840,
        "value": "LV"
      },
      {
        "start": 54841,
        "end": 54867,
        "value": "LVT"
      },
      {
        "start": 54868,
        "end": 54868,
        "value": "LV"
      },
      {
        "start": 54869,
        "end": 54895,
        "value": "LVT"
      },
      {
        "start": 54896,
        "end": 54896,
        "value": "LV"
      },
      {
        "start": 54897,
        "end": 54923,
        "value": "LVT"
      },
      {
        "start": 54924,
        "end": 54924,
        "value": "LV"
      },
      {
        "start": 54925,
        "end": 54951,
        "value": "LVT"
      },
      {
        "start": 54952,
        "end": 54952,
        "value": "LV"
      },
      {
        "start": 54953,
        "end": 54979,
        "value": "LVT"
      },
      {
        "start": 54980,
        "end": 54980,
        "value": "LV"
      },
      {
        "start": 54981,
        "end": 55007,
        "value": "LVT"
      },
      {
        "start": 55008,
        "end": 55008,
        "value": "LV"
      },
      {
        "start": 55009,
        "end": 55035,
        "value": "LVT"
      },
      {
        "start": 55036,
        "end": 55036,
        "value": "LV"
      },
      {
        "start": 55037,
        "end": 55063,
        "value": "LVT"
      },
      {
        "start": 55064,
        "end": 55064,
        "value": "LV"
      },
      {
        "start": 55065,
        "end": 55091,
        "value": "LVT"
      },
      {
        "start": 55092,
        "end": 55092,
        "value": "LV"
      },
      {
        "start": 55093,
        "end": 55119,
        "value": "LVT"
      },
      {
        "start": 55120,
        "end": 55120,
        "value": "LV"
      },
      {
        "start": 55121,
        "end": 55147,
        "value": "LVT"
      },
      {
        "start": 55148,
        "end": 55148,
        "value": "LV"
      },
      {
        "start": 55149,
        "end": 55175,
        "value": "LVT"
      },
      {
        "start": 55176,
        "end": 55176,
        "value": "LV"
      },
      {
        "start": 55177,
        "end": 55203,
        "value": "LVT"
      },
      {
        "start": 55216,
        "end": 55238,
        "value": "V"
      },
      {
        "start": 55243,
        "end": 55291,
        "value": "T"
      },
      {
        "start": 64286,
        "end": 64286,
        "value": "Extend"
      },
      {
        "start": 65024,
        "end": 65039,
        "value": "Extend"
      },
      {
        "start": 65056,
        "end": 65071,
        "value": "Extend"
      },
      {
        "start": 65279,
        "end": 65279,
        "value": "Control"
      },
      {
        "start": 65438,
        "end": 65439,
        "value": "Extend"
      },
      {
        "start": 65520,
        "end": 65531,
        "value": "Control"
      },
      {
        "start": 66045,
        "end": 66045,
        "value": "Extend"
      },
      {
        "start": 66272,
        "end": 66272,
        "value": "Extend"
      },
      {
        "start": 66422,
        "end": 66426,
        "value": "Extend"
      },
      {
        "start": 68097,
        "end": 68099,
        "value": "Extend"
      },
      {
        "start": 68101,
        "end": 68102,
        "value": "Extend"
      },
      {
        "start": 68108,
        "end": 68111,
        "value": "Extend"
      },
      {
        "start": 68152,
        "end": 68154,
        "value": "Extend"
      },
      {
        "start": 68159,
        "end": 68159,
        "value": "Extend"
      },
      {
        "start": 68325,
        "end": 68326,
        "value": "Extend"
      },
      {
        "start": 68900,
        "end": 68903,
        "value": "Extend"
      },
      {
        "start": 68969,
        "end": 68973,
        "value": "Extend"
      },
      {
        "start": 69291,
        "end": 69292,
        "value": "Extend"
      },
      {
        "start": 69370,
        "end": 69375,
        "value": "Extend"
      },
      {
        "start": 69446,
        "end": 69456,
        "value": "Extend"
      },
      {
        "start": 69506,
        "end": 69509,
        "value": "Extend"
      },
      {
        "start": 69632,
        "end": 69632,
        "value": "SpacingMark"
      },
      {
        "start": 69633,
        "end": 69633,
        "value": "Extend"
      },
      {
        "start": 69634,
        "end": 69634,
        "value": "SpacingMark"
      },
      {
        "start": 69688,
        "end": 69702,
        "value": "Extend"
      },
      {
        "start": 69744,
        "end": 69744,
        "value": "Extend"
      },
      {
        "start": 69747,
        "end": 69748,
        "value": "Extend"
      },
      {
        "start": 69759,
        "end": 69761,
        "value": "Extend"
      },
      {
        "start": 69762,
        "end": 69762,
        "value": "SpacingMark"
      },
      {
        "start": 69808,
        "end": 69810,
        "value": "SpacingMark"
      },
      {
        "start": 69811,
        "end": 69814,
        "value": "Extend"
      },
      {
        "start": 69815,
        "end": 69816,
        "value": "SpacingMark"
      },
      {
        "start": 69817,
        "end": 69818,
        "value": "Extend"
      },
      {
        "start": 69821,
        "end": 69821,
        "value": "Prepend"
      },
      {
        "start": 69826,
        "end": 69826,
        "value": "Extend"
      },
      {
        "start": 69837,
        "end": 69837,
        "value": "Prepend"
      },
      {
        "start": 69888,
        "end": 69890,
        "value": "Extend"
      },
      {
        "start": 69927,
        "end": 69931,
        "value": "Extend"
      },
      {
        "start": 69932,
        "end": 69932,
        "value": "SpacingMark"
      },
      {
        "start": 69933,
        "end": 69940,
        "value": "Extend"
      },
      {
        "start": 69957,
        "end": 69958,
        "value": "SpacingMark"
      },
      {
        "start": 70003,
        "end": 70003,
        "value": "Extend"
      },
      {
        "start": 70016,
        "end": 70017,
        "value": "Extend"
      },
      {
        "start": 70018,
        "end": 70018,
        "value": "SpacingMark"
      },
      {
        "start": 70067,
        "end": 70069,
        "value": "SpacingMark"
      },
      {
        "start": 70070,
        "end": 70078,
        "value": "Extend"
      },
      {
        "start": 70079,
        "end": 70079,
        "value": "SpacingMark"
      },
      {
        "start": 70080,
        "end": 70080,
        "value": "Extend"
      },
      {
        "start": 70082,
        "end": 70083,
        "value": "Prepend"
      },
      {
        "start": 70089,
        "end": 70092,
        "value": "Extend"
      },
      {
        "start": 70094,
        "end": 70094,
        "value": "SpacingMark"
      },
      {
        "start": 70095,
        "end": 70095,
        "value": "Extend"
      },
      {
        "start": 70188,
        "end": 70190,
        "value": "SpacingMark"
      },
      {
        "start": 70191,
        "end": 70193,
        "value": "Extend"
      },
      {
        "start": 70194,
        "end": 70195,
        "value": "SpacingMark"
      },
      {
        "start": 70196,
        "end": 70199,
        "value": "Extend"
      },
      {
        "start": 70206,
        "end": 70206,
        "value": "Extend"
      },
      {
        "start": 70209,
        "end": 70209,
        "value": "Extend"
      },
      {
        "start": 70367,
        "end": 70367,
        "value": "Extend"
      },
      {
        "start": 70368,
        "end": 70370,
        "value": "SpacingMark"
      },
      {
        "start": 70371,
        "end": 70378,
        "value": "Extend"
      },
      {
        "start": 70400,
        "end": 70401,
        "value": "Extend"
      },
      {
        "start": 70402,
        "end": 70403,
        "value": "SpacingMark"
      },
      {
        "start": 70459,
        "end": 70460,
        "value": "Extend"
      },
      {
        "start": 70462,
        "end": 70462,
        "value": "Extend"
      },
      {
        "start": 70463,
        "end": 70463,
        "value": "SpacingMark"
      },
      {
        "start": 70464,
        "end": 70464,
        "value": "Extend"
      },
      {
        "start": 70465,
        "end": 70468,
        "value": "SpacingMark"
      },
      {
        "start": 70471,
        "end": 70472,
        "value": "SpacingMark"
      },
      {
        "start": 70475,
        "end": 70476,
        "value": "SpacingMark"
      },
      {
        "start": 70477,
        "end": 70477,
        "value": "Extend"
      },
      {
        "start": 70487,
        "end": 70487,
        "value": "Extend"
      },
      {
        "start": 70498,
        "end": 70499,
        "value": "SpacingMark"
      },
      {
        "start": 70502,
        "end": 70508,
        "value": "Extend"
      },
      {
        "start": 70512,
        "end": 70516,
        "value": "Extend"
      },
      {
        "start": 70584,
        "end": 70584,
        "value": "Extend"
      },
      {
        "start": 70585,
        "end": 70586,
        "value": "SpacingMark"
      },
      {
        "start": 70587,
        "end": 70592,
        "value": "Extend"
      },
      {
        "start": 70594,
        "end": 70594,
        "value": "Extend"
      },
      {
        "start": 70597,
        "end": 70597,
        "value": "Extend"
      },
      {
        "start": 70599,
        "end": 70601,
        "value": "Extend"
      },
      {
        "start": 70602,
        "end": 70602,
        "value": "SpacingMark"
      },
      {
        "start": 70604,
        "end": 70605,
        "value": "SpacingMark"
      },
      {
        "start": 70606,
        "end": 70608,
        "value": "Extend"
      },
      {
        "start": 70609,
        "end": 70609,
        "value": "Prepend"
      },
      {
        "start": 70610,
        "end": 70610,
        "value": "Extend"
      },
      {
        "start": 70625,
        "end": 70626,
        "value": "Extend"
      },
      {
        "start": 70709,
        "end": 70711,
        "value": "SpacingMark"
      },
      {
        "start": 70712,
        "end": 70719,
        "value": "Extend"
      },
      {
        "start": 70720,
        "end": 70721,
        "value": "SpacingMark"
      },
      {
        "start": 70722,
        "end": 70724,
        "value": "Extend"
      },
      {
        "start": 70725,
        "end": 70725,
        "value": "SpacingMark"
      },
      {
        "start": 70726,
        "end": 70726,
        "value": "Extend"
      },
      {
        "start": 70750,
        "end": 70750,
        "value": "Extend"
      },
      {
        "start": 70832,
        "end": 70832,
        "value": "Extend"
      },
      {
        "start": 70833,
        "end": 70834,
        "value": "SpacingMark"
      },
      {
        "start": 70835,
        "end": 70840,
        "value": "Extend"
      },
      {
        "start": 70841,
        "end": 70841,
        "value": "SpacingMark"
      },
      {
        "start": 70842,
        "end": 70842,
        "value": "Extend"
      },
      {
        "start": 70843,
        "end": 70844,
        "value": "SpacingMark"
      },
      {
        "start": 70845,
        "end": 70845,
        "value": "Extend"
      },
      {
        "start": 70846,
        "end": 70846,
        "value": "SpacingMark"
      },
      {
        "start": 70847,
        "end": 70848,
        "value": "Extend"
      },
      {
        "start": 70849,
        "end": 70849,
        "value": "SpacingMark"
      },
      {
        "start": 70850,
        "end": 70851,
        "value": "Extend"
      },
      {
        "start": 71087,
        "end": 71087,
        "value": "Extend"
      },
      {
        "start": 71088,
        "end": 71089,
        "value": "SpacingMark"
      },
      {
        "start": 71090,
        "end": 71093,
        "value": "Extend"
      },
      {
        "start": 71096,
        "end": 71099,
        "value": "SpacingMark"
      },
      {
        "start": 71100,
        "end": 71101,
        "value": "Extend"
      },
      {
        "start": 71102,
        "end": 71102,
        "value": "SpacingMark"
      },
      {
        "start": 71103,
        "end": 71104,
        "value": "Extend"
      },
      {
        "start": 71132,
        "end": 71133,
        "value": "Extend"
      },
      {
        "start": 71216,
        "end": 71218,
        "value": "SpacingMark"
      },
      {
        "start": 71219,
        "end": 71226,
        "value": "Extend"
      },
      {
        "start": 71227,
        "end": 71228,
        "value": "SpacingMark"
      },
      {
        "start": 71229,
        "end": 71229,
        "value": "Extend"
      },
      {
        "start": 71230,
        "end": 71230,
        "value": "SpacingMark"
      },
      {
        "start": 71231,
        "end": 71232,
        "value": "Extend"
      },
      {
        "start": 71339,
        "end": 71339,
        "value": "Extend"
      },
      {
        "start": 71340,
        "end": 71340,
        "value": "SpacingMark"
      },
      {
        "start": 71341,
        "end": 71341,
        "value": "Extend"
      },
      {
        "start": 71342,
        "end": 71343,
        "value": "SpacingMark"
      },
      {
        "start": 71344,
        "end": 71351,
        "value": "Extend"
      },
      {
        "start": 71453,
        "end": 71453,
        "value": "Extend"
      },
      {
        "start": 71454,
        "end": 71454,
        "value": "SpacingMark"
      },
      {
        "start": 71455,
        "end": 71455,
        "value": "Extend"
      },
      {
        "start": 71458,
        "end": 71461,
        "value": "Extend"
      },
      {
        "start": 71462,
        "end": 71462,
        "value": "SpacingMark"
      },
      {
        "start": 71463,
        "end": 71467,
        "value": "Extend"
      },
      {
        "start": 71724,
        "end": 71726,
        "value": "SpacingMark"
      },
      {
        "start": 71727,
        "end": 71735,
        "value": "Extend"
      },
      {
        "start": 71736,
        "end": 71736,
        "value": "SpacingMark"
      },
      {
        "start": 71737,
        "end": 71738,
        "value": "Extend"
      },
      {
        "start": 71984,
        "end": 71984,
        "value": "Extend"
      },
      {
        "start": 71985,
        "end": 71989,
        "value": "SpacingMark"
      },
      {
        "start": 71991,
        "end": 71992,
        "value": "SpacingMark"
      },
      {
        "start": 71995,
        "end": 71998,
        "value": "Extend"
      },
      {
        "start": 71999,
        "end": 71999,
        "value": "Prepend"
      },
      {
        "start": 72000,
        "end": 72000,
        "value": "SpacingMark"
      },
      {
        "start": 72001,
        "end": 72001,
        "value": "Prepend"
      },
      {
        "start": 72002,
        "end": 72002,
        "value": "SpacingMark"
      },
      {
        "start": 72003,
        "end": 72003,
        "value": "Extend"
      },
      {
        "start": 72145,
        "end": 72147,
        "value": "SpacingMark"
      },
      {
        "start": 72148,
        "end": 72151,
        "value": "Extend"
      },
      {
        "start": 72154,
        "end": 72155,
        "value": "Extend"
      },
      {
        "start": 72156,
        "end": 72159,
        "value": "SpacingMark"
      },
      {
        "start": 72160,
        "end": 72160,
        "value": "Extend"
      },
      {
        "start": 72164,
        "end": 72164,
        "value": "SpacingMark"
      },
      {
        "start": 72193,
        "end": 72202,
        "value": "Extend"
      },
      {
        "start": 72243,
        "end": 72248,
        "value": "Extend"
      },
      {
        "start": 72249,
        "end": 72249,
        "value": "SpacingMark"
      },
      {
        "start": 72251,
        "end": 72254,
        "value": "Extend"
      },
      {
        "start": 72263,
        "end": 72263,
        "value": "Extend"
      },
      {
        "start": 72273,
        "end": 72278,
        "value": "Extend"
      },
      {
        "start": 72279,
        "end": 72280,
        "value": "SpacingMark"
      },
      {
        "start": 72281,
        "end": 72283,
        "value": "Extend"
      },
      {
        "start": 72324,
        "end": 72329,
        "value": "Prepend"
      },
      {
        "start": 72330,
        "end": 72342,
        "value": "Extend"
      },
      {
        "start": 72343,
        "end": 72343,
        "value": "SpacingMark"
      },
      {
        "start": 72344,
        "end": 72345,
        "value": "Extend"
      },
      {
        "start": 72544,
        "end": 72544,
        "value": "Extend"
      },
      {
        "start": 72545,
        "end": 72545,
        "value": "SpacingMark"
      },
      {
        "start": 72546,
        "end": 72548,
        "value": "Extend"
      },
      {
        "start": 72549,
        "end": 72549,
        "value": "SpacingMark"
      },
      {
        "start": 72550,
        "end": 72550,
        "value": "Extend"
      },
      {
        "start": 72551,
        "end": 72551,
        "value": "SpacingMark"
      },
      {
        "start": 72751,
        "end": 72751,
        "value": "SpacingMark"
      },
      {
        "start": 72752,
        "end": 72758,
        "value": "Extend"
      },
      {
        "start": 72760,
        "end": 72765,
        "value": "Extend"
      },
      {
        "start": 72766,
        "end": 72766,
        "value": "SpacingMark"
      },
      {
        "start": 72767,
        "end": 72767,
        "value": "Extend"
      },
      {
        "start": 72850,
        "end": 72871,
        "value": "Extend"
      },
      {
        "start": 72873,
        "end": 72873,
        "value": "SpacingMark"
      },
      {
        "start": 72874,
        "end": 72880,
        "value": "Extend"
      },
      {
        "start": 72881,
        "end": 72881,
        "value": "SpacingMark"
      },
      {
        "start": 72882,
        "end": 72883,
        "value": "Extend"
      },
      {
        "start": 72884,
        "end": 72884,
        "value": "SpacingMark"
      },
      {
        "start": 72885,
        "end": 72886,
        "value": "Extend"
      },
      {
        "start": 73009,
        "end": 73014,
        "value": "Extend"
      },
      {
        "start": 73018,
        "end": 73018,
        "value": "Extend"
      },
      {
        "start": 73020,
        "end": 73021,
        "value": "Extend"
      },
      {
        "start": 73023,
        "end": 73029,
        "value": "Extend"
      },
      {
        "start": 73030,
        "end": 73030,
        "value": "Prepend"
      },
      {
        "start": 73031,
        "end": 73031,
        "value": "Extend"
      },
      {
        "start": 73098,
        "end": 73102,
        "value": "SpacingMark"
      },
      {
        "start": 73104,
        "end": 73105,
        "value": "Extend"
      },
      {
        "start": 73107,
        "end": 73108,
        "value": "SpacingMark"
      },
      {
        "start": 73109,
        "end": 73109,
        "value": "Extend"
      },
      {
        "start": 73110,
        "end": 73110,
        "value": "SpacingMark"
      },
      {
        "start": 73111,
        "end": 73111,
        "value": "Extend"
      },
      {
        "start": 73459,
        "end": 73460,
        "value": "Extend"
      },
      {
        "start": 73461,
        "end": 73462,
        "value": "SpacingMark"
      },
      {
        "start": 73472,
        "end": 73473,
        "value": "Extend"
      },
      {
        "start": 73474,
        "end": 73474,
        "value": "Prepend"
      },
      {
        "start": 73475,
        "end": 73475,
        "value": "SpacingMark"
      },
      {
        "start": 73524,
        "end": 73525,
        "value": "SpacingMark"
      },
      {
        "start": 73526,
        "end": 73530,
        "value": "Extend"
      },
      {
        "start": 73534,
        "end": 73535,
        "value": "SpacingMark"
      },
      {
        "start": 73536,
        "end": 73538,
        "value": "Extend"
      },
      {
        "start": 73562,
        "end": 73562,
        "value": "Extend"
      },
      {
        "start": 78896,
        "end": 78911,
        "value": "Control"
      },
      {
        "start": 78912,
        "end": 78912,
        "value": "Extend"
      },
      {
        "start": 78919,
        "end": 78933,
        "value": "Extend"
      },
      {
        "start": 90398,
        "end": 90409,
        "value": "Extend"
      },
      {
        "start": 90410,
        "end": 90412,
        "value": "SpacingMark"
      },
      {
        "start": 90413,
        "end": 90415,
        "value": "Extend"
      },
      {
        "start": 92912,
        "end": 92916,
        "value": "Extend"
      },
      {
        "start": 92976,
        "end": 92982,
        "value": "Extend"
      },
      {
        "start": 93539,
        "end": 93539,
        "value": "V"
      },
      {
        "start": 93543,
        "end": 93546,
        "value": "V"
      },
      {
        "start": 94031,
        "end": 94031,
        "value": "Extend"
      },
      {
        "start": 94033,
        "end": 94087,
        "value": "SpacingMark"
      },
      {
        "start": 94095,
        "end": 94098,
        "value": "Extend"
      },
      {
        "start": 94180,
        "end": 94180,
        "value": "Extend"
      },
      {
        "start": 94192,
        "end": 94193,
        "value": "Extend"
      },
      {
        "start": 113821,
        "end": 113822,
        "value": "Extend"
      },
      {
        "start": 113824,
        "end": 113827,
        "value": "Control"
      },
      {
        "start": 118528,
        "end": 118573,
        "value": "Extend"
      },
      {
        "start": 118576,
        "end": 118598,
        "value": "Extend"
      },
      {
        "start": 119141,
        "end": 119145,
        "value": "Extend"
      },
      {
        "start": 119149,
        "end": 119154,
        "value": "Extend"
      },
      {
        "start": 119155,
        "end": 119162,
        "value": "Control"
      },
      {
        "start": 119163,
        "end": 119170,
        "value": "Extend"
      },
      {
        "start": 119173,
        "end": 119179,
        "value": "Extend"
      },
      {
        "start": 119210,
        "end": 119213,
        "value": "Extend"
      },
      {
        "start": 119362,
        "end": 119364,
        "value": "Extend"
      },
      {
        "start": 121344,
        "end": 121398,
        "value": "Extend"
      },
      {
        "start": 121403,
        "end": 121452,
        "value": "Extend"
      },
      {
        "start": 121461,
        "end": 121461,
        "value": "Extend"
      },
      {
        "start": 121476,
        "end": 121476,
        "value": "Extend"
      },
      {
        "start": 121499,
        "end": 121503,
        "value": "Extend"
      },
      {
        "start": 121505,
        "end": 121519,
        "value": "Extend"
      },
      {
        "start": 122880,
        "end": 122886,
        "value": "Extend"
      },
      {
        "start": 122888,
        "end": 122904,
        "value": "Extend"
      },
      {
        "start": 122907,
        "end": 122913,
        "value": "Extend"
      },
      {
        "start": 122915,
        "end": 122916,
        "value": "Extend"
      },
      {
        "start": 122918,
        "end": 122922,
        "value": "Extend"
      },
      {
        "start": 123023,
        "end": 123023,
        "value": "Extend"
      },
      {
        "start": 123184,
        "end": 123190,
        "value": "Extend"
      },
      {
        "start": 123566,
        "end": 123566,
        "value": "Extend"
      },
      {
        "start": 123628,
        "end": 123631,
        "value": "Extend"
      },
      {
        "start": 124140,
        "end": 124143,
        "value": "Extend"
      },
      {
        "start": 124398,
        "end": 124399,
        "value": "Extend"
      },
      {
        "start": 124643,
        "end": 124643,
        "value": "Extend"
      },
      {
        "start": 124646,
        "end": 124646,
        "value": "Extend"
      },
      {
        "start": 124654,
        "end": 124655,
        "value": "Extend"
      },
      {
        "start": 124661,
        "end": 124661,
        "value": "Extend"
      },
      {
        "start": 125136,
        "end": 125142,
        "value": "Extend"
      },
      {
        "start": 125252,
        "end": 125258,
        "value": "Extend"
      },
      {
        "start": 127462,
        "end": 127487,
        "value": "Regional_Indicator"
      },
      {
        "start": 127995,
        "end": 127999,
        "value": "Extend"
      },
      {
        "start": 917504,
        "end": 917535,
        "value": "Control"
      },
      {
        "start": 917536,
        "end": 917631,
        "value": "Extend"
      },
      {
        "start": 917632,
        "end": 917759,
        "value": "Control"
      },
      {
        "start": 917760,
        "end": 917999,
        "value": "Extend"
      },
      {
        "start": 918000,
        "end": 921599,
        "value": "Control"
      }
    ],
    "eastAsianWidth": [
      {
        "start": 0,
        "end": 31,
        "value": "N"
      },
      {
        "start": 32,
        "end": 126,
        "value": "Na"
      },
      {
        "start": 127,
        "end": 160,
        "value": "N"
      },
      {
        "start": 161,
        "end": 161,
        "value": "A"
      },
      {
        "start": 162,
        "end": 163,
        "value": "Na"
      },
      {
        "start": 164,
        "end": 164,
        "value": "A"
      },
      {
        "start": 165,
        "end": 166,
        "value": "Na"
      },
      {
        "start": 167,
        "end": 168,
        "value": "A"
      },
      {
        "start": 169,
        "end": 169,
        "value": "N"
      },
      {
        "start": 170,
        "end": 170,
        "value": "A"
      },
      {
        "start": 171,
        "end": 171,
        "value": "N"
      },
      {
        "start": 172,
        "end": 172,
        "value": "Na"
      },
      {
        "start": 173,
        "end": 174,
        "value": "A"
      },
      {
        "start": 175,
        "end": 175,
        "value": "Na"
      },
      {
        "start": 176,
        "end": 180,
        "value": "A"
      },
      {
        "start": 181,
        "end": 181,
        "value": "N"
      },
      {
        "start": 182,
        "end": 186,
        "value": "A"
      },
      {
        "start": 187,
        "end": 187,
        "value": "N"
      },
      {
        "start": 188,
        "end": 191,
        "value": "A"
      },
      {
        "start": 192,
        "end": 197,
        "value": "N"
      },
      {
        "start": 198,
        "end": 198,
        "value": "A"
      },
      {
        "start": 199,
        "end": 207,
        "value": "N"
      },
      {
        "start": 208,
        "end": 208,
        "value": "A"
      },
      {
        "start": 209,
        "end": 214,
        "value": "N"
      },
      {
        "start": 215,
        "end": 216,
        "value": "A"
      },
      {
        "start": 217,
        "end": 221,
        "value": "N"
      },
      {
        "start": 222,
        "end": 225,
        "value": "A"
      },
      {
        "start": 226,
        "end": 229,
        "value": "N"
      },
      {
        "start": 230,
        "end": 230,
        "value": "A"
      },
      {
        "start": 231,
        "end": 231,
        "value": "N"
      },
      {
        "start": 232,
        "end": 234,
        "value": "A"
      },
      {
        "start": 235,
        "end": 235,
        "value": "N"
      },
      {
        "start": 236,
        "end": 237,
        "value": "A"
      },
      {
        "start": 238,
        "end": 239,
        "value": "N"
      },
      {
        "start": 240,
        "end": 240,
        "value": "A"
      },
      {
        "start": 241,
        "end": 241,
        "value": "N"
      },
      {
        "start": 242,
        "end": 243,
        "value": "A"
      },
      {
        "start": 244,
        "end": 246,
        "value": "N"
      },
      {
        "start": 247,
        "end": 250,
        "value": "A"
      },
      {
        "start": 251,
        "end": 251,
        "value": "N"
      },
      {
        "start": 252,
        "end": 252,
        "value": "A"
      },
      {
        "start": 253,
        "end": 253,
        "value": "N"
      },
      {
        "start": 254,
        "end": 254,
        "value": "A"
      },
      {
        "start": 255,
        "end": 256,
        "value": "N"
      },
      {
        "start": 257,
        "end": 257,
        "value": "A"
      },
      {
        "start": 258,
        "end": 272,
        "value": "N"
      },
      {
        "start": 273,
        "end": 273,
        "value": "A"
      },
      {
        "start": 274,
        "end": 274,
        "value": "N"
      },
      {
        "start": 275,
        "end": 275,
        "value": "A"
      },
      {
        "start": 276,
        "end": 282,
        "value": "N"
      },
      {
        "start": 283,
        "end": 283,
        "value": "A"
      },
      {
        "start": 284,
        "end": 293,
        "value": "N"
      },
      {
        "start": 294,
        "end": 295,
        "value": "A"
      },
      {
        "start": 296,
        "end": 298,
        "value": "N"
      },
      {
        "start": 299,
        "end": 299,
        "value": "A"
      },
      {
        "start": 300,
        "end": 304,
        "value": "N"
      },
      {
        "start": 305,
        "end": 307,
        "value": "A"
      },
      {
        "start": 308,
        "end": 311,
        "value": "N"
      },
      {
        "start": 312,
        "end": 312,
        "value": "A"
      },
      {
        "start": 313,
        "end": 318,
        "value": "N"
      },
      {
        "start": 319,
        "end": 322,
        "value": "A"
      },
      {
        "start": 323,
        "end": 323,
        "value": "N"
      },
      {
        "start": 324,
        "end": 324,
        "value": "A"
      },
      {
        "start": 325,
        "end": 327,
        "value": "N"
      },
      {
        "start": 328,
        "end": 331,
        "value": "A"
      },
      {
        "start": 332,
        "end": 332,
        "value": "N"
      },
      {
        "start": 333,
        "end": 333,
        "value": "A"
      },
      {
        "start": 334,
        "end": 337,
        "value": "N"
      },
      {
        "start": 338,
        "end": 339,
        "value": "A"
      },
      {
        "start": 340,
        "end": 357,
        "value": "N"
      },
      {
        "start": 358,
        "end": 359,
        "value": "A"
      },
      {
        "start": 360,
        "end": 362,
        "value": "N"
      },
      {
        "start": 363,
        "end": 363,
        "value": "A"
      },
      {
        "start": 364,
        "end": 461,
        "value": "N"
      },
      {
        "start": 462,
        "end": 462,
        "value": "A"
      },
      {
        "start": 463,
        "end": 463,
        "value": "N"
      },
      {
        "start": 464,
        "end": 464,
        "value": "A"
      },
      {
        "start": 465,
        "end": 465,
        "value": "N"
      },
      {
        "start": 466,
        "end": 466,
        "value": "A"
      },
      {
        "start": 467,
        "end": 467,
        "value": "N"
      },
      {
        "start": 468,
        "end": 468,
        "value": "A"
      },
      {
        "start": 469,
        "end": 469,
        "value": "N"
      },
      {
        "start": 470,
        "end": 470,
        "value": "A"
      },
      {
        "start": 471,
        "end": 471,
        "value": "N"
      },
      {
        "start": 472,
        "end": 472,
        "value": "A"
      },
      {
        "start": 473,
        "end": 473,
        "value": "N"
      },
      {
        "start": 474,
        "end": 474,
        "value": "A"
      },
      {
        "start": 475,
        "end": 475,
        "value": "N"
      },
      {
        "start": 476,
        "end": 476,
        "value": "A"
      },
      {
        "start": 477,
        "end": 592,
        "value": "N"
      },
      {
        "start": 593,
        "end": 593,
        "value": "A"
      },
      {
        "start": 594,
        "end": 608,
        "value": "N"
      },
      {
        "start": 609,
        "end": 609,
        "value": "A"
      },
      {
        "start": 610,
        "end": 707,
        "value": "N"
      },
      {
        "start": 708,
        "end": 708,
        "value": "A"
      },
      {
        "start": 709,
        "end": 710,
        "value": "N"
      },
      {
        "start": 711,
        "end": 711,
        "value": "A"
      },
      {
        "start": 712,
        "end": 712,
        "value": "N"
      },
      {
        "start": 713,
        "end": 715,
        "value": "A"
      },
      {
        "start": 716,
        "end": 716,
        "value": "N"
      },
      {
        "start": 717,
        "end": 717,
        "value": "A"
      },
      {
        "start": 718,
        "end": 719,
        "value": "N"
      },
      {
        "start": 720,
        "end": 720,
        "value": "A"
      },
      {
        "start": 721,
        "end": 727,
        "value": "N"
      },
      {
        "start": 728,
        "end": 731,
        "value": "A"
      },
      {
        "start": 732,
        "end": 732,
        "value": "N"
      },
      {
        "start": 733,
        "end": 733,
        "value": "A"
      },
      {
        "start": 734,
        "end": 734,
        "value": "N"
      },
      {
        "start": 735,
        "end": 735,
        "value": "A"
      },
      {
        "start": 736,
        "end": 767,
        "value": "N"
      },
      {
        "start": 768,
        "end": 879,
        "value": "A"
      },
      {
        "start": 880,
        "end": 887,
        "value": "N"
      },
      {
        "start": 890,
        "end": 895,
        "value": "N"
      },
      {
        "start": 900,
        "end": 906,
        "value": "N"
      },
      {
        "start": 908,
        "end": 908,
        "value": "N"
      },
      {
        "start": 910,
        "end": 912,
        "value": "N"
      },
      {
        "start": 913,
        "end": 929,
        "value": "A"
      },
      {
        "start": 931,
        "end": 937,
        "value": "A"
      },
      {
        "start": 938,
        "end": 944,
        "value": "N"
      },
      {
        "start": 945,
        "end": 961,
        "value": "A"
      },
      {
        "start": 962,
        "end": 962,
        "value": "N"
      },
      {
        "start": 963,
        "end": 969,
        "value": "A"
      },
      {
        "start": 970,
        "end": 1024,
        "value": "N"
      },
      {
        "start": 1025,
        "end": 1025,
        "value": "A"
      },
      {
        "start": 1026,
        "end": 1039,
        "value": "N"
      },
      {
        "start": 1040,
        "end": 1103,
        "value": "A"
      },
      {
        "start": 1104,
        "end": 1104,
        "value": "N"
      },
      {
        "start": 1105,
        "end": 1105,
        "value": "A"
      },
      {
        "start": 1106,
        "end": 1327,
        "value": "N"
      },
      {
        "start": 1329,
        "end": 1366,
        "value": "N"
      },
      {
        "start": 1369,
        "end": 1418,
        "value": "N"
      },
      {
        "start": 1421,
        "end": 1423,
        "value": "N"
      },
      {
        "start": 1425,
        "end": 1479,
        "value": "N"
      },
      {
        "start": 1488,
        "end": 1514,
        "value": "N"
      },
      {
        "start": 1519,
        "end": 1524,
        "value": "N"
      },
      {
        "start": 1536,
        "end": 1805,
        "value": "N"
      },
      {
        "start": 1807,
        "end": 1866,
        "value": "N"
      },
      {
        "start": 1869,
        "end": 1969,
        "value": "N"
      },
      {
        "start": 1984,
        "end": 2042,
        "value": "N"
      },
      {
        "start": 2045,
        "end": 2093,
        "value": "N"
      },
      {
        "start": 2096,
        "end": 2110,
        "value": "N"
      },
      {
        "start": 2112,
        "end": 2139,
        "value": "N"
      },
      {
        "start": 2142,
        "end": 2142,
        "value": "N"
      },
      {
        "start": 2144,
        "end": 2154,
        "value": "N"
      },
      {
        "start": 2160,
        "end": 2193,
        "value": "N"
      },
      {
        "start": 2199,
        "end": 2435,
        "value": "N"
      },
      {
        "start": 2437,
        "end": 2444,
        "value": "N"
      },
      {
        "start": 2447,
        "end": 2448,
        "value": "N"
      },
      {
        "start": 2451,
        "end": 2472,
        "value": "N"
      },
      {
        "start": 2474,
        "end": 2480,
        "value": "N"
      },
      {
        "start": 2482,
        "end": 2482,
        "value": "N"
      },
      {
        "start": 2486,
        "end": 2489,
        "value": "N"
      },
      {
        "start": 2492,
        "end": 2500,
        "value": "N"
      },
      {
        "start": 2503,
        "end": 2504,
        "value": "N"
      },
      {
        "start": 2507,
        "end": 2510,
        "value": "N"
      },
      {
        "start": 2519,
        "end": 2519,
        "value": "N"
      },
      {
        "start": 2524,
        "end": 2525,
        "value": "N"
      },
      {
        "start": 2527,
        "end": 2531,
        "value": "N"
      },
      {
        "start": 2534,
        "end": 2558,
        "value": "N"
      },
      {
        "start": 2561,
        "end": 2563,
        "value": "N"
      },
      {
        "start": 2565,
        "end": 2570,
        "value": "N"
      },
      {
        "start": 2575,
        "end": 2576,
        "value": "N"
      },
      {
        "start": 2579,
        "end": 2600,
        "value": "N"
      },
      {
        "start": 2602,
        "end": 2608,
        "value": "N"
      },
      {
        "start": 2610,
        "end": 2611,
        "value": "N"
      },
      {
        "start": 2613,
        "end": 2614,
        "value": "N"
      },
      {
        "start": 2616,
        "end": 2617,
        "value": "N"
      },
      {
        "start": 2620,
        "end": 2620,
        "value": "N"
      },
      {
        "start": 2622,
        "end": 2626,
        "value": "N"
      },
      {
        "start": 2631,
        "end": 2632,
        "value": "N"
      },
      {
        "start": 2635,
        "end": 2637,
        "value": "N"
      },
      {
        "start": 2641,
        "end": 2641,
        "value": "N"
      },
      {
        "start": 2649,
        "end": 2652,
        "value": "N"
      },
      {
        "start": 2654,
        "end": 2654,
        "value": "N"
      },
      {
        "start": 2662,
        "end": 2678,
        "value": "N"
      },
      {
        "start": 2689,
        "end": 2691,
        "value": "N"
      },
      {
        "start": 2693,
        "end": 2701,
        "value": "N"
      },
      {
        "start": 2703,
        "end": 2705,
        "value": "N"
      },
      {
        "start": 2707,
        "end": 2728,
        "value": "N"
      },
      {
        "start": 2730,
        "end": 2736,
        "value": "N"
      },
      {
        "start": 2738,
        "end": 2739,
        "value": "N"
      },
      {
        "start": 2741,
        "end": 2745,
        "value": "N"
      },
      {
        "start": 2748,
        "end": 2757,
        "value": "N"
      },
      {
        "start": 2759,
        "end": 2761,
        "value": "N"
      },
      {
        "start": 2763,
        "end": 2765,
        "value": "N"
      },
      {
        "start": 2768,
        "end": 2768,
        "value": "N"
      },
      {
        "start": 2784,
        "end": 2787,
        "value": "N"
      },
      {
        "start": 2790,
        "end": 2801,
        "value": "N"
      },
      {
        "start": 2809,
        "end": 2815,
        "value": "N"
      },
      {
        "start": 2817,
        "end": 2819,
        "value": "N"
      },
      {
        "start": 2821,
        "end": 2828,
        "value": "N"
      },
      {
        "start": 2831,
        "end": 2832,
        "value": "N"
      },
      {
        "start": 2835,
        "end": 2856,
        "value": "N"
      },
      {
        "start": 2858,
        "end": 2864,
        "value": "N"
      },
      {
        "start": 2866,
        "end": 2867,
        "value": "N"
      },
      {
        "start": 2869,
        "end": 2873,
        "value": "N"
      },
      {
        "start": 2876,
        "end": 2884,
        "value": "N"
      },
      {
        "start": 2887,
        "end": 2888,
        "value": "N"
      },
      {
        "start": 2891,
        "end": 2893,
        "value": "N"
      },
      {
        "start": 2901,
        "end": 2903,
        "value": "N"
      },
      {
        "start": 2908,
        "end": 2909,
        "value": "N"
      },
      {
        "start": 2911,
        "end": 2915,
        "value": "N"
      },
      {
        "start": 2918,
        "end": 2935,
        "value": "N"
      },
      {
        "start": 2946,
        "end": 2947,
        "value": "N"
      },
      {
        "start": 2949,
        "end": 2954,
        "value": "N"
      },
      {
        "start": 2958,
        "end": 2960,
        "value": "N"
      },
      {
        "start": 2962,
        "end": 2965,
        "value": "N"
      },
      {
        "start": 2969,
        "end": 2970,
        "value": "N"
      },
      {
        "start": 2972,
        "end": 2972,
        "value": "N"
      },
      {
        "start": 2974,
        "end": 2975,
        "value": "N"
      },
      {
        "start": 2979,
        "end": 2980,
        "value": "N"
      },
      {
        "start": 2984,
        "end": 2986,
        "value": "N"
      },
      {
        "start": 2990,
        "end": 3001,
        "value": "N"
      },
      {
        "start": 3006,
        "end": 3010,
        "value": "N"
      },
      {
        "start": 3014,
        "end": 3016,
        "value": "N"
      },
      {
        "start": 3018,
        "end": 3021,
        "value": "N"
      },
      {
        "start": 3024,
        "end": 3024,
        "value": "N"
      },
      {
        "start": 3031,
        "end": 3031,
        "value": "N"
      },
      {
        "start": 3046,
        "end": 3066,
        "value": "N"
      },
      {
        "start": 3072,
        "end": 3084,
        "value": "N"
      },
      {
        "start": 3086,
        "end": 3088,
        "value": "N"
      },
      {
        "start": 3090,
        "end": 3112,
        "value": "N"
      },
      {
        "start": 3114,
        "end": 3129,
        "value": "N"
      },
      {
        "start": 3132,
        "end": 3140,
        "value": "N"
      },
      {
        "start": 3142,
        "end": 3144,
        "value": "N"
      },
      {
        "start": 3146,
        "end": 3149,
        "value": "N"
      },
      {
        "start": 3157,
        "end": 3158,
        "value": "N"
      },
      {
        "start": 3160,
        "end": 3162,
        "value": "N"
      },
      {
        "start": 3164,
        "end": 3165,
        "value": "N"
      },
      {
        "start": 3168,
        "end": 3171,
        "value": "N"
      },
      {
        "start": 3174,
        "end": 3183,
        "value": "N"
      },
      {
        "start": 3191,
        "end": 3212,
        "value": "N"
      },
      {
        "start": 3214,
        "end": 3216,
        "value": "N"
      },
      {
        "start": 3218,
        "end": 3240,
        "value": "N"
      },
      {
        "start": 3242,
        "end": 3251,
        "value": "N"
      },
      {
        "start": 3253,
        "end": 3257,
        "value": "N"
      },
      {
        "start": 3260,
        "end": 3268,
        "value": "N"
      },
      {
        "start": 3270,
        "end": 3272,
        "value": "N"
      },
      {
        "start": 3274,
        "end": 3277,
        "value": "N"
      },
      {
        "start": 3285,
        "end": 3286,
        "value": "N"
      },
      {
        "start": 3292,
        "end": 3294,
        "value": "N"
      },
      {
        "start": 3296,
        "end": 3299,
        "value": "N"
      },
      {
        "start": 3302,
        "end": 3311,
        "value": "N"
      },
      {
        "start": 3313,
        "end": 3315,
        "value": "N"
      },
      {
        "start": 3328,
        "end": 3340,
        "value": "N"
      },
      {
        "start": 3342,
        "end": 3344,
        "value": "N"
      },
      {
        "start": 3346,
        "end": 3396,
        "value": "N"
      },
      {
        "start": 3398,
        "end": 3400,
        "value": "N"
      },
      {
        "start": 3402,
        "end": 3407,
        "value": "N"
      },
      {
        "start": 3412,
        "end": 3427,
        "value": "N"
      },
      {
        "start": 3430,
        "end": 3455,
        "value": "N"
      },
      {
        "start": 3457,
        "end": 3459,
        "value": "N"
      },
      {
        "start": 3461,
        "end": 3478,
        "value": "N"
      },
      {
        "start": 3482,
        "end": 3505,
        "value": "N"
      },
      {
        "start": 3507,
        "end": 3515,
        "value": "N"
      },
      {
        "start": 3517,
        "end": 3517,
        "value": "N"
      },
      {
        "start": 3520,
        "end": 3526,
        "value": "N"
      },
      {
        "start": 3530,
        "end": 3530,
        "value": "N"
      },
      {
        "start": 3535,
        "end": 3540,
        "value": "N"
      },
      {
        "start": 3542,
        "end": 3542,
        "value": "N"
      },
      {
        "start": 3544,
        "end": 3551,
        "value": "N"
      },
      {
        "start": 3558,
        "end": 3567,
        "value": "N"
      },
      {
        "start": 3570,
        "end": 3572,
        "value": "N"
      },
      {
        "start": 3585,
        "end": 3642,
        "value": "N"
      },
      {
        "start": 3647,
        "end": 3675,
        "value": "N"
      },
      {
        "start": 3713,
        "end": 3714,
        "value": "N"
      },
      {
        "start": 3716,
        "end": 3716,
        "value": "N"
      },
      {
        "start": 3718,
        "end": 3722,
        "value": "N"
      },
      {
        "start": 3724,
        "end": 3747,
        "value": "N"
      },
      {
        "start": 3749,
        "end": 3749,
        "value": "N"
      },
      {
        "start": 3751,
        "end": 3773,
        "value": "N"
      },
      {
        "start": 3776,
        "end": 3780,
        "value": "N"
      },
      {
        "start": 3782,
        "end": 3782,
        "value": "N"
      },
      {
        "start": 3784,
        "end": 3790,
        "value": "N"
      },
      {
        "start": 3792,
        "end": 3801,
        "value": "N"
      },
      {
        "start": 3804,
        "end": 3807,
        "value": "N"
      },
      {
        "start": 3840,
        "end": 3911,
        "value": "N"
      },
      {
        "start": 3913,
        "end": 3948,
        "value": "N"
      },
      {
        "start": 3953,
        "end": 3991,
        "value": "N"
      },
      {
        "start": 3993,
        "end": 4028,
        "value": "N"
      },
      {
        "start": 4030,
        "end": 4044,
        "value": "N"
      },
      {
        "start": 4046,
        "end": 4058,
        "value": "N"
      },
      {
        "start": 4096,
        "end": 4293,
        "value": "N"
      },
      {
        "start": 4295,
        "end": 4295,
        "value": "N"
      },
      {
        "start": 4301,
        "end": 4301,
        "value": "N"
      },
      {
        "start": 4304,
        "end": 4351,
        "value": "N"
      },
      {
        "start": 4352,
        "end": 4447,
        "value": "W"
      },
      {
        "start": 4448,
        "end": 4680,
        "value": "N"
      },
      {
        "start": 4682,
        "end": 4685,
        "value": "N"
      },
      {
        "start": 4688,
        "end": 4694,
        "value": "N"
      },
      {
        "start": 4696,
        "end": 4696,
        "value": "N"
      },
      {
        "start": 4698,
        "end": 4701,
        "value": "N"
      },
      {
        "start": 4704,
        "end": 4744,
        "value": "N"
      },
      {
        "start": 4746,
        "end": 4749,
        "value": "N"
      },
      {
        "start": 4752,
        "end": 4784,
        "value": "N"
      },
      {
        "start": 4786,
        "end": 4789,
        "value": "N"
      },
      {
        "start": 4792,
        "end": 4798,
        "value": "N"
      },
      {
        "start": 4800,
        "end": 4800,
        "value": "N"
      },
      {
        "start": 4802,
        "end": 4805,
        "value": "N"
      },
      {
        "start": 4808,
        "end": 4822,
        "value": "N"
      },
      {
        "start": 4824,
        "end": 4880,
        "value": "N"
      },
      {
        "start": 4882,
        "end": 4885,
        "value": "N"
      },
      {
        "start": 4888,
        "end": 4954,
        "value": "N"
      },
      {
        "start": 4957,
        "end": 4988,
        "value": "N"
      },
      {
        "start": 4992,
        "end": 5017,
        "value": "N"
      },
      {
        "start": 5024,
        "end": 5109,
        "value": "N"
      },
      {
        "start": 5112,
        "end": 5117,
        "value": "N"
      },
      {
        "start": 5120,
        "end": 5788,
        "value": "N"
      },
      {
        "start": 5792,
        "end": 5880,
        "value": "N"
      },
      {
        "start": 5888,
        "end": 5909,
        "value": "N"
      },
      {
        "start": 5919,
        "end": 5942,
        "value": "N"
      },
      {
        "start": 5952,
        "end": 5971,
        "value": "N"
      },
      {
        "start": 5984,
        "end": 5996,
        "value": "N"
      },
      {
        "start": 5998,
        "end": 6000,
        "value": "N"
      },
      {
        "start": 6002,
        "end": 6003,
        "value": "N"
      },
      {
        "start": 6016,
        "end": 6109,
        "value": "N"
      },
      {
        "start": 6112,
        "end": 6121,
        "value": "N"
      },
      {
        "start": 6128,
        "end": 6137,
        "value": "N"
      },
      {
        "start": 6144,
        "end": 6169,
        "value": "N"
      },
      {
        "start": 6176,
        "end": 6264,
        "value": "N"
      },
      {
        "start": 6272,
        "end": 6314,
        "value": "N"
      },
      {
        "start": 6320,
        "end": 6389,
        "value": "N"
      },
      {
        "start": 6400,
        "end": 6430,
        "value": "N"
      },
      {
        "start": 6432,
        "end": 6443,
        "value": "N"
      },
      {
        "start": 6448,
        "end": 6459,
        "value": "N"
      },
      {
        "start": 6464,
        "end": 6464,
        "value": "N"
      },
      {
        "start": 6468,
        "end": 6509,
        "value": "N"
      },
      {
        "start": 6512,
        "end": 6516,
        "value": "N"
      },
      {
        "start": 6528,
        "end": 6571,
        "value": "N"
      },
      {
        "start": 6576,
        "end": 6601,
        "value": "N"
      },
      {
        "start": 6608,
        "end": 6618,
        "value": "N"
      },
      {
        "start": 6622,
        "end": 6683,
        "value": "N"
      },
      {
        "start": 6686,
        "end": 6750,
        "value": "N"
      },
      {
        "start": 6752,
        "end": 6780,
        "value": "N"
      },
      {
        "start": 6783,
        "end": 6793,
        "value": "N"
      },
      {
        "start": 6800,
        "end": 6809,
        "value": "N"
      },
      {
        "start": 6816,
        "end": 6829,
        "value": "N"
      },
      {
        "start": 6832,
        "end": 6877,
        "value": "N"
      },
      {
        "start": 6880,
        "end": 6891,
        "value": "N"
      },
      {
        "start": 6912,
        "end": 6988,
        "value": "N"
      },
      {
        "start": 6990,
        "end": 7155,
        "value": "N"
      },
      {
        "start": 7164,
        "end": 7223,
        "value": "N"
      },
      {
        "start": 7227,
        "end": 7241,
        "value": "N"
      },
      {
        "start": 7245,
        "end": 7306,
        "value": "N"
      },
      {
        "start": 7312,
        "end": 7354,
        "value": "N"
      },
      {
        "start": 7357,
        "end": 7367,
        "value": "N"
      },
      {
        "start": 7376,
        "end": 7418,
        "value": "N"
      },
      {
        "start": 7424,
        "end": 7957,
        "value": "N"
      },
      {
        "start": 7960,
        "end": 7965,
        "value": "N"
      },
      {
        "start": 7968,
        "end": 8005,
        "value": "N"
      },
      {
        "start": 8008,
        "end": 8013,
        "value": "N"
      },
      {
        "start": 8016,
        "end": 8023,
        "value": "N"
      },
      {
        "start": 8025,
        "end": 8025,
        "value": "N"
      },
      {
        "start": 8027,
        "end": 8027,
        "value": "N"
      },
      {
        "start": 8029,
        "end": 8029,
        "value": "N"
      },
      {
        "start": 8031,
        "end": 8061,
        "value": "N"
      },
      {
        "start": 8064,
        "end": 8116,
        "value": "N"
      },
      {
        "start": 8118,
        "end": 8132,
        "value": "N"
      },
      {
        "start": 8134,
        "end": 8147,
        "value": "N"
      },
      {
        "start": 8150,
        "end": 8155,
        "value": "N"
      },
      {
        "start": 8157,
        "end": 8175,
        "value": "N"
      },
      {
        "start": 8178,
        "end": 8180,
        "value": "N"
      },
      {
        "start": 8182,
        "end": 8190,
        "value": "N"
      },
      {
        "start": 8192,
        "end": 8207,
        "value": "N"
      },
      {
        "start": 8208,
        "end": 8208,
        "value": "A"
      },
      {
        "start": 8209,
        "end": 8210,
        "value": "N"
      },
      {
        "start": 8211,
        "end": 8214,
        "value": "A"
      },
      {
        "start": 8215,
        "end": 8215,
        "value": "N"
      },
      {
        "start": 8216,
        "end": 8217,
        "value": "A"
      },
      {
        "start": 8218,
        "end": 8219,
        "value": "N"
      },
      {
        "start": 8220,
        "end": 8221,
        "value": "A"
      },
      {
        "start": 8222,
        "end": 8223,
        "value": "N"
      },
      {
        "start": 8224,
        "end": 8226,
        "value": "A"
      },
      {
        "start": 8227,
        "end": 8227,
        "value": "N"
      },
      {
        "start": 8228,
        "end": 8231,
        "value": "A"
      },
      {
        "start": 8232,
        "end": 8239,
        "value": "N"
      },
      {
        "start": 8240,
        "end": 8240,
        "value": "A"
      },
      {
        "start": 8241,
        "end": 8241,
        "value": "N"
      },
      {
        "start": 8242,
        "end": 8243,
        "value": "A"
      },
      {
        "start": 8244,
        "end": 8244,
        "value": "N"
      },
      {
        "start": 8245,
        "end": 8245,
        "value": "A"
      },
      {
        "start": 8246,
        "end": 8250,
        "value": "N"
      },
      {
        "start": 8251,
        "end": 8251,
        "value": "A"
      },
      {
        "start": 8252,
        "end": 8253,
        "value": "N"
      },
      {
        "start": 8254,
        "end": 8254,
        "value": "A"
      },
      {
        "start": 8255,
        "end": 8292,
        "value": "N"
      },
      {
        "start": 8294,
        "end": 8305,
        "value": "N"
      },
      {
        "start": 8308,
        "end": 8308,
        "value": "A"
      },
      {
        "start": 8309,
        "end": 8318,
        "value": "N"
      },
      {
        "start": 8319,
        "end": 8319,
        "value": "A"
      },
      {
        "start": 8320,
        "end": 8320,
        "value": "N"
      },
      {
        "start": 8321,
        "end": 8324,
        "value": "A"
      },
      {
        "start": 8325,
        "end": 8334,
        "value": "N"
      },
      {
        "start": 8336,
        "end": 8348,
        "value": "N"
      },
      {
        "start": 8352,
        "end": 8360,
        "value": "N"
      },
      {
        "start": 8361,
        "end": 8361,
        "value": "H"
      },
      {
        "start": 8362,
        "end": 8363,
        "value": "N"
      },
      {
        "start": 8364,
        "end": 8364,
        "value": "A"
      },
      {
        "start": 8365,
        "end": 8385,
        "value": "N"
      },
      {
        "start": 8400,
        "end": 8432,
        "value": "N"
      },
      {
        "start": 8448,
        "end": 8450,
        "value": "N"
      },
      {
        "start": 8451,
        "end": 8451,
        "value": "A"
      },
      {
        "start": 8452,
        "end": 8452,
        "value": "N"
      },
      {
        "start": 8453,
        "end": 8453,
        "value": "A"
      },
      {
        "start": 8454,
        "end": 8456,
        "value": "N"
      },
      {
        "start": 8457,
        "end": 8457,
        "value": "A"
      },
      {
        "start": 8458,
        "end": 8466,
        "value": "N"
      },
      {
        "start": 8467,
        "end": 8467,
        "value": "A"
      },
      {
        "start": 8468,
        "end": 8469,
        "value": "N"
      },
      {
        "start": 8470,
        "end": 8470,
        "value": "A"
      },
      {
        "start": 8471,
        "end": 8480,
        "value": "N"
      },
      {
        "start": 8481,
        "end": 8482,
        "value": "A"
      },
      {
        "start": 8483,
        "end": 8485,
        "value": "N"
      },
      {
        "start": 8486,
        "end": 8486,
        "value": "A"
      },
      {
        "start": 8487,
        "end": 8490,
        "value": "N"
      },
      {
        "start": 8491,
        "end": 8491,
        "value": "A"
      },
      {
        "start": 8492,
        "end": 8530,
        "value": "N"
      },
      {
        "start": 8531,
        "end": 8532,
        "value": "A"
      },
      {
        "start": 8533,
        "end": 8538,
        "value": "N"
      },
      {
        "start": 8539,
        "end": 8542,
        "value": "A"
      },
      {
        "start": 8543,
        "end": 8543,
        "value": "N"
      },
      {
        "start": 8544,
        "end": 8555,
        "value": "A"
      },
      {
        "start": 8556,
        "end": 8559,
        "value": "N"
      },
      {
        "start": 8560,
        "end": 8569,
        "value": "A"
      },
      {
        "start": 8570,
        "end": 8584,
        "value": "N"
      },
      {
        "start": 8585,
        "end": 8585,
        "value": "A"
      },
      {
        "start": 8586,
        "end": 8587,
        "value": "N"
      },
      {
        "start": 8592,
        "end": 8601,
        "value": "A"
      },
      {
        "start": 8602,
        "end": 8631,
        "value": "N"
      },
      {
        "start": 8632,
        "end": 8633,
        "value": "A"
      },
      {
        "start": 8634,
        "end": 8657,
        "value": "N"
      },
      {
        "start": 8658,
        "end": 8658,
        "value": "A"
      },
      {
        "start": 8659,
        "end": 8659,
        "value": "N"
      },
      {
        "start": 8660,
        "end": 8660,
        "value": "A"
      },
      {
        "start": 8661,
        "end": 8678,
        "value": "N"
      },
      {
        "start": 8679,
        "end": 8679,
        "value": "A"
      },
      {
        "start": 8680,
        "end": 8703,
        "value": "N"
      },
      {
        "start": 8704,
        "end": 8704,
        "value": "A"
      },
      {
        "start": 8705,
        "end": 8705,
        "value": "N"
      },
      {
        "start": 8706,
        "end": 8707,
        "value": "A"
      },
      {
        "start": 8708,
        "end": 8710,
        "value": "N"
      },
      {
        "start": 8711,
        "end": 8712,
        "value": "A"
      },
      {
        "start": 8713,
        "end": 8714,
        "value": "N"
      },
      {
        "start": 8715,
        "end": 8715,
        "value": "A"
      },
      {
        "start": 8716,
        "end": 8718,
        "value": "N"
      },
      {
        "start": 8719,
        "end": 8719,
        "value": "A"
      },
      {
        "start": 8720,
        "end": 8720,
        "value": "N"
      },
      {
        "start": 8721,
        "end": 8721,
        "value": "A"
      },
      {
        "start": 8722,
        "end": 8724,
        "value": "N"
      },
      {
        "start": 8725,
        "end": 8725,
        "value": "A"
      },
      {
        "start": 8726,
        "end": 8729,
        "value": "N"
      },
      {
        "start": 8730,
        "end": 8730,
        "value": "A"
      },
      {
        "start": 8731,
        "end": 8732,
        "value": "N"
      },
      {
        "start": 8733,
        "end": 8736,
        "value": "A"
      },
      {
        "start": 8737,
        "end": 8738,
        "value": "N"
      },
      {
        "start": 8739,
        "end": 8739,
        "value": "A"
      },
      {
        "start": 8740,
        "end": 8740,
        "value": "N"
      },
      {
        "start": 8741,
        "end": 8741,
        "value": "A"
      },
      {
        "start": 8742,
        "end": 8742,
        "value": "N"
      },
      {
        "start": 8743,
        "end": 8748,
        "value": "A"
      },
      {
        "start": 8749,
        "end": 8749,
        "value": "N"
      },
      {
        "start": 8750,
        "end": 8750,
        "value": "A"
      },
      {
        "start": 8751,
        "end": 8755,
        "value": "N"
      },
      {
        "start": 8756,
        "end": 8759,
        "value": "A"
      },
      {
        "start": 8760,
        "end": 8763,
        "value": "N"
      },
      {
        "start": 8764,
        "end": 8765,
        "value": "A"
      },
      {
        "start": 8766,
        "end": 8775,
        "value": "N"
      },
      {
        "start": 8776,
        "end": 8776,
        "value": "A"
      },
      {
        "start": 8777,
        "end": 8779,
        "value": "N"
      },
      {
        "start": 8780,
        "end": 8780,
        "value": "A"
      },
      {
        "start": 8781,
        "end": 8785,
        "value": "N"
      },
      {
        "start": 8786,
        "end": 8786,
        "value": "A"
      },
      {
        "start": 8787,
        "end": 8799,
        "value": "N"
      },
      {
        "start": 8800,
        "end": 8801,
        "value": "A"
      },
      {
        "start": 8802,
        "end": 8803,
        "value": "N"
      },
      {
        "start": 8804,
        "end": 8807,
        "value": "A"
      },
      {
        "start": 8808,
        "end": 8809,
        "value": "N"
      },
      {
        "start": 8810,
        "end": 8811,
        "value": "A"
      },
      {
        "start": 8812,
        "end": 8813,
        "value": "N"
      },
      {
        "start": 8814,
        "end": 8815,
        "value": "A"
      },
      {
        "start": 8816,
        "end": 8833,
        "value": "N"
      },
      {
        "start": 8834,
        "end": 8835,
        "value": "A"
      },
      {
        "start": 8836,
        "end": 8837,
        "value": "N"
      },
      {
        "start": 8838,
        "end": 8839,
        "value": "A"
      },
      {
        "start": 8840,
        "end": 8852,
        "value": "N"
      },
      {
        "start": 8853,
        "end": 8853,
        "value": "A"
      },
      {
        "start": 8854,
        "end": 8856,
        "value": "N"
      },
      {
        "start": 8857,
        "end": 8857,
        "value": "A"
      },
      {
        "start": 8858,
        "end": 8868,
        "value": "N"
      },
      {
        "start": 8869,
        "end": 8869,
        "value": "A"
      },
      {
        "start": 8870,
        "end": 8894,
        "value": "N"
      },
      {
        "start": 8895,
        "end": 8895,
        "value": "A"
      },
      {
        "start": 8896,
        "end": 8977,
        "value": "N"
      },
      {
        "start": 8978,
        "end": 8978,
        "value": "A"
      },
      {
        "start": 8979,
        "end": 8985,
        "value": "N"
      },
      {
        "start": 8986,
        "end": 8987,
        "value": "W"
      },
      {
        "start": 8988,
        "end": 9000,
        "value": "N"
      },
      {
        "start": 9001,
        "end": 9002,
        "value": "W"
      },
      {
        "start": 9003,
        "end": 9192,
        "value": "N"
      },
      {
        "start": 9193,
        "end": 9196,
        "value": "W"
      },
      {
        "start": 9197,
        "end": 9199,
        "value": "N"
      },
      {
        "start": 9200,
        "end": 9200,
        "value": "W"
      },
      {
        "start": 9201,
        "end": 9202,
        "value": "N"
      },
      {
        "start": 9203,
        "end": 9203,
        "value": "W"
      },
      {
        "start": 9204,
        "end": 9257,
        "value": "N"
      },
      {
        "start": 9280,
        "end": 9290,
        "value": "N"
      },
      {
        "start": 9312,
        "end": 9449,
        "value": "A"
      },
      {
        "start": 9450,
        "end": 9450,
        "value": "N"
      },
      {
        "start": 9451,
        "end": 9547,
        "value": "A"
      },
      {
        "start": 9548,
        "end": 9551,
        "value": "N"
      },
      {
        "start": 9552,
        "end": 9587,
        "value": "A"
      },
      {
        "start": 9588,
        "end": 9599,
        "value": "N"
      },
      {
        "start": 9600,
        "end": 9615,
        "value": "A"
      },
      {
        "start": 9616,
        "end": 9617,
        "value": "N"
      },
      {
        "start": 9618,
        "end": 9621,
        "value": "A"
      },
      {
        "start": 9622,
        "end": 9631,
        "value": "N"
      },
      {
        "start": 9632,
        "end": 9633,
        "value": "A"
      },
      {
        "start": 9634,
        "end": 9634,
        "value": "N"
      },
      {
        "start": 9635,
        "end": 9641,
        "value": "A"
      },
      {
        "start": 9642,
        "end": 9649,
        "value": "N"
      },
      {
        "start": 9650,
        "end": 9651,
        "value": "A"
      },
      {
        "start": 9652,
        "end": 9653,
        "value": "N"
      },
      {
        "start": 9654,
        "end": 9655,
        "value": "A"
      },
      {
        "start": 9656,
        "end": 9659,
        "value": "N"
      },
      {
        "start": 9660,
        "end": 9661,
        "value": "A"
      },
      {
        "start": 9662,
        "end": 9663,
        "value": "N"
      },
      {
        "start": 9664,
        "end": 9665,
        "value": "A"
      },
      {
        "start": 9666,
        "end": 9669,
        "value": "N"
      },
      {
        "start": 9670,
        "end": 9672,
        "value": "A"
      },
      {
        "start": 9673,
        "end": 9674,
        "value": "N"
      },
      {
        "start": 9675,
        "end": 9675,
        "value": "A"
      },
      {
        "start": 9676,
        "end": 9677,
        "value": "N"
      },
      {
        "start": 9678,
        "end": 9681,
        "value": "A"
      },
      {
        "start": 9682,
        "end": 9697,
        "value": "N"
      },
      {
        "start": 9698,
        "end": 9701,
        "value": "A"
      },
      {
        "start": 9702,
        "end": 9710,
        "value": "N"
      },
      {
        "start": 9711,
        "end": 9711,
        "value": "A"
      },
      {
        "start": 9712,
        "end": 9724,
        "value": "N"
      },
      {
        "start": 9725,
        "end": 9726,
        "value": "W"
      },
      {
        "start": 9727,
        "end": 9732,
        "value": "N"
      },
      {
        "start": 9733,
        "end": 9734,
        "value": "A"
      },
      {
        "start": 9735,
        "end": 9736,
        "value": "N"
      },
      {
        "start": 9737,
        "end": 9737,
        "value": "A"
      },
      {
        "start": 9738,
        "end": 9741,
        "value": "N"
      },
      {
        "start": 9742,
        "end": 9743,
        "value": "A"
      },
      {
        "start": 9744,
        "end": 9747,
        "value": "N"
      },
      {
        "start": 9748,
        "end": 9749,
        "value": "W"
      },
      {
        "start": 9750,
        "end": 9755,
        "value": "N"
      },
      {
        "start": 9756,
        "end": 9756,
        "value": "A"
      },
      {
        "start": 9757,
        "end": 9757,
        "value": "N"
      },
      {
        "start": 9758,
        "end": 9758,
        "value": "A"
      },
      {
        "start": 9759,
        "end": 9775,
        "value": "N"
      },
      {
        "start": 9776,
        "end": 9783,
        "value": "W"
      },
      {
        "start": 9784,
        "end": 9791,
        "value": "N"
      },
      {
        "start": 9792,
        "end": 9792,
        "value": "A"
      },
      {
        "start": 9793,
        "end": 9793,
        "value": "N"
      },
      {
        "start": 9794,
        "end": 9794,
        "value": "A"
      },
      {
        "start": 9795,
        "end": 9799,
        "value": "N"
      },
      {
        "start": 9800,
        "end": 9811,
        "value": "W"
      },
      {
        "start": 9812,
        "end": 9823,
        "value": "N"
      },
      {
        "start": 9824,
        "end": 9825,
        "value": "A"
      },
      {
        "start": 9826,
        "end": 9826,
        "value": "N"
      },
      {
        "start": 9827,
        "end": 9829,
        "value": "A"
      },
      {
        "start": 9830,
        "end": 9830,
        "value": "N"
      },
      {
        "start": 9831,
        "end": 9834,
        "value": "A"
      },
      {
        "start": 9835,
        "end": 9835,
        "value": "N"
      },
      {
        "start": 9836,
        "end": 9837,
        "value": "A"
      },
      {
        "start": 9838,
        "end": 9838,
        "value": "N"
      },
      {
        "start": 9839,
        "end": 9839,
        "value": "A"
      },
      {
        "start": 9840,
        "end": 9854,
        "value": "N"
      },
      {
        "start": 9855,
        "end": 9855,
        "value": "W"
      },
      {
        "start": 9856,
        "end": 9865,
        "value": "N"
      },
      {
        "start": 9866,
        "end": 9871,
        "value": "W"
      },
      {
        "start": 9872,
        "end": 9874,
        "value": "N"
      },
      {
        "start": 9875,
        "end": 9875,
        "value": "W"
      },
      {
        "start": 9876,
        "end": 9885,
        "value": "N"
      },
      {
        "start": 9886,
        "end": 9887,
        "value": "A"
      },
      {
        "start": 9888,
        "end": 9888,
        "value": "N"
      },
      {
        "start": 9889,
        "end": 9889,
        "value": "W"
      },
      {
        "start": 9890,
        "end": 9897,
        "value": "N"
      },
      {
        "start": 9898,
        "end": 9899,
        "value": "W"
      },
      {
        "start": 9900,
        "end": 9916,
        "value": "N"
      },
      {
        "start": 9917,
        "end": 9918,
        "value": "W"
      },
      {
        "start": 9919,
        "end": 9919,
        "value": "A"
      },
      {
        "start": 9920,
        "end": 9923,
        "value": "N"
      },
      {
        "start": 9924,
        "end": 9925,
        "value": "W"
      },
      {
        "start": 9926,
        "end": 9933,
        "value": "A"
      },
      {
        "start": 9934,
        "end": 9934,
        "value": "W"
      },
      {
        "start": 9935,
        "end": 9939,
        "value": "A"
      },
      {
        "start": 9940,
        "end": 9940,
        "value": "W"
      },
      {
        "start": 9941,
        "end": 9953,
        "value": "A"
      },
      {
        "start": 9954,
        "end": 9954,
        "value": "N"
      },
      {
        "start": 9955,
        "end": 9955,
        "value": "A"
      },
      {
        "start": 9956,
        "end": 9959,
        "value": "N"
      },
      {
        "start": 9960,
        "end": 9961,
        "value": "A"
      },
      {
        "start": 9962,
        "end": 9962,
        "value": "W"
      },
      {
        "start": 9963,
        "end": 9969,
        "value": "A"
      },
      {
        "start": 9970,
        "end": 9971,
        "value": "W"
      },
      {
        "start": 9972,
        "end": 9972,
        "value": "A"
      },
      {
        "start": 9973,
        "end": 9973,
        "value": "W"
      },
      {
        "start": 9974,
        "end": 9977,
        "value": "A"
      },
      {
        "start": 9978,
        "end": 9978,
        "value": "W"
      },
      {
        "start": 9979,
        "end": 9980,
        "value": "A"
      },
      {
        "start": 9981,
        "end": 9981,
        "value": "W"
      },
      {
        "start": 9982,
        "end": 9983,
        "value": "A"
      },
      {
        "start": 9984,
        "end": 9988,
        "value": "N"
      },
      {
        "start": 9989,
        "end": 9989,
        "value": "W"
      },
      {
        "start": 9990,
        "end": 9993,
        "value": "N"
      },
      {
        "start": 9994,
        "end": 9995,
        "value": "W"
      },
      {
        "start": 9996,
        "end": 10023,
        "value": "N"
      },
      {
        "start": 10024,
        "end": 10024,
        "value": "W"
      },
      {
        "start": 10025,
        "end": 10044,
        "value": "N"
      },
      {
        "start": 10045,
        "end": 10045,
        "value": "A"
      },
      {
        "start": 10046,
        "end": 10059,
        "value": "N"
      },
      {
        "start": 10060,
        "end": 10060,
        "value": "W"
      },
      {
        "start": 10061,
        "end": 10061,
        "value": "N"
      },
      {
        "start": 10062,
        "end": 10062,
        "value": "W"
      },
      {
        "start": 10063,
        "end": 10066,
        "value": "N"
      },
      {
        "start": 10067,
        "end": 10069,
        "value": "W"
      },
      {
        "start": 10070,
        "end": 10070,
        "value": "N"
      },
      {
        "start": 10071,
        "end": 10071,
        "value": "W"
      },
      {
        "start": 10072,
        "end": 10101,
        "value": "N"
      },
      {
        "start": 10102,
        "end": 10111,
        "value": "A"
      },
      {
        "start": 10112,
        "end": 10132,
        "value": "N"
      },
      {
        "start": 10133,
        "end": 10135,
        "value": "W"
      },
      {
        "start": 10136,
        "end": 10159,
        "value": "N"
      },
      {
        "start": 10160,
        "end": 10160,
        "value": "W"
      },
      {
        "start": 10161,
        "end": 10174,
        "value": "N"
      },
      {
        "start": 10175,
        "end": 10175,
        "value": "W"
      },
      {
        "start": 10176,
        "end": 10213,
        "value": "N"
      },
      {
        "start": 10214,
        "end": 10221,
        "value": "Na"
      },
      {
        "start": 10222,
        "end": 10628,
        "value": "N"
      },
      {
        "start": 10629,
        "end": 10630,
        "value": "Na"
      },
      {
        "start": 10631,
        "end": 11034,
        "value": "N"
      },
      {
        "start": 11035,
        "end": 11036,
        "value": "W"
      },
      {
        "start": 11037,
        "end": 11087,
        "value": "N"
      },
      {
        "start": 11088,
        "end": 11088,
        "value": "W"
      },
      {
        "start": 11089,
        "end": 11092,
        "value": "N"
      },
      {
        "start": 11093,
        "end": 11093,
        "value": "W"
      },
      {
        "start": 11094,
        "end": 11097,
        "value": "A"
      },
      {
        "start": 11098,
        "end": 11123,
        "value": "N"
      },
      {
        "start": 11126,
        "end": 11507,
        "value": "N"
      },
      {
        "start": 11513,
        "end": 11557,
        "value": "N"
      },
      {
        "start": 11559,
        "end": 11559,
        "value": "N"
      },
      {
        "start": 11565,
        "end": 11565,
        "value": "N"
      },
      {
        "start": 11568,
        "end": 11623,
        "value": "N"
      },
      {
        "start": 11631,
        "end": 11632,
        "value": "N"
      },
      {
        "start": 11647,
        "end": 11670,
        "value": "N"
      },
      {
        "start": 11680,
        "end": 11686,
        "value": "N"
      },
      {
        "start": 11688,
        "end": 11694,
        "value": "N"
      },
      {
        "start": 11696,
        "end": 11702,
        "value": "N"
      },
      {
        "start": 11704,
        "end": 11710,
        "value": "N"
      },
      {
        "start": 11712,
        "end": 11718,
        "value": "N"
      },
      {
        "start": 11720,
        "end": 11726,
        "value": "N"
      },
      {
        "start": 11728,
        "end": 11734,
        "value": "N"
      },
      {
        "start": 11736,
        "end": 11742,
        "value": "N"
      },
      {
        "start": 11744,
        "end": 11869,
        "value": "N"
      },
      {
        "start": 11904,
        "end": 11929,
        "value": "W"
      },
      {
        "start": 11931,
        "end": 12019,
        "value": "W"
      },
      {
        "start": 12032,
        "end": 12245,
        "value": "W"
      },
      {
        "start": 12272,
        "end": 12287,
        "value": "W"
      },
      {
        "start": 12288,
        "end": 12288,
        "value": "F"
      },
      {
        "start": 12289,
        "end": 12350,
        "value": "W"
      },
      {
        "start": 12351,
        "end": 12351,
        "value": "N"
      },
      {
        "start": 12353,
        "end": 12438,
        "value": "W"
      },
      {
        "start": 12441,
        "end": 12543,
        "value": "W"
      },
      {
        "start": 12549,
        "end": 12591,
        "value": "W"
      },
      {
        "start": 12593,
        "end": 12686,
        "value": "W"
      },
      {
        "start": 12688,
        "end": 12773,
        "value": "W"
      },
      {
        "start": 12783,
        "end": 12830,
        "value": "W"
      },
      {
        "start": 12832,
        "end": 12871,
        "value": "W"
      },
      {
        "start": 12872,
        "end": 12879,
        "value": "A"
      },
      {
        "start": 12880,
        "end": 42124,
        "value": "W"
      },
      {
        "start": 42128,
        "end": 42182,
        "value": "W"
      },
      {
        "start": 42192,
        "end": 42539,
        "value": "N"
      },
      {
        "start": 42560,
        "end": 42743,
        "value": "N"
      },
      {
        "start": 42752,
        "end": 42972,
        "value": "N"
      },
      {
        "start": 42993,
        "end": 43052,
        "value": "N"
      },
      {
        "start": 43056,
        "end": 43065,
        "value": "N"
      },
      {
        "start": 43072,
        "end": 43127,
        "value": "N"
      },
      {
        "start": 43136,
        "end": 43205,
        "value": "N"
      },
      {
        "start": 43214,
        "end": 43225,
        "value": "N"
      },
      {
        "start": 43232,
        "end": 43347,
        "value": "N"
      },
      {
        "start": 43359,
        "end": 43359,
        "value": "N"
      },
      {
        "start": 43360,
        "end": 43388,
        "value": "W"
      },
      {
        "start": 43392,
        "end": 43469,
        "value": "N"
      },
      {
        "start": 43471,
        "end": 43481,
        "value": "N"
      },
      {
        "start": 43486,
        "end": 43518,
        "value": "N"
      },
      {
        "start": 43520,
        "end": 43574,
        "value": "N"
      },
      {
        "start": 43584,
        "end": 43597,
        "value": "N"
      },
      {
        "start": 43600,
        "end": 43609,
        "value": "N"
      },
      {
        "start": 43612,
        "end": 43714,
        "value": "N"
      },
      {
        "start": 43739,
        "end": 43766,
        "value": "N"
      },
      {
        "start": 43777,
        "end": 43782,
        "value": "N"
      },
      {
        "start": 43785,
        "end": 43790,
        "value": "N"
      },
      {
        "start": 43793,
        "end": 43798,
        "value": "N"
      },
      {
        "start": 43808,
        "end": 43814,
        "value": "N"
      },
      {
        "start": 43816,
        "end": 43822,
        "value": "N"
      },
      {
        "start": 43824,
        "end": 43883,
        "value": "N"
      },
      {
        "start": 43888,
        "end": 44013,
        "value": "N"
      },
      {
        "start": 44016,
        "end": 44025,
        "value": "N"
      },
      {
        "start": 44032,
        "end": 55203,
        "value": "W"
      },
      {
        "start": 55216,
        "end": 55238,
        "value": "N"
      },
      {
        "start": 55243,
        "end": 55291,
        "value": "N"
      },
      {
        "start": 55296,
        "end": 57343,
        "value": "N"
      },
      {
        "start": 57344,
        "end": 63743,
        "value": "A"
      },
      {
        "start": 63744,
        "end": 64255,
        "value": "W"
      },
      {
        "start": 64256,
        "end": 64262,
        "value": "N"
      },
      {
        "start": 64275,
        "end": 64279,
        "value": "N"
      },
      {
        "start": 64285,
        "end": 64310,
        "value": "N"
      },
      {
        "start": 64312,
        "end": 64316,
        "value": "N"
      },
      {
        "start": 64318,
        "end": 64318,
        "value": "N"
      },
      {
        "start": 64320,
        "end": 64321,
        "value": "N"
      },
      {
        "start": 64323,
        "end": 64324,
        "value": "N"
      },
      {
        "start": 64326,
        "end": 64975,
        "value": "N"
      },
      {
        "start": 65008,
        "end": 65023,
        "value": "N"
      },
      {
        "start": 65024,
        "end": 65039,
        "value": "A"
      },
      {
        "start": 65040,
        "end": 65049,
        "value": "W"
      },
      {
        "start": 65056,
        "end": 65071,
        "value": "N"
      },
      {
        "start": 65072,
        "end": 65106,
        "value": "W"
      },
      {
        "start": 65108,
        "end": 65126,
        "value": "W"
      },
      {
        "start": 65128,
        "end": 65131,
        "value": "W"
      },
      {
        "start": 65136,
        "end": 65140,
        "value": "N"
      },
      {
        "start": 65142,
        "end": 65276,
        "value": "N"
      },
      {
        "start": 65279,
        "end": 65279,
        "value": "N"
      },
      {
        "start": 65281,
        "end": 65376,
        "value": "F"
      },
      {
        "start": 65377,
        "end": 65470,
        "value": "H"
      },
      {
        "start": 65474,
        "end": 65479,
        "value": "H"
      },
      {
        "start": 65482,
        "end": 65487,
        "value": "H"
      },
      {
        "start": 65490,
        "end": 65495,
        "value": "H"
      },
      {
        "start": 65498,
        "end": 65500,
        "value": "H"
      },
      {
        "start": 65504,
        "end": 65510,
        "value": "F"
      },
      {
        "start": 65512,
        "end": 65518,
        "value": "H"
      },
      {
        "start": 65529,
        "end": 65532,
        "value": "N"
      },
      {
        "start": 65533,
        "end": 65533,
        "value": "A"
      },
      {
        "start": 65536,
        "end": 65547,
        "value": "N"
      },
      {
        "start": 65549,
        "end": 65574,
        "value": "N"
      },
      {
        "start": 65576,
        "end": 65594,
        "value": "N"
      },
      {
        "start": 65596,
        "end": 65597,
        "value": "N"
      },
      {
        "start": 65599,
        "end": 65613,
        "value": "N"
      },
      {
        "start": 65616,
        "end": 65629,
        "value": "N"
      },
      {
        "start": 65664,
        "end": 65786,
        "value": "N"
      },
      {
        "start": 65792,
        "end": 65794,
        "value": "N"
      },
      {
        "start": 65799,
        "end": 65843,
        "value": "N"
      },
      {
        "start": 65847,
        "end": 65934,
        "value": "N"
      },
      {
        "start": 65936,
        "end": 65948,
        "value": "N"
      },
      {
        "start": 65952,
        "end": 65952,
        "value": "N"
      },
      {
        "start": 66000,
        "end": 66045,
        "value": "N"
      },
      {
        "start": 66176,
        "end": 66204,
        "value": "N"
      },
      {
        "start": 66208,
        "end": 66256,
        "value": "N"
      },
      {
        "start": 66272,
        "end": 66299,
        "value": "N"
      },
      {
        "start": 66304,
        "end": 66339,
        "value": "N"
      },
      {
        "start": 66349,
        "end": 66378,
        "value": "N"
      },
      {
        "start": 66384,
        "end": 66426,
        "value": "N"
      },
      {
        "start": 66432,
        "end": 66461,
        "value": "N"
      },
      {
        "start": 66463,
        "end": 66499,
        "value": "N"
      },
      {
        "start": 66504,
        "end": 66517,
        "value": "N"
      },
      {
        "start": 66560,
        "end": 66717,
        "value": "N"
      },
      {
        "start": 66720,
        "end": 66729,
        "value": "N"
      },
      {
        "start": 66736,
        "end": 66771,
        "value": "N"
      },
      {
        "start": 66776,
        "end": 66811,
        "value": "N"
      },
      {
        "start": 66816,
        "end": 66855,
        "value": "N"
      },
      {
        "start": 66864,
        "end": 66915,
        "value": "N"
      },
      {
        "start": 66927,
        "end": 66938,
        "value": "N"
      },
      {
        "start": 66940,
        "end": 66954,
        "value": "N"
      },
      {
        "start": 66956,
        "end": 66962,
        "value": "N"
      },
      {
        "start": 66964,
        "end": 66965,
        "value": "N"
      },
      {
        "start": 66967,
        "end": 66977,
        "value": "N"
      },
      {
        "start": 66979,
        "end": 66993,
        "value": "N"
      },
      {
        "start": 66995,
        "end": 67001,
        "value": "N"
      },
      {
        "start": 67003,
        "end": 67004,
        "value": "N"
      },
      {
        "start": 67008,
        "end": 67059,
        "value": "N"
      },
      {
        "start": 67072,
        "end": 67382,
        "value": "N"
      },
      {
        "start": 67392,
        "end": 67413,
        "value": "N"
      },
      {
        "start": 67424,
        "end": 67431,
        "value": "N"
      },
      {
        "start": 67456,
        "end": 67461,
        "value": "N"
      },
      {
        "start": 67463,
        "end": 67504,
        "value": "N"
      },
      {
        "start": 67506,
        "end": 67514,
        "value": "N"
      },
      {
        "start": 67584,
        "end": 67589,
        "value": "N"
      },
      {
        "start": 67592,
        "end": 67592,
        "value": "N"
      },
      {
        "start": 67594,
        "end": 67637,
        "value": "N"
      },
      {
        "start": 67639,
        "end": 67640,
        "value": "N"
      },
      {
        "start": 67644,
        "end": 67644,
        "value": "N"
      },
      {
        "start": 67647,
        "end": 67669,
        "value": "N"
      },
      {
        "start": 67671,
        "end": 67742,
        "value": "N"
      },
      {
        "start": 67751,
        "end": 67759,
        "value": "N"
      },
      {
        "start": 67808,
        "end": 67826,
        "value": "N"
      },
      {
        "start": 67828,
        "end": 67829,
        "value": "N"
      },
      {
        "start": 67835,
        "end": 67867,
        "value": "N"
      },
      {
        "start": 67871,
        "end": 67897,
        "value": "N"
      },
      {
        "start": 67903,
        "end": 67929,
        "value": "N"
      },
      {
        "start": 67968,
        "end": 68023,
        "value": "N"
      },
      {
        "start": 68028,
        "end": 68047,
        "value": "N"
      },
      {
        "start": 68050,
        "end": 68099,
        "value": "N"
      },
      {
        "start": 68101,
        "end": 68102,
        "value": "N"
      },
      {
        "start": 68108,
        "end": 68115,
        "value": "N"
      },
      {
        "start": 68117,
        "end": 68119,
        "value": "N"
      },
      {
        "start": 68121,
        "end": 68149,
        "value": "N"
      },
      {
        "start": 68152,
        "end": 68154,
        "value": "N"
      },
      {
        "start": 68159,
        "end": 68168,
        "value": "N"
      },
      {
        "start": 68176,
        "end": 68184,
        "value": "N"
      },
      {
        "start": 68192,
        "end": 68255,
        "value": "N"
      },
      {
        "start": 68288,
        "end": 68326,
        "value": "N"
      },
      {
        "start": 68331,
        "end": 68342,
        "value": "N"
      },
      {
        "start": 68352,
        "end": 68405,
        "value": "N"
      },
      {
        "start": 68409,
        "end": 68437,
        "value": "N"
      },
      {
        "start": 68440,
        "end": 68466,
        "value": "N"
      },
      {
        "start": 68472,
        "end": 68497,
        "value": "N"
      },
      {
        "start": 68505,
        "end": 68508,
        "value": "N"
      },
      {
        "start": 68521,
        "end": 68527,
        "value": "N"
      },
      {
        "start": 68608,
        "end": 68680,
        "value": "N"
      },
      {
        "start": 68736,
        "end": 68786,
        "value": "N"
      },
      {
        "start": 68800,
        "end": 68850,
        "value": "N"
      },
      {
        "start": 68858,
        "end": 68903,
        "value": "N"
      },
      {
        "start": 68912,
        "end": 68921,
        "value": "N"
      },
      {
        "start": 68928,
        "end": 68965,
        "value": "N"
      },
      {
        "start": 68969,
        "end": 68997,
        "value": "N"
      },
      {
        "start": 69006,
        "end": 69007,
        "value": "N"
      },
      {
        "start": 69216,
        "end": 69246,
        "value": "N"
      },
      {
        "start": 69248,
        "end": 69289,
        "value": "N"
      },
      {
        "start": 69291,
        "end": 69293,
        "value": "N"
      },
      {
        "start": 69296,
        "end": 69297,
        "value": "N"
      },
      {
        "start": 69314,
        "end": 69319,
        "value": "N"
      },
      {
        "start": 69328,
        "end": 69336,
        "value": "N"
      },
      {
        "start": 69370,
        "end": 69415,
        "value": "N"
      },
      {
        "start": 69424,
        "end": 69465,
        "value": "N"
      },
      {
        "start": 69488,
        "end": 69513,
        "value": "N"
      },
      {
        "start": 69552,
        "end": 69579,
        "value": "N"
      },
      {
        "start": 69600,
        "end": 69622,
        "value": "N"
      },
      {
        "start": 69632,
        "end": 69709,
        "value": "N"
      },
      {
        "start": 69714,
        "end": 69749,
        "value": "N"
      },
      {
        "start": 69759,
        "end": 69826,
        "value": "N"
      },
      {
        "start": 69837,
        "end": 69837,
        "value": "N"
      },
      {
        "start": 69840,
        "end": 69864,
        "value": "N"
      },
      {
        "start": 69872,
        "end": 69881,
        "value": "N"
      },
      {
        "start": 69888,
        "end": 69940,
        "value": "N"
      },
      {
        "start": 69942,
        "end": 69959,
        "value": "N"
      },
      {
        "start": 69968,
        "end": 70006,
        "value": "N"
      },
      {
        "start": 70016,
        "end": 70111,
        "value": "N"
      },
      {
        "start": 70113,
        "end": 70132,
        "value": "N"
      },
      {
        "start": 70144,
        "end": 70161,
        "value": "N"
      },
      {
        "start": 70163,
        "end": 70209,
        "value": "N"
      },
      {
        "start": 70272,
        "end": 70278,
        "value": "N"
      },
      {
        "start": 70280,
        "end": 70280,
        "value": "N"
      },
      {
        "start": 70282,
        "end": 70285,
        "value": "N"
      },
      {
        "start": 70287,
        "end": 70301,
        "value": "N"
      },
      {
        "start": 70303,
        "end": 70313,
        "value": "N"
      },
      {
        "start": 70320,
        "end": 70378,
        "value": "N"
      },
      {
        "start": 70384,
        "end": 70393,
        "value": "N"
      },
      {
        "start": 70400,
        "end": 70403,
        "value": "N"
      },
      {
        "start": 70405,
        "end": 70412,
        "value": "N"
      },
      {
        "start": 70415,
        "end": 70416,
        "value": "N"
      },
      {
        "start": 70419,
        "end": 70440,
        "value": "N"
      },
      {
        "start": 70442,
        "end": 70448,
        "value": "N"
      },
      {
        "start": 70450,
        "end": 70451,
        "value": "N"
      },
      {
        "start": 70453,
        "end": 70457,
        "value": "N"
      },
      {
        "start": 70459,
        "end": 70468,
        "value": "N"
      },
      {
        "start": 70471,
        "end": 70472,
        "value": "N"
      },
      {
        "start": 70475,
        "end": 70477,
        "value": "N"
      },
      {
        "start": 70480,
        "end": 70480,
        "value": "N"
      },
      {
        "start": 70487,
        "end": 70487,
        "value": "N"
      },
      {
        "start": 70493,
        "end": 70499,
        "value": "N"
      },
      {
        "start": 70502,
        "end": 70508,
        "value": "N"
      },
      {
        "start": 70512,
        "end": 70516,
        "value": "N"
      },
      {
        "start": 70528,
        "end": 70537,
        "value": "N"
      },
      {
        "start": 70539,
        "end": 70539,
        "value": "N"
      },
      {
        "start": 70542,
        "end": 70542,
        "value": "N"
      },
      {
        "start": 70544,
        "end": 70581,
        "value": "N"
      },
      {
        "start": 70583,
        "end": 70592,
        "value": "N"
      },
      {
        "start": 70594,
        "end": 70594,
        "value": "N"
      },
      {
        "start": 70597,
        "end": 70597,
        "value": "N"
      },
      {
        "start": 70599,
        "end": 70602,
        "value": "N"
      },
      {
        "start": 70604,
        "end": 70613,
        "value": "N"
      },
      {
        "start": 70615,
        "end": 70616,
        "value": "N"
      },
      {
        "start": 70625,
        "end": 70626,
        "value": "N"
      },
      {
        "start": 70656,
        "end": 70747,
        "value": "N"
      },
      {
        "start": 70749,
        "end": 70753,
        "value": "N"
      },
      {
        "start": 70784,
        "end": 70855,
        "value": "N"
      },
      {
        "start": 70864,
        "end": 70873,
        "value": "N"
      },
      {
        "start": 71040,
        "end": 71093,
        "value": "N"
      },
      {
        "start": 71096,
        "end": 71133,
        "value": "N"
      },
      {
        "start": 71168,
        "end": 71236,
        "value": "N"
      },
      {
        "start": 71248,
        "end": 71257,
        "value": "N"
      },
      {
        "start": 71264,
        "end": 71276,
        "value": "N"
      },
      {
        "start": 71296,
        "end": 71353,
        "value": "N"
      },
      {
        "start": 71360,
        "end": 71369,
        "value": "N"
      },
      {
        "start": 71376,
        "end": 71395,
        "value": "N"
      },
      {
        "start": 71424,
        "end": 71450,
        "value": "N"
      },
      {
        "start": 71453,
        "end": 71467,
        "value": "N"
      },
      {
        "start": 71472,
        "end": 71494,
        "value": "N"
      },
      {
        "start": 71680,
        "end": 71739,
        "value": "N"
      },
      {
        "start": 71840,
        "end": 71922,
        "value": "N"
      },
      {
        "start": 71935,
        "end": 71942,
        "value": "N"
      },
      {
        "start": 71945,
        "end": 71945,
        "value": "N"
      },
      {
        "start": 71948,
        "end": 71955,
        "value": "N"
      },
      {
        "start": 71957,
        "end": 71958,
        "value": "N"
      },
      {
        "start": 71960,
        "end": 71989,
        "value": "N"
      },
      {
        "start": 71991,
        "end": 71992,
        "value": "N"
      },
      {
        "start": 71995,
        "end": 72006,
        "value": "N"
      },
      {
        "start": 72016,
        "end": 72025,
        "value": "N"
      },
      {
        "start": 72096,
        "end": 72103,
        "value": "N"
      },
      {
        "start": 72106,
        "end": 72151,
        "value": "N"
      },
      {
        "start": 72154,
        "end": 72164,
        "value": "N"
      },
      {
        "start": 72192,
        "end": 72263,
        "value": "N"
      },
      {
        "start": 72272,
        "end": 72354,
        "value": "N"
      },
      {
        "start": 72368,
        "end": 72440,
        "value": "N"
      },
      {
        "start": 72448,
        "end": 72457,
        "value": "N"
      },
      {
        "start": 72544,
        "end": 72551,
        "value": "N"
      },
      {
        "start": 72640,
        "end": 72673,
        "value": "N"
      },
      {
        "start": 72688,
        "end": 72697,
        "value": "N"
      },
      {
        "start": 72704,
        "end": 72712,
        "value": "N"
      },
      {
        "start": 72714,
        "end": 72758,
        "value": "N"
      },
      {
        "start": 72760,
        "end": 72773,
        "value": "N"
      },
      {
        "start": 72784,
        "end": 72812,
        "value": "N"
      },
      {
        "start": 72816,
        "end": 72847,
        "value": "N"
      },
      {
        "start": 72850,
        "end": 72871,
        "value": "N"
      },
      {
        "start": 72873,
        "end": 72886,
        "value": "N"
      },
      {
        "start": 72960,
        "end": 72966,
        "value": "N"
      },
      {
        "start": 72968,
        "end": 72969,
        "value": "N"
      },
      {
        "start": 72971,
        "end": 73014,
        "value": "N"
      },
      {
        "start": 73018,
        "end": 73018,
        "value": "N"
      },
      {
        "start": 73020,
        "end": 73021,
        "value": "N"
      },
      {
        "start": 73023,
        "end": 73031,
        "value": "N"
      },
      {
        "start": 73040,
        "end": 73049,
        "value": "N"
      },
      {
        "start": 73056,
        "end": 73061,
        "value": "N"
      },
      {
        "start": 73063,
        "end": 73064,
        "value": "N"
      },
      {
        "start": 73066,
        "end": 73102,
        "value": "N"
      },
      {
        "start": 73104,
        "end": 73105,
        "value": "N"
      },
      {
        "start": 73107,
        "end": 73112,
        "value": "N"
      },
      {
        "start": 73120,
        "end": 73129,
        "value": "N"
      },
      {
        "start": 73136,
        "end": 73179,
        "value": "N"
      },
      {
        "start": 73184,
        "end": 73193,
        "value": "N"
      },
      {
        "start": 73440,
        "end": 73464,
        "value": "N"
      },
      {
        "start": 73472,
        "end": 73488,
        "value": "N"
      },
      {
        "start": 73490,
        "end": 73530,
        "value": "N"
      },
      {
        "start": 73534,
        "end": 73562,
        "value": "N"
      },
      {
        "start": 73648,
        "end": 73648,
        "value": "N"
      },
      {
        "start": 73664,
        "end": 73713,
        "value": "N"
      },
      {
        "start": 73727,
        "end": 74649,
        "value": "N"
      },
      {
        "start": 74752,
        "end": 74862,
        "value": "N"
      },
      {
        "start": 74864,
        "end": 74868,
        "value": "N"
      },
      {
        "start": 74880,
        "end": 75075,
        "value": "N"
      },
      {
        "start": 77712,
        "end": 77810,
        "value": "N"
      },
      {
        "start": 77824,
        "end": 78933,
        "value": "N"
      },
      {
        "start": 78944,
        "end": 82938,
        "value": "N"
      },
      {
        "start": 82944,
        "end": 83526,
        "value": "N"
      },
      {
        "start": 90368,
        "end": 90425,
        "value": "N"
      },
      {
        "start": 92160,
        "end": 92728,
        "value": "N"
      },
      {
        "start": 92736,
        "end": 92766,
        "value": "N"
      },
      {
        "start": 92768,
        "end": 92777,
        "value": "N"
      },
      {
        "start": 92782,
        "end": 92862,
        "value": "N"
      },
      {
        "start": 92864,
        "end": 92873,
        "value": "N"
      },
      {
        "start": 92880,
        "end": 92909,
        "value": "N"
      },
      {
        "start": 92912,
        "end": 92917,
        "value": "N"
      },
      {
        "start": 92928,
        "end": 92997,
        "value": "N"
      },
      {
        "start": 93008,
        "end": 93017,
        "value": "N"
      },
      {
        "start": 93019,
        "end": 93025,
        "value": "N"
      },
      {
        "start": 93027,
        "end": 93047,
        "value": "N"
      },
      {
        "start": 93053,
        "end": 93071,
        "value": "N"
      },
      {
        "start": 93504,
        "end": 93561,
        "value": "N"
      },
      {
        "start": 93760,
        "end": 93850,
        "value": "N"
      },
      {
        "start": 93856,
        "end": 93880,
        "value": "N"
      },
      {
        "start": 93883,
        "end": 93907,
        "value": "N"
      },
      {
        "start": 93952,
        "end": 94026,
        "value": "N"
      },
      {
        "start": 94031,
        "end": 94087,
        "value": "N"
      },
      {
        "start": 94095,
        "end": 94111,
        "value": "N"
      },
      {
        "start": 94176,
        "end": 94180,
        "value": "W"
      },
      {
        "start": 94192,
        "end": 94198,
        "value": "W"
      },
      {
        "start": 94208,
        "end": 101589,
        "value": "W"
      },
      {
        "start": 101631,
        "end": 101662,
        "value": "W"
      },
      {
        "start": 101760,
        "end": 101874,
        "value": "W"
      },
      {
        "start": 110576,
        "end": 110579,
        "value": "W"
      },
      {
        "start": 110581,
        "end": 110587,
        "value": "W"
      },
      {
        "start": 110589,
        "end": 110590,
        "value": "W"
      },
      {
        "start": 110592,
        "end": 110882,
        "value": "W"
      },
      {
        "start": 110898,
        "end": 110898,
        "value": "W"
      },
      {
        "start": 110928,
        "end": 110930,
        "value": "W"
      },
      {
        "start": 110933,
        "end": 110933,
        "value": "W"
      },
      {
        "start": 110948,
        "end": 110951,
        "value": "W"
      },
      {
        "start": 110960,
        "end": 111355,
        "value": "W"
      },
      {
        "start": 113664,
        "end": 113770,
        "value": "N"
      },
      {
        "start": 113776,
        "end": 113788,
        "value": "N"
      },
      {
        "start": 113792,
        "end": 113800,
        "value": "N"
      },
      {
        "start": 113808,
        "end": 113817,
        "value": "N"
      },
      {
        "start": 113820,
        "end": 113827,
        "value": "N"
      },
      {
        "start": 117760,
        "end": 118012,
        "value": "N"
      },
      {
        "start": 118016,
        "end": 118451,
        "value": "N"
      },
      {
        "start": 118458,
        "end": 118480,
        "value": "N"
      },
      {
        "start": 118496,
        "end": 118512,
        "value": "N"
      },
      {
        "start": 118528,
        "end": 118573,
        "value": "N"
      },
      {
        "start": 118576,
        "end": 118598,
        "value": "N"
      },
      {
        "start": 118608,
        "end": 118723,
        "value": "N"
      },
      {
        "start": 118784,
        "end": 119029,
        "value": "N"
      },
      {
        "start": 119040,
        "end": 119078,
        "value": "N"
      },
      {
        "start": 119081,
        "end": 119274,
        "value": "N"
      },
      {
        "start": 119296,
        "end": 119365,
        "value": "N"
      },
      {
        "start": 119488,
        "end": 119507,
        "value": "N"
      },
      {
        "start": 119520,
        "end": 119539,
        "value": "N"
      },
      {
        "start": 119552,
        "end": 119638,
        "value": "W"
      },
      {
        "start": 119648,
        "end": 119670,
        "value": "W"
      },
      {
        "start": 119671,
        "end": 119672,
        "value": "N"
      },
      {
        "start": 119808,
        "end": 119892,
        "value": "N"
      },
      {
        "start": 119894,
        "end": 119964,
        "value": "N"
      },
      {
        "start": 119966,
        "end": 119967,
        "value": "N"
      },
      {
        "start": 119970,
        "end": 119970,
        "value": "N"
      },
      {
        "start": 119973,
        "end": 119974,
        "value": "N"
      },
      {
        "start": 119977,
        "end": 119980,
        "value": "N"
      },
      {
        "start": 119982,
        "end": 119993,
        "value": "N"
      },
      {
        "start": 119995,
        "end": 119995,
        "value": "N"
      },
      {
        "start": 119997,
        "end": 120003,
        "value": "N"
      },
      {
        "start": 120005,
        "end": 120069,
        "value": "N"
      },
      {
        "start": 120071,
        "end": 120074,
        "value": "N"
      },
      {
        "start": 120077,
        "end": 120084,
        "value": "N"
      },
      {
        "start": 120086,
        "end": 120092,
        "value": "N"
      },
      {
        "start": 120094,
        "end": 120121,
        "value": "N"
      },
      {
        "start": 120123,
        "end": 120126,
        "value": "N"
      },
      {
        "start": 120128,
        "end": 120132,
        "value": "N"
      },
      {
        "start": 120134,
        "end": 120134,
        "value": "N"
      },
      {
        "start": 120138,
        "end": 120144,
        "value": "N"
      },
      {
        "start": 120146,
        "end": 120485,
        "value": "N"
      },
      {
        "start": 120488,
        "end": 120779,
        "value": "N"
      },
      {
        "start": 120782,
        "end": 121483,
        "value": "N"
      },
      {
        "start": 121499,
        "end": 121503,
        "value": "N"
      },
      {
        "start": 121505,
        "end": 121519,
        "value": "N"
      },
      {
        "start": 122624,
        "end": 122654,
        "value": "N"
      },
      {
        "start": 122661,
        "end": 122666,
        "value": "N"
      },
      {
        "start": 122880,
        "end": 122886,
        "value": "N"
      },
      {
        "start": 122888,
        "end": 122904,
        "value": "N"
      },
      {
        "start": 122907,
        "end": 122913,
        "value": "N"
      },
      {
        "start": 122915,
        "end": 122916,
        "value": "N"
      },
      {
        "start": 122918,
        "end": 122922,
        "value": "N"
      },
      {
        "start": 122928,
        "end": 122989,
        "value": "N"
      },
      {
        "start": 123023,
        "end": 123023,
        "value": "N"
      },
      {
        "start": 123136,
        "end": 123180,
        "value": "N"
      },
      {
        "start": 123184,
        "end": 123197,
        "value": "N"
      },
      {
        "start": 123200,
        "end": 123209,
        "value": "N"
      },
      {
        "start": 123214,
        "end": 123215,
        "value": "N"
      },
      {
        "start": 123536,
        "end": 123566,
        "value": "N"
      },
      {
        "start": 123584,
        "end": 123641,
        "value": "N"
      },
      {
        "start": 123647,
        "end": 123647,
        "value": "N"
      },
      {
        "start": 124112,
        "end": 124153,
        "value": "N"
      },
      {
        "start": 124368,
        "end": 124410,
        "value": "N"
      },
      {
        "start": 124415,
        "end": 124415,
        "value": "N"
      },
      {
        "start": 124608,
        "end": 124638,
        "value": "N"
      },
      {
        "start": 124640,
        "end": 124661,
        "value": "N"
      },
      {
        "start": 124670,
        "end": 124671,
        "value": "N"
      },
      {
        "start": 124896,
        "end": 124902,
        "value": "N"
      },
      {
        "start": 124904,
        "end": 124907,
        "value": "N"
      },
      {
        "start": 124909,
        "end": 124910,
        "value": "N"
      },
      {
        "start": 124912,
        "end": 124926,
        "value": "N"
      },
      {
        "start": 124928,
        "end": 125124,
        "value": "N"
      },
      {
        "start": 125127,
        "end": 125142,
        "value": "N"
      },
      {
        "start": 125184,
        "end": 125259,
        "value": "N"
      },
      {
        "start": 125264,
        "end": 125273,
        "value": "N"
      },
      {
        "start": 125278,
        "end": 125279,
        "value": "N"
      },
      {
        "start": 126065,
        "end": 126132,
        "value": "N"
      },
      {
        "start": 126209,
        "end": 126269,
        "value": "N"
      },
      {
        "start": 126464,
        "end": 126467,
        "value": "N"
      },
      {
        "start": 126469,
        "end": 126495,
        "value": "N"
      },
      {
        "start": 126497,
        "end": 126498,
        "value": "N"
      },
      {
        "start": 126500,
        "end": 126500,
        "value": "N"
      },
      {
        "start": 126503,
        "end": 126503,
        "value": "N"
      },
      {
        "start": 126505,
        "end": 126514,
        "value": "N"
      },
      {
        "start": 126516,
        "end": 126519,
        "value": "N"
      },
      {
        "start": 126521,
        "end": 126521,
        "value": "N"
      },
      {
        "start": 126523,
        "end": 126523,
        "value": "N"
      },
      {
        "start": 126530,
        "end": 126530,
        "value": "N"
      },
      {
        "start": 126535,
        "end": 126535,
        "value": "N"
      },
      {
        "start": 126537,
        "end": 126537,
        "value": "N"
      },
      {
        "start": 126539,
        "end": 126539,
        "value": "N"
      },
      {
        "start": 126541,
        "end": 126543,
        "value": "N"
      },
      {
        "start": 126545,
        "end": 126546,
        "value": "N"
      },
      {
        "start": 126548,
        "end": 126548,
        "value": "N"
      },
      {
        "start": 126551,
        "end": 126551,
        "value": "N"
      },
      {
        "start": 126553,
        "end": 126553,
        "value": "N"
      },
      {
        "start": 126555,
        "end": 126555,
        "value": "N"
      },
      {
        "start": 126557,
        "end": 126557,
        "value": "N"
      },
      {
        "start": 126559,
        "end": 126559,
        "value": "N"
      },
      {
        "start": 126561,
        "end": 126562,
        "value": "N"
      },
      {
        "start": 126564,
        "end": 126564,
        "value": "N"
      },
      {
        "start": 126567,
        "end": 126570,
        "value": "N"
      },
      {
        "start": 126572,
        "end": 126578,
        "value": "N"
      },
      {
        "start": 126580,
        "end": 126583,
        "value": "N"
      },
      {
        "start": 126585,
        "end": 126588,
        "value": "N"
      },
      {
        "start": 126590,
        "end": 126590,
        "value": "N"
      },
      {
        "start": 126592,
        "end": 126601,
        "value": "N"
      },
      {
        "start": 126603,
        "end": 126619,
        "value": "N"
      },
      {
        "start": 126625,
        "end": 126627,
        "value": "N"
      },
      {
        "start": 126629,
        "end": 126633,
        "value": "N"
      },
      {
        "start": 126635,
        "end": 126651,
        "value": "N"
      },
      {
        "start": 126704,
        "end": 126705,
        "value": "N"
      },
      {
        "start": 126976,
        "end": 126979,
        "value": "N"
      },
      {
        "start": 126980,
        "end": 126980,
        "value": "W"
      },
      {
        "start": 126981,
        "end": 127019,
        "value": "N"
      },
      {
        "start": 127024,
        "end": 127123,
        "value": "N"
      },
      {
        "start": 127136,
        "end": 127150,
        "value": "N"
      },
      {
        "start": 127153,
        "end": 127167,
        "value": "N"
      },
      {
        "start": 127169,
        "end": 127182,
        "value": "N"
      },
      {
        "start": 127183,
        "end": 127183,
        "value": "W"
      },
      {
        "start": 127185,
        "end": 127221,
        "value": "N"
      },
      {
        "start": 127232,
        "end": 127242,
        "value": "A"
      },
      {
        "start": 127243,
        "end": 127247,
        "value": "N"
      },
      {
        "start": 127248,
        "end": 127277,
        "value": "A"
      },
      {
        "start": 127278,
        "end": 127279,
        "value": "N"
      },
      {
        "start": 127280,
        "end": 127337,
        "value": "A"
      },
      {
        "start": 127338,
        "end": 127343,
        "value": "N"
      },
      {
        "start": 127344,
        "end": 127373,
        "value": "A"
      },
      {
        "start": 127374,
        "end": 127374,
        "value": "W"
      },
      {
        "start": 127375,
        "end": 127376,
        "value": "A"
      },
      {
        "start": 127377,
        "end": 127386,
        "value": "W"
      },
      {
        "start": 127387,
        "end": 127404,
        "value": "A"
      },
      {
        "start": 127405,
        "end": 127405,
        "value": "N"
      },
      {
        "start": 127462,
        "end": 127487,
        "value": "N"
      },
      {
        "start": 127488,
        "end": 127490,
        "value": "W"
      },
      {
        "start": 127504,
        "end": 127547,
        "value": "W"
      },
      {
        "start": 127552,
        "end": 127560,
        "value": "W"
      },
      {
        "start": 127568,
        "end": 127569,
        "value": "W"
      },
      {
        "start": 127584,
        "end": 127589,
        "value": "W"
      },
      {
        "start": 127744,
        "end": 127776,
        "value": "W"
      },
      {
        "start": 127777,
        "end": 127788,
        "value": "N"
      },
      {
        "start": 127789,
        "end": 127797,
        "value": "W"
      },
      {
        "start": 127798,
        "end": 127798,
        "value": "N"
      },
      {
        "start": 127799,
        "end": 127868,
        "value": "W"
      },
      {
        "start": 127869,
        "end": 127869,
        "value": "N"
      },
      {
        "start": 127870,
        "end": 127891,
        "value": "W"
      },
      {
        "start": 127892,
        "end": 127903,
        "value": "N"
      },
      {
        "start": 127904,
        "end": 127946,
        "value": "W"
      },
      {
        "start": 127947,
        "end": 127950,
        "value": "N"
      },
      {
        "start": 127951,
        "end": 127955,
        "value": "W"
      },
      {
        "start": 127956,
        "end": 127967,
        "value": "N"
      },
      {
        "start": 127968,
        "end": 127984,
        "value": "W"
      },
      {
        "start": 127985,
        "end": 127987,
        "value": "N"
      },
      {
        "start": 127988,
        "end": 127988,
        "value": "W"
      },
      {
        "start": 127989,
        "end": 127991,
        "value": "N"
      },
      {
        "start": 127992,
        "end": 128062,
        "value": "W"
      },
      {
        "start": 128063,
        "end": 128063,
        "value": "N"
      },
      {
        "start": 128064,
        "end": 128064,
        "value": "W"
      },
      {
        "start": 128065,
        "end": 128065,
        "value": "N"
      },
      {
        "start": 128066,
        "end": 128252,
        "value": "W"
      },
      {
        "start": 128253,
        "end": 128254,
        "value": "N"
      },
      {
        "start": 128255,
        "end": 128317,
        "value": "W"
      },
      {
        "start": 128318,
        "end": 128330,
        "value": "N"
      },
      {
        "start": 128331,
        "end": 128334,
        "value": "W"
      },
      {
        "start": 128335,
        "end": 128335,
        "value": "N"
      },
      {
        "start": 128336,
        "end": 128359,
        "value": "W"
      },
      {
        "start": 128360,
        "end": 128377,
        "value": "N"
      },
      {
        "start": 128378,
        "end": 128378,
        "value": "W"
      },
      {
        "start": 128379,
        "end": 128404,
        "value": "N"
      },
      {
        "start": 128405,
        "end": 128406,
        "value": "W"
      },
      {
        "start": 128407,
        "end": 128419,
        "value": "N"
      },
      {
        "start": 128420,
        "end": 128420,
        "value": "W"
      },
      {
        "start": 128421,
        "end": 128506,
        "value": "N"
      },
      {
        "start": 128507,
        "end": 128591,
        "value": "W"
      },
      {
        "start": 128592,
        "end": 128639,
        "value": "N"
      },
      {
        "start": 128640,
        "end": 128709,
        "value": "W"
      },
      {
        "start": 128710,
        "end": 128715,
        "value": "N"
      },
      {
        "start": 128716,
        "end": 128716,
        "value": "W"
      },
      {
        "start": 128717,
        "end": 128719,
        "value": "N"
      },
      {
        "start": 128720,
        "end": 128722,
        "value": "W"
      },
      {
        "start": 128723,
        "end": 128724,
        "value": "N"
      },
      {
        "start": 128725,
        "end": 128728,
        "value": "W"
      },
      {
        "start": 128732,
        "end": 128735,
        "value": "W"
      },
      {
        "start": 128736,
        "end": 128746,
        "value": "N"
      },
      {
        "start": 128747,
        "end": 128748,
        "value": "W"
      },
      {
        "start": 128752,
        "end": 128755,
        "value": "N"
      },
      {
        "start": 128756,
        "end": 128764,
        "value": "W"
      },
      {
        "start": 128768,
        "end": 128985,
        "value": "N"
      },
      {
        "start": 128992,
        "end": 129003,
        "value": "W"
      },
      {
        "start": 129008,
        "end": 129008,
        "value": "W"
      },
      {
        "start": 129024,
        "end": 129035,
        "value": "N"
      },
      {
        "start": 129040,
        "end": 129095,
        "value": "N"
      },
      {
        "start": 129104,
        "end": 129113,
        "value": "N"
      },
      {
        "start": 129120,
        "end": 129159,
        "value": "N"
      },
      {
        "start": 129168,
        "end": 129197,
        "value": "N"
      },
      {
        "start": 129200,
        "end": 129211,
        "value": "N"
      },
      {
        "start": 129216,
        "end": 129217,
        "value": "N"
      },
      {
        "start": 129232,
        "end": 129240,
        "value": "N"
      },
      {
        "start": 129280,
        "end": 129291,
        "value": "N"
      },
      {
        "start": 129292,
        "end": 129338,
        "value": "W"
      },
      {
        "start": 129339,
        "end": 129339,
        "value": "N"
      },
      {
        "start": 129340,
        "end": 129349,
        "value": "W"
      },
      {
        "start": 129350,
        "end": 129350,
        "value": "N"
      },
      {
        "start": 129351,
        "end": 129535,
        "value": "W"
      },
      {
        "start": 129536,
        "end": 129623,
        "value": "N"
      },
      {
        "start": 129632,
        "end": 129645,
        "value": "N"
      },
      {
        "start": 129648,
        "end": 129660,
        "value": "W"
      },
      {
        "start": 129664,
        "end": 129674,
        "value": "W"
      },
      {
        "start": 129678,
        "end": 129734,
        "value": "W"
      },
      {
        "start": 129736,
        "end": 129736,
        "value": "W"
      },
      {
        "start": 129741,
        "end": 129756,
        "value": "W"
      },
      {
        "start": 129759,
        "end": 129770,
        "value": "W"
      },
      {
        "start": 129775,
        "end": 129784,
        "value": "W"
      },
      {
        "start": 129792,
        "end": 129938,
        "value": "N"
      },
      {
        "start": 129940,
        "end": 130042,
        "value": "N"
      },
      {
        "start": 131072,
        "end": 196605,
        "value": "W"
      },
      {
        "start": 196608,
        "end": 262141,
        "value": "W"
      },
      {
        "start": 917505,
        "end": 917505,
        "value": "N"
      },
      {
        "start": 917536,
        "end": 917631,
        "value": "N"
      },
      {
        "start": 917760,
        "end": 917999,
        "value": "A"
      },
      {
        "start": 983040,
        "end": 1048573,
        "value": "A"
      },
      {
        "start": 1048576,
        "end": 1114109,
        "value": "A"
      }
    ],
    "emoji": [
      {
        "property": "Emoji",
        "ranges": [
          {
            "start": 35,
            "end": 35
          },
          {
            "start": 42,
            "end": 42
          },
          {
            "start": 48,
            "end": 57
          },
          {
            "start": 169,
            "end": 169
          },
          {
            "start": 174,
            "end": 174
          },
          {
            "start": 8252,
            "end": 8252
          },
          {
            "start": 8265,
            "end": 8265
          },
          {
            "start": 8482,
            "end": 8482
          },
          {
            "start": 8505,
            "end": 8505
          },
          {
            "start": 8596,
            "end": 8601
          },
          {
            "start": 8617,
            "end": 8618
          },
          {
            "start": 8986,
            "end": 8987
          },
          {
            "start": 9000,
            "end": 9000
          },
          {
            "start": 9167,
            "end": 9167
          },
          {
            "start": 9193,
            "end": 9203
          },
          {
            "start": 9208,
            "end": 9210
          },
          {
            "start": 9410,
            "end": 9410
          },
          {
            "start": 9642,
            "end": 9643
          },
          {
            "start": 9654,
            "end": 9654
          },
          {
            "start": 9664,
            "end": 9664
          },
          {
            "start": 9723,
            "end": 9726
          },
          {
            "start": 9728,
            "end": 9732
          },
          {
            "start": 9742,
            "end": 9742
          },
          {
            "start": 9745,
            "end": 9745
          },
          {
            "start": 9748,
            "end": 9749
          },
          {
            "start": 9752,
            "end": 9752
          },
          {
            "start": 9757,
            "end": 9757
          },
          {
            "start": 9760,
            "end": 9760
          },
          {
            "start": 9762,
            "end": 9763
          },
          {
            "start": 9766,
            "end": 9766
          },
          {
            "start": 9770,
            "end": 9770
          },
          {
            "start": 9774,
            "end": 9775
          },
          {
            "start": 9784,
            "end": 9786
          },
          {
            "start": 9792,
            "end": 9792
          },
          {
            "start": 9794,
            "end": 9794
          },
          {
            "start": 9800,
            "end": 9811
          },
          {
            "start": 9823,
            "end": 9824
          },
          {
            "start": 9827,
            "end": 9827
          },
          {
            "start": 9829,
            "end": 9830
          },
          {
            "start": 9832,
            "end": 9832
          },
          {
            "start": 9851,
            "end": 9851
          },
          {
            "start": 9854,
            "end": 9855
          },
          {
            "start": 9874,
            "end": 9879
          },
          {
            "start": 9881,
            "end": 9881
          },
          {
            "start": 9883,
            "end": 9884
          },
          {
            "start": 9888,
            "end": 9889
          },
          {
            "start": 9895,
            "end": 9895
          },
          {
            "start": 9898,
            "end": 9899
          },
          {
            "start": 9904,
            "end": 9905
          },
          {
            "start": 9917,
            "end": 9918
          },
          {
            "start": 9924,
            "end": 9925
          },
          {
            "start": 9928,
            "end": 9928
          },
          {
            "start": 9934,
            "end": 9935
          },
          {
            "start": 9937,
            "end": 9937
          },
          {
            "start": 9939,
            "end": 9940
          },
          {
            "start": 9961,
            "end": 9962
          },
          {
            "start": 9968,
            "end": 9973
          },
          {
            "start": 9975,
            "end": 9978
          },
          {
            "start": 9981,
            "end": 9981
          },
          {
            "start": 9986,
            "end": 9986
          },
          {
            "start": 9989,
            "end": 9989
          },
          {
            "start": 9992,
            "end": 9997
          },
          {
            "start": 9999,
            "end": 9999
          },
          {
            "start": 10002,
            "end": 10002
          },
          {
            "start": 10004,
            "end": 10004
          },
          {
            "start": 10006,
            "end": 10006
          },
          {
            "start": 10013,
            "end": 10013
          },
          {
            "start": 10017,
            "end": 10017
          },
          {
            "start": 10024,
            "end": 10024
          },
          {
            "start": 10035,
            "end": 10036
          },
          {
            "start": 10052,
            "end": 10052
          },
          {
            "start": 10055,
            "end": 10055
          },
          {
            "start": 10060,
            "end": 10060
          },
          {
            "start": 10062,
            "end": 10062
          },
          {
            "start": 10067,
            "end": 10069
          },
          {
            "start": 10071,
            "end": 10071
          },
          {
            "start": 10083,
            "end": 10084
          },
          {
            "start": 10133,
            "end": 10135
          },
          {
            "start": 10145,
            "end": 10145
          },
          {
            "start": 10160,
            "end": 10160
          },
          {
            "start": 10175,
            "end": 10175
          },
          {
            "start": 10548,
            "end": 10549
          },
          {
            "start": 11013,
            "end": 11015
          },
          {
            "start": 11035,
            "end": 11036
          },
          {
            "start": 11088,
            "end": 11088
          },
          {
            "start": 11093,
            "end": 11093
          },
          {
            "start": 12336,
            "end": 12336
          },
          {
            "start": 12349,
            "end": 12349
          },
          {
            "start": 12951,
            "end": 12951
          },
          {
            "start": 12953,
            "end": 12953
          },
          {
            "start": 126980,
            "end": 126980
          },
          {
            "start": 127183,
            "end": 127183
          },
          {
            "start": 127344,
            "end": 127345
          },
          {
            "start": 127358,
            "end": 127359
          },
          {
            "start": 127374,
            "end": 127374
          },
          {
            "start": 127377,
            "end": 127386
          },
          {
            "start": 127462,
            "end": 127487
          },
          {
            "start": 127489,
            "end": 127490
          },
          {
            "start": 127514,
            "end": 127514
          },
          {
            "start": 127535,
            "end": 127535
          },
          {
            "start": 127538,
            "end": 127546
          },
          {
            "start": 127568,
            "end": 127569
          },
          {
            "start": 127744,
            "end": 127777
          },
          {
            "start": 127780,
            "end": 127891
          },
          {
            "start": 127894,
            "end": 127895
          },
          {
            "start": 127897,
            "end": 127899
          },
          {
            "start": 127902,
            "end": 127984
          },
          {
            "start": 127987,
            "end": 127989
          },
          {
            "start": 127991,
            "end": 128253
          },
          {
            "start": 128255,
            "end": 128317
          },
          {
            "start": 128329,
            "end": 128334
          },
          {
            "start": 128336,
            "end": 128359
          },
          {
            "start": 128367,
            "end": 128368
          },
          {
            "start": 128371,
            "end": 128378
          },
          {
            "start": 128391,
            "end": 128391
          },
          {
            "start": 128394,
            "end": 128397
          },
          {
            "start": 128400,
            "end": 128400
          },
          {
            "start": 128405,
            "end": 128406
          },
          {
            "start": 128420,
            "end": 128421
          },
          {
            "start": 128424,
            "end": 128424
          },
          {
            "start": 128433,
            "end": 128434
          },
          {
            "start": 128444,
            "end": 128444
          },
          {
            "start": 128450,
            "end": 128452
          },
          {
            "start": 128465,
            "end": 128467
          },
          {
            "start": 128476,
            "end": 128478
          },
          {
            "start": 128481,
            "end": 128481
          },
          {
            "start": 128483,
            "end": 128483
          },
          {
            "start": 128488,
            "end": 128488
          },
          {
            "start": 128495,
            "end": 128495
          },
          {
            "start": 128499,
            "end": 128499
          },
          {
            "start": 128506,
            "end": 128591
          },
          {
            "start": 128640,
            "end": 128709
          },
          {
            "start": 128715,
            "end": 128722
          },
          {
            "start": 128725,
            "end": 128728
          },
          {
            "start": 128732,
            "end": 128741
          },
          {
            "start": 128745,
            "end": 128745
          },
          {
            "start": 128747,
            "end": 128748
          },
          {
            "start": 128752,
            "end": 128752
          },
          {
            "start": 128755,
            "end": 128764
          },
          {
            "start": 128992,
            "end": 129003
          },
          {
            "start": 129008,
            "end": 129008
          },
          {
            "start": 129292,
            "end": 129338
          },
          {
            "start": 129340,
            "end": 129349
          },
          {
            "start": 129351,
            "end": 129535
          },
          {
            "start": 129648,
            "end": 129660
          },
          {
            "start": 129664,
            "end": 129674
          },
          {
            "start": 129678,
            "end": 129734
          },
          {
            "start": 129736,
            "end": 129736
          },
          {
            "start": 129741,
            "end": 129756
          },
          {
            "start": 129759,
            "end": 129770
          },
          {
            "start": 129775,
            "end": 129784
          }
        ]
      },
      {
        "property": "Emoji_Component",
        "ranges": [
          {
            "start": 35,
            "end": 35
          },
          {
            "start": 42,
            "end": 42
          },
          {
            "start": 48,
            "end": 57
          },
          {
            "start": 8205,
            "end": 8205
          },
          {
            "start": 8419,
            "end": 8419
          },
          {
            "start": 65039,
            "end": 65039
          },
          {
            "start": 127462,
            "end": 127487
          },
          {
            "start": 127995,
            "end": 127999
          },
          {
            "start": 129456,
            "end": 129459
          },
          {
            "start": 917536,
            "end": 917631
          }
        ]
      },
      {
        "property": "Emoji_Modifier",
        "ranges": [
          {
            "start": 127995,
            "end": 127999
          }
        ]
      },
      {
        "property": "Emoji_Modifier_Base",
        "ranges": [
          {
            "start": 9757,
            "end": 9757
          },
          {
            "start": 9977,
            "end": 9977
          },
          {
            "start": 9994,
            "end": 9997
          },
          {
            "start": 127877,
            "end": 127877
          },
          {
            "start": 127938,
            "end": 127940
          },
          {
            "start": 127943,
            "end": 127943
          },
          {
            "start": 127946,
            "end": 127948
          },
          {
            "start": 128066,
            "end": 128067
          },
          {
            "start": 128070,
            "end": 128080
          },
          {
            "start": 128102,
            "end": 128120
          },
          {
            "start": 128124,
            "end": 128124
          },
          {
            "start": 128129,
            "end": 128131
          },
          {
            "start": 128133,
            "end": 128135
          },
          {
            "start": 128143,
            "end": 128143
          },
          {
            "start": 128145,
            "end": 128145
          },
          {
            "start": 128170,
            "end": 128170
          },
          {
            "start": 128372,
            "end": 128373
          },
          {
            "start": 128378,
            "end": 128378
          },
          {
            "start": 128400,
            "end": 128400
          },
          {
            "start": 128405,
            "end": 128406
          },
          {
            "start": 128581,
            "end": 128583
          },
          {
            "start": 128587,
            "end": 128591
          },
          {
            "start": 128675,
            "end": 128675
          },
          {
            "start": 128692,
            "end": 128694
          },
          {
            "start": 128704,
            "end": 128704
          },
          {
            "start": 128716,
            "end": 128716
          },
          {
            "start": 129292,
            "end": 129292
          },
          {
            "start": 129295,
            "end": 129295
          },
          {
            "start": 129304,
            "end": 129311
          },
          {
            "start": 129318,
            "end": 129318
          },
          {
            "start": 129328,
            "end": 129337
          },
          {
            "start": 129340,
            "end": 129342
          },
          {
            "start": 129399,
            "end": 129399
          },
          {
            "start": 129461,
            "end": 129462
          },
          {
            "start": 129464,
            "end": 129465
          },
          {
            "start": 129467,
            "end": 129467
          },
          {
            "start": 129485,
            "end": 129487
          },
          {
            "start": 129489,
            "end": 129501
          },
          {
            "start": 129731,
            "end": 129733
          },
          {
            "start": 129776,
            "end": 129784
          }
        ]
      },
      {
        "property": "Emoji_Presentation",
        "ranges": [
          {
            "start": 8986,
            "end": 8987
          },
          {
            "start": 9193,
            "end": 9196
          },
          {
            "start": 9200,
            "end": 9200
          },
          {
            "start": 9203,
            "end": 9203
          },
          {
            "start": 9725,
            "end": 9726
          },
          {
            "start": 9748,
            "end": 9749
          },
          {
            "start": 9800,
            "end": 9811
          },
          {
            "start": 9855,
            "end": 9855
          },
          {
            "start": 9875,
            "end": 9875
          },
          {
            "start": 9889,
            "end": 9889
          },
          {
            "start": 9898,
            "end": 9899
          },
          {
            "start": 9917,
            "end": 9918
          },
          {
            "start": 9924,
            "end": 9925
          },
          {
            "start": 9934,
            "end": 9934
          },
          {
            "start": 9940,
            "end": 9940
          },
          {
            "start": 9962,
            "end": 9962
          },
          {
            "start": 9970,
            "end": 9971
          },
          {
            "start": 9973,
            "end": 9973
          },
          {
            "start": 9978,
            "end": 9978
          },
          {
            "start": 9981,
            "end": 9981
          },
          {
            "start": 9989,
            "end": 9989
          },
          {
            "start": 9994,
            "end": 9995
          },
          {
            "start": 10024,
            "end": 10024
          },
          {
            "start": 10060,
            "end": 10060
          },
          {
            "start": 10062,
            "end": 10062
          },
          {
            "start": 10067,
            "end": 10069
          },
          {
            "start": 10071,
            "end": 10071
          },
          {
            "start": 10133,
            "end": 10135
          },
          {
            "start": 10160,
            "end": 10160
          },
          {
            "start": 10175,
            "end": 10175
          },
          {
            "start": 11035,
            "end": 11036
          },
          {
            "start": 11088,
            "end": 11088
          },
          {
            "start": 11093,
            "end": 11093
          },
          {
            "start": 126980,
            "end": 126980
          },
          {
            "start": 127183,
            "end": 127183
          },
          {
            "start": 127374,
            "end": 127374
          },
          {
            "start": 127377,
            "end": 127386
          },
          {
            "start": 127462,
            "end": 127487
          },
          {
            "start": 127489,
            "end": 127489
          },
          {
            "start": 127514,
            "end": 127514
          },
          {
            "start": 127535,
            "end": 127535
          },
          {
            "start": 127538,
            "end": 127542
          },
          {
            "start": 127544,
            "end": 127546
          },
          {
            "start": 127568,
            "end": 127569
          },
          {
            "start": 127744,
            "end": 127776
          },
          {
            "start": 127789,
            "end": 127797
          },
          {
            "start": 127799,
            "end": 127868
          },
          {
            "start": 127870,
            "end": 127891
          },
          {
            "start": 127904,
            "end": 127946
          },
          {
            "start": 127951,
            "end": 127955
          },
          {
            "start": 127968,
            "end": 127984
          },
          {
            "start": 127988,
            "end": 127988
          },
          {
            "start": 127992,
            "end": 128062
          },
          {
            "start": 128064,
            "end": 128064
          },
          {
            "start": 128066,
            "end": 128252
          },
          {
            "start": 128255,
            "end": 128317
          },
          {
            "start": 128331,
            "end": 128334
          },
          {
            "start": 128336,
            "end": 128359
          },
          {
            "start": 128378,
            "end": 128378
          },
          {
            "start": 128405,
            "end": 128406
          },
          {
            "start": 128420,
            "end": 128420
          },
          {
            "start": 128507,
            "end": 128591
          },
          {
            "start": 128640,
            "end": 128709
          },
          {
            "start": 128716,
            "end": 128716
          },
          {
            "start": 128720,
            "end": 128722
          },
          {
            "start": 128725,
            "end": 128728
          },
          {
            "start": 128732,
            "end": 128735
          },
          {
            "start": 128747,
            "end": 128748
          },
          {
            "start": 128756,
            "end": 128764
          },
          {
            "start": 128992,
            "end": 129003
          },
          {
            "start": 129008,
            "end": 129008
          },
          {
            "start": 129292,
            "end": 129338
          },
          {
            "start": 129340,
            "end": 129349
          },
          {
            "start": 129351,
            "end": 129535
          },
          {
            "start": 129648,
            "end": 129660
          },
          {
            "start": 129664,
            "end": 129674
          },
          {
            "start": 129678,
            "end": 129734
          },
          {
            "start": 129736,
            "end": 129736
          },
          {
            "start": 129741,
            "end": 129756
          },
          {
            "start": 129759,
            "end": 129770
          },
          {
            "start": 129775,
            "end": 129784
          }
        ]
      },
      {
        "property": "Extended_Pictographic",
        "ranges": [
          {
            "start": 169,
            "end": 169
          },
          {
            "start": 174,
            "end": 174
          },
          {
            "start": 8252,
            "end": 8252
          },
          {
            "start": 8265,
            "end": 8265
          },
          {
            "start": 8482,
            "end": 8482
          },
          {
            "start": 8505,
            "end": 8505
          },
          {
            "start": 8596,
            "end": 8601
          },
          {
            "start": 8617,
            "end": 8618
          },
          {
            "start": 8986,
            "end": 8987
          },
          {
            "start": 9000,
            "end": 9000
          },
          {
            "start": 9167,
            "end": 9167
          },
          {
            "start": 9193,
            "end": 9203
          },
          {
            "start": 9208,
            "end": 9210
          },
          {
            "start": 9410,
            "end": 9410
          },
          {
            "start": 9642,
            "end": 9643
          },
          {
            "start": 9654,
            "end": 9654
          },
          {
            "start": 9664,
            "end": 9664
          },
          {
            "start": 9723,
            "end": 9726
          },
          {
            "start": 9728,
            "end": 9732
          },
          {
            "start": 9742,
            "end": 9742
          },
          {
            "start": 9745,
            "end": 9745
          },
          {
            "start": 9748,
            "end": 9749
          },
          {
            "start": 9752,
            "end": 9752
          },
          {
            "start": 9757,
            "end": 9757
          },
          {
            "start": 9760,
            "end": 9760
          },
          {
            "start": 9762,
            "end": 9763
          },
          {
            "start": 9766,
            "end": 9766
          },
          {
            "start": 9770,
            "end": 9770
          },
          {
            "start": 9774,
            "end": 9775
          },
          {
            "start": 9784,
            "end": 9786
          },
          {
            "start": 9792,
            "end": 9792
          },
          {
            "start": 9794,
            "end": 9794
          },
          {
            "start": 9800,
            "end": 9811
          },
          {
            "start": 9823,
            "end": 9824
          },
          {
            "start": 9827,
            "end": 9827
          },
          {
            "start": 9829,
            "end": 9830
          },
          {
            "start": 9832,
            "end": 9832
          },
          {
            "start": 9851,
            "end": 9851
          },
          {
            "start": 9854,
            "end": 9855
          },
          {
            "start": 9874,
            "end": 9879
          },
          {
            "start": 9881,
            "end": 9881
          },
          {
            "start": 9883,
            "end": 9884
          },
          {
            "start": 9888,
            "end": 9889
          },
          {
            "start": 9895,
            "end": 9895
          },
          {
            "start": 9898,
            "end": 9899
          },
          {
            "start": 9904,
            "end": 9905
          },
          {
            "start": 9917,
            "end": 9918
          },
          {
            "start": 9924,
            "end": 9925
          },
          {
            "start": 9928,
            "end": 9928
          },
          {
            "start": 9934,
            "end": 9935
          },
          {
            "start": 9937,
            "end": 9937
          },
          {
            "start": 9939,
            "end": 9940
          },
          {
            "start": 9961,
            "end": 9962
          },
          {
            "start": 9968,
            "end": 9973
          },
          {
            "start": 9975,
            "end": 9978
          },
          {
            "start": 9981,
            "end": 9981
          },
          {
            "start": 9986,
            "end": 9986
          },
          {
            "start": 9989,
            "end": 9989
          },
          {
            "start": 9992,
            "end": 9997
          },
          {
            "start": 9999,
            "end": 9999
          },
          {
            "start": 10002,
            "end": 10002
          },
          {
            "start": 10004,
            "end": 10004
          },
          {
            "start": 10006,
            "end": 10006
          },
          {
            "start": 10013,
            "end": 10013
          },
          {
            "start": 10017,
            "end": 10017
          },
          {
            "start": 10024,
            "end": 10024
          },
          {
            "start": 10035,
            "end": 10036
          },
          {
            "start": 10052,
            "end": 10052
          },
          {
            "start": 10055,
            "end": 10055
          },
          {
            "start": 10060,
            "end": 10060
          },
          {
            "start": 10062,
            "end": 10062
          },
          {
            "start": 10067,
            "end": 10069
          },
          {
            "start": 10071,
            "end": 10071
          },
          {
            "start": 10083,
            "end": 10084
          },
          {
            "start": 10133,
            "end": 10135
          },
          {
            "start": 10145,
            "end": 10145
          },
          {
            "start": 10160,
            "end": 10160
          },
          {
            "start": 10175,
            "end": 10175
          },
          {
            "start": 10548,
            "end": 10549
          },
          {
            "start": 11013,
            "end": 11015
          },
          {
            "start": 11035,
            "end": 11036
          },
          {
            "start": 11088,
            "end": 11088
          },
          {
            "start": 11093,
            "end": 11093
          },
          {
            "start": 12336,
            "end": 12336
          },
          {
            "start": 12349,
            "end": 12349
          },
          {
            "start": 12951,
            "end": 12951
          },
          {
            "start": 12953,
            "end": 12953
          },
          {
            "start": 126980,
            "end": 126980
          },
          {
            "start": 127020,
            "end": 127023
          },
          {
            "start": 127124,
            "end": 127135
          },
          {
            "start": 127151,
            "end": 127152
          },
          {
            "start": 127168,
            "end": 127168
          },
          {
            "start": 127183,
            "end": 127184
          },
          {
            "start": 127222,
            "end": 127231
          },
          {
            "start": 127344,
            "end": 127345
          },
          {
            "start": 127358,
            "end": 127359
          },
          {
            "start": 127374,
            "end": 127374
          },
          {
            "start": 127377,
            "end": 127386
          },
          {
            "start": 127406,
            "end": 127461
          },
          {
            "start": 127489,
            "end": 127503
          },
          {
            "start": 127514,
            "end": 127514
          },
          {
            "start": 127535,
            "end": 127535
          },
          {
            "start": 127538,
            "end": 127546
          },
          {
            "start": 127548,
            "end": 127551
          },
          {
            "start": 127561,
            "end": 127583
          },
          {
            "start": 127590,
            "end": 127777
          },
          {
            "start": 127780,
            "end": 127891
          },
          {
            "start": 127894,
            "end": 127895
          },
          {
            "start": 127897,
            "end": 127899
          },
          {
            "start": 127902,
            "end": 127984
          },
          {
            "start": 127987,
            "end": 127989
          },
          {
            "start": 127991,
            "end": 127994
          },
          {
            "start": 128000,
            "end": 128253
          },
          {
            "start": 128255,
            "end": 128317
          },
          {
            "start": 128329,
            "end": 128334
          },
          {
            "start": 128336,
            "end": 128359
          },
          {
            "start": 128367,
            "end": 128368
          },
          {
            "start": 128371,
            "end": 128378
          },
          {
            "start": 128391,
            "end": 128391
          },
          {
            "start": 128394,
            "end": 128397
          },
          {
            "start": 128400,
            "end": 128400
          },
          {
            "start": 128405,
            "end": 128406
          },
          {
            "start": 128420,
            "end": 128421
          },
          {
            "start": 128424,
            "end": 128424
          },
          {
            "start": 128433,
            "end": 128434
          },
          {
            "start": 128444,
            "end": 128444
          },
          {
            "start": 128450,
            "end": 128452
          },
          {
            "start": 128465,
            "end": 128467
          },
          {
            "start": 128476,
            "end": 128478
          },
          {
            "start": 128481,
            "end": 128481
          },
          {
            "start": 128483,
            "end": 128483
          },
          {
            "start": 128488,
            "end": 128488
          },
          {
            "start": 128495,
            "end": 128495
          },
          {
            "start": 128499,
            "end": 128499
          },
          {
            "start": 128506,
            "end": 128591
          },
          {
            "start": 128640,
            "end": 128709
          },
          {
            "start": 128715,
            "end": 128722
          },
          {
            "start": 128725,
            "end": 128741
          },
          {
            "start": 128745,
            "end": 128745
          },
          {
            "start": 128747,
            "end": 128752
          },
          {
            "start": 128755,
            "end": 128767
          },
          {
            "start": 128986,
            "end": 129023
          },
          {
            "start": 129036,
            "end": 129039
          },
          {
            "start": 129096,
            "end": 129103
          },
          {
            "start": 129114,
            "end": 129119
          },
          {
            "start": 129160,
            "end": 129167
          },
          {
            "start": 129198,
            "end": 129199
          },
          {
            "start": 129212,
            "end": 129215
          },
          {
            "start": 129218,
            "end": 129231
          },
          {
            "start": 129241,
            "end": 129279
          },
          {
            "start": 129292,
            "end": 129338
          },
          {
            "start": 129340,
            "end": 129349
          },
          {
            "start": 129351,
            "end": 129535
          },
          {
            "start": 129624,
            "end": 129631
          },
          {
            "start": 129646,
            "end": 129791
          },
          {
            "start": 130048,
            "end": 131069
          }
        ]
      }
    ]
  }
}`);var nk="17.0.0",_c=Wr(Cp),Z7=Jl(_c),Q7=new Yi([_c],{defaultUnicodeVersion:nk});var Ep={schema:"deno-tui.unicode-width-data",schemaVersion:1,unicodeVersion:"17.0.0",dataPackFingerprint:"4c885bc9201552e99c0797a4b8ea72db55fc2c315af3347ad53a9743c65bbfc2",source:{name:"derived-general-category",url:"https://www.unicode.org/Public/17.0.0/ucd/extracted/DerivedGeneralCategory.txt",sha256:"d62e5bab70ca74f099343f71224fa051cb1fdd61a1ab45c0488c44cfc0b6102e"},eastAsianWidthValues:["A","F","H","N","Na","W"],eastAsianWidthRanges:[0,31,3,0,94,4,0,33,3,0,0,0,0,1,4,0,0,0,0,1,4,0,1,0,0,0,3,0,0,0,0,0,3,0,0,4,0,1,0,0,0,4,0,4,0,0,0,3,0,4,0,0,0,3,0,3,0,0,5,3,0,0,0,0,8,3,0,0,0,0,5,3,0,1,0,0,4,3,0,3,0,0,3,3,0,0,0,0,0,3,0,2,0,0,0,3,0,1,0,0,1,3,0,0,0,0,0,3,0,1,0,0,2,3,0,3,0,0,0,3,0,0,0,0,0,3,0,0,0,0,1,3,0,0,0,0,14,3,0,0,0,0,0,3,0,0,0,0,6,3,0,0,0,0,9,3,0,1,0,0,2,3,0,0,0,0,4,3,0,2,0,0,3,3,0,0,0,0,5,3,0,3,0,0,0,3,0,0,0,0,2,3,0,3,0,0,0,3,0,0,0,0,3,3,0,1,0,0,17,3,0,1,0,0,2,3,0,0,0,0,97,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,115,3,0,0,0,0,14,3,0,0,0,0,97,3,0,0,0,0,1,3,0,0,0,0,0,3,0,2,0,0,0,3,0,0,0,0,1,3,0,0,0,0,6,3,0,3,0,0,0,3,0,0,0,0,0,3,0,0,0,0,31,3,0,111,0,0,7,3,2,5,3,4,6,3,1,0,3,1,2,3,0,16,0,1,6,0,0,6,3,0,16,0,0,0,3,0,6,0,0,54,3,0,0,0,0,13,3,0,63,0,0,0,3,0,0,0,0,221,3,1,37,3,2,49,3,2,2,3,1,54,3,8,26,3,4,5,3,11,269,3,1,59,3,2,100,3,14,58,3,2,48,3,2,14,3,1,27,3,2,0,3,1,10,3,5,33,3,5,236,3,1,7,3,2,1,3,2,21,3,1,6,3,1,0,3,3,3,3,2,8,3,2,1,3,2,3,3,8,0,3,4,1,3,1,4,3,2,24,3,2,2,3,1,5,3,4,1,3,2,21,3,1,6,3,1,1,3,1,1,3,1,1,3,2,0,3,1,4,3,4,1,3,2,2,3,3,0,3,7,3,3,1,0,3,7,16,3,10,2,3,1,8,3,1,2,3,1,21,3,1,6,3,1,1,3,1,4,3,2,9,3,1,2,3,1,2,3,2,0,3,15,3,3,2,11,3,7,6,3,1,2,3,1,7,3,2,1,3,2,21,3,1,6,3,1,1,3,1,4,3,2,8,3,2,1,3,2,2,3,7,2,3,4,1,3,1,4,3,2,17,3,10,1,3,1,5,3,3,2,3,1,3,3,3,1,3,1,0,3,1,1,3,3,1,3,3,2,3,3,11,3,4,4,3,3,2,3,1,3,3,2,0,3,6,0,3,14,20,3,5,12,3,1,2,3,1,22,3,1,15,3,2,8,3,1,2,3,1,3,3,7,1,3,1,2,3,1,1,3,2,3,3,2,9,3,7,21,3,1,2,3,1,22,3,1,9,3,1,4,3,2,8,3,1,2,3,1,3,3,7,1,3,5,2,3,1,3,3,2,9,3,1,2,3,12,12,3,1,2,3,1,50,3,1,2,3,1,5,3,4,15,3,2,25,3,1,2,3,1,17,3,3,23,3,1,8,3,1,0,3,2,6,3,3,0,3,4,5,3,1,0,3,1,7,3,6,9,3,2,2,3,12,57,3,4,28,3,37,1,3,1,0,3,1,4,3,1,23,3,1,0,3,1,22,3,2,4,3,1,0,3,1,6,3,1,9,3,2,3,3,32,71,3,1,35,3,4,38,3,1,35,3,1,14,3,1,12,3,37,197,3,1,0,3,5,0,3,2,47,3,0,95,5,0,232,3,1,3,3,2,6,3,1,0,3,1,3,3,2,40,3,1,3,3,2,32,3,1,3,3,2,6,3,1,0,3,1,3,3,2,14,3,1,56,3,1,3,3,2,66,3,2,31,3,3,25,3,6,85,3,2,5,3,2,668,3,3,88,3,7,21,3,9,23,3,9,19,3,12,12,3,1,2,3,1,1,3,12,93,3,2,9,3,6,9,3,6,25,3,6,88,3,7,42,3,5,69,3,10,30,3,1,11,3,4,11,3,4,0,3,3,41,3,2,4,3,11,43,3,4,25,3,6,10,3,3,61,3,2,64,3,1,28,3,2,10,3,6,9,3,6,13,3,2,45,3,2,11,3,20,76,3,1,165,3,8,59,3,3,14,3,3,61,3,5,42,3,2,10,3,8,42,3,5,533,3,2,5,3,2,37,3,2,5,3,2,7,3,1,0,3,1,0,3,1,0,3,1,30,3,2,52,3,1,14,3,1,13,3,2,5,3,1,18,3,2,2,3,1,8,3,1,15,3,0,0,0,0,1,3,0,3,0,0,0,3,0,1,0,0,1,3,0,1,0,0,1,3,0,2,0,0,0,3,0,3,0,0,7,3,0,0,0,0,0,3,0,1,0,0,0,3,0,0,0,0,4,3,0,0,0,0,1,3,0,0,0,0,37,3,1,11,3,2,0,0,0,9,3,0,0,0,0,0,3,0,3,0,0,9,3,1,12,3,3,8,3,0,0,2,0,1,3,0,0,0,0,20,3,14,32,3,15,2,3,0,0,0,0,0,3,0,0,0,0,2,3,0,0,0,0,8,3,0,0,0,0,1,3,0,0,0,0,9,3,0,1,0,0,2,3,0,0,0,0,3,3,0,0,0,0,38,3,0,1,0,0,5,3,0,3,0,0,0,3,0,11,0,0,3,3,0,9,0,0,14,3,0,0,0,0,1,3,4,9,0,0,29,3,0,1,0,0,23,3,0,0,0,0,0,3,0,0,0,0,17,3,0,0,0,0,23,3,0,0,0,0,0,3,0,1,0,0,2,3,0,1,0,0,1,3,0,0,0,0,2,3,0,0,0,0,0,3,0,0,0,0,2,3,0,0,0,0,3,3,0,0,0,0,1,3,0,3,0,0,1,3,0,0,0,0,0,3,0,0,0,0,0,3,0,5,0,0,0,3,0,0,0,0,4,3,0,3,0,0,3,3,0,1,0,0,9,3,0,0,0,0,2,3,0,0,0,0,4,3,0,0,0,0,12,3,0,1,0,0,1,3,0,3,0,0,1,3,0,1,0,0,1,3,0,1,0,0,17,3,0,1,0,0,1,3,0,1,0,0,12,3,0,0,0,0,2,3,0,0,0,0,10,3,0,0,0,0,24,3,0,0,0,0,81,3,0,0,0,0,6,3,0,1,5,0,12,3,0,1,5,0,189,3,0,3,5,0,2,3,0,0,5,0,1,3,0,0,5,0,53,3,22,10,3,21,137,0,0,0,3,0,96,0,0,3,3,0,35,0,0,11,3,0,15,0,0,1,3,0,3,0,0,9,3,0,1,0,0,0,3,0,6,0,0,7,3,0,1,0,0,1,3,0,1,0,0,3,3,0,1,0,0,1,3,0,1,0,0,3,3,0,2,0,0,1,3,0,0,0,0,1,3,0,3,0,0,15,3,0,3,0,0,8,3,0,0,0,0,12,3,0,1,5,0,5,3,0,1,0,0,1,3,0,0,0,0,3,3,0,1,0,0,3,3,0,1,5,0,5,3,0,0,0,0,0,3,0,0,0,0,16,3,0,7,5,0,7,3,0,0,0,0,0,3,0,0,0,0,4,3,0,11,5,0,11,3,0,1,0,0,0,3,0,2,0,0,0,3,0,3,0,0,0,3,0,1,0,0,0,3,0,0,0,0,14,3,0,0,5,0,9,3,0,5,5,0,2,3,0,0,5,0,9,3,0,1,0,0,0,3,0,0,5,0,7,3,0,1,5,0,16,3,0,1,5,0,0,0,0,3,3,0,1,5,0,7,0,0,0,5,0,4,0,0,0,5,0,12,0,0,0,3,0,0,0,0,3,3,0,1,0,0,0,5,0,6,0,0,1,5,0,0,0,0,0,5,0,3,0,0,0,5,0,1,0,0,0,5,0,1,0,0,4,3,0,0,5,0,3,3,0,1,5,0,27,3,0,0,5,0,19,3,0,0,0,0,13,3,0,0,5,0,0,3,0,0,5,0,3,3,0,2,5,0,0,3,0,0,5,0,29,3,0,9,0,0,20,3,0,2,5,0,23,3,0,0,5,0,13,3,0,0,5,0,37,3,0,7,4,0,406,3,0,1,4,0,403,3,0,1,5,0,50,3,0,0,5,0,3,3,0,0,5,0,3,0,0,25,3,2,381,3,5,44,3,1,0,3,5,0,3,2,55,3,7,1,3,14,23,3,9,6,3,1,6,3,1,6,3,1,6,3,1,6,3,1,6,3,1,6,3,1,6,3,1,125,3,34,25,5,1,88,5,12,213,5,26,15,5,0,0,1,0,61,5,0,0,3,1,85,5,2,102,5,5,42,5,1,93,5,1,85,5,9,47,5,1,39,5,0,7,0,0,29244,5,3,54,5,9,347,3,20,183,3,8,220,3,20,59,3,3,9,3,6,55,3,8,69,3,8,11,3,6,115,3,11,0,3,0,28,5,3,77,3,1,10,3,4,32,3,1,54,3,9,13,3,2,9,3,2,102,3,24,27,3,10,5,3,2,5,3,2,5,3,9,6,3,1,6,3,1,59,3,4,125,3,2,9,3,6,11171,5,12,22,3,4,48,3,4,2047,3,0,6399,0,0,511,5,0,6,3,12,4,3,5,25,3,1,4,3,1,0,3,1,1,3,1,1,3,1,649,3,32,15,3,0,15,0,0,9,5,6,15,3,0,34,5,1,18,5,1,3,5,4,4,3,1,134,3,2,0,3,1,95,1,0,93,2,3,5,2,2,5,2,2,5,2,2,2,2,3,6,1,1,6,2,10,3,3,0,0,0,2,11,3,1,25,3,1,18,3,1,1,3,1,14,3,2,13,3,34,122,3,5,2,3,4,44,3,3,87,3,1,12,3,3,0,3,47,45,3,130,28,3,3,48,3,15,27,3,4,35,3,9,29,3,5,42,3,5,29,3,1,36,3,4,13,3,42,157,3,2,9,3,6,35,3,4,35,3,4,39,3,8,51,3,11,11,3,1,14,3,1,6,3,1,1,3,1,10,3,1,14,3,1,6,3,1,1,3,3,51,3,12,310,3,9,21,3,10,7,3,24,5,3,1,41,3,1,8,3,69,5,3,2,0,3,1,43,3,1,1,3,3,0,3,2,22,3,1,71,3,8,8,3,48,18,3,1,1,3,5,32,3,3,26,3,5,26,3,38,55,3,4,19,3,2,49,3,1,1,3,5,7,3,1,2,3,1,28,3,2,2,3,4,9,3,7,8,3,7,63,3,32,38,3,4,11,3,9,53,3,3,28,3,2,26,3,5,25,3,7,3,3,12,6,3,80,72,3,55,50,3,13,50,3,7,45,3,8,9,3,6,37,3,3,28,3,8,1,3,208,30,3,1,41,3,1,2,3,2,1,3,16,5,3,8,8,3,33,45,3,8,41,3,22,25,3,38,27,3,20,22,3,9,77,3,4,35,3,9,67,3,10,0,3,2,24,3,7,9,3,6,52,3,1,17,3,8,38,3,9,95,3,1,19,3,11,17,3,1,46,3,62,6,3,1,0,3,1,3,3,1,14,3,1,10,3,6,58,3,5,9,3,6,3,3,1,7,3,2,1,3,2,21,3,1,6,3,1,1,3,1,4,3,1,9,3,2,1,3,2,2,3,2,0,3,6,0,3,5,6,3,2,6,3,3,4,3,11,9,3,1,0,3,2,0,3,1,37,3,1,9,3,1,0,3,2,0,3,1,3,3,1,9,3,1,1,3,8,1,3,29,91,3,1,4,3,30,71,3,8,9,3,166,53,3,2,37,3,34,68,3,11,9,3,6,12,3,19,57,3,6,9,3,6,19,3,28,26,3,2,14,3,4,22,3,185,59,3,100,82,3,12,7,3,2,0,3,2,7,3,1,1,3,1,29,3,1,1,3,2,11,3,9,9,3,70,7,3,2,45,3,2,10,3,27,71,3,8,82,3,13,72,3,7,9,3,86,7,3,88,33,3,14,9,3,6,8,3,1,44,3,1,13,3,10,28,3,3,31,3,2,21,3,1,13,3,73,6,3,1,1,3,1,43,3,3,0,3,1,1,3,1,8,3,8,9,3,6,5,3,1,1,3,1,36,3,1,1,3,1,5,3,7,9,3,6,43,3,4,9,3,246,24,3,7,16,3,1,40,3,3,28,3,85,0,3,15,49,3,13,922,3,102,110,3,1,4,3,11,195,3,2636,98,3,13,1109,3,10,3994,3,5,582,3,6841,57,3,1734,568,3,7,30,3,1,9,3,4,80,3,1,9,3,6,29,3,2,5,3,10,69,3,10,9,3,1,6,3,1,20,3,5,18,3,432,57,3,198,90,3,5,24,3,2,24,3,44,74,3,4,56,3,7,16,3,64,4,5,11,6,5,9,7381,5,41,31,5,97,114,5,8701,3,5,1,6,5,1,1,5,1,290,5,15,0,5,29,2,5,2,0,5,14,3,5,8,395,5,2308,106,3,5,12,3,3,8,3,7,9,3,2,7,3,3932,252,3,3,435,3,6,22,3,15,16,3,15,45,3,2,22,3,9,115,3,60,245,3,10,38,3,2,193,3,21,69,3,122,19,3,12,19,3,12,86,5,9,22,5,0,1,3,135,84,3,1,70,3,1,1,3,2,0,3,2,1,3,2,3,3,1,11,3,1,0,3,1,6,3,1,64,3,1,3,3,2,7,3,1,6,3,1,27,3,1,3,3,1,4,3,1,0,3,3,6,3,1,339,3,2,291,3,2,701,3,15,4,3,1,14,3,1104,30,3,6,5,3,213,6,3,1,16,3,2,6,3,1,1,3,1,4,3,5,61,3,33,0,3,112,44,3,3,13,3,2,9,3,4,1,3,320,30,3,17,57,3,5,0,3,464,41,3,214,42,3,4,0,3,192,30,3,1,21,3,8,1,3,224,6,3,1,3,3,1,1,3,1,14,3,1,196,3,2,15,3,41,75,3,4,9,3,4,1,3,785,67,3,76,60,3,194,3,3,1,26,3,1,1,3,1,0,3,2,0,3,1,9,3,1,3,3,1,0,3,1,0,3,6,0,3,4,0,3,1,0,3,1,0,3,1,2,3,1,1,3,1,0,3,2,0,3,1,0,3,1,0,3,1,0,3,1,0,3,1,1,3,1,0,3,2,3,3,1,6,3,1,3,3,1,3,3,1,0,3,1,9,3,1,16,3,5,2,3,1,4,3,1,16,3,52,1,3,270,3,3,0,0,5,0,38,3,4,99,3,12,14,3,2,14,3,1,13,3,0,0,5,1,36,3,10,10,0,0,4,3,0,29,0,0,1,3,0,57,0,0,5,3,0,29,0,0,0,5,0,1,0,0,9,5,0,17,0,0,0,3,56,25,3,0,2,5,13,43,5,4,8,5,7,1,5,14,5,5,154,32,5,0,11,3,0,8,5,0,0,3,0,69,5,0,0,3,0,21,5,0,11,3,0,42,5,0,3,3,0,4,5,0,11,3,0,16,5,0,2,3,0,0,5,0,2,3,0,70,5,0,0,3,0,0,5,0,0,3,0,186,5,0,1,3,0,62,5,0,12,3,0,3,5,0,0,3,0,23,5,0,17,3,0,0,5,0,25,3,0,1,5,0,12,3,0,0,5,0,85,3,0,84,5,0,47,3,0,69,5,0,5,3,0,0,5,0,2,3,0,2,5,0,1,3,0,3,5,3,3,5,0,10,3,0,1,5,3,3,3,0,8,5,3,217,3,6,11,5,4,0,5,15,11,3,4,55,3,8,9,3,6,39,3,8,29,3,2,11,3,4,1,3,14,8,3,39,11,3,0,46,5,0,0,3,0,9,5,0,0,3,0,184,5,0,87,3,8,13,3,2,12,5,3,10,5,3,56,5,1,0,5,4,15,5,2,11,5,4,9,5,7,146,3,1,102,3,1029,65533,5,2,65533,5,655363,0,3,30,95,3,128,239,0,65040,65533,0,2,65533,0],assignedRanges:[0,887,2,5,4,6,1,0,1,19,1,396,1,37,2,49,2,2,1,54,8,26,4,5,11,269,1,59,2,100,14,58,2,48,2,14,1,27,2,0,1,10,5,33,5,236,1,7,2,1,2,21,1,6,1,0,3,3,2,8,2,1,2,3,8,0,4,1,1,4,2,24,2,2,1,5,4,1,2,21,1,6,1,1,1,1,1,1,2,0,1,4,4,1,2,2,3,0,7,3,1,0,7,16,10,2,1,8,1,2,1,21,1,6,1,1,1,4,2,9,1,2,1,2,2,0,15,3,2,11,7,6,1,2,1,7,2,1,2,21,1,6,1,1,1,4,2,8,2,1,2,2,7,2,4,1,1,4,2,17,10,1,1,5,3,2,1,3,3,1,1,0,1,1,3,1,3,2,3,11,4,4,3,2,1,3,2,0,6,0,14,20,5,12,1,2,1,22,1,15,2,8,1,2,1,3,7,1,1,2,1,1,2,3,2,9,7,21,1,2,1,22,1,9,1,4,2,8,1,2,1,3,7,1,5,2,1,3,2,9,1,2,12,12,1,2,1,50,1,2,1,5,4,15,2,25,1,2,1,17,3,23,1,8,1,0,2,6,3,0,4,5,1,0,1,7,6,9,2,2,12,57,4,28,37,1,1,0,1,4,1,23,1,0,1,22,2,4,1,0,1,6,1,9,2,3,32,71,1,35,4,38,1,35,1,14,1,12,37,197,1,0,5,0,2,376,1,3,2,6,1,0,1,3,2,40,1,3,2,32,1,3,2,6,1,0,1,3,2,14,1,56,1,3,2,66,2,31,3,25,6,85,2,5,2,668,3,88,7,21,9,23,9,19,12,12,1,2,1,1,12,93,2,9,6,9,6,25,6,88,7,42,5,69,10,30,1,11,4,11,4,0,3,41,2,4,11,43,4,25,6,10,3,61,2,64,1,28,2,10,6,9,6,13,2,45,2,11,20,76,1,165,8,59,3,14,3,61,5,42,2,10,8,42,5,533,2,5,2,37,2,5,2,7,1,0,1,0,1,0,1,30,2,52,1,14,1,13,2,5,1,18,2,2,1,8,1,100,1,11,2,26,1,12,3,33,14,32,15,139,4,665,22,10,21,1811,2,381,5,44,1,0,5,0,2,55,7,1,14,23,9,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,125,34,25,1,88,12,213,26,79,1,85,2,102,5,42,1,93,1,85,9,47,1,29292,3,54,9,347,20,183,8,220,20,59,3,9,6,55,8,69,8,11,6,115,11,29,3,77,1,10,4,32,1,54,9,13,2,9,2,102,24,27,10,5,2,5,2,5,9,6,1,6,1,59,4,125,2,9,6,11171,12,22,4,48,4,8813,2,105,38,6,12,4,5,25,1,4,1,0,1,1,1,1,1,649,32,41,6,50,1,18,1,3,4,4,1,134,2,0,1,189,3,5,2,5,2,5,2,2,3,6,1,6,10,4,2,11,1,25,1,18,1,1,1,14,2,13,34,122,5,2,4,44,3,87,1,12,3,0,47,45,130,28,3,48,15,27,4,35,9,29,5,42,5,29,1,36,4,13,42,157,2,9,6,35,4,35,4,39,8,51,11,11,1,14,1,6,1,1,1,10,1,14,1,6,1,1,3,51,12,310,9,21,10,7,24,5,1,41,1,8,69,5,2,0,1,43,1,1,3,0,2,22,1,71,8,8,48,18,1,1,5,32,3,26,5,26,38,55,4,19,2,49,1,1,5,7,1,2,1,28,2,2,4,9,7,8,7,63,32,38,4,11,9,53,3,28,2,26,5,25,7,3,12,6,80,72,55,50,13,50,7,45,8,9,6,37,3,28,8,1,208,30,1,41,1,2,2,1,16,5,8,8,33,45,8,41,22,25,38,27,20,22,9,77,4,35,9,67,10,0,2,24,7,9,6,52,1,17,8,38,9,95,1,19,11,17,1,46,62,6,1,0,1,3,1,14,1,10,6,58,5,9,6,3,1,7,2,1,2,21,1,6,1,1,1,4,1,9,2,1,2,2,2,0,6,0,5,6,2,6,3,4,11,9,1,0,2,0,1,37,1,9,1,0,2,0,1,3,1,9,1,1,8,1,29,91,1,4,30,71,8,9,166,53,2,37,34,68,11,9,6,12,19,57,6,9,6,19,28,26,2,14,4,22,185,59,100,82,12,7,2,0,2,7,1,1,1,29,1,1,2,11,9,9,70,7,2,45,2,10,27,71,8,82,13,72,7,9,86,7,88,33,14,9,6,8,1,44,1,13,10,28,3,31,2,21,1,13,73,6,1,1,1,43,3,0,1,1,1,8,8,9,6,5,1,1,1,36,1,1,1,5,7,9,6,43,4,9,246,24,7,16,1,40,3,28,85,0,15,49,13,922,102,110,1,4,11,195,2636,98,13,1109,10,3994,5,582,6841,57,1734,568,7,30,1,9,4,80,1,9,6,29,2,5,10,69,10,9,1,6,1,20,5,18,432,57,198,90,5,24,2,24,44,74,4,56,7,16,64,4,11,6,9,7381,41,31,97,114,8701,3,1,6,1,1,1,290,15,0,29,2,2,0,14,3,8,395,2308,106,5,12,3,8,7,9,2,7,3932,252,3,435,6,22,15,16,15,45,2,22,9,115,60,245,10,38,2,193,21,69,122,19,12,19,12,86,9,24,135,84,1,70,1,1,2,0,2,1,2,3,1,11,1,0,1,6,1,64,1,3,2,7,1,6,1,27,1,3,1,4,1,0,3,6,1,339,2,291,2,701,15,4,1,14,1104,30,6,5,213,6,1,16,2,6,1,1,1,4,5,61,33,0,112,44,3,13,2,9,4,1,320,30,17,57,5,0,464,41,214,42,4,0,192,30,1,21,8,1,224,6,1,3,1,1,1,14,1,196,2,15,41,75,4,9,4,1,785,67,76,60,194,3,1,26,1,1,1,0,2,0,1,9,1,3,1,0,1,0,6,0,4,0,1,0,1,0,1,2,1,1,1,0,2,0,1,0,1,0,1,0,1,0,1,1,1,0,2,3,1,6,1,3,1,3,1,0,1,9,1,16,5,2,1,4,1,16,52,1,270,43,4,99,12,14,2,14,1,14,1,36,10,173,56,28,13,43,4,8,7,1,14,5,154,984,3,16,3,12,3,217,6,11,4,0,15,11,4,55,8,9,6,39,8,29,2,11,4,1,14,8,39,343,8,13,2,12,3,10,3,56,1,0,4,15,2,11,4,9,7,146,1,102,1029,42719,32,4381,2,5773,2,7472,15,621,2466,541,1506,4938,5,8489,707463,0,30,95,128,239,65040,65533,2,65533],combiningRanges:[768,111,275,6,263,44,1,0,1,1,1,1,1,0,72,10,48,20,16,0,101,6,2,5,2,1,1,3,35,0,30,26,91,10,58,8,9,0,24,3,1,8,1,2,1,4,43,2,59,8,42,23,1,31,55,0,1,0,4,7,4,0,3,6,10,1,29,0,58,0,4,3,8,0,20,1,26,0,2,1,57,0,4,1,4,1,2,2,3,0,30,1,3,0,11,1,57,0,4,4,1,1,4,0,20,1,22,5,1,0,58,0,2,0,1,3,8,0,7,1,11,1,30,0,61,0,12,0,50,0,3,0,55,0,1,2,5,2,1,3,7,1,11,1,29,0,58,0,2,0,6,0,5,1,20,1,28,1,57,1,4,3,8,0,20,1,29,0,72,0,7,2,1,0,90,0,2,6,12,7,98,0,2,8,11,6,73,1,27,0,1,0,1,0,55,13,1,4,1,1,5,10,1,35,9,0,102,3,1,5,1,1,2,1,25,1,4,2,16,3,13,0,2,1,6,0,15,0,194,159,349,2,946,2,29,1,30,1,30,1,64,1,1,6,8,0,2,10,9,0,45,2,1,0,117,1,34,0,118,2,4,1,9,0,6,2,219,1,2,0,58,0,1,6,1,0,1,0,2,7,6,9,2,0,48,45,2,11,20,3,48,0,1,4,1,0,5,0,40,8,12,1,32,3,2,1,1,2,56,0,1,1,3,0,1,2,58,7,2,1,152,2,1,12,1,6,4,0,6,0,3,1,198,63,720,32,3070,2,141,0,96,31,554,3,107,1,30164,3,1,9,32,1,80,1,272,0,3,0,4,0,25,1,5,0,151,1,26,17,13,0,38,7,25,10,46,2,48,0,2,3,2,1,39,0,67,5,2,1,2,1,12,0,8,0,47,0,51,0,1,2,2,1,5,1,1,0,42,1,8,0,238,0,2,0,4,0,11202,22,4,48,8994,0,737,15,16,15,973,0,226,0,149,4,1670,2,1,1,5,3,40,2,4,0,165,1,573,3,65,4,317,1,77,5,70,10,49,3,123,0,54,14,41,0,2,1,10,2,49,3,2,1,7,0,61,2,36,4,1,7,62,0,12,1,52,8,10,3,2,0,95,2,2,0,1,1,6,0,2,0,157,0,3,7,21,1,57,1,3,0,37,6,3,4,70,5,13,0,1,0,1,0,14,1,85,7,2,2,1,0,23,0,84,5,1,0,4,1,1,1,238,3,6,1,1,1,27,1,85,7,2,0,1,1,106,0,1,0,2,5,1,0,101,0,1,0,2,3,1,4,259,8,1,1,256,1,1,0,4,0,144,3,2,1,4,0,32,9,40,5,2,3,8,0,9,5,2,2,46,12,1,1,198,0,1,2,1,0,201,6,1,5,1,0,82,21,2,6,1,1,1,1,122,5,3,0,1,1,1,6,1,0,72,1,3,0,1,0,347,1,11,1,52,4,5,0,1,0,23,0,5349,0,6,14,11464,11,3,2,2496,4,59,6,556,0,3,3,484,0,63,3,81,0,19640,1,4705,45,2,22,544,2,17,7,2,6,30,3,148,2,1979,54,4,49,8,0,14,0,22,4,1,14,1360,6,1,16,2,6,1,1,1,4,100,0,160,6,375,0,61,3,508,3,254,1,243,0,2,0,7,1,5,0,474,6,109,6,792501,239],zeroWidthRanges:[0,31,95,32,13,0,1390,0,4593,0,2044,4,24,6,49,15,56975,0,240,11,13364,15,34912,3,5327,7,798341,255,240,3599],fingerprint:"f9935ff076aa5994700815d5b6117c7bc9fda5991c8d6dc4b8f78e742b4259f3"};var fr=Object.freeze({maxProfiles:32,maxNameLength:64,maxDescriptionLength:256,maxTextUtf16Length:1048576,maxEncodedValues:1e5,maxDiagnosticLength:256}),ja=class extends TypeError{constructor(t,r,o){let i=Lp(r),a=Lp(o);super(`${i}: ${a}`);this.code=t;this.path=r;this.name="TerminalWidthError",this.path=i}},Ic=/^[a-z][a-z0-9._-]{0,63}$/,Ip=/^[0-9a-f]{64}$/,Fa=1114111,Ap="17.0.0",Op="4c885bc9201552e99c0797a4b8ea72db55fc2c315af3347ad53a9743c65bbfc2",ai=Object.freeze(["A","F","H","N","Na","W"]),Dp=new WeakSet,$a;function Lp(n){return n.length<=fr.maxDiagnosticLength?n:`${n.slice(0,fr.maxDiagnosticLength-3)}...`}function re(n,e,t){throw new ja(n,e,t)}function no(n,e,t,r=t,o="invalid-data"){let i=!1;try{i=Array.isArray(n)}catch{return re(o,e,"object identity could not be inspected safely")}(n===null||typeof n!="object"||i)&&re(o,e,"expected a plain object");let a,s;try{a=Object.getPrototypeOf(n),s=Reflect.ownKeys(n)}catch{return re(o,e,"object could not be inspected safely")}a!==Object.prototype&&a!==null&&re(o,e,"expected a plain object"),s.length>t.length&&re(o,e,"property count exceeds the expected shape");let l=new Set(t),d=Object.create(null);for(let c of s){(typeof c!="string"||!l.has(c))&&re(o,e,"unknown property");let u;try{u=Reflect.getOwnPropertyDescriptor(n,c)}catch{return re(o,`${e}.${c}`,"property could not be inspected safely")}(u===void 0||!("value"in u)||u.get!==void 0||u.set!==void 0||u.enumerable!==!0)&&re(o,`${e}.${c}`,"expected an enumerable data property"),d[c]=u.value}for(let c of r)Object.hasOwn(d,c)||re(o,`${e}.${c}`,"required property is missing");return d}function Lc(n,e,t,r="invalid-data"){let o=!1;try{o=Array.isArray(n)}catch{return re(r,e,"array identity could not be inspected safely")}o||re(r,e,"expected an array");let i,a;try{i=Object.getPrototypeOf(n),a=Reflect.getOwnPropertyDescriptor(n,"length")}catch{return re(r,e,"array could not be inspected safely")}i!==Array.prototype&&i!==null&&re(r,e,"expected a plain array"),(a===void 0||!("value"in a))&&re(r,`${e}.length`,"expected an own data property");let s=a.value;(!Number.isSafeInteger(s)||s<0||s>t)&&re("limit-exceeded",`${e}.length`,`must be from 0 through ${t}`);let l;try{l=Reflect.ownKeys(n)}catch{return re(r,e,"array keys could not be inspected safely")}l.length!==s+1&&re(r,e,"sparse arrays and custom properties are not allowed");let d=new Array(s);for(let c of l){if(c==="length")continue;(typeof c!="string"||!/^(0|[1-9]\d*)$/.test(c))&&re(r,e,"custom array properties are not allowed");let u=Number(c),h;try{h=Reflect.getOwnPropertyDescriptor(n,c)}catch{return re(r,`${e}[${c}]`,"property could not be inspected safely")}(!Number.isSafeInteger(u)||u<0||u>=s||h===void 0||!("value"in h)||h.get!==void 0||h.set!==void 0||h.enumerable!==!0)&&re(r,`${e}[${c}]`,"expected a dense enumerable data property"),d[u]=h.value}for(let c=0;c<s;c+=1)Object.hasOwn(d,c)||re(r,`${e}[${c}]`,"sparse arrays are not allowed");return d}function ii(n,e,t,r="invalid-data"){return(typeof n!="string"||n.length===0||n.length>t)&&re(r,e,`expected a string from 1 through ${t} UTF-16 units`),n}function Cc(n,e,t,r){return(!Number.isSafeInteger(n)||n<t||n>r)&&re("invalid-data",e,`expected an integer from ${t} through ${r}`),n}function Ha(n,e,t){let r=Lc(n,e,fr.maxEncodedValues);r.length%t!==0&&re("invalid-data",e,`length must be divisible by ${t}`);let o=[],i=-1;for(let a=0;a<r.length;a+=t){let s=Cc(r[a],`${e}[${a}]`,0,Fa+1),l=Cc(r[a+1],`${e}[${a+1}]`,0,Fa),d=i+1+s,c=d+l;if((!Number.isSafeInteger(d)||!Number.isSafeInteger(c)||d<0||c>Fa)&&re("invalid-data",`${e}[${a/t}]`,"decoded range is outside Unicode"),t===3){let u=Cc(r[a+2],`${e}[${a+2}]`,0,ai.length-1);o.push(Object.freeze({start:d,end:c,value:ai[u]}))}else o.push(Object.freeze({start:d,end:c}));i=c}return Object.freeze(o)}function Ec(){if($a!==void 0)return $a;let n=no(Ep,"$.widthData",["schema","schemaVersion","unicodeVersion","dataPackFingerprint","source","eastAsianWidthValues","eastAsianWidthRanges","assignedRanges","combiningRanges","zeroWidthRanges","fingerprint"]);(n.schema!=="deno-tui.unicode-width-data"||n.schemaVersion!==1)&&re("invalid-data","$.widthData","unsupported width-data schema"),n.unicodeVersion!==Ap&&re("invalid-data","$.widthData.unicodeVersion","does not match the supported Unicode version"),n.dataPackFingerprint!==Op&&re("invalid-data","$.widthData.dataPackFingerprint","does not match the built-in data pack");let e=no(n.source,"$.widthData.source",["name","url","sha256"]),t=Object.freeze({name:ii(e.name,"$.widthData.source.name",64),url:ii(e.url,"$.widthData.source.url",2048),sha256:ii(e.sha256,"$.widthData.source.sha256",64)});(!/^https:\/\/[^\s]+$/.test(t.url)||!Ip.test(t.sha256))&&re("invalid-data","$.widthData.source","source URL or SHA-256 is malformed");let r=Lc(n.eastAsianWidthValues,"$.widthData.eastAsianWidthValues",16);r.length!==ai.length&&re("invalid-data","$.widthData.eastAsianWidthValues","property codec has the wrong length");for(let a=0;a<ai.length;a+=1)r[a]!==ai[a]&&re("invalid-data","$.widthData.eastAsianWidthValues","property codec does not match UAX #11");let o={schema:n.schema,schemaVersion:n.schemaVersion,unicodeVersion:n.unicodeVersion,dataPackFingerprint:n.dataPackFingerprint,source:n.source,eastAsianWidthValues:n.eastAsianWidthValues,eastAsianWidthRanges:n.eastAsianWidthRanges,assignedRanges:n.assignedRanges,combiningRanges:n.combiningRanges,zeroWidthRanges:n.zeroWidthRanges},i=ii(n.fingerprint,"$.widthData.fingerprint",64);return(!Ip.test(i)||zo(JSON.stringify(o))!==i)&&re("invalid-data","$.widthData.fingerprint","does not match the encoded width data"),$a=Object.freeze({unicodeVersion:Ap,dataPackFingerprint:Op,fingerprint:i,source:t,eastAsianWidth:Ha(n.eastAsianWidthRanges,"$.widthData.eastAsianWidthRanges",3),assigned:Ha(n.assignedRanges,"$.widthData.assignedRanges",2),combining:Ha(n.combiningRanges,"$.widthData.combiningRanges",2),zeroWidth:Ha(n.zeroWidthRanges,"$.widthData.zeroWidthRanges",2)}),$a}function Ba(n,e){let t=0,r=n.length-1;for(;t<=r;){let o=t+(r-t>>>1),i=n[o];if(e<i.start)r=o-1;else if(e>i.end)t=o+1;else return i}}function Pp(n){(!Number.isInteger(n)||n<0||n>Fa||n>=55296&&n<=57343)&&re("invalid-code-point","$.codePoint","expected a Unicode scalar value")}function rk(n){return n>=57344&&n<=63743||n>=983040&&n<=1048573||n>=1048576&&n<=1114109}function Np(n){return Object.freeze({ambiguous:n.ambiguous,combining:n.combining,privateUse:n.privateUse,unassigned:n.unassigned})}function ok(n,e){let t=no(n,e,["ambiguous","combining","privateUse","unassigned"],void 0,"invalid-profile");return t.ambiguous!==1&&t.ambiguous!==2&&re("invalid-profile",`${e}.ambiguous`,"expected 1 or 2 cells"),t.combining!==0&&t.combining!==1&&re("invalid-profile",`${e}.combining`,"expected 0 or 1 cells"),t.privateUse!==1&&t.privateUse!==2&&re("invalid-profile",`${e}.privateUse`,"expected 1 or 2 cells"),t.unassigned!==0&&t.unassigned!==1&&t.unassigned!==2&&re("invalid-profile",`${e}.unassigned`,"expected 0, 1, or 2 cells"),Object.freeze({ambiguous:t.ambiguous,combining:t.combining,privateUse:t.privateUse,unassigned:t.unassigned})}function ik(n){let e=no(n,"$.profile",["name","description","policy"],["name","policy"],"invalid-profile"),t=ii(e.name,"$.profile.name",fr.maxNameLength,"invalid-profile");Ic.test(t)||re("invalid-profile","$.profile.name","expected a lowercase profile token");let r="";return Object.hasOwn(e,"description")&&((typeof e.description!="string"||e.description.length>fr.maxDescriptionLength)&&re("invalid-profile","$.profile.description","description is too long or is not a string"),r=e.description),Object.freeze({name:t,description:r,policy:ok(e.policy,"$.profile.policy")})}function ak(){return{"zero-width-control":0,combining:0,"private-use":0,unassigned:0,ambiguous:0,fullwidth:0,wide:0,halfwidth:0,narrow:0,neutral:0}}function Wp(n,e,t,r){let o=Ba(r.eastAsianWidth,e)?.value??"N",i=Ba(r.assigned,e)!==void 0;return n.eastAsianWidth=o,n.assigned=i,rk(e)?(n.width=t.privateUse,n.category="private-use"):i?Ba(r.zeroWidth,e)!==void 0?(n.width=0,n.category="zero-width-control"):Ba(r.combining,e)!==void 0?(n.width=t.combining,n.category="combining"):o==="A"?(n.width=t.ambiguous,n.category="ambiguous"):o==="F"?(n.width=2,n.category="fullwidth"):o==="W"?(n.width=2,n.category="wide"):o==="H"?(n.width=1,n.category="halfwidth"):o==="Na"?(n.width=1,n.category="narrow"):(n.width=1,n.category="neutral"):(n.width=t.unassigned,n.category="unassigned"),n}var ro=class n{#e;#t;#i;constructor(e){new.target!==n&&re("invalid-profile","$.profile","width profiles cannot be subclassed");let t=ik(e);this.#e=t.name,this.#t=t.description,this.#i=t.policy,Dp.add(this),Object.freeze(this)}get name(){return this.#e}get policy(){return Np(this.#i)}measureCodePoint(e){Pp(e);let t=Ec(),r=Wp({width:0,category:"neutral",eastAsianWidth:"N",assigned:!1},e,this.#i,t);return Object.freeze({codePoint:e,...r})}codePointWidth(e){return this.measureCodePoint(e).width}measureText(e){typeof e!="string"&&re("invalid-data","$.text","expected a primitive string"),e.length>fr.maxTextUtf16Length&&re("limit-exceeded","$.text","text exceeds the UTF-16 measurement limit");let t=0,r=0,o=ak(),i=Ec(),a={width:0,category:"neutral",eastAsianWidth:"N",assigned:!1};for(let s of e){let l=s.codePointAt(0);Pp(l),Wp(a,l,this.#i,i),t+=1,r+=a.width,o[a.category]+=1}return Object.freeze({utf16Length:e.length,codePointCount:t,cells:r,categoryCounts:Object.freeze(o)})}textWidth(e){return this.measureText(e).cells}inspect(){let e=Ec();return Object.freeze({name:this.#e,description:this.#t,unicodeVersion:e.unicodeVersion,dataPackFingerprint:e.dataPackFingerprint,widthDataFingerprint:e.fingerprint,assignedSource:Object.freeze({...e.source}),policy:Np(this.#i)})}};function Vp(n,e){if(n!==null&&typeof n=="object"&&Dp.has(n))return n;try{return new ro(n)}catch(t){if(t instanceof ja)throw t;return re("invalid-profile",e,"profile could not be constructed safely")}}var Ac=class n{#e;#t;constructor(e,t={}){let r=Lc(e,"$.profiles",fr.maxProfiles,"invalid-profile");r.length===0&&re("invalid-profile","$.profiles","at least one profile is required");let o=r.map((s,l)=>Vp(s,`$.profiles[${l}]`));o.sort((s,l)=>s.name<l.name?-1:s.name>l.name?1:0);for(let s=1;s<o.length;s+=1)o[s-1].name===o[s].name&&re("duplicate-profile",`$.profiles[${s}].name`,"profile names must be unique");let a=no(t,"$.options",["defaultProfile"],[],"invalid-profile").defaultProfile??o[0].name;(typeof a!="string"||!Ic.test(a))&&re("invalid-profile","$.options.defaultProfile","expected a registered profile token"),o.some(s=>s.name===a)||re("profile-not-found","$.options.defaultProfile","default profile is not registered"),this.#e=Object.freeze(o),this.#t=a,Object.freeze(this)}get defaultProfile(){return this.#t}get names(){return Object.freeze(this.#e.map(e=>e.name))}select(e=this.#t){(typeof e!="string"||!Ic.test(e))&&re("invalid-profile","$.profileName","expected a profile token");let t=this.#e.find(r=>r.name===e);return t===void 0&&re("profile-not-found","$.profileName","profile is not registered"),t}withProfile(e,t={}){let r=Vp(e,"$.profile"),o=no(t,"$.options",["replace","makeDefault"],[],"invalid-profile");o.replace!==void 0&&typeof o.replace!="boolean"&&re("invalid-profile","$.options.replace","expected a boolean"),o.makeDefault!==void 0&&typeof o.makeDefault!="boolean"&&re("invalid-profile","$.options.makeDefault","expected a boolean");let i=this.#e.findIndex(s=>s.name===r.name);i>=0&&o.replace!==!0&&re("duplicate-profile","$.profile.name","profile is already registered");let a=[...this.#e];return i>=0?a[i]=r:a.push(r),new n(a,{defaultProfile:o.makeDefault===!0?r.name:this.#t})}inspect(){return Object.freeze({defaultProfile:this.#t,names:Object.freeze(this.#e.map(e=>e.name)),profiles:Object.freeze(this.#e.map(e=>e.inspect()))})}},Oc=new ro({name:"unicode-narrow",description:"Unicode 17 defaults with ambiguous, private-use, and unassigned scalars measured narrowly.",policy:{ambiguous:1,combining:0,privateUse:1,unassigned:1}}),sk=new ro({name:"cjk-wide",description:"CJK terminal policy with ambiguous, private-use, and unassigned scalars measured as two cells.",policy:{ambiguous:2,combining:0,privateUse:2,unassigned:2}}),lk=new ro({name:"visible-combining",description:"Diagnostic policy that assigns one visible cell to combining scalars.",policy:{ambiguous:1,combining:1,privateUse:1,unassigned:1}}),o_=new Ac([Oc,sk,lk],{defaultProfile:Oc.name});function Ga(n,e,t){for(let r=0;r<t.length;r+=1){let o=n[e.row+r];if(!o)continue;let i=t[r];for(let a=0;a<i.length;a+=1){let s=e.column+a;s<0||s>=o.length||(o[s]=i[a])}}}function zp(n,e){return ke(n,{char:" ",background:e.background})}function $p(n,e,t,r,o,i){let a=ck(e,t,r,o,i);if(!a)return dk(e);let s=n[a.row]??=new Set,l=s.size;for(let d=a.startColumn;d<a.endColumn;d+=1)s.add(d);return{row:a.row,startColumn:a.startColumn,endColumn:a.endColumn,queuedCells:s.size-l}}function dk(n){return{row:n,startColumn:0,endColumn:0,queuedCells:0}}function ck(n,e,t,r,o){if(n<0||n>=r.rows)return;let i=Math.max(0,Math.floor(e)),a=Math.min(r.columns,Math.ceil(t));if(o){if(n<o.row||n>=o.row+o.height)return;i=Math.max(i,o.column),a=Math.min(a,o.column+o.width)}if(!(a<=i))return{row:n,startColumn:i,endColumn:a}}function xt(n,e){return n instanceof Ee?n:new Ee(n,e)}var uk=0,Ua=class{id;type;canvas;style;zIndex;view;viewOffset;rectangle;previousRectangle;objectsUnder;omitCells;rerenderCells;rendered;outOfBounds;updated;moved;#e;#t;#i;#r;#o;#s;#n;constructor(e,t){this.id=uk++,this.type=e,this.canvas=t.canvas,this.viewOffset={columns:0,rows:0},this.omitCells=[],this.rerenderCells=[],this.objectsUnder=new Set,this.rendered=!1,this.outOfBounds=!1,this.canvas.updateObjects.push(this),this.updated=!0,this.moved=!0,this.view=xt(t.view),this.zIndex=xt(t.zIndex),this.style=xt(t.style);let{updateObjects:r}=this.canvas;this.#e=()=>{this.rendered=!1,this.updated=!1,r.push(this);for(let o of this.objectsUnder)o.updated=!1,r.push(o)},this.#t=()=>{this.canvas.resortDrawnObjects(),this.previousRectangle=void 0,this.moved=!0,this.updated=!1,r.push(this)},this.#i=o=>this.#a(o),this.#r=()=>this.#l(),this.#o=()=>this.#l(),this.#s=()=>this.#c(),this.view.subscribe(this.#i),queueMicrotask(()=>this.#a(this.view.peek()))}draw(){this.style.subscribe(this.#e),this.zIndex.subscribe(this.#t),this.rendered=!1;let{objectsUnder:e}=this,{updateObjects:t}=this.canvas;this.moved=!0,this.updated=!1,t.push(this);for(let r of e)r.moved=!0,r.updated=!1,t.push(r);this.canvas.drawnObjects.includes(this)||this.canvas.drawnObjects.push(this),this.canvas.drawnOrderVersion+=1}erase(){this.style.unsubscribe(this.#e),this.zIndex.unsubscribe(this.#t);let{drawnObjects:e}=this.canvas;e.remove(this),this.canvas.drawnOrderVersion+=1;for(let c of e)c.objectsUnder.delete(this);let{objectsUnder:t}=this,{updateObjects:r}=this.canvas;this.moved=!0,this.updated=!1,r.push(this);for(let c of t)c.moved=!0,c.updated=!1,r.push(c);let{column:o,row:i,width:a,height:s}=this.rectangle.peek(),l=i+s,d=o+a;for(let c=i;c<l;++c)for(let u of t)u.queueRerenderRange(c,o,d)}queueRerender(e,t){this.queueRerenderRange(e,t,t+1)}queueRerenderRange(e,t,r){let o=this.view.peek()?.rectangle?.peek();$p(this.rerenderCells,e,t,r,this.canvas.size.peek(),o)}queueRerenderRectangle(e){let t=e.row+e.height,r=e.column+e.width;for(let o=e.row;o<t;o+=1)this.queueRerenderRange(o,e.column,r)}updatePreviousRectangle(){let{previousRectangle:e}=this,{column:t,row:r,width:o,height:i}=this.rectangle.peek();e?(e.column=t,e.row=r,e.width=o,e.height=i):this.previousRectangle={column:t,row:r,width:o,height:i}}updateMovement(){let{previousRectangle:e,objectsUnder:t}=this,r=this.rectangle.peek();if(!e||$r(r,e))return;let o=or(r,e,!0),i=e.row+e.height,a=e.column+e.width;for(let d=e.row;d<i;++d){if(o&&d>=o.row&&d<o.row+o.height){for(let c of t)c.queueRerenderRange(d,e.column,o.column),c.queueRerenderRange(d,o.column+o.width,a);continue}for(let c of t)c.queueRerenderRange(d,e.column,a)}let s=r.row+r.height,l=r.column+r.width;for(let d=r.row;d<s;++d){if(o&&d>=o.row&&d<o.row+o.height){this.queueRerenderRange(d,r.column,o.column),this.queueRerenderRange(d,o.column+o.width,l);continue}this.queueRerenderRange(d,r.column,l)}}updateOutOfBounds(){let{columns:e,rows:t}=this.canvas.size.peek(),{column:r,row:o,width:i,height:a}=this.rectangle.peek();if(this.outOfBounds=i===0||a===0||r>=e||o>=t||r+i<0||o+a<0,!this.outOfBounds){let s=this.view.peek()?.rectangle?.peek();if(!s)return;(r>s.column+s.width||o>s.row+s.height||r+i<s.column||o+a<s.row)&&(this.outOfBounds=!0)}}update(){}render(){let{column:e,row:t,width:r,height:o}=this.rectangle.peek();this.queueRerenderRectangle({column:e,row:t,width:r,height:o}),this.rerender()}rerender(){}#a(e){if(this.#n===e){this.#l();return}this.#n&&(this.#n.rectangle.unsubscribe(this.#r),this.#n.offset.unsubscribe(this.#o),this.#n.maxOffset.unsubscribe(this.#s)),this.#n=e,e&&(e.rectangle.subscribe(this.#r),e.offset.subscribe(this.#o),e.maxOffset.subscribe(this.#s)),this.#l()}#l(){let e=this.#n;if(!e){this.#c();return}let t=this.rectangle?.peek();if(!t)return;let r=e.rectangle.peek(),o=e.offset.peek(),i=r.column-o.columns,a=r.row-o.rows,s=i-this.viewOffset.columns,l=a-this.viewOffset.rows;if(s!==0||l!==0){t.column+=s,t.row+=l,this.moved=!0;for(let d of this.objectsUnder)d.moved=!0}this.viewOffset.columns=i,this.viewOffset.rows=a,this.#c()}#c(){let{updateObjects:e}=this.canvas;this.updated=!1,e.push(this);for(let t of this.objectsUnder)t.updated=!1,e.push(t)}};var Ka=class n{#e=new Map;#t=0;static fromRectangles(e){let t=new n;return t.resetFromRectangles(e),t}resetFromRectangles(e){this.clearRetainingRows();for(let t of e)this.addRectangleUnmerged(t);this.mergeRows()}addRectangleUnmerged(e){let t=Math.floor(e.row),r=t+Math.max(0,Math.floor(e.height)),o=Math.floor(e.column),i=o+Math.max(0,Math.floor(e.width));if(!(r<=t||i<=o))for(let a=t;a<r;a+=1){let s=this.#e.get(a),l={row:a,startColumn:o,endColumn:i};s?s.push(l):this.#e.set(a,[l])}}addRectangle(e){let t=Math.floor(e.row),r=t+Math.max(0,Math.floor(e.height)),o=Math.floor(e.column),i=o+Math.max(0,Math.floor(e.width));for(let a=t;a<r;a+=1)this.addSegment(a,o,i)}addSegment(e,t,r){let o=Math.floor(e),i=Math.floor(Math.min(t,r)),a=Math.floor(Math.max(t,r));if(a<=i)return;let s=this.#e.get(o);if(s){let l=s.length;s.push({row:o,startColumn:i,endColumn:a}),oo(s),this.#t+=s.length-l}else this.#e.set(o,[{row:o,startColumn:i,endColumn:a}]),this.#t+=1}clear(){this.#e.clear(),this.#t=0}isEmpty(){return this.#t===0}inspect(){let e=[];for(let r of this.#e.keys())e.push(r);e.sort((r,o)=>r-o);let t=[];for(let r of e){let o=this.#e.get(r);if(o)for(let i of o)t.push({...i})}return t}forEachSegment(e){for(let t of this.#e.values())for(let r of t)e(r)}intersects(e){let t=Math.floor(e.row),r=t+Math.max(0,Math.floor(e.height)),o=Math.floor(e.column),i=o+Math.max(0,Math.floor(e.width));if(r<=t||i<=o)return!1;for(let a=t;a<r;a+=1)for(let s of this.#e.get(a)??[])if(Math.min(i,s.endColumn)>Math.max(o,s.startColumn))return!0;return!1}intersections(e){let t=[];return this.forEachIntersection(e,r=>{t.push({...r})}),t}forEachIntersection(e,t){this.forEachIntersectionValue(e,(r,o,i)=>{t({row:r,startColumn:o,endColumn:i})})}forEachIntersectionValue(e,t){let r=Math.floor(e.row),o=r+Math.max(0,Math.floor(e.height)),i=Math.floor(e.column),a=i+Math.max(0,Math.floor(e.width));if(!(o<=r||a<=i))for(let s=r;s<o;s+=1)for(let l of this.#e.get(s)??[]){let d=Math.max(i,l.startColumn),c=Math.min(a,l.endColumn);c>d&&t(s,d,c)}}mergeRows(){let e=0;for(let t of this.#e.values())oo(t),e+=t.length;this.#t=e}clearRetainingRows(){for(let e of this.#e.values())e.length=0;this.#t=0}};function oo(n){if(n.length<2)return;n.sort((t,r)=>t.startColumn-r.startColumn||t.endColumn-r.endColumn);let e=0;for(let t=1;t<n.length;t+=1){let r=n[e],o=n[t];if(o.startColumn<=r.endColumn){r.endColumn=Math.max(r.endColumn,o.endColumn);continue}e+=1,n[e]=o}n.length=e+1}var si=class extends Ua{text;valueChars;overwriteRectangle;multiCodePointSupport;rerenderRanges;#e;#t;constructor(e){super("text",e),this.text=xt(e.value),this.rectangle=xt(e.rectangle),this.overwriteRectangle=xt(e.overwriteRectangle??!1),this.multiCodePointSupport=xt(e.multiCodePointSupport??!1),this.valueChars=this.multiCodePointSupport.value?Hp(this.text.value):this.text.value,this.rerenderRanges=[];let{updateObjects:t}=this.canvas,r=(o,i,a,s)=>{if(!s){let m=i.width;if(i.width=Ue(o),i.width!==m){this.moved=!0;for(let g of this.objectsUnder)g.moved=!0}}i.height=1;let{valueChars:l}=this,d=this.valueChars=a?Hp(o):o,{row:c,column:u,width:h}=i,f=s?h<l.length?h:-1:d.length<l.length?d.length:-1,p=Math.max(d.length,l.length);if(s&&h!==void 0&&d.length>=h){hk(this,l,d,c,u,h);return}if(f!==-1)for(let m=0;m<p;++m)if(m>=f)for(let g of this.objectsUnder)g.queueRerender(c,u+m);else d[m]!==l[m]&&this.queueRerender(c,u+m);else for(let m=0;m<p;++m)d[m]!==l[m]&&this.queueRerender(c,u+m)};this.#e=o=>{let i=this.text.peek(),a=this.multiCodePointSupport.peek(),s=this.overwriteRectangle.peek();this.moved=!0,this.updated=!1,t.push(this);for(let l of this.objectsUnder)l.moved=!0,l.updated=!1,t.push(l);r(i,o,a,s)},this.#t=new Ao(()=>{let o=this.text.value,i=this.rectangle.peek(),a=this.overwriteRectangle.value,s=this.multiCodePointSupport.value;this.updated=!1,t.push(this);for(let l of this.objectsUnder)l.updated=!1,t.push(l);r(o,i,s,a)})}draw(){this.#t.resume(),this.rectangle.subscribe(this.#e),super.draw()}erase(){this.#t.pause(),this.rectangle.unsubscribe(this.#e),super.erase()}queueRerender(e,t){this.queueRerenderRange(e,t,t+1)}queueRerenderRange(e,t,r){let o=this.view.peek()?.rectangle?.peek();if(e<0)return;let{columns:i,rows:a}=this.canvas.size.peek();if(e>=a)return;let s=Math.max(0,Math.floor(t)),l=Math.min(i,Math.ceil(r));if(o){if(e<o.row||e>=o.row+o.height)return;s=Math.max(s,o.column),l=Math.min(l,o.column+o.width)}if(l<=s)return;let d=Math.floor(e);(this.rerenderRanges[d]??=[]).push({row:d,startColumn:s,endColumn:l})}updateMovement(){let{objectsUnder:e,previousRectangle:t}=this,r=this.rectangle.peek();if(!t||$r(r,t))return;let o=or(r,t,!0),i=t.row,a=t.column+t.width;for(let c=t.column;c<a;++c)if(!(o&&aa(c,i,o)))for(let u of e)u.queueRerender(i,c);let s=r.column!==t.column||r.row!==t.row,{row:l}=r,d=r.column+r.width;for(let c=r.column;c<d;++c)if(s&&this.queueRerender(l,c),!(o&&aa(c,l,o)))for(let u of e)u.queueRerender(l,c)}rerender(){let{canvas:e,valueChars:t,omitCells:r,rerenderCells:o,rerenderRanges:i}=this,{frameBuffer:a,rerenderQueue:s}=e,{columns:l,rows:d}=e.size.peek(),c=this.rectangle.peek(),u=this.style.peek(),{row:h}=c,f=this.overwriteRectangle.peek()?c.width??t.length:t.length,p=Math.min(h,d),m=Math.min(c.column+f,l),g=this.view.peek()?.rectangle?.peek();if(g&&(p=Math.min(h,g.row+g.height),m=Math.min(m,g.column+g.width)),h>p)return;let y=o[h],b=i[h];if(!y?.size&&!b?.length)return;let w=r[h];if(w?.size===t.length){y?.clear(),b&&(b.length=0);return}let x=a[h]??=[],k=Math.max(0,c.column,g?.column??0),C=T=>{let S=T-c.column,A=t[S]??" ";return(A===""&&(T===k||w?.has(T-1))||t[S+1]===""&&(T+1>=m||w?.has(T+1)))&&(A=" "),u(A)};if(b?.length){oo(b);let T=w?.size?void 0:e.rerenderRanges[h]??=[],S;for(let A of b){let I=Math.max(A.startColumn,c.column),O=Math.min(A.endColumn,m);if(!(O<=I)){for(let v=I;v<O;v+=1)w?.has(v)||(x[v]=C(v),T||(S??=s[h]??=new Set,S.add(v)));T&&T.push({row:h,startColumn:I,endColumn:O})}}b.length=0}if(y?.size){let T=s[h]??=new Set;for(let S of y)S>=m||S<c.column||w?.has(S)||(x[S]=C(S),T.add(S));y.clear()}}};function Hp(n){let e=xf(n);return Ue(n)===e.length?e:e.flatMap(t=>{let r=Ue(t);return r===2?[t,""]:r?[t]:[]})}function hk(n,e,t,r,o,i){let a=-1;for(let s=0;s<i;s+=1){let l=t[s]??" ",d=e[s]??" ";if(l===d){a!==-1&&(n.queueRerenderRange(r,o+a,o+s),a=-1);continue}a===-1&&(a=s)}a!==-1&&n.queueRerenderRange(r,o+a,o+i)}var mr=class{listeners={};on(e,t,r){let o=this.listeners[e];if(o||(o=[],this.listeners[e]=o),r){let i=t;t=(...a)=>{i.apply(this,a),this.off(e,t)}}return o.includes(t)?()=>this.off(e,t):(o.splice(o.length,0,t),()=>this.off(e,t))}once(e,t){return this.on(e,t,!0)}off(e,t){if(!e){this.listeners={};return}if(!t){this.listeners[e]=[];return}let r=this.listeners[e];if(!r)return;let o=r.indexOf(t);o<0||r.splice(o,1)}emit(e,...t){let r=this.listeners[e];if(r?.length)for(let o of r)o.apply(this,t)}listenerCount(e){if(e!==void 0)return this.listeners[e]?.length??0;let t=0;for(let r in this.listeners)t+=this.listeners[r]?.length??0;return t}eventNames(){let e=[];for(let t in this.listeners)(this.listeners[t]?.length??0)>0&&e.push(t);return e}inspect(){let e=[],t=0;for(let r in this.listeners){let o=this.listeners[r]?.length??0;o<=0||(t+=o,e.push({type:r,listenerCount:o}))}return e.sort((r,o)=>r.type.localeCompare(o.type)),{eventCount:e.length,listenerCount:t,events:e}}};var li=class extends Array{compareFn;constructor(e,...t){super(...t),this.compareFn=e}push(...e){return super.push(...e),this.sort(this.compareFn),this.length}remove(...e){for(let t of e){let r=this.indexOf(t);r>=0&&this.splice(r,1)}return this.length}};var f9=1<<20;var $n=n=>e=>e.toFixed(n),Pc={exposure:1.1,attenuation:1,blendWithBase:1,asciiColor:"#ffffff",backgroundColor:"#000000",depthFalloff:0,depthOffset:180,edgeThreshold:12,normalThreshold:.2,depthThreshold:.13,edges:!1,fill:!0,invertLuminance:!1},L9=[{key:"edgeThreshold",label:"Edge threshold",min:2,max:20,step:.5,format:$n(1)},{key:"normalThreshold",label:"Normal edge",min:.05,max:.4,step:.01,format:$n(2)},{key:"depthThreshold",label:"Depth edge",min:.03,max:.25,step:.01,format:$n(2)},{key:"exposure",label:"Exposure",min:.7,max:1.8,step:.01,format:$n(2)},{key:"attenuation",label:"Attenuation",min:.7,max:1.6,step:.01,format:$n(2)},{key:"blendWithBase",label:"Base blend",min:0,max:1,step:.01,format:$n(2)},{key:"depthFalloff",label:"Fog falloff",min:0,max:.4,step:.01,format:$n(2)},{key:"depthOffset",label:"Fog offset",min:0,max:180,step:1,format:$n(0)}];var Nc=[{id:"opentui-blocks",label:"OpenTUI Blocks",description:"Chunky fill-first blocks tuned to read like the Neon Exodus OpenTUI panels.",effect:{edgeThreshold:14,normalThreshold:.24,depthThreshold:.15,exposure:1.28,attenuation:.96,blendWithBase:1,depthFalloff:0,depthOffset:150,edges:!1,fill:!0,invertLuminance:!1},terminalEdgeBias:1.45,terminalGlyphStyle:"blocks"},{id:"glyph-atlas",label:"Glyph Atlas",description:"Character-ramp ASCII output for a lighter Acerola glyph look.",effect:{edgeThreshold:10,normalThreshold:.18,depthThreshold:.11,exposure:1.2,attenuation:1.08,blendWithBase:.35,depthFalloff:.08,depthOffset:140,edges:!0,fill:!0,invertLuminance:!1},terminalEdgeBias:1,terminalGlyphStyle:"glyphs"},{id:"mixed-best",label:"Mixed Best",description:"Chooses across block and character glyphs using the closest terminal coverage match.",effect:{edgeThreshold:11,normalThreshold:.19,depthThreshold:.12,exposure:1.22,attenuation:1.02,blendWithBase:.7,depthFalloff:.06,depthOffset:145,edges:!0,fill:!0,invertLuminance:!1},terminalEdgeBias:1.15,terminalGlyphStyle:"mixed"},{id:"balanced",label:"Balanced",description:"Matches the current demo tuning.",effect:{...Pc},terminalEdgeBias:1,terminalGlyphStyle:"mixed"},{id:"soft-fill",label:"Soft Fill",description:"Pulls back edges and lets the fill atlas carry more of the shape.",effect:{edgeThreshold:12,normalThreshold:.21,depthThreshold:.14,exposure:1.16,attenuation:1.04,blendWithBase:.34,depthFalloff:.14,depthOffset:105,edges:!0,fill:!0,invertLuminance:!1},terminalEdgeBias:1.3,terminalGlyphStyle:"glyphs"},{id:"contrast",label:"High Contrast",description:"Sharper edges, stronger glyph separation, brighter highlights.",effect:{edgeThreshold:8,normalThreshold:.14,depthThreshold:.08,exposure:1.38,attenuation:1.34,blendWithBase:.15,depthFalloff:.22,depthOffset:116,edges:!0,fill:!0,invertLuminance:!1},terminalEdgeBias:.92,terminalGlyphStyle:"mixed"},{id:"wire",label:"Wire",description:"Edge-first look with fill disabled.",effect:{edgeThreshold:9,normalThreshold:.16,depthThreshold:.1,exposure:1.14,attenuation:1,blendWithBase:0,depthFalloff:.1,depthOffset:100,edges:!0,fill:!1,invertLuminance:!1},terminalEdgeBias:.88,terminalGlyphStyle:"glyphs"},{id:"fill-only",label:"Fill Only",description:"Disables edges and keeps the original model color visible through the glyphs.",effect:{edgeThreshold:12,normalThreshold:.2,depthThreshold:.13,exposure:1.1,attenuation:1,blendWithBase:1,depthFalloff:0,depthOffset:180,edges:!1,fill:!0,invertLuminance:!1},terminalEdgeBias:1.2,terminalGlyphStyle:"blocks"}];var fk=mk();function mk(){let n=new Map;for(let e of Nc)n.set(e.id,e);return n}function Bp(n="sharp"){return pk("opentui-blocks",n)}function pk(n,e){let t=fk.get(n)??Nc[0],r={...Pc,...t.effect};return{preset:t.id,border:e,terminalGlyphStyle:t.terminalGlyphStyle??"blocks",terminalEdgeBias:t.terminalEdgeBias??1,edgeThreshold:r.edgeThreshold??10,normalThreshold:r.normalThreshold??.18,depthThreshold:r.depthThreshold??.11,exposure:r.exposure??1.25,attenuation:r.attenuation??1.2,blendWithBase:r.blendWithBase??.24,depthFalloff:r.depthFalloff??.18,depthOffset:r.depthOffset??110,wireframeThickness:8,renderMaxCells:3840,deferredReadbackSlots:6,edges:r.edges??!0,fill:r.fill??!0,invertLuminance:r.invertLuminance??!1,kittyGraphics:!1,kittyDisableAscii:!1}}var di=globalThis,gk="./bun_host.ts",io=di.__exotuiRuntimeHost??(di.Deno&&!di.Bun?new Proxy(di.Deno,{get(n,e){return e==="runtime"?"deno":Reflect.get(n,e)},set(n,e,t){return Reflect.set(n,e,t)}}):di.Bun?(await import(gk)).createBunHost():void 0);var ao={void:"#05070d",voidSoft:"#0f1b34",panel:"#0a1020",panelSoft:"#111932",alarm:"#ff4231",amber:"#ff9f24",phosphor:"#7dffba",signal:"#5bb0ff",violet:"#b17cff",paper:"#eff7ff",dim:"#5a6478",shade:"#000000"},bk={void:ao.void,alarm:ao.alarm,amber:ao.amber,phosphor:ao.phosphor,signal:ao.signal,violet:ao.violet};function ce(n,e=0,t=1){return Math.max(e,Math.min(t,n))}function Rt(n){return`${n.toFixed(n>=100?0:1)}%`}function ut(n){return yk(n," ")}function yk(n,e){let t=["B","KiB","MiB","GiB","TiB"],r=Math.max(0,n),o=0;for(;r>=1024&&o<t.length-1;)r/=1024,o+=1;let i=r>=100||o===0?0:r>=10?1:2;return`${r.toFixed(i)}${e}${t[o]}`}function Wt(n){return`${ut(n)}/s`}function Zt(n,e){return n===null?"--":`${n.toFixed(n>=100?0:1)}${e}`}function be(n,e=48){let t=Math.max(8,e),r=n.sources.length>0?n.sources:[qa(n.phase)],o=new Array(r.length);for(let V=0;V<r.length;V+=1){let B=r[V],z=so(B.series.length>0?B.series:[B.value],t),Y=B.value,q=B.value;for(let H of z)Y=Math.min(Y,H),q=Math.max(q,H);let te=Math.max(0,q-Y),Q=new Array(z.length);for(let H=0;H<z.length;H+=1){let F=z[H],oe=te<.035?F:ce((F-Y)/Math.max(te,.001),0,1),he=Math.abs(H===0?B.value-F:F-(z[H-1]??F));Q[H]=ce(oe*.72+F*.22+he*.48,0,1)}let U=(()=>{let H=te<.035?B.value:ce((B.value-Y)/Math.max(te,.001),0,1);return ce(H*.72+B.value*.28,0,1)})(),$=wk(Q),W=jp(Q,Math.min(6,t-1)),L=Gp(Q),j=ce(U*.44+$*.18+L*.24+Math.abs(W)*.14,0,1);o[V]={source:B,rawSeries:z,normalizedSeries:Q,value:ce(B.value,0,1),normalizedValue:U,average:$,floor:Y,ceiling:q,span:te,slope:W,volatility:L,energy:j}}let i=o[0],a=o[1]??i,s=Fp(o,t,"rawSeries"),l=Fp(o,t,"normalizedSeries"),d=new Array(t),c=new Array(t),u=new Array(t);for(let V=0;V<t;V+=1){let B=Number.POSITIVE_INFINITY,z=Number.NEGATIVE_INFINITY;for(let te of o){let Q=te.normalizedSeries[V]??te.normalizedValue;B=Math.min(B,Q),z=Math.max(z,Q)}let Y=l[V]??0,q=V===0?0:Math.abs(Y-(l[V-1]??Y));d[V]=ce(z-B,0,1),c[V]=q,u[V]=ce(Y*.6+q*.18+d[V]*.22,0,1)}let h=vk(l),f=0,p=h,m=0,g=0,y=0;for(let V of o)f+=V.value,p=Math.max(p,V.value),m+=V.volatility,g+=Math.abs(V.normalizedValue-h),(V.energy>=.55||V.value>=.62)&&(y+=1);let b=ce(f/o.length,0,1),w=ce(Math.max(p,b),0,1),x=Number.POSITIVE_INFINITY,k=Number.NEGATIVE_INFINITY;for(let V of l)x=Math.min(x,V),k=Math.max(k,V);let C=ce(k-x,0,1),T=jp(l,Math.min(6,t-1)),S=Up(l,Math.max(2,l.length-2),Math.min(6,t-1)),A=ce(T-S,-1,1),I=ce(ce(m/o.length,0,1)*.55+Gp(l)*.45,0,1),O=ce(ce(g/o.length,0,1)*1.4+Math.abs(i.normalizedValue-a.normalizedValue)*.25,0,1),v=ce(i.normalizedValue-a.normalizedValue,-1,1),N=n.system.alerts.length>0?.76:0;for(let V of n.system.alerts)if(V.severity==="alarm"){N=1;break}let R=ce(.16+I*.34+Math.abs(T)*.26+O*.24,0,1),M=ce(.18+h*.34+I*.24+O*.12+y/o.length*.12,0,1),_=ce(Math.max(N,b*.24+h*.28+w*.2+I*.16+O*.12),0,1),K=n.phase+Math.round(h*37+I*29+O*23+b*17+y*7),X=Xa(n.phase*.027+h*.31+I*.21+O*.17);return{sources:o,primary:i,secondary:a,rawSeries:s,normalizedSeries:l,spreadSeries:d,motionSeries:c,pulseSeries:u,current:h,absolute:b,peak:w,floor:x,ceiling:k,span:C,slope:T,jerk:A,volatility:I,divergence:O,imbalance:v,cadence:R,density:M,hazard:_,alertPressure:N,activeCount:y,phase:K,scan:X}}function qa(n){let e=new Array(48);for(let t=0;t<e.length;t+=1)e[t]=(Math.sin((n+t)*.18)+1)/2;return{id:"fallback",name:"Fallback Pulse",accent:"signal",value:(Math.sin(n*.18)+1)/2,series:e,detailLines:["FALLBACK SOURCE"]}}function so(n,e){if(e<=0)return[];let t=new Array(e);for(let r=0;r<e;r+=1)t[r]=Ya(n,r,e);return t}function Ya(n,e,t){if(t<=0||n.length===0)return 0;let r=Math.max(0,Math.min(Math.floor(e),Math.max(0,t-1))),o=t===1?0:r/(t-1),i=Math.round(o*(n.length-1));return ce(n[i]??0,0,1)}function Xa(n){let e=n%1;return e<0?e+1:e}function Fp(n,e,t){if(n.length===0)return new Array(e).fill(0);let r=new Array(e);for(let o=0;o<e;o+=1){let i=0;for(let a of n)i+=a[t][o]??0;r[o]=ce(i/n.length,0,1)}return r}function jp(n,e=4){return Up(n,n.length,e)}function Up(n,e,t=4){if(n.length<=1)return 0;let r=Math.min(n.length,Math.max(0,e))-1;if(r<=0)return 0;let o=Math.max(0,r-Math.max(1,t));return ce((n[r]-n[o])*1.4,-1,1)}function Gp(n){if(n.length<=1)return 0;let e=0;for(let t=1;t<n.length;t+=1)e+=Math.abs(n[t]-n[t-1]);return ce(e/(n.length-1)*2.4,0,1)}function wk(n){if(n.length===0)return .12;let e=0;for(let t=0;t<n.length;t+=1)e+=n[t];return ce(e/n.length,0,1)}function vk(n){return n[n.length-1]??0}function yn(n,e,t,r,o=1){let i=new Array(n);for(let a=0;a<n;a++)i[a]=Wc(e+a,t,r)*o;return i}function Wc(n,e,t){return Math.max(0,Math.min(1,.5+Math.sin(n*e+t)*.34+Math.cos(n*(e*.37)+t*2.1)*.16))}function Kp(n){let e=0;for(let t=0;t<n.length;t+=1)e+=n.charCodeAt(t);return e}function Hn(n,e){return n.hazard>=.9?"\u2588":n.volatility>=.52?e==="amber"?"\u2593":e==="violet"?"\u25C6":"\u2592":e==="alarm"?"\u2573":e==="amber"?"\u25A0":e==="violet"?"\u25C6":"\u25CF"}function Ja(n,e,t){let r=t>=.9?"\u2588":t>=.72?"\u2593":"\u2592",o=Math.round(ce(n,0,1)*e);return`[${r.repeat(o).padEnd(e,"\xB7")}]`}function Za(n,e,t,r){return Qa(so(n,e),e,t,r)}function Vc(n,e,t,r){let o=so(n,e),i=_t(e,t," ");for(let a=0;a<e;a+=1){let s=Math.max(1,Math.round((o[a]??0)*t));for(let l=0;l<t;l+=1){let d=t-l;if(d<=s){let c=ce(d/Math.max(1,s),0,1),u=Math.min(r.length-1,Math.max(1,Math.ceil(c*(r.length-1))));Be(i,a,l,r[u]??r[r.length-1]??"#")}}}return Ct(i)}function Qa(n,e,t,r){let o=so(n,e),i=_t(e,t," "),a=Math.floor(t/2);for(let l=0;l<e;l+=1)Be(i,l,a,"\u2500");let s=a;for(let l=0;l<e;l+=1){let d=Math.round((1-(o[l]??0))*Math.max(0,t-1));l>0&&qe(i,l-1,s,l,d,r),Be(i,l,d,r),s=d}return Ct(i)}function pr(n,e,t){return Math.min(t,Math.max(e,n))}function qp(n,e){let t=e>=72?28:e>=52?24:e>=40?20:16,r=Math.max(1,Math.floor((e+1)/(t+1))),o=Math.ceil(n.length/r),i="";for(let a=0;a<o;a+=1){a>0&&(i+=`
`);let s=!0;for(let l=0;l<r;l+=1){let d=n[a+l*o];d&&(s||(i+=" "),i+=me(d,t).padEnd(t," "),s=!1)}}return i}function me(n,e){return e<=0?"":n.length<=e?n:`${n.slice(0,Math.max(0,e-1))}\u2026`}function Dc(n,e=" / "){if(n.length===0)return"";let t=new Array(n.length);for(let r=0;r<n.length;r+=1)t[r]=n[r].toFixed(2);return t.join(e)}function zc(n,e,t){return n>=t?"alarm":n>=e?"warning":"info"}function et(n){let e=n.system.alerts[0];return e?`${e.title} / ${e.detail}`:""}function at(n){return n.hazard>=.92?"LIMIT CASCADE":n.divergence>=.66?"CHANNEL FRACTURE":n.volatility>=.58?"OSCILLATION SPIKE":n.slope>=.24?"SURGE FRONT":""}function Yp(n){let e=!1;for(let t of n){if(t.accent==="alarm")return"alarm";t.accent==="amber"&&(e=!0)}return e?"amber":n[0]?.accent??"signal"}function Le(n){if(n.length===0)return"SRC NONE";let e="SRC ";for(let t=0;t<n.length;t+=1)t>0&&(e+=" + "),e+=me(n[t].name.toUpperCase(),12);return e}function Xp(n){if(n.length===0)return Le(n);let e="",t=Math.min(2,n.length);for(let r=0;r<t;r+=1){let o=n[r],i=o.detailLines[0]??`${Math.round(o.value*100)}%`;r>0&&(e+=" / "),e+=`${me(o.name.toUpperCase(),8)} ${me(i,20)}`}return e||Le(n)}function Jp(n){let e;for(let t of n){if(t.accent==="alarm"){e=t;break}!e&&t.accent==="amber"&&(e=t)}return e?e.accent==="alarm"?`${me(e.name.toUpperCase(),10)} CRIT`:`${me(e.name.toUpperCase(),10)} WARN`:""}function Zp(n,e){let t=[];for(let r of n){let o=r.name.toUpperCase();for(let i of r.detailLines)if(t.push(`${o}  ${i}`),t.length>=4)return t}return t.push(`VECTOR DRIVE ${(e.current*100).toFixed(0)}%`),t.length>=4||(t.push(`OSCILLATION ${(e.volatility*100).toFixed(0)}%`),t.length>=4)||t.push(e.divergence>=.6?`CHANNEL SPLIT ${(e.divergence*100).toFixed(0)}%`:`DENSITY ${(e.density*100).toFixed(0)}%`),t}function $c(n){let e="";for(let t=0;t<n.length;t+=1)t>0&&(e+=" / "),e+=me(n[t].name.toUpperCase(),8);return e}function _t(n,e,t=" "){let r=new Array(Math.max(0,e)),o=Math.max(0,n);for(let i=0;i<r.length;i+=1)r[i]=new Array(o).fill(t);return r}function Ct(n){let e="";for(let t=0;t<n.length;t+=1)t>0&&(e+=`
`),e+=n[t].join("");return e}function Be(n,e,t,r){let o=n[t];!o||e<0||e>=o.length||(o[e]=r)}function qe(n,e,t,r,o,i){let a=Math.max(Math.abs(r-e),Math.abs(o-t),1);for(let s=0;s<=a;s+=1){let l=Math.round(e+(r-e)*s/a),d=Math.round(t+(o-t)*s/a);Be(n,l,d,i)}}function Qp(n,e,t,r,o,i){let a=Math.max(24,Math.round(Math.max(r,o)*8));for(let s=0;s<a;s+=1){let l=s/a*Math.PI*2,d=Math.round(e+Math.cos(l)*r),c=Math.round(t+Math.sin(l)*o);Be(n,d,c,i)}}var xk={lattice:"LATTICE",atfield:"AT-FIELD",hexshell:"HEX SHELL",capture:"CAPTURE",mapslab:"MAP SLAB",solenoid:"SOLENOID",studio:"ACEROLA",emergency:"EMERGENCY",counter:"COUNTER",plug:"TEST PLUG",surveillance:"SURVEIL",relay:"RELAY",rack:"RACK",scope:"SCOPE",biosignal:"BIOSIGNAL",harmonic:"HARMONIC",psychograph:"PSYCHO",field:"FIELD",heat:"HEX FIELD",route:"ROUTE",topology:"TOPOLOGY",command:"COMMAND",launch:"LAUNCH",magi:"MAGI",target:"TARGET",waveform:"WAVEFORM",angel:"ANGEL",gate:"GATE"};function e0(n){return xk[n]}var gr=[{percent:0,rgb:[45,112,255]},{percent:25,rgb:[22,214,107]},{percent:50,rgb:[255,226,74]},{percent:75,rgb:[255,159,36]},{percent:100,rgb:[255,66,49]}];function o0(n,e){let{system:t,width:r,height:o}=n,i=be(n,Math.max(r,48)),a=Math.max(4,o-3),s=e.plotHistory(t.cpuHistory,Math.max(12,r),a,e.monitorGlyph(i,"signal")),l=Pk(t.cpuCores);return{body:[`AVG ${t.cpuOverall.toFixed(1)}%   LOAD ${Dc(t.loadavg)}`,s,l||"NO CORE DATA"].join(`
`),footer:`HOST ${t.hostname.toUpperCase()}  UPTIME ${Sk(t.uptimeSeconds)}  SURGE ${(i.volatility*100).toFixed(0)}%`,alert:et(n)||(i.hazard>=.9?"CORE CASCADE RISK":""),accent:i.hazard>=.9?"alarm":t.cpuOverall>=72?"amber":"signal",severity:i.hazard>=.9?"alarm":zc(t.cpuOverall,72,88)}}function i0(n,e){let t=be(n,24);return{body:[`TOTAL  ${Rt(n.system.cpuOverall)}`,...zk(n.system.cpuCores,n.width,t.hazard,e)].join(`
`),footer:`CORES ${String(n.system.cpuCores.length).padStart(2,"0")}  LOAD ${(t.current*100).toFixed(0)}%`,alert:n.system.cpuOverall>=88?"PULSE LIMIT":t.divergence>=.6?"CORE DESYNC":"",accent:n.system.cpuOverall>=88?"alarm":t.divergence>=.6?"amber":"signal",severity:n.system.cpuOverall>=88?"alarm":t.divergence>=.6?"warning":"info"}}function a0(n,e){let{system:t,width:r,height:o}=n,i=be(n,Math.max(r,48)),a=Math.max(12,r),s=Math.max(3,Math.floor((o-4)/2)),l=e.plotHistory(t.memoryHistory,a,s,e.monitorGlyph(i,"phosphor")),d=e.plotHistory(t.swapHistory,a,s,i.hazard>=.88?"\u2588":e.monitorGlyph(i,"amber"));return{body:[`RAM  ${Rt(t.memory.percent)}  USED ${ut(t.memory.used)}  AVAIL ${ut(t.memory.available)}`,l,`SWAP ${Rt(t.memory.swapPercent)}  USED ${ut(t.memory.swapUsed)} / ${ut(t.memory.swapTotal)}`,d].join(`
`),footer:`OS ${t.osRelease}  RANGE ${(i.span*100).toFixed(0)}%`,alert:t.memory.percent>=90?"MEMORY SATURATION EVENT":t.memory.swapPercent>=90?"SWAP CRITICAL EVENT":i.volatility>=.52?"MEMORY SHEAR DETECTED":"",accent:t.memory.percent>=90||t.memory.swapPercent>=90?"alarm":t.memory.percent>=75?"amber":"phosphor",severity:t.memory.percent>=90||t.memory.swapPercent>=90?"alarm":t.memory.percent>=75?"warning":"info"}}function s0(n,e){let t=be(n,24),r=n.system.temperatures;return{body:r.length===0?"NO THERMAL ZONES REPORTED":Wk(r,Math.max(1,n.height),t.hazard,e).join(`
`),footer:r[0]?`HOTTEST ${r[0].label.toUpperCase()} ${r[0].celsius.toFixed(1)}C  FLUX ${(t.volatility*100).toFixed(0)}%`:"THERMAL BUS OFFLINE",alert:r[0]?.celsius>=82?"THERMAL LIMIT ALERT":"",accent:r[0]?.celsius>=82?"alarm":r[0]?.celsius>=70?"amber":"violet",severity:r[0]?.celsius>=82?"alarm":r[0]?.celsius>=70?"warning":"info"}}function l0(n,e){let t=be(n,32),r=n.system.disks;return{body:r.length===0?"NO DISK METRICS AVAILABLE":Vk(r,Math.max(1,n.height),t.hazard,e).join(`
`),footer:r[0]?`FULL ${r[0].mount.toUpperCase()} ${r[0].percent}%  ${ut(r[0].used)} / ${ut(r[0].total)}`:"FILESYSTEM BUS IDLE",alert:r[0]?.percent>=95?"CAPACITY WALL IMMINENT":r[0]?.percent>=85?"DISK PRESSURE WARNING":"",accent:r[0]?.percent>=95?"alarm":(r[0]?.percent>=85,"amber"),severity:r[0]?.percent>=95?"alarm":r[0]?.percent>=85?"warning":"info"}}function d0(n){let e=be(n,24),t="PID     NAME             CPU%   MEM%",r=Dk(n.system.processes,100);return{body:[t,...r].join(`
`),footer:n.system.processes[0]?`HOT ${n.system.processes[0].name.toUpperCase()} ${n.system.processes[0].cpuPercent.toFixed(1)}% CPU  TOP ${Math.min(100,n.system.processes.length)}  RISE ${(Math.max(0,e.slope)*100).toFixed(0)}%`:"PROCESS TABLE EMPTY",alert:n.system.processes[0]?.cpuPercent>=90?"PROCESS SPIKE DETECTED":"",accent:n.system.processes[0]?.cpuPercent>=90?"alarm":"amber",severity:n.system.processes[0]?.cpuPercent>=90?"alarm":"info"}}function c0(n,e){let{system:t,width:r,height:o}=n,i=be(n,Math.max(r,48));if(!t.gpu.available)return Gc("GPU FUSION OFFLINE","violet");let a=Math.max(2,Math.floor((o-5)/2)),s=e.plotHistory(t.gpuUtilizationHistory,Math.max(12,r),a,e.monitorGlyph(i,"violet")),l=e.plotHistory(t.gpuMemoryHistory,Math.max(12,r),a,e.monitorGlyph(i,"phosphor"));return{body:[me(t.gpu.name.toUpperCase(),r),`CHIP ${Rt(t.gpu.utilizationPercent)} ${e.miniMeter(t.gpu.utilizationPercent/100,12,i.hazard)}`,s,`VRAM ${Rt(t.gpu.memoryPercent)} ${ut(t.gpu.memoryUsed)} / ${ut(t.gpu.memoryTotal)}`,l,`TEMP ${Zt(t.gpu.temperatureCelsius,"C")}  POWER ${Zt(t.gpu.powerWatts,"W")}`].join(`
`),footer:`GPU FUSION  GFX ${Zt(t.gpu.graphicsClockMhz,"MHz")}  MEMCLK ${Zt(t.gpu.memoryClockMhz,"MHz")}`,alert:kk(n),accent:Bc(t.gpu.utilizationPercent,t.gpu.memoryPercent,!0),severity:Fc(t.gpu.utilizationPercent,t.gpu.memoryPercent)}}function u0(n,e){let{system:t,width:r,height:o}=n,i=be(n,Math.max(r,40));if(!t.gpu.available)return Gc("GPU CHIP OFFLINE","violet");let a=Math.max(3,o-5),s=e.plotHistory(t.gpuUtilizationHistory,Math.max(12,r),a,e.monitorGlyph(i,"violet")),l=Hk(t.gpu.utilizationPercent/100,Math.min(18,Math.max(8,r-14)),i.hazard);return{body:[`${me(t.gpu.name.toUpperCase(),Math.max(8,r-8))} CORE`,`UTIL ${Rt(t.gpu.utilizationPercent)} ${l}`,s,`TEMP ${Zt(t.gpu.temperatureCelsius,"C")}  POWER ${Zt(t.gpu.powerWatts,"W")}`,`GFX ${Zt(t.gpu.graphicsClockMhz,"MHz")}  MEMORY ${Zt(t.gpu.memoryClockMhz,"MHz")}`].join(`
`),footer:`CHIP BUS  VOLATILITY ${(i.volatility*100).toFixed(0)}%  SURGE ${(Math.max(0,i.slope)*100).toFixed(0)}%`,alert:t.gpu.utilizationPercent>=95?"GPU EXECUTION WALL":i.volatility>=.58?"GPU PULSE SHEAR":"",accent:Bc(t.gpu.utilizationPercent,0,!0),severity:Fc(t.gpu.utilizationPercent,0)}}function h0(n,e){let{system:t,width:r,height:o}=n,i=be(n,Math.max(r,40));if(!t.gpu.available)return Gc("GPU MEMORY OFFLINE","phosphor");let a=Math.max(4,Math.min(12,Math.floor(r/5))),s=new Array(a);for(let d=0;d<a;d++){let c=Math.sin(n.phase*.11+d*.9)*.06;s[d]=ce(t.gpu.memoryPercent/100+c,0,1)}let l=e.barChart(s,a*3,Math.max(3,Math.min(8,o-5)),[" ","\u2591","\u2592","\u2593","\u2588"]);return{body:[`VRAM ${Rt(t.gpu.memoryPercent)} ${e.miniMeter(t.gpu.memoryPercent/100,14,i.hazard)}`,`${ut(t.gpu.memoryUsed)} USED`,`${ut(Math.max(0,t.gpu.memoryTotal-t.gpu.memoryUsed))} FREE`,l,`TOTAL ${ut(t.gpu.memoryTotal)}  MEMCLK ${Zt(t.gpu.memoryClockMhz,"MHz")}`].join(`
`),footer:`VRAM BANKS ${a}  FRAGMENT ${(i.divergence*100).toFixed(0)}%`,alert:t.gpu.memoryPercent>=92?"VRAM CAPACITY WALL":t.gpu.memoryPercent>=78?"VRAM PRESSURE":"",accent:Bc(0,t.gpu.memoryPercent,!0),severity:Fc(0,t.gpu.memoryPercent)}}function Bc(n,e,t){if(!t)return"violet";let r=Math.max(n,e);return r>=92?"alarm":r>=75?"amber":e>n?"phosphor":"violet"}function Fc(n,e){let t=Math.max(n,e);return t>=92?"alarm":t>=75?"warning":"info"}function kk(n){let{gpu:e}=n.system;return e.available?e.memoryPercent>=92?"VRAM LIMIT":e.utilizationPercent>=95?"GPU EXECUTION WALL":(e.temperatureCelsius??0)>=84?"GPU THERMAL LIMIT":"":""}function Sk(n){let e=Math.floor(n/3600),t=Math.floor(n%3600/60),r=Math.floor(e/24);return r>0?`${r}d ${String(e%24).padStart(2,"0")}h`:`${String(e).padStart(2,"0")}h ${String(t).padStart(2,"0")}m`}function Mk(n){let e=Number.isFinite(n)?ce(n,0,100):0,t=gr.length-1;for(let s=0;s<gr.length;s+=1)if(e<=gr[s].percent){t=s;break}let r=gr[Math.max(0,t)]??gr[gr.length-1],o=gr[Math.max(0,t-1)]??r,i=Math.max(1,r.percent-o.percent),a=ce((e-o.percent)/i,0,1);return[Math.round(Hc(o.rgb[0],r.rgb[0],a)),Math.round(Hc(o.rgb[1],r.rgb[1],a)),Math.round(Hc(o.rgb[2],r.rgb[2],a))]}function Tk(n,e,t){return Rk([],n,e,t)}function Rk(n,e,t,r){if(e.length===0)return n.length=0,n;let o=m0(e),i=p0(t,r,e.length,o),a=jc(i,o),s=g0(i),l=b0(t,a);n.length=e.length;for(let d=0;d<e.length;d++){let c=e[d],u=Math.floor(d/l),h=d%l,f=u%2===1?y0(t,a):0,p=n[d]??{core:c,label:c.label,column:f+h*(a+1),row:u*s,width:a,height:s};p.core=c,p.label=c.label,p.column=f+h*(a+1),p.row=u*s,p.width=a,p.height=s,n[d]=p}return n}function t0(n,e){let t=Number(e);return Number.isFinite(t)?n.processor===t:String(n.processor)===e}function f0(n){let{system:e,width:t,height:r}=n,o=be(n,Math.max(t,48)),i=e.cpuCores;if(i.length===0)return{body:"NO CORE DATA",footer:`HOST ${e.hostname.toUpperCase()}  LOAD ${Dc(e.loadavg,"/")}`,alert:"",accent:"signal",severity:"info"};let a=i[0];for(let d=1;d<i.length;d+=1){let c=i[d];c.usage>a.usage&&(a=c)}let s=Ik(i,n.selectedCpuLabel);return{body:[me(`AVG ${Rt(e.cpuOverall)}  CORES ${i.length}  HOT CPU${a.label} ${Rt(a.usage)}`,t),_k(t),...Ck(i,t,r,s?.label),"",...Ak(e,s,t)].join(`
`),footer:"HEX GRID  BLUE 0  GREEN 25  YELLOW 50  ORANGE 75  RED 100",alert:e.cpuOverall>=88?"PULSE LIMIT":o.divergence>=.6?"CORE DESYNC":"",accent:e.cpuOverall>=88?"alarm":e.cpuOverall>=72?"amber":"signal",severity:zc(e.cpuOverall,72,88)}}function Hc(n,e,t){return n+(e-n)*t}function _k(n){let e=[["0",0],["25",25],["50",50],["75",75],["100",100]];if(n>=26){let o="LOAD ";for(let i=0;i<e.length;i+=1){let[a,s]=e[i];i>0&&(o+=" "),o+=lo(s,"\u2B22")+a}return o}if(n>=10){let o="";for(let i=0;i<e.length;i+=1)i>0&&(o+=" "),o+=lo(e[i][1],"\u2B22");return o}let t=Math.max(1,Math.min(n,e.length)),r="";for(let o=0;o<t;o+=1)r+=lo(e[o][1],"\u2B22");return r}function Ck(n,e,t,r){let o=m0(n),i=p0(e,t,n.length,o),a=jc(i,o),s=Tk(n,e,t),l=1;for(let u of s)l=Math.max(l,u.row+u.height);let d=new Array(l),c=new Array(l);for(let u=0;u<l;u++)d[u]=0,c[u]="";for(let u of s){let h=Ek(u.core,i,o,a,u.label===r);for(let f=0;f<h.length;f+=1){let p=u.row+f,m=Math.max(0,u.column-d[p]);c[p]+=" ".repeat(m)+h[f],d[p]=u.column+u.width}}return c}function m0(n){let e=3;for(let t of n)e=Math.max(e,t.label.length);return e}function p0(n,e,t,r){let o=jc("cell",r),i=b0(n,o),a=Math.ceil(t/i)*g0("cell");return n>=32&&e>=5||n>=72&&a<=Math.max(4,e+4)?"cell":n>=18?"labeled":"compact"}function jc(n,e){switch(n){case"cell":return e+5;case"labeled":return e+1;case"compact":return 1}}function g0(n){return n==="cell"?2:1}function b0(n,e){let t=Math.max(1,n-y0(n,e));return Math.max(1,Math.floor((t+1)/(e+1)))}function y0(n,e){return n>=e*3?Math.floor(e/2):0}function Ek(n,e,t,r,o=!1){let i=n.label.padStart(t,"0"),a=Number.isFinite(n.usage)?ce(n.usage,0,100):0,s=`${Math.round(a).toString().padStart(3," ")}%`;if(e==="cell"){let d=Math.max(2,r-2),c=`\u2571${n0(`CPU${i}`,d)}\u2572`,u=`\u2572${n0(s,d)}\u2571`;return[lo(a,c.padEnd(r," "),o,"top"),lo(a,u.padEnd(r," "),o,"bottom")]}let l=e==="labeled"?`\u2B22${i}`:"\u2B22";return[lo(a,l.padEnd(r," "),o,"compact")]}function n0(n,e){if(n.length>=e)return n.slice(0,e);let t=Math.floor((e-n.length)/2);return`${" ".repeat(t)}${n}${" ".repeat(e-n.length-t)}`}function lo(n,e,t=!1,r="compact"){let[o,i,a]=Mk(n);if(t)return`\x1B[1;38;2;5;7;13;48;2;${o};${i};${a}m${e}\x1B[0m`;if(r!=="compact"){let s=r==="top"?.13:.18,l=[Math.max(0,Math.round(o*s)),Math.max(0,Math.round(i*s)),Math.max(0,Math.round(a*s))];return`\x1B[38;2;${o};${i};${a};48;2;${l[0]};${l[1]};${l[2]}m${e}\x1B[0m`}return`\x1B[38;2;${o};${i};${a}m${e}\x1B[0m`}function Ik(n,e){if(!e)return;let t=Number(e);for(let r of n)if(r.label===e||Number.isFinite(t)&&Number(r.label)===t)return r}function Ak(n,e,t){if(!e)return[me("SELECT A HEX TILE FOR CPU ID + PROCESS SAMPLE",t)];let r=Ok(n.cpuCores),o=me(`SELECTED CPU ID ${e.label}${r?` (${r})`:""}  LOAD ${Rt(e.usage)}`,t),i=!1;for(let c of n.processes)if(Number.isFinite(c.processor)){i=!0;break}if(!i)return[o,me("PROCESSOR FIELD UNAVAILABLE IN THIS SAMPLE",t)];let a=t>=48?6:4,s=0;for(let c of n.processes)t0(c,e.label)&&(s+=1);if(s===0)return[o,me("NO TOP PROCESS LAST SEEN ON THIS CPU",t)];let l=new Array(Math.min(a,s)+3);l[0]=o,l[1]=me("TOP PROCESSES LAST SEEN ON CPU",t),l[2]=me(t>=48?"PID      CPU%   MEM%  S  NAME":"PID     CPU%  MEM% NAME",t);let d=3;for(let c of n.processes)if(t0(c,e.label)&&(l[d]=Lk(c,t),d+=1,d>=l.length))break;return l}function Ok(n){if(n.length===0)return"";let e=1/0,t=-1/0;for(let r of n){let o=Number(r.label);if(!Number.isFinite(o))return"";e=Math.min(e,o),t=Math.max(t,o)}return`${e}-${t}`}function Lk(n,e){let t=e>=48?Math.max(8,e-27):Math.max(6,e-21),r=me(n.name,t).padEnd(t," ");return e>=48?me(`${String(n.pid).padEnd(8," ")}${n.cpuPercent.toFixed(1).padStart(6," ")} ${n.memoryPercent.toFixed(1).padStart(6," ")}  ${me(n.state,1).padEnd(1," ")}  ${r}`,e):me(`${String(n.pid).padEnd(7," ")}${n.cpuPercent.toFixed(0).padStart(4," ")}% ${n.memoryPercent.toFixed(0).padStart(4," ")}% ${r}`,e)}function Pk(n){if(n.length===0)return"";let e=Nk(n,4),t=e.length,r=new Array(t);for(let o=0;o<t;o+=1){let i=e[o];r[o]=`CPU${i.label.padStart(2,"0")} ${i.usage.toFixed(0).padStart(3," ")}%`}return r.join("  ")}function Nk(n,e){let t=Math.min(Math.max(0,Math.floor(e)),n.length),r=new Array(t);for(let o=0;o<n.length;o+=1){let i=n[o],a=-1;for(let s=0;s<t;s+=1){let l=r[s];if(!l||i.usage>l.usage){a=s;break}}if(!(a<0)){for(let s=t-1;s>a;s-=1)r[s]=r[s-1];r[a]=i}}return r}function Wk(n,e,t,r){let o=Math.min(e,n.length),i=new Array(o);for(let a=0;a<o;a+=1){let s=n[a];i[a]=`${s.label.toUpperCase().padEnd(18," ")} ${s.celsius.toFixed(1).padStart(6," ")}C ${$k(s.celsius/100,t,r)}`}return i}function Vk(n,e,t,r){let o=Math.min(e,n.length),i=new Array(o);for(let a=0;a<o;a+=1){let s=n[a];i[a]=`${me(s.mount.toUpperCase(),12).padEnd(12," ")} ${String(s.percent).padStart(3," ")}% ${r.miniMeter(s.percent/100,7,t)} ${ut(s.available).padStart(8," ")} FREE`}return i}function Dk(n,e){let t=Math.min(e,n.length),r=new Array(t);for(let o=0;o<t;o+=1){let i=n[o];r[o]=`${String(i.pid).padEnd(7," ")}${me(i.name,16).padEnd(16," ")}${i.cpuPercent.toFixed(1).padStart(6," ")}${i.memoryPercent.toFixed(1).padStart(7," ")}`}return r}function zk(n,e,t,r){if(n.length===0)return["NO CORE DATA"];let o=r0(n[0],t,r),i=Math.max(12,o.length),a=Math.max(1,Math.min(8,Math.floor((Math.max(12,e)+2)/(i+2)))),s=Math.ceil(n.length/a),l=new Array(s);for(let d=0;d<s;d++){let c="";for(let u=0;u<a;u++){let h=n[d+u*s];h&&(c.length>0&&(c+="  "),c+=r0(h,t,r).padEnd(i," "))}l[d]=me(c,Math.max(12,e))}return l}function r0(n,e,t){return`${n.label.padStart(3,"0")} ${t.miniMeter(n.usage/100,6,e)} ${Rt(n.usage).padStart(5)}`}function $k(n,e,t){let r=e>=.9?5:4;return t.miniMeter(n,r,e)}function Hk(n,e,t){let r=Math.round(ce(n,0,1)*e);return(t>=.85?"\u25C6":"\u25C7").repeat(r).padEnd(e,"\xB7")}function Gc(n,e){return{body:[n,"NVIDIA-SMI TELEMETRY NOT AVAILABLE","GPU PANEL WILL AUTO-LINK WHEN DRIVER METRICS APPEAR"].join(`
`),footer:"GPU BUS OFFLINE",alert:"",accent:e,severity:"info"}}var Qt=[{id:"warning-stack",title:"Warning Stack",code:"ALERT-000",badge:"WARN",subtitle:"Typography as interrupt",accent:"alarm",section:"overview"},{id:"counter-board",title:"Counter And Clock Boards",code:"TIME-SEG",badge:"TIME",subtitle:"Stepped numeric boards",accent:"signal",section:"overview"},{id:"profile-card",title:"Pilot State Card",code:"TEST-PLUG-02",badge:"PILOT",subtitle:"Identity and diagnostics overlay",accent:"violet",section:"overview"},{id:"live-feed",title:"Live Feed / Corruption",code:"LIVE-07",badge:"LIVE",subtitle:"Low-fidelity surveillance panel",accent:"alarm",section:"overview"},{id:"event-log",title:"Event Log",code:"LOG-223.229",badge:"LOG",subtitle:"Dense edge-annotated telemetry",accent:"amber",section:"overview"},{id:"channel-matrix",title:"Channel Matrix",code:"MATRIX-C",badge:"MATRIX",subtitle:"Stepped test-plug and reserve columns",accent:"phosphor",section:"overview"},{id:"telemetry-rack",title:"Telemetry Rack",code:"LIFE-SUPPORT",badge:"RACK",subtitle:"Asynchronous meter walls",accent:"alarm",section:"signals"},{id:"biosignal-strip",title:"Biosignal Strip",code:"WAVE-85",badge:"BIO",subtitle:"Drifting traces and threshold events",accent:"phosphor",section:"signals"},{id:"harmonic-graph",title:"Harmonic Graph",code:"SIM-GRAPH A+",badge:"HARM",subtitle:"Interference curves and psychograph bleed",accent:"violet",section:"signals"},{id:"psychograph",title:"Psychograph Display",code:"PHASE-4",badge:"PSY",subtitle:"Behavioral scribble display",accent:"amber",section:"signals"},{id:"field-ring",title:"Field Ring Capture",code:"CAPTURE-01",badge:"FIELD",subtitle:"Locking reticle and field concentration",accent:"signal",section:"signals"},{id:"hex-heatmap",title:"Hex Heatmap",code:"AREA-DENSITY",badge:"HEX",subtitle:"Concentrated field occupation",accent:"amber",section:"signals"},{id:"magi-board",title:"MAGI Decision Board",code:"CODE-239",badge:"MAGI",subtitle:"Discrete voting reconfiguration",accent:"amber",section:"control"},{id:"route-board",title:"Route / Gate Board",code:"ENTRY-PLUG",badge:"ROUTE",subtitle:"Mechanical routing and disconnect states",accent:"alarm",section:"control"},{id:"gate-status",title:"Infrastructure Gates",code:"CL3-SEG",badge:"GATES",subtitle:"Open, locked, and refused mechanical states",accent:"signal",section:"control"},{id:"tactical-map",title:"Tactical Map",code:"TOKYO-3 / LIVE",badge:"MAP",subtitle:"Topographic scan sweep and target boxes",accent:"phosphor",section:"control"},{id:"network-topology",title:"Network Topology",code:"NERV-TOPOLOGY",badge:"NET",subtitle:"Localized breaks and mesh redraw",accent:"amber",section:"control"},{id:"component-index",title:"Component Index",code:"SUITE-ALL",badge:"INDEX",subtitle:"All selectable demo surfaces",accent:"amber",section:"control"},{id:"three-lattice",title:"Wireframe Lattice Chamber",code:"THREE-5",badge:"LATTICE",subtitle:"Nested cubic rails with slow axial drift and pilot-cage geometry.",accent:"signal",section:"three"},{id:"three-atfield",title:"A.T.Field Ring Volume",code:"THREE-6",badge:"A.T",subtitle:"Rotating torus stack wrapped around a violet harmonic spine.",accent:"amber",section:"three"},{id:"three-hexshell",title:"Hex Cell Shell",code:"THREE-7",badge:"HEXCELL",subtitle:"Geodesic shell study for defensive barrier and armor-cell readouts.",accent:"phosphor",section:"three"},{id:"three-capture",title:"Capture Cage",code:"THREE-8",badge:"CAGE",subtitle:"Twin containment cages with a live central helix for lock-state sweeps.",accent:"alarm",section:"three"},{id:"three-mapslab",title:"Volumetric Map Slab",code:"THREE-9",badge:"SLAB",subtitle:"Topographic wire slab for city-grid terrain and underground route plots.",accent:"phosphor",section:"three"},{id:"three-solenoid",title:"Solenoid Field Volume",code:"THREE-0",badge:"COIL",subtitle:"Crossed coils for field compression, inductive resonance, and surge scans.",accent:"violet",section:"three"},{id:"three-ascii-studio",title:"Acerola ASCII Studio",code:"ASCII-GPU",badge:"ACEROLA",subtitle:"The torus, sphere, block, and stage scene from the Three ASCII demo.",accent:"signal",section:"three"}],ui=Qt;function Bk(n){let e=Math.max(0,432-Math.floor(n)%380),t=String(Math.floor(e/60)).padStart(2,"0"),r=String(e%60).padStart(2,"0"),o=String(Math.floor(n)*3%100).padStart(2,"0");return`${t}:${r}:${o}`}function Jc(n,e,t){let r=Math.min(n.length,Math.max(1,t)),o=new Array(Math.max(r,t));for(let a=0;a<r;a+=1)o[a]=me(n[a],e).padEnd(e," ");let i=" ".repeat(e);for(let a=r;a<t;a+=1)o[a]=i;return o.join(`
`)}function Xc(n,e,t,r){let o=_t(n,e," "),i=Math.max(3,7-Math.round(t.divergence*4));for(let u=0;u<e;u+=1)for(let h=0;h<n;h+=1)(h+u+Math.floor(t.phase*.25))%i===0&&Be(o,h,u,"\xB7");let a=Math.floor(n/2),s=Math.floor(e/2),l=Math.max(3,Math.floor(n*(.16+t.current*.24+t.divergence*.08))),d=Math.max(2,Math.floor(e*(.18+t.density*.26))),c=Math.max(2,Math.min(4,t.activeCount+1));for(let u=0;u<c;u+=1){let h=t.sources[u%t.sources.length],f=a,p=s;for(let m=0;m<Math.max(n*2,48);m+=1){let g=m/Math.max(n*2-1,1)*Math.PI*2,y=t.phase*.04+u*.9+h.normalizedValue*1.6,b=Math.round(a+Math.sin(g*(2+t.cadence*2+u*.25)+y)*l*(.72+u*.08)),w=Math.round(s+Math.sin(g*(3+t.divergence*2.5)-y)*d+Math.cos(g*(1.5+h.volatility*3)+y)*d*.34);qe(o,f,p,b,w,r),f=b,p=w}}return Ct(o)}function Fk(n,e,t,r){let o=_t(n,e," "),i=t.current*.9+t.volatility*.8,a=0,s=Math.floor(e/2);for(let l=0;l<n;l+=1){let d=t.pulseSeries[l%t.pulseSeries.length]??t.current,c=Math.round(e/2+Math.sin(l*(.26+t.cadence*.24)+t.phase*.13)*(e*.18+i*2.4)+Math.cos(l*(.09+t.divergence*.18)-t.phase*.07)*(e*.1+d*2.2)+Math.sin(l*.51+t.phase*.17)*t.volatility*2.6);qe(o,a,s,l,c,r),(l+t.phase)%Math.max(5,11-Math.round(t.volatility*8))===0&&Be(o,l,pr(c+Math.round(d*2-1),0,e-1),"\u2022"),a=l,s=c}return Ct(o)}function jk(n,e,t){let r=_t(n,e," "),o=Math.floor(n/2),i=Math.floor(e/2),a=Math.max(4,Math.floor(n*(.2+t.current*.12+t.divergence*.08))),s=Math.max(2,Math.floor(e*(.26+t.density*.12))),l=Math.max(2,Math.min(4,2+Math.round(t.hazard*2)));for(let d=0;d<l;d+=1){let c=d*2;Qp(r,o,i,Math.max(2,a-c),Math.max(1,s-Math.floor(c/2)),d===l-1?"\u25CE":"\u25CC")}return qe(r,o,Math.max(0,i-s-2),o,Math.min(e-1,i+s+2),"\u2502"),qe(r,Math.max(0,o-a-4),i,Math.min(n-1,o+a+4),i,"\u2500"),qe(r,Math.max(0,o-a),Math.max(0,i-s),Math.min(n-1,o+a),Math.min(e-1,i+s),"\u2571"),qe(r,Math.max(0,o-a),Math.min(e-1,i+s),Math.min(n-1,o+a),Math.max(0,i-s),"\u2572"),Be(r,o,i,t.hazard>=.88?"\u2588":"\u25C6"),Ct(r)}function v0(n,e,t,r){let o=_t(n,e," ");for(let i=0;i<e;i+=1)for(let a=0;a<n;a+=1){let s=t.normalizedSeries[(a+i)%t.normalizedSeries.length]??t.current,l=t.pulseSeries[(a*2+i)%t.pulseSeries.length]??t.current,d=t.spreadSeries[(a+i*2)%t.spreadSeries.length]??t.divergence,c=ce(s*.42+l*.24+d*.16+(Math.sin((a+t.phase)*(.13+t.cadence*.08))+Math.cos((i-t.phase)*(.21+t.volatility*.12))+2)/4*.18,0,1),u=Math.min(r.length-1,Math.floor(c*r.length));Be(o,a,i,r[u]??r[r.length-1]??"#")}return Ct(o)}function x0(n,e,t,r){let o=_t(n,e," "),i=Math.max(2,Math.min(4,t.sources.length+1));for(let a=0;a<e;a+=1){let s=t.sources[a%t.sources.length]??t.primary,l=t.spreadSeries[a%t.spreadSeries.length]??t.divergence,d=Math.floor(ce(s.normalizedSeries[a%s.normalizedSeries.length]*.72+l*.28,0,1)*(n-1)),c=Math.floor(Xa(t.scan+a/Math.max(e,1)+s.slope*.25)*(n-1));for(let u=0;u<n;u+=1){let h=(a+u+i)%Math.max(3,i+1)===0,f=u<=d,p=u===c?"\u2588":f?r[r.length-1]??"#":h?r[2]??"\u2582":r[1]??".";Be(o,u,a,p)}}return Ct(o)}function Gk(n,e,t){let r=_t(n,e," "),o=2+t.divergence*5;for(let s=0;s<e;s+=1)for(let l=0;l<n;l+=1)(l+Math.floor(Math.sin(s*(.42+t.cadence*.22)+t.phase*.08)*o))%7===0&&Be(r,l,s,"~");let i=Math.floor(Xa(t.scan+t.cadence*.2)*Math.max(1,n-1));for(let s=0;s<e;s+=1){let l=pr(i-Math.floor(s/2),0,n-1);Be(r,l,s,"/"),Be(r,Math.min(n-1,l+1),s,"/")}let a=Math.max(1,Math.min(3,t.activeCount+1));for(let s=0;s<a;s+=1){let l=pr(Math.floor(n*(.18+s*.23+t.divergence*.08)),1,n-4),d=pr(Math.floor(e*(.18+s*.16)),1,e-3),c=pr(l+Math.max(3,Math.floor(n*.12)),l+2,n-2),u=pr(d+Math.max(2,Math.floor(e*.18)),d+1,e-2);qe(r,l,d,c,d,"\u2504"),qe(r,l,u,c,u,"\u2504"),qe(r,l,d,l,u,"\u2506"),qe(r,c,d,c,u,"\u2506")}return Ct(r)}function Uk(n,e,t){let r=_t(n,e," "),o=Math.floor(t.divergence*4+t.volatility*3),i=[[2,2],[Math.floor(n*.24),5],[Math.floor(n*.46),2],[Math.floor(n*.7),6],[n-4,3],[6,e-4],[Math.floor(n*.34),e-5],[Math.floor(n*.6),e-3],[n-8,e-4]];return[[0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,6],[2,7],[3,7],[4,8],[5,6],[6,7],[7,8]].forEach(([s,l],d)=>{let u=(t.pulseSeries[(d*3+o)%t.pulseSeries.length]??t.current)>=.68||(t.phase+d+o)%7===0;qe(r,i[s][0],i[s][1],i[l][0],i[l][1],u?"\u2573":"\u2500")}),i.forEach(([s,l],d)=>{let c=t.normalizedSeries[(d*2+o)%t.normalizedSeries.length]??t.current;Be(r,s,l,c>=.72?"\u2588":(t.phase+d+o)%9===0?"\u25C6":"\u25CF")}),Ct(r)}function Kk(n,e,t){let r=_t(n,e," ");for(let l=0;l<e;l+=1)for(let d=0;d<n;d+=1){let c=t.pulseSeries[(d+l)%t.pulseSeries.length]??t.current,u=Math.sin((d+t.phase)*(.28+t.cadence*.2)+c)+Math.cos((l-t.phase)*(.6+t.volatility*.3)-t.current);Be(r,d,l,u>1.05?"\u2588":u>.55?"\u2593":u>.08?"\u2592":u>-.3?"\u2591":" ")}let o=Math.floor(n*(.22+t.divergence*.08)),i=Math.floor(e*(.16+t.volatility*.08)),a=Math.min(n-2,o+Math.max(4,Math.floor(n*(.28+t.current*.12)))),s=Math.min(e-2,i+Math.max(3,Math.floor(e*(.42+t.density*.1))));return qe(r,o,i,a,i,"\u2500"),qe(r,o,s,a,s,"\u2500"),qe(r,o,i,o,s,"\u2502"),qe(r,a,i,a,s,"\u2502"),Ct(r)}function qk(n,e,t){let r=_t(n,e," "),o=Math.max(1,t.sources.length),i=Math.max(3,Math.floor(n/o));return t.sources.forEach((a,s)=>{let l=s*i,d=Math.min(n-1,l+i-1),c=so(a.normalizedSeries,Math.max(1,d-l));for(let u=l;u<d;u+=1){let h=c[u-l]??a.normalizedValue,f=Math.max(1,Math.round(h*Math.max(1,e-1)));for(let p=e-1;p>=0;p-=1)e-p<=f?Be(r,u,p,t.hazard>=.9?"\u2588":h>=.66?"\u2593":"\u2592"):(p+u+t.phase)%Math.max(3,8-Math.round(t.volatility*5))===0&&Be(r,u,p,"\xB7")}if(d<n)for(let u=0;u<e;u+=1)Be(r,d,u,"\u2502")}),Ct(r)}function Yk(n,e,t,r){let o=[],i=Math.max(4,Math.min(12,n-18)),a=Math.min(t.sources.length,Math.max(1,Math.min(3,e-2)));for(let d=0;d<a;d+=1){let c=t.sources[d];o.push(`${me(c.source.name.toUpperCase(),8).padEnd(8," ")} ${Ja(c.normalizedValue,i,t.hazard)} ${Math.round(c.normalizedValue*100).toString().padStart(3," ")}`)}let s=Math.max(1,e-o.length),l=Vc(t.pulseSeries,n,s,r);return Jc([...o,...l.split(`
`)],n,e)}function Xk(n,e,t){let r=e>=6?[`PULSE ${(t.current*100).toFixed(0)}%  NOISE ${(t.volatility*100).toFixed(0)}%  \u0394${(t.divergence*100).toFixed(0)}%`]:[],o=Math.max(2,e-r.length);return Jc([...r,...Qa(t.pulseSeries,n,o,Hn(t,"phosphor")).split(`
`)],n,e)}function Jk(n,e,t,r){let o=`INDEX ${(t.current*100).toFixed(0)}%  \u0394${(t.divergence*100).toFixed(0)}  SRC ${t.activeCount}/${t.sources.length}`,i=new Array(r.length);for(let a=0;a<r.length;a+=1){let s=r[a],l=t.pulseSeries[a%t.pulseSeries.length]??t.current,d=l>=.82?"\u2588":l>=.6?"\u2593":l>=.36?"\u2592":"\u2591";i[a]=`${d} ${s.toUpperCase()}`}return Jc([o,...qp(i,n).split(`
`)],n,e)}var Zc=[{id:"cpu-monitor",name:"CPU Monitor",accent:"signal",description:"Bottom-style CPU overview and history plot.",family:"monitor"},{id:"cpu-legend",name:"CPU Legend",accent:"signal",description:"Per-core legend wall.",family:"monitor"},{id:"cpu-hex-grid",name:"CPU Hex Grid",accent:"signal",description:"Per-core hex tile activity map with truecolor load shading.",family:"monitor"},{id:"gpu-combined-monitor",name:"GPU Fusion",accent:"violet",description:"Combined GPU chip and VRAM pressure view.",family:"monitor"},{id:"gpu-chip-monitor",name:"GPU Chip",accent:"violet",description:"GPU utilization, thermals, power, and clocks.",family:"monitor"},{id:"gpu-memory-monitor",name:"GPU Memory",accent:"phosphor",description:"Dedicated GPU memory bank pressure.",family:"monitor"},{id:"memory-monitor",name:"Memory Monitor",accent:"phosphor",description:"Memory, swap, and load pressure.",family:"monitor"},{id:"temperature-monitor",name:"Temperature Monitor",accent:"violet",description:"Thermal zone readout.",family:"monitor"},{id:"disk-monitor",name:"Disk Monitor",accent:"amber",description:"Filesystem capacity board.",family:"monitor"},{id:"network-monitor",name:"Network Monitor",accent:"signal",description:"Ingress, egress, and interface status.",family:"monitor"},{id:"process-monitor",name:"Process Monitor",accent:"amber",description:"Top process activity table.",family:"monitor"}];var k0=["three-lattice","three-atfield","three-hexshell","three-capture","three-mapslab","three-solenoid","three-ascii-studio"],S0=["warning-stack","counter-board","profile-card","live-feed","event-log","channel-matrix","telemetry-rack","biosignal-strip","harmonic-graph","psychograph","field-ring","hex-heatmap","magi-board","route-board","gate-status","tactical-map","network-topology","component-index"],Zk=new Set(S0),Qk=new Set(k0),M0=new Map(ui.filter(n=>Zk.has(n.id)||Qk.has(n.id)).map(n=>[n.id,n])),e5=k0.map(n=>{let e=M0.get(n);return{id:n,name:e?.title??n,accent:e?.accent??"signal",description:e?.subtitle??"Neon Exodus 3D visualization.",family:"neon3d"}}),t5=S0.map(n=>{let e=M0.get(n);return{id:n,name:e?.title??n,accent:e?.accent??"signal",description:e?.subtitle??"Neon Exodus visualization.",family:"neon"}}),T0=[...Zc,...e5,...t5],n5=new Map(T0.map(n=>[n.id,n])),tC=Zc.map(n=>({...n})),nC=new Set(Zc.map(n=>n.id)),r5=T0.map(n=>({...n})),o5=new Map(n5),i5=new Set(ui.map(n=>n.id)),R0=new Array(ui.length);for(let n=0;n<ui.length;n+=1)R0[n]=ui[n].title;var a5=new Set(["warning-stack","event-log","component-index"]),s5={"counter-board":"counter","profile-card":"plug","live-feed":"surveillance","channel-matrix":"relay","telemetry-rack":"rack","biosignal-strip":"biosignal","harmonic-graph":"harmonic",psychograph:"psychograph","field-ring":"field","hex-heatmap":"heat","magi-board":"magi","route-board":"route","gate-status":"gate","tactical-map":"command","network-topology":"topology"},l5={"three-lattice":"lattice","three-atfield":"atfield","three-hexshell":"hexshell","three-capture":"capture","three-mapslab":"mapslab","three-solenoid":"solenoid","three-ascii-studio":"studio"},hi=[" ","\u2581","\u2582","\u2583","\u2584","\u2585","\u2586","\u2587","\u2588"];function _0(n){return e0(n)}function w0(n,e,t){let r=`${_0(e)} PRIMITIVES`;return n?`${me(n,Math.max(0,t-r.length-3))} / ${r}`:r}function d5(n,e,t){let r=Math.max(12,n.width),o=[me(`${_0(t)} DRIVE ${Math.round(e.hazard*100)}%  \u0394${Math.round(e.divergence*100)}`,r)];n.height>=6&&o.push(me($c(n.sources),r));let i=Math.max(2,n.height-o.length),a=(()=>{switch(t){case"lattice":case"solenoid":return Qa(e.pulseSeries,r,i,e.hazard>=.78?"\u2588":"\u2587");case"atfield":case"capture":return Xc(r,i,e,Hn(e,"violet"));case"hexshell":return v0(r,i,e,hi);case"mapslab":return x0(r,i,e,hi);case"studio":return Xc(r,i,e,"\u25C6")}})();return[...o,a].join(`
`)}function C0(n,e,t){let r=c5(t),o=Math.sin((e.phase+r.phase)*r.speed),i=ce(e.imbalance*1.2+o*r.offset*(.6+e.divergence*.8),-1,1),a=ce(e.slope*1.7+e.jerk*.55+r.lift*(e.current-.5)+Math.cos(e.phase*.09)*.12,-1,1),s=ce(.12+e.current*.3+e.volatility*.2+e.hazard*.38,.12,1),l=ce(.14+e.absolute*.24+e.divergence*.16+e.hazard*.34,.12,.98);return{x:ce(.5+i*.22+Math.sin((e.phase+r.phase)*.04)*e.cadence*.08,0,1),y:ce(.5-a*.22+Math.cos((e.phase+r.phase)*.05)*e.volatility*.07,0,1),depth:l,twist:i,lift:a,pulse:s,active:s>.18||e.activeCount>0,pressed:n.system.alerts.some(d=>d.severity==="alarm")||e.hazard>=.9}}function c5(n){switch(n){case"lattice":return{phase:0,speed:.12,offset:.18,lift:.32};case"atfield":return{phase:5,speed:.1,offset:.24,lift:.24};case"hexshell":return{phase:9,speed:.08,offset:.2,lift:.5};case"capture":return{phase:13,speed:.11,offset:.26,lift:.18};case"mapslab":return{phase:17,speed:.07,offset:.14,lift:.58};case"solenoid":return{phase:21,speed:.14,offset:.22,lift:.28};case"studio":return{phase:25,speed:.09,offset:.3,lift:.2};case"emergency":return{phase:29,speed:.16,offset:.32,lift:.16};case"counter":return{phase:31,speed:.13,offset:.18,lift:.12};case"plug":return{phase:32,speed:.08,offset:.16,lift:.3};case"surveillance":return{phase:34,speed:.09,offset:.24,lift:.18};case"relay":return{phase:35,speed:.15,offset:.26,lift:.2};case"rack":return{phase:36,speed:.14,offset:.2,lift:.16};case"scope":return{phase:38,speed:.18,offset:.34,lift:.34};case"biosignal":return{phase:38,speed:.2,offset:.32,lift:.3};case"harmonic":return{phase:39,speed:.09,offset:.22,lift:.24};case"psychograph":return{phase:40,speed:.17,offset:.36,lift:.32};case"field":return{phase:41,speed:.13,offset:.28,lift:.24};case"heat":return{phase:39,speed:.1,offset:.22,lift:.42};case"route":return{phase:40,speed:.1,offset:.2,lift:.48};case"topology":return{phase:42,speed:.09,offset:.22,lift:.24};case"command":return{phase:44,speed:.07,offset:.16,lift:.18};case"launch":return{phase:33,speed:.1,offset:.2,lift:.5};case"magi":return{phase:37,speed:.06,offset:.14,lift:.18};case"target":return{phase:41,speed:.13,offset:.28,lift:.22};case"waveform":return{phase:45,speed:.18,offset:.34,lift:.34};case"angel":return{phase:49,speed:.08,offset:.22,lift:.48};case"gate":return{phase:53,speed:.12,offset:.18,lift:.42}}}var u5={"cpu-monitor":n=>o0(n,ci),"cpu-legend":n=>i0(n,ci),"cpu-hex-grid":f0,"gpu-combined-monitor":n=>c0(n,Uc),"gpu-chip-monitor":n=>u0(n,Uc),"gpu-memory-monitor":n=>h0(n,Uc),"memory-monitor":n=>a0(n,ci),"temperature-monitor":n=>s0(n,ci),"disk-monitor":n=>l0(n,ci),"network-monitor":n=>f5(n,{plotHistory:Za,monitorGlyph:Hn}),"process-monitor":d0,"warning-stack":S5,"counter-board":T5,"profile-card":R5,"live-feed":_5,"event-log":C5,"channel-matrix":I5,"telemetry-rack":I0,"biosignal-strip":A5,"harmonic-graph":O5,psychograph:L5,"field-ring":P5,"hex-heatmap":N5,"magi-board":W5,"route-board":V5,"gate-status":D5,"tactical-map":z5,"network-topology":$5,"component-index":H5},h5=Object.fromEntries([...Object.entries(l5).map(([n,e])=>[n,(t,r)=>k5(t,e,r.accent)]),...Object.entries(u5).map(([n,e])=>[n,t=>e(t)])]),Uc={plotHistory:Za,barChart:Vc,miniMeter:Ja,monitorGlyph:Hn},ci={plotHistory:Za,miniMeter:Ja,monitorGlyph:Hn};function E0(n){let e=o5.get(n.slot.visualizationId)??r5[0],r=(h5[n.slot.visualizationId]??(a=>I0(a)))(n,e),o=x5(n,r),i=o.footer||Le(n.sources);return{title:e.name.toUpperCase(),accent:o.accent??e.accent,severity:o.severity??"info",alert:o.alert??"",body:o.body,footer:i,three:o.three}}function f5(n,e){let{system:t}=n,r=Math.max(1,n.width),o=Math.max(1,n.height),i=be(n,Math.max(r,24)),a=v5(n),s=es(t.networks),l=!!(s&&s.rxRate+s.txRate>125e6);return{body:m5(t,i,r,o,e).join(`
`),footer:y5(t,i,r),alert:a,accent:l?"amber":"signal",severity:l?"warning":"info"}}function m5(n,e,t,r,o){let i=Math.max(1,r),a=Math.max(1,t);if(i<=3||t<20){let h=[p5(n,t),g5(n,a)];return Kc(h,n,t,i-2),qc(h,t,i)}if(i<=6){let h=Math.min(n.networks.length,Math.max(0,i-3)),f=Math.max(1,i-1-h),p=[t>=32?"RX/TX BUS":"RX/TX"];return Yc(p,o.plotHistory(w5(n),a,f,o.monitorGlyph(e,"signal"))),Kc(p,n,t,h),qc(p,t,i)}let s=Math.min(n.networks.length,t>=36?2:1,Math.max(0,i-6)),l=Math.max(2,i-2-s),d=Math.max(1,Math.floor(l/2)),c=Math.max(1,l-d),u=[t>=28?"RX BUS":"RX"];return Yc(u,o.plotHistory(n.rxHistory,a,d,o.monitorGlyph(e,"signal"))),u.push(t>=28?"TX BUS":"TX"),Yc(u,o.plotHistory(n.txHistory,a,c,o.monitorGlyph(e,"amber"))),Kc(u,n,t,s),qc(u,t,i)}function p5(n,e){let t=es(n.networks);if(!t)return"NET IDLE";let r=me(t.name.toUpperCase(),e<24?5:10);return e<28?`NET ${r} ${co(t.rxRate)}\u2193 ${co(t.txRate)}\u2191`:`NET ${r} RX ${Wt(t.rxRate)}  TX ${Wt(t.txRate)}`}function g5(n,e){let t="";for(let r=0;r<e;r++){let o=Ya(n.rxHistory,r,e),i=Ya(n.txHistory,r,e);Math.max(o,i)>=.82?t+="\u2588":o>=.5&&i>=.5?t+="\u2593":o>=i&&o>=.22?t+="\u2584":i>o&&i>=.22?t+="\u2580":t+="\xB7"}return t}function Kc(n,e,t,r){if(r<=0)return;if(e.networks.length===0){n.push("NO ACTIVE INTERFACES");return}let o=Math.min(r,e.networks.length);for(let i=0;i<o;i++)n.push(b5(e.networks[i],t))}function b5(n,e){let t=me(n.name.toUpperCase(),e<28?6:10);if(e<30)return`${t} R${co(n.rxRate)} T${co(n.txRate)}`;if(e<48)return`${t.padEnd(10," ")} R ${Wt(n.rxRate)}  T ${Wt(n.txRate)}`;let r=n.addresses[0]?` ${n.addresses[0]}`:"";return`${t.padEnd(10," ")}${r}  RX ${Wt(n.rxRate)}  TX ${Wt(n.txRate)}`}function y5(n,e,t){let r=es(n.networks);if(!r)return"NO ACTIVE INTERFACES";let o=me(r.name.toUpperCase(),t<30?6:10);if(t<34)return me(`${o} ${co(r.rxRate)}\u2193 ${co(r.txRate)}\u2191`,t);let i=r.addresses[0]??"NO ADDRESS";return me(`${o} ${i}  RX ${Wt(r.rxRate)}  TX ${Wt(r.txRate)}  BURST ${(e.volatility*100).toFixed(0)}%`,t)}function w5(n){let e=Math.max(n.rxHistory.length,n.txHistory.length,1),t=new Array(e);for(let r=0;r<e;r++)t[r]=Math.max(n.rxHistory[r]??0,n.txHistory[r]??0);return t}function co(n){return Wt(n).replace(/\s+/g,"").replace("KiB/s","K/s").replace("MiB/s","M/s").replace("GiB/s","G/s").replace("TiB/s","T/s")}function qc(n,e,t){let r=Math.min(n.length,Math.max(1,t)),o=new Array(r);for(let i=0;i<r;i++)o[i]=me(n[i].trimEnd(),e);return o}function Yc(n,e){let t=0;for(;t<=e.length;){let r=e.indexOf(`
`,t);if(r===-1){n.push(e.slice(t));return}n.push(e.slice(t,r)),t=r+1}}function v5(n){let e=es(n.system.networks);if(!e)return"";let t=e.rxRate+e.txRate;return t>125e6?`${e.name.toUpperCase()} SURGE ABOVE ${Wt(t)}`:""}function es(n){return n.reduce((e,t)=>e?t.rxRate+t.txRate>e.rxRate+e.txRate?t:e:t,void 0)}function x5(n,e){let t=n.slot.visualizationId;if(!i5.has(t)||a5.has(t))return e;if(e.three)return{...e,footer:w0(e.footer,e.three.mode,n.width)};let r=s5[t];if(!r)return e;let o=be(n,Math.max(32,n.width));return{...e,footer:w0(e.footer,r,n.width),three:{mode:r,signal:C0(n,o,r)}}}function k5(n,e,t){let r=be(n,Math.max(32,n.width)),o=r.hazard>=.88?"alarm":r.hazard>=.7?"warning":"info",i=Jp(n.sources)||at(r);return{body:d5(n,r,e),footer:Xp(n.sources),alert:i,accent:o==="alarm"?"alarm":o==="warning"?"amber":t,severity:o,three:{mode:e,signal:C0(n,r,e)}}}function S5(n){let e=be(n,24);return{body:M5(n,e,Math.max(1,n.height)).join(`
`),footer:Le(n.sources),alert:et(n)||at(e),accent:e.hazard>=.88?"alarm":"amber",severity:e.hazard>=.88?"alarm":"warning"}}function M5(n,e,t){let r=[];for(let i=0;i<n.system.alerts.length&&r.length<t;i+=1){let a=n.system.alerts[i];r.push(`${a.title}  ${a.detail}`)}if(r.length>0)return r;for(let i=0;i<n.system.diagnostics.length&&r.length<t;i+=1){let a=n.system.diagnostics[i];a.status!=="ok"&&r.push(`${a.source.toUpperCase()}  ${a.status.toUpperCase()}  ${a.detail}`)}if(r.length>0)return r;let o=Zp(n.sources,e);for(let i=0;i<o.length&&r.length<t;i+=1)r.push(o[i]);return r}function T5(n){let e=new Date,t=n.sources[0]??qa(n.phase),r=be(n,24);return{body:[`CLOCK      ${e.toLocaleTimeString("en-US",{hour12:!1})}`,`COUNTDOWN  ${Bk(r.phase)}`,`SEQUENCE   ${String(r.phase).padStart(6,"0")}`,`PRIMARY    ${t.name.toUpperCase()}`,`AMPLITUDE  ${(r.current*100).toFixed(1).padStart(5," ")}%`,`VELOCITY   ${(Math.abs(r.slope)*100).toFixed(1).padStart(5," ")}%`,`VECTOR     ${$c(n.sources)}`].join(`
`),footer:Le(n.sources),alert:r.hazard>=.92?"SOURCE DRIVE MAXIMUM":r.divergence>=.64?"VECTOR SEPARATION":"",accent:r.hazard>=.92?"alarm":t.accent,severity:r.hazard>=.92?"alarm":r.divergence>=.64?"warning":"info"}}function R5(n){let e=n.sources[0]??qa(n.phase),t=n.sources[1],r=be(n,24),o=Math.round(r.current*100);return{body:["SIGNAL PROFILE",`PRIMARY   ${e.name.toUpperCase()}`,`SECONDARY ${t?t.name.toUpperCase():"NONE"}`,`SYNC      ${o.toString().padStart(3," ")}%`,`DELTA     ${(r.divergence*100).toFixed(0).padStart(3," ")}%`,`STATUS    ${r.hazard>=.86?"OVERTAKEN":o>=60?"LIVE":"STABLE"}`,`BIND      ${n.slot.id.toUpperCase()}`].join(`
`),footer:Le(n.sources),alert:o>=90?"SYNC THRESHOLD EXCEEDED":r.divergence>=.62?"CHANNEL SPLIT DETECTED":"",accent:o>=90?"alarm":"violet",severity:o>=90?"alarm":r.divergence>=.62||o>=70?"warning":"info"}}function _5(n){let e=Math.max(16,n.width),t=Math.max(6,n.height),r=be(n,Math.max(e,32));return{body:Kk(e,t,r),footer:Le(n.sources),alert:et(n)||at(r),accent:"alarm",severity:r.hazard>=.88?"alarm":"warning"}}function C5(n){let e=be(n,24);return{body:E5(n,e,Math.max(1,n.height)).join(`
`),footer:Le(n.sources),alert:et(n)||at(e),accent:e.hazard>=.88?"alarm":n.system.alerts.length>0?"amber":"signal",severity:e.hazard>=.88?"alarm":n.system.alerts.length>0?"warning":"info"}}function E5(n,e,t){let r=[];for(let o=0;o<n.system.alerts.length&&r.length<t;o+=1){let i=n.system.alerts[o];r.push(`${String(223229+o*17)}  ${i.title} ${i.detail}`)}for(let o=0;o<n.sources.length&&r.length<t;o+=1){let i=n.sources[o],a=Math.min(2,i.detailLines.length);for(let s=0;s<a&&r.length<t;s+=1){let l=i.detailLines[s];r.push(`${String(223500+o*31+s*7)}  ${i.name.toUpperCase()} ${l}`)}}return r.length<t&&r.push(`${String(224100+Math.round(e.phase%800))}  VECTOR DRIVE ${(e.current*100).toFixed(0)}%`),r.length<t&&r.push(`${String(224280+Math.round(e.divergence*100))}  PHASE SLEW ${(e.volatility*100).toFixed(0)}%`),r}function I5(n){let e=be(n,Math.max(24,n.width));return{body:qk(Math.max(18,n.width),Math.max(4,n.height),e),footer:Le(n.sources),alert:et(n)||at(e),accent:e.hazard>=.88?"alarm":"phosphor",severity:e.hazard>=.88?"alarm":e.volatility>=.58?"warning":"info"}}function I0(n){let e=be(n,Math.max(24,n.width));return{body:Yk(Math.max(12,n.width),Math.max(4,n.height),e,hi),footer:Le(n.sources),alert:et(n)||at(e),accent:e.hazard>=.88?"alarm":Yp(n.sources),severity:e.hazard>=.88?"alarm":e.hazard>=.7?"warning":"info"}}function A5(n){let e=be(n,Math.max(24,n.width));return{body:Xk(Math.max(18,n.width),Math.max(4,n.height),e),footer:Le(n.sources),alert:et(n)||at(e),accent:"phosphor",severity:e.hazard>=.92?"alarm":e.volatility>=.54?"warning":"info"}}function O5(n){let e=be(n,Math.max(24,n.width));return{body:Xc(Math.max(18,n.width),Math.max(4,n.height),e,Hn(e,"violet")),footer:Le(n.sources),alert:et(n)||at(e),accent:"violet",severity:e.hazard>=.92?"alarm":e.hazard>=.7?"warning":"info"}}function L5(n){let e=be(n,Math.max(24,n.width));return{body:Fk(Math.max(18,n.width),Math.max(4,n.height),e,Hn(e,"amber")),footer:Le(n.sources),alert:et(n)||at(e),accent:"amber",severity:e.hazard>=.88?"warning":"info"}}function P5(n){let e=be(n,Math.max(24,n.width));return{body:jk(Math.max(18,n.width),Math.max(4,n.height),e),footer:Le(n.sources),alert:et(n)||at(e),accent:"signal",severity:e.hazard>=.88?"warning":"info"}}function N5(n){let e=be(n,Math.max(24,n.width));return{body:v0(Math.max(16,n.width),Math.max(4,n.height),e,hi),footer:Le(n.sources),alert:et(n)||at(e),accent:"amber",severity:e.hazard>=.88?"warning":"info"}}function W5(n){let e=be(n,24),t=e.current>=.84?"OVERRIDE":e.current>=.62?"REVIEW":"HOLD",r=e.divergence>=.62?"REJECT":e.hazard>=.82?"CAUTION":"TRACK",o=e.volatility>=.54?"REROUTE":e.slope>=.18?"PURSUE":"STABLE";return{body:["\u256D\u2500\u2500\u2500\u2500 BALTHASAR-2 \u2500\u2500\u2500\u2500\u256E",`\u2502 ${t.padEnd(18," ")}\u2502`,`\u2502 ${o.padEnd(8," ")} / ${r.padEnd(7," ")} \u2502`,"\u2570\u2500\u2500 CASPER-3 \u2500\u2500 MELCHIOR-1 \u2500\u256F"].join(`
`),footer:Le(n.sources),alert:e.hazard>=.88?"MAGI CONFLICT STATE":e.divergence>=.62?"TRIPLE-VOTE SPLIT":"",accent:e.hazard>=.88?"alarm":e.divergence>=.62?"amber":"phosphor",severity:e.hazard>=.88?"alarm":e.divergence>=.62?"warning":"info"}}function V5(n){let e=be(n,Math.max(24,n.width));return{body:x0(Math.max(14,n.width),Math.max(4,n.height),e,hi),footer:Le(n.sources),alert:et(n)||at(e),accent:"alarm",severity:e.hazard>=.9?"alarm":e.divergence>=.58?"warning":"info"}}function D5(n){let e=be(n,24);return{body:[e.current>=.86?"LOCKED    DRIVE CHANNEL HELD CLOSED":"LOCKED    WAITING FOR PERMISSION KEY",e.divergence>=.58?"PURGE     OUTER GATE FORCE-CYCLE":"OPEN      OUTER AND LOCK GATE IMMEDIATELY",e.hazard>=.92?"REJECT    EMERGENCY DIRECTION REFUSAL":"REFUSED   ENTRY PLUG DIRECTION CHECK"].join(`
`),footer:Le(n.sources),alert:e.hazard>=.92?"DIRECTION REFUSAL STATE":e.divergence>=.58?"GATE RECONFIGURATION":"",accent:e.hazard>=.92?"alarm":e.hazard>=.75?"amber":"signal",severity:e.hazard>=.92?"alarm":e.hazard>=.75?"warning":"info"}}function z5(n){let e=be(n,Math.max(24,n.width));return{body:Gk(Math.max(18,n.width),Math.max(4,n.height),e),footer:Le(n.sources),alert:et(n)||at(e),accent:"phosphor",severity:e.hazard>=.88?"warning":"info"}}function $5(n){let e=be(n,Math.max(24,n.width));return{body:Uk(Math.max(18,n.width),Math.max(4,n.height),e),footer:Le(n.sources),alert:et(n)||at(e),accent:"amber",severity:e.hazard>=.88?"warning":"info"}}function H5(n){let e=be(n,Math.max(24,n.width));return{body:Jk(Math.max(18,n.width),Math.max(4,n.height),e,R0),footer:Le(n.sources),alert:e.hazard>=.92?"SUITE SATURATION":"",accent:"amber",severity:e.hazard>=.92?"warning":"info"}}var A0=new Set(["magi-board","route-board","gate-status","tactical-map","network-topology","component-index"]),O0=new Map;for(let n of Qt)O0.set(n.id,n);var B5=N0({includeTallWebLast:!1}),F5=N0({includeTallWebLast:!0});function L0(n,e={}){let t=e.source==="web"?F5:e.source==="opentui"?B5:void 0,r=t?G5(t):Qt;if(n==="all")return r;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a.section===n&&o.push(a)}return o}function P0(n){let e=j5(n);return E0(e)}function j5(n){let e={id:"cpu",name:n.demo.badge,visualizationId:n.demo.id,inputSourceIds:["demo:drive","demo:harmonic","demo:noise"],cycleEnabled:!1,cycleIntervalMs:1e4,ascii:n.ascii??Bp()},t=n.selected??!1;return{slot:e,system:K5(n.demo,n.phase),sources:U5(n.demo,n.phase,t),phase:n.phase,width:Math.max(8,n.width),height:Math.max(4,n.height)}}function N0(n){let e=[];if(!n.includeTallWebLast){for(let t=0;t<Qt.length;t+=1){let r=Qt[t];r.id!=="three-ascii-studio"&&e.push(r.id)}return e}for(let t=0;t<Qt.length;t+=1){let r=Qt[t];r.id!=="three-ascii-studio"&&!A0.has(r.id)&&e.push(r.id)}for(let t=0;t<Qt.length;t+=1){let r=Qt[t];r.id!=="three-ascii-studio"&&A0.has(r.id)&&e.push(r.id)}return e}function G5(n){let e=[];for(let t=0;t<n.length;t+=1){let r=O0.get(n[t]);r&&e.push(r)}return e}function U5(n,e,t){let r=Kp(n.id),o=[{name:n.badge,accent:n.accent,offset:r%31},{name:"Harmonic",accent:"signal",offset:r%17},{name:"Noise",accent:t?"amber":"violet",offset:r%43}],i=new Array(o.length);for(let a=0;a<o.length;a++){let s=o[a],l=yn(64,e+s.offset,.12+a*.035,.08+a*.025),d=l[l.length-1]??.5;i[a]={id:`demo:${n.id}:${a}`,name:s.name,accent:s.accent,value:d,series:l,detailLines:[`${Math.round(d*100)}% ${n.code}`]}}return i}function K5(n,e){let t=Wc(e,.08,.13);return{timestamp:Date.now(),hostname:"neon-exodus",osRelease:"suite",uptimeSeconds:e,loadavg:[t*2,t*1.4,t],cpuOverall:t*100,cpuCores:[],cpuHistory:yn(64,e,.08,.03,100),gpu:{available:!0,name:"NEON RENDER CORE",utilizationPercent:t*100,memoryUsed:t*18*1024**3,memoryTotal:24*1024**3,memoryPercent:t*75,temperatureCelsius:36+t*47,powerWatts:85+t*220,graphicsClockMhz:1500+t*950,memoryClockMhz:9e3+t*1200},gpuUtilizationHistory:yn(64,e,.075,.29),gpuMemoryHistory:yn(64,e,.045,.51),memory:{total:32*1024**3,used:t*24*1024**3,available:(1-t)*24*1024**3,free:(1-t)*24*1024**3,swapTotal:8*1024**3,swapUsed:t*2*1024**3,percent:t*100,swapPercent:t*25},memoryHistory:yn(64,e,.05,.1),swapHistory:yn(64,e,.04,.2,.35),temperatures:[{label:"CORE",celsius:40+t*48}],disks:[{filesystem:"/dev/neon",mount:"/",total:1,used:t,available:1-t,percent:Math.round(t*100)}],networks:[{name:"eth0",addresses:["127.0.0.1"],rxBytes:0,txBytes:0,rxRate:t*95e6,txRate:t*72e6}],rxHistory:yn(64,e,.11,.2),txHistory:yn(64,e,.09,.4),processes:[],alerts:t>.92?[{severity:"warning",title:n.badge,detail:"DRIVE SATURATION"}]:[],diagnostics:[]}}function uo(n){if(n<16)return[[15,23,42],[239,68,68],[34,197,94],[234,179,8],[59,130,246],[217,70,239],[6,182,212],[229,231,235],[71,85,105],[251,113,133],[134,239,172],[253,224,71],[147,197,253],[240,171,252],[103,232,249],[248,250,252]][n]??[219,234,254];if(n>=232){let r=8+(Math.min(n,255)-232)*10;return[r,r,r]}let e=Math.min(n,231)-16,t=r=>r===0?0:55+r*40;return[t(Math.floor(e/36)),t(Math.floor(e%36/6)),t(e%6)]}function Qc(n,e,t){let r=[],o,i,a=0;for(;a<n.length&&r.length<e;){let s=n[a];if(s==="\x1B"){let l=n.indexOf("m",a);if(l===-1)break;let d=n.slice(a+2,l).split(";").map(Number);for(let c=0;c<d.length;c+=1){let u=d[c];u===0?(o=void 0,i=void 0):u===39?o=void 0:u===49?i=void 0:u===38&&d[c+1]===2?(o=[d[c+2]??0,d[c+3]??0,d[c+4]??0],c+=4):u===48&&d[c+1]===2?(i=[d[c+2]??0,d[c+3]??0,d[c+4]??0],c+=4):u===38&&d[c+1]===5?(o=uo(d[c+2]??0),c+=2):u===48&&d[c+1]===5?(i=uo(d[c+2]??0),c+=2):u>=30&&u<=37?o=uo(u-30):u>=90&&u<=97?o=uo(u-90+8):u>=40&&u<=47?i=uo(u-40):u>=100&&u<=107&&(i=uo(u-100+8))}a=l+1;continue}r.push({char:s,foreground:o,background:i??t}),a+=1}for(;r.length<e;)r.push({char:" ",background:t});return r}var W0=`flf2a$ 6 5 16 15 13 0 24463 229
Standard by Glenn Chappell & Ian Chai 3/93 -- based on Frank's .sig
Includes ISO Latin-1
figlet release 2.1 -- 12 Aug 1994
Modified for figlet 2.2 by John Cowan <cowan@ccil.org>
  to add Latin-{2,3,4,5} support (Unicode U+0100-017F).
Permission is hereby given to modify this font, as long as the
modifier's name is placed on a comment line.

Modified by Paul Burton <solution@earthlink.net> 12/96 to include new parameter
supported by FIGlet and FIGWin.  May also be slightly modified for better use
of new full-width/kern/smush alternatives, but default output is NOT changed.

Font modified May 20, 2012 by patorjk to add the 0xCA0 character
 $@
 $@
 $@
 $@
 $@
 $@@
  _ @
 | |@
 | |@
 |_|@
 (_)@
    @@
  _ _ @
 ( | )@
  V V @
   $  @
   $  @
      @@
    _  _   @
  _| || |_ @
 |_  ..  _|@
 |_      _|@
   |_||_|  @
           @@
   _  @
  | | @
 / __)@
 \\__ \\@
 (   /@
  |_| @@
  _  __@
 (_)/ /@
   / / @
  / /_ @
 /_/(_)@
       @@
   ___   @
  ( _ )  @
  / _ \\/\\@
 | (_>  <@
  \\___/\\/@
         @@
  _ @
 ( )@
 |/ @
  $ @
  $ @
    @@
   __@
  / /@
 | | @
 | | @
 | | @
  \\_\\@@
 __  @
 \\ \\ @
  | |@
  | |@
  | |@
 /_/ @@
       @
 __/\\__@
 \\    /@
 /_  _\\@
   \\/  @
       @@
        @
    _   @
  _| |_ @
 |_   _|@
   |_|  @
        @@
    @
    @
    @
  _ @
 ( )@
 |/ @@
        @
        @
  _____ @
 |_____|@
    $   @
        @@
    @
    @
    @
  _ @
 (_)@
    @@
     __@
    / /@
   / / @
  / /  @
 /_/   @
       @@
   ___  @
  / _ \\ @
 | | | |@
 | |_| |@
  \\___/ @
        @@
  _ @
 / |@
 | |@
 | |@
 |_|@
    @@
  ____  @
 |___ \\ @
   __) |@
  / __/ @
 |_____|@
        @@
  _____ @
 |___ / @
   |_ \\ @
  ___) |@
 |____/ @
        @@
  _  _   @
 | || |  @
 | || |_ @
 |__   _|@
    |_|  @
         @@
  ____  @
 | ___| @
 |___ \\ @
  ___) |@
 |____/ @
        @@
   __   @
  / /_  @
 | '_ \\ @
 | (_) |@
  \\___/ @
        @@
  _____ @
 |___  |@
    / / @
   / /  @
  /_/   @
        @@
   ___  @
  ( _ ) @
  / _ \\ @
 | (_) |@
  \\___/ @
        @@
   ___  @
  / _ \\ @
 | (_) |@
  \\__, |@
    /_/ @
        @@
    @
  _ @
 (_)@
  _ @
 (_)@
    @@
    @
  _ @
 (_)@
  _ @
 ( )@
 |/ @@
   __@
  / /@
 / / @
 \\ \\ @
  \\_\\@
     @@
        @
  _____ @
 |_____|@
 |_____|@
    $   @
        @@
 __  @
 \\ \\ @
  \\ \\@
  / /@
 /_/ @
     @@
  ___ @
 |__ \\@
   / /@
  |_| @
  (_) @
      @@
    ____  @
   / __ \\ @
  / / _\` |@
 | | (_| |@
  \\ \\__,_|@
   \\____/ @@
     _    @
    / \\   @
   / _ \\  @
  / ___ \\ @
 /_/   \\_\\@
          @@
  ____  @
 | __ ) @
 |  _ \\ @
 | |_) |@
 |____/ @
        @@
   ____ @
  / ___|@
 | |    @
 | |___ @
  \\____|@
        @@
  ____  @
 |  _ \\ @
 | | | |@
 | |_| |@
 |____/ @
        @@
  _____ @
 | ____|@
 |  _|  @
 | |___ @
 |_____|@
        @@
  _____ @
 |  ___|@
 | |_   @
 |  _|  @
 |_|    @
        @@
   ____ @
  / ___|@
 | |  _ @
 | |_| |@
  \\____|@
        @@
  _   _ @
 | | | |@
 | |_| |@
 |  _  |@
 |_| |_|@
        @@
  ___ @
 |_ _|@
  | | @
  | | @
 |___|@
      @@
      _ @
     | |@
  _  | |@
 | |_| |@
  \\___/ @
        @@
  _  __@
 | |/ /@
 | ' / @
 | . \\ @
 |_|\\_\\@
       @@
  _     @
 | |    @
 | |    @
 | |___ @
 |_____|@
        @@
  __  __ @
 |  \\/  |@
 | |\\/| |@
 | |  | |@
 |_|  |_|@
         @@
  _   _ @
 | \\ | |@
 |  \\| |@
 | |\\  |@
 |_| \\_|@
        @@
   ___  @
  / _ \\ @
 | | | |@
 | |_| |@
  \\___/ @
        @@
  ____  @
 |  _ \\ @
 | |_) |@
 |  __/ @
 |_|    @
        @@
   ___  @
  / _ \\ @
 | | | |@
 | |_| |@
  \\__\\_\\@
        @@
  ____  @
 |  _ \\ @
 | |_) |@
 |  _ < @
 |_| \\_\\@
        @@
  ____  @
 / ___| @
 \\___ \\ @
  ___) |@
 |____/ @
        @@
  _____ @
 |_   _|@
   | |  @
   | |  @
   |_|  @
        @@
  _   _ @
 | | | |@
 | | | |@
 | |_| |@
  \\___/ @
        @@
 __     __@
 \\ \\   / /@
  \\ \\ / / @
   \\ V /  @
    \\_/   @
          @@
 __        __@
 \\ \\      / /@
  \\ \\ /\\ / / @
   \\ V  V /  @
    \\_/\\_/   @
             @@
 __  __@
 \\ \\/ /@
  \\  / @
  /  \\ @
 /_/\\_\\@
       @@
 __   __@
 \\ \\ / /@
  \\ V / @
   | |  @
   |_|  @
        @@
  _____@
 |__  /@
   / / @
  / /_ @
 /____|@
       @@
  __ @
 | _|@
 | | @
 | | @
 | | @
 |__|@@
 __    @
 \\ \\   @
  \\ \\  @
   \\ \\ @
    \\_\\@
       @@
  __ @
 |_ |@
  | |@
  | |@
  | |@
 |__|@@
  /\\ @
 |/\\|@
   $ @
   $ @
   $ @
     @@
        @
        @
        @
        @
  _____ @
 |_____|@@
  _ @
 ( )@
  \\|@
  $ @
  $ @
    @@
        @
   __ _ @
  / _\` |@
 | (_| |@
  \\__,_|@
        @@
  _     @
 | |__  @
 | '_ \\ @
 | |_) |@
 |_.__/ @
        @@
       @
   ___ @
  / __|@
 | (__ @
  \\___|@
       @@
      _ @
   __| |@
  / _\` |@
 | (_| |@
  \\__,_|@
        @@
       @
   ___ @
  / _ \\@
 |  __/@
  \\___|@
       @@
   __ @
  / _|@
 | |_ @
 |  _|@
 |_|  @
      @@
        @
   __ _ @
  / _\` |@
 | (_| |@
  \\__, |@
  |___/ @@
  _     @
 | |__  @
 | '_ \\ @
 | | | |@
 |_| |_|@
        @@
  _ @
 (_)@
 | |@
 | |@
 |_|@
    @@
    _ @
   (_)@
   | |@
   | |@
  _/ |@
 |__/ @@
  _    @
 | | __@
 | |/ /@
 |   < @
 |_|\\_\\@
       @@
  _ @
 | |@
 | |@
 | |@
 |_|@
    @@
            @
  _ __ ___  @
 | '_ \` _ \\ @
 | | | | | |@
 |_| |_| |_|@
            @@
        @
  _ __  @
 | '_ \\ @
 | | | |@
 |_| |_|@
        @@
        @
   ___  @
  / _ \\ @
 | (_) |@
  \\___/ @
        @@
        @
  _ __  @
 | '_ \\ @
 | |_) |@
 | .__/ @
 |_|    @@
        @
   __ _ @
  / _\` |@
 | (_| |@
  \\__, |@
     |_|@@
       @
  _ __ @
 | '__|@
 | |   @
 |_|   @
       @@
      @
  ___ @
 / __|@
 \\__ \\@
 |___/@
      @@
  _   @
 | |_ @
 | __|@
 | |_ @
  \\__|@
      @@
        @
  _   _ @
 | | | |@
 | |_| |@
  \\__,_|@
        @@
        @
 __   __@
 \\ \\ / /@
  \\ V / @
   \\_/  @
        @@
           @
 __      __@
 \\ \\ /\\ / /@
  \\ V  V / @
   \\_/\\_/  @
           @@
       @
 __  __@
 \\ \\/ /@
  >  < @
 /_/\\_\\@
       @@
        @
  _   _ @
 | | | |@
 | |_| |@
  \\__, |@
  |___/ @@
      @
  ____@
 |_  /@
  / / @
 /___|@
      @@
    __@
   / /@
  | | @
 < <  @
  | | @
   \\_\\@@
  _ @
 | |@
 | |@
 | |@
 | |@
 |_|@@
 __   @
 \\ \\  @
  | | @
   > >@
  | | @
 /_/  @@
  /\\/|@
 |/\\/ @
   $  @
   $  @
   $  @
      @@
`,V0=`flf2a$ 5 4 13 15 10 0 22415
Small by Glenn Chappell 4/93 -- based on Standard
Includes ISO Latin-1
figlet release 2.1 -- 12 Aug 1994
Permission is hereby given to modify this font, as long as the
modifier's name is placed on a comment line.

Modified by Paul Burton <solution@earthlink.net> 12/96 to include new parameter
supported by FIGlet and FIGWin.  May also be slightly modified for better use
of new full-width/kern/smush alternatives, but default output is NOT changed.

 $@
 $@
 $@
 $@
 $@@
  _ @
 | |@
 |_|@
 (_)@
    @@
  _ _ @
 ( | )@
  V V @
   $  @
      @@
    _ _   @
  _| | |_ @
 |_  .  _|@
 |_     _|@
   |_|_|  @@
     @
  ||_@
 (_-<@
 / _/@
  || @@
  _  __ @
 (_)/ / @
   / /_ @
  /_/(_)@
        @@
  __     @
 / _|___ @
 > _|_ _|@
 \\_____| @
         @@
  _ @
 ( )@
 |/ @
  $ @
    @@
   __@
  / /@
 | | @
 | | @
  \\_\\@@
 __  @
 \\ \\ @
  | |@
  | |@
 /_/ @@
     @
 _/\\_@
 >  <@
  \\/ @
     @@
    _   @
  _| |_ @
 |_   _|@
   |_|  @
        @@
    @
    @
  _ @
 ( )@
 |/ @@
      @
  ___ @
 |___|@
   $  @
      @@
    @
    @
  _ @
 (_)@
    @@
    __@
   / /@
  / / @
 /_/  @
      @@
   __  @
  /  \\ @
 | () |@
  \\__/ @
       @@
  _ @
 / |@
 | |@
 |_|@
    @@
  ___ @
 |_  )@
  / / @
 /___|@
      @@
  ____@
 |__ /@
  |_ \\@
 |___/@
      @@
  _ _  @
 | | | @
 |_  _|@
   |_| @
       @@
  ___ @
 | __|@
 |__ \\@
 |___/@
      @@
   __ @
  / / @
 / _ \\@
 \\___/@
      @@
  ____ @
 |__  |@
   / / @
  /_/  @
       @@
  ___ @
 ( _ )@
 / _ \\@
 \\___/@
      @@
  ___ @
 / _ \\@
 \\_, /@
  /_/ @
      @@
  _ @
 (_)@
  _ @
 (_)@
    @@
  _ @
 (_)@
  _ @
 ( )@
 |/ @@
   __@
  / /@
 < < @
  \\_\\@
     @@
      @
  ___ @
 |___|@
 |___|@
      @@
 __  @
 \\ \\ @
  > >@
 /_/ @
     @@
  ___ @
 |__ \\@
   /_/@
  (_) @
      @@
   ____  @
  / __ \\ @
 / / _\` |@
 \\ \\__,_|@
  \\____/ @@
    _   @
   /_\\  @
  / _ \\ @
 /_/ \\_\\@
        @@
  ___ @
 | _ )@
 | _ \\@
 |___/@
      @@
   ___ @
  / __|@
 | (__ @
  \\___|@
       @@
  ___  @
 |   \\ @
 | |) |@
 |___/ @
       @@
  ___ @
 | __|@
 | _| @
 |___|@
      @@
  ___ @
 | __|@
 | _| @
 |_|  @
      @@
   ___ @
  / __|@
 | (_ |@
  \\___|@
       @@
  _  _ @
 | || |@
 | __ |@
 |_||_|@
       @@
  ___ @
 |_ _|@
  | | @
 |___|@
      @@
     _ @
  _ | |@
 | || |@
  \\__/ @
       @@
  _  __@
 | |/ /@
 | ' < @
 |_|\\_\\@
       @@
  _    @
 | |   @
 | |__ @
 |____|@
       @@
  __  __ @
 |  \\/  |@
 | |\\/| |@
 |_|  |_|@
         @@
  _  _ @
 | \\| |@
 | .\` |@
 |_|\\_|@
       @@
   ___  @
  / _ \\ @
 | (_) |@
  \\___/ @
        @@
  ___ @
 | _ \\@
 |  _/@
 |_|  @
      @@
   ___  @
  / _ \\ @
 | (_) |@
  \\__\\_\\@
        @@
  ___ @
 | _ \\@
 |   /@
 |_|_\\@
      @@
  ___ @
 / __|@
 \\__ \\@
 |___/@
      @@
  _____ @
 |_   _|@
   | |  @
   |_|  @
        @@
  _   _ @
 | | | |@
 | |_| |@
  \\___/ @
        @@
 __   __@
 \\ \\ / /@
  \\ V / @
   \\_/  @
        @@
 __      __@
 \\ \\    / /@
  \\ \\/\\/ / @
   \\_/\\_/  @
           @@
 __  __@
 \\ \\/ /@
  >  < @
 /_/\\_\\@
       @@
 __   __@
 \\ \\ / /@
  \\ V / @
   |_|  @
        @@
  ____@
 |_  /@
  / / @
 /___|@
      @@
  __ @
 | _|@
 | | @
 | | @
 |__|@@
 __   @
 \\ \\  @
  \\ \\ @
   \\_\\@
      @@
  __ @
 |_ |@
  | |@
  | |@
 |__|@@
  /\\ @
 |/\\|@
   $ @
   $ @
     @@
      @
      @
      @
  ___ @
 |___|@@
  _ @
 ( )@
  \\|@
  $ @
    @@
       @
  __ _ @
 / _\` |@
 \\__,_|@
       @@
  _    @
 | |__ @
 | '_ \\@
 |_.__/@
       @@
     @
  __ @
 / _|@
 \\__|@
     @@
     _ @
  __| |@
 / _\` |@
 \\__,_|@
       @@
      @
  ___ @
 / -_)@
 \\___|@
      @@
   __ @
  / _|@
 |  _|@
 |_|  @
      @@
       @
  __ _ @
 / _\` |@
 \\__, |@
 |___/ @@
  _    @
 | |_  @
 | ' \\ @
 |_||_|@
       @@
  _ @
 (_)@
 | |@
 |_|@
    @@
    _ @
   (_)@
   | |@
  _/ |@
 |__/ @@
  _   @
 | |__@
 | / /@
 |_\\_\\@
      @@
  _ @
 | |@
 | |@
 |_|@
    @@
        @
  _ __  @
 | '  \\ @
 |_|_|_|@
        @@
       @
  _ _  @
 | ' \\ @
 |_||_|@
       @@
      @
  ___ @
 / _ \\@
 \\___/@
      @@
       @
  _ __ @
 | '_ \\@
 | .__/@
 |_|   @@
       @
  __ _ @
 / _\` |@
 \\__, |@
    |_|@@
      @
  _ _ @
 | '_|@
 |_|  @
      @@
     @
  ___@
 (_-<@
 /__/@
     @@
  _   @
 | |_ @
 |  _|@
  \\__|@
      @@
       @
  _  _ @
 | || |@
  \\_,_|@
       @@
      @
 __ __@
 \\ V /@
  \\_/ @
      @@
         @
 __ __ __@
 \\ V  V /@
  \\_/\\_/ @
         @@
      @
 __ __@
 \\ \\ /@
 /_\\_\\@
      @@
       @
  _  _ @
 | || |@
  \\_, |@
  |__/ @@
     @
  ___@
 |_ /@
 /__|@
     @@
    __@
   / /@
 _| | @
  | | @
   \\_\\@@
  _ @
 | |@
 | |@
 | |@
 |_|@@
 __   @
 \\ \\  @
  | |_@
  | | @
 /_/  @@
  /\\/|@
 |/\\/ @
   $  @
   $  @
      @@
`;var D0=`flf2a$ 6 5 32 15 12
Font name is graffiti.flf
This figlet font designed by Leigh Purdie (purdie@zeus.usq.edu.au)
'fig-fonted' by Leigh Purdie and Tim Maggio (tim@claremont.com)
Date: 5 Mar 1994

---

Font modified May 20, 2012 by patorjk 
- Changed the hardblanks around certain punctuation characters (., and -) to improve smushing.
- Added the 0xCA0 character

Updated 2026.09.19 by patorjk. Added characters: \xC3 \xE3 \xD5 \xF5 \xC2 \xE2 \xCA \xEA \xD4 \xF4 \xC0 \xE0 \xC7 \xE7 \xC1 \xC9 \xCD \xD3 \xDA \xDC \xD1 \xE1 \xE9 \xED \xF3 \xFA \xFC \xF1 \xA1 \xBF \xDF \xF6 \xE4
$@
$@
$@
$@
$@
$@@
._.@
| |@
| |@
 \\|@
 __@
 \\/@@
/\\/\\@
)/)/@
    @
    @
    @
    @@
   _  _   @
__| || |__@
\\   __   /@
 |  ||  | @
/_  ~~  _\\@
  |_||_|  @@
  ____/\\__@
 /   / /_/@
 \\__/ / \\ @
 / / /   \\@
/_/ /__  /@
  \\/   \\/ @@
 _   /\\ @
/ \\ / / @
\\_// /_ @
  / // \\@
 / / \\_/@
 \\/     @@
  ____   @
 /  _ \\  @
 >  _ </\\@
/  <_\\ \\/@
\\_____\\ \\@
       \\/@@
/\\@
)/@
  @
  @
  @
  @@
$   ___$@
$  /  /$@
$ /  / $@
$(  (  $@
$ \\  \\ $@
$  \\__\\$@@
$___   $@
$\\  \\  $@
$ \\  \\ $@
$  )  )$@
$ /  / $@
$/__/  $@@
$         $@
$ /\\|\\/\\  $@
$_)    (__$@
$\\_     _/$@
$  )    \\ $@
$  \\/\\|\\/ $@@
$          $@
$   .__    $@
$ __|  |___$@
$/__    __/$@
$   |__|   $@
$          $@@
    @
    @
    @
    @
$/\\$@
$)/$@@
         @
         @
$ ______$@
$/_____/$@
$       $@
         @@
    @
    @
    @
    @
$/\\$@
$\\/$@@
$    /\\$@
$   / /$@
$  / / $@
$ / /  $@
$/ /   $@
$\\/    $@@
_______   @
\\   _  \\  @
/  /_\\  \\ @
\\  \\_/   \\@
 \\_____  /@
       \\/ @@
 ____ @
/_   |@
 |   |@
 |   |@
 |___|@
      @@
________  @
\\_____  \\ @
 /  ____/ @
/       \\ @
\\_______ \\@
        \\/@@
________  @
\\_____  \\ @
  _(__  < @
 /       \\@
/______  /@
       \\/ @@
   _____  @
  /  |  | @
 /   |  |_@
/    ^   /@
\\____   | @
     |__| @@
 .________@
 |   ____/@
 |____  \\ @
 /       \\@
/______  /@
       \\/ @@
  ________@
 /  _____/@
/   __  \\ @
\\  |__\\  \\@
 \\_____  /@
       \\/ @@
_________ @
\\______  \\@
    /    /@
   /    / @
  /____/  @
          @@
  ______  @
 /  __  \\ @
 >      < @
/   --   \\@
\\______  /@
       \\/ @@
 ________ @
/   __   \\@
\\____    /@
   /    / @
  /____/  @
          @@
$  $@
$/\\$@
$\\/$@
$/\\$@
$\\/$@
$  $@@
$  $@
$/\\$@
$\\/$@
$/\\$@
$)/$@
$  $@@
$  __$@
$ / /$@
$/ / $@
$\\ \\ $@
$ \\_\\$@
$    $@@
$       $@
$ ______$@
$/_____/$@
$/_____/$@
$       $@
$       $@@
$__  $@
$\\ \\ $@
$ \\ \\$@
$ / /$@
$/_/ $@
$    $@@
_________ @
\\_____   \\@
   /   __/@
  |   |   @
  |___|   @
  <___>   @@
   _____  @
  / ___ \\ @
 / / ._\\ \\@
<  \\_____/@
 \\_____\\  @
          @@
   _____   @
  /  _  \\  @
 /  /_\\  \\ @
/    |    \\@
\\____|__  /@
        \\/ @@
__________ @
\\______   \\@
 |    |  _/@
 |    |   \\@
 |______  /@
        \\/ @@
_________  @
\\_   ___ \\ @
/    \\  \\/ @
\\     \\____@
 \\______  /@
        \\/ @@
________   @
\\______ \\  @
 |    |  \\ @
 |    \`   \\@
/_______  /@
        \\/ @@
___________@
\\_   _____/@
 |    __)_ @
 |        \\@
/_______  /@
        \\/ @@
___________@
\\_   _____/@
 |    __)  @
 |     \\   @
 \\___  /   @
     \\/    @@
  ________ @
 /  _____/ @
/   \\  ___ @
\\    \\_\\  \\@
 \\______  /@
        \\/ @@
  ___ ___  @
 /   |   \\ @
/    ~    \\@
\\    Y    /@
 \\___|_  / @
       \\/  @@
.___ @
|   |@
|   |@
|   |@
|___|@
     @@
     ____.@
    |    |@
    |    |@
/\\__|    |@
\\________|@
          @@
 ____  __.@
|    |/ _|@
|      <  @
|    |  \\ @
|____|__ \\@
        \\/@@
.____     @
|    |    @
|    |    @
|    |___ @
|_______ \\@
        \\/@@
   _____   @
  /     \\  @
 /  \\ /  \\ @
/    Y    \\@
\\____|__  /@
        \\/ @@
 _______   @
 \\      \\  @
 /   |   \\ @
/    |    \\@
\\____|__  /@
        \\/ @@
________   @
\\_____  \\  @
 /   |   \\ @
/    |    \\@
\\_______  /@
        \\/ @@
__________ @
\\______   \\@
 |     ___/@
 |    |    @
 |____|    @
           @@
________   @
\\_____  \\  @
 /  / \\  \\ @
/   \\_/.  \\@
\\_____\\ \\_/@
       \\__>@@
__________ @
\\______   \\@
 |       _/@
 |    |   \\@
 |____|_  /@
        \\/ @@
  _________@
 /   _____/@
 \\_____  \\ @
 /        \\@
/_______  /@
        \\/ @@
___________@
\\__    ___/@
  |    |   @
  |    |   @
  |____|   @
           @@
 ____ ___ @
|    |   \\@
|    |   /@
|    |  / @
|______/  @
          @@
____   ____@
\\   \\ /   /@
 \\   Y   / @
  \\     /  @
   \\___/   @
           @@
 __      __ @
/  \\    /  \\@
\\   \\/\\/   /@
 \\        / @
  \\__/\\  /  @
       \\/   @@
____  ___@
\\   \\/  /@
 \\     / @
 /     \\ @
/___/\\  \\@
      \\_/@@
_____.___.@
\\__  |   |@
 /   |   |@
 \\____   |@
 / ______|@
 \\/       @@
__________@
\\____    /@
  /     / @
 /     /_ @
/_______ \\@
        \\/@@
$.____ $@
$|   _|$@
$|  |  $@
$|  |  $@
$|  |_ $@
$|____|$@@
/\\    @
\\ \\   @
 \\ \\  @
  \\ \\ @
   \\ \\@
    \\/@@
$ ____.$@
$|_   |$@
$  |  |$@
$  |  |$@
$ _|  |$@
$|____|$@@
$ /\\ $@
$/  \\$@
$\\/\\/$@
$    $@
$    $@
$    $@@
       @
       @
       @
       @
 ______@
/_____/@@
/\\@
\\(@
  @
  @
  @
  @@
        @
_____   @
\\__  \\  @
 / __ \\_@
(____  /@
     \\/ @@
___.    @
\\_ |__  @
 | __ \\ @
 | \\_\\ \\@
 |___  /@
     \\/ @@
        @
  ____  @
_/ ___\\ @
\\  \\___ @
 \\___  >@
     \\/ @@
    .___@
  __| _/@
 / __ | @
/ /_/ | @
\\____ | @
     \\/ @@
        @
  ____  @
_/ __ \\ @
\\  ___/ @
 \\___  >@
     \\/ @@
  _____ @
_/ ____\\@
\\   __\\ @
 |  |   @
 |__|   @
        @@
         @
   ____  @
  / ___\\ @
 / /_/  >@
 \\___  / @
/_____/  @@
.__     @
|  |__  @
|  |  \\ @
|   Y  \\@
|___|  /@
     \\/ @@
.__ @
|__|@
|  |@
|  |@
|__|@
    @@
     __ @
    |__|@
    |  |@
    |  |@
/\\__|  |@
\\______|@@
 __    @
|  | __@
|  |/ /@
|    < @
|__|_ \\@
     \\/@@
.__   @
|  |  @
|  |  @
|  |__@
|____/@
      @@
         @
  _____  @
 /     \\ @
|  Y Y  \\@
|__|_|  /@
      \\/ @@
        @
  ____  @
 /    \\ @
|   |  \\@
|___|  /@
     \\/ @@
        @
  ____  @
 /  _ \\ @
(  <_> )@
 \\____/ @
        @@
        @
______  @
\\____ \\ @
|  |_> >@
|   __/ @
|__|    @@
        @
  ______@
 / ____/@
< <_|  |@
 \\__   |@
    |__|@@
        @
_______ @
\\_  __ \\@
 |  | \\/@
 |__|   @
        @@
        @
  ______@
 /  ___/@
 \\___ \\ @
/____  >@
     \\/ @@
  __   @
_/  |_ @
\\   __\\@
 |  |  @
 |__|  @
       @@
       @
 __ __ @
|  |  \\@
|  |  /@
|____/ @
       @@
       @
___  __@
\\  \\/ /@
 \\   / @
  \\_/  @
       @@
         @
__  _  __@
\\ \\/ \\/ /@
 \\     / @
  \\/\\_/  @
         @@
        @
___  ___@
\\  \\/  /@
 >    < @
/__/\\_ \\@
      \\/@@
        @
 ___.__.@
<   |  |@
 \\___  |@
 / ____|@
 \\/     @@
        @
________@
\\___   /@
 /    / @
/_____ \\@
      \\/@@
$ ___$@
$/ / $@
$\\ \\ $@
$< < $@
$/ / $@
$\\_\\_$@@
$._.$@
$| |$@
$|_|$@
$|-|$@
$| |$@
$|_|$@@
$___ $@
$ \\ \\$@
$ / /$@
$ > >$@
$ \\ \\$@
$_/_/$@@
$ ___    $@
$/ _ \\_/\\$@
$\\/ \\___/$@
$        $@
$        $@
$        $@@
`;function eu(n,e,t){if(t.startsWith("PK"))throw new TypeError(`Font ${n} is a zipped TOIlet font; unzip it first.`);let r=t.replace(/^\uFEFF/,"").replaceAll(`\r
`,`
`).split(`
`),o=r[0]??"",i=/^[ft]lf2a(\S)?\s+(\d+)\s+\d+\s+\d+\s+(-?\d+)\s+(\d+)/.exec(o);if(!i)throw new TypeError(`Invalid FIGlet header for font ${n}.`);let a=i[1]??"$",s=Number(i[2]),l=Number(i[4]);if(s<1||s>64||t.length>2e6)throw new RangeError(`Font ${n} exceeds font limits.`);let d=new Map,c=new Map,u=1+l;for(let m=32;m<=126;m+=1){let g=[];for(let w=0;w<s;w+=1){let x=r[u+w];if(x===void 0)throw new TypeError(`Font ${n} ends before character ${m}.`);g.push(x.replace(/(.)\1?$/,""))}u+=s;let y=Math.max(...g.map(w=>w.length));if(y>256)throw new RangeError(`Font ${n} has an oversized glyph.`);let b=g.map(w=>w.padEnd(y," "));c.set(String.fromCharCode(m),b),d.set(String.fromCharCode(m),b.map(w=>w.replaceAll(a," ")))}let h=Number(i[3]),f=Number(o.split(/\s+/)[7]),p=Number.isFinite(f)?f&255:h<0?0:h===0?64:128|h;return{id:n,label:e,height:s,glyphs:d,rawGlyphs:c,hardblank:a,horizontalLayout:p}}var ho=[eu("standard","Standard",W0),eu("small","Small",V0),eu("graffiti","Graffiti",D0)];function fi(n){return ho.find(e=>e.id===n)??ho[0]}function br(n,e,t="kern"){if(e.length>4096)throw new RangeError("FIGlet text is limited to 4096 characters.");if(t==="font"||t==="fit")return q5(n,e,t);let r=new Array(n.height).fill("");for(let i of e){let a=n.glyphs.get(i)??n.glyphs.get("?");if(r[0].length===0){for(let l=0;l<n.height;l+=1)r[l]=a[l];continue}let s=t==="kern"?Y5(r,a,n.height):0;for(let l=0;l<n.height;l+=1){let d=r[l],c=a[l],u=d.length-s,h=d.slice(0,u);for(let f=0;f<s;f+=1){let p=d[u+f]??" ",m=c[f]??" ";h+=p===" "?m:p}r[l]=h+c.slice(s)}}let o=Math.max(0,...r.map(i=>i.trimEnd().length));return r.map(i=>i.slice(0,o).padEnd(o," "))}function z0(n,e,t,r){if(n===" ")return e;if(e===" ")return n;if(n===t||e===t)return r&32&&n===e?n:void 0;if(!r)return e;if(r&1&&n===e)return n;if(r&2){if(n==="_"&&"|/\\[]{}()<>".includes(e))return e;if(e==="_"&&"|/\\[]{}()<>".includes(n))return n}let o=["|","/\\","[]","{}","()","<>"],i=o.findIndex(s=>s.includes(n)),a=o.findIndex(s=>s.includes(e));if(r&4&&i>=0&&a>=0&&i!==a)return i>a?n:e;if(r&8&&["[]","][","{}","}{","()",")("].includes(n+e))return"|";if(r&16)return{"/\\":"|","\\/":"Y","><":"X"}[n+e]}function q5(n,e,t){let r=new Array(n.height).fill(""),o=n.horizontalLayout??64,i=t==="font"&&(o&128)!==0,a=t==="fit"||(o&192)!==0,s=n.hardblank??"$",l=0;for(let u of e){let h=n.rawGlyphs??n.glyphs,f=h.get(u)??h.get("?"),p=f[0].length,m=0,g=a?Math.min(r[0].length,p):0;for(let y=1;y<=g;y++){let b=!0,w=!1;for(let x=0;x<n.height&&b;x++){let k=r[x];for(let C=0;C<y;C++){let T=k[k.length-y+C],S=f[x][C];if(T!==" "&&S!==" "&&(w=!0),T!==" "&&S!==" "&&(!i||p<2||l<2||z0(T,S,s,o&63)===void 0)){b=!1;break}}}if(!b||(m=y,w))break}for(let y=0;y<n.height;y++){let b=r[y],w=f[y],x=b.length-m,k=b.slice(0,x);for(let C=0;C<m;C++)k+=z0(b[x+C],w[C],s,o&63);r[y]=k+w.slice(m)}l=p}let d=r.map(u=>u.replaceAll(s," ")),c=Math.max(0,...d.map(u=>u.trimEnd().length));return d.map(u=>u.slice(0,c).padEnd(c," "))}function Y5(n,e,t){let r=e[0]?.length??0,o=Math.min(r,...n.map(i=>i.length));for(let i=0;i<t;i+=1){let a=n[i],s=e[i],l=a.trimEnd().length,d=0;for(;d<s.length&&s[d]===" ";)d+=1;let c=a.length-l+d-1;o=Math.min(o,Math.max(0,c))}return o}function $0(n){let e="Hello",t=e.length,r=!1,o=1,i=0,a=0,s="Small is the default. Graffiti is also available.",l="",d=[],c=[{label:"Font default",id:"font"},{label:"Fitted",id:"fit"},{label:"Full",id:"full"}],u=()=>br(ho[o],e,c[i].id),h=()=>{l=u().join(`
`),l.trim()&&Promise.resolve(n(l)).then(f=>{s=f===!1?"Copy was blocked by the host.":"ASCII output copied."}).catch(()=>s="Copy was blocked by the host.")};return{id:"font-generator",title:"ASCII font generator",summary:"Small / Graffiti / Standard \xB7 editable FIGlet text and layout.",window:{width:90,height:23,minWidth:26,minHeight:12,widthRatio:.8},render(f,p,m,g){let y=Array.from({length:p},()=>Array.from({length:f},()=>({char:" ",foreground:g?.text,background:g?.surface}))),b={foreground:g?.text,background:g?.surface},w={...b,foreground:g?.accent},x=Math.max(1,f-8),k=Math.max(0,t-x+1);if(ge(y,1,0,"Text: "+e.slice(k,k+x),b),y[0]?.[7+t-k]&&(y[0][7+t-k]={char:"\u258F",...w}),r)for(let O=7;O<f-1;O++){let v=y[0][O];y[0][O]={...v,foreground:g?.surface,background:g?.accent}}ge(y,1,1,"Type to edit \xB7 Ctrl+A replace \xB7 Ctrl+C copy output",{...b,foreground:g?.muted}),d=[];let C=3,T=1,S=(O,v,N)=>{let R=`[${v?"\u25CF ":""}${O}]`;T+R.length>=f&&T>1&&(C++,T=1),ge(y,T,C,R,v?w:b),d.push({from:T,to:Math.min(f,T+R.length),row:C,action:N}),T+=R.length+1};ho.forEach((O,v)=>S(O.label,v===o,()=>{o=v,a=0})),C+=2,T=1,c.forEach((O,v)=>S(O.label,v===i,()=>{i=v,a=0})),C+=2,T=1,S("Copy ASCII",!1,h),C+=2;let A=u();l=A.join(`
`);let I=A[0]?.length??0;a=Math.max(0,Math.min(a,Math.max(0,I-f+2)));for(let O=0;O<A.length&&C+O<p-2;O++)ge(y,1,C+O,A[O].slice(a,a+Math.max(1,f-2)),w);return ge(y,1,p-2,I>f-2?"Preview wider than window \xB7 Alt+\u2190/\u2192 pans \xB7 copy keeps all columns":s,{...b,foreground:g?.muted}),ge(y,1,p-1,`${ho[o].label} \xB7 ${I} columns \xB7 ${A.length} rows`,b),y},onPointerDown(f,p){let m=d.find(g=>g.row===p&&f>=g.from&&f<g.to);m?m.action():p===0&&(t=e.length,r=!1)},onKey(f){if(f.meta&&(f.key==="left"||f.key==="right"))return a=Math.max(0,a+(f.key==="left"?-4:4)),!0;if(f.ctrl||f.meta)return f.key==="a"?(r=!0,!0):f.key==="c"?(h(),!0):!1;if(f.key==="tab"||f.key==="escape")return!1;if(f.key==="left")t=Math.max(0,t-1);else if(f.key==="right")t=Math.min(e.length,t+1);else if(f.key==="home")t=0;else if(f.key==="end")t=e.length;else if(f.key==="backspace"||f.key==="delete")r?(e="",t=0):f.key==="backspace"&&t>0?(e=e.slice(0,t-1)+e.slice(t),t--):f.key==="delete"&&(e=e.slice(0,t)+e.slice(t+1));else{let p=new TextDecoder().decode(f.buffer);if(!p||!/^[\x20-\x7e]+$/.test(p))return!1;if(e.length-(r?e.length:0)+p.length>512)return s="Text is limited to 512 characters.",!0;r&&(e="",t=0),e=e.slice(0,t)+p+e.slice(t),t+=p.length}return r=!1,!0}}}function H0(n,e){let t=Math.max(0,Math.min(1,e));switch(n){case"linear":return t;case"ease-in":return t*t;case"ease-out":return 1-(1-t)*(1-t);case"ease-in-out":return t<.5?2*t*t:1-2*(1-t)*(1-t)}}var ts=["fall-apart","explode","disintegrate","incinerate","melt","fade","fly"];function F0(n){switch(n){case"off":return null;case"fast":return .5;case"normal":return 1;case"slow":return 2}}function j0(n){return n==="open"?"in":"out"}function X5(n,e=0){return n!=="random"?n:ts[mi(e,971,331)*ts.length|0]}var J5=["\u2593","\u2592","\u2591"],B0=["\u2593","\u2592","\u2591"],tu=class{kind;direction;durationMs;#e;#t;#i;#r;#o;#s;#n;constructor(e){this.#r=e.seed??0,this.kind=X5(e.kind,this.#r),this.direction=e.direction,this.durationMs=Math.max(1,e.durationMs),this.#i=e.snapshot,this.#e=e.snapshot.length;let t=0;for(let r of e.snapshot)t=Math.max(t,r.length);this.#t=t,this.#o=e.easing??"ease-in",this.#s={left:Math.max(0,Math.floor(e.overflow?.left??0)),right:Math.max(0,Math.floor(e.overflow?.right??0)),up:Math.max(0,Math.floor(e.overflow?.up??0)),down:Math.max(0,Math.floor(e.overflow?.down??0))},this.#n=e.flyTarget??{column:(this.#t-1)/2,row:(this.#e-1)/2}}frameAt(e){let t=Math.max(0,Math.min(1,e/this.durationMs)),r=H0(this.#o,t),o=this.direction==="in"?1-r:r,i=[];if(o<1)for(let a=0;a<this.#e;a+=1){let s=this.#i[a];for(let l=0;l<s.length;l+=1){let d=s[l];d!==" "&&this.#c(i,d,a,l,o)}}return{cells:i,progress:o,done:t>=1}}#a(e,t){return e>=-this.#s.left&&e<this.#t+this.#s.right&&t>=-this.#s.up&&t<this.#e+this.#s.down}#l(e,t){this.#a(t.column,t.row)&&e.push(t)}#c(e,t,r,o,i){let a=mi(this.#r,r,o);switch(this.kind){case"fade":{let s=i+(a-.5)*.08,l=s<.4?0:1+Math.floor((s-.4)/.2);if(l>=4)return;let d=l===0?t:J5[l-1];this.#l(e,{char:d,column:o,row:r,sourceRow:r,sourceColumn:o});return}case"disintegrate":{let s=(i-a*.7)/.3;if(s>=1)return;let l=s<=0?t:s<.5?"\u2592":"\u2591";this.#l(e,{char:l,column:o,row:r,sourceRow:r,sourceColumn:o});return}case"fall-apart":{let s=a*.45;if(i<=s){this.#l(e,{char:t,column:o,row:r,sourceRow:r,sourceColumn:o});return}let l=(i-s)/Math.max(.001,1-s),d=this.#e+this.#s.down-r+1,c=l*l*d,u=Math.round((mi(this.#r,o,r)-.5)*l*6);this.#l(e,{char:t,column:o+u,row:Math.floor(r+c),sourceRow:r,sourceColumn:o});return}case"explode":{let s=(this.#e-1)/2,l=(this.#t-1)/2,d=o-l,c=r-s,u=Math.max(.75,Math.hypot(d,c));d/=u,c/=u;let h=Math.max(this.#t+this.#s.left+this.#s.right,(this.#e+this.#s.up+this.#s.down)*2),f=(.5+a)*i*h*1.1;this.#l(e,{char:i>.7?"\xB7":t,column:Math.round(o+d*f),row:Math.round(r+c*f*.5),sourceRow:r,sourceColumn:o});return}case"melt":{let s=.7+mi(this.#r,7,o)*.5,l=this.#e+this.#s.down-r+1,d=Math.pow(i,1.4)*s*l;this.#l(e,{char:t,column:o,row:Math.floor(r+d),sourceRow:r,sourceColumn:o});return}case"incinerate":{let s=mi(this.#r,13,o)*3,l=this.#e-i*(this.#e+6)+s;if(r>l+2){if(a>.85){let d=Math.floor((i+a)*3);this.#l(e,{char:"\u2591",column:o,row:Math.floor(l)-d,sourceRow:r,sourceColumn:o,heat:.6})}return}if(r>l){let d=Math.min(B0.length-1,Math.floor((r-l)*1.5));this.#l(e,{char:B0[d],column:o,row:r,sourceRow:r,sourceColumn:o,heat:Math.max(.4,1-(r-l)/3)});return}this.#l(e,{char:t,column:o,row:r,sourceRow:r,sourceColumn:o});return}case"fly":{let s=a*.35,l=Math.max(0,Math.min(1,(i-s)/.65));if(l>=1)return;let d=l*l*(3-2*l);this.#l(e,{char:t,column:Math.round(o+(this.#n.column-o)*d),row:Math.round(r+(this.#n.row-r)*d),sourceRow:r,sourceColumn:o});return}}}};function G0(n){return new tu(n)}function mi(n,e,t){let r=(n|0)^e*374761393^t*668265263;return r=Math.imul(r^r>>>13,1274126177),r^=r>>>16,(r>>>0)/4294967296}var Z5={speed:"normal",kinds:{open:"fade",close:"disintegrate",minimize:"fade",maximize:"fade",restore:"fade"}},Q5={open:220,close:340,minimize:280,maximize:200,restore:280};function e4(n){return`surface.${n}`}var nu=class{#e;#t;#i;#r=0;#o=[];constructor(e={}){this.#e=e.settings??Z5,this.#t=e.motion,this.#i=e.seed??0}settings(){return this.#e}setSettings(e){this.#e=e}animating(){return this.#o.length>0}begin(e){let t=this.#e.kinds[e.transition];if(!t)return!1;let r=F0(this.#e.speed);if(r===null||e.snapshot.length===0)return!1;let o=Q5[e.transition]*r;if(this.#t){let i=this.#t.resolve(e4(e.transition));if(i.kind==="static")return!1;i.durationMs>0&&(o=i.durationMs*r)}return this.#r+=1,this.#o=this.#o.filter(i=>i.surfaceId!==e.surfaceId),this.#o.push({surfaceId:e.surfaceId,transition:e.transition,rect:e.rect,startedAt:e.now,animation:G0({snapshot:e.snapshot,kind:t,direction:e.direction??j0(e.transition),durationMs:o,seed:this.#i+this.#r*7919,overflow:e.overflow,flyTarget:e.flyTarget})}),!0}framesAt(e){if(this.#o.length===0)return[];let t=[],r=[];for(let o of this.#o){let i=o.animation.frameAt(e-o.startedAt);t.push({surfaceId:o.surfaceId,transition:o.transition,rect:o.rect,frame:i}),i.done||r.push(o)}return this.#o=r,t}cancelAll(){this.#o=[]}cancel(e){this.#o=this.#o.filter(t=>t.surfaceId!==e)}};function U0(n={}){return new nu(n)}var ou=["open","close","minimize","maximize","restore","raise","lower"],t4={speed:"normal",kinds:{open:"fade",close:"disintegrate",minimize:"fly",maximize:"fade",restore:"fly",raise:"fade",lower:"fade"}},rs=["off","fast","normal","slow"],pi=[...ts,"random"];function K0(n){let e=n;return{speed:rs.includes(e?.speed)?e.speed:"normal",kinds:Object.fromEntries(ou.map(t=>[t,pi.includes(e?.kinds?.[t])?e.kinds[t]:t4.kinds[t]]))}}function ru(n,e){return{rect:{...e},cells:Array.from({length:e.height},(t,r)=>Array.from({length:e.width},(o,i)=>n[e.row+r]?.[e.column+i]??{char:" "}))}}function q0(n,e,t){return e>=n.column&&e<n.column+n.width&&t>=n.row&&t<n.row+n.height}var ns=class{constructor(e=()=>!1){this.liveClient=e}#e=[];#t=K0(void 0);#i=U0({seed:39});#r=new Map;#o=new Map;#s=new Map;#n;#a;#l=[];#c={column:0,row:0,width:0,height:0};#d=()=>{};#h=0;#u=!0;settings(){return this.#t}setSettings(e){this.#t=K0(e),this.cancel()}cancel(){this.#i.cancelAll(),this.#o.clear(),this.#s.clear()}resize(){this.cancel(),this.#r.clear(),this.#l=[],this.#n=void 0}status(){return[...this.#o].map(([e,t])=>({id:e,transition:t.transition,incoming:t.incoming}))}hides(e){return this.#o.get(e)?.incoming??!1}beginFrame(e){this.#h=e.now,this.#c=e.bounds,this.#e=e.windows.filter(o=>this.liveClient(o.id)).map(o=>o.rect);for(let[o,i]of this.#o)this.#e.some(a=>Od(a,i.snapshot.rect))&&(this.#i.cancel(o),this.#o.delete(o));this.#d=e.anchor,this.#u=!e.reducedMotion&&this.#t.speed!=="off",this.#u||this.cancel();for(let o of this.#i.framesAt(e.now))o.frame.done&&this.#o.delete(o.surfaceId);let t=new Map(e.states.map(o=>[o.id,o.state])),r=e.windows.find(o=>o.active)?.id;if(this.#n&&this.#u){let o=new Set;for(let[i,a]of t){let s=this.#n.get(i)??"closed";if(a===s)continue;if(o.add(i),this.#i.cancel(i),this.#o.delete(i),this.#i.cancel(`lower:${i}`),this.#o.delete(`lower:${i}`),this.#s.delete(i),e.windows.some(d=>d.id===i)&&(s==="closed"||s==="minimized"))this.#s.set(i,s==="closed"?"open":"restore");else{let d=this.#r.get(i);if(!d||s==="closed"||s==="minimized")continue;let c=a==="closed"?"close":a==="minimized"?"minimize":"maximize";this.#p(i,c,d,!1)}}for(let i of e.windows){let a=this.#o.get(i.id);a?.incoming&&Object.keys(i.rect).some(s=>i.rect[s]!==a.snapshot.rect[s])&&(this.#i.cancel(i.id),this.#o.delete(i.id))}if(r&&!this.liveClient(r)&&!(this.#a&&this.liveClient(this.#a))&&r!==this.#a&&!o.has(r)&&!o.has(this.#a??"")&&!this.#o.has(r)){this.#i.cancel(`lower:${r}`),this.#o.delete(`lower:${r}`);let i=e.windows.find(a=>a.id===r);if(this.#p(r,"raise",ru(this.#l,i.rect),!1),this.#a&&!o.has(this.#a)&&!this.#o.has(this.#a)){let a=this.#r.get(this.#a);a&&this.#p(`lower:${this.#a}`,"lower",{rect:{...a.rect,height:1},cells:[a.cells[0]??[]]},!1,i.rect)}}}this.#n=t,this.#a=r}#p(e,t,r,o,i){if(this.liveClient(e)||this.#e.some(u=>Od(u,r.rect)))return;let a=t==="raise"?"open":t==="lower"?"close":t;this.#i.setSettings({speed:this.#t.speed,kinds:{[a]:this.#t.kinds[t]}});let s=r.rect,l=this.#c,d=this.#d(e);this.#i.begin({surfaceId:e,transition:a,rect:s,now:this.#h,snapshot:r.cells.map(u=>u.map(h=>h.char.length===1&&Ho(h.char)===1?h.char:" ").join("")),direction:o?"in":"out",overflow:{left:Math.max(0,s.column-l.column),right:Math.max(0,l.column+l.width-s.column-s.width),up:Math.max(0,s.row-l.row),down:Math.max(0,l.row+l.height-s.row-s.height)},flyTarget:d?{column:d.column+Math.floor(d.width/2)-s.column,row:d.row-s.row}:{column:2-s.column,row:-s.row}})&&this.#o.set(e,{snapshot:r,transition:t,incoming:o,exclude:i})}paintWindow(e,t,r){if(this.liveClient(t.id)){this.#s.delete(t.id),r();return}let o=this.#s.get(t.id),i=o||this.hides(t.id)?ru(e,t.rect):void 0;r();let a=ru(e,t.rect);if(this.#r.set(t.id,a),o&&(this.#s.delete(t.id),this.#p(t.id,o,a,!0)),i&&this.hides(t.id))for(let s=0;s<t.rect.height;s++){let l=e[t.rect.row+s];if(l)for(let d=0;d<t.rect.width;d++){let c=t.rect.column+d;c>=0&&c<l.length&&(l[c]=i.cells[s][d])}}}paintOverlays(e){this.#l=e.map(r=>r.slice());for(let r of this.#i.framesAt(this.#h)){let o=this.#o.get(r.surfaceId);if(o){for(let i of r.frame.cells){let a=r.rect.column+i.column,s=r.rect.row+i.row,l=e[s];if(!l||a<0||a>=l.length||!q0(this.#c,a,s)||o.exclude&&q0(o.exclude,a,s))continue;let d=o.snapshot.cells[i.sourceRow]?.[i.sourceColumn],c=d?.foreground;i.heat&&c&&(c=[Math.round(c[0]*(1-i.heat)+255*i.heat),Math.round(c[1]*(1-i.heat)+100*i.heat),Math.round(c[2]*(1-i.heat))]),l[a]={char:i.char,foreground:c,background:d?.background??l[a].background}}r.frame.done&&this.#o.delete(r.surfaceId)}}let t=new Set([...this.#n??[]].filter(([,r])=>r!=="closed").map(([r])=>r));for(let r of this.#r.keys())t.has(r)||this.#r.delete(r)}};function J0(n,e,t){if(!e||n===" "||n==="")return t;let r=n==="\u2591"?.25:n==="\u2592"?.5:n==="\u2593"?.75:n==="\u2588"?1:.55;return[Math.round(t[0]+(e[0]-t[0])*r),Math.round(t[1]+(e[1]-t[1])*r),Math.round(t[2]+(e[2]-t[2])*r)]}function au(n){return()=>n}var os=new Map,n4=4096;function iu(n){let e=n.codePointAt(0);if(e===void 0||e<128)return 1;let t=os.get(n);if(t!==void 0)return t;let r=Ue(n)>1?2:1;return os.size>=n4&&os.clear(),os.set(n,r),r}function is(n,e){let t=Math.max(0,Math.floor(e));if(t===0)return"";let r=0;for(let l of n)r+=iu(l);if(r<=t)return n;let o=t>3?"...":"",i=t-o.length,a="",s=0;for(let l of n){let d=iu(l);if(s+d>i)break;a+=l,s+=d}return a+o}function Y0(n,e,t,r){let o=Math.max(1,Math.floor(n)-r);return Math.max(1,Math.min(o,Math.min(t,Math.max(e,o))))}function r4(n,e,t,r){for(let o=0;o<e.height;o+=1)for(let i=0;i<e.width;i+=1){let a=e.column+i,s=e.row+o;n.write(a,s," ",{foreground:t,background:r(a,s)})}}function X0(n,e,t,r,o,i){let a=[...r];for(let s=0;s<a.length;s+=1)n.write(e+s,t,a[s],{foreground:o.foreground,background:i(e+s,t),bold:o.bold})}function o4(n,e,t,r,o,i){if(e.width<=0||e.height<=0)return;let a=e.column+e.width-1,s=e.row+e.height-1,l=(d,c,u)=>{n.cell(d,c,u,{foreground:r,background:o(d,c),bold:i})};for(let d=e.column+1;d<a;d+=1)l(d,e.row,t.top),l(d,s,t.bottom);for(let d=e.row+1;d<s;d+=1)l(e.column,d,t.left),l(a,d,t.right);l(e.column,e.row,t.topLeft),l(a,e.row,t.topRight),l(e.column,s,t.bottomLeft),l(a,s,t.bottomRight)}function Z0(n,e,t){n.fill(e.rect," ",t.surfaceFill),o4(n,e.rect,t.borderGlyphs,t.borderForeground,t.chromeGround,e.active),r4(n,e.titleBarRect,t.titleBarFillForeground,t.titleBarGround);let r=e.controls.reduce((i,a)=>Math.min(i,a.rect.column),e.titleBarRect.column+e.titleBarRect.width),o=Math.max(0,r-e.titleBarRect.column-2);X0(n,e.titleBarRect.column+1,e.titleBarRect.row,is(t.titleText,o),{foreground:t.titleForeground,bold:t.titleBold},t.titleBarGround);for(let i of e.controls)X0(n,i.rect.column,i.rect.row,is(i.text,i.rect.width),{foreground:t.controlForeground,bold:t.controlBold(i)},t.titleBarGround)}function i4(n,e,t,r){if(e.width<=0||e.height<=0)return;let o=e.column+e.width-1,i=e.row+e.height-1;for(let a=e.column;a<=o;a+=1)n.cell(a,e.row,t,r),n.cell(a,i,t,r);for(let a=e.row+1;a<i;a+=1)n.cell(e.column,a,t,r),n.cell(o,a,t,r)}function Q0(n,e,t,r){let o=Y0(t.width,r.minWidth??20,r.maxWidth??48,r.widthMargin??8),i=Math.min(e.items.length+2,Y0(t.height,3,t.height,r.heightMargin??4)),a={column:t.column+Math.max(0,Math.floor((t.width-o)/2)),row:t.row+Math.max(0,Math.floor((t.height-i)/2)),width:o,height:i};n.fill(a," ",r.colors.panelFill),i4(n,a,r.frameChar??"#",r.colors.frame);for(let s=0;s<Math.min(e.items.length,Math.max(0,i-2));s+=1){let l=e.items[s];n.write(a.column+1,a.row+1+s,is(`${l.selected?">":" "} ${l.title}`,o-2),l.selected?r.colors.selectedItem:r.colors.item)}return a}function as(n,e,t,r){n.fill(e," ",r.panelFill);let o=r.borderGlyphs;if(e.width>1&&e.height>1){let i=e.column+e.width-1,a=e.row+e.height-1;for(let s=e.column+1;s<i;s+=1)n.cell(s,e.row,o.top,r.borderStyle),n.cell(s,a,o.bottom,r.borderStyle);for(let s=e.row+1;s<a;s+=1)n.cell(e.column,s,o.left,r.borderStyle),n.cell(i,s,o.right,r.borderStyle);n.cell(e.column,e.row,o.topLeft,r.borderStyle),n.cell(i,e.row,o.topRight,r.borderStyle),n.cell(e.column,a,o.bottomLeft,r.borderStyle),n.cell(i,a,o.bottomRight,r.borderStyle)}for(let i of t){if(i.rect.row>=e.row+e.height-1)break;n.write(i.rect.column,i.rect.row,is(i.label,i.rect.width),{...r.rowStyle,foreground:i.danger?r.dangerForeground:r.rowStyle.foreground,bold:i.danger?!0:r.rowStyle.bold})}}function eg(n,e,t,r,o=0){let i=[],a=e.column,s=e.column+e.width-o;for(let l of t){let d=` ${l.label} `,c=[...d].reduce((u,h)=>u+iu(h),0);if(a+c>=s)break;n.write(a,e.row,d,l.active?r.activeTab:l.dimmed?r.dimmedTab:r.tab),i.push({id:l.id,rect:{column:a,row:e.row,width:c,height:1}}),a+=c+1}return i}var su=[{name:"unit01",label:"Unit-01 Signal",description:"Bio-electric violet, acid green, and warning orange inspired by late-night mecha command rooms.",dark:!0,bg:"#09040f",bgAlt:"#13091e",panel:"#20112f",panelAlt:"#2f1b44",surface:"#42255f",border:"#6e42a0",borderStrong:"#a66cff",text:"#f2ecff",textMuted:"#b7a4c8",textSoft:"#d9c8f0",accent:"#9cff4f",accentDeep:"#244d19",warm:"#ff9f3d",warmDeep:"#68340f",success:"#a9ff68",warning:"#ffb13d",danger:"#ff4f83",idle:"#867795",review:"#7ad7ff",subtitle:"#c5ffa8"},{name:"arcane",label:"Arcane Tide",description:"Deep navy, cyan glass, and brass highlights.",dark:!0,bg:"#081219",bgAlt:"#0d1a22",panel:"#10222c",panelAlt:"#152c37",surface:"#1a3644",border:"#335868",borderStrong:"#4d7a8f",text:"#f6f1e8",textMuted:"#9db3bf",textSoft:"#c7d8df",accent:"#7ad7ff",accentDeep:"#2d5364",warm:"#f4c86a",warmDeep:"#5d4722",success:"#9ad29a",warning:"#f0b35f",danger:"#ef7d6f",idle:"#7b8a96",review:"#b99adf",subtitle:"#b8d6c7"},{name:"forge",label:"Forge Ember",description:"Sooty charcoal with ember copper and furnace gold.",dark:!0,bg:"#160d0b",bgAlt:"#211310",panel:"#341d18",panelAlt:"#472823",surface:"#5d372f",border:"#885845",borderStrong:"#c28969",text:"#f8eadc",textMuted:"#bfad9d",textSoft:"#e3d2c4",accent:"#ff9f68",accentDeep:"#6e3b2a",warm:"#ffd166",warmDeep:"#7c5a20",success:"#a9d290",warning:"#f2b45f",danger:"#f08073",idle:"#8e7a70",review:"#d6a5f3",subtitle:"#e4c7a9"},{name:"grove",label:"Verdant Grove",description:"Pine green shadows with mint and moss accents.",dark:!0,bg:"#08130d",bgAlt:"#0d1d15",panel:"#153126",panelAlt:"#1d4434",surface:"#28614b",border:"#4c7c63",borderStrong:"#76ae8b",text:"#eef7ef",textMuted:"#a3baaa",textSoft:"#d0e3d3",accent:"#7be0bb",accentDeep:"#295948",warm:"#d7cb72",warmDeep:"#5f561f",success:"#9fda8d",warning:"#e9bf60",danger:"#ef8376",idle:"#778a7d",review:"#99bbef",subtitle:"#b9dcc2"},{name:"velvet",label:"Royal Velvet",description:"Plum lacquer, rose neon, and velvet gold.",dark:!0,bg:"#100914",bgAlt:"#1a0f21",panel:"#281534",panelAlt:"#381f47",surface:"#523066",border:"#78518f",borderStrong:"#ac7cc8",text:"#f7effa",textMuted:"#b8a6c4",textSoft:"#ddd0e6",accent:"#f694d8",accentDeep:"#643257",warm:"#ffd08b",warmDeep:"#6e4e1f",success:"#aad68c",warning:"#f3b66b",danger:"#f27d96",idle:"#8a7c95",review:"#9db7ff",subtitle:"#dfbfed"},{name:"section9",label:"Section 9 Ghost",description:"Cybernetic teal, optic amber, and cold blue surfaces inspired by networked city interfaces.",dark:!0,bg:"#031116",bgAlt:"#061b22",panel:"#0b2630",panelAlt:"#103743",surface:"#174a58",border:"#2a7482",borderStrong:"#49b6c7",text:"#e8fbff",textMuted:"#91b8c0",textSoft:"#c1e5eb",accent:"#42f5d7",accentDeep:"#124b45",warm:"#ffc857",warmDeep:"#5c4312",success:"#7dffa8",warning:"#ffca63",danger:"#ff6b7f",idle:"#6f9098",review:"#9db7ff",subtitle:"#a7fff1"},{name:"parchment",label:"Parchment Brass",description:"Warm ivory panels with brass, ink, and red-wax accents.",dark:!1,bg:"#f6efdf",bgAlt:"#efe5d2",panel:"#e6d9bf",panelAlt:"#dbcaa9",surface:"#d0b98f",border:"#9b7c4a",borderStrong:"#785d2e",text:"#2f2415",textMuted:"#756347",textSoft:"#4a3920",accent:"#2f7f9f",accentDeep:"#8dc5d8",warm:"#b98a2b",warmDeep:"#ecd49a",success:"#5d915b",warning:"#cb8a2c",danger:"#b15b52",idle:"#938165",review:"#7c70b8",subtitle:"#5d6f55"},{name:"seaglass",label:"Seaglass Ledger",description:"Cool paper whites with teal framing and slate typography.",dark:!1,bg:"#edf4f3",bgAlt:"#e0ece9",panel:"#d2e2dd",panelAlt:"#bfd4cd",surface:"#a8c4bc",border:"#5f8f86",borderStrong:"#426e67",text:"#1e3330",textMuted:"#5d7670",textSoft:"#31524d",accent:"#2a91a5",accentDeep:"#96d5de",warm:"#d29a34",warmDeep:"#edd8a7",success:"#4d8b65",warning:"#c9853a",danger:"#b45e63",idle:"#7a8e89",review:"#6f7fc1",subtitle:"#52706b"}],IC=su.map(n=>({id:`grwizard-${n.name}`,label:n.label,description:n.description,palette:a4(n),options:s4(n)}));function a4(n){return{id:`grwizard-${n.name}`,label:n.label,tokens:{foreground:ht({foreground:n.text}),muted:ht({foreground:n.textMuted,dim:!0}),accent:ht({foreground:n.accent,bold:!0}),success:ht({foreground:n.success,bold:!0}),warning:ht({foreground:n.warning,bold:!0}),danger:ht({foreground:n.danger,bold:!0}),surface:ht({foreground:n.text,background:n.panelAlt})}}}function s4(n){return ni({components:{Badge:{base:{base:"muted",focused:"accent",active:"success",disabled:"muted"},variants:{blocked:{base:"danger"},review:{base:ht({foreground:n.review,bold:!0})},idle:{base:ht({foreground:n.idle})}}},Button:{base:{base:"foreground",focused:"accent",active:"success",disabled:"muted"},variants:{danger:{base:"danger",focused:"warning"},warm:{base:"warning",active:"accent"}}},DataTable:{base:{base:"foreground",focused:"accent",active:"surface",disabled:"muted"}},Frame:{base:{base:ht({foreground:n.border,background:n.panel}),focused:ht({foreground:n.borderStrong,background:n.panelAlt,bold:!0}),active:ht({foreground:n.accent,background:n.surface,bold:!0}),disabled:"muted"}},Input:{base:{base:"foreground",focused:"accent",active:"warning",disabled:"muted"}},List:{base:{base:"foreground",focused:"accent",active:"surface",disabled:"muted"}},StatusBar:{base:{base:"surface",focused:"accent",active:"success",disabled:"muted"},variants:{warning:{base:"warning"},danger:{base:"danger"}}},Text:{base:{base:"foreground",focused:"accent",active:"success",disabled:"muted"},variants:{subtitle:{base:ht({foreground:n.subtitle,italic:!0})},soft:{base:ht({foreground:n.textSoft})}}}}})}function ht(n){return up({foreground:n.foreground?tg(n.foreground):void 0,background:n.background?tg(n.background):void 0,bold:n.bold,dim:n.dim,italic:n.italic})}function tg(n){let e=n.replace(/^#/,"");return[Number.parseInt(e.slice(0,2),16),Number.parseInt(e.slice(2,4),16),Number.parseInt(e.slice(4,6),16)]}var en={black:[3,4,8],charcoal:[24,26,34],darkBlue:[30,58,112],lightBlue:[205,234,255],darkPurple:[155,115,220],lightPurple:[220,168,255],hotPink:[255,105,180]},l4=["unit01","arcane","forge","grove","velvet","section9","parchment","seaglass"],d4=[{id:"midnight",label:"Midnight Ops",background:[8,12,20],surface:[14,21,34],surfaceStrong:[24,35,54],border:[73,101,134],text:[224,235,246],muted:[132,154,178],accent:[76,201,240],success:[73,209,125],warning:[244,190,72],danger:[244,104,110]},{id:"amber",label:"Amber Glass",background:[20,12,2],surface:[37,24,7],surfaceStrong:[58,39,10],border:[145,92,21],text:[255,220,145],muted:[188,137,67],accent:[255,174,45],success:[182,219,82],warning:[255,199,80],danger:[255,99,71]},{id:"matrix",label:"Matrix Phosphor",background:[1,13,6],surface:[3,25,12],surfaceStrong:[6,43,20],border:[28,112,55],text:[156,255,173],muted:[72,154,91],accent:[45,255,96],success:[113,255,132],warning:[224,241,95],danger:[255,91,91]},{id:"paper",label:"Paper Terminal",background:[234,229,215],surface:[248,245,235],surfaceStrong:[218,211,194],border:[104,98,87],text:[35,38,42],muted:[101,100,96],accent:[33,92,145],success:[42,116,65],warning:[157,101,11],danger:[165,48,48]}],Bn=[...d4,...su.map(c4),{id:"t2",label:"T2 Neural Steel",background:en.black,surface:en.charcoal,surfaceStrong:en.darkBlue,border:en.darkPurple,text:en.lightBlue,muted:en.lightPurple,accent:en.hotPink,success:en.lightBlue,warning:en.darkPurple,danger:en.lightPurple},{id:"templeos",label:"TempleOS",background:[255,255,255],surface:[255,255,255],surfaceStrong:[170,170,170],border:[0,0,170],text:[0,0,0],muted:[85,85,85],accent:[0,0,170],success:[0,170,0],warning:[170,85,0],danger:[170,0,0]},{id:"miami",label:"Miami Neon",background:[214,250,249],surface:[240,255,254],surfaceStrong:[176,222,255],border:[10,132,224],text:[10,45,70],muted:[23,122,84],accent:[198,24,118],success:[8,124,76],warning:[163,96,0],danger:[186,16,44]},{id:"nosferatu",label:"Nosferatu",background:[9,7,8],surface:[19,16,17],surfaceStrong:[35,29,31],border:[122,52,56],text:[232,224,222],muted:[110,97,97],accent:[225,58,64],success:[130,176,130],warning:[214,164,84],danger:[255,92,92]},{id:"sabbath",label:"Sabbath",background:[8,7,12],surface:[17,15,24],surfaceStrong:[31,27,44],border:[104,78,148],text:[228,223,238],muted:[104,96,122],accent:[178,110,255],success:[132,182,142],warning:[216,168,88],danger:[236,92,100]}];function c4(n){return{id:u4(n.name),label:n.label,background:tn(n.bg),surface:tn(n.surface),surfaceStrong:tn(n.panelAlt),border:tn(n.borderStrong),text:tn(n.text),muted:tn(n.textMuted),accent:tn(n.accent),success:tn(n.success),warning:tn(n.warning),danger:tn(n.danger)}}function u4(n){let e=l4.find(t=>t===n);if(!e)throw new TypeError(`Unsupported Workbench theme id: ${n}`);return e}function tn(n){let e=/^#([\da-f]{6})$/i.exec(n);if(!e)throw new TypeError(`Invalid Workbench theme color: ${n}`);let t=Number.parseInt(e[1],16);return[t>>>16&255,t>>>8&255,t&255]}function ng(n){return Bn.find(e=>e.id===n)??Bn[0]}function h4(n){let e=t=>{let r=t/255;return r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4)};return .2126*e(n[0])+.7152*e(n[1])+.0722*e(n[2])}function lu(n){return h4(n.accent)<.3?[255,255,255]:[0,0,0]}function f4(n,e,t){let r=n+.3963377774*e+.2158037573*t,o=n-.1055613458*e-.0638541728*t,i=n-.0894841775*e-1.291485548*t,a=r*r*r,s=o*o*o,l=i*i*i;return[4.0767416621*a-3.3077115913*s+.2309699292*l,-1.2684380046*a+2.6097574011*s-.3413193965*l,-.0041960863*a-.7034186147*s+1.707614701*l]}function du(n){let e=Math.max(0,Math.min(1,n));return e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055}function m4(n){return n.every(e=>e>=-1e-6&&e<=1+1e-6)}function og(n){let e=n.h*Math.PI/180;return f4(n.l,n.c*Math.cos(e),n.c*Math.sin(e))}function cu(n){let e=Math.max(0,Math.min(1,n/255));return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}function uu(n){let e=cu(n[0]),t=cu(n[1]),r=cu(n[2]),o=Math.cbrt(.4122214708*e+.5363325363*t+.0514459929*r),i=Math.cbrt(.2119034982*e+.6806995451*t+.1073969566*r),a=Math.cbrt(.0883024619*e+.2817188376*t+.6299787005*r),s=.2104542553*o+.793617785*i-.0040720468*a,l=1.9779984951*o-2.428592205*i+.4505937099*a,d=.0259040371*o+.7827717662*i-.808675766*a,c=Math.sqrt(l*l+d*d);if(c<1e-7)return{l:s,c:0,h:0};let u=Math.atan2(d,l)*180/Math.PI;return{l:s,c,h:u<0?u+360:u}}function rg(n){return m4(og(n))}function ig(n){let e=n;if(!rg(e)){let r=0,o=n.c;for(let i=0;i<32;i+=1){let a=(r+o)/2;rg({...n,c:a})?r=a:o=a}e={...n,c:r}}let t=og(e);return[Math.round(du(t[0])*255),Math.round(du(t[1])*255),Math.round(du(t[2])*255)]}function ag(n){return typeof n?.rasterizeOverlayCells=="function"}function sg(n){return typeof n?.pick=="function"}function ss(n,e,t){let r=Math.min(1,Math.max(0,t));return[Math.round(n[0]+(e[0]-n[0])*r),Math.round(n[1]+(e[1]-n[1])*r),Math.round(n[2]+(e[2]-n[2])*r)]}function p4(n,e,t){for(let r=n.floatingWindows.length-1;r>=0;r-=1){let o=n.floatingWindows[r];if(!ct(o.rect,e,t))continue;if(ct(o.clientRect,e,t))return;let i=o.controls??[];for(let u=i.length-1;u>=0;u-=1)if(ct(i[u].hitRect,e,t))return;let a=o.rect,s=e===a.column,l=e===a.column+a.width-1,d=t===a.row+a.height-1,c=t===a.row;return c&&s?"\u2921":c&&l?"\u2922":c?"\u2725":d&&s?"\u2922":d&&l?"\u2921":s||l?"\u2194":d?"\u2195":void 0}}function lg(n,e,t,r=!0){if(!n||!e)return;let o=r?p4(t,e.column,e.row)??"\u2588":"\u2588";return{column:e.column,row:e.row,glyph:o}}var DC=new TextEncoder;var cs=6,g4=8,b4=1800,dg=16.7,y4=48,w4=1.15,v4=.55,Et=2,fu=class{#e;#t;#i;#r;#o;#s;#n=[];#a=new Uint8Array;constructor(e={}){this.#e=hg(e.count??g4,1,24),this.#t=Math.max(0,ds(e.pointerLifetimeMs,b4)),this.#i=(e.seed??1297438770)>>>0}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#o={column:e.column,row:e.row,updatedAt:ds(t,performance.now())})}clearPointer(){this.#o=void 0}advance(e){let t=mu(e.bounds);if(!t)return!1;this.#l(t);let r=ds(e.now,performance.now()),o=this.#s===void 0?dg:Math.min(y4,Math.max(0,r-this.#s));if(this.#s=r,o<=0)return!1;let i=o/dg,a=this.#o&&r-this.#o.updatedAt<=this.#t?this.#o:void 0,s=e.obstacles??[];for(let l of this.#n){a&&x4(l,a,t,i);for(let c of s)k4(l,c,i);let d=Math.pow(.994,i);l.vx*=d,l.vy*=d,S4(l,.18),l.x+=l.vx*i,l.y+=l.vy*i,cg(l,t)}return!0}rasterize(e,t=cs){let r=mu(e);if(!r)return this.#a=new Uint8Array,this.#a;this.#l(r);let o=hg(t,2,16),i=r.width*r.height;this.#a.length!==i&&(this.#a=new Uint8Array(i));let a=0;for(let s=r.row;s<r.row+r.height;s+=1)for(let l=r.column;l<r.column+r.width;l+=1){let d=0;for(let u of this.#n){let h=l-u.x,f=(s-u.y)*Et;d+=u.strength/(h*h+f*f+.8)}let c=Math.min(1,Math.max(0,(d-w4)*v4));this.#a[a++]=c<=0?0:1+Math.min(o-2,Math.floor(Math.pow(c,1.35)*(o-1)))}return this.#a}inspect(){return{...this.#r?{bounds:{...this.#r}}:{},...this.#o?{pointer:{...this.#o}}:{},balls:this.#n.map(e=>({...e}))}}#l(e){let t=this.#r;if(t?.column===e.column&&t.row===e.row&&t.width===e.width&&t.height===e.height)return;if(this.#r={...e},this.#a=new Uint8Array(e.width*e.height),!t||this.#n.length===0){this.#n=Array.from({length:this.#e},()=>this.#c(e));return}let r=e.width/t.width,o=e.height/t.height,i=Math.min(r,o*Et),a=ug(e);for(let s of this.#n)s.x=e.column+(s.x-t.column)*r,s.y=e.row+(s.y-t.row)*o,s.radius=pu(s.radius*i,a.minimum,a.maximum),s.strength=s.radius*s.radius,s.vx*=r,s.vy*=o,cg(s,e)}#c(e){let t=ug(e),r=t.minimum+this.#d()*(t.maximum-t.minimum),o=.035+this.#d()*.065,i=this.#d()*Math.PI*2;return{x:e.column+this.#d()*Math.max(0,e.width-1),y:e.row+this.#d()*Math.max(0,e.height-1),radius:r,strength:r*r,vx:Math.cos(i)*o,vy:Math.sin(i)*o/Et}}#d(){return this.#i=Math.imul(this.#i,1664525)+1013904223>>>0,this.#i/4294967296}};function x4(n,e,t,r){let o=e.column-n.x,i=(e.row-n.y)*Et,a=Math.hypot(o,i)+.001,s=Math.max(4,Math.min(t.width,t.height*Et)*.7),d=.012*Math.max(0,1-a/s)*r;n.vx+=o/a*d,n.vy+=i/a*d/Et}function k4(n,e,t){let r=mu(e);if(!r)return;let o=Math.max(1,n.radius*.7),i=Math.max(1,o/Et),a=r.column-o,s=r.column+r.width-1+o,l=r.row-i,d=r.row+r.height-1+i;if(n.x<a||n.x>s||n.y<l||n.y>d)return;let c=[{distance:n.x-a,dx:-1,dy:0},{distance:s-n.x,dx:1,dy:0},{distance:(n.y-l)*Et,dx:0,dy:-1},{distance:(d-n.y)*Et,dx:0,dy:1}],u=c[0];for(let m=1;m<c.length;m+=1)c[m].distance<u.distance&&(u=c[m]);let h=Math.max(1,n.radius*.7),f=Math.max(.15,1-Math.max(0,u.distance)/h),p=.04*f*f*t;n.vx+=u.dx*p,n.vy+=u.dy*p/Et}function S4(n,e){let t=Math.hypot(n.vx,n.vy*Et);if(t<=e)return;let r=e/t;n.vx*=r,n.vy*=r}function cg(n,e){let t=e.column+e.width-1,r=e.row+e.height-1;(n.x<e.column||n.x>t)&&(n.vx*=-1,n.x=pu(n.x,e.column,t)),(n.y<e.row||n.y>r)&&(n.vy*=-1,n.y=pu(n.y,e.row,r))}function ug(n){let e=Math.max(2,Math.min(n.width,n.height*Et));return{minimum:Math.max(2,e*.08),maximum:Math.max(3,e*.2)}}function mu(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function hg(n,e,t){return Math.max(e,Math.min(t,Math.floor(ds(n,e))))}function pu(n,e,t){return Math.max(e,Math.min(t,n))}function ds(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}function ls(n){return .2126*n[0]+.7152*n[1]+.0722*n[2]}function hu(n){return Math.max(n[0],n[1],n[2])-Math.min(n[0],n[1],n[2])}function fg(n){let[e,t,r]=n,o=Math.max(e,t,r),i=Math.min(e,t,r),a=o-i;if(a===0)return;let s;return o===e?s=(t-r)/a%6:o===t?s=(r-e)/a+2:s=(e-t)/a+4,s*=60,s<0?s+360:s}function M4(n,e){let t=Math.abs(n-e)%360;return t>180?360-t:t}function T4(n,e){let t=n[0]-e[0],r=n[1]-e[1],o=n[2]-e[2];return t*t+r*r+o*o}function R4(n){let e=[n.accent,n.success,n.warning,n.danger,n.text,n.muted,n.surfaceStrong,n.border],t=e[0];for(let a of e)hu(a)>hu(t)&&(t=a);let r=fg(t);if(r===void 0){let a=[n.text,n.surfaceStrong],s=-1;for(let l=0;l<e.length;l+=1)for(let d=l+1;d<e.length;d+=1){let c=T4(e[l],e[d]);c>s&&(s=c,a=[e[l],e[d]])}return ls(a[0])>=ls(a[1])?a:[a[1],a[0]]}let o=t,i=-1;for(let a of e){let s=fg(a);if(s===void 0)continue;let l=M4(r,s)/180*hu(a);l>i&&(i=l,o=a)}return o===t&&(o=n.surfaceStrong),ls(t)>=ls(o)?[t,o]:[o,t]}function _4(n){let[e,t]=R4(n),r=cs-1;return Array.from({length:cs},(o,i)=>{if(i===0)return n.background;let a=r<=1?1:(i-1)/(r-1);return ss(t,e,a)})}var us=class{#e=new fu;#t;#i;setPointer(e,t){this.#e.setPointer(e,t)}clearPointer(){this.#e.clearPointer()}advance(e){return this.#e.advance(e)}rasterizeCells(e,t){(this.#i!==t.id||!this.#t)&&(this.#t=_4(t),this.#i=t.id);let r=this.#t,o=this.#e.rasterize(e,cs),i=[];for(let a=0;a<e.height;a+=1){let s=[];for(let l=0;l<e.width;l+=1){let d=o[a*e.width+l]??0;s.push(d===0?void 0:{char:"\u2588",foreground:r[d]})}i.push(s)}return i}};function P(n,e,t){return ss(n,e,t)}var mg=16.7,C4=48,E4=1500,I4=6,A4=2,pg=4,gg=18,O4=.35,bg=550,yg=.7,L4=1.4,wg=.12,P4=.35,vg=2,xg=2,N4=4,hs=[".",",","'",'"',"`","~"],W4=Object.freeze([Object.freeze({dx:0,peak:2.8,delay:0}),Object.freeze({dx:-1,peak:2.1,delay:.06}),Object.freeze({dx:1,peak:2.1,delay:.06}),Object.freeze({dx:-2,peak:1.3,delay:.13}),Object.freeze({dx:2,peak:1.3,delay:.13}),Object.freeze({dx:-3,peak:.6,delay:.2}),Object.freeze({dx:3,peak:.6,delay:.2})]),gi=Object.freeze([Object.freeze({weight:.28,low:.09,high:.24}),Object.freeze({weight:.27,low:.3,high:.62}),Object.freeze({weight:.45,low:.95,high:1.9})]),V4=1.1,D4=70,Fn=Array.from("\uFF8A\uFF90\uFF8B\uFF70\uFF73\uFF7C\uFF85\uFF93\uFF86\uFF7B\uFF9C\uFF82\uFF75\uFF98\uFF71\uFF8E\uFF83\uFF8F\uFF79\uFF92\uFF74\uFF76\uFF77\uFF91\uFF95\uFF97\uFF7E\uFF88\uFF7D\uFF80\uFF870123456789:\uFF65=*+-"),ms=class{#e;#t;#i;#r;#o;#s=[];#n=[];#a=[];#l;#c=[];#d=new Uint8Array;#h=[];constructor(e={}){this.#e=(e.seed??1296127058)>>>0,this.#t=z4(gu(e.density,1),.1,4)}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#r={column:e.column,row:e.row,updatedAt:gu(t,performance.now())})}clearPointer(){this.#r=void 0}advance(e){let t=fs(e.bounds);if(!t)return!1;this.#u(t);let r=gu(e.now,performance.now()),o=this.#o===void 0?mg:Math.min(C4,Math.max(0,r-this.#o));if(this.#o=r,o<=0)return!1;let i=o/mg,a=this.#r&&r-this.#r.updatedAt<=E4?this.#r:void 0,s=a?a.column-t.column:void 0,l=e.activeObstacle?fs(e.activeObstacle):void 0;if(l?this.#l={column:l.column-t.column,row:l.row-t.row,width:l.width,height:l.height}:this.#l=void 0,this.#c=[],e.obstacles)for(let m of e.obstacles){let g=fs(m);g&&(l&&g.column===l.column&&g.row===l.row&&g.width===l.width&&g.height===l.height||this.#c.push({column:g.column-t.column,row:g.row-t.row,width:g.width,height:g.height}))}let d=!1,c=this.#l,u=this.#c;for(let m of this.#s){let g=s!==void 0&&Math.abs(m.column-s)<=I4;m.boost=g?1:Math.max(0,m.boost-.12*i);let y=Math.floor(m.y),b=g?A4:1;for(let k of u)if(m.column>=k.column&&m.column<k.column+k.width&&y>=k.row&&y<k.row+k.height){b*=O4;break}let w=y;m.y+=m.speed*b*i;let x=Math.floor(m.y);x!==w&&(d=!0),c&&x!==w&&w<c.row&&x>=c.row&&m.column>=c.column&&m.column<c.column+c.width&&(this.#f(m.column,c.row,r),this.#g(m.column,c),d=!0),m.y-m.tail>t.height&&(this.#m(m,t),d=!0)}for(let m of this.#a)if(!m.falling)m.x+=m.direction*m.hSpeed*i,(m.direction<0?m.x<=m.edgeColumn:m.x>=m.edgeColumn)&&(m.x=m.edgeColumn,m.y=m.windowTop,m.falling=!0),d=!0;else{let g=Math.floor(m.y);m.y+=m.vSpeed*i,Math.floor(m.y)!==g&&(d=!0)}let h=this.#a.length;this.#a=this.#a.filter(m=>m.y-m.tail<m.windowBottom),this.#a.length!==h&&(d=!0),this.#a.length>0&&(d=!0);let f=this.#n.length;this.#n=this.#n.filter(m=>r-m.spawnedAt<bg),this.#n.length!==f&&(d=!0),this.#n.length>0&&(d=!0);let p=Math.max(1,Math.floor(t.width*t.height/D4));for(let m=0;m<p;m+=1){let g=Math.floor(this.#x()*this.#d.length);this.#d[g]=Math.floor(this.#x()*Fn.length),d=!0}return d}rasterizeCells(e,t){let r=fs(e);if(!r)return this.#h=[],this.#h;this.#u(r);let{width:o,height:i}=r;this.#p(o,i);let a=P(t.text,t.accent,.35),s=this.#l;for(let c of this.#s){let{column:u}=c;if(u<0||u>=o)continue;let h=s!==void 0&&u>=s.column&&u<s.column+s.width,f=Math.floor(c.y);for(let p=0;p<=c.tail;p+=1){let m=f-p;if(m<0||m>=i||h&&m>=s.row)continue;let g=Fn[this.#d[m*o+u]??0]??Fn[0];if(p===0){let b=c.boost>0?P(a,t.text,.45*c.boost):a;this.#h[m][u]={char:g,foreground:b,bold:!0};continue}let y=(.18+.8*(p/c.tail))*(1-.3*c.boost);this.#h[m][u]={char:g,foreground:P(t.accent,t.background,y)}}}let l=this.#o??0;for(let c of this.#n){let u=(l-c.spawnedAt)/bg;if(!(u>=1))for(let h of W4){let f=(u-h.delay)/(1-h.delay);if(f<0||f>1)continue;let p=h.peak*Math.sin(Math.PI*f),m=c.row-1-Math.round(p);if(m<0||m>=i)continue;let g=c.column+h.dx;if(g<0||g>=o)continue;let y=Math.min(hs.length-1,Math.floor(p/h.peak*(hs.length-.01))),b=hs[y]??hs[0],w=Math.sin(Math.PI*f),x=1-Math.abs(h.dx)*.12,k=w*x;if(k<=.05)continue;let C=P(t.background,a,k);this.#h[m][g]={char:b,foreground:C,bold:k>.6}}}let d=P(t.accent,t.background,.25);for(let c of this.#a)if(c.falling){let u=c.edgeColumn;if(u<0||u>=o)continue;let h=Math.floor(c.y);for(let f=0;f<=c.tail;f+=1){let p=h-f;if(p<0||p>=i)continue;let m=f/(c.tail+1),g=P(d,t.background,m),y=Fn[this.#d[p*o+u]??0]??Fn[0];this.#h[p][u]={char:y,foreground:g,bold:f===0}}}else{let u=Math.floor(c.x),h=c.windowTop-1;if(h<0||h>=i)continue;for(let f=0;f<=vg;f+=1){let p=u-c.direction*f;if(p<0||p>=o)continue;let m=f/(vg+1),g=P(d,t.background,m),y=Fn[this.#d[h*o+p]??0]??Fn[0];this.#h[h][p]={char:y,foreground:g,bold:f===0}}}return this.#h}inspect(){return{...this.#i?{bounds:{...this.#i}}:{},drops:this.#s.map(e=>({...e}))}}#u(e){let t=this.#i;if(t?.width===e.width&&t.height===e.height){this.#i={...e};return}this.#i={...e};let r=e.width*e.height;this.#d=new Uint8Array(r);for(let i=0;i<r;i+=1)this.#d[i]=Math.floor(this.#x()*Fn.length);let o=Math.max(1,Math.round(e.width*V4*this.#t));this.#s=Array.from({length:o},()=>this.#b(e))}#p(e,t){if(this.#h.length===t&&(this.#h[0]?.length??-1)===e){for(let r of this.#h)r.fill(void 0);return}this.#h=Array.from({length:t},()=>new Array(e).fill(void 0))}#b(e){let t=this.#w();return{column:Math.floor(this.#x()*e.width),y:-this.#x()*e.height,speed:t,tail:this.#v(t),boost:0}}#f(e,t,r){this.#n.push({column:e,row:t,spawnedAt:r})}#g(e,t){let r=e-t.column,o=t.column+t.width-1-e,i=r<o||r===o&&this.#x()<.5,a=i?-1:1,s=i?t.column-1:t.column+t.width;this.#a.push({x:e,y:t.row,direction:a,hSpeed:yg+this.#x()*(L4-yg),vSpeed:wg+this.#x()*(P4-wg),falling:!1,edgeColumn:s,windowTop:t.row,windowBottom:t.row+t.height,tail:Math.round(xg+this.#x()*(N4-xg))})}#m(e,t){e.column=Math.floor(this.#x()*t.width),e.y=-(1+this.#x()*t.height*.6),e.speed=this.#w(),e.tail=this.#v(e.speed),e.boost=0}#w(){let e=this.#x();for(let r of gi){if(e<r.weight)return r.low+this.#x()*(r.high-r.low);e-=r.weight}let t=gi[gi.length-1];return t.low+this.#x()*(t.high-t.low)}#v(e){let t=gg-pg,r=Math.min(1,e/gi[gi.length-1].high),o=pg+t*r*.6;return Math.min(gg,Math.round(o+this.#x()*t*.4))}#x(){return this.#e=Math.imul(this.#e,1664525)+1013904223>>>0,this.#e/4294967296}};function fs(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function z4(n,e,t){return Math.max(e,Math.min(t,n))}function gu(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var kg=16.7,$4=48,H4=1500,B4=6,F4=2,Sg=3,Mg=14,j4=.05,G4=.35,wn=Object.freeze([Object.freeze({weight:.28,low:.09,high:.24}),Object.freeze({weight:.27,low:.3,high:.62}),Object.freeze({weight:.45,low:.95,high:1.9})]),bu=wn[wn.length-1].high,Tg=Object.freeze([Object.freeze({head:"\u2577",body:"\u250A",tip:"."}),Object.freeze({head:"\u2502",body:"\u2506",tip:"'"}),Object.freeze({head:"\u2503",body:"\u2502",tip:"\u2575"})]),U4=.55,yu=[80,140,220],Rg=550,ps=[".",",","'",'"',"`","~"],K4=Object.freeze([Object.freeze({dx:0,peak:2.8,delay:0}),Object.freeze({dx:-1,peak:2.1,delay:.06}),Object.freeze({dx:1,peak:2.1,delay:.06}),Object.freeze({dx:-2,peak:1.3,delay:.13}),Object.freeze({dx:2,peak:1.3,delay:.13}),Object.freeze({dx:-3,peak:.6,delay:.2}),Object.freeze({dx:3,peak:.6,delay:.2})]),_g=.25,Cg=.08,q4=.55,Y4=.26,Eg=.35,X4=.35,J4=8,Z4=.95,Q4=3,e3=.14,Ig=.5,Ag=.9,wr=1,gs=.02,$g=1,t3=.01,yr=.004,Og=.03,wu=["\u2581","\u2582","\u2583","\u2584","\u2585","\u2586","\u2587","\u2588"],Lg="\u2593",n3="\u2588",bs=10,r3=9,o3=[96,170,235],i3=[20,54,108],a3=.7,s3=.018,l3=.3,ys=.9,vu=3,d3=3,c3=.1,ws=1,Pg=["\u25D0","\u25D3","\u25D1","\u25D2"],u3="\u25A3",xs=class{#e;#t;#i;#r;#o;#s=0;#n=[];#a=[];#l=[];#c=[];#d=0;#h=0;#u=new Float32Array(0);#p=new Float32Array(0);#b=new Float32Array(0);#f=new Uint8Array(0);#g=new Float32Array(0);#m=new Float32Array(0);#w=0;#v=!1;#x=0;#y=[];#P=[];#S=[];constructor(e={}){this.#e=(e.seed??1380010318)>>>0,this.#t=vr(xu(e.density,1),.1,4)}get drainOpen(){return this.#v}get waterVolume(){return this.#w}get drainedVolume(){return this.#x}waterAt(e,t){return e<0||e>=this.#d||t<0||t>=this.#h?0:this.#u[t*this.#d+e]??0}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#r={column:e.column,row:e.row,updatedAt:xu(t,performance.now())})}clearPointer(){this.#r=void 0}pick(e,t,r=performance.now()){return this.#A(e,t)?(this.#v=!this.#v,!0):!1}picksOverWindows(e,t){return this.#A(e,t)}advance(e){let t=vs(e.bounds);if(!t)return!1;this.#j(t);let r=xu(e.now,performance.now()),o=this.#o===void 0?kg:Math.min($4,Math.max(0,r-this.#o));if(this.#o=r,o<=0)return!1;let i=o/kg;this.#s+=1;let a=this.#r&&r-this.#r.updatedAt<=H4?this.#r:void 0,s=a?a.column-t.column:void 0,l=e.activeObstacle?this.#k(e.activeObstacle,t):void 0;this.#l=[];for(let f of e.obstacles??[]){let p=this.#k(f,t);!p||l&&zg(p,l)||this.#l.push(p)}let d=[];for(let f of e.solidObstacles??e.obstacles??[]){let p=this.#k(f,t);p&&d.push(p)}l&&!d.some(f=>zg(f,l))&&d.push(l),this.#R(d);let c=!1;for(let f of this.#n)this.#_(f,t,s,i,r)&&(c=!0);for(let f=0;f<J4;f+=1)this.#O(),this.#D(),this.#N(),this.#F();let u=this.#w;this.#W(),this.#re(),(this.#w>0||u>0)&&(c=!0);let h=this.#c.length;return this.#c=this.#c.filter(f=>r-f.spawnedAt<Rg),(this.#c.length!==h||this.#c.length>0)&&(c=!0),this.#v&&(c=!0),c}rasterizeCells(e,t){let r=vs(e);if(!r)return this.#a=[],this.#a;this.#j(r);let{width:o,height:i}=r;this.#B(o,i);let a=P(P(t.text,yu,.45),t.accent,.2),s=P(t.accent,yu,.5);for(let l of this.#n){let{column:d}=l;if(d<0||d>=o)continue;let c=Tg[l.streak]??Tg[0],u=Math.floor(l.y),h=Math.max(1,Math.round(l.tail*U4));for(let f=0;f<=l.tail;f+=1){let p=u-f;if(p<0||p>=i)continue;if(f===0){let g=l.boost>0?P(a,t.text,.45*l.boost):a;this.#a[p][d]={char:c.head,foreground:g,bold:!0};continue}let m=(.18+.8*(f/l.tail))*(1-.3*l.boost);this.#a[p][d]={char:f<=h?c.body:c.tip,foreground:P(s,t.background,m)}}}return this.#a}rasterizeOverlayCells(e,t){this.#P.length=0;let r=vs(e);if(!r)return this.#P;let{width:o,height:i}=r;if(o!==this.#d||i!==this.#h)return this.#P;let a=P(P(t.text,yu,.45),t.accent,.2);this.#Q(t);let s=this.#o??0;for(let d of this.#c){let c=(s-d.spawnedAt)/Rg;if(!(c>=1))for(let u of K4){let h=(c-u.delay)/(1-u.delay);if(h<0||h>1)continue;let f=u.peak*d.scale,p=f*Math.sin(Math.PI*h),m=d.row-1-Math.round(p);if(m<0||m>=i)continue;let g=d.column+u.dx;if(g<0||g>=o)continue;let y=Math.min(ps.length-1,Math.floor(p/Math.max(.1,f)*(ps.length-.01))),b=ps[y]??ps[0],w=Math.sin(Math.PI*h),x=1-Math.abs(u.dx)*.12,k=w*x;k<=.05||this.#f[m*o+g]||this.#H(g,m,b,P(t.background,a,k),k>.6)}}if(this.#w>0)for(let d=0;d<o;d+=1){let c=0;for(let u=0;u<i;u+=1){let h=u*o+d;if(this.#f[h]){c=0;continue}let f=this.#u[h];if(f<Og){c=0;continue}let p=this.#S[Math.min(bs-1,Math.round(c/r3*(bs-1)))];if(c>0){this.#H(d,u,c===1?Lg:n3,p,!1),c+=1;continue}let m=f+this.#g[d];m<Og||(m>1&&u>0&&!this.#f[h-o]?(this.#H(d,u,Lg,p,!1),this.#H(d,u-1,Wg(m-1),this.#S[0],!1)):this.#H(d,u,Wg(m),p,!1),c+=1)}}let l=this.#I();if(l!==void 0){let d=i-1,c=Pg[this.#s%Pg.length],u=P(t.border,t.background,.15),h=this.#v?t.warning:P(t.muted,t.text,.2);for(let f=-ws;f<=ws;f+=1){let p=l+f;if(p<0||p>=o)continue;let m=f===0?this.#v?c:u3:f<0?"[":"]";this.#H(p,d,m,f===0?h:u,f===0)}}return this.#P}#I(){if(!(this.#d<2*ws+1||this.#h<1))return Math.floor(this.#d/2)}#A(e,t){let r=this.#i,o=this.#I();if(!r||o===void 0)return!1;let i=Math.floor(e-r.column);return Math.floor(t-r.row)===this.#h-1&&Math.abs(i-o)<=ws}#k(e,t){let r=vs(e);if(r)return{column:r.column-t.column,row:r.row-t.row,width:r.width,height:r.height}}#_(e,t,r,o,i){let a=r!==void 0&&Math.abs(e.column-r)<=B4;e.boost=a?1:Math.max(0,e.boost-.12*o);let s=Math.floor(e.y),l=a?F4:1;for(let h of this.#l)if(e.column>=h.column&&e.column<h.column+h.width&&s>=h.row&&s<h.row+h.height){l*=G4;break}e.y+=e.speed*l*o;let d=Math.floor(e.y),c=d!==s,u=Y4*(.4+.6*Math.min(1,e.speed/bu));for(let h=Math.max(0,s+1);h<=d;h+=1){if(h>=this.#h)return this.#T(e,this.#h-1,u,i),this.#ee(e,t),!0;let f=h*this.#d+e.column;if(this.#f[f]){h>0&&!this.#f[f-this.#d]&&(this.#$(e.column,h-1,u*Eg),this.#C(e,h-1,i,Eg),c=!0);continue}if(this.#u[f]>=X4)return this.#T(e,h,u,i),this.#ee(e,t),!0}return e.y-e.tail>t.height&&(this.#ee(e,t),c=!0),c}#T(e,t,r,o){this.#$(e.column,t,r),this.#C(e,t,o,1)}#C(e,t,r,o){let i=Math.min(1,e.speed/bu);this.#te(e.column,l3*(.35+.65*i)*o);let a=(Cg+(q4-Cg)*i)*o;if(this.#z()>=a)return;let s=_g+(1-_g)*i;this.#c.push({column:e.column,row:t,spawnedAt:r,scale:s*o})}#$(e,t,r){if(e<0||e>=this.#d||t<0||t>=this.#h)return;let o=t*this.#d+e;this.#f[o]||(this.#u[o]=this.#u[o]+r,this.#w+=r)}#R(e){let t=this.#d,r=this.#h,o=this.#f;o.fill(0);for(let i of e){let a=Math.max(0,i.row),s=Math.min(r,i.row+i.height),l=Math.max(0,i.column),d=Math.min(t,i.column+i.width);for(let c=a;c<s;c+=1)o.fill(1,c*t+l,c*t+d)}for(let i=r-1;i>=0;i-=1)for(let a=0;a<t;a+=1){let s=i*t+a;if(!o[s])continue;let l=this.#u[s];if(l<=0)continue;this.#u[s]=0;let d=i-1;for(;d>=0&&o[d*t+a];)d-=1;d>=0?this.#u[d*t+a]=this.#u[d*t+a]+l:this.#w-=l}}#O(){let e=this.#d,t=this.#h,r=this.#u,o=this.#p,i=this.#f;o.set(r);for(let a=t-1;a>=0;a-=1)for(let s=0;s<e;s+=1){let l=a*e+s;if(i[l])continue;let d=r[l];if(!(d<=yr)){if(a+1<t){let c=l+e;if(!i[c]){let u=Vg(Ng(d+r[c])-r[c],d);u>0&&(o[l]=o[l]-u,o[c]=o[c]+u,d-=u)}}if(!(d<=yr)){if(s>0&&!i[l-1]){let c=Dg(d-r[l-1],d);c>0&&(o[l]=o[l]-c,o[l-1]=o[l-1]+c,d-=c)}if(!(d<=yr)){if(s+1<e&&!i[l+1]){let c=Dg(d-r[l+1],d);c>0&&(o[l]=o[l]-c,o[l+1]=o[l+1]+c,d-=c)}if(!(d<=yr)&&a>0){let c=l-e;if(!i[c]){let u=Vg(d-Ng(d+r[c]),d);u>0&&(o[l]=o[l]-u,o[c]=o[c]+u)}}}}}}this.#u=o,this.#p=r}#D(){let e=this.#d,t=this.#h,r=this.#u,o=this.#p,i=this.#b,a=this.#f;for(let s=0;s<e;s+=1){let l=0;for(let d=0;d<t;d+=1){let c=d*e+s,u=r[c];if(a[c]||u<=yr){l=0,i[c]=0;continue}i[c]=l,l+=u}}o.set(r);for(let s=0;s<t;s+=1)for(let l=0;l+1<e;l+=1){let d=s*e+l,c=d+1;if(a[d]||a[c])continue;let u=r[d],h=r[c];if(u<Ag||h<Ag)continue;let f=i[d]-i[c];if(f===0)continue;let p=vr(f*e3,-Ig,Ig),m=p>0?Math.min(p,u):-Math.min(-p,h);o[d]=o[d]-m,o[c]=o[c]+m}this.#u=o,this.#p=r}#N(){if(!this.#v)return;let e=this.#I();if(e===void 0)return;let t=this.#d,r=this.#h,o=this.#u,i=this.#f;for(let a=0;a<r;a+=1){let s=a*t;for(let l=e-1;l>=0;l-=1)this.#M(s+l,s+l+1,o,i);for(let l=e+1;l<t;l+=1)this.#M(s+l,s+l-1,o,i)}}#M(e,t,r,o){if(o[e]||o[t])return;let i=r[e];if(i<=yr)return;let a=wr-r[t];if(a<=0)return;let s=Math.min(i*c3,a);r[e]=i-s,r[t]=r[t]+s}#F(){if(!this.#v)return;let e=this.#I();if(e===void 0)return;let t=this.#d,r=this.#h;for(let o=-vu;o<=vu;o+=1){let i=e+o;if(i<0||i>=t)continue;let a=r-1;for(;a>=0&&this.#f[a*t+i];)a-=1;if(a<0)continue;let s=a*t+i,l=this.#u[s];if(l<=0)continue;let d=d3*(1-Math.abs(o)/(vu+1)),c=Math.min(l,d);this.#u[s]=l-c,this.#x+=c}}#re(){let e=this.#d,t=this.#g,r=this.#m;for(let o=0;o<e;o+=1){let i=t[o],a=t[o>0?o-1:0],s=t[o+1<e?o+1:e-1],l=(2*i-r[o]+a3*(a-2*i+s))*(1-s3);r[o]=vr(l,-ys,ys)}this.#g=r,this.#m=t}#te(e,t){this.#Y(e,t*.6),this.#Y(e-1,t*.2),this.#Y(e+1,t*.2)}#Y(e,t){e<0||e>=this.#d||(this.#g[e]=vr(this.#g[e]-t,-ys,ys))}#W(){let e=this.#u,t=0;for(let r=0;r<e.length;r+=1){let o=e[r];if(o<=yr){o!==0&&(e[r]=0);continue}t+=o}this.#w=t}#j(e){let t=this.#i;if(t?.width===e.width&&t.height===e.height){this.#i={...e};return}this.#i={...e},this.#d=e.width,this.#h=e.height;let r=e.width*e.height;this.#u=new Float32Array(r),this.#p=new Float32Array(r),this.#b=new Float32Array(r),this.#f=new Uint8Array(r),this.#g=new Float32Array(e.width),this.#m=new Float32Array(e.width),this.#w=0,this.#c=[];let o=Math.max(1,Math.round(r*j4*this.#t));this.#n=Array.from({length:o},()=>this.#oe(e))}#B(e,t){if(this.#a.length===t&&(this.#a[0]?.length??-1)===e){for(let r of this.#a)r.fill(void 0);return}this.#a=Array.from({length:t},()=>new Array(e).fill(void 0))}#Q(e){let t=P(o3,e.accent,.25),r=P(i3,e.background,.35);this.#S.length=0;for(let o=0;o<bs;o+=1)this.#S.push(P(t,r,o/(bs-1)))}#H(e,t,r,o,i){let a=this.#P.length,s=this.#y[a];if(!s){s={column:e,row:t,cell:{char:r,foreground:o,bold:i}},this.#y[a]=s,this.#P.push(s);return}s.column=e,s.row=t,s.cell.char=r,s.cell.foreground=o,s.cell.bold=i,this.#P.push(s)}#oe(e){let t=this.#V(),r=this.#X(t);return{column:Math.floor(this.#z()*e.width),y:-this.#z()*e.height,speed:r,streak:t,tail:this.#L(r),boost:0}}#ee(e,t){e.column=Math.floor(this.#z()*t.width),e.y=-(1+this.#z()*t.height*.6),e.streak=this.#V(),e.speed=this.#X(e.streak),e.tail=this.#L(e.speed),e.boost=0}#V(){let e=this.#z();for(let t=0;t<wn.length;t+=1){if(e<wn[t].weight)return t;e-=wn[t].weight}return wn.length-1}#X(e){let t=wn[e]??wn[wn.length-1];return t.low+this.#z()*(t.high-t.low)}#L(e){let t=Mg-Sg,r=Math.min(1,e/bu),o=Sg+t*r*.6;return Math.min(Mg,Math.round(o+this.#z()*t*.4))}#z(){return this.#e=Math.imul(this.#e,1664525)+1013904223>>>0,this.#e/4294967296}};function Ng(n){return n<=wr?wr:n<2*wr+gs?(wr*wr+n*gs)/(wr+gs):(n+gs)/2}function Wg(n){return wu[vr(Math.round(n*wu.length)-1,0,wu.length-1)]}function Vg(n,e){let t=n>t3?n*Z4:n;return vr(t,0,Math.min($g,e))}function Dg(n,e){return vr(n/Q4,0,Math.min($g,e))}function zg(n,e){return n.column===e.column&&n.row===e.row&&n.width===e.width&&n.height===e.height}function vs(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function vr(n,e,t){return Math.max(e,Math.min(t,n))}function xu(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var h3=[0,1,0,-1],f3=[-1,0,1,0],m3=["\u2502","\u250C","\u2502","\u2510","\u2518","\u2500","\u2510","\u2500","\u2502","\u2514","\u2502","\u2518","\u2514","\u2500","\u250C","\u2500"];function ku(n,e){return e.y<n.y?0:e.x>n.x?1:e.y>n.y?2:3}function Ss(n,e){return n.length<2?[]:n.map((t,r)=>{let o=r===0?ku(t,n[1]):ku(n[r-1],t),i=r===n.length-1?o:ku(t,n[r+1]);return{...t,glyph:r===n.length-1&&e?e:m3[o*4+i]}})}var ks=class{#e=new Uint32Array;#t=new Int32Array;#i=new Int32Array;#r=0;route(e,t,r,o,i,a=0){if(!Number.isSafeInteger(e)||!Number.isSafeInteger(t)||e<=0||t<=0||e*t>4e6)throw new RangeError("Orthogonal routing requires a positive grid of at most 4,000,000 cells.");let s=m=>Number.isInteger(m.x)&&Number.isInteger(m.y)&&m.x>=0&&m.x<e&&m.y>=0&&m.y<t;if(!s(r)||!s(o))return;let l=e*t;this.#e.length!==l&&(this.#e=new Uint32Array(l),this.#t=new Int32Array(l),this.#i=new Int32Array(l),this.#r=0),this.#r===4294967295&&(this.#e.fill(0),this.#r=0);let d=r.y*e+r.x,c=o.y*e+o.x;if(!i(d)||!i(c))return;let u=++this.#r,h=(Math.trunc(a)%4+4)%4,f=0,p=0;for(this.#i[p++]=d,this.#e[d]=u,this.#t[d]=-1;f<p;){let m=this.#i[f++];if(m===c){let b=[];for(let w=c;w!==-1;w=this.#t[w])b.push({x:w%e,y:Math.floor(w/e)});return b.reverse()}let g=m%e,y=Math.floor(m/e);for(let b=0;b<4;b++){let w=(b+h)%4,x=g+h3[w],k=y+f3[w];if(x<0||x>=e||k<0||k>=t)continue;let C=k*e+x;this.#e[C]===u||!i(C)||(this.#e[C]=u,this.#t[C]=m,this.#i[p++]=C)}}}};function Hg(n,e,t,r,o="\u2593"){return e===0?n===0?"\u2554":n===t-1?"\u2557":"\u2550":e===r-1?n===0?"\u255A":n===t-1?"\u255D":"\u2550":n===0||n===t-1?"\u2551":o}var Bg=16.7,p3=48,g3=1800,Fg=5,b3=.5,y3=6e3,jg=.3,Gg=18e3,w3=40,v3=150,x3=56,nn=8,vn=5,tt=1,mo=2,k3=12,Su=3,Ug=5,Ms=2,yi=nn+mo+4,S3=.35,It=1,M3=400,T3=3,R3=128,_3=2,C3=.6,Cu="o",E3="\u25CF",I3="\u2593",A3=8,Ts=3,Kg=1,O3="\u2588",L3="\u2591",qg=["AND","OR","NAND","NOR","XOR","XNOR"],Yg=620,Mu=2,Xg=3,P3=vn,N3=.22,W3=["power","ground"],Jg="VCC",Zg="GND",Qg="CLK",Vt=3,e1=2,t1=6,V3=2400,D3=3,Tu=[0,1,0,-1],Ru=[-1,0,1,0],Is=class{#e;#t;#i;#r;#o;#s;#n=[];#a=[];#l=new Uint8Array;#c=new Uint8Array;#d=[];#h;#u;#p=[];#b=0;#f=[];#g=0;#m=0;#w=0;#v;#x;#y=[];#P=0;#S=[];#I=0;#A=-1;#k=!1;#_=0;#T=new Set;#C;#$=new ks;constructor(e={}){this.#e=(e.seed??1346585137)>>>0,this.#t=F3(Es(e.density,1),.1,4)}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#r={column:e.column,row:e.row,updatedAt:Es(t,performance.now())})}clearPointer(){this.#r=void 0,this.#o=void 0}advance(e){let t=Cs(e.bounds);if(!t)return!1;this.#M(t);let r=Es(e.now,performance.now()),o=this.#s===void 0?Bg:Math.min(p3,Math.max(0,r-this.#s));if(this.#s=r,o<=0)return!1;let i=o/Bg;this.#g+=o,this.#m+=o,this.#w+=o;let a=this.#r&&r-this.#r.updatedAt<=g3?this.#r:void 0;this.#o=a?{column:a.column-t.column,row:a.row-t.row}:void 0;let s=!1,l=this.#Ce(e,t);for(l&&(s=!0),this.#Ie(t)&&(s=!0),this.#n.length!==this.#A&&(this.#ze(),this.#k=!0);this.#m>=Gg;)this.#m-=Gg,this.#Ne(t)&&(s=!0);for(let c=this.#ne(t);this.#g>=c&&(this.#g-=c,!!this.#K(t));c=this.#ne(t))s=!0;for(this.#k&&(this.#_+=o,(!l||this.#_>=M3)&&(this.#B(t),this.#_=0,s=!0));this.#w>=Yg;)this.#w-=Yg,this.#Fe()&&(s=!0);let d=this.#u;for(let c of this.#a){let u=c.cells.length;if(u===0)continue;let h=c.kind==="tap"&&d!==void 0&&c.obstacleIndex===d,p=this.#R(c)?1:N3;for(let m of c.pulses){let g=c.cells[m.index%u],y=this.#o!==void 0&&Math.max(Math.abs(g.x-this.#o.column),Math.abs(g.y-this.#o.row))<=Fg;m.accumulator+=b3*(y?2:1)*(h?_3:1)*p*i;let b=Math.floor(m.accumulator);b>0&&(m.accumulator-=b,m.index=(m.index+b)%u,s=!0)}}return s}#R(e){if(!e.energizedBy)return this.#O(e.driver);let t=this.#O(e.energizedBy);return e.sinking?!t:t}#O(e){switch(e.kind){case"power":return!0;case"ground":return!1;case"osc":return this.#y.find(t=>t.id===e.id)?.state??!1;case"chip":return this.#n.find(t=>t.id===e.id)?.state??!1}}rasterizeCells(e,t){let r=Cs(e);if(!r)return this.#f=[],this.#f;this.#M(r);let{width:o,height:i}=r;this.#We(o,i);let a=P(t.border,t.background,.35),s=P(t.border,t.text,.15),l=P(t.border,t.text,.25),d=P(t.surfaceStrong,t.text,.2),c=P(t.muted,t.text,.1),u=P(t.accent,t.text,.2),h=P(t.accent,a,.5),f=P(a,t.accent,.45),p=P(a,t.accent,C3),m=P(s,t.accent,.5),g=P(u,t.text,.35),y=P(h,t.accent,.5),b=P(a,t.accent,.55),w=P(a,t.background,.35),x=P(d,t.accent,.5),k=P(l,t.accent,.55),C=P(c,t.text,.6),T=P(t.warning,t.text,.25),S=P(t.warning,t.text,.45),A=this.#o,I=this.#u;for(let M of this.#a){let _=M.kind==="tap"&&I!==void 0&&M.obstacleIndex===I,K=this.#R(M),X=this.#H(M),V=X?T:_?p:K?b:w;for(let z of M.cells){if(z.x<0||z.x>=o||z.y<0||z.y>=i)continue;let Y=A!==void 0&&Math.max(Math.abs(z.x-A.column),Math.abs(z.y-A.row))<=Fg,q=X?T:Y?f:z.glyph===Cu?_?m:s:V,te=this.#T.has(z.y*o+z.x)&&z.glyph!==Cu;this.#f[z.y][z.x]={char:te?E3:z.glyph,foreground:q,...X||te?{bold:!0}:{}}}let B=M.cells.length;if(B!==0)for(let z of M.pulses){let Y=M.cells[z.index%B],q=M.cells[(z.index-1+B)%B];q.y>=0&&q.y<i&&q.x>=0&&q.x<o&&(this.#f[q.y][q.x]=_?{char:q.glyph,foreground:y,bold:!0}:{char:q.glyph,foreground:h}),Y.y>=0&&Y.y<i&&Y.x>=0&&Y.x<o&&(this.#f[Y.y][Y.x]={char:Y.glyph,foreground:_?g:u,bold:!0})}}for(let M of this.#n){let _=M.height-1,K=M.width-1,X=M.id===this.#C,V=M.state?x:d,B=X?S:M.state?k:l;for(let Q=0;Q<M.height;Q+=1){let U=M.y+Q;if(!(U<0||U>=i))for(let $=0;$<M.width;$+=1){let W=M.x+$;if(W<0||W>=o)continue;let L=Q===0||Q===_||$===0||$===K,j=Hg($,Q,M.width,M.height,I3);this.#f[U][W]={char:j,foreground:L?B:V}}}let z=Math.max(0,M.width-2),Y=M.label.slice(0,z),q=M.y+Math.floor(M.height/2),te=M.x+1+Math.max(0,Math.floor((z-Y.length)/2));for(let Q=0;Q<Y.length;Q+=1){let U=te+Q;q<0||q>=i||U<0||U>=o||(this.#f[q][U]={char:Y[Q],foreground:M.state?C:c,bold:!0})}}this.#D(this.#v,t,P(t.warning,t.text,.3),!0,o,i),this.#D(this.#x,t,P(t.muted,t.background,.2),!1,o,i);let O=P(t.accent,t.text,.4),v=P(t.accent,t.background,.35);for(let M of this.#y){if(M.y<0||M.y>=i)continue;let _=M.state?O:v,K=M.state?"CL^":"CL_";for(let X=0;X<K.length;X+=1){let V=M.x+X;V<0||V>=o||this.#c[M.y*o+V]===0&&(this.#f[M.y][V]={char:K[X],foreground:_,bold:M.state})}}let N=P(t.success,t.text,.35),R=P(t.muted,t.background,.55);for(let M of this.#S)M.x<0||M.x>=o||M.y<0||M.y>=i||this.#c[M.y*o+M.x]===0&&(this.#f[M.y][M.x]={char:M.state?O3:L3,foreground:M.state?N:R,bold:M.state});return this.#f}#D(e,t,r,o,i,a){if(!(!e||e.y<0||e.y>=a))for(let s=0;s<e.label.length;s+=1){let l=e.x+s;l<0||l>=i||this.#c[e.y*i+l]===0&&(this.#f[e.y][l]={char:e.label[s],foreground:r,bold:o})}}inspect(){let e=this.#$e();return{...this.#i?{bounds:{...this.#i}}:{},chips:this.#n.map(t=>({id:t.id,x:t.x,y:t.y,width:t.width,height:t.height,label:t.label,gate:t.gate,inputCount:t.inputs.length,state:t.state,stage:t.stage})),traces:this.#a.map(t=>({chipIndex:t.chipIndex,kind:t.kind,...t.kind==="tap"&&t.obstacleIndex!==void 0?{obstacleIndex:t.obstacleIndex}:{},driver:t.driver.kind,...t.consumerChipId!==void 0?{consumerChipId:t.consumerChipId}:{},...t.consumerLedId!==void 0?{consumerLedId:t.consumerLedId}:{},cells:t.cells.map(r=>({...r})),pulses:t.pulses.map(r=>({index:r.index}))})),obstacles:this.#d.map(t=>({...t})),...this.#u!==void 0?{activeObstacleIndex:this.#u}:{},pendingJobs:this.#p.length,...this.#v?{power:{...this.#v}}:{},...this.#x?{ground:{...this.#x}}:{},oscillators:this.#y.map(t=>({x:t.x,y:t.y,label:t.label,periodTicks:t.periodTicks,state:t.state})),leds:this.#S.map(t=>({id:t.id,x:t.x,y:t.y,state:t.state,driven:t.driver!==void 0,connected:t.connected})),danglingChips:this.#N(),junctions:this.#T.size,...this.#C!==void 0?{selectedChipId:this.#C}:{},liveChips:this.#n.reduce((t,r)=>t+(r.state?1:0),0),groundedChips:this.#He(),clockedChips:this.#n.reduce((t,r)=>t+(e.get(r.id)?1:0),0),floatingChips:this.#n.reduce((t,r)=>t+(r.inputs.length===0?1:0),0)}}#N(){let e=new Set;for(let t of this.#n)for(let r of t.inputs)r.kind==="chip"&&e.add(r.id);for(let t of this.#S)t.driver?.kind==="chip"&&e.add(t.driver.id);return this.#n.reduce((t,r)=>t+(e.has(r.id)?0:1),0)}#M(e){let t=this.#i;if(t?.width===e.width&&t.height===e.height){this.#i={...e};return}this.#i={...e},this.#F(e)}#F(e){let{width:t,height:r}=e;this.#l=new Uint8Array(t*r),this.#c=new Uint8Array(t*r),this.#d=[],this.#h=void 0,this.#u=void 0,this.#p=[],this.#n=[],this.#a=[],this.#T.clear(),this.#C=void 0,this.#v=void 0,this.#x=void 0,this.#y=[],this.#S=[],this.#A=-1,this.#w=0,this.#g=0,this.#m=0,this.#k=!1,!(Math.min(t,r)<2*tt+3)&&(this.#Se(e),this.#Me(e),this.#z(e),this.#ue(),this.#se(),this.#A=this.#n.length,this.#B(e))}#re(e,t){let r=e.x+e.width,o=e.y+(e.height>>1);for(let i=0;i<e.height;i+=1){let a=i%2===0?o+(i>>1):o-(i+1>>1);if(!(a<e.y||a>=e.y+e.height)&&this.#W(r,a,t))return{x:r,y:a}}return this.#j(e,t)}#te(e,t,r){let o=e.x-1,i=new Set,a=[];for(let s=0;s<t;s+=1){let l=e.y+Math.min(e.height-1,Math.floor((s+.5)*e.height/Math.max(1,t))),d;for(let c=0;c<e.height;c+=1){let u=c%2===0?l+(c>>1):l-(c+1>>1);if(!(u<e.y||u>=e.y+e.height||i.has(u))&&this.#W(o,u,r)){d=u;break}}if(d===void 0){let c=a.findLast(u=>u!==void 0)??this.#j(e,r);a.push(c);continue}i.add(d),a.push({x:o,y:d})}return a}#Y(e,t,r){let o=t==="power"?e.y-1:e.y+e.height,i=e.x+Math.max(0,Math.min(e.width-1,Math.round(e.width*(t==="power"?.3:.7))));for(let a=0;a<e.width;a+=1){let s=a%2===0?i+(a>>1):i-(a+1>>1);if(!(s<e.x||s>=e.x+e.width)&&this.#W(s,o,r))return{x:s,y:o}}}#W(e,t,r){if(e<0||e>=r.width||t<0||t>=r.height)return!1;let o=t*r.width+e;return this.#l[o]!==1&&this.#c[o]===0}#j(e,t){for(let r=0;r<e.height;r+=1){if(this.#W(e.x+e.width,e.y+r,t))return{x:e.x+e.width,y:e.y+r};if(this.#W(e.x-1,e.y+r,t))return{x:e.x-1,y:e.y+r}}for(let r=0;r<e.width;r+=1){if(this.#W(e.x+r,e.y-1,t))return{x:e.x+r,y:e.y-1};if(this.#W(e.x+r,e.y+e.height,t))return{x:e.x+r,y:e.y+e.height}}}#B(e){if(this.#k=!1,this.#a=this.#a.filter(l=>l.kind==="tap"),this.#n.length===0)return;let t=new Map,r=new Map;for(let l=0;l<this.#n.length;l+=1){let d=this.#n[l];t.set(d.id,l);let c=this.#re(d,e);c&&r.set(d.id,c)}let o=new Map,i=l=>{if(l.kind==="power")return this.#v;if(l.kind==="ground")return this.#x;if(l.kind==="osc")return this.#y.find(d=>d.id===l.id)},a=l=>{if(l.kind==="chip"){let f=r.get(l.id);return f?[{point:f,exitTo:{x:1,y:0}}]:[]}let d=l.kind==="osc"?`osc:${l.id}`:l.kind,c=o.get(d);if(!c){let f=i(l);c={pins:f?this.#ee(f.x,f.y,e):[],cursor:0},o.set(d,c)}let u=c.pins;if(u.length===0)return[];let h=c.cursor;return c.cursor+=1,u.map((f,p)=>u[(h+p)%u.length])},s=(l,d,c)=>{for(let u of a(l)){let h=this.#V(u.point,d,e,u.exitTo,c);if(h)return h}};for(let l of this.#n){let d=this.#te(l,l.inputs.length,e);for(let c=0;c<l.inputs.length;c+=1){let u=l.inputs[c],h=d[c];if(!h)continue;let f=s(u,h);if(!f)continue;let p=2+Math.floor(this.#E()*3),m=Array.from({length:p},()=>({index:Math.floor(this.#E()*f.length),accumulator:0}));this.#a.push({kind:"wire",driver:u,consumerChipId:l.id,chipIndex:u.kind==="chip"?t.get(u.id)??-1:-1,cells:f,pulses:m})}}for(let l=0;l<this.#n.length;l+=1){let d=this.#n[l];for(let c of W3){let u=this.#Y(d,c,e);if(!u)continue;let h;if(c==="power")h=s({kind:c},u,{x:0,y:-1});else for(let f of a({kind:"ground"}))if(h=this.#V(u,f.point,e,{x:0,y:1},f.exitTo),h)break;h&&this.#a.push({kind:"rail",driver:{kind:c},consumerChipId:d.id,chipIndex:-1,energizedBy:{kind:"chip",id:d.id},sinking:c==="ground",cells:h,pulses:[{index:Math.floor(this.#E()*h.length),accumulator:0}]})}}for(let l of this.#S){l.connected=!1;let d=l.driver;if(!d)continue;let c={x:l.x-1,y:l.y};if(!this.#W(c.x,c.y,e))continue;let u=s(d,c);if(!u)continue;let h=this.#oe(l,e);if(!h)continue;let f;for(let m of a({kind:"ground"}))if(f=this.#V(h.point,m.point,e,h.exitTo,m.exitTo),f)break;if(!f)continue;let p=1+Math.floor(this.#E()*2);this.#a.push({kind:"wire",driver:d,consumerLedId:l.id,chipIndex:d.kind==="chip"?t.get(d.id)??-1:-1,cells:u,pulses:Array.from({length:p},()=>({index:Math.floor(this.#E()*u.length),accumulator:0}))}),this.#a.push({kind:"return",driver:d,consumerLedId:l.id,chipIndex:-1,cells:f,pulses:[{index:Math.floor(this.#E()*f.length),accumulator:0}]}),l.connected=!0}this.#Q(e)}#Q(e){this.#T.clear();let t=new Map,r=(o,i,a)=>{let s=o.get(i);s||(s=new Set,o.set(i,s)),s.add(a)};for(let o of this.#a){if(o.kind==="tap")continue;let i=z3(o.driver),a=t.get(i);a||(a=new Map,t.set(i,a));for(let s=0;s<o.cells.length;s+=1){let l=o.cells[s];if(l.x<0||l.x>=e.width||l.y<0||l.y>=e.height)continue;let d=l.y*e.width+l.x,c=o.cells[s-1],u=o.cells[s+1];c&&r(a,d,c.y*e.width+c.x),u&&r(a,d,u.y*e.width+u.x)}}for(let o of t.values())for(let[i,a]of o)a.size>=3&&this.#T.add(i)}pick(e,t){let r=this.#i;if(!r)return!1;let o=Math.floor(e-r.column),i=Math.floor(t-r.row),a=this.#n.find(l=>o>=l.x&&o<l.x+l.width&&i>=l.y&&i<l.y+l.height),s=this.#C;return this.#C=a===void 0||a.id===s?void 0:a.id,a!==void 0}#H(e){let t=this.#C;return t===void 0?!1:e.consumerChipId===t||e.driver.kind==="chip"&&e.driver.id===t?!0:e.energizedBy?.kind==="chip"&&e.energizedBy.id===t}#oe(e,t){let r=[{point:{x:e.x,y:e.y+1},exitTo:{x:0,y:1}},{point:{x:e.x,y:e.y-1},exitTo:{x:0,y:-1}},{point:{x:e.x+1,y:e.y},exitTo:{x:1,y:0}}];for(let o of r)if(this.#W(o.point.x,o.point.y,t))return o}#ee(e,t,r){let o=e+Vt/2>r.width/2,i=o?e-1:e+Vt,a={x:o?-1:1,y:0},s=t*2<r.height?1:-1,l={x:0,y:s},d=[{point:{x:i,y:t},exitTo:a},{point:{x:e+1,y:t+s},exitTo:l},{point:{x:i,y:t+s},exitTo:l},{point:{x:e+Vt-1-(o?0:2),y:t+s},exitTo:l},{point:{x:i+a.x,y:t},exitTo:a}],c=[];for(let u of d)this.#W(u.point.x,u.point.y,r)&&(c.some(h=>bi(h.point,u.point))||c.push(u));return c}#V(e,t,r,o={x:1,y:0},i={x:-1,y:0}){let a={x:e.x+o.x,y:e.y+o.y},s={x:t.x+i.x,y:t.y+i.y};if(!bi(e,t)){if(bi(a,t)||bi(s,e))return $3(e,t)?o1([e,t]):this.#X(e,t,r);if(this.#W(a.x,a.y,r)&&this.#W(s.x,s.y,r)){let l=bi(a,s)?[a]:this.#X(a,s,r,[e,t])?.map(d=>({x:d.x,y:d.y}));if(l)return o1([e,...l,t])}return this.#X(e,t,r)}}#X(e,t,r,o=[]){let i=[];for(let a of o){if(a.x<0||a.x>=r.width||a.y<0||a.y>=r.height)continue;let s=a.y*r.width+a.x;i.push([s,this.#l[s]]),this.#l[s]=1}try{return this.#L(e,t,r)}finally{for(let[a,s]of i)this.#l[a]=s}}#L(e,t,r){let{width:o,height:i}=r,a=d=>this.#l[d]!==1&&this.#c[d]===0;if(!a(e.y*o+e.x)||!a(t.y*o+t.x))return;let s=Math.floor(this.#E()*4),l=this.#$.route(o,i,e,t,a,s);return l&&l.length>=2?Ss(l):void 0}#z(e){if(this.#y.length!==0)for(let t=0;t<Su;t+=1){if(!this.#he(e))return;let r=this.#n[this.#n.length-1],o=r?r.stage+1:1,i=this.#ae(this.#ye(o,e),e,-1);if(!i)return;let a=r?[{kind:"chip",id:r.id}]:[{kind:"osc",id:this.#y[0].id}],s=this.#J(i.x,i.y,a,()=>!1);s&&a.push(s),this.#n.push(this.#ge(i.x,i.y,o,a)),this.#Z(this.#n.length-1,1)}}#K(e){if(this.#n.length===0){let r=this.#n.length;return this.#z(e),this.#n.length===r?!1:(this.#ue(),this.#se(),this.#A=this.#n.length,this.#k=!0,!0)}return this.#n.length>=this.#U(e)||!(this.#n.length>=2&&this.#E()<S3?this.#ie(e)||this.#q(e):this.#q(e))?!1:(this.#ue(),this.#se(),this.#A=this.#n.length,this.#k=!0,!0)}#q(e){let t=this.#n[Math.floor(this.#E()*this.#n.length)];if(!this.#he(e))return!1;let r=t.stage+1,o=this.#ae(this.#be(t,e),e,-1);if(!o)return!1;let i=[{kind:"chip",id:t.id}],a=Mu+(this.#E()<.35?Xg-Mu:0);for(;i.length<a;){let s=this.#J(o.x,o.y,i,()=>!1);if(!s)break;i.push(s)}return this.#n.push(this.#ge(o.x,o.y,r,i)),this.#Z(this.#n.length-1,1),!0}#ie(e){let t=this.#a.filter(g=>g.kind==="wire"&&g.consumerChipId!==void 0&&n1(g.driver));if(t.length===0)return!1;let r=t[Math.floor(this.#E()*t.length)],o=n1(r.driver)?r.driver:void 0,i=this.#n.find(g=>g.id===r.consumerChipId);if(!i||!o)return!1;let a=i.inputs.findIndex(g=>Rs(g,o));if(a<0||!this.#he(e))return!1;let s=o,l=s.kind==="chip"?this.#n.find(g=>g.id===s.id)?.stage??0:0,d=s.kind==="chip"?this.#n.find(g=>g.id===s.id):void 0,c=d?Math.round((d.x+d.width+i.x)/2):this.#be(void 0,e),u=this.#ae(c,e,-1);if(!u)return!1;let h=[o],f=g=>g.id===i.id||this.#G(g.id,i.id),p=this.#J(u.x,u.y,h,f);p&&h.push(p);let m=this.#ge(u.x,u.y,l+1,h);return this.#n.push(m),this.#Z(this.#n.length-1,1),i.inputs[a]={kind:"chip",id:m.id},i.stage=Math.max(i.stage,m.stage+1),!0}#J(e,t,r,o){let i=t+vn/2,a=[],s=(d,c,u)=>{if(r.some(f=>Rs(f,d)))return;let h=c>=e?yi*4:0;a.push({ref:d,score:Math.abs(c-e)+Math.abs(u-i)+h})};for(let d of this.#n)o(d)||s({kind:"chip",id:d.id},d.x+d.width,d.y+d.height/2);for(let d of this.#y)s({kind:"osc",id:d.id},d.x+Vt,d.y);if(a.length===0)return;a.sort((d,c)=>d.score-c.score);let l=a.slice(0,Math.min(3,a.length));return l[Math.floor(this.#E()*l.length)].ref}#G(e,t){let r=new Set,o=[e];for(;o.length>0;){let i=o.pop();if(i===t)return!0;if(r.has(i))continue;r.add(i);let a=this.#n.find(s=>s.id===i);if(a)for(let s of a.inputs)s.kind==="chip"&&!r.has(s.id)&&o.push(s.id)}return!1}#U(e){return _u(Math.round((Su+e.width*e.height/v3)*this.#t),Su,w3)}#ne(e){let t=Math.min(1,this.#n.length/Math.max(1,this.#U(e)));return y3*(jg+(1-jg)*t)}#he(e){return e.width-2*tt>=nn&&e.height-2*tt>=vn}#be(e,t){let r=Ug+1;if(!e)return r;let o=e.x+e.width+mo+2;return o+nn+tt<=t.width?o:r}#ye(e,t){let r=Ug+1,o=t.width-r-nn-tt,i=Math.max(1,Math.floor(o/yi)+1);return r+Math.max(0,e-1)%i*yi}#ae(e,t,r){let o=Math.max(tt,Ms),i=t.width-nn-tt,a=t.height-vn-tt;if(i<o||a<tt)return;let s=a-tt+1;for(let c=0;c<k3;c+=1){let u=Math.floor((this.#E()-.5)*yi),h=_u(e+u,o,i),f=tt+Math.floor(this.#E()*s);if(this.#pe(h,f,r))return{x:h,y:f}}let l,d=-1;for(let c=0;c<x3;c+=1){let u=o+Math.floor(this.#E()*(i-o+1)),h=tt+Math.floor(this.#E()*s);if(!this.#pe(u,h,r))continue;let f=this.#ke(u,h,r);f<=d||(d=f,l={x:u,y:h})}return l}#ke(e,t,r){let o=1/0;for(let i=0;i<this.#n.length;i+=1){if(i===r)continue;let a=this.#n[i],s=Math.abs(a.x+a.width/2-(e+nn/2))+Math.abs(a.y+a.height/2-(t+vn/2));s<o&&(o=s)}return o}#Se(e){let t=e.width*e.height,r=e.width>=2*Vt+4&&e.height>=4,o=Math.max(0,e.width-Vt),i=Math.max(0,e.height-1);this.#v=this.#fe(e,Jg,0,0)??{x:0,y:0,homeX:0,homeY:0,label:Jg},r?(this.#le(e,o,0),this.#le(e,0,i)):t>=400&&this.#le(e,0,i),r&&t>=V3&&this.#y.length<D3&&this.#le(e,Math.floor((e.width-Vt)/2),Math.floor(e.height/2)),this.#x=this.#fe(e,Zg,o,i)??{x:o,y:i,homeX:o,homeY:i,label:Zg}}#Me(e){let t=e.height>Kg+2?Kg:0,r=e.width-2*Ms,o=_u(Math.floor((r+Ts-1)/Ts),0,A3);if(o<=0)return;let i=(o-1)*Ts+1,a=Math.max(Ms,Math.floor((e.width-i)/2));for(let s=0;s<o;s+=1){let l=a+s*Ts;if(l<0||l>=e.width)continue;let d=t*e.width+l;this.#l[d]===0&&(this.#l[d]=1,this.#S.push({id:this.#I++,x:l,y:t,connected:!1,state:!1}))}}#se(){if(this.#n.length===0)return;let e=new Set;for(let r of this.#n)for(let o of r.inputs)o.kind==="chip"&&e.add(o.id);for(let r of this.#S)r.driver?.kind==="chip"&&e.add(r.driver.id);for(let r of this.#n){if(e.has(r.id))continue;let o=this.#S.find(s=>s.driver===void 0);if(o){o.driver={kind:"chip",id:r.id},e.add(r.id);continue}let i=this.#n.filter(s=>s.id!==r.id&&s.inputs.length<P3&&!this.#G(r.id,s.id)&&!s.inputs.some(l=>l.kind==="chip"&&l.id===r.id)).sort((s,l)=>r1(s,r)-r1(l,r))[0];if(i){i.inputs.push({kind:"chip",id:r.id}),e.add(r.id);continue}let a=this.#Te();a&&(a.driver={kind:"chip",id:r.id},a.connected=!1,a.state=!1,e.add(r.id))}let t=new Set;for(let r of this.#S)r.driver?.kind==="chip"&&t.add(r.driver.id);for(let r of this.#S){if(r.driver!==void 0)continue;let o=this.#n.slice().sort((a,s)=>_s(a,r)-_s(s,r));if(o.length===0)continue;o.every(a=>t.has(a.id))&&t.clear();let i=o.find(a=>!t.has(a.id))??o[0];r.driver={kind:"chip",id:i.id},t.add(i.id)}}#Te(){let e=new Map;for(let o of this.#S)o.driver?.kind==="chip"&&e.set(o.driver.id,(e.get(o.driver.id)??0)+1);let t=new Set;for(let o of this.#n)for(let i of o.inputs)i.kind==="chip"&&t.add(i.id);let r;for(let o of this.#S)if(o.driver?.kind==="chip"){if((e.get(o.driver.id)??0)>1)return o;t.has(o.driver.id)&&(r??=o)}return r}#le(e,t,r){let o=this.#fe(e,Qg,t,r);o&&this.#y.push({id:this.#P++,x:o.x,y:o.y,homeX:t,homeY:r,label:Qg,periodTicks:e1+Math.floor(this.#E()*(t1-e1+1)),phase:Math.floor(this.#E()*t1),state:this.#E()<.5})}#fe(e,t,r,o){let i=this.#we(e,r,o);if(i)return this.#me(e,i.x,i.y,1),{x:i.x,y:i.y,homeX:r,homeY:o,label:t}}#we(e,t,r){let o=Math.max(0,e.width-Vt);for(let i=0;i<e.height;i+=1){let a=i%2===0?r+(i>>1):r-(i+1>>1);if(!(a<0||a>=e.height))for(let s=0;s<=o;s+=1){let l=s%2===0?t+(s>>1):t-(s+1>>1);if(!(l<0||l>o)&&this.#De(l,a,e))return{x:l,y:a}}}}#me(e,t,r,o){if(!(r<0||r>=e.height))for(let i=t;i<t+Vt;i+=1)i<0||i>=e.width||(this.#l[r*e.width+i]=o)}#Re(e){let t=!1,r=[...this.#v?[this.#v]:[],...this.#x?[this.#x]:[],...this.#y];for(let o of r){if(o.x===o.homeX&&o.y===o.homeY&&!this.#_e(e,o.x,o.y))continue;this.#me(e,o.x,o.y,0);let a=this.#we(e,o.homeX,o.homeY);a&&(a.x!==o.x||a.y!==o.y)&&(o.x=a.x,o.y=a.y,t=!0),this.#me(e,o.x,o.y,1)}return t}#_e(e,t,r){if(r<0||r>=e.height)return!1;for(let o=t;o<t+Vt;o+=1)if(!(o<0||o>=e.width)&&this.#c[r*e.width+o]!==0)return!0;return!1}#Ce(e,t){let r=[];for(let a of e.obstacles??[]){let s=Cs(a);s&&r.push({column:s.column-t.column,row:s.row-t.row,width:s.width,height:s.height})}this.#u=void 0;let o=e.activeObstacle?Cs(e.activeObstacle):void 0;if(o){let a={column:o.column-t.column,row:o.row-t.row,width:o.width,height:o.height},s=r.findIndex(l=>fo(l,a));s>=0&&(this.#u=s)}let i=r.map(a=>`${a.column},${a.row},${a.width},${a.height}`).join(";");return i===this.#h?!1:(this.#h=i,this.#d=r,this.#Ee(t))}#Ee(e){let{width:t,height:r}=e;this.#c.length!==t*r?this.#c=new Uint8Array(t*r):this.#c.fill(0);for(let o of this.#d){let i=Math.max(0,o.column-It),a=Math.max(0,o.row-It),s=Math.min(t-1,o.column+o.width-1+It),l=Math.min(r-1,o.row+o.height-1+It);for(let d=a;d<=l;d+=1)this.#c.fill(1,d*t+i,d*t+s+1)}this.#Re(e),this.#k=!0;for(let o=this.#a.length-1;o>=0;o-=1){let i=this.#a[o];if(i.kind!=="tap")continue;let a=i.obstacleRect?this.#d.findIndex(s=>fo(s,i.obstacleRect)):-1;if(a>=0&&this.#Pe(i,e)){i.obstacleIndex=a;continue}this.#ce(i,e),this.#a.splice(o,1)}for(let o of this.#n)this.#xe(o,e)&&this.#de({kind:"relocate-chip",chipId:o.id});for(let o of this.#d)this.#a.some(a=>a.kind==="tap"&&a.obstacleRect!==void 0&&fo(a.obstacleRect,o))||this.#de({kind:"grow-taps",rect:{...o}});return!0}#Ie(e){let t=!1;for(let r=0;r<T3&&this.#p.length>0;r+=1){let o=this.#p.shift();if(o.kind==="relocate-chip")this.#Ae(o.chipId,e)&&(t=!0);else{let i=this.#d.findIndex(s=>fo(s,o.rect));if(i<0)continue;!this.#a.some(s=>s.kind==="tap"&&s.obstacleRect!==void 0&&fo(s.obstacleRect,o.rect))&&this.#Oe(i,e)&&(t=!0)}}return t}#de(e){if(!(this.#p.length>=R3)){for(let t of this.#p)if(t.kind===e.kind&&(e.kind==="grow-taps"&&t.kind==="grow-taps"&&fo(t.rect,e.rect)||e.kind==="relocate-chip"&&t.kind==="relocate-chip"&&t.chipId===e.chipId))return;this.#p.push(e)}}#Ae(e,t){let r=this.#n.findIndex(s=>s.id===e);if(r<0)return!1;let o=this.#n[r];if(!this.#xe(o,t))return!1;let i=[];for(let s=this.#a.length-1;s>=0;s-=1){let l=this.#a[s];l.chipIndex===r&&(l.kind==="tap"&&l.obstacleRect&&i.push({...l.obstacleRect}),this.#ce(l,t),this.#a.splice(s,1))}this.#Z(r,0);let a=this.#ae(this.#ye(o.stage,t),t,r);a?(o.x=a.x,o.y=a.y,this.#Z(r,1)):this.#ve(r,t),this.#k=!0;for(let s of i)this.#de({kind:"grow-taps",rect:s});return!0}#ve(e,t){this.#n[e]?.id===this.#C&&(this.#C=void 0);for(let r=this.#a.length-1;r>=0;r-=1){let o=this.#a[r];o.chipIndex===e?(this.#ce(o,t),this.#a.splice(r,1)):o.chipIndex>e&&(o.chipIndex-=1)}this.#n.splice(e,1)}#Oe(e,t){let r=1+Math.floor(this.#E()*3),o=!1;for(let i=0;i<r;i+=1)this.#Le(e,t)&&(o=!0);return o}#Le(e,t){let r=this.#d[e];if(!r||this.#n.length===0)return!1;let o=r.column+r.width/2,i=r.row+r.height/2,a=-1,s=1/0;for(let S=0;S<this.#n.length;S+=1){let A=this.#n[S],I=Math.abs(A.x+A.width/2-o)+Math.abs(A.y+A.height/2-i);I<s&&(s=I,a=S)}if(a<0)return!1;let l=this.#n[a],{width:d,height:c}=t,u=(S,A)=>S>=r.column&&S<=r.column+r.width-1&&A>=r.row&&A<=r.row+r.height-1,h=(S,A)=>!u(S,A)&&S>=r.column-It&&S<=r.column+r.width-1+It&&A>=r.row-It&&A<=r.row+r.height-1+It,f=Math.floor(this.#E()*4),p=new Int32Array(d*c).fill(-2),m=[],g=(S,A)=>{if(S<0||S>=d||A<0||A>=c)return;let I=A*d+S;p[I]!==-2||this.#l[I]!==0||this.#c[I]!==0&&!h(S,A)||(p[I]=-1,m.push(I))};for(let S=l.x;S<l.x+l.width;S+=1)g(S,l.y-1),g(S,l.y+l.height);for(let S=l.y;S<l.y+l.height;S+=1)g(l.x-1,S),g(l.x+l.width,S);let y=-1,b=-1;for(let S=0;S<m.length&&y<0;S+=1){let A=m[S],I=A%d,O=Math.floor(A/d);if(h(I,O)){for(let v=0;v<4;v+=1){let N=(v+f)%4,R=I+Tu[N],M=O+Ru[N];if(R<0||R>=d||M<0||M>=c||!u(R,M))continue;let _=M*d+R;if(this.#l[_]===0){y=A,b=_;break}}continue}for(let v=0;v<4;v+=1){let N=(v+f)%4,R=I+Tu[N],M=O+Ru[N];if(R<0||R>=d||M<0||M>=c)continue;let _=M*d+R;p[_]!==-2||this.#l[_]!==0||this.#c[_]!==0&&!h(R,M)||(p[_]=A,m.push(_))}}if(y<0||b<0)return!1;let w=[];for(let S=y;S!==-1;S=p[S])w.push(S);let x=[];for(let S=w.length-1;S>=0;S-=1){let A=w[S];x.push({x:A%d,y:Math.floor(A/d)})}if(x.push({x:b%d,y:Math.floor(b/d)}),x.length<2)return!1;for(let S of x)this.#l[S.y*d+S.x]=2;let k=B3(x),C=2+Math.floor(this.#E()*3),T=Array.from({length:C},()=>({index:Math.floor(this.#E()*k.length),accumulator:0}));return this.#a.push({chipIndex:a,kind:"tap",driver:{kind:"chip",id:l.id},obstacleIndex:e,obstacleRect:{...r},cells:k,pulses:T}),!0}#Pe(e,t){let r=e.obstacleRect;if(!r)return!1;let{width:o}=t;for(let i of e.cells)if(this.#c[i.y*o+i.x]!==0&&!(i.x>=r.column-It&&i.x<=r.column+r.width-1+It&&i.y>=r.row-It&&i.y<=r.row+r.height-1+It))return!1;return!0}#xe(e,t){let{width:r,height:o}=t;for(let i=e.y;i<e.y+e.height;i+=1)if(!(i<0||i>=o)){for(let a=e.x;a<e.x+e.width;a+=1)if(!(a<0||a>=r)&&this.#c[i*r+a]!==0)return!0}return!1}#Ne(e){if(this.#n.length===0)return!1;let t=Math.floor(this.#E()*this.#n.length),r=this.#n[t],o=Math.floor(this.#E()*4);for(let s=this.#a.length-1;s>=0;s-=1){let l=this.#a[s];l.kind!=="tap"||l.chipIndex!==t||(l.obstacleRect&&this.#de({kind:"grow-taps",rect:{...l.obstacleRect}}),this.#ce(l,e),this.#a.splice(s,1))}this.#Z(t,0);let i=r.x+Tu[o],a=r.y+Ru[o];return this.#pe(i,a,t)&&(r.x=i,r.y=a),this.#Z(t,1),this.#k=!0,!0}#pe(e,t,r){let o=this.#i;if(!o||e<Math.max(tt,Ms)||t<tt||e+nn>o.width-tt||t+vn>o.height-tt)return!1;for(let i=0;i<this.#n.length;i+=1){if(i===r)continue;let a=this.#n[i];if(e<a.x+a.width+mo&&a.x<e+nn+mo&&t<a.y+a.height+mo&&a.y<t+vn+mo)return!1}for(let i=t;i<t+vn;i+=1)for(let a=e;a<e+nn;a+=1){let s=i*o.width+a;if(this.#l[s]!==0||this.#c[s]!==0)return!1}return!0}#Z(e,t){let r=this.#i,o=this.#n[e];if(!(!r||!o)){for(let i=o.y;i<o.y+o.height;i+=1)if(!(i<0||i>=r.height))for(let a=o.x;a<o.x+o.width;a+=1)a<0||a>=r.width||(this.#l[i*r.width+a]=t)}}#ce(e,t){for(let r of e.cells)r.x<0||r.x>=t.width||r.y<0||r.y>=t.height||(this.#l[r.y*t.width+r.x]=0)}#We(e,t){if(this.#f.length===t&&(this.#f[0]?.length??-1)===e){for(let r of this.#f)r.fill(void 0);return}this.#f=Array.from({length:t},()=>new Array(e).fill(void 0))}#ge(e,t,r,o){let i=this.#Ve();return{id:this.#b++,x:e,y:t,width:nn,height:vn,label:i,gate:i,inputs:[...o],stage:r,state:this.#E()<.5,nextState:!1}}#Ve(){let e=new Set(this.#n.map(o=>o.gate)),t=qg.filter(o=>!e.has(o)),r=t.length>0?t:qg;return r[Math.floor(this.#E()*r.length)]}#De(e,t,r){if(t<0||t>=r.height)return!1;for(let o=e;o<e+Vt;o+=1){if(o<0||o>=r.width)return!1;let i=t*r.width+o;if(this.#l[i]!==0||this.#c[i]!==0)return!1}return!0}#ze(){let e=this.#n;if(this.#A=e.length,e.length===0)return;let t=new Set(e.map(o=>o.id)),r=new Set(this.#y.map(o=>o.id));for(let o of e){let i=[];for(let a of o.inputs)a.kind==="chip"&&(!t.has(a.id)||a.id===o.id)||a.kind==="osc"&&!r.has(a.id)||i.some(s=>Rs(s,a))||i.push(a);o.inputs=i}for(let o of this.#S)o.driver?.kind==="chip"&&!t.has(o.driver.id)&&(o.driver=void 0,o.connected=!1,o.state=!1);for(let o of e)for(;o.inputs.length<Mu;){let i=this.#J(o.x,o.y,o.inputs,a=>a.id===o.id||this.#G(a.id,o.id));if(!i)break;o.inputs.push(i)}this.#ue(),this.#se();for(let o=this.#n.length-1;o>=0;o-=1)this.#n[o].inputs.length>0||(this.#Z(o,0),this.#ve(o,this.#i??{column:0,row:0,width:0,height:0}));this.#A=this.#n.length,this.#Be()}#$e(){let e=new Map;for(let t of this.#n)e.set(t.id,!1);for(let t=0;t<=this.#n.length;t+=1){let r=!1;for(let o of this.#n)if(e.get(o.id)!==!0){for(let i of o.inputs)if(!(i.kind!=="osc"&&e.get(i.id)!==!0)){e.set(o.id,!0),r=!0;break}}if(!r)break}return e}#He(){let e=new Set,t=new Set;for(let r of this.#a)r.kind!=="rail"||r.consumerChipId===void 0||(r.driver.kind==="power"&&e.add(r.consumerChipId),r.driver.kind==="ground"&&t.add(r.consumerChipId));return this.#n.reduce((r,o)=>r+(e.has(o.id)&&t.has(o.id)?1:0),0)}#Be(){for(let e of this.#n)e.stage=1;for(let e=0;e<this.#n.length;e+=1){let t=!1;for(let r of this.#n)for(let o of r.inputs){if(o.kind!=="chip")continue;let i=this.#n.find(a=>a.id===o.id);!i||i.stage+1<=r.stage||(r.stage=i.stage+1,t=!0)}if(!t)break}}#ue(){if(this.#n.length!==0)for(let e of this.#y){let t={kind:"osc",id:e.id};if(this.#n.some(i=>i.inputs.some(a=>Rs(a,t))))continue;let o=this.#n.filter(i=>i.inputs.length<Xg).sort((i,a)=>_s(i,e)-_s(a,e))[0];o&&o.inputs.push(t)}}#Fe(){let e=this.#n;if(e.length===0)return!1;let t=new Map;for(let i of e)t.set(i.id,i);let r=new Map;for(let i of this.#y)r.set(i.id,i);for(let i of e){let a=0,s=0;for(let l of i.inputs)s+=1,(l.kind==="osc"?r.get(l.id)?.state:t.get(l.id)?.state)&&(a+=1);i.nextState=H3(i.gate,a,s)}let o=!1;for(let i of this.#S){let a=i.connected&&i.driver!==void 0&&this.#O(i.driver);a!==i.state&&(o=!0),i.state=a}for(let i of e)i.nextState!==i.state&&(o=!0),i.state=i.nextState;for(let i of this.#y)i.phase+=1,i.phase>=i.periodTicks&&(i.phase=0,i.state=!i.state,o=!0);return o}#E(){return this.#e=Math.imul(this.#e,1664525)+1013904223>>>0,this.#e/4294967296}};function z3(n){return n.kind==="chip"||n.kind==="osc"?`${n.kind}:${n.id}`:n.kind}function n1(n){return n.kind==="chip"||n.kind==="osc"}function Rs(n,e){return n.kind!==e.kind?!1:n.kind==="chip"&&e.kind==="chip"||n.kind==="osc"&&e.kind==="osc"?n.id===e.id:!0}function _s(n,e){return Math.abs(n.x+n.width/2-e.x)+Math.abs(n.y+n.height/2-e.y)}function r1(n,e){let t=n.x<e.x?yi*4:0;return Math.abs(n.x-e.x)+Math.abs(n.y-e.y)+t}function bi(n,e){return n.x===e.x&&n.y===e.y}function $3(n,e){return Math.abs(n.x-e.x)+Math.abs(n.y-e.y)===1}function H3(n,e,t){if(t===0)return!1;switch(n){case"AND":return e===t;case"OR":return e>0;case"NAND":return e!==t;case"NOR":return e===0;case"XOR":return(e&1)===1;case"XNOR":return(e&1)===0}}function o1(n){return Ss(n)}function B3(n){return Ss(n,Cu)}function fo(n,e){return n.column===e.column&&n.row===e.row&&n.width===e.width&&n.height===e.height}function Cs(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function _u(n,e,t){return Math.max(e,Math.min(t,Math.floor(Es(n,e))))}function F3(n,e,t){return Math.max(e,Math.min(t,n))}function Es(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var po=Math.PI*2,j3=16.7,G3=48,U3=1500,K3=5,q3=5,Y3=5,wi=4,X3=.14,Eu=["\u256C","\u256A","\u256B","\u2551","\u258C","\u2590"],Iu=["\u2591","\u2592","\u2593","\u2588"],Au=["\u2248","\u223D","~","="],Os=class{#e;#t;#i;#r;#o;#s;#n;#a={column:0,row:0,strength:0};#l;#c=0;#d=[];#h=[];#u=-1;#p=[];constructor(e={}){this.#e=(e.seed??1112100685)>>>0;let t=xr(As(e.density,1),.25,2);this.#t=Math.floor(this.#T()*4294967295)>>>0,this.#i=[1,.6,.35].map(i=>({kx:.05+this.#T()*.11,ky:.14+this.#T()*.26,phase:this.#T()*po,speed:(.35+this.#T()*.85)*(this.#T()<.5?-1:1),weight:i}));let r=a1(Math.round(3*t),2,8);this.#r=Array.from({length:r},()=>({xFraction:this.#T(),amplitude:1+this.#T()*1.8,wavelength:3+this.#T()*4,phase:this.#T()*po,speed:(.3+this.#T()*.5)*(this.#T()<.5?-1:1),glyphOffset:Math.floor(this.#T()*Au.length),paired:this.#T()<.5}));let o=a1(Math.round(2.6+t*1.8),3,6);this.#o=Array.from({length:o},()=>({columnFraction:this.#T(),topFraction:.05+this.#T()*.4,spanFraction:.3+this.#T()*.2,periodMs:3e3+this.#T()*3e3,phase:this.#T()*po}))}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#n={column:e.column,row:e.row,updatedAt:As(t,performance.now())})}clearPointer(){this.#n=void 0}advance(e){let t=i1(e.bounds);if(!t)return!1;this.#A(t);let r=As(e.now,performance.now()),o=this.#l===void 0?j3:Math.min(G3,Math.max(0,r-this.#l));if(this.#l=r,o<=0)return!1;this.#c+=o;let i=this.#n;if(i){let a=Math.max(0,r-i.updatedAt);this.#a={column:i.column,row:i.row,strength:Math.max(0,1-a/U3)}}else this.#a={column:0,row:0,strength:0};return!0}rasterizeCells(e,t){let r=i1(e);return r?(this.#A(r),this.#I(r),this.#b(r.width),this.#f(r),this.#w(r,t),this.#x(r,t),this.#y(r,t),this.#P(r,t),this.#d):(this.#d=[],this.#d)}#b(e){if(this.#u===e)return;let t=[],r=-2-this.#k(0,101)%3,o=0;for(;t.push({x:r,phaseA:po*this.#_(o,7),phaseB:po*this.#_(o,11),speed:(.4+.7*this.#_(o,13))*(this.#_(o,17)<.5?-1:1),glyphOffset:this.#k(o,19)%Eu.length,depth:this.#_(o,23)}),!(r>e+2);)r+=q3+this.#k(o,29)%Y3,o+=1;this.#h=t,this.#u=e,this.#p=[]}#f(e){let t=this.#h.length;(this.#p.length!==t||(this.#p[0]?.length??-1)!==e.height)&&(this.#p=Array.from({length:t},()=>new Array(e.height)));let r=this.#c/1e3;for(let o=0;o<t;o+=1){let i=this.#h[o],a=this.#p[o];for(let s=0;s<e.height;s+=1){let l=1.35*(1+1.1*this.#m(i.x,s,e)),d=.75*Math.sin(s*.31+i.phaseA+i.speed*r)+.5*Math.sin(s*.12+i.phaseB-.6*i.speed*r);a[s]=i.x+xr(Math.round(l*d),-2,2)}}}#g(e,t,r){let o=0,i=0;for(let a of this.#i)o+=a.weight*Math.sin(a.kx*e+a.ky*t+a.phase+a.speed*r),i+=a.weight;return o/i}#m(e,t,r){let o=this.#a;if(o.strength<=0)return 0;let i=e-(o.column-r.column),a=2*(t-(o.row-r.row)),s=K3;return o.strength*Math.exp(-(i*i+a*a)/(2*s*s))}#w(e,t){let r=this.#c/1e3;for(let o=0;o<e.height;o+=1)for(let i=0;i+1<this.#h.length;i+=1){let a=this.#p[i][o],s=this.#p[i+1][o],l=s-a;if(l<2)continue;let d=this.#_(i,31),c=1.6+d*1.4,u=Math.max(0,a+1),h=Math.min(e.width-1,s-1);for(let f=u;f<=h;f+=1){let p=(f-a)/l,m=this.#g(f,o,r),g=this.#m(f,o,e),y=c*4*p*(1-p),w=((o+y+1.7*m+2.6*g)%wi+wi)%wi,x=xr(.5+.5*m+.45*g,0,1);if(w<.95){let S=-4*c*(1-2*p)/l,A=p<.16?"(":p>.84?")":S<-.28||Math.abs(S)<=.28&&p<.5?"/":"\\";this.#S(e,f,o,this.#v(A,xr(.35+.65*x,0,1),d,t));continue}let k=Math.min(w,wi-w)/(wi/2),C=xr(x*(1.05-.7*k),0,1);if(C<X3)continue;let T=Math.min(Iu.length-1,Math.floor(C*Iu.length));this.#S(e,f,o,this.#v(Iu[T],C,d,t))}}}#v(e,t,r,o){let i=P(P(o.muted,o.border,r),o.surfaceStrong,.3),a=P(o.background,i,.15+.75*t);return t>.8&&(a=P(a,o.accent,(t-.8)*4)),t>.9?{char:e,foreground:a,bold:!0}:{char:e,foreground:a}}#x(e,t){let r=this.#c/1e3;for(let o of this.#r){let i=Math.round(o.xFraction*(e.width-1));for(let a=0;a<e.height;a+=1){let s=i+Math.round(o.amplitude*Math.sin(a/o.wavelength+o.phase+o.speed*r)),l=xr(.45+.35*this.#g(s,a,r)+.4*this.#m(s,a,e),0,1),d=P(t.background,t.surfaceStrong,.3+.5*l),c=Au[(Math.floor(a/2)+o.glyphOffset)%Au.length];this.#S(e,s,a,{char:c,foreground:d}),o.paired&&this.#S(e,s+1,a,{char:"\u2502",foreground:d})}}}#y(e,t){let r=this.#c/1e3,o=Math.floor(r*1.4);for(let i=0;i<this.#h.length;i+=1){let a=this.#h[i],s=P(t.muted,t.border,a.depth);for(let l=0;l<e.height;l+=1){let d=this.#p[i][l],c=this.#m(d,l,e),u=this.#g(d,l,r),h=xr(.55+.35*u+.5*c,0,1),f=P(t.background,t.surfaceStrong,.3+.5*h);this.#S(e,d-1,l,{char:"(",foreground:f}),this.#S(e,d+1,l,{char:")",foreground:f});let p=P(t.background,s,.35+.6*h);h>.78&&(p=P(p,t.accent,(h-.78)*3));let m=Eu.length,g=Eu[((l+a.glyphOffset+o)%m+m)%m];this.#S(e,d,l,h>.88?{char:g,foreground:p,bold:!0}:{char:g,foreground:p})}}}#P(e,t){let r=this.#h.filter(a=>a.x>=1&&a.x<=e.width-2);if(r.length===0)return;let o=P(t.background,t.border,.7),i=P(t.background,t.muted,.6);for(let a of this.#o){let s=a.columnFraction*(e.width-1),l=r[0].x;for(let m of r)Math.abs(m.x-s)<Math.abs(l-s)&&(l=m.x);let d=Math.max(5,Math.round(a.spanFraction*e.height)),c=Math.min(e.height-2,Math.round(a.topFraction*(e.height-1))+d),u=Math.max(0,c-d);if(c-u<4)continue;this.#S(e,l,u,{char:"\u2593",foreground:o}),this.#S(e,l,c+1,{char:"\u2593",foreground:o});let h=.5+.5*Math.sin(po*this.#c/a.periodMs+a.phase),f=u+1+Math.round(h*(c-u-1));for(let m=u+1;m<f;m+=1)this.#S(e,l,m,{char:"\u2551",foreground:i});let p=this.#m(l,f,e);this.#S(e,l,f,{char:"\u2566",foreground:P(t.accent,t.text,.15+.25*p),bold:!0})}}#S(e,t,r,o){t<0||t>=e.width||r<0||r>=e.height||(this.#d[r][t]=o)}#I(e){(this.#d.length!==e.height||(this.#d[0]?.length??-1)!==e.width)&&(this.#d=Array.from({length:e.height},()=>new Array(e.width)));for(let t of this.#d)t.fill(void 0)}#A(e){let t=this.#s;t?.column===e.column&&t.row===e.row&&t.width===e.width&&t.height===e.height||(this.#s={...e})}#k(e,t){return J3(this.#t,e,t)}#_(e,t){return this.#k(e,t)/4294967296}#T(){return this.#e=Math.imul(this.#e,1664525)+1013904223>>>0,this.#e/4294967296}};function J3(n,e,t){let r=(n^Math.imul(e+40503,2246822507)^Math.imul(t+32586,3266489909))>>>0;return r=Math.imul(r^r>>>15,739982445)>>>0,r=Math.imul(r^r>>>12,695872825)>>>0,(r^r>>>15)>>>0}function i1(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function a1(n,e,t){return Math.max(e,Math.min(t,Math.floor(As(n,e))))}function xr(n,e,t){return Math.max(e,Math.min(t,n))}function As(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var Ls=Math.PI*2,Z3=16.7,Q3=48,eS=1800,tS=7,nS=1200,s1=8e3,l1=12e3,rS=.2,oS=15,iS=25,aS=[-1,1],sS=[{frondBase:17,swayAmplitude:.7},{frondBase:14,swayAmplitude:1.4},{frondBase:12,swayAmplitude:2.2}],Ns=class{#e;#t;#i;#r;#o=[];#s;#n=0;#a=Number.NEGATIVE_INFINITY;#l=0;#c;#d=[];constructor(e={}){this.#e=(e.seed??1247104583)>>>0;let t=c1(Ps(e.density,1),.25,2);this.#t=sS.map(r=>this.#h(r,t)),this.#c=s1+this.#y()*l1}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#r={column:e.column,row:e.row,updatedAt:Ps(t,performance.now())})}clearPointer(){this.#r=void 0}advance(e){let t=Ou(e.bounds);if(!t)return!1;this.#x(t);let r=Ps(e.now,performance.now()),o=this.#s===void 0?Z3:Math.min(Q3,Math.max(0,r-this.#s));if(this.#s=r,o<=0)return!1;this.#n+=o,this.#n>=this.#c&&(this.#a=this.#c,this.#l=2500+this.#y()*1500,this.#c=this.#a+this.#l+s1+this.#y()*l1);let i=this.#r&&r-this.#r.updatedAt<=eS?this.#r:void 0,a=(e.obstacles??[]).map(Ou).filter(l=>l!==void 0),s=a.filter(l=>!this.#o.some(d=>hS(d,l)));this.#o=a;for(let l of this.#t)for(let d of l.fronds){let c=lS(d,t);if(i&&c.some(([u,h])=>Math.hypot(i.column-u,i.row-h)<=tS)){d.lastRustleAt=this.#n;continue}for(let u of s)if(dS(c,u)){d.lastRustleAt=this.#n;break}}return!0}rasterizeCells(e,t){let r=Ou(e);if(!r)return this.#d=[],this.#d;this.#x(r),this.#v(r);for(let o=0;o<this.#t.length;o+=1)this.#f(this.#t[o],o,r,t);return this.#d}#h(e,t){let r=d1(Math.round(e.frondBase*t),4,30);return{spec:e,swayPhaseA:this.#y()*Ls,swayPhaseB:this.#y()*Ls,swaySpeedA:.25+this.#y()*.35,swaySpeedB:.6+this.#y()*.5,fronds:Array.from({length:r},()=>{let o=Math.floor(this.#y()*4),i=o===0?-Math.PI/2:o===1?Math.PI/2:o===2?0:Math.PI;return{edge:o,anchorFraction:this.#y(),angle:i+(this.#y()-.5)*1.7,curl:this.#y()*2-1,lengthFraction:this.#y(),swayPhase:this.#y()*Ls,swaySpeed:.5+this.#y()*.7,leafletPhase:this.#y()*Ls,glyphSeed:Math.floor(this.#y()*65535),lastRustleAt:Number.NEGATIVE_INFINITY}})}}#u(){let e=this.#n-this.#a;return e<0||this.#l<=0||e>this.#l?1:1+Math.sin(Math.PI*(e/this.#l))}#p(e){let t=this.#n/1e3,r=Math.sin(e.swaySpeedA*t+e.swayPhaseA)+.5*Math.sin(e.swaySpeedB*t+e.swayPhaseB);return e.spec.swayAmplitude*this.#u()*(r/1.5)}#b(e){return Math.max(0,1-(this.#n-e.lastRustleAt)/nS)}#f(e,t,r,o){let i=this.#p(e),a=this.#n/1e3;for(let s of e.fronds)this.#g(s,e,t,i,a,r,o)}#g(e,t,r,o,i,a,s){let[l,d]=u1(e,a),c=h1(e),u=this.#b(e),h=Math.cos(e.angle),f=Math.sin(e.angle),p=-f,m=h,g=Math.sin(i*e.swaySpeed+e.swayPhase),y=u>0?u*1.5*Math.sin(this.#n*.02+e.swayPhase):0,b=o*(.6+.4*g)+g*.5*t.spec.swayAmplitude+y,w=e.curl*c*.35,x=l+h*c*.55+p*w*.5+b,k=d+f*c*.55+m*w*.5,C=l+h*c+p*w+b*1.7,T=d+f*c+m*w,S=c*2,A=l,I=d;for(let O=1;O<=S;O+=1){let v=O/S,N=1-v,R=N*N*l+2*N*v*x+v*v*C,M=N*N*d+2*N*v*k+v*v*T,_=R-A,K=M-I;if(A=R,I=M,this.#w(a,Math.round(R),Math.round(M),this.#m(r,cS(_,K),.85,.35+.4*u,u,!1,s)),O%2!==0)continue;let X=Math.atan2(K,_),V=.95+.25*Math.sin(i*1.3+e.leafletPhase+O*.6)*(1+u),B=d1(2+Math.round(4*N),2,6);for(let z of aS){let Y=X+z*V,q=Math.cos(Y),te=Math.sin(Y);for(let Q=1;Q<=B;Q+=1){let U=Math.round(R+q*Q),$=Math.round(M+te*Q*.6),W=fS(e.glyphSeed,O*2+z,Q),L=1-Q/(B+1),j=c1(W%97/97*.5+N*.4+.5*u,0,1),H=Q===1,F=H?W&1?"\u2592":"\u2593":uS(q,te,W);this.#w(a,U,$,this.#m(r,F,L,j,u,!H,s))}}}}#m(e,t,r,o,i,a,s){if(e===0)return{char:t,foreground:P(s.background,s.muted,.3+.3*r+.15*i)};if(e===1){let c=P(s.muted,s.success,.35+.65*r);return{char:t,foreground:P(s.background,c,.6+.15*r+.2*i)}}let l=P(s.success,s.accent,o*.85),d=P(l,s.text,rS);return a&&o>.7?{char:t,foreground:d,bold:!0}:{char:t,foreground:d}}#w(e,t,r,o){t<0||t>=e.width||r<0||r>=e.height||(this.#d[r][t]=o)}#v(e){(this.#d.length!==e.height||(this.#d[0]?.length??-1)!==e.width)&&(this.#d=Array.from({length:e.height},()=>new Array(e.width)));for(let t of this.#d)t.fill(void 0)}#x(e){let t=this.#i;t?.column===e.column&&t.row===e.row&&t.width===e.width&&t.height===e.height||(this.#i={...e})}#y(){return this.#e=Math.imul(this.#e,1664525)+1013904223>>>0,this.#e/4294967296}};function u1(n,e){let t=e.width-1,r=e.height-1;switch(n.edge){case 0:return[n.anchorFraction*t,r];case 1:return[n.anchorFraction*t,0];case 2:return[0,n.anchorFraction*r];default:return[t,n.anchorFraction*r]}}function h1(n){return oS+Math.round(n.lengthFraction*iS)}function lS(n,e){let[t,r]=u1(n,e),o=h1(n),i=t+Math.cos(n.angle)*o,a=r+Math.sin(n.angle)*o,s=e.column,l=e.row;return[[s+t,l+r],[s+(t+i)/2,l+(r+a)/2],[s+i,l+a]]}function dS(n,e){let t=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,o=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;for(let[s,l]of n)t=Math.min(t,s),r=Math.max(r,s),o=Math.min(o,l),i=Math.max(i,l);let a=5;return r+a>=e.column&&t-a<=e.column+e.width-1&&i+a>=e.row&&o-a<=e.row+e.height-1}function cS(n,e){return Math.abs(n)<.4*Math.abs(e)?"\u2502":n*e>0?"\u2572":"\u2571"}function uS(n,e,t){if(Math.abs(n)<.35)return t%3===0?"y":t%3===1?"v":"V";let r=n*e>0;return t%3===0?r?"\u2572":"\u2571":r?"\\":"/"}function hS(n,e){return n.column===e.column&&n.row===e.row&&n.width===e.width&&n.height===e.height}function fS(n,e,t){let r=(n^Math.imul(e+127,2654435761)^Math.imul(t+127,2246822507))>>>0;return r=Math.imul(r^r>>>15,739982445)>>>0,r=Math.imul(r^r>>>12,695872825)>>>0,(r^r>>>15)>>>0}function Ou(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function d1(n,e,t){return Math.max(e,Math.min(t,Math.floor(Ps(n,e))))}function c1(n,e,t){return Math.max(e,Math.min(t,n))}function Ps(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var f1=16.7,mS=48,pS=1500,m1=2,gS=.45,bS=.4,yS=4e4,wS=.9,Lu=4,vS=1600,p1=12,Pu=1,Nu=6,xS=.055,kS=1/12,SS=.1,MS=.06,TS=3,RS=1200,_S=.03,Wu=[".","\xB7","\u02D9"],CS=new Set(["\u2591","\u2592","\u2593"]),Ws=class{#e;#t;#i;#r;#o;#s=0;#n=0;#a=[];#l=[];#c=[];#d=[];constructor(e={}){this.#e=(e.seed??1447120975)>>>0,this.#t=Math.max(0,Du(e.pointerLifetimeMs,pS))}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#r={column:e.column,row:e.row,updatedAt:Du(t,performance.now())})}clearPointer(){this.#r=void 0}advance(e){let t=b1(e.bounds);if(!t)return!1;this.#b(t);let r=Du(e.now,performance.now()),o=this.#o===void 0?f1:Math.min(mS,Math.max(0,r-this.#o));if(this.#o=r,o<=0)return!1;let i=o/f1;this.#s+=o;let a=this.#r&&r-this.#r.updatedAt<=this.#t?this.#r:void 0,s=t.width*SS,l=a?vi(a.column-t.column-t.width/2,-s,s):0;this.#n+=(l-this.#n)*Math.min(1,MS*i);for(let d=0;d<this.#a.length;d+=1){let c=this.#a[d]-xS*i;for(;c<Pu;)c+=Nu;this.#a[d]=c}return!0}rasterizeCells(e,t){let r=b1(e);if(!r)return this.#d=[],this.#d;this.#b(r);let{width:o,height:i}=r;this.#f(o,i);let a=Vu(i),s=o/2+this.#n,l=vi(o*bS/2,2,Math.max(2,o/2-1)),d=Math.max(2,l/m1),c=.65+.35*Math.sin(this.#s/yS*Math.PI*2+wS),u=a+(1-c)*d,h=Math.max(0,Math.ceil(u-d)),f=this.#s/vS;return this.#h(t,o,a,s,u,l),this.#u(t,o,a,s,u,l,d,h,f),this.#p(t,o,i,a,s),this.#d}inspect(){return{...this.#i?{bounds:{...this.#i},horizonRow:Vu(this.#i.height)}:{},time:this.#s,parallax:this.#n,lineDepths:[...this.#a]}}#h(e,t,r,o,i,a){let s=P(e.danger,e.surface,.5),l=c=>{let u=r<=1?1:c/(r-1);return P(e.background,s,.45*Math.pow(u,1.6))};for(let c=0;c<r;c+=1){let u=l(c);for(let h=0;h<t;h+=1)this.#d[c][h]={char:"\u2591",foreground:u}}let d=Math.floor(this.#s/RS);for(let c=0;c<this.#c.length;c+=1){let u=this.#c[c];if(u<0||u>=r)continue;let h=P(l(u),e.muted,.45);for(let f=0;f<t;f+=1)((f+d+c*3)%7+7)%7>=5||(this.#d[u][f]={char:"\u2500",foreground:h})}for(let c of this.#l){if(c.row>=r||c.column<0||c.column>=t)continue;let u=c.column-o,h=(c.row-i)*m1;Math.hypot(u,h)<a*1.35||(this.#d[c.row][c.column]={char:Wu[c.glyph]??Wu[0],foreground:P(l(c.row),e.muted,.35+.45*c.brightness)})}}#u(e,t,r,o,i,a,s,l,d){let c=Math.max(1,r-1-l);for(let u=l;u<r;u+=1){let h=(i-u)/s;if(h>=1)continue;let f=a*Math.sqrt(Math.max(0,1-h*h));if(f<.35)continue;let p=r-u;if(g1(p,d))continue;let m=vi((u-l)/c,0,1),g=P(e.warning,e.danger,m),y=m<.4,b=u===l?"\u2580":p>1&&g1(p-1,d)?"\u2584":"\u2588",w=Math.max(0,Math.ceil(o-f)),x=Math.min(t-1,Math.floor(o+f));for(let k=w;k<=x;k+=1){let C=Math.abs(k-o)>f-1.2,T=b==="\u2588"&&C?"\u2593":b;this.#d[u][k]={char:T,foreground:g,bold:y}}}}#p(e,t,r,o,i){if(o<r){let d=P(e.accent,e.danger,.4);for(let c=0;c<t;c+=1)this.#d[o][c]={char:"\u2584",foreground:d}}let a=r-1-o;if(a<1)return;let s=Math.max(3,t*kS),l=Math.ceil(t/s)+1;for(let d=-l;d<=l;d+=1)for(let c=o+1;c<r;c+=1){let u=(c-o)/a,h=Math.round(i+d*s*u);if(h<0||h>=t)continue;let f=.15+.7*(1-u);this.#d[c][h]={char:ES(u),foreground:P(e.accent,e.background,f)}}for(let d of this.#a){let c=o+Math.max(1,Math.floor(a/d));if(c>=r)continue;let u=vi(.1+.75*((d-Pu)/Nu),0,1),h=P(e.accent,e.background,u),f=P(h,e.text,.35),p=d<1.6,m=u>.6?"\u2591":u>.3?"\u2592":"\u2584";for(let g=0;g<t;g+=1){let y=this.#d[c][g];this.#d[c][g]=y&&CS.has(y.char)?{char:"\u2588",foreground:f,bold:p}:{char:m,foreground:h,bold:p}}}}#b(e){let t=this.#i;if(t?.width===e.width&&t.height===e.height){this.#i={...e};return}this.#i={...e};let r=Vu(e.height);this.#a=Array.from({length:p1},(a,s)=>Pu+(s+this.#g()*.3)*(Nu/p1));let o=Math.max(1,r),i=Math.max(3,Math.round(e.width*o*_S));this.#l=Array.from({length:i},()=>({column:Math.floor(this.#g()*e.width),row:Math.floor(this.#g()*o),glyph:Math.floor(this.#g()*Wu.length),brightness:this.#g()})),this.#c=Array.from({length:TS},()=>1+Math.floor(this.#g()*Math.max(1,o-2)))}#f(e,t){if(this.#d.length===t&&(this.#d[0]?.length??-1)===e){for(let r of this.#d)r.fill(void 0);return}this.#d=Array.from({length:t},()=>new Array(e).fill(void 0))}#g(){return this.#e=Math.imul(this.#e,1664525)+1013904223>>>0,this.#e/4294967296}};function Vu(n){return vi(Math.round(n*gS),1,Math.max(1,n-2))}function g1(n,e){let t=Math.max(0,2.4-n*.28);return t<=0?!1:((n+e)%Lu+Lu)%Lu<t}function ES(n){return n<.33?"\u2591":n<.66?"\u2592":"\u2593"}function b1(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function vi(n,e,t){return Math.max(e,Math.min(t,n))}function Du(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var IS=Math.PI*2,AS=16.7,OS=48,xi=2,LS=3e3,PS=150,NS=300,y1=6e3,w1=9e3,WS=200,v1=100,zu=5e3,VS=.08,DS=4,x1=2,k1=255,zS=.09,$u=0,S1=1,Bu=2,M1=3,T1=4,Hu=5,R1=6,_1=7,C1=8,zs=[[-.54,0],[-.47,.25],[-.36,.37],[-.26,.4],[-.15,.34],[-.05,.43],[.07,.39],[.19,.33],[.31,.3],[.45,.22],[.56,0]],Vs=["\u25D9","\u25A3","\u229F","o"],E1=["\u256A","\u2567","\u25D9","\u25A3","\u229F"],I1=["\u2593","\u2592","\u25A3","\u25A4"],A1=["\u2219","\u02DA","\xB7"],O1=["\u2571","\u2572","\u27CB"],$S=[[1,0],[0,1],[-1,0],[0,-1]],Hs=class{#e;#t;#i;#r;#o;#s;#n;#a=0;#l=0;#c=0;#d;#h;#u=[];constructor(e={}){this.#e=(e.seed??1397445964)>>>0,this.#t=Math.max(0,$s(e.pointerIdleMs,LS)),this.#i=this.#e}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#s={column:e.column,row:e.row,updatedAt:$s(t,performance.now())})}clearPointer(){this.#s=void 0}advance(e){let t=L1(e.bounds);if(!t)return!1;this.#v(t);let r=$s(e.now,performance.now()),o=this.#n===void 0?AS:Math.min(OS,Math.max(0,r-this.#n));return this.#n=r,o<=0?!1:(this.#a+=o,this.#p(t,r,o),this.#b(r),!0)}rasterizeCells(e,t){let r=L1(e);if(!r)return this.#u=[],this.#u;this.#v(r);let o=this.#o;if(this.#w(r),!o)return this.#u;let i=this.#a/1e3,a=Math.sin(IS*this.#a/zu),s=1+VS*a,l=this.#d!==void 0,d=P(t.text,t.accent,.1),c=P(t.muted,t.border,.35),u=P(t.border,t.background,.45),h={char:"\u2588",foreground:P(t.background,t.border,.22)},f={char:"\u2588",foreground:P(t.background,t.muted,.05)},p={char:"\u2588",foreground:P(t.background,t.border,.11)},m={char:"\u2588",foreground:P(t.warning,t.text,.2),bold:!0},g={char:"\u2593",foreground:P(t.background,t.muted,.08)},y={char:"\u2593",foreground:P(u,t.background,.25)},b=P(t.text,t.muted,.28),w=P(t.background,t.muted,.22),x=.06+.05*(.5+.5*a);for(let k=0;k<o.height;k+=1){let C=this.#u[k];for(let T=0;T<o.width;T+=1){let S=k*o.width+T;switch(o.mask[S]){case S1:{let A=o.level[S]/250,I=A<.5?P(u,c,A/.5):P(c,d,(A-.5)/.5),O=Math.max(0,.5-A)*(.32+.14*a),v=O>0?P(I,t.background,O):I,N=o.overlayChar[S];C[T]=N!==void 0?{char:N,foreground:P(v,t.background,.5)}:{char:FS(A),foreground:v};break}case Bu:C[T]=h;break;case M1:C[T]=l?y:f;break;case T1:C[T]=l?y:p;break;case Hu:C[T]=l?y:m;break;case R1:C[T]=g;break;case C1:C[T]={char:"\u2593",foreground:P(t.background,t.muted,x)};break;case _1:{let A=o.level[S]/250;C[T]={char:A>.5?"\u2588":A>.24?"\u2593":"\u2592",foreground:P(w,b,A)};break}default:C[T]=this.#f(o,S,t,s,i)}}}return l||this.#g(o,t),this.#u}inspect(){return{...this.#r?{bounds:{...this.#r}}:{},...this.#s?{pointer:{...this.#s}}:{},pupilOffset:{x:this.#l,y:this.#c},blinkActive:this.#d!==void 0,breathPhase:this.#a%zu/zu,tubeCount:this.#o?.tubes.length??0,eyes:(this.#o?.eyes??[]).map(e=>({column:e.cx,row:e.cy,socketRadius:e.socketRadius,irisRadius:e.irisRadius}))}}#p(e,t,r){let o=this.#o,i=this.#s,a=i!==void 0&&t-i.updatedAt<=this.#t,s=0,l=0;if(a&&o&&o.eyes.length>0){let c=e.column+(o.width-1)/2,u=e.row+o.eyes[0].cy,h=i.column-c,f=(i.row-u)*xi,p=Math.hypot(h,f);if(p>.001){let m=Math.min(1,p/o.gazeReach);s=h/p*m*o.maxPupilX,l=f/p*m*o.maxPupilX/xi}}let d=1-Math.exp(-r/(a?PS:NS));this.#l+=(s-this.#l)*d,this.#c+=(l-this.#c)*d}#b(e){if(this.#d!==void 0&&this.#a>=this.#d&&(this.#d=void 0,this.#h=this.#a+y1+this.#y()*w1),this.#h??=this.#a+y1+this.#y()*w1,this.#d!==void 0||this.#a<this.#h)return;let t=this.#s;if(t!==void 0&&e-t.updatedAt<v1){this.#h=this.#a+v1*2;return}this.#d=this.#a+WS}#f(e,t,r,o,i){let a=e.overlayChar[t];if(a!==void 0){let c=e.overlayDepth[t]/255,u=P(r.border,r.muted,c),h=e.overlayTube[t];if(h>0){let p=HS(e.tubes[h-1],e.overlayPos[t],i),m=P(r.background,u,Math.min(1,(.26+.4*c)*o));return p>0&&(m=P(m,r.accent,.65*p)),p>.75?{char:a,foreground:m,bold:!0}:{char:a,foreground:m}}let f=P(r.background,u,Math.min(1,(.24+.42*c)*o));return c>.85&&(f=P(f,r.accent,.3)),{char:a,foreground:f}}let s=e.level[t];if(s===k1)return;let l=s/250,d=P(r.border,r.muted,l);return{char:l<.55?"\u2591":"\u2592",foreground:P(r.background,d,Math.min(1,(.14+.38*l)*o))}}#g(e,t){let r={char:"\u2588",foreground:P(t.background,t.border,.06)},o={char:"\u2588",foreground:P(t.text,t.warning,.08),bold:!0};for(let i of e.eyes){let a=Math.round(i.cy+this.#c),s=Math.round(i.cx+this.#l);this.#m(e,s,a,r),this.#m(e,s-1,a-1,o)||this.#m(e,s-1,a,o)}}#m(e,t,r,o){return t<0||t>=e.width||r<0||r>=e.height||e.mask[r*e.width+t]!==Hu?!1:(this.#u[r][t]=o,!0)}#w(e){(this.#u.length!==e.height||(this.#u[0]?.length??-1)!==e.width)&&(this.#u=Array.from({length:e.height},()=>new Array(e.width)));for(let t of this.#u)t.fill(void 0)}#v(e){let t=this.#r;if(t?.column===e.column&&t.row===e.row&&t.width===e.width&&t.height===e.height)return;let r=t?.width!==e.width||t.height!==e.height;this.#r={...e},(r||!this.#o)&&(this.#o=this.#x(e.width,e.height))}#x(e,t){let r=W1(this.#e,e,t),o=r===0?2654435769:r,i=()=>(o=Math.imul(o,1664525)+1013904223>>>0,o/4294967296),a=e*t,s=new Uint8Array(a),l=new Uint8Array(a),d=new Array(a),c=new Int32Array(a),u=new Uint16Array(a),h=new Uint8Array(a),f=(e-1)/2,p=(t-1)/2,m=.62*Math.min(e,t*xi),g=zs[0][0]*m,y=zs[zs.length-1][0]*m,b=.205*m,w=-.06*m,x=Math.max(2,.15*m),k=Math.max(2,.135*m),C=2.6,T=.2,S=Math.cos(T),A=Math.sin(T),I=Math.max(1.3,x*.34),O=-.3*m,v=-.205*m,N=.05*m,R=.24*m,M=Math.max(1.2,.09*m),_=.29*m,K=.45*m,X=.37*m,V=Math.max(3,.24*m),B=Math.max(2.2,.052*m),z=Math.max(3,.16*m);for(let W=0;W<t;W+=1){let L=(W-p)*xi,j=BS(L/m)*m;for(let H=0;H<e;H+=1){let F=W*e+H,oe=H-f,he=j-Math.abs(oe);if(he<=0){s[F]=$u,l[F]=kr(r,H,W)<zS?k1:Math.floor(kr(r,H+7919,W+104729)*251);continue}let Fe=Math.min(he,L-g,y-L);if(Fe<1){s[F]=Bu;continue}let pe=oe<0?-1:1,G=oe-pe*b,ae=L-w,ye=G*S-ae*(pe*A),Se=G*(pe*A)+ae*S,Re=jS(ye/x,Se/k,C);if(Re<=1){let _e=Math.hypot(oe-pe*b,L-w);s[F]=_e<=I?Hu:M1;continue}if(Re<=1.18){s[F]=T1;continue}if(L>=O&&L<=v){s[F]=C1;continue}if(L>=N&&L<=R){let _e=(L-N)/(R-N),it=M*N1(_e),je=Math.abs(oe)<.7&&_e>.55;if(Math.abs(oe)<=it&&!je){s[F]=R1;continue}}if(L>=_&&L<=K&&Math.abs(oe)<=V){s[F]=_1;let _e=1-.45*(Math.abs(oe)/V);if(Math.abs(L-X)<.6)l[F]=6;else{let it=GS(oe+V,B),je=it<.85||it>B-.85;l[F]=Math.round(je?28*_e:150*_e+55)}continue}s[F]=S1;let Ie=US(Fe/z);if(l[F]=Math.round(Ie*250),Ie>.35){let _e=kr(r,H+3301,W+61003);_e<.045?d[F]=A1[Math.floor(kr(r,H+811,W+907)*A1.length)]:_e<.062&&(d[F]=O1[Math.floor(kr(r,H+211,W+509)*O1.length)])}}}let Y=(W,L)=>W>=0&&W<e&&L>=0&&L<t&&s[L*e+W]===$u,q=(W,L,j,H,F,oe)=>{let he=L*e+W;d[he]=d[he]!==void 0&&c[he]>0?"\u256C":j,c[he]=H+1,u[he]=Math.min(65535,F),h[he]=oe},te=[],Q=P1(Math.round(a/110),8,64);for(let W=0;W<Q;W+=1){let L=-1,j=-1;for(let je=0;je<24;je+=1){let Ce=Math.floor(i()*e),Ae=Math.floor(i()*t);if(Y(Ce,Ae)&&d[Ae*e+Ce]===void 0){L=Ce,j=Ae;break}}if(L<0)continue;let H=i()<.55,F=H&&i()<.5,oe=i()<.2,he=i()<.5?0:2,Fe=i()<.5?1:3,pe=Math.floor(80+i()*175),G=te.length,ae=oe?he:Math.floor(i()*4),ye=oe?6+Math.floor(i()*6):2+Math.floor(i()*3),Se=0,Re=!0,Ie=(je,Ce,Ae)=>{if(q(je,Ce,KS(Ae,H),G,Se,pe),!H)return;let dt=Ae%2===0?0:1,$t=Ae%2===0?1:0,xl=Ae%2===0?"\u2550":"\u2551",Ei=F?2:1;for(let At=1;At<=Ei;At+=1){let Mn=je+dt*At,De=Ce+$t*At;Y(Mn,De)&&d[De*e+Mn]===void 0&&q(Mn,De,xl,G,Se,pe)}};Ie(L,j,ae);for(let je=0;je<ye&&Re;je+=1){let Ce=oe?1+Math.floor(i()*2):6+Math.floor(i()*20);for(let Ae=0;Ae<Ce;Ae+=1){let[dt,$t]=$S[ae];if(!Y(L+dt,j+$t)){q(L,j,Vs[Math.floor(i()*Vs.length)],G,Se,pe),Re=!1;break}L+=dt,j+=$t,Se+=1,Ie(L,j,ae)}if(!Re)break;if(je<ye-1){let Ae=oe?ae===he?Fe:he:ae%2===0?i()<.5?1:3:i()<.5?0:2;q(L,j,qS(ae,Ae),G,Se,pe),ae=Ae}else q(L,j,Vs[Math.floor(i()*Vs.length)],G,Se,pe)}let _e=Se+1,it=i()<.5?[i()*_e]:[i()*_e,i()*_e];te.push({length:_e,speed:(.7+i()*.6)*(i()<.5?-1:1),waves:it})}let U=P1(Math.round(a/80),5,96);for(let W=0;W<U;W+=1){let L=Math.floor(i()*Math.max(1,e-3)),j=Math.floor(i()*Math.max(1,t-2)),H=2+Math.floor(i()*2);for(let F=j;F<j+2;F+=1)for(let oe=L;oe<L+H;oe+=1){if(!Y(oe,F))continue;let he=F*e+oe;d[he]===void 0&&(d[he]=I1[Math.floor(i()*I1.length)],h[he]=Math.floor(60+i()*195))}}for(let W=0;W<t;W+=1)for(let L=0;L<e;L+=1){let j=W*e+L;s[j]!==$u||d[j]!==void 0||!(Ds(s,e,t,L+1,W)||Ds(s,e,t,L-1,W)||Ds(s,e,t,L,W+1)||Ds(s,e,t,L,W-1))||kr(r,L+5003,W+2011)<.34&&(d[j]=E1[Math.floor(kr(r,L+17,W+29)*E1.length)],h[j]=230)}let $=p+w/xi;return{width:e,height:t,mask:s,level:l,overlayChar:d,overlayTube:c,overlayPos:u,overlayDepth:h,tubes:te,eyes:[{cx:f-b,cy:$,socketRadius:x,irisRadius:I},{cx:f+b,cy:$,socketRadius:x,irisRadius:I}],gazeReach:Math.max(4,e*.3),maxPupilX:Math.max(.8,I-1.4)}}#y(){return this.#i=Math.imul(this.#i,1664525)+1013904223>>>0,this.#i/4294967296}};function HS(n,e,t){if(n.length<2)return 0;let r=t*DS*n.speed,o=0;for(let i of n.waves){let a=((i+r)%n.length+n.length)%n.length,s=Math.abs(e-a),l=Math.min(s,n.length-s);l<=x1&&(o=Math.max(o,1-l/(x1+.5)))}return o}function BS(n){let e=zs;if(n<=e[0][0]||n>=e[e.length-1][0])return 0;for(let t=0;t<e.length-1;t+=1){let r=e[t],o=e[t+1];if(n>=r[0]&&n<=o[0])return r[1]+(o[1]-r[1])*N1((n-r[0])/(o[0]-r[0]))}return 0}function FS(n){return n<.38?"\u2591":n<.6?"\u2592":n<.82?"\u2593":"\u2588"}function Ds(n,e,t,r,o){return r>=0&&r<e&&o>=0&&o<t&&n[o*e+r]===Bu}function jS(n,e,t){return Math.pow(Math.pow(Math.abs(n),t)+Math.pow(Math.abs(e),t),1/t)}function N1(n){let e=Math.min(1,Math.max(0,n));return e*e*(3-2*e)}function GS(n,e){return(n%e+e)%e}function US(n){return Math.min(1,Math.max(0,n))}function KS(n,e){return n%2===0?e?"\u2550":"\u2500":e?"\u2551":"\u2502"}function qS(n,e){switch(1<<(n+2)%4|1<<e){case 3:return"\u2554";case 9:return"\u255A";case 6:return"\u2557";case 12:return"\u255D";default:return"\u256C"}}function W1(n,e,t){let r=(n^Math.imul(e+40503,2246822507)^Math.imul(t+32586,3266489909))>>>0;return r=Math.imul(r^r>>>15,739982445)>>>0,r=Math.imul(r^r>>>12,695872825)>>>0,(r^r>>>15)>>>0}function kr(n,e,t){return W1(n,e,t)/4294967296}function L1(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function P1(n,e,t){return Math.max(e,Math.min(t,Math.floor($s(n,e))))}function $s(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var ft=Math.PI*2,V1=16.7,YS=48,XS=1600,JS=.16,D1=.34,ZS=18,QS=70,z1=6e3,eM=6e5,tM=8e3,U1=25e3,Fs=5e4,bo=12e3,go=6e4,nM=14e3,rM=.055,oM=.01,iM=.007,aM=3,$1=1,sM=900,H1=18,B1=1400,lM=.055,F1=40,dM=40,Bs=1,Fu=["\u2591","\u2592","\u2593","\u2588"],cM="\u2592",j1=["<",">","v","^"],Yu=[".",":","+","*"],uM="o",hM="@",ju=["*","+","x","'","."],js=class{#e;#t;#i;#r=[];#o=new Uint8Array;#s=[];#n;#a;#l;#c;#d=0;#h=0;#u=[];#p=[];constructor(e={}){this.#e=Math.min(3,Math.max(.25,e.density??1)),this.#t=(e.seed??1230395697)>>>0}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#a={column:e.column,row:e.row,updatedAt:Ku(t,0)})}clearPointer(){this.#a=void 0}advance(e){let t=qu(e.bounds);if(!t)return!1;this.#b(t);let r=Ku(e.now,performance.now()),o=this.#c===void 0?V1:Math.min(YS,Math.max(0,r-this.#c));if(this.#c=r,o<=0)return!1;let i=o/V1;this.#d+=o;let a=this.#a&&r-this.#a.updatedAt<=XS?this.#a:void 0;this.#l=a?{column:a.column-t.column,row:a.row-t.row}:void 0;let s=this.#A(e,t);this.#h+=o;let l=this.#h>=sM;l&&(this.#h=0);for(let d=this.#r.length-1;d>=0;d-=1){let c=this.#r[d];c.ageMs+=o,this.#m(c,t,i)&&(s=!0),this.#w(c,o,l)&&(s=!0),l&&c.ageMs>eM&&(c.cells.shift(),s=!0,c.cells.length===0&&this.#r.splice(d,1))}for(this.#x(o,i,t)&&(s=!0);this.#d>=z1;)this.#d-=z1,this.#P(t)&&(s=!0);return s}rasterizeCells(e,t){let r=qu(e);if(!r)return[];this.#b(r);let{width:o,height:i}=r;this.#f(o,i);for(let d of this.#p)d.fill(void 0);let a=P(t.background,t.success,.45),s=P(t.success,t.text,.3),l=[t.accent,t.warning,t.danger,P(t.accent,t.text,.4)];for(let d of this.#r)for(let c of d.cells){if(c.x<0||c.x>=o||c.y<0||c.y>=i)continue;let u=Math.min(1,c.ageMs/(Fs*1.2)),h=P(a,s,.2+u*.6);if(c.ageMs>=nM){let p=Uu(c.heading+ft/4),m=c.x+p.dx,g=c.y+p.dy;m>=0&&m<o&&g>=0&&g<i&&!this.#p[g][m]&&(this.#p[g][m]={char:cM,foreground:P(a,h,.55)})}let f=Math.min(Fu.length-1,Math.floor(u*Fu.length));if(this.#p[c.y][c.x]={char:Fu[f],foreground:h},c.ornament==="leaf")this.#p[c.y][c.x]={char:j1[c.seed%j1.length],foreground:P(h,t.success,.5)};else if(c.ornament==="flower"){let p=Math.min(1,c.bloomMs/bo),m=l[c.hue%l.length];this.#p[c.y][c.x]={char:Yu[Gu(c.bloomMs)],foreground:P(s,m,.3+p*.7),...p>.6?{bold:!0}:{}}}else if(c.ornament==="fruit"){let p=(c.fruitMs??0)>=go,m=l[(c.hue+2)%l.length];this.#p[c.y][c.x]={char:p?hM:uM,foreground:p?m:P(h,m,.4),...p?{bold:!0}:{}}}}for(let d of this.#u){let c=Math.round(d.x),u=Math.round(d.y);if(c<0||c>=o||u<0||u>=i)continue;let h=Math.min(1,d.lifeMs/B1),f=Math.min(ju.length-1,Math.floor(h*ju.length)),p=l[d.hue%l.length];this.#p[u][c]={char:ju[f],foreground:P(p,a,h*.7),...h<.5?{bold:!0}:{}}}return this.#p}inspect(){return{strands:this.#r.map(e=>({cells:e.cells.map(t=>({x:t.x,y:t.y,ageMs:t.ageMs,ornament:t.ornament,openness:Math.min(1,t.bloomMs/bo),ripe:t.ornament==="fruit"&&(t.fruitMs??0)>=go})),ageMs:e.ageMs,growing:e.cells.length<e.targetLength})),obstacles:this.#s.map(e=>({...e})),confetti:this.#u.length,ripeFruit:this.#r.reduce((e,t)=>e+t.cells.filter(r=>r.ornament==="fruit"&&(r.fruitMs??0)>=go).length,0)}}#b(e){let t=this.#i;if(t?.width===e.width&&t.height===e.height){this.#i={...e};return}this.#i={...e},this.#o=new Uint8Array(e.width*e.height),this.#s=[],this.#n=void 0,this.#r=[],this.#u=[];let r=G1(Math.round((4+e.width*e.height/380)*this.#e),3,F1);for(let o=0;o<r;o+=1)this.#g(e)}#f(e,t){this.#p.length===t&&this.#p[0]?.length===e||(this.#p=Array.from({length:t},()=>new Array(e).fill(void 0)))}#g(e,t){let{width:r,height:o}=e,i,a,s;if(t)i=t.x,a=t.y,s=this.#k()*ft;else{let d=Math.floor(this.#k()*4);d===0?(i=Math.floor(this.#k()*r),a=0,s=ft/4):d===1?(i=r-1,a=Math.floor(this.#k()*o),s=ft/2):d===2?(i=Math.floor(this.#k()*r),a=o-1,s=-ft/4):(i=0,a=Math.floor(this.#k()*o),s=0)}if(!this.#I(i,a,e))return!1;let l=Math.floor(this.#k()*4);return this.#r.push({cells:[{x:i,y:a,heading:s,ageMs:0,ornament:"none",bloomMs:0,hue:l,seed:Math.floor(this.#k()*1024)}],heading:s,curl:(this.#k()-.5)*D1,curlHoldCells:3+Math.floor(this.#k()*8),targetLength:ZS+Math.floor(this.#k()*QS),growthAccumulator:0,ageMs:0,hue:l}),!0}#m(e,t,r){if(e.cells.length>=e.targetLength)return!1;e.growthAccumulator+=JS*r;let o=!1;for(;e.growthAccumulator>=1;){e.growthAccumulator-=1;let i=e.cells[e.cells.length-1];e.curlHoldCells-=1,e.curlHoldCells<=0&&(e.curl=(this.#k()-.5)*D1*2,e.curlHoldCells=3+Math.floor(this.#k()*8));let a=e.heading;e.heading+=e.curl;let s=Uu(e.heading),l=i.x+s.dx,d=i.y+s.dy;if(!this.#I(l,d,t)){let c=!1;for(let u of[ft/8,-ft/8,ft/4,-ft/4]){let h=Uu(e.heading+u);if(this.#I(i.x+h.dx,i.y+h.dy,t)){e.heading+=u,l=i.x+h.dx,d=i.y+h.dy,c=!0;break}}if(!c)return e.targetLength=e.cells.length,o}e.cells.push({x:l,y:d,heading:e.heading,ageMs:0,ornament:"none",bloomMs:0,hue:e.hue,seed:Math.floor(this.#k()*1024)}),o=!0}return o}#w(e,t,r){let o=!1;for(let i=0;i<e.cells.length;i+=1){let a=e.cells[i];if(a.ageMs+=t,a.ornament==="flower"&&a.bloomMs<bo){let d=Gu(a.bloomMs);a.bloomMs=Math.min(bo,a.bloomMs+t),Gu(a.bloomMs)!==d&&(o=!0)}if(a.fruitMs!==void 0){let d=a.fruitMs>=go;a.fruitMs+=t,!d&&a.fruitMs>=go&&(o=!0)}if(!r)continue;let s=Math.min(1,a.ageMs/(Fs*1.5)),l=this.#k();if(a.ornament==="none"){if(a.ageMs<tM||l>rM*(.35+s)||this.#v(e,i,fM(a.ageMs)))continue;a.ornament="leaf",o=!0}else if(a.ornament==="leaf"&&a.ageMs>=U1){if(l>oM*(.35+s))continue;a.ornament="flower",a.bloomMs=0,o=!0}else if(a.ornament==="flower"&&a.bloomMs>=bo&&a.ageMs>=Fs){if(l>iM*(.35+s))continue;a.ornament="fruit",a.fruitMs=0,o=!0}}return o}#v(e,t,r){let o=Math.max(0,t-r),i=Math.min(e.cells.length-1,t+r);for(let a=o;a<=i;a+=1)if(a!==t&&e.cells[a].ornament!=="none")return!0;return!1}#x(e,t,r){if(this.#u.length===0)return!1;for(let o=this.#u.length-1;o>=0;o-=1){let i=this.#u[o];i.lifeMs+=e,i.x+=i.vx*t,i.y+=i.vy*t,i.vy+=lM*t,(i.lifeMs>=B1||i.x<-2||i.y<-2||i.x>r.width+2||i.y>r.height+2)&&this.#u.splice(o,1)}return!0}pick(e,t,r=performance.now()){let o=this.#i;if(!o)return!1;let i=Math.floor(e-o.column),a=Math.floor(t-o.row);for(let s of this.#r)for(let l of s.cells)if(!(l.x!==i||l.y!==a)&&!(l.ornament!=="fruit"||(l.fruitMs??0)<go))return l.ornament="none",l.fruitMs=void 0,l.bloomMs=0,this.#y(i,a,l.hue),this.#c=Ku(r,this.#c??0),!0;return!1}#y(e,t,r){for(let o=0;o<H1;o+=1){let i=o/H1*ft+this.#k()*.4,a=.25+this.#k()*.75;this.#u.push({x:e,y:t,vx:Math.cos(i)*a,vy:Math.sin(i)*a-.35,lifeMs:0,hue:(r+o)%4})}}#P(e){let t=G1(Math.round((4+e.width*e.height/380)*this.#e),3,F1);if(this.#r.length>=t)return!1;let r=new Set;for(let o of this.#r)for(let i of o.cells)r.add(i.y*e.width+i.x);for(let o=0;o<dM;o+=1){let i=Math.floor(this.#k()*e.width),a=Math.floor(this.#k()*e.height);if(this.#I(i,a,e)&&!this.#S(i,a,e,r)&&this.#g(e,{x:i,y:a}))return!0}return!1}#S(e,t,r,o){for(let i=-3;i<=3;i+=1)for(let a=-3;a<=3;a+=1){let s=e+a,l=t+i;if(!(s<0||l<0||s>=r.width||l>=r.height)&&o.has(l*r.width+s))return!0}return!1}#I(e,t,r){return e<0||t<0||e>=r.width||t>=r.height?!1:this.#o[t*r.width+e]!==1}#A(e,t){let r=[];for(let s of e.obstacles??[]){let l=qu(s);l&&r.push({column:l.column-t.column,row:l.row-t.row,width:l.width,height:l.height})}let o=r.map(s=>`${s.column},${s.row},${s.width},${s.height}`).join(";");if(o===this.#n)return!1;this.#n=o,this.#s=r;let{width:i,height:a}=t;this.#o.length!==i*a?this.#o=new Uint8Array(i*a):this.#o.fill(0);for(let s of this.#s){let l=Math.max(0,s.column-Bs),d=Math.max(0,s.row-Bs),c=Math.min(i-1,s.column+s.width-1+Bs),u=Math.min(a-1,s.row+s.height-1+Bs);if(!(c<l||u<d))for(let h=d;h<=u;h+=1)this.#o.fill(1,h*i+l,h*i+c+1)}for(let s=this.#r.length-1;s>=0;s-=1){let l=this.#r[s],d=l.cells.findIndex(c=>!this.#I(c.x,c.y,t));d<0||(l.cells.length=d,l.targetLength=Math.min(l.targetLength,d),l.cells.length===0&&this.#r.splice(s,1))}return!0}#k(){return this.#t=Math.imul(this.#t,1664525)+1013904223>>>0,this.#t/4294967296}};function fM(n){return n>=Fs?$1:n>=U1?$1+1:aM}function Gu(n){return Math.min(Yu.length-1,Math.floor(n/bo*Yu.length))}function Uu(n){let e=(n%ft+ft)%ft;switch(Math.round(e/(ft/8))%8){case 0:return{dx:1,dy:0};case 1:return{dx:1,dy:1};case 2:return{dx:0,dy:1};case 3:return{dx:-1,dy:1};case 4:return{dx:-1,dy:0};case 5:return{dx:-1,dy:-1};case 6:return{dx:0,dy:-1};default:return{dx:1,dy:-1}}}function G1(n,e,t){return Number.isFinite(n)?Math.max(e,Math.min(t,Math.round(n))):e}function Ku(n,e){return Number.isFinite(n)?n:e}function qu(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}var mM=16.7,pM=48,K1=1400,yo=6,gM=.9,bM=.42,yM=.986,wM=.018,vM=.05,xM=.07,kM=.1,Xu=[".",":","*","\u2591","\u2592","\u2593","\u2588"],Gs=class{#e;#t;#i;#r=0;#o=0;#s=new Float32Array(0);#n=new Float32Array(0);#a=[];#l;#c;#d;#h=[];constructor(e={}){this.#e=Math.min(1.6,Math.max(.3,e.intensity??1)),this.#t=(e.seed??1179210309)>>>0}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#c={column:e.column,row:e.row,updatedAt:q1(t,0)})}clearPointer(){this.#c=void 0}advance(e){let t=Ju(e.bounds);if(!t||(this.#u(t),this.#r===0||this.#o===0))return!1;let r=q1(e.now,performance.now()),o=this.#d===void 0?mM:Math.min(pM,Math.max(0,r-this.#d));if(this.#d=r,o<=0)return!1;let i=r/1e3;return this.#m(e,t),this.#b(i),this.#g(t,r),this.#w(),!0}rasterizeCells(e,t){let r=Ju(e);if(!r)return[];this.#u(r);let o=this.#r,i=this.#o;this.#p(o,i);let a=P(t.background,t.danger,.85),s=t.warning,l=P(t.warning,t.text,.7);for(let d=0;d<i;d+=1){let c=this.#h[d];for(let u=0;u<o;u+=1){let h=this.#s[d*o+u];if(h<kM){c[u]=void 0;continue}c[u]={char:Xu[Math.min(Xu.length-1,Math.floor(h*Xu.length))],foreground:SM(h,a,s,l),...h>.82?{bold:!0}:{}}}}return this.#h}inspect(){let e=this.#s.length,t=0,r=0;for(let i=0;i<e;i+=1){let a=this.#s[i];t+=a,a>r&&(r=a)}let o=0;if(this.#o>0){let i=(this.#o-1)*this.#r;for(let a=0;a<this.#r;a+=1)o+=this.#s[i+a]}return{bounds:this.#i?{...this.#i}:void 0,pointer:this.#c?{column:this.#c.column,row:this.#c.row}:void 0,meanHeat:e>0?t/e:0,maxHeat:r,baseHeat:this.#r>0?o/this.#r:0}}#u(e){if(this.#i?.width===e.width&&this.#i.height===e.height){this.#i={...e};return}this.#i={...e},this.#r=e.width,this.#o=e.height,this.#s=new Float32Array(this.#r*this.#o),this.#n=new Float32Array(this.#r*this.#o),this.#l=void 0,this.#d=void 0}#p(e,t){this.#h.length===t&&this.#h[0]?.length===e||(this.#h=Array.from({length:t},()=>new Array(e).fill(void 0)))}#b(e){let t=this.#r,r=this.#o,o=this.#s,i=this.#n,a=Math.floor(r*(1-bM));for(let s=0;s<r;s+=1){let l=s+1<r?(s+1)*t:-1,d=s*t;for(let c=0;c<t;c+=1){let u;if(l<0)u=0;else{let p=c>0?o[l+c-1]:o[l+c],m=c+1<t?o[l+c+1]:o[l+c];u=yM*(.42*o[l+c]+.14*p+.14*m+.3*o[d+c])}let h=wM+vM*this.#v(c,s,e),f=this.#f(c,s,r,a,e);i[d+c]=ki(u+f-h)}}this.#s=i,this.#n=o}#f(e,t,r,o,i){let a=.42+.3*Math.sin(e*.28+i*1.7)+.16*Math.sin(e*.11-i*1.1)+.12*Math.sin(e*.5+t*.2+i*2.6),s=.4+.6*(.5+.5*Math.sin(e*.6-i*3.1));if(t>=o){let l=(t-o)/Math.max(1,r-o);return this.#e*(.32+.5*l)*ki(a)*s}return xM*this.#e*ki(a)*ki(a)}#g(e,t){let r=this.#c;if(!r)return;let o=t-r.updatedAt;if(o>K1)return;let i=gM*(1-o/K1),a=r.column-e.column,s=r.row-e.row,l=this.#r,d=this.#o,c=Math.max(0,Math.floor(a-yo)),u=Math.min(l-1,Math.ceil(a+yo)),h=Math.max(0,Math.floor(s-yo)),f=Math.min(d-1,Math.ceil(s+yo));for(let p=h;p<=f;p+=1)for(let m=c;m<=u;m+=1){let g=Math.hypot(m-a,p-s);if(g>yo)continue;let y=1-g/yo,b=p*l+m;this.#s[b]=ki(this.#s[b]+i*y*y)}}#m(e,t){let r=[];for(let i of e.obstacles??[]){let a=Ju(i);a&&r.push({column:a.column-t.column,row:a.row-t.row,width:a.width,height:a.height})}let o=r.map(i=>`${i.column},${i.row},${i.width},${i.height}`).join(";");o!==this.#l&&(this.#l=o,this.#a=r)}#w(){if(this.#a.length===0)return;let e=this.#r,t=this.#o;for(let r of this.#a){let o=Math.max(0,r.column),i=Math.max(0,r.row),a=Math.min(e-1,r.column+r.width-1),s=Math.min(t-1,r.row+r.height-1);for(let l=i;l<=s;l+=1)this.#s.fill(0,l*e+o,l*e+a+1)}}#v(e,t,r){let o=Math.floor(r*20),i=Math.imul(e+2654435769,2246822507)^Math.imul(t+374761393,3266489909)^Math.imul(o+this.#t,668265263);return i=Math.imul(i^i>>>15,1415530769),(i>>>0)%1e5/1e5}};function SM(n,e,t,r){return n<.55?P(e,t,n/.55):n<.82?P(t,r,(n-.55)/.27):r}function ki(n){return n<0?0:n>1?1:n}function q1(n,e){return Number.isFinite(n)?n:e}function Ju(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}var Zu;async function Y1(){if(!("Bun"in globalThis)||typeof navigator<"u"&&navigator.gpu!==void 0)return;let n=Zu??=(async()=>{let e="bun-webgpu",{setupGlobals:t}=await import(e);await t()})();try{await n}catch(e){throw Zu===n&&(Zu=void 0),new Error("Bun WebGPU initialization failed; install the optional bun-webgpu dependency and its native binary.",{cause:e})}}var Us=()=>{};var Ks,Si;function X1(){return Ks??=(async()=>{try{await Y1();let n=typeof navigator>"u"?void 0:await navigator.gpu?.requestAdapter("Bun"in globalThis?{powerPreference:"high-performance"}:void 0);if(!n){Us("gpu-device","no adapter \u2014 running on the software renderer");return}let e=await n.requestDevice();Si=e;try{e.addEventListener("uncapturederror",t=>{let r=t.error;Us("gpu-error",r?.message??String(r))})}catch{}return e.lost.then(t=>{Si===e&&(Us("gpu-device",`device lost: ${t?.reason??"unknown"} ${t?.message??""}`.trim()),Ks=void 0,Si=void 0)}).catch(()=>{Si===e&&(Ks=void 0,Si=void 0)}),e}catch(n){Us("gpu-device",`requestDevice failed: ${n instanceof Error?n.message:String(n)}`);return}})(),Ks}var MM=16.7,TM=48,RM=1500,tb=1.85,Mr=.055,nb=.012,J1=4,Z1=.08,eh=.995,Pe=9,th=[0,1,0,-1,0,1,-1,-1,1],nh=[0,0,1,0,-1,1,1,-1,-1],_M=[4/9,1/9,1/9,1/9,1/9,1/36,1/36,1/36,1/36],CM=[0,3,4,1,2,7,8,5,6],Qu=[" ",".",",",";",":","~","=","#"],EM=["-","/","|","\\","-","/","|","\\"],IM=`
struct Params {
  width: u32,
  height: u32,
  omega: f32,
  inflow_vy: f32,
  perturbation: f32,
  frame: u32,
  damping: f32,
  _pad: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> fIn: array<f32>;
@group(0) @binding(2) var<storage, read_write> fOut: array<f32>;
@group(0) @binding(3) var<storage, read> obs: array<u32>;
@group(0) @binding(4) var<storage, read_write> macro_out: array<f32>;

const ex = array<i32, 9>(0, 1, 0, -1, 0, 1, -1, -1, 1);
const ey = array<i32, 9>(0, 0, 1, 0, -1, 1, 1, -1, -1);
const wt = array<f32, 9>(0.44444444, 0.11111111, 0.11111111, 0.11111111, 0.11111111,
                          0.02777778, 0.02777778, 0.02777778, 0.02777778);
const opp = array<u32, 9>(0u, 3u, 4u, 1u, 2u, 7u, 8u, 5u, 6u);

fn feq(rho: f32, ux: f32, uy: f32, i: u32) -> f32 {
  let eu = f32(ex[i]) * ux + f32(ey[i]) * uy;
  let usq = ux * ux + uy * uy;
  return wt[i] * rho * (1.0 + 3.0 * eu + 4.5 * eu * eu - 1.5 * usq);
}

fn hash(seed: u32) -> f32 {
  var h = seed;
  h = h ^ (h >> 16u);
  h = h * 0x45d9f3bu;
  h = h ^ (h >> 16u);
  return f32(h & 0xFFFFu) / 65536.0 - 0.5;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let x = id.x;
  let y = id.y;
  if (x >= params.width || y >= params.height) { return; }
  let W = params.width;
  let idx = y * W + x;
  let base = idx * 9u;

  // Pull streaming: gather distributions from source cells.
  var f: array<f32, 9>;
  for (var i = 0u; i < 9u; i = i + 1u) {
    let sx = i32(x) - ex[i];
    let sy = i32(y) - ey[i];
    if (sx >= 0 && sx < i32(W) && sy >= 0 && sy < i32(params.height)) {
      f[i] = fIn[u32(sy) * W * 9u + u32(sx) * 9u + i];
    } else if (sy < 0) {
      // Top boundary: inflow with perturbation.
      let pert = params.perturbation * hash(x + params.frame * 131u);
      f[i] = feq(1.0, pert, params.inflow_vy, i);
    } else {
      f[i] = fIn[base + i];
    }
  }

  // Obstacle bounce-back.
  if (obs[idx] != 0u) {
    for (var i = 0u; i < 9u; i = i + 1u) {
      fOut[base + opp[i]] = f[i];
    }
    macro_out[idx * 3u] = 1.0;
    macro_out[idx * 3u + 1u] = 0.0;
    macro_out[idx * 3u + 2u] = 0.0;
    return;
  }

  // Macroscopic density and velocity.
  var rho: f32 = 0.0;
  var ux: f32 = 0.0;
  var uy: f32 = 0.0;
  for (var i = 0u; i < 9u; i = i + 1u) {
    rho = rho + f[i];
    ux = ux + f32(ex[i]) * f[i];
    uy = uy + f32(ey[i]) * f[i];
  }
  if (rho > 0.001) { ux = ux / rho; uy = uy / rho; }

  // Stability clamp. Use negated form so NaN fails the check too.
  if (!(rho >= 0.5 && rho <= 1.5 && abs(ux) < 1.0 && abs(uy) < 1.0)) {
    rho = 1.0;
    ux = 0.0;
    uy = params.inflow_vy;
    // Hard reset to equilibrium when the cell is invalid.
    for (var j = 0u; j < 9u; j = j + 1u) {
      fOut[base + j] = feq(rho, ux, uy, j);
    }
    macro_out[idx * 3u] = rho;
    macro_out[idx * 3u + 1u] = ux;
    macro_out[idx * 3u + 2u] = uy;
    return;
  }

  // Drag: dampen velocity so energy dissipates over time.
  ux = ux * params.damping;
  uy = uy * params.damping;

  // BGK collision.
  for (var i = 0u; i < 9u; i = i + 1u) {
    fOut[base + i] = f[i] + params.omega * (feq(rho, ux, uy, i) - f[i]);
  }

  macro_out[idx * 3u] = rho;
  macro_out[idx * 3u + 1u] = ux;
  macro_out[idx * 3u + 2u] = uy;
}
`;function Sr(n,e,t,r){let o=th[r]*e+nh[r]*t,i=e*e+t*t;return _M[r]*n*(1+3*o+4.5*o*o-1.5*i)}var rh=class{width;height;fA;fB;obstacles;macro;ping=!1;frame=0;constructor(e,t){this.width=e,this.height=t;let r=e*t;this.fA=new Float32Array(r*Pe),this.fB=new Float32Array(r*Pe),this.obstacles=new Uint8Array(r),this.macro=new Float32Array(r*3),this.#e()}#e(){let{width:e,height:t,fA:r}=this;for(let o=0;o<t;o+=1)for(let i=0;i<e;i+=1){let a=(o*e+i)*Pe;for(let s=0;s<Pe;s+=1)r[a+s]=Sr(1,0,Mr,s)}}setObstacles(e,t){let{width:r,height:o,obstacles:i}=this,a=new Uint8Array(i);i.fill(0);for(let l of e){let d=Math.max(0,Math.floor(l.column-t.column)),c=Math.max(0,Math.floor(l.row-t.row)),u=Math.min(r,Math.floor(l.column-t.column+l.width)),h=Math.min(o,Math.floor(l.row-t.row+l.height));for(let f=c;f<h;f+=1)for(let p=d;p<u;p+=1)i[f*r+p]=1}let s=this.ping?this.fB:this.fA;for(let l=0;l<r*o;l+=1)if(a[l]&&!i[l]){let d=l*Pe;for(let c=0;c<Pe;c+=1)s[d+c]=Sr(1,0,Mr,c)}}step(){let{width:e,height:t,obstacles:r,macro:o}=this,i=this.ping?this.fB:this.fA,a=this.ping?this.fA:this.fB;this.frame+=1;for(let s=0;s<t;s+=1)for(let l=0;l<e;l+=1){let d=s*e+l,c=d*Pe,u=new Float64Array(Pe);for(let m=0;m<Pe;m+=1){let g=l-th[m],y=s-nh[m];if(g>=0&&g<e&&y>=0&&y<t)u[m]=i[(y*e+g)*Pe+m];else if(y<0){let b=l+this.frame*131>>>0,w=((Math.imul(b^b>>>16,73244475)^b>>>16)&65535)/65536-.5;u[m]=Sr(1,nb*w,Mr,m)}else u[m]=i[c+m]}if(r[d]){for(let m=0;m<Pe;m+=1)a[c+CM[m]]=u[m];o[d*3]=1,o[d*3+1]=0,o[d*3+2]=0;continue}let h=0,f=0,p=0;for(let m=0;m<Pe;m+=1)h+=u[m],f+=th[m]*u[m],p+=nh[m]*u[m];h>.001&&(f/=h,p/=h),(!(h>=.5&&h<=1.5)||!Number.isFinite(f)||!Number.isFinite(p))&&(h=1,f=0,p=Mr),f*=eh,p*=eh;for(let m=0;m<Pe;m+=1){let g=u[m],y=g+tb*(Sr(h,f,p,m)-g);a[c+m]=Number.isFinite(y)?y:Sr(1,0,Mr,m)}o[d*3]=h,o[d*3+1]=f,o[d*3+2]=p}this.ping=!this.ping}injectVelocity(e,t,r,o){let{width:i,height:a}=this,s=2,l=this.ping?this.fB:this.fA;for(let d=-s;d<=s;d+=1)for(let c=-s;c<=s;c+=1){let u=e+c,h=t+d;if(u<0||u>=i||h<0||h>=a||this.obstacles[h*i+u])continue;let f=(h*i+u)*Pe,p=0;for(let y=0;y<Pe;y+=1)p+=l[f+y];if(p<.001)continue;let m=r,g=o;for(let y=0;y<Pe;y+=1)l[f+y]=Sr(p,m,g,y)}}};async function AM(n,e){try{let t=await X1();if(!t)return null;let r=n*e,o=r*Pe*4,i=r*3*4,a=r*4,s=t.createShaderModule({code:IM}),l=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),d=t.createComputePipeline({layout:t.createPipelineLayout({bindGroupLayouts:[l]}),compute:{module:s,entryPoint:"main"}}),c=t.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=t.createBuffer({size:o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=t.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),m=t.createBuffer({size:i,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),g=(b,w)=>t.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:b}},{binding:2,resource:{buffer:w}},{binding:3,resource:{buffer:f}},{binding:4,resource:{buffer:p}}]}),y=new Float32Array(r*Pe);for(let b=0;b<r;b+=1)for(let w=0;w<Pe;w+=1)y[b*Pe+w]=Sr(1,0,Mr,w);return t.queue.writeBuffer(u,0,y),{device:t,pipeline:d,paramsBuffer:c,fBufferA:u,fBufferB:h,obsBuffer:f,macroBuffer:p,stagingBuffer:m,bindGroupA:g(u,h),bindGroupB:g(h,u),width:n,height:e,ping:!1,frame:0,readbackPending:!1,readbackData:null}}catch{return null}}function OM(n,e){let{device:t,pipeline:r,paramsBuffer:o,macroBuffer:i,stagingBuffer:a}=n,s=Math.ceil(n.width/8),l=Math.ceil(n.height/8),d=new Float32Array(8);d[2]=tb,d[3]=Mr,d[4]=nb,d[6]=eh;let c=new Uint32Array(d.buffer);c[0]=n.width,c[1]=n.height,c[5]=n.frame,c[7]=0,t.queue.writeBuffer(o,0,d);let u=t.createCommandEncoder();for(let h=0;h<e;h+=1){let f=u.beginComputePass();f.setPipeline(r),f.setBindGroup(0,n.ping?n.bindGroupB:n.bindGroupA),f.dispatchWorkgroups(s,l),f.end(),n.ping=!n.ping,n.frame+=1}u.copyBufferToBuffer(i,0,a,0,i.size),t.queue.submit([u.finish()])}function LM(n){n.readbackPending||(n.readbackPending=!0,n.stagingBuffer.mapAsync(1).then(()=>{let e=n.stagingBuffer.getMappedRange();n.readbackData=new Float32Array(new Float32Array(e).slice(0)),n.stagingBuffer.unmap(),n.readbackPending=!1}).catch(()=>{n.readbackPending=!1}))}var qs=class{#e;#t;#i;#r=null;#o=null;#s="uninit";#n;#a=[];#l=new Float32Array(0);constructor(e={}){}setPointer(e,t=performance.now()){!Number.isFinite(e.column)||!Number.isFinite(e.row)||(this.#t={column:e.column,row:e.row,updatedAt:eb(t,performance.now())})}clearPointer(){this.#t=void 0}advance(e){let t=Q1(e.bounds);if(!t)return!1;let r=eb(e.now,performance.now()),o=this.#i===void 0?MM:Math.min(TM,Math.max(0,r-this.#i));if(this.#i=r,o<=0)return!1;this.#c(t),this.#d(e.obstacles??[],t);let i=this.#t&&r-this.#t.updatedAt<=RM?this.#t:void 0;if(i&&this.#r){let a=Math.floor(i.column-t.column),s=Math.floor(i.row-t.row);this.#r.injectVelocity(a,s,Z1*.5,Z1)}if(this.#s==="uninit"&&(this.#s="initializing",AM(t.width,t.height).then(a=>{a?(this.#o=a,this.#s="ready",this.#r&&a.device.queue.writeBuffer(a.obsBuffer,0,new Uint32Array(this.#r.obstacles))):this.#s="failed"}).catch(()=>{this.#s="failed"})),this.#s==="ready"&&this.#o&&(this.#o.readbackData&&this.#r&&(this.#r.macro.set(this.#o.readbackData),this.#o.readbackData=null),OM(this.#o,J1),LM(this.#o)),this.#r){for(let a=0;a<J1;a+=1)this.#r.step();this.#h()}return!0}rasterizeCells(e,t){let r=Q1(e);if(!r)return this.#a=[],this.#a;let{width:o,height:i}=r;this.#u(o,i);let a=this.#r;if(!a)return this.#a;let{macro:s,obstacles:l}=a,d=this.#l,c=P(t.accent,t.text,.3),u=P(t.muted,t.text,.3);for(let h=0;h<i;h+=1)for(let f=0;f<o;f+=1){let p=h*o+f;if(l[p])continue;let m=s[p*3+1],g=s[p*3+2];if(!Number.isFinite(m)||!Number.isFinite(g))continue;let y=Math.sqrt(m*m+g*g),b=d[p]??0,w=Math.abs(b);if(y<.003&&w<5e-4)continue;let x;if(w>.002){let S=Math.min(Qu.length-1,Math.floor(w*2500));x=Qu[S]??Qu[0]}else if(y>.005){let S=Math.atan2(g,m),A=(Math.round(S/(Math.PI/4))%8+8)%8;x=EM[A]??"-"}else x=".";if(x===" ")continue;let k=Math.min(1,y*8+w*800),C=b>0?c:u,T=P(t.background,C,k);this.#a[h][f]={char:x,foreground:T,bold:w>.005}}return this.#a}#c(e){if(this.#e?.width===e.width&&this.#e.height===e.height){this.#e={...e};return}this.#e={...e},this.#r=new rh(e.width,e.height),this.#l=new Float32Array(e.width*e.height),this.#o&&(this.#o=null,this.#s="uninit"),this.#n=void 0}#d(e,t){let r=e.map(o=>`${o.column},${o.row},${o.width},${o.height}`).join("|");if(r!==this.#n&&(this.#n=r,this.#r?.setObstacles(e,t),this.#o&&this.#r)){let o=new Uint32Array(this.#r.obstacles);this.#o.device.queue.writeBuffer(this.#o.obsBuffer,0,o)}}#h(){let e=this.#r;if(!e)return;let{width:t,height:r,macro:o}=e,i=this.#l;for(let a=1;a<r-1;a+=1)for(let s=1;s<t-1;s+=1){let l=a*t+s,d=(o[(a*t+s+1)*3+2]-o[(a*t+s-1)*3+2])*.5,c=(o[((a+1)*t+s)*3+1]-o[((a-1)*t+s)*3+1])*.5;i[l]=d-c}}#u(e,t){if(this.#a.length===t&&(this.#a[0]?.length??-1)===e){for(let r of this.#a)r.fill(void 0);return}this.#a=Array.from({length:t},()=>new Array(e).fill(void 0))}};function Q1(n){if(!Number.isFinite(n.column)||!Number.isFinite(n.row)||!Number.isFinite(n.width)||!Number.isFinite(n.height))return;let e=Math.floor(n.width),t=Math.floor(n.height);if(!(e<=0||t<=0))return{column:Math.floor(n.column),row:Math.floor(n.row),width:e,height:t}}function eb(n,e){return typeof n=="number"&&Number.isFinite(n)?n:e}var Ys=[{id:"metaballs",label:"metaballs",create:()=>new us},{id:"matrix",label:"matrix",create:()=>new ms},{id:"rainy windows",label:"rainy windows",create:()=>new xs},{id:"circuit",label:"circuit",create:()=>new Is},{id:"biomech",label:"biomech",create:()=>new Os},{id:"jungle",label:"jungle",create:()=>new Ns},{id:"vaporwave",label:"vaporwave",create:()=>new Ws},{id:"skull",label:"skull",create:()=>new Hs},{id:"ivy",label:"ivy",create:()=>new js},{id:"fire",label:"fire",create:()=>new Gs},{id:"turbulence",label:"turbulence",create:()=>new qs}];var Ne=ng("section9");function ib(n){return{wallpaper:n.background,wallpaperDot:n.surfaceStrong,chromeActive:n.accent,chromeIdle:n.surfaceStrong,chromeText:n.text,chromeMuted:n.muted,clientGround:n.surface,accent:n.accent,danger:n.danger,shelf:n.surface,menu:n.surfaceStrong,menuSelected:n.accent}}var E=ib(Ne),rn=lu(Ne);function bh(n){Ne=n,E=ib(n),rn=lu(n),Gn()}function ab(n,e){let t=[],r=1;for(let o of n.controls??[]){let i=o.label.length+2;if(r+i>e-1)break;t.push({control:o,from:r,to:r+i}),r+=i+1}return t}function PM(n,e){n.onKey?.({key:e,meta:!1,ctrl:!1,shift:!1,buffer:new Uint8Array})}function NM(){let n,e=()=>(n||(n=se.createMonitor?.()),n);return{id:"exomonitor",controls:[{label:"theme",key:"t"}],title:"exomonitor",summary:"Live dashboard: this host's live sources through the viz layer.",window:{width:62,height:18,minWidth:24,minHeight:8},sample:t=>e()?.sample(t),render(t,r){let o=e();if(o)return o.render(t,r);let i=kn(t,r),a="no live sources on this host";return Je(i[Math.floor(r/2)],Math.max(0,Math.floor((t-a.length)/2)),a,E.chromeMuted,E.clientGround),i},onKey(t){return t.key==="t"?(e()?.cycleTheme(),!0):!1},onPointerDown(){e()?.enableMicrophone()}}}function WM(){let n=["overview","signals","control"],e=0,t=0,r=0,o=()=>L0(n[e]);return{id:"neon",controls:[{label:"\u25C0 demo",key:"left"},{label:"demo \u25B6",key:"right"},{label:"\u25B2 sect",key:"up"},{label:"sect \u25BC",key:"down"}],title:"neon exodus",summary:"The neon component suite, one demo at a time.",window:{width:56,height:17,minWidth:30,minHeight:9},sample(){r+=.05},render(i,a){let s=o(),l=s[t%s.length],d=P0({demo:l,phase:r,width:i,height:Math.max(1,a-1)}),c=[],u=d.body.split(`
`);for(let g=0;g<a-1;g+=1)c.push(Qc(u[g]??"",i,E.clientGround));let h=Qc("",i,E.shelf);c.push(h);let f=` ${l.badge} \xB7 ${n[e]} ${t%s.length+1}/${s.length} `,p="\u2190\u2192 demo \xB7 \u2191\u2193 section",m=c[a-1];return Je(m,0,f,E.chromeText,E.shelf),Je(m,Math.max(f.length+1,i-p.length-1),p,E.chromeMuted,E.shelf),c},onKey(i){if(i.key==="right")t+=1;else if(i.key==="left")t=Math.max(0,t-1);else if(i.key==="down")e=(e+1)%n.length,t=0;else if(i.key==="up")e=(e+n.length-1)%n.length,t=0;else return!1;return!0},onPointerDown(){t+=1}}}function VM(){let n=0,e=r=>{n=Math.max(0,Math.min(n,Math.max(0,Bn.length-r)))},t=r=>Bn[r+n];return{id:"themes",title:"themes",summary:`The shared catalog \u2014 the same ${Bn.length} themes exomux ships. Click to apply.`,window:{width:46,height:16,minWidth:28,minHeight:7},render(r,o){let i=kn(r,o);e(o);for(let a=0;a<o;a+=1){let s=t(a);if(!s)break;let l=s.id===Ne.id;Je(i[a],1,`${l?"\u25CF":" "} ${s.label}`.slice(0,Math.max(4,r-16)),l?E.accent:E.chromeText,E.clientGround);let d=[s.background,s.surface,s.accent,s.success,s.warning,s.danger];for(let c=0;c<d.length;c+=1){let u=r-2-(d.length-c)*2;u<=0||(i[a][u]={char:"\u2588",foreground:d[c],background:E.clientGround},i[a][u+1]={char:"\u2588",foreground:d[c],background:E.clientGround})}}return i},onKey(r){if(r.key==="down")n+=1;else if(r.key==="up")n=Math.max(0,n-1);else return!1;return!0},onPointerDown(r,o){let i=t(o);i&&bh(i)},onWheel(r){return n=Math.max(0,n+r*3),!0},vscroll(){return{offset:n,total:Bn.length}},scrollTo(r){n=r},controls:[{label:"\u25B2",key:"up"},{label:"\u25BC",key:"down"}]}}function DM(){return[{id:"plain",label:"plain \u2014 nothing but the colour"},{id:"dots",label:"dots \u2014 a quiet grid of marks"},...Ys.map(n=>({id:n.id,label:n.label})),...(se.extraBackgrounds??[]).map(n=>({id:n.id,label:n.label}))]}function zM(){let n=0,e=()=>[{label:()=>"THEME",heading:!0,action:()=>{}},{label:()=>"  open the theme gallery \u2014 click a palette to apply",action:()=>qn("themes")},{label:()=>"",action:()=>{}},{label:()=>"BACKGROUND",heading:!0,action:()=>{}},...DM().map(t=>({label:()=>`  ${Ye.wallpaper===t.id?"\u25CF":"\u25CB"} ${t.label}`,action:()=>{Ye.wallpaper=t.id,Gn()}})),...se.audio?[{label:()=>"",action:()=>{}},{label:()=>"BUTTERCHURN AUDIO",heading:!0,action:()=>{}},{label:()=>`  ${se.audio.source()==="noise"?"\u25CF":"\u25CB"} noise generator (default)`,action:()=>se.audio.useNoise()},{label:()=>`  ${se.audio.source()==="microphone"?"\u25CF":"\u25CB"} microphone (request permission)`,action:()=>{se.audio.enableMicrophone()}}]:[],{label:()=>"",action:()=>{}},{label:()=>"BAR",heading:!0,action:()=>{}},{label:()=>`  ${Ye.barHints?"\u25CF":"\u25CB"} show the key hints`,action:()=>{Ye.barHints=!Ye.barHints,Gn()}},...se.shader?[{label:()=>"",action:()=>{}},{label:()=>"SHADERS \u2014 stack any of them",heading:!0,action:()=>{}},...se.shader.list().flatMap(t=>{let r=se.shader,o=i=>{let a=r.option(t.id,i.key)??0;return i.step<.001?a.toFixed(4):i.step<1?a.toFixed(2):String(a)};return[{label:()=>`  ${r.enabled().includes(t.id)?"\u2611":"\u2610"} ${t.label}`,action:()=>{r.toggle(t.id),Gn()}},...r.enabled().includes(t.id)?(t.options??[]).map(i=>({label:()=>`      ${i.label.padEnd(14)} \u25C2 ${o(i)} \u25B8`,action:a=>{let s=r.option(t.id,i.key)??0,l=24+o(i).length/2,d=(a??l+1)<l?-1:1;r.setOption(t.id,i.key,s+d*i.step),Gn()}})):[]]})]:[],{label:()=>"",action:()=>{}},{label:()=>"WINDOWS",heading:!0,action:()=>{}},{label:()=>`  animation speed \u25C2 ${Ve.settings().speed} \u25B8`,action:t=>{let r=Ve.settings(),o=rs.indexOf(r.speed),i=(t??99)<22?-1:1;Ve.setSettings({...r,speed:rs[(o+i+4)%4]}),Gn()}},...ou.map(t=>({label:()=>`  ${t==="maximize"?"max / unmax":t} \u25C2 ${Ve.settings().kinds[t]} \u25B8`,action:r=>{let o=Ve.settings(),i=pi.indexOf(o.kinds[t]),a=(r??99)<15?-1:1,s=pi.length;Ve.setSettings({...o,kinds:{...o.kinds,[t]:pi[(i+a+s)%s]}}),Gn()}})),...[1,.9,.8,.65].map(t=>({label:()=>`  ${Ye.windowOpacity===t?"\u25CF":"\u25CB"} ${t===1?"solid windows":`glass \u2014 ${Math.round(t*100)}% opacity`}`,action:()=>{Ye.windowOpacity=t,Gn()}})),{label:()=>"  recover off-screen windows",action:()=>{J.execute({kind:"recover-all"},ie(),de())}}];return{id:"settings",title:"settings",summary:"Desktop settings: theme, background, the bar.",window:{width:50,height:22,minWidth:26,minHeight:8},render(t,r){let o=kn(t,r),i=e();n=Math.max(0,Math.min(n,Math.max(0,i.length-r)));for(let a=0;a<r;a+=1){let s=i[a+n];if(!s)break;Je(o[a],1,s.label().slice(0,Math.max(0,t-2)),s.heading?E.accent:E.chromeText,E.clientGround)}return n+r<i.length&&r>1&&Je(o[r-1],t-4," \u25BC ",E.chromeMuted,E.clientGround),o},onPointerDown(t,r){e()[r+n]?.action(t)},onKey(t){if(t.key==="down")n+=1;else if(t.key==="up")n=Math.max(0,n-1);else return!1;return!0},onWheel(t){return n=Math.max(0,n+t*3),!0},vscroll(){return{offset:n,total:e().length}},scrollTo(t){n=t},controls:[{label:"\u25B2",key:"up"},{label:"\u25BC",key:"down"}]}}function $M(){let n=["","  DESKTOP","    drag a title bar        move a window","    drag to an edge         snap it there","    double-click the title  maximize / restore","    g                       float <-> tile","    tab                     window switcher","    esc                     close menu / switcher","","  IN A WINDOW","    exomonitor   click for mic \xB7 t theme","    neon         arrows change demo and section","    catalog      arrows walk the renderers","    gallery      click a palette to retheme","    three        arrows change the scene"];return{id:"help",title:"help",summary:"Every key and click the desktop answers to.",window:{width:52,height:17,minWidth:30,minHeight:8},render(e,t){let r=kn(e,t);for(let o=0;o<Math.min(n.length,t);o+=1){let i=n[o],a=i.trim()===i.trim().toUpperCase()&&i.trim().length>0;Je(r[o],0,i,a?E.accent:E.chromeText,E.clientGround)}return r}}}var xn=["background","surface","surfaceStrong","border","text","muted","accent","success","warning","danger"];function HM(){let n=xn.indexOf("accent"),e=(t,r)=>{let o=xn[n],i=Ne[o],a=uu([i[0],i[1],i[2]]),s=ig({l:Math.min(1,Math.max(0,a.l+r)),c:a.c,h:(a.h+t+360)%360});bh({...Ne,id:Ne.id.endsWith("*")?Ne.id:`${Ne.id}*`,label:Ne.label.endsWith(" *")?Ne.label:`${Ne.label} *`,[o]:[s[0],s[1],s[2]]})};return{id:"builder",controls:[{label:"\u25B2 slot",key:"up"},{label:"slot \u25BC",key:"down"},{label:"\u25C0 hue",key:"left"},{label:"hue \u25B6",key:"right"},{label:"\u2212 light",key:"["},{label:"light +",key:"]"}],title:"theme builder",summary:"Edit the live theme slot by slot, in OKLCH.",window:{width:46,height:15,minWidth:30,minHeight:8},render(t,r){let o=kn(t,r);Je(o[0],1,`editing ${Ne.label}`,E.accent,E.clientGround);for(let s=0;s<xn.length;s+=1){let l=s+1;if(l>=r-1)break;let d=xn[s],c=Ne[d],u=uu([c[0],c[1],c[2]]),h=s===n?">":" ";Je(o[l],1,`${h} ${d.padEnd(13)} L${u.l.toFixed(2)} H${Math.round(u.h).toString().padStart(3)}`,s===n?E.accent:E.chromeText,E.clientGround);for(let f=t-8;f<t-2;f+=1)f>0&&(o[l][f]={char:" ",background:c})}let i="\u2190\u2192 hue \xB7 [ ] light \xB7 click row",a=Math.min(r-1,xn.length+1);return Je(o[a],1,i.slice(0,t-2),E.chromeMuted,E.clientGround),o},onKey(t){if(t.key==="left")e(-12,0);else if(t.key==="right")e(12,0);else if(t.key==="[")e(0,-.03);else if(t.key==="]")e(0,.03);else if(t.key==="down")n=(n+1)%xn.length;else if(t.key==="up")n=(n+xn.length-1)%xn.length;else return!1;return!0},onPointerDown(t,r){let o=r-1;o>=0&&o<xn.length&&(n=o)}}}var rb=br(fi("small"),"exowebtui","font"),BM=[{kind:"gap"},{kind:"heading",text:"a desktop of cells, upright amid the ruins",rule:"\u2550"},{kind:"gap"},{kind:"para",text:"Regard what stands before you: exotui, a TUI library for Deno, made manifest in your browser. This is no imitation raised in the image of the modern web \u2014 no port, no likeness. It is the form itself, transmitted without dilution: the same application object that draws this desktop rules equally in a true terminal (`deno task desktop`), through one seam and two presenters \u2014 console and web. Zero additional code paths. Concessions to the spirit of the age: none."},{kind:"gap"},{kind:"para",text:"A tradition survives not by nostalgia but by transmission. All that you see is shared library machinery, held in common between the two worlds:"},{kind:"gap"},{kind:"bullet",text:"the window host \u2014 the engine on which the exomux terminal multiplexer rides: drag, snap, tile (g), minimize, the Tab switcher, double-click to maximize"},{kind:"bullet",text:"the shell painters \u2014 thin borders, title bars, menus, tabs \u2014 one painter for terminal cells and for this canvas alike, as a rite is one across all of its temples"},{kind:"bullet",text:"seventeen themes, an aristocracy of palettes, editable live in the theme builder (OKLCH, slot by slot), persisted per host"},{kind:"bullet",text:"eleven animated backgrounds \u2014 metaballs, matrix, the skull, circuit and their kin \u2014 simulations that flow around your windows and answer your pointer"},{kind:"bullet",text:"the viz layer: twenty-three data visualizations, a live monitor fed by your microphone, Three.js through a WebGPU ASCII pipeline"},{kind:"gap"},{kind:"heading",text:"the discipline of the hand",rule:"\u2500"},{kind:"gap"},{kind:"pair",key:"\u23FB exowebtui",text:"every window; begin at the origin"},{kind:"pair",key:"drag titlebar",text:"move \xB7 edge-drag snaps \xB7 dbl-click max"},{kind:"pair",key:"g",text:"float \u21C4 tile the focused window"},{kind:"pair",key:"tab",text:"window switcher"},{kind:"pair",key:"right-click",text:"context menu, desktop or window \u2014 degauss when the tube grows impure"},{kind:"pair",key:"wheel",text:"scrolls this window; the themes too"},{kind:"gap"},{kind:"heading",text:"of the work itself",rule:"\u2500"},{kind:"gap"},{kind:"para",text:"Ride the tiger of the modern browser: one does not flee the machine, one masters it. exotui is a fork-grown terminal UI library \u2014 signals, layout, components, a markup layer, theme engines, input pipelines, remote rendering \u2014 crowned by the exomux terminal multiplexer, its flagship. The web build you now inhabit is the same package, with a browser presenter in place of a terminal one. What is essential does not negotiate with its medium."},{kind:"gap"},{kind:"link",text:"jsr.io/@ubernaut/exotui"},{kind:"link",text:"github.com/ubernaut/exotui"},{kind:"gap"}];function Mi(n,e,t,r){let o=[],i=e,a=e.length;for(let s of n.split(/\s+/)){let l=i.length>a?`${i} ${s}`:i+s;l.length>r&&i.length>a?(o.push(i),i=t+s,a=t.length):i=l}return o.push(i),o}function FM(){let n=0,e=rb.reduce((o,i)=>Math.max(o,i.length),0),t,r=o=>{if(t?.width===o)return t.lines;let i=[];if(e<=o)for(let a of rb)i.push({text:a,accent:!0});else i.push({text:"",accent:!1}),i.push({text:o>=19?"E X O W E B T U I":"EXOWEBTUI",accent:!0});for(let a of BM)if(a.kind==="gap")i.push({text:"",accent:!1});else if(a.kind==="heading"){for(let s of Mi(a.text,"","",o))i.push({text:s,accent:!0});i.push({text:a.rule.repeat(Math.min(o,a.text.length)),accent:!0})}else if(a.kind==="para")for(let s of Mi(a.text,"","",o))i.push({text:s,accent:!1});else if(a.kind==="bullet")for(let s of Mi(a.text,"\u25AA ","  ",o))i.push({text:s,accent:!1});else if(a.kind==="pair")if(o>=34){let s=" ".repeat(15);for(let l of Mi(a.text,a.key.padEnd(15),s,o))i.push({text:l,accent:!1})}else{i.push({text:a.key,accent:!0});for(let s of Mi(a.text,"  ","  ",o))i.push({text:s,accent:!1})}else i.push({text:`  ${a.text}`,accent:!0});return t={width:o,lines:i},i};return{id:"about",title:"welcome",summary:"What this whole thing is. Scroll it.",window:{width:64,height:20,minWidth:30,minHeight:8},render(o,i){let a=kn(o,i),s=r(Math.max(12,o-3));n=Math.max(0,Math.min(n,Math.max(0,s.length-i)));for(let l=0;l<i;l+=1){let d=s[l+n];if(!d)break;Je(a[l],1,d.text.slice(0,Math.max(0,o-2)),d.accent?E.accent:E.chromeText,E.clientGround)}return a},onKey(o){if(o.key==="down")n+=1;else if(o.key==="up")n=Math.max(0,n-1);else if(o.key==="pagedown"||o.key==="space")n+=8;else if(o.key==="pageup")n=Math.max(0,n-8);else if(o.key==="home")n=0;else return!1;return!0},onWheel(o){return n=Math.max(0,n+o*3),!0},vscroll(o){return{offset:n,total:r(Math.max(12,o-3)).length}},scrollTo(o){n=o},controls:[{label:"\u25B2",key:"up"},{label:"\u25BC",key:"down"}]}}function jM(){let n=dc({capacity:240}),e=np({capacity:240}),t=rp({capacity:60}),r=op({capacity:8}),o=0,i=0,a=Pa({}),s=l=>{if(l.startsWith("0d"))return n;if(l.startsWith("1d"))return e;if(l.startsWith("2d"))return t;if(l.startsWith("3d"))return r};return{id:"viz",controls:[{label:"\u25C0 prev",key:"left"},{label:"next \u25B6",key:"right"}],title:"visualization catalog",summary:`All ${za.length} visualizations, one at a time, on sample data.`,window:{width:52,height:16,minWidth:20,minHeight:6},sample(l){o+=1;let d=.5+.45*Math.sin(o/19);n.push(d,l),e.push(Array.from({length:12},(c,u)=>.5+.5*Math.sin(o/13+u/1.7)),l),o%4===0&&(t.push(Array.from({length:14},(c,u)=>Array.from({length:14},(h,f)=>.5+.5*Math.sin(u/2.2+o/17)*Math.cos(f/2.6))),l),r.push(Array.from({length:8},(c,u)=>Array.from({length:8},(h,f)=>Array.from({length:8},(p,m)=>Math.max(0,Math.sin(u/1.8+o/23)*Math.cos(f/2-m/2.4))))),l))},render(l,d){let c=za,u=c[(i%c.length+c.length)%c.length],h=typeof u.accepts=="string"?u.accepts:u.accepts[0],f=s(h),p=kn(l,d),m=Math.max(1,d-1);if(f){let y=Rc(u,f,{size:{width:l,height:m},theme:a});Ga(p,{column:0,row:0},y),sb(p,E.clientGround)}let g=p[d-1];if(g&&d>=2){for(let w=0;w<l;w+=1)g[w]={char:" ",background:E.shelf};let y=(i%c.length+c.length)%c.length;Je(g,0,` ${u.id} \xB7 ${h} \xB7 ${y+1}/${c.length} `,E.chromeText,E.shelf);let b="\u2190\u2192 \xB7 sample data";Je(g,Math.max(0,l-b.length-1),b,E.chromeMuted,E.shelf)}return p},onKey(l){if(l.key==="right")i+=1;else if(l.key==="left")i-=1;else return!1;return!0},onPointerDown(){i+=1}}}function GM(){let n=dc({capacity:120}),e=Pa({}),t=za.find(r=>r.id==="dial");return{id:"clock",title:"clock",summary:"The real time of day, through dial and readout.",window:{width:30,height:10,minWidth:14,minHeight:5},sample(r){n.push(new Date().getSeconds()/60,r)},render(r,o){let i=kn(r,o);if(t&&o>=3){let l=Rc(t,n,{size:{width:r,height:Math.max(1,o-2)},theme:e});Ga(i,{column:0,row:0},l),sb(i,E.clientGround)}let a=new Date().toLocaleTimeString(),s=Math.max(0,o-1);return Je(i[s],Math.max(0,Math.floor((r-a.length)/2)),a,E.accent,E.clientGround),i}}}function UM(){return{id:"three",controls:[{label:"\u25C0 scene",key:"left"},{label:"scene \u25B6",key:"right"}],title:"three ascii",summary:"Three.js through the WebGPU ASCII pipeline. Loads on launch.",window:{width:58,height:18,minWidth:28,minHeight:8},render(n,e){let t=kn(n,e),r=se.threeOverlay?.state()??"unavailable",o=r==="loading"?"loading three + webgpu\u2026":r==="unavailable"?"webgpu unavailable in this browser":"focus this window to render";if(Je(t[Math.floor(e/2)],Math.max(0,Math.floor((n-o.length)/2)),o,E.chromeMuted,E.clientGround),r==="ready"&&e>=2){let i=t[e-1];for(let s=0;s<n;s+=1)i[s]={char:" ",background:E.shelf};Je(i,0,` ${se.threeOverlay?.sceneName()??""} `,E.chromeText,E.shelf);let a="\u2190\u2192 scene";Je(i,Math.max(0,n-a.length-1),a,E.chromeMuted,E.shelf)}return t},onKey(n){let e=se.threeOverlay;if(!e||e.state()!=="ready")return!1;if(n.key==="right")e.cycleScene(1);else if(n.key==="left")e.cycleScene(-1);else return!1;return!0}}}function sb(n,e){for(let t of n)for(let r=0;r<t.length;r+=1){let o=t[r];o.background===void 0&&(t[r]={char:o.char,foreground:o.foreground,background:e})}}var tl={topLeft:"\u250C",top:"\u2500",topRight:"\u2510",left:"\u2502",right:"\u2502",bottomLeft:"\u2514",bottom:"\u2500",bottomRight:"\u2518"};function So(n){let e=(t,r,o,i)=>{let a=n[r];!a||t<0||t>=a.length||(a[t]={char:o,foreground:i.foreground,background:i.background})};return{cell:e,write(t,r,o,i){let a=[...o];for(let s=0;s<a.length;s+=1)e(t+s,r,a[s],i)},fill(t,r,o){for(let i=t.row;i<t.row+t.height;i+=1)for(let a=t.column;a<t.column+t.width;a+=1)e(a,i,r,o)}}}function kn(n,e){let t=[];for(let r=0;r<e;r+=1){let o=[];for(let i=0;i<n;i+=1)o.push({char:" ",background:E.clientGround});t.push(o)}return t}function Je(n,e,t,r,o){for(let i=0;i<t.length;i+=1)e+i<0||e+i>=n.length||(n[e+i]={char:t[i],foreground:r,background:o})}var xo=[FM(),NM(),WM(),jM(),UM(),GM(),$0(n=>se.copyText?.(n)),VM(),HM(),zM(),$M()],Xe=new Map(xo.map(n=>[n.id,n])),KM={about:"\u25C6",exomonitor:"\u2581\u2584\u2582\u2587",neon:"\u2591\u2592\u2593",viz:"\u25EB",three:"\u25F1",clock:"\u25D4",themes:"\u25A4",builder:"\u270E",settings:"\u2699",help:"?"},qM=new Set(["settings","workbench"]),lb=[...xo.map(n=>({id:n.id,glyph:KM[n.id]??"\xB7",title:n.title,summary:n.summary,separatorBefore:qM.has(n.id)})),{id:"workbench",glyph:"\u2197",title:"api workbench",summary:"The interactive API reference, on its own page.",href:"./workbench.html",separatorBefore:!0},{id:"jsr",glyph:"\u2197",title:"jsr.io/@ubernaut/exotui",summary:"The package this desktop is built from.",href:"https://jsr.io/@ubernaut/exotui"},{id:"github",glyph:"\u2197",title:"github.com/ubernaut/exotui",summary:"Source, issues, and the plan directory.",href:"https://github.com/ubernaut/exotui"}],nt=[...lb],se={},Kn={columns:100,rows:32},YM=Nh({}),J=Xm({workspace:YM,ownerId:"web-desktop",snapDistance:2,snapOnRelease:!0,historyCapacity:80,compactMode:"auto",windows:xo.map((n,e)=>({id:n.id,title:n.title,minWidth:n.window.minWidth,minHeight:n.window.minHeight,state:n.id==="about"?"normal":"closed",placement:"floating",floatingRect:{column:4+e*3,row:2+e*2,width:n.window.width,height:n.window.height}}))}),lt=()=>Kn.columns,on=()=>Kn.rows,ie=()=>({column:0,row:1,width:lt(),height:Math.max(1,on()-1)}),vo=()=>({column:0,row:0,width:lt(),height:1}),de=()=>({shelfBounds:vo(),doubleClickMaximizeMs:400}),Ye={wallpaper:"butterchurn",barHints:!0,windowOpacity:.9},pt,ah="",sh=0,db=125,cb=db,ub=0,oh,ob="";function XM(n,e,t){let r=Math.max(0,Math.min(1,t));return[Math.round(n[0]+(e[0]-n[0])*r),Math.round(n[1]+(e[1]-n[1])*r),Math.round(n[2]+(e[2]-n[2])*r)]}function JM(){let n=Ye.wallpaper;if(ah===n)return pt;let e=pt;e&&typeof e.dispose=="function"&&e.dispose();let t=Ys.find(r=>r.id===n)??se.extraBackgrounds?.find(r=>r.id===n)??Ys.find(r=>r.id==="circuit");return pt=t?.create(),cb=t?.fps?1e3/t.fps-1:db,ah=n,sh=0,pt}var Yn=()=>lt()<72||on()<20,We=!1,rt=0,Tr=0,ZM=.55,lh=" \u222A degauss ";function hb(){if(!se.shader)return;let n=lh.length;if(!(lt()<n+2||on()<4))return{column:lt()-n-1,row:on()-2,width:n,height:1}}var dh,ch=!1,Ze,st,Te,zt;function QM(n){let e=zt;if(!e)return;let t=el(),r=Xe.get(e.windowId);if(t?.id!==e.windowId||!r?.scrollTo||se.reducedMotion?.()){zt=void 0;return}let o=Math.max(0,Math.min(270,n-e.started)),i=e.distance*(1-Math.exp(-o/90)),a=r.vscroll?.(t.clientRect.width,t.clientRect.height);if(!a){zt=void 0;return}let s=Math.trunc(i),l=a.offset+s-e.applied,d=Math.max(0,Math.min(a.total-t.clientRect.height,l));d!==a.offset&&r.scrollTo(d),e.applied=s,(o>=270||l!==d)&&(zt=void 0)}var Dt,jn=!1,fb=new Map,Un,uh,kt=!1,Xs=!1,hh="desktop-degauss-alert";function ko(){let n=Math.max(1,Math.min(64,lt()-2)),e=Math.max(1,Math.min(14,on()-2)),t={column:Math.floor((lt()-n)/2),row:Math.floor((on()-e)/2),width:n,height:e},r=e>=12?7:Math.max(1,Math.min(3,e-2)),o=n>=8?3:0;return{rect:t,button:{column:t.column+o,row:t.row+Math.max(0,e-r-2),width:Math.max(1,n-o*2),height:r}}}function yh(){kt=!1,J.overlays.remove(hh)}function Js(){se.shader?.degauss(),yh(),Xs=!0}function e6(){let n=se.shader,e=n?.magnetism()??0;if(!n?.enabled().includes("degauss")||e<1){e<1&&(Xs=!0),kt&&yh();return}Xs&&(kt?J.overlays.update(hh,{rect:ko().rect}):(uh&&J.handlePointer({...uh,kind:"cancel"},ie(),de()),st=void 0,jn=!1,Te=void 0,kt=!0,We=!1,Ze=void 0,Un=void 0,J.overlays.register({id:hh,ownerId:"desktop-alert",rect:ko().rect,layer:"modal",kind:"modal",modal:!0,visible:!0})))}function t6(n,e){if(!kt)return;let{rect:t,button:r}=ko();as(So(n),t,[],{panelFill:{foreground:E.chromeText,background:E.menu},borderGlyphs:tl,borderStyle:{foreground:E.danger,background:E.menu,bold:!0},rowStyle:{foreground:E.chromeText,background:E.menu},dangerForeground:E.danger}),t.height>=9&&ge(n,t.column+2,t.row+2,"DISTORTION AT MAXIMUM".slice(0,t.width-4),{foreground:E.danger,background:E.menu}),t.height>=12&&ge(n,t.column+2,t.row+3,"Reset the magnetic field to clear the picture.".slice(0,t.width-4),{foreground:E.chromeText,background:E.menu});let o=Math.floor(e/600)%2===0?E.danger:E.accent;Ri(n,r,o);let i=br(fi("small"),"DEGAUSS","font"),a=r.height>=7&&r.width>=i[0].length+2?i:["DEGAUSS"],s=r.row+Math.max(0,Math.floor((r.height-a.length)/2));for(let l=0;l<a.length;l++)ge(n,r.column+Math.max(0,Math.floor((r.width-a[l].length)/2)),s+l,a[l].slice(0,r.width),{foreground:rn,background:o})}function nl(){if(!Dt)return;let{windowId:n,from:e,to:t}=Dt;return t.y<e.y||t.y===e.y&&t.x<e.x?{windowId:n,from:t,to:e}:{windowId:n,from:e,to:t}}function n6(){let n=nl();return n?J.project(ie(),de()).windows.find(t=>t.id===n.windowId)?.clientRect:void 0}function r6(n,e){let t=nl();return!(!t||e<t.from.y||e>t.to.y||e===t.from.y&&n<t.from.x||e===t.to.y&&n>t.to.x)}function wh(){let n=se.selectionText?.();if(n)return n;let e=nl(),t=n6();if(!e||!t)return"";let r=[];for(let o=e.from.y;o<=e.to.y;o+=1){let i=fb.get(e.windowId)?.[o]??[],a=o===e.from.y?e.from.x:0,s=o===e.to.y?e.to.x:t.width-1,l="";for(let d=a;d<=s&&d<i.length;d+=1)l+=i[d]??" ";r.push(l.replace(/\s+$/,""))}return r.join(`
`)}var Ve=new ns(n=>Xe.get(n)?.liveClient===!0);function o6(n,e,t){let r=Math.min(Math.max(18,t.reduce((i,a)=>Math.max(i,a.label.length),0)+4),Math.max(10,lt()-n-1)),o=t.length+2;Ze={rect:{column:Math.min(n,Math.max(0,lt()-r)),row:Math.min(e,Math.max(1,on()-o)),width:r,height:o},items:t}}function i6(n,e){let t=wh(),r=se.copyText&&t.trim()?[{label:"copy selected text",action:()=>{se.copyText?.(t)}}]:[],o=[{label:"settings",action:()=>qn("settings")},{label:"themes",action:()=>qn("themes")},...se.shader?[{label:"degauss",action:Js}]:[],{label:"help",action:()=>qn("help")}],a=[...J.project(ie(),de()).windows].reverse().find(s=>mt(s.rect,n,e));if(a){let s=a.id,l=a.state==="maximized";return[...r,{label:l?"restore":"maximize",action:()=>J.execute({kind:"toggle-maximize",id:s},ie(),de())},{label:"minimize",action:()=>J.execute({kind:"minimize",id:s},ie(),de())},{label:a.placement==="floating"?"tile":"float",action:()=>J.execute({kind:"toggle-placement",id:s},ie(),de())},{label:"close",danger:!0,action:()=>J.execute({kind:"close",id:s},ie(),de())},...o]}return[...r,...o]}function a6(n){if(!Ze)return;let{rect:e,items:t}=Ze;as(So(n),e,t.map((r,o)=>({rect:{column:e.column+1,row:e.row+1+o,width:e.width-2,height:1},label:` ${r.label}`,danger:r.danger})),{panelFill:{foreground:E.chromeText,background:E.menu},borderGlyphs:tl,borderStyle:{foreground:E.accent,background:E.menu,bold:!0},rowStyle:{foreground:E.chromeText,background:E.menu},dangerForeground:E.danger})}function Zs(){let n=Yn(),e=n?lt():Math.min(46,Math.max(24,lt()-4)),t=n||on()<nt.length*2+6?1:2,r=2;for(let u of nt)r+=t+(u.separatorBefore?1:0);let o=Math.min(r,on()-2),i={column:n?0:1,row:1,width:e,height:o},a=[],s=i.row+1,l=i.row+i.height-1,d=u=>t+(nt[u]?.separatorBefore?1:0);Tr=Math.min(Tr,rt);let c=0;for(let u=Tr;u<=rt;u++)c+=d(u);for(;c>l-s&&Tr<rt;)c-=d(Tr++);for(let u=0;u<nt.length;u++){if(u<Tr){a.push(void 0);continue}nt[u].separatorBefore&&(s+=1),a.push(s+t<=l?{column:i.column+1,row:s,width:Math.max(0,i.width-2),height:t}:void 0),s+=t}return{rect:i,itemRects:a,dense:t===1}}var wo=" \u23FB exowebtui ",rl=0;function mb(n){let e=Xe.get(n),t=ie(),r=Math.max(e?.window.minWidth??20,Math.min(Math.round(t.width*(e?.window.widthRatio??.52)),Math.max(e?.window.width??48,Math.round(t.width*.4)))),o=Math.max(e?.window.minHeight??6,Math.min(Math.round(t.height*(e?.window.heightRatio??.62)),Math.max(e?.window.height??14,Math.round(t.height*.45)))),i=Math.max(2,Math.round(t.width*.06)),a=2,s=rl%5,l=Math.min(2+s*i,Math.max(0,t.width-r-1)),d=Math.min(1+s*a,Math.max(0,t.height-o-1));return{column:l,row:d,width:Math.min(r,t.width),height:Math.min(o,t.height)}}function qn(n){let e=J.controller.inspect().maximizedWindowId;e&&e!==n&&J.execute({kind:"restore",id:e},ie(),de());let t=J.controller.inspect().windows.find(r=>r.id===n)?.state==="closed";J.execute({kind:"restore",id:n},ie(),de()),t&&(J.execute({kind:"set-placement",id:n,placement:"floating",rect:mb(n)},ie(),de()),rl+=1),mh(n)&&J.execute({kind:"maximize",id:n},ie(),de()),fh.set(n,mh(n)),J.execute({kind:"focus",id:n},ie(),de())}function ih(){let n=J.controller.inspect().activeWindowId;if(n&&Xe.get(n)?.window.fullscreenBelow!==void 0&&se.viewportWidth){let t=mh(n);if(fh.get(n)!==t&&(J.execute({kind:t?"maximize":"restore",id:n},ie(),de()),fh.set(n,t)),t)return;J.execute({kind:"recover-all"},ie(),de());return}if(Yn()){n&&J.execute({kind:"maximize",id:n},ie(),de());return}let e=J.controller.inspect().maximizedWindowId;e&&J.execute({kind:"restore",id:e},ie(),de()),J.execute({kind:"recover-all"},ie(),de())}var fh=new Map;function mh(n){let e=Xe.get(n)?.window.fullscreenBelow;return e!==void 0&&se.viewportWidth?se.viewportWidth()<e:Yn()}function pb(n){if(We=!1,n.href){se.openExternal?.(n.href);return}n.id==="three"&&se.threeOverlay?.ensure(),qn(n.id)}function s6(){let n=se.threeOverlay;if(!n||n.state()!=="ready")return;let e=J.project(ie(),de()),t=e.windows[e.windows.length-1];if(!(!We&&!kt&&Ve.status().length===0&&t?.id==="three"&&t.state!=="minimized"&&t.clientRect.width>0&&t.clientRect.height>1)){n.setRect(null);return}let o=t.clientRect;n.setRect({column:o.column,row:o.row,width:o.width,height:o.height-1})}function l6(n,e,t){let r=Ye.windowOpacity,o=Math.max(0,e.rect.column),i=r<1?Array.from({length:e.rect.height},(c,u)=>n[e.rect.row+u]?.slice(o,e.rect.column+e.rect.width)??[]):void 0,a=Xe.get(e.id),s=e.active?E.chromeIdle:E.wallpaperDot;Z0(So(n),e,{surfaceFill:{foreground:E.chromeText,background:s},borderGlyphs:tl,borderForeground:e.active?E.accent:E.chromeMuted,chromeGround:au(s),titleBarGround:au(e.active?E.chromeActive:E.chromeIdle),titleBarFillForeground:E.chromeText,titleText:e.title,titleForeground:e.active?rn:E.chromeMuted,titleBold:e.active,controlBold:c=>c.tone==="danger"||e.active,controlForeground:e.active?rn:E.chromeMuted});let l=e.clientRect;if(l.width<=0||l.height<=0)return;if(a){Ga(n,{column:l.column,row:l.row},a.render(l.width,l.height,t,Ne));let c=a.vscroll?.(l.width,l.height);if(c&&c.total>l.height&&l.height>=2&&l.width>=2){let u=yb(a,l.height),h=Math.max(1,Math.floor(u*l.height/c.total)),f=Math.max(1,c.total-l.height),p=Math.min(u-h,Math.round(c.offset/f*(u-h))),m=l.column+l.width-1;for(let g=0;g<u;g+=1){let y=n[l.row+g];if(!y||m<0||m>=y.length)continue;let b=g>=p&&g<p+h;y[m]={char:b?"\u2588":"\u2591",foreground:b?E.accent:E.chromeMuted,background:E.clientGround}}}if(a.controls&&a.controls.length>0&&l.height>=3){let u=l.row+l.height-1,h=n[u];if(h){for(let f=0;f<l.width;f+=1){let p=l.column+f;p<0||p>=h.length||(h[p]={char:" ",foreground:E.chromeMuted,background:E.chromeIdle})}for(let f of ab(a,l.width)){let p=` ${f.control.label} `;for(let m=0;m<p.length;m+=1){let g=l.column+f.from+m;g<0||g>=h.length||(h[g]={char:p[m],foreground:rn,background:E.accent})}}}}}else Ri(n,l,E.clientGround);fb.set(e.id,Array.from({length:l.height},(c,u)=>Array.from({length:l.width},(h,f)=>n[l.row+u]?.[l.column+f]?.char??" ")));let d=nl();if(d&&d.windowId===e.id)for(let c=d.from.y;c<=d.to.y;c+=1){let u=l.row+c,h=n[u];if(!(!h||c<0||c>=l.height))for(let f=0;f<l.width;f+=1){if(!r6(f,c))continue;let p=l.column+f;if(p<0||p>=h.length)continue;let m=h[p];h[p]={char:m.char,foreground:m.background??E.clientGround,background:m.foreground??E.chromeText}}}if(i){let c=Math.min(1,r+(1-r)/2);for(let u=e.rect.row;u<e.rect.row+e.rect.height;u+=1){let h=n[u];if(!h)continue;let f=u>=l.row&&u<l.row+l.height;for(let p=e.rect.column;p<e.rect.column+e.rect.width;p+=1){if(p<0||p>=h.length)continue;let m=h[p];if(!m.background)continue;let g=f&&p>=l.column&&p<l.column+l.width,y=i[u-e.rect.row]?.[p-o],b=J0(y?.char??" ",y?.foreground,y?.background??E.wallpaper);h[p]={char:m.char,foreground:m.foreground,background:XM(b,m.background,g?r:c)}}}}}function Ri(n,e,t){for(let r=e.row;r<e.row+e.height;r+=1){let o=n[r];if(o)for(let i=e.column;i<e.column+e.width;i+=1)i<0||i>=o.length||(o[i]={char:" ",background:t})}}var Qs=[],gb=new Map;function d6(){let n=J.controller.inspect();return n.windows.filter(e=>e.state!=="closed"&&e.declaredVisible).map(e=>({id:e.id,label:e.title??e.id,active:e.id===n.activeWindowId,dimmed:e.state==="minimized"}))}function c6(n){let e=vo();Ri(n,e,E.shelf),ge(n,0,e.row,wo,{foreground:We?E.wallpaper:E.accent,background:We?E.accent:E.shelf});let t=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),r=d6(),o={column:wo.length+1,row:e.row,width:Math.max(0,lt()-wo.length-1),height:1};Qs=eg(So(n),o,r,{activeTab:{foreground:rn,background:E.chromeActive},tab:{foreground:E.chromeMuted,background:E.wallpaperDot},dimmedTab:{foreground:E.chromeMuted,background:E.wallpaperDot}},t.length+2),gb=new Map(r.map(a=>[a.id,a.dimmed])),ge(n,Math.max(0,lt()-t.length-1),e.row,t,{foreground:E.chromeMuted,background:E.shelf});let i=Yn()||!Ye.barHints?"":"drag \xB7 dbl-click max \xB7 tab switch \xB7 g tile";if(i.length>0){let a=lt()-t.length-i.length-4,s=Qs.at(-1);a>(s?s.rect.column+s.rect.width+2:wo.length+2)&&ge(n,a,e.row,i,{foreground:E.chromeMuted,background:E.shelf})}}function u6(n,e){let t=e.rect;as(So(n),t,[],{panelFill:{foreground:E.chromeText,background:E.menu},borderGlyphs:tl,borderStyle:{foreground:E.accent,background:E.menu,bold:!0},rowStyle:{foreground:E.chromeText,background:E.menu},dangerForeground:E.danger}),ge(n,t.column+2,t.row,` ${se.startLabel??"exowebtui"} `,{foreground:E.accent,background:E.menu});for(let o=0;o<nt.length;o+=1){let i=nt[o],a=e.itemRects[o];if(!a)continue;i.separatorBefore&&ge(n,t.column+1,a.row-1,"\u2500".repeat(Math.max(0,t.width-2)),{foreground:E.wallpaperDot,background:E.menu});let s=o===rt,l=s?E.menuSelected:E.menu;s&&Ri(n,a,E.menuSelected),ge(n,t.column+1,a.row,i.glyph.slice(0,4),{foreground:s?rn:E.accent,background:l}),ge(n,t.column+6,a.row,i.title.slice(0,Math.max(0,t.width-7)),{foreground:s?rn:E.chromeText,background:l}),a.height>1&&ge(n,t.column+6,a.row+1,i.summary.slice(0,Math.max(0,t.width-7)),{foreground:E.chromeMuted,background:l})}let r=Yn()?"tap to open":"\u2191\u2193 \xB7 enter \xB7 esc";ge(n,t.column+Math.max(1,t.width-r.length-1),t.row+t.height-1,r,{foreground:E.chromeMuted,background:E.menu})}var h6=Pa({});function f6(n,e,t,r){let o=Ye.wallpaper;if(o==="plain")return;if(o==="dots"){for(let c=1;c<t;c+=3)for(let u=c%2===0?2:4;u<e;u+=6)n[c][u]={char:"\xB7",foreground:E.wallpaperDot,background:E.wallpaper};return}let i=JM();if(!i)return;let a=ie(),s=!1;if(r-sh>=cb){sh=r,ub+=1;let c=J.project(a,de());s=i.advance({bounds:a,obstacles:c.windows.map(u=>u.rect),now:r})}let l=`${ah}|${Ne.id}|${a.width}x${a.height}`;(s||!oh||ob!==l)&&(oh=i.rasterizeCells(a,Ne),ob=l);let d=oh;for(let c=0;c<d.length;c+=1){let u=d[c];if(u)for(let h=0;h<u.length;h+=1){let f=u[h];if(!f)continue;let p=n[a.row+c];!p||a.column+h>=p.length||(p[a.column+h]=f.char==="\u2588"?{char:" ",background:f.foreground}:{char:f.char,foreground:f.foreground,background:E.wallpaper})}}}var Ti=[],ph=!1,bb,gh={};function m6(n,e){let t=lt(),r=on(),o=zp({width:t,height:r},h6);Ri(o,{column:0,row:0,width:t,height:r},E.wallpaper),f6(o,t,r,n);let i=J.project(ie(),de());Ve.beginFrame({now:n,bounds:ie(),windows:i.windows,states:J.controller.inspect().windows,reducedMotion:se.reducedMotion?.(),anchor:d=>Qs.find(c=>c.id===d)?.rect});let a=d=>Ve.paintWindow(o,d,()=>l6(o,d,n));for(let d of i.tiledWindows)a(d);for(let d of i.separators){let c=d.axis==="column"?"\u2502":"\u2500";for(let u=d.rect.row;u<d.rect.row+d.rect.height;u+=1)for(let h=d.rect.column;h<d.rect.column+d.rect.width;h+=1)o[u]?.[h]!==void 0&&(o[u][h]={char:c,foreground:E.chromeMuted,background:E.wallpaper})}for(let d of i.floatingWindows)a(d);if(Ve.paintOverlays(o),i.switcher){let d=Q0(So(o),i.switcher,ie(),{colors:{panelFill:{foreground:E.chromeText,background:E.menu},frame:{foreground:E.accent,background:E.menu,bold:!0},item:{foreground:E.chromeText,background:E.menu},selectedItem:{foreground:rn,background:E.menuSelected,bold:!0}}});e.push(d)}if(i.snapPreview){let d=i.snapPreview.rect;e.push({...d,height:1}),ge(o,d.column,d.row,"\u250C".padEnd(Math.max(1,d.width-1),"\u2500")+"\u2510",{foreground:E.accent,background:E.wallpaper})}if(pt&&ag(pt)){let d=ie();for(let c of pt.rasterizeOverlayCells(d,Ne)){let u=o[d.row+c.row];if(!u||d.column+c.column>=u.length)continue;let h=u[d.column+c.column];u[d.column+c.column]={char:c.cell.char,foreground:c.cell.foreground,background:h.background??E.wallpaper}}}if(c6(o),e.push(vo()),We){let d=Zs();e.push(d.rect),u6(o,d)}Ze&&e.push(Ze.rect),kt&&e.push(ko().rect),a6(o);let s=hb();if(s&&se.shader){e.push(s);let c=se.shader.magnetism()>=ZM,u=c&&Math.floor(n/380)%2===0,h=u?E.danger:c?E.accent:E.chromeIdle,f=u||c?rn:E.chromeText,p=o[s.row];if(p)for(let m=0;m<lh.length;m+=1){let g=s.column+m;g<0||g>=p.length||(p[g]={char:lh[m],foreground:f,background:h})}}t6(o,n);let l=lg(ch,dh,J.project(ie(),de()),Ze===void 0&&!We);if(l){let d=o[l.row];if(d&&l.column>=0&&l.column<d.length){let c=d[l.column];d[l.column]={char:l.glyph,foreground:E.accent,background:c.background}}}return Ti=o,o}function p6(n){e6(),(kt||We||Ze)&&(zt=void 0),QM(n);for(let o of xo)o.sample?.(n);let e=[],t=m6(n,e);s6();let r=J.project(ie(),de());return se.onWindows?.(r.windows,We||Ze!==void 0||kt||r.switcher!==void 0,Ne,Ve.status().length>0,e),t}function mt(n,e,t){return e>=n.column&&e<n.column+n.width&&t>=n.row&&t<n.row+n.height}function yb(n,e){return e-(e>=3&&n.controls?.length?1:0)}function g6(n,e,t,r){let{width:o,height:i}=e;if(!n?.scrollTo||o<2||i<2||t!==e.column+o-1)return!1;let a=r-e.row,s=yb(n,i);if(a>=s)return!1;let l=n.vscroll?.(o,i);return!l||l.total<=i?!1:(n.scrollTo(Math.round((l.total-i)*a/(s-1))),!0)}function el(){return J.project(ie(),de()).windows.find(e=>e.active)}function b6(n){if(n.device==="touch"&&!n.primary)return;(n.kind==="down"||n.kind==="cancel")&&(zt=void 0),uh=n;let e=n.coordinates.cell;if(!e)return;let{x:t,y:r}=e;if(bb={x:t,y:r,kind:`${n.kind}:${n.device}`},n.device==="touch"||n.kind==="leave"?(ch=!1,dh=void 0):(ch=!0,dh={column:t,row:r}),gh[`${n.kind}:${n.device}`]=(gh[`${n.kind}:${n.device}`]??0)+1,kt){n.kind==="down"&&n.primary&&n.button!==2&&mt(ko().button,t,r)?Js():(n.kind==="up"||n.kind==="cancel")&&J.handlePointer({...n,kind:"cancel"},ie(),de());return}if(n.kind==="move"&&pt&&pt.setPointer({column:t,row:r}),Ze){if(n.kind!=="down")return;let{rect:i,items:a}=Ze,s=r-i.row-1;Ze=void 0,mt(i,t,r)&&s>=0&&s<a.length&&a[s].action();return}if(n.kind==="down"&&n.button===2){We=!1,o6(t,r,i6(t,r));return}if(n.kind==="down"&&n.button!==2){let i=hb();if(i&&mt(i,t,r)){Js();return}}if(n.kind==="down"&&n.button!==2){let i=J.project(ie(),de()),a=[...i.windows].reverse().find(l=>mt(l.rect,t,r)),s=a!==void 0&&mt(a.clientRect,t,r);if(s&&n.primary&&!a.active&&J.execute({kind:"focus",id:a.id},ie(),de()),s&&n.primary&&(n.button===0||n.device==="touch")&&!We&&!i.switcher&&r!==vo().row&&g6(Xe.get(a.id),a.clientRect,t,r)){Un=void 0,st=void 0,Dt=void 0;return}Un=s&&Xe.get(a.id)?.onPointerUp?{windowId:a.id,x:t,y:r}:void 0,s&&n.device==="touch"?(Te=Xe.get(a.id)?.onWheel?{windowId:a.id,startY:r,lastY:r,lastMove:n.timestamp,velocity:0,applied:0,active:!1}:void 0,st=void 0):(Te=void 0,st=s?{windowId:a.id,local:{x:t-a.clientRect.column,y:r-a.clientRect.row}}:void 0),Dt&&(Dt=void 0)}else if(n.kind==="move"&&n.device==="touch"&&Te){if(Te.lastY!==r){let a=n.timestamp-Te.lastMove;Te.velocity=a>0&&a<=90?(Te.lastY-r)/a:0,Te.lastY=r,Te.lastMove=n.timestamp}let i=Te.startY-r;if(Te.active||Math.abs(i)>=2){Te.active||(J.handlePointer({...n,kind:"cancel"},ie(),de()),Te.active=!0);let a=Math.trunc(i/3),s=Xe.get(Te.windowId);for(;Te.applied<a;)s?.onWheel?.(1,t,r),Te.applied+=1;for(;Te.applied>a;)s?.onWheel?.(-1,t,r),Te.applied-=1;return}}else if(n.kind==="move"&&st){let a=J.project(ie(),de()).windows.find(s=>s.id===st.windowId);if(!a)st=void 0,jn=!1;else{let s={x:Math.max(0,Math.min(a.clientRect.width-1,t-a.clientRect.column)),y:Math.max(0,Math.min(a.clientRect.height-1,r-a.clientRect.row))},l=Math.abs(s.x-st.local.x)+Math.abs(s.y-st.local.y);if(jn||l>=2){jn||J.handlePointer({...n,kind:"cancel"},ie(),de()),jn=!0,Dt={windowId:st.windowId,from:st.local,to:s};return}}}else if(n.kind==="up"||n.kind==="cancel"){if(Te?.active){let a=n.timestamp-Te.lastMove;if(n.kind==="up"&&a<75){let s=Math.max(-9,Math.min(9,Te.velocity*90*(1-a/75)));Math.abs(s)>=3.25&&(zt={windowId:Te.windowId,started:n.timestamp,distance:s,applied:0})}Te=void 0,Un=void 0;return}if(Te=void 0,jn&&Dt){jn=!1,st=void 0,Un=void 0;return}jn=!1,st=void 0;let i=Un;if(Un=void 0,n.kind==="up"&&i&&Math.abs(i.x-t)+Math.abs(i.y-r)<2){let a=el();a?.id===i.windowId&&mt(a.clientRect,t,r)&&Xe.get(a.id)?.onPointerUp?.(t-a.clientRect.column,r-a.clientRect.row)}}if(We&&n.kind==="move"){let a=Zs().itemRects.findIndex(s=>s&&mt(s,t,r));a>=0&&(rt=a);return}if(n.kind==="down"){if(We){let a=Zs();if(mt(a.rect,t,r)){let s=a.itemRects.findIndex(d=>d&&mt(d,t,r)),l=s>=0?nt[s]:void 0;l&&pb(l)}else We=!1;return}let i=vo();if(r===i.row){if(t<wo.length){We=!0,rt=0;return}for(let a of Qs)if(mt(a.rect,t,r)){J.controller.inspect().activeWindowId===a.id&&gb.get(a.id)!==!0?J.execute({kind:"minimize",id:a.id},ie(),de()):qn(a.id);return}return}}let o=J.handlePointer(n,ie(),de());if(n.kind==="down"&&(o.interaction!==void 0||o.command&&o.command.kind!=="focus")&&(st=void 0),n.kind==="down"){let i=el(),a=o.command!==void 0&&o.command.kind!=="focus";if(i&&mt(i.clientRect,t,r)&&!a){let s=Xe.get(i.id),l=t-i.clientRect.column,d=r-i.clientRect.row;if(s?.controls&&s.controls.length>0&&i.clientRect.height>=3&&d===i.clientRect.height-1){let c=ab(s,i.clientRect.width).find(u=>l>=u.from&&l<u.to);c&&PM(s,c.control.key);return}s?.onPointerDown?.(l,d);return}if(!o.handled){let d=!J.project(ie(),de()).windows.some(c=>mt(c.rect,t,r))&&r!==vo().row;if(d&&Yn()){We=!0,rt=0;return}d&&pt&&sg(pt)&&pt.pick(t,r)}}}function y6(n){if(zt=void 0,kt||Ze)return;let e=n.scroll>=0?1:-1,{x:t,y:r}=n;if(We){rt=(rt+e+nt.length)%nt.length;return}let i=[...J.project(ie(),de()).windows].reverse().find(a=>mt(a.clientRect,t,r));i&&Xe.get(i.id)?.onWheel?.(e,t-i.clientRect.column,r-i.clientRect.row)}function w6(n){if(zt=void 0,kt){(n.key==="return"||n.key==="space")&&Js();return}if(Dt&&(n.ctrl||n.meta)&&n.key==="c"){let r=wh();r.trim()&&se.copyText?.(r);return}if(We){if(n.key==="escape")We=!1;else if(n.key==="down")rt=(rt+1)%nt.length;else if(n.key==="up")rt=(rt+nt.length-1)%nt.length;else if(n.key==="return"){let r=nt[rt];r&&pb(r)}return}if(Ze&&n.key==="escape"){Ze=void 0;return}if(Dt&&n.key==="escape"){Dt=void 0;return}if(J.project(ie(),de()).switcher!==void 0){n.key==="tab"?J.execute({kind:"switcher-step",direction:n.shift?-1:1},ie(),de()):n.key==="return"?J.execute({kind:"switcher-accept"},ie(),de()):n.key==="escape"&&J.execute({kind:"switcher-cancel"},ie(),de());return}let t=el();t&&Xe.get(t.id)?.onKey?.(n)||(n.key==="tab"?J.execute({kind:"switcher-open",direction:n.shift?-1:1},ie(),de()):n.key==="g"&&t&&!Yn()&&J.execute({kind:"toggle-placement",id:t.id},ie(),de()))}globalThis.__desktop={order:()=>J.project(ie(),de()).windows.map(n=>`${n.id}:${n.placement}:${n.state}${n.active?"*":""}@r${n.rect.row}+${n.rect.height}c${n.rect.column}+${n.rect.width} client r${n.clientRect.row}+${n.clientRect.height}`),row:n=>(Ti[n]??[]).map(e=>e.char).join(""),cell:(n,e)=>Ti[e]?.[n],pointer:()=>bb,kinds:()=>gh,preset:()=>pt?.presetIndex,advances:()=>ub,magnet:()=>se.shader?.magnetism(),field:()=>pt?.constructor?.name,stats:()=>({rows:Ti.length,columns:Ti[0]?.length??-1,size:Kn,presented:rl}),menu:()=>({items:nt,selected:rt,...Zs()}),context:()=>Ze,selection:wh,windows:()=>ph?J.project(ie(),de()).windows:[],audio:()=>se.audio?.source(),animations:()=>Ve.status(),animationSettings:()=>Ve.settings(),alert:()=>kt?ko():void 0,separators:()=>J.project(ie(),de()).separators.map(n=>`${n.axis}@r${n.rect.row}+${n.rect.height}c${n.rect.column}+${n.rect.width}`)};function v6(n){let e={};for(let t of n.list())for(let r of t.options??[]){let o=n.option(t.id,r.key);o!==void 0&&((e[t.id]??={})[r.key]=o)}return e}var wb;function Gn(){wb?.()}function vb(n={}){ph=!1;let e=n.viewportWidth?.();se=n,Ve.resize(),Ve.setSettings(void 0),Te=void 0,zt=void 0,yh(),Xs=!1,Dt=void 0,st=void 0,Un=void 0,Ze=void 0,We=!1,rt=0,Tr=0,wo=` \u23FB ${n.startLabel??"exowebtui"} `;let t=[...n.applications??[]],r=new Set;for(let i of t){if(Xe.has(i.id)||r.has(i.id))throw new TypeError(`Duplicate desktop application: ${i.id}`);r.add(i.id)}for(let i of t)Xe.set(i.id,i);xo.push(...t);let o=new Set(n.hiddenMenuIds??[]);if(nt=[...t.filter(i=>i.menu!==!1).map(i=>({id:i.id,glyph:"\u25A7",title:i.title,summary:i.summary})),...(n.menuLinks??[]).map(i=>({...i,glyph:"\u2197"})),...lb].filter(i=>!o.has(i.id)),t.length){let i=J.reconcileWindows(xo.map((a,s)=>({id:a.id,title:a.title,minWidth:a.window.minWidth,minHeight:a.window.minHeight,state:a.id==="about"?"normal":"closed",placement:"floating",floatingRect:{column:4+s*3,row:2+s*2,width:a.window.width,height:a.window.height}})));if(!i.handled)throw new Error(`Could not register desktop applications: ${i.reason}`)}return{openWindow(i){if(!Xe.has(i))throw new TypeError(`Unknown desktop application: ${i}`);qn(i)},async init(i){Kn=i.size();let a=i.store("desktop");try{let s=await a.get("settings");if(s?.themeId){let l=Bn.find(d=>d.id===s.themeId);l&&bh(l)}if(s?.wallpaper&&(Ye.wallpaper=s.wallpaper),s?.barHints!==void 0&&(Ye.barHints=s.barHints),se.shader){s?.shaders?se.shader.setEnabled(s.shaders):s?.shader&&s.shader!=="none"?se.shader.setEnabled([s.shader]):se.shader.setEnabled(se.shader.list().map(l=>l.id));for(let[l,d]of Object.entries(s?.shaderTuning??{}))for(let[c,u]of Object.entries(d))if(typeof u=="number"){let h=s?.shaderDefaultsVersion!==2&&l==="degauss"&&c==="rate"&&u===.2;se.shader.setOption(l,c,h?.02:u)}}typeof s?.windowOpacity=="number"&&(Ye.windowOpacity=s.windowOpacity),Ve.setSettings(s?.animations)}catch{}wb=()=>{a.set("settings",{themeId:Ne.id,wallpaper:Ye.wallpaper,barHints:Ye.barHints,...se.shader?{shaders:[...se.shader.enabled()],shaderTuning:v6(se.shader),shaderDefaultsVersion:2}:{},windowOpacity:Ye.windowOpacity,animations:Ve.settings()}).catch(()=>{})},se.initialWindow&&(J.execute({kind:"close",id:"about"},ie(),de()),qn(se.initialWindow)),Yn()?ih():(J.execute({kind:"set-placement",id:"about",placement:"floating",rect:mb("about")},ie(),de()),rl+=1),ph=!0},frame(i,a){(a.columns!==Kn.columns||a.rows!==Kn.rows)&&Ve.resize(),Kn=a;let s=se.viewportWidth?.();return s!==void 0&&s!==e&&(e=s,Ve.resize(),ih()),p6(i)},key:w6,pointer:b6,wheel:y6,resize(i){zt=void 0,Ve.resize(),Kn=i,ih()}}}var xb=()=>J.controller.inspect().windows,kb=n=>J.execute({kind:"focus",id:n},ie(),de()),Sb=n=>J.execute({kind:"close",id:n},ie(),de());var ol=class{values=new Map;get(e){return Promise.resolve(this.values.get(e))}set(e,t){return this.values.set(e,t),Promise.resolve()}delete(e){return this.values.delete(e),Promise.resolve()}};var il=class{storeName;databasePromise;diagnostics;constructor(e){this.storeName=e.storeName??"values",this.diagnostics=e.diagnostics,this.databasePromise=x6(e.databaseName,this.storeName,e.version??1,e.scope).catch(t=>{throw this.diagnostics?.report({source:"storage",code:"indexeddb-open-failed",severity:"warning",message:"IndexedDB open failed.",detail:kd(t),context:{databaseName:e.databaseName,storeName:this.storeName,version:e.version??1}}),t})}async get(e){let t=await this.databasePromise;return await vh(t.transaction(this.storeName,"readonly").objectStore(this.storeName).get(e),this.diagnostics,"get",this.storeName,e)}async set(e,t){let r=await this.databasePromise;await vh(r.transaction(this.storeName,"readwrite").objectStore(this.storeName).put(t,e),this.diagnostics,"set",this.storeName,e)}async delete(e){let t=await this.databasePromise;await vh(t.transaction(this.storeName,"readwrite").objectStore(this.storeName).delete(e),this.diagnostics,"delete",this.storeName,e)}};function x6(n,e,t,r=globalThis){return"indexedDB"in r?new Promise((o,i)=>{let s=r.indexedDB.open(n,t);s.onerror=()=>i(s.error??new Error("Failed to open IndexedDB database.")),s.onsuccess=()=>o(s.result),s.onupgradeneeded=()=>{s.result.objectStoreNames.contains(e)||s.result.createObjectStore(e)}}):Promise.reject(new Error("IndexedDB is not available in this runtime."))}function vh(n,e,t,r,o){return new Promise((i,a)=>{n.onerror=()=>{let s=n.error??new Error("IndexedDB request failed.");e?.report({source:"storage",code:"indexeddb-request-failed",severity:"warning",message:"IndexedDB request failed.",detail:kd(s),context:{operation:t,storeName:r,key:o}}),a(s)},n.onsuccess=()=>i(n.result)})}function Mb(n){let e="",t="";for(let r of n){let o=`${r.foreground?.join(",")??""}|${r.background?.join(",")??""}|${r.bold?"b":""}`;o!==t&&(t=o,e+="\x1B[0m",r.bold&&(e+="\x1B[1m"),r.foreground&&(e+=`\x1B[38;2;${r.foreground.join(";")}m`),r.background&&(e+=`\x1B[48;2;${r.background.join(";")}m`)),e+=r.char}return`${e}\x1B[0m`}var al=class n{#e=new Map;#t=new Set;#i=new Set;#r=0;#o=0;static fromObjects(e){return new n().resetFromObjects(e)}resetFromObjects(e){this.clearRetainingRows();for(let t of e)this.add(t);return this}add(e){if(e.outOfBounds)return;let t=e.rectangle.peek(),r=Math.floor(t.row),o=r+Math.max(0,Math.floor(t.height)),i=Math.floor(t.column),a=i+Math.max(0,Math.floor(t.width));if(!(o<=r||a<=i)){this.#t.add(e);for(let s=r;s<o;s+=1){let l=this.#e.get(s);l?(l.length===0&&(this.#o+=1),l.push(e)):(this.#e.set(s,[e]),this.#o+=1),this.#r+=1}}}query(e){return this.queryInto([],e)}queryInto(e,t){e.length=0;let r=Math.floor(t.row),o=r+Math.max(0,Math.floor(t.height)),i=Math.floor(t.column),a=i+Math.max(0,Math.floor(t.width));if(o<=r||a<=i)return e;let s=this.#i;s.clear();for(let l=r;l<o;l+=1)for(let d of this.#e.get(l)??[]){let c=d.rectangle.peek(),u=Math.floor(c.column);u+Math.max(0,Math.floor(c.width))<=i||u>=a||s.add(d)}for(let l of s)e.push(l);return s.clear(),e}queryDirtyRegion(e){return this.queryDirtyRegionInto([],e)}queryDirtyRegionInto(e,t){if(e.length=0,t.isEmpty())return e;let r=this.#i;r.clear(),t.forEachSegment(o=>{let i=o.startColumn,a=o.endColumn;for(let s of this.#e.get(o.row)??[]){let l=s.rectangle.peek(),d=Math.floor(l.column);d+Math.max(0,Math.floor(l.width))<=i||d>=a||r.add(s)}});for(let o of r)e.push(o);return r.clear(),e}inspect(){return{objects:this.#t.size,rows:this.#o,rowEntries:this.#r}}clear(){this.#e.clear(),this.#t.clear(),this.#i.clear(),this.#r=0,this.#o=0}clearRetainingRows(){for(let e of this.#e.values())e.length=0;this.#t.clear(),this.#i.clear(),this.#r=0,this.#o=0}};function Rr(n,e){return`\x1B[${n+1};${e+1}H`}var Tb="\x1B[2J";var k6=new TextEncoder,S6=new TextDecoder,M6=32768,T6=8192,sl=new Map,R6={foreground:!1,background:!1,other:!1},ll=new Map;function Rb(){return{frames:0,bytes:0,writes:0,wouldBlocks:0,shortWrites:0,stallMs:0,maxStallMs:0,degradedFlushes:0,droppedBytes:0}}var _6=40,C6=2;function E6(n){return n instanceof Error?n.name==="WouldBlock"||n.code==="EAGAIN":!1}var dl=class{requiresCellUpdates=!1;#e;#t;#i=!1;#r=Rb();constructor(e){this.#e=e.stdout,this.#t=e.flushLimit??W6()}takeFlushDegraded(){let e=this.#i;return this.#i=!1,e}takeFlushTelemetry(){let e=this.#r;return this.#r=Rb(),e}#o(e){if(e.length===0)return;let t=k6.encode(e),r=this.#r;r.bytes+=t.length;let o=0,i,a=s=>{if(i===void 0)return;let l=s-i;r.stallMs+=l,l>r.maxStallMs&&(r.maxStallMs=l),i=void 0};for(;o<t.length;){let s=t.length-o,l=0;r.writes+=1;try{l=this.#e.writeSync(o===0?t:t.subarray(o))}catch(u){if(!E6(u))throw u;r.wouldBlocks+=1}if(l>0){l<s&&(r.shortWrites+=1),o+=l,i!==void 0&&a(performance.now());continue}let d=performance.now();if(i??=d,d-i>_6){a(d),r.degradedFlushes+=1,r.droppedBytes+=t.length-o,this.#i=!0;return}let c=d+C6;for(;performance.now()<c;);}}resize(e,t){this.#o(`${Rr(0,0)}${Tb}`)}flush(e,t){this.#r.frames+=1;let r="";for(let o=0;o<e.length;){let i=I6(e,o);r+=Rr(i.row,i.column),r.length+i.text.length>this.#t&&(this.#o(r),r=Rr(i.row,i.column)),r+=i.text,o+=i.cells}this.#o(r)}flushRanges(e,t){this.#r.frames+=1;let r="";for(let o of e){r+=Rr(o.row,o.startColumn);let i=O6(o);r.length+i.length>this.#t&&(this.#o(r),r=Rr(o.row,o.startColumn)),r+=i}this.#o(r)}};function I6(n,e){let t=n[e],r=cl(t.value),o=r.text,i=e+1,a=t.column;for(;_i(r.text)&&i<n.length;){let s=n[i];if(s.row!==t.row||s.column!==a+1)break;let l=cl(s.value);if(!_i(l.text)||l.prefix!==r.prefix||l.suffix!==r.suffix)break;o+=l.text,a=s.column,i+=1}return{row:t.row,column:t.column,text:`${r.prefix}${o}${r.suffix}`,cells:i-e}}function A6(n,e){let t=n[e],r=cl(t);if(!_i(r.text))return{text:r.text,cells:1,first:r};let o=1;for(;e+o<n.length&&n[e+o]===t;)o+=1;if(o>1)return{text:r.text.repeat(o),cells:o,first:r};let i=r.text,a=e+1;for(;a<n.length;){let s=cl(n[a]);if(!_i(s.text)||s.prefix!==r.prefix||s.suffix!==r.suffix)break;i+=s.text,a+=1}return{text:i,cells:a-e,first:r}}function O6(n){let{values:e}=n,t="",r="",o=_b(""),i=!1,a=!1;for(let s=0;s<e.length;){let l=A6(e,s),{first:d}=l,c=!_i(d.text);if(d.text&&((c||a)&&(t+=Rr(n.row,n.startColumn+s)),a=c),d.prefix!==r){let u=_b(d.prefix);i&&!L6(o,u)&&(t+="\x1B[0m",i=!1),t+=d.prefix,r=d.prefix,o=u}t+=l.text,(d.prefix||d.suffix)&&(i=!0),s+=l.cells}return i&&(t+="\x1B[0m"),t}function _i(n){if(!n)return!1;for(let e=0;e<n.length;e++){let t=n.charCodeAt(e);if(t<32||t>126)return!1}return!0}function _b(n){if(!n)return R6;let e=ll.get(n);if(e)return e;let t={foreground:!1,background:!1,other:!1};for(let r=0;r<n.length;){let o=St(n,r);if(!o?.endsWith("m")||!/^[\d;:]*$/.test(o.slice(2,-1))){t.other=!0;break}let i=er(o.slice(2,-1));for(let a=0;a<i.length;){let s=Number(i[a].split(":")[0]);if(s===38||s===48){let l=Nr(i,a);l.rgb||l.palette!==void 0?s===38?t.foreground=!0:t.background=!0:t.other=!0,a+=l.consumed}else t.other=!0,a++}r+=o.length}return ll.size>T6&&ll.clear(),ll.set(n,t),t}function L6(n,e){return!(n.other||n.foreground&&!e.foreground||n.background&&!e.background)}function cl(n){let e=typeof n=="string"?n:S6.decode(n);if(!e.includes("\x1B["))return{prefix:"",text:e,suffix:""};let t=sl.get(e);if(t)return t;let r=0,o="";for(;r<e.length;){let d=St(e,r);if(!d)break;o+=d,r+=d.length}let i=e.indexOf("\x1B[",r),a=e.slice(r,i<0?e.length:i);if(!a||a.charCodeAt(0)===27)return{prefix:"",text:e,suffix:""};let s=e.slice(r+a.length);if(!P6(s))return{prefix:"",text:e,suffix:""};let l={prefix:o,text:a,suffix:s};return sl.size>M6&&sl.clear(),sl.set(e,l),l}function P6(n){if(!n)return!0;let e=0;for(;e<n.length;){let t=St(n,e);if(!t)return!1;e+=t.length}return!0}function xh(n,e=[]){let t,r=0;for(let o of n){if(!t||o.row!==t.row||o.column!==t.nextColumn){t&&(e[r]=Cb(e[r],t.row,t.startColumn,t.values),r+=1);let i=N6(e[r]);i.length=0,t={row:o.row,startColumn:o.column,nextColumn:o.column,values:i}}t.values.push(o.value),t.nextColumn=o.column+1}return t&&(e[r]=Cb(e[r],t.row,t.startColumn,t.values),r+=1),e.length=r,e}function N6(n){return Array.isArray(n?.values)&&!Object.isFrozen(n.values)?n.values:[]}function Cb(n,e,t,r){return n?(n.row=e,n.startColumn=t,n.values=r,n):{row:e,startColumn:t,values:r}}function W6(){let n=globalThis;return n.Deno?.build?.os==="windows"||n.process?.platform==="win32"?1024:16384}var ul=class extends mr{stdout;sink;size;rerenderedObjects;frameBuffer;rerenderQueue;rerenderRanges;drawnObjects;updateObjects;resizeNeeded;lastRenderStats;drawnOrderVersion;cellUpdatesBuffer;rowRangesBuffer;directRowRangesBuffer;objectsToUpdateBuffer;seenObjectsBuffer;dirtyRowsSeenBuffer;dirtyRectanglesBuffer;movedOwnObjectsBuffer;nonMovingUpdatedObjectsBuffer;affectedObjectsBuffer;requiredObjectsBuffer;dirtyCandidatesBuffer;intersectionCandidatesBuffer;dirtyRegionBuffer;spatialIndexBuffer;constructor(e){if(super(),this.frameBuffer=[],this.rerenderQueue=[],this.rerenderRanges=[],this.stdout=e.stdout,e.sink)this.sink=e.sink;else if(e.stdout)this.sink=new dl({stdout:e.stdout});else throw new Error("Canvas requires either stdout or sink.");this.drawnObjects=new li((o,i)=>o.zIndex.peek()-i.zIndex.peek()||o.id-i.id),this.updateObjects=[],this.resizeNeeded=!1,this.lastRenderStats=Eb(),this.drawnOrderVersion=0,this.cellUpdatesBuffer=[],this.rowRangesBuffer=[],this.directRowRangesBuffer=[],this.objectsToUpdateBuffer=[],this.seenObjectsBuffer=new Set,this.dirtyRowsSeenBuffer=new Set,this.dirtyRectanglesBuffer=[],this.movedOwnObjectsBuffer=new Set,this.nonMovingUpdatedObjectsBuffer=[],this.affectedObjectsBuffer=[],this.requiredObjectsBuffer=new Set,this.dirtyCandidatesBuffer=[],this.intersectionCandidatesBuffer=[],this.dirtyRegionBuffer=new Ka,this.spatialIndexBuffer=new al,this.size=xt(e.size,{deepObserve:!0}),this.size.subscribe(()=>{this.resizeNeeded=!0;let{columns:o,rows:i}=this.size.peek();this.sink.resize?.(o,i)});let{columns:t,rows:r}=this.size.peek();this.sink.resize?.(t,r)}resortDrawnObjects(){this.drawnObjects.sort(this.drawnObjects.compareFn),this.drawnOrderVersion+=1}resize(){this.rerenderAll()}rerenderAll(){let{columns:e,rows:t}=this.size.peek();this.clearRetainedResizeState();for(let r of this.drawnObjects){let{column:o,row:i}=r.rectangle.peek();o>=e||i>=t||(r.rendered=!1,r.updated=!1,this.updateObjects.push(r))}}clearRetainedResizeState(){this.frameBuffer.length=0,this.rerenderQueue.length=0,this.rerenderRanges.length=0,this.cellUpdatesBuffer.length=0,this.rowRangesBuffer.length=0,this.directRowRangesBuffer.length=0,this.dirtyRowsSeenBuffer.clear(),this.dirtyRegionBuffer.clear();for(let e of this.drawnObjects){for(let r of e.rerenderCells)r?.clear();e.rerenderCells.length=0;let t=e;if(t.rerenderRanges){for(let r of t.rerenderRanges)r&&(r.length=0);t.rerenderRanges.length=0}}}updateIntersections(e,t){let{omitCells:r,objectsUnder:o}=e,i=0,a=e.zIndex.peek(),s=e.rectangle.peek();for(let l of r)l?.clear();o.clear();for(let l of t??this.drawnObjects){if(e===l||l.outOfBounds)continue;i+=1;let d=l.zIndex.peek();if(d<a||d===a&&l.id<e.id){or(s,l.rectangle.peek(),!1)&&o.add(l);continue}let c=or(s,l.rectangle.peek(),!0);if(!c)continue;let u=c.row+c.height,h=c.column+c.width;for(let f=c.row;f<u;++f){let p=r[f]??=new Set;for(let m=c.column;m<h;++m)p.add(m)}}return i}inspectRender(){return{...this.lastRenderStats}}render(){let{frameBuffer:e,updateObjects:t}=this;if(this.resizeNeeded&&(this.resize(),this.resizeNeeded=!1),!t.length){this.lastRenderStats=Eb();return}let r=this.objectsToUpdateBuffer,o=this.seenObjectsBuffer;for(r.length=0,o.clear();t.length;){let O=t.pop();o.has(O)||(o.add(O),r.push(O))}r.sort((O,v)=>v.zIndex.peek()-O.zIndex.peek()||v.id-O.id);let i=0,a=!1,s=this.dirtyRectanglesBuffer,l=this.movedOwnObjectsBuffer,d=this.nonMovingUpdatedObjectsBuffer;s.length=0,l.clear(),d.length=0;for(let O of r){O.updated=!0,++i,O.update();let v=O.previousRectangle?Ib(O.previousRectangle):void 0;if(O.updateMovement(),O.moved){a=!0;let N=O.rectangle.peek(),R=!v||!$r(N,v),M=this.drawnObjects.includes(O);R||!M?(s.push(Ib(N)),v&&s.push(v),l.add(O)):d.push(O)}else d.push(O);O.updatePreviousRectangle(),O.updateOutOfBounds(),O.outOfBounds&&(O.rendered=!1)}let c=this.dirtyRegionBuffer;c.resetFromRectangles(s);let u=a?this.spatialIndexBuffer.resetFromObjects(this.drawnObjects):void 0,h=a?V6(this.drawnObjects,c,d,l,u,this.affectedObjectsBuffer,this.requiredObjectsBuffer,this.dirtyCandidatesBuffer):r,f=0;if(a){h.sort((v,N)=>N.zIndex.peek()-v.zIndex.peek()||N.id-v.id);let O=this.intersectionCandidatesBuffer;for(let v of h)f+=this.updateIntersections(v,u.queryInto(O,v.rectangle.peek())),v.moved=!1,v.outOfBounds||(l.has(v)||!v.rendered?v.rendered=!1:D6(v,c))}else for(let O of h)O.moved=!1;let p=0,m=0;for(let O of h)O.outOfBounds||(O.rendered?(O.rerender(),m+=1):(O.render(),O.rendered=!0,p+=1));this.rerenderedObjects=i;let{rerenderQueue:g,rerenderRanges:y}=this,b=this.size.peek(),w=0,x=0,k=0,C=this.cellUpdatesBuffer,T=this.directRowRangesBuffer,S=this.dirtyRowsSeenBuffer;C.length=0,T.length=0,S.clear();let A=!this.sink.flushRanges||this.sink.requiresCellUpdates!==!1;for(let O=0;O<b.rows;++O){let v=y[O];if(v?.length){oo(v),S.add(O);let M=e[O]??=[];for(let _ of v)k+=Math.max(0,_.endColumn-_.startColumn),w+=z6(O,_.startColumn,_.endColumn,M,T,A?C:void 0);v.length=0}let N=g[O];if(!N?.size)continue;S.add(O),k+=N.size;let R=e[O]??=[];for(let M of N){let _=R[M];_!==void 0&&(C.push({row:O,column:M,value:_}),w+=1)}N.clear()}let I=this.sink.flushRanges?T:xh(C,this.rowRangesBuffer);if(this.sink.flushRanges&&C.length>0){xh(C,this.rowRangesBuffer);for(let O of this.rowRangesBuffer)T.push(O)}x=S.size,this.lastRenderStats={updatedObjects:i,renderedObjects:p,rerenderedObjects:m,intersectionUpdates:a?h.length:0,intersectionCandidateChecks:f,intersectionsDirty:a,dirtyRectangles:s.length,dirtyRowRanges:I.length,dirtyRows:x,dirtyCells:k,fullRedraws:p,flushedCells:w},(C.length>0||this.sink.flushRanges&&I.length>0)&&(this.sink.flushRanges?this.sink.flushRanges(I,this.lastRenderStats,C):this.sink.flush(C,this.lastRenderStats),this.sink.takeFlushDegraded?.()&&this.rerenderAll()),this.emit("render")}};function Eb(){return{updatedObjects:0,renderedObjects:0,rerenderedObjects:0,intersectionUpdates:0,intersectionCandidateChecks:0,intersectionsDirty:!1,dirtyRectangles:0,dirtyRowRanges:0,dirtyRows:0,dirtyCells:0,fullRedraws:0,flushedCells:0}}function Ib(n){return{column:n.column,row:n.row,width:n.width,height:n.height}}function V6(n,e,t,r,o,i,a,s){if(i.length=0,a.clear(),e.isEmpty()){for(let l of n)i.push(l);return i}for(let l of r)a.add(l);for(let l of t)a.add(l);for(let l of o.queryDirtyRegionInto(s,e))a.add(l);for(let l of n)a.has(l)&&i.push(l);return i}function D6(n,e){e.forEachIntersectionValue(n.rectangle.peek(),(t,r,o)=>{n.queueRerenderRange(t,r,o)})}function z6(n,e,t,r,o,i){if(!i){let d=$6(r,e,t);if(d)return o.push({row:n,startColumn:e,values:d}),d.length}let a=0,s,l=e;for(let d=e;d<t;d+=1){let c=r[d];if(c===void 0){s?.length&&(i||o.push({row:n,startColumn:l,values:s})),s=void 0;continue}s||(s=[],l=d),s.push(c),i?.push({row:n,column:d,value:c}),a+=1}return s?.length&&(i||o.push({row:n,startColumn:l,values:s})),a}function $6(n,e,t){for(let r=e;r<t;r+=1)if(n[r]===void 0)return;return n.slice(e,t)}function H6(n,e,t){let r=Math.max(0,n),o=Math.max(0,t-e);return Math.max(0,r-o)}var hl=class{#e;#t;#i;#r;#o;#s;#n=!1;#a=0;#l;#c;#d=0;#h=0;#u=0;#p;constructor(e){this.#e=e.tick,this.#t=e.timer??B6,this.#o=Math.max(0,e.intervalMs??1e3/60),this.#i=e.immediate??!0,this.#r=e.onError}get running(){return this.#n}get frame(){return this.#a}get intervalMs(){return this.#o}set intervalMs(e){this.#o=Math.max(0,e)}start(){this.#n||(this.#n=!0,this.#i?this.#b():this.#g())}stop(){this.#s!==void 0&&(this.#t.clearTimeout(this.#s),this.#s=void 0),this.#n=!1}step(){this.#f()}inspect(){return{running:this.#n,frame:this.#a,intervalMs:this.#o,frameBudgetMs:this.#o,lastStartedAt:this.#l,lastDurationMs:this.#c,averageDurationMs:this.#a===0?0:this.#d/this.#a,maxDurationMs:this.#h,overBudgetFrames:this.#u,lastError:this.#p}}#b(){if(this.#n){this.#s=void 0;try{this.#f();let e=this.#l??this.#t.now();this.#g(H6(this.#o,e,this.#t.now()))}catch(e){this.#p=e,this.#r?.(e),this.stop()}}}#f(){let e=this.#t.now(),t=this.#l===void 0?0:e-this.#l;this.#l=e,this.#a+=1,this.#e({frame:this.#a,startedAt:e,deltaMs:t});let r=Math.max(0,this.#t.now()-e);this.#c=r,this.#d+=r,this.#h=Math.max(this.#h,r),r>this.#o&&(this.#u+=1)}#g(e=this.#o){this.#n&&(this.#s=this.#t.setTimeout(()=>this.#b(),e))}};var B6={setTimeout:(n,e)=>setTimeout(n,e),clearTimeout:n=>clearTimeout(n),now:()=>performance.now()};function Mo(n){return["#0f172a","#ef4444","#22c55e","#eab308","#3b82f6","#d946ef","#06b6d4","#e5e7eb","#475569","#fb7185","#86efac","#fde047","#93c5fd","#f0abfc","#67e8f9","#f8fafc"][n]??"#dbeafe"}function Ab(n){if(!Number.isFinite(n)||n<0)return"#dbeafe";if(n<16)return Mo(n);if(n>=232){let i=8+(Math.min(n,255)-232)*10;return`rgb(${i},${i},${i})`}let e=Math.min(n,231)-16,t=Math.floor(e/36),r=Math.floor(e%36/6),o=e%6;return`rgb(${Gi(t)},${Gi(r)},${Gi(o)})`}var F6=new TextDecoder,j6=new Map([[9472,5],[9474,10],[9484,6],[9488,3],[9492,12],[9496,9],[9500,14],[9508,11],[9516,7],[9524,13],[9532,15],[9581,6],[9582,3],[9583,9],[9584,12],[9588,1],[9589,8],[9590,4],[9591,2]]),G6="\x1B",U6=new RegExp(`${G6}\\[([0-9;:]*)m`,"g"),fl=class{requiresCellUpdates=!1;#e;#t;#i;#r;#o;#s;#n=0;#a=0;#l;#c;#d;#h=[];#u=new Set;constructor(e){let t=e.canvas.getContext("2d");if(!t)throw new Error("BrowserCellCanvasSink requires a 2D canvas context.");this.#e=e.canvas,this.#t=t,this.#i=e.font??"16px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",this.#r=e.foreground??"#dbeafe",this.#o=e.background??"#070b12",this.#s=Math.max(1,e.devicePixelRatio??globalThis.devicePixelRatio??1),this.#l=Math.max(1,e.cellWidth??10),this.#c=Math.max(1,e.cellHeight??20),this.#t.font=this.#i,this.#t.textBaseline="top"}resize(e,t){if(e=Math.max(1,Math.floor(e)),t=Math.max(1,Math.floor(t)),!Number.isSafeInteger(e*t)||e*t>2e6)throw new RangeError("Browser cell surfaces support at most 2,000,000 finite cells.");this.#n=e,this.#a=t,this.#h=new Array(e*t),this.#u.clear(),this.#e.width=Math.ceil(this.#n*this.#l*this.#s),this.#e.height=Math.ceil(this.#a*this.#c*this.#s),this.#t.setTransform?.(1,0,0,1,0,0),this.#t.scale(this.#s,this.#s),this.#t.font=this.#i,this.#t.textBaseline="top",this.#t.fillStyle=this.#o,this.#t.fillRect(0,0,this.#e.width/this.#s,this.#e.height/this.#s)}flush(e,t){let r=new Set;for(let o of e)this.#p(o.row,o.column,o.value,r);this.#b(r),this.#d={...t}}flushRanges(e,t,r=[]){let o=new Set;for(let i of e){let a=i.startColumn;for(let s of i.values)this.#p(i.row,a,s,o),a+=1}this.#b(o),this.#d={...t}}inspectSink(){return{columns:this.#n,rows:this.#a,cellWidth:this.#l,cellHeight:this.#c,foreground:this.#r,background:this.#o,lastStats:this.#d?{...this.#d}:void 0}}#p(e,t,r,o){if(!Number.isInteger(e)||!Number.isInteger(t)||e<0||e>=this.#a||t<0||t>=this.#n)return;let i=e*this.#n+t;o.add(i),this.#u.has(i)&&o.add(i+1),t>0&&this.#u.has(i-1)&&o.add(i-1),this.#h[i]=typeof r=="string"?r:F6.decode(r)}#b(e){let t=new Map,r=a=>{let s=t.get(a);return s||(s=K6(this.#h[a]??""),t.set(a,s)),s},o=a=>this.#h[a]!==void 0&&r(a).text==="",i=a=>Ho(r(a).text)!==2?1:a%this.#n+1<this.#n&&o(a+1)?2:0;for(let a of e)i(a)===2&&e.add(a+1),a%this.#n>0&&o(a)&&i(a-1)===2&&e.add(a-1);for(let a of e){if(this.#u.delete(a),a%this.#n>0&&o(a)&&i(a-1)===2)continue;let s=r(a),l=i(a);this.#f(Math.floor(a/this.#n),a%this.#n,s,l),l===2&&this.#u.add(a)}}#f(e,t,r,o){let i=t*this.#l,a=e*this.#c,s=Math.max(1,o)*this.#l,l=Math.round(i*this.#s)/this.#s,d=Math.round(a*this.#s)/this.#s,c=(t+Math.max(1,o)===this.#n?this.#e.width:Math.round((i+s)*this.#s))/this.#s,u=(e+1===this.#a?this.#e.height:Math.round((a+this.#c)*this.#s))/this.#s;this.#t.fillStyle=r.inverse?r.foreground??this.#r:r.background??this.#o,this.#t.fillRect(l,d,c-l,u-d);let h=o===0?" ":r.text||" ",f=r.inverse?r.background??this.#o:r.foreground??this.#r,p=r.dim?Y6(f):f;if(!(h.trim().length===0&&!r.underline&&!r.overline&&!r.strikethrough))if(this.#t.save&&this.#t.restore&&this.#t.beginPath&&this.#t.rect&&this.#t.clip){this.#t.save();try{this.#t.beginPath(),this.#t.rect(l,d,c-l,u-d),this.#t.clip(),this.#g(r,o,h,i,a,p,l,d,c-l,u-d)}finally{this.#t.restore()}}else this.#g(r,o,h,i,a,p,l,d,c-l,u-d)}#g(e,t,r,o,i,a,s,l,d,c){if(r.trim().length===0){this.#m(e,o,i,a);return}if(r.length===1){let u=r.codePointAt(0);if(u>=9472&&u<=9599&&this.#w(u,s,l,a,d,c)||this.#v(u,s,l,a,d,c)){this.#m(e,o,i,a);return}}this.#t.font=`${e.italic?"italic ":""}${e.bold?"700 ":""}${this.#i}`,this.#t.fillStyle=a,this.#t.fillText(r,o,i),this.#m(e,o,i,a),t===2&&this.#m(e,o+this.#l,i,a)}#m(e,t,r,o){if(!e.underline&&!e.strikethrough&&!e.overline)return;let i=Math.min(this.#c,Math.max(1,Math.round(this.#c/16)));if(this.#t.fillStyle=o,e.overline&&this.#t.fillRect(t,r,this.#l,i),e.strikethrough&&this.#t.fillRect(t,r+Math.floor((this.#c-i)/2),this.#l,i),!e.underline)return;this.#t.fillStyle=e.underlineColor??o;let a=r+this.#c-i,s=e.underlineStyle??"solid";if(s==="solid"||s==="double")this.#t.fillRect(t,a,this.#l,i),s==="double"&&this.#c>i*2&&this.#t.fillRect(t,Math.max(r,a-i*2),this.#l,i);else{let l=s==="dotted"?i*2:s==="dashed"?i*6:i*8,d=Math.max(1,this.#l/512);for(let c=0;c<this.#l;c+=d){let u=(t+c)%l;if(s==="dotted"&&u>=i||s==="dashed"&&u>=i*4)continue;let h=s==="wavy"?Math.max(r,a-Math.min(this.#c-i,i*2)*(1+Math.sin((t+c)*Math.PI*2/l))/2):a;this.#t.fillRect(t+c,h,Math.min(d,this.#l-c),i)}}}#w(e,t,r,o,i,a){let s=this.#t,l=Math.max(1,Math.round(Math.min(i,a)/8)),d=Math.max(2,l*2),c=t+Math.floor((i-l)/2),u=r+Math.floor((a-l)/2),h=(x,k,C,T=l)=>s.fillRect(k,x,Math.max(0,C-k),T),f=(x,k,C,T=l)=>s.fillRect(x,k,T,Math.max(0,C-k)),p=e===9473?5:e===9475?10:j6.get(e);if(p!==void 0){s.fillStyle=o;let x=e===9473||e===9475?d:l,k=t+Math.floor((i-x)/2),C=r+Math.floor((a-x)/2);return p&8&&f(k,r,C+x,x),p&2&&f(k,C,r+a,x),p&1&&h(C,t,k+x,x),p&4&&h(C,k,t+i,x),!0}let m=Math.max(l+1,Math.round(Math.min(i,a)/5)),g=u-m,y=u+m,b=c-m,w=c+m;switch(s.fillStyle=o,e){case 9552:return h(g,t,t+i),h(y,t,t+i),!0;case 9553:return f(b,r,r+a),f(w,r,r+a),!0;case 9556:return h(g,b,t+i),h(y,w,t+i),f(b,g,r+a),f(w,y,r+a),!0;case 9559:return h(g,t,w+l),h(y,t,b+l),f(w,g,r+a),f(b,y,r+a),!0;case 9562:return h(y,b,t+i),h(g,w,t+i),f(b,r,y+l),f(w,r,g+l),!0;case 9565:return h(y,t,w+l),h(g,t,b+l),f(w,r,y+l),f(b,r,g+l),!0;case 9568:return f(b,r,r+a),f(w,r,g+l),f(w,y,r+a),h(g,w,t+i),h(y,w,t+i),!0;case 9571:return f(w,r,r+a),f(b,r,g+l),f(b,y,r+a),h(g,t,b+l),h(y,t,b+l),!0;case 9574:return h(g,t,t+i),h(y,t,b+l),h(y,w,t+i),f(b,y,r+a),f(w,y,r+a),!0;case 9577:return h(y,t,t+i),h(g,t,b+l),h(g,w,t+i),f(b,r,g+l),f(w,r,g+l),!0;case 9580:return f(b,r,g+l),f(w,r,g+l),f(b,y,r+a),f(w,y,r+a),h(g,t,b+l),h(y,t,b+l),h(g,w,t+i),h(y,w,t+i),!0;case 9578:return h(g,t,t+i),h(y,t,t+i),f(c,r,r+a),!0;case 9579:return f(b,r,r+a),f(w,r,r+a),h(u,t,t+i),!0;default:return!1}}#v(e,t,r,o,i,a){if(e<9600||e>9631)return!1;let s=this.#t;if(s.fillStyle=o,e===9600)s.fillRect(t,r,i,a/2);else if(e>=9601&&e<=9608){let l=a*(e-9600)/8;s.fillRect(t,r+a-l,i,l)}else if(e>=9609&&e<=9615)s.fillRect(t,r,i*(9616-e)/8,a);else if(e===9616)s.fillRect(t+i/2,r,i/2,a);else if(e>=9617&&e<=9619){let l=[.25,.5,.75][e-9617],d=s.globalAlpha??1;s.globalAlpha=d*l,s.fillRect(t,r,i,a),s.globalAlpha=d}else if(e===9620)s.fillRect(t,r,i,a/8);else if(e===9621)s.fillRect(t+i*7/8,r,i/8,a);else{let l=[4,8,1,13,9,7,11,2,6,14][e-9622];l&1&&s.fillRect(t,r,i/2,a/2),l&2&&s.fillRect(t+i/2,r,i/2,a/2),l&4&&s.fillRect(t,r+a/2,i/2,a/2),l&8&&s.fillRect(t+i/2,r+a/2,i/2,a/2)}return!0}};function K6(n){let e={text:$o(n),bold:!1,dim:!1},t=q6(n),r=n.matchAll(U6);for(let o of r){if(o.index!==void 0&&o.index>t)break;let i=er(o[1]??"");for(let a=0;a<i.length;a+=1){let s=i[a].split(":"),l=Number(s[0]);if(s.length>1&&l===4){s.length===2&&/^[0-5]$/.test(s[1])&&(s[1]==="0"?(delete e.underline,delete e.underlineStyle):(e.underline=!0,e.underlineStyle=["solid","double","wavy","dotted","dashed"][Number(s[1])-1]));continue}if(l===38||l===48||l===58){let d=Nr(i,a),c=d.rgb?`rgb(${d.rgb.join(",")})`:d.palette!==void 0?Ab(d.palette):void 0;c!==void 0&&(l===38?e.foreground=c:l===48?e.background=c:e.underlineColor=c),a+=d.consumed-1;continue}s.length>1||(l===0?(e.foreground=void 0,e.background=void 0,e.bold=!1,e.dim=!1,delete e.italic,delete e.underline,delete e.strikethrough,delete e.underlineColor,delete e.underlineStyle,delete e.overline,delete e.inverse):l===1?e.bold=!0:l===2?e.dim=!0:l===3?e.italic=!0:l===4?(e.underline=!0,delete e.underlineStyle):l===21?(e.underline=!0,e.underlineStyle="double"):l===53?e.overline=!0:l===55?delete e.overline:l===59?delete e.underlineColor:l===9?e.strikethrough=!0:l===7?e.inverse=!0:l===27?delete e.inverse:l===23?delete e.italic:l===24?(delete e.underline,delete e.underlineStyle):l===29?delete e.strikethrough:l===22?(e.bold=!1,e.dim=!1):l===39?e.foreground=void 0:l===49?e.background=void 0:l>=30&&l<=37?e.foreground=Mo(l-30):l>=90&&l<=97?e.foreground=Mo(l-90+8):l>=40&&l<=47?e.background=Mo(l-40):l>=100&&l<=107&&(e.background=Mo(l-100+8)))}}return e}function q6(n){for(let e=0;e<n.length;e+=1){if(n[e]!=="\x1B")return e;for(;e<n.length&&n[e]!=="m";)e+=1}return n.length}function Y6(n){return n.startsWith("#")?`${n}aa`:n}var ml=class{constructor(e="noop"){this.kind=e}#e=!1;start(){this.#e=!0}stop(){this.#e=!1}inspect(){return{running:this.#e,kind:this.kind}}};var gl=class{kind="browser";size;input;lifecycle;#e;#t;constructor(e){let t=e.cellWidth??10,r=e.cellHeight??20;this.size=new Ee(e.columns&&e.rows?{columns:e.columns,rows:e.rows}:Ob(e.root,t,r),{deepObserve:!0}),this.input=e.input??new Sh(e.root,{cellWidth:t,cellHeight:r,touchAction:e.touchAction,userSelect:e.userSelect,textInput:e.textInput}),this.lifecycle=e.lifecycle??new ml("browser"),this.#e=e.scheduler??nT(),"ResizeObserver"in globalThis&&(this.#t=new ResizeObserver(()=>{let o=Ob(e.root,t,r),i=this.size.peek();(o.columns!==i.columns||o.rows!==i.rows)&&(i.columns=o.columns,i.rows=o.rows)}),this.#t.observe(e.root))}now(){return this.#e.now()}scheduleFrame(e){let t=this.#e.request(()=>e());return{dispose:()=>this.#e.cancel(t)}}dispose(){this.#t?.disconnect(),this.input.dispose(),this.lifecycle.stop()}},Sh=class{#e;#t;#i;#r;#o;#s;#n;#a;#l=!1;#c=[];#d;#h;#u;constructor(e,t={}){this.#e=e,this.#t=Math.max(1,t.cellWidth??10),this.#i=Math.max(1,t.cellHeight??20),this.#r=t.touchAction??"none",this.#o=t.userSelect??"none",this.#s=t.textInput??"auto",this.#n=new Dr({now:t.now??(()=>performance.now())})}attach(e){this.detach(),this.#a=e,this.#e.tabIndex=this.#e.tabIndex<0?0:this.#e.tabIndex,this.#d=X6(this.#e,this.#r,this.#o);let t=this.#P();this.#c=[an(t,"keydown",r=>this.#p(r)),an(this.#e,"pointerdown",r=>this.#b(r,"down"),{passive:!1}),an(this.#e,"pointermove",r=>this.#f(r),{passive:!1}),an(this.#e,"pointerup",r=>this.#b(r,"up"),{passive:!1}),an(this.#e,"pointercancel",r=>this.#b(r,"cancel"),{passive:!1}),an(this.#e,"wheel",r=>this.#m(r),{passive:!1}),an(t,"input",r=>this.#v(r),{passive:!1}),an(t,"paste",r=>this.#w(r),{passive:!1}),an(t,"focus",()=>this.#x(!0)),an(t,"blur",()=>this.#x(!1))],this.#l=!0}detach(){for(let e of this.#c)e();this.#c=[],this.#d?.(),this.#d=void 0,this.#u?.(),this.#u=void 0,this.#h=void 0,this.#a=void 0,this.#l=!1}dispose(){this.detach()}inspect(){return{attached:this.#l,kind:"browser"}}#p(e){let t=tT(e);t&&(this.#a?.emit("keyPress",{key:t,meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new TextEncoder().encode(e.key.length===1?e.key:e.code)}),e.preventDefault())}#b(e,t){let r=t!=="down",o=Lb(e);try{t==="down"&&!o?(e.button===0&&this.#e.ownerDocument?.getSelection()?.removeAllRanges(),(this.#h??this.#e).focus({preventScroll:!0}),this.#e.setPointerCapture?.(e.pointerId)):this.#e.hasPointerCapture?.(e.pointerId)&&this.#e.releasePointerCapture?.(e.pointerId)}catch{}let i=this.#y(e);this.#g(e,t,i),this.#a?.emit("mousePress",{key:"mouse",x:i.x,y:i.y,movementX:e.movementX,movementY:e.movementY,meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new Uint8Array,drag:!1,release:r,button:r?void 0:kh(e.button)}),o||e.preventDefault()}#f(e){let t=this.#y(e);this.#g(e,"move",t),e.buttons!==0&&(this.#a?.emit("mousePress",{key:"mouse",x:t.x,y:t.y,movementX:e.movementX,movementY:e.movementY,meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new Uint8Array,drag:!0,release:!1,button:kh(e.button)}),Lb(e)||e.preventDefault())}#g(e,t,r){let o=Z6(e.pointerType),i=this.#e.getBoundingClientRect(),a=this.#n.create("browser",{kind:"pointer",device:o,modifiers:{alt:e.altKey===!0,ctrl:e.ctrlKey===!0,meta:e.metaKey===!0,shift:e.shiftKey===!0},data:{phase:t,pointerId:Pb(e.pointerId)}}),s={pointerId:Pb(e.pointerId),kind:t,coordinates:{screen:{space:"screen",x:pl(e.screenX),y:pl(e.screenY)},cell:{space:"cell",x:r.x,y:r.y},local:{space:"local",x:pl(e.clientX-i.left),y:pl(e.clientY-i.top)}},primary:e.isPrimary!==!1,button:t==="down"||t==="up"?kh(e.button)??null:null,buttons:t==="up"||t==="cancel"?0:Q6(e.buttons,t),...eT(e,o)},l;o==="touch"?l=om(a,s):o==="pen"?l=im(a,s):l=Id(a,s),this.#a?.emit("pointerInput",l)}#m(e){let t=this.#y(e);this.#a?.emit("mouseScroll",{key:"mouse",x:t.x,y:t.y,movementX:0,movementY:e.deltaY,meta:e.metaKey||e.altKey,ctrl:e.ctrlKey,shift:e.shiftKey,buffer:new Uint8Array,drag:!1,scroll:e.deltaY>0?1:e.deltaY<0?-1:0}),e.preventDefault()}#w(e){let t=e.clipboardData?.getData("text")??"";this.#a?.emit("paste",{key:"paste",text:t,buffer:new TextEncoder().encode(t)}),e.preventDefault()}#v(e){let t=e.target,r=typeof t.value=="string"?t.value:"";if(r){t.value="";for(let o of r)this.#S(o);e.preventDefault()}}#x(e){this.#a?.emit("terminalFocus",{key:"focus",focused:e,buffer:new Uint8Array})}#y(e){let t=this.#e.getBoundingClientRect(),r=(o,i,a)=>{let s=Math.max(1,Math.floor(i/a));return Math.max(0,Math.floor(o*s/Math.max(1,i)))};return{x:r(e.clientX-t.left,t.width,this.#t),y:r(e.clientY-t.top,t.height,this.#i)}}focus(){(this.#h??this.#e).focus({preventScroll:!0})}#P(){let e=this.#s!==!1&&this.#s!=="target"?J6(this.#e):void 0;return e?(this.#h=e.element,this.#u=e.dispose,e.element):(this.#h=this.#e,this.#e)}#S(e){let t=e===`
`||e==="\r"?"return":e===" "?"space":e.toLowerCase();this.#a?.emit("keyPress",{key:t,meta:!1,ctrl:!1,shift:!1,buffer:new TextEncoder().encode(e)})}};function Ob(n,e,t){let r=n.getBoundingClientRect();return{columns:Math.max(1,Math.floor(r.width/e)),rows:Math.max(1,Math.floor(r.height/t))}}function an(n,e,t,r){return n.addEventListener(e,t,r),()=>n.removeEventListener(e,t,r)}function X6(n,e,t){let r=n.style;if(!r)return()=>{};let o=r.touchAction,i=r.userSelect,a=r.webkitUserSelect;return r.touchAction=e,r.userSelect=t,r.webkitUserSelect=t,()=>{r.touchAction=o,r.userSelect=i,r.webkitUserSelect=a}}function J6(n){let e=n.ownerDocument??globalThis.document;if(!e?.createElement)return;let t=e.createElement("textarea");return t.tabIndex=0,t.setAttribute("aria-hidden","true"),t.setAttribute("autocapitalize","off"),t.setAttribute("autocomplete","off"),t.setAttribute("autocorrect","off"),t.setAttribute("spellcheck","false"),globalThis.matchMedia?.("(pointer: coarse)").matches&&(t.setAttribute("inputmode","none"),t.setAttribute("virtualkeyboardpolicy","manual")),t.style.position="fixed",t.style.left="0",t.style.top="0",t.style.width="1px",t.style.height="1px",t.style.opacity="0",t.style.pointerEvents="none",t.style.zIndex="-1",t.style.resize="none",t.style.border="0",t.style.padding="0",t.style.margin="0",(e.body??n).appendChild(t),{element:t,dispose:()=>t.remove()}}function Lb(n){return typeof Element<"u"&&n.composedPath().some(e=>e instanceof Element&&e.hasAttribute("data-exotui-selectable"))}function kh(n){return n===0||n===1||n===2?n:0}function Z6(n){return n==="touch"||n==="pen"?n:"mouse"}function Pb(n){return Number.isSafeInteger(n)&&n>=0?n:0}function Q6(n,e){return Number.isSafeInteger(n)&&n>=0&&n<=63?n:e==="down"||e==="move"?1:0}function pl(n){return Number.isFinite(n)?n:0}function eT(n,e){let t={};return Number.isFinite(n.pressure)&&n.pressure>=0&&n.pressure<=1&&(t.pressure=n.pressure),(e==="touch"||e==="pen")&&Number.isFinite(n.width)&&n.width>=0&&Number.isFinite(n.height)&&n.height>=0&&(t.contact={width:n.width,height:n.height}),e==="pen"&&(Number.isFinite(n.tangentialPressure)&&n.tangentialPressure>=-1&&n.tangentialPressure<=1&&(t.tangentialPressure=n.tangentialPressure),Number.isFinite(n.tiltX)&&n.tiltX>=-90&&n.tiltX<=90&&(t.tiltX=n.tiltX),Number.isFinite(n.tiltY)&&n.tiltY>=-90&&n.tiltY<=90&&(t.tiltY=n.tiltY),Number.isSafeInteger(n.twist)&&n.twist>=0&&n.twist<=359&&(t.twist=n.twist)),t}function tT(n){if(n.key.length===1)return n.key===" "?"space":n.key.toLowerCase();let e={Enter:"return",Tab:"tab",Backspace:"backspace",Escape:"escape",ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",Delete:"delete",Insert:"insert",PageUp:"pageup",PageDown:"pagedown",Home:"home",End:"end"};if(n.key in e)return e[n.key];if(/^F([1-9]|1[0-2])$/.test(n.key))return n.key.toLowerCase()}function nT(){let n=globalThis.requestAnimationFrame??(t=>setTimeout(()=>t(performance.now()),16.666666666666668)),e=globalThis.cancelAnimationFrame??(t=>clearTimeout(t));return{request:t=>n(t),cancel:t=>e(t),now:()=>performance.now()}}var Mh=class extends mr{root;element;platform;sink;canvas;renderLoop;#e=!1;#t;#i;constructor(e){super(),this.root=e.root,this.element=e.canvas??document.createElement("canvas"),e.canvas||this.root.appendChild(this.element),this.sink=e.sink??new fl({canvas:this.element,...e.sinkOptions}),this.platform=new gl({root:e.root,columns:e.columns,rows:e.rows,cellWidth:e.sinkOptions?.cellWidth,cellHeight:e.sinkOptions?.cellHeight,...e.platformOptions}),this.canvas=new ul({sink:this.sink,size:this.platform.size}),this.renderLoop=new hl({intervalMs:e.refreshRate??1e3/60,tick:()=>this.canvas.render()})}focus(){this.platform.input.focus?.()}start(){if(this.#e)return;this.#e=!0,this.platform.lifecycle.start(),this.platform.input.attach(this),this.#t=this.canvas.on("render",()=>this.emit("render"));let e=()=>this.canvas.render();this.platform.size.subscribe(e),this.#i=()=>this.platform.size.unsubscribe(e),this.renderLoop.start()}stop(){this.#e&&(this.#e=!1,this.renderLoop.stop(),this.platform.input.detach(),this.platform.lifecycle.stop(),this.#t?.(),this.#t=void 0,this.#i?.(),this.#i=void 0)}destroy(){this.stop(),this.platform.dispose(),this.emit("destroy"),this.off()}inspectHost(){return{running:this.#e,size:{...this.platform.size.peek()},renderLoop:this.renderLoop.inspect(),sink:this.sink.inspectSink()}}};function Nb(n){return new Mh(n)}var Sn=[{id:"vhs",label:"vhs \u2014 tape tremor, tracking, bleed",options:[{key:"tracking",label:"tracking",min:0,max:1,step:.1,value:.3},{key:"noise",label:"tape noise",min:0,max:.5,step:.05,value:.1},{key:"bleed",label:"chroma bleed",min:0,max:3,step:.25,value:1}],body:`
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
    `},{id:"crt",label:"crt \u2014 curvature, vignette, fringe",options:[{key:"curve",label:"curvature",min:0,max:.25,step:.02,value:.04},{key:"vignette",label:"vignette",min:0,max:.8,step:.05,value:.25},{key:"fringe",label:"chroma fringe",min:0,max:.004,step:4e-4,value:4e-4}],body:`
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
    `},{id:"phosphor",label:"phosphor \u2014 glow and persistence",options:[{key:"glow",label:"glow",min:0,max:2,step:.15,value:.9}],body:`
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
    `},{id:"scanlines",label:"scanlines \u2014 the raster's lines",options:[{key:"strength",label:"strength",min:0,max:.5,step:.04,value:.14},{key:"period",label:"spacing",min:2,max:6,step:1,value:3}],body:`
      vec2 uv = fragCoord / iResolution.xy;
      vec3 color = sampleChannel(uv).rgb;
      float line = mod(fragCoord.y, u_period) < 1.0 ? max(0.0, 1.0 - u_strength * iMagnet * 2.0) : 1.0;
      fragColor = vec4(color * line, 1.0);
    `},{id:"degauss",label:"degauss \u2014 the coil magnetizes",options:[{key:"rate",label:"drift rate",min:.02,max:5,step:.02,value:.02}],body:`
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
      // The magnetized tube loses colour purity at the corners \u2014 the classic
      // green/purple stains, breathing slowly, gone the moment you degauss.
      float stain = iMagnet * smoothstep(0.32, 0.72, radius);
      float theta = atan(centered.y, centered.x) * 2.0 + iTime * 0.05;
      color *= 1.0 + stain * 0.45 * vec3(sin(theta), sin(theta + 2.1), sin(theta + 4.2));
      float sweep = 6.0 * radius - iThump * 20.0;
      color += 0.22 * settle * settle * vec3(sin(sweep), sin(sweep + 2.1), sin(sweep + 4.2));
      fragColor = vec4(color, 1.0);
    `}],rT=`#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;function oT(n){return`#version 300 es
precision highp float;
uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform float iTime;
uniform float iFlip;
uniform float iMagnet;
uniform float iThump;
${(n.options??[]).map(t=>`uniform float u_${t.key};`).join(`
`)}
out vec4 outColor;
float shaderHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
vec4 sampleChannel(vec2 uv) {
  return texture(iChannel0, iFlip > 0.5 ? vec2(uv.x, 1.0 - uv.y) : uv);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
${n.body}
}
void main() {
  mainImage(outColor, gl_FragCoord.xy);
}
`}function Wb(n,e){let t=document.createElement("canvas");t.style.position="absolute",t.style.inset="0",t.style.width="100%",t.style.height="100%",t.style.pointerEvents="none",t.style.display="none",getComputedStyle(n).position==="static"&&(n.style.position="relative"),n.appendChild(t);let r=null,o=null,i=new Map,a=[],s="",l=new Set,d=new Map;for(let v of Sn)d.set(v.id,new Map((v.options??[]).map(N=>[N.key,N.value])));let c=null,u=!1,h=0,f=-1/0,p=.02,m=0,g,y=1.3,b=performance.now(),w=()=>{h&&cancelAnimationFrame(h),h=0,u=!1,t.style.display="none",e.style.visibility="visible"},x=v=>{let N=v.createTexture();return v.bindTexture(v.TEXTURE_2D,N),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MIN_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MAG_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_S,v.CLAMP_TO_EDGE),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_T,v.CLAMP_TO_EDGE),N},k=()=>{if(r)return r;if(r=t.getContext("webgl2"),!r)return null;let v=r,N=v.createBuffer();return v.bindBuffer(v.ARRAY_BUFFER,N),v.bufferData(v.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),v.STATIC_DRAW),o=x(v),v},C=v=>{let N=i.get(v.id);if(N)return N;let R=k();if(!R)return;let M=(Y,q)=>{let te=R.createShader(Y);return te?(R.shaderSource(te,q),R.compileShader(te),R.getShaderParameter(te,R.COMPILE_STATUS)?te:null):null},_=M(R.VERTEX_SHADER,rT),K=M(R.FRAGMENT_SHADER,oT(v));if(!_||!K)return;let X=R.createProgram();if(!X||(R.attachShader(X,_),R.attachShader(X,K),R.linkProgram(X),!R.getProgramParameter(X,R.LINK_STATUS)))return;let V=R.getAttribLocation(X,"position");R.enableVertexAttribArray(V),R.vertexAttribPointer(V,2,R.FLOAT,!1,0,0);let B=new Map;for(let Y of["iChannel0","iResolution","iTime","iFlip","iMagnet","iThump"])B.set(Y,R.getUniformLocation(X,Y));for(let Y of v.options??[])B.set(`u_${Y.key}`,R.getUniformLocation(X,`u_${Y.key}`));let z={program:X,uniforms:B};return i.set(v.id,z),z},T=(v,N,R)=>{let M=`${N}x${R}`;if(!(s===M&&a.length===2)){for(s=M;a.length<2;)a.push({texture:x(v),framebuffer:v.createFramebuffer()});for(let _ of a)v.bindTexture(v.TEXTURE_2D,_.texture),v.texImage2D(v.TEXTURE_2D,0,v.RGBA,N,R,0,v.RGBA,v.UNSIGNED_BYTE,null),v.bindFramebuffer(v.FRAMEBUFFER,_.framebuffer),v.framebufferTexture2D(v.FRAMEBUFFER,v.COLOR_ATTACHMENT0,v.TEXTURE_2D,_.texture,0);v.bindFramebuffer(v.FRAMEBUFFER,null)}},S=()=>{try{if(g??=new AudioContext,g.resume().catch(()=>{}),g.state!=="running")return;let v=g.currentTime,N=g.createGain();N.gain.setValueAtTime(.5,v),N.gain.exponentialRampToValueAtTime(5e-4,v+1.2),N.connect(g.destination);let R=g.createOscillator();R.type="sine",R.frequency.setValueAtTime(130,v),R.frequency.exponentialRampToValueAtTime(32,v+.5),R.connect(N),R.start(v),R.stop(v+1.2);let M=g.createOscillator();M.type="sawtooth",M.frequency.value=50;let _=g.createGain();_.gain.setValueAtTime(.06,v),_.gain.exponentialRampToValueAtTime(5e-4,v+.9),M.connect(_),_.connect(N),M.start(v),M.stop(v+1);let K=g.createBufferSource(),X=g.createBuffer(1,Math.floor(g.sampleRate*.4),g.sampleRate),V=X.getChannelData(0);for(let Y=0;Y<V.length;Y+=1)V[Y]=(Math.random()*2-1)*(1-Y/V.length);K.buffer=X;let B=g.createBiquadFilter();B.type="lowpass",B.frequency.value=900;let z=g.createGain();z.gain.value=.18,K.connect(B),B.connect(z),z.connect(N),K.start(v)}catch{}},A=()=>Sn.filter(v=>l.has(v.id)&&C(v)!==void 0),I=()=>{let v=A(),N=performance.now(),R=(N-f)/1e3,M=m?Math.min(.25,(N-m)/1e3):0;if(m=N,l.has("degauss")){let V=d.get("degauss")?.get("rate")??1;p=Math.min(1,p+M*V/300)}if(v.length===0){if(R>=y){w();return}let V=Sn.find(B=>B.id==="degauss");V&&C(V)&&v.push(V)}if(!r||v.length===0)return;let _=r;(t.width!==e.width||t.height!==e.height)&&(t.width=e.width,t.height=e.height),_.viewport(0,0,t.width,t.height),T(_,t.width,t.height),_.activeTexture(_.TEXTURE0),_.bindTexture(_.TEXTURE_2D,o);try{_.texImage2D(_.TEXTURE_2D,0,_.RGBA,_.RGBA,_.UNSIGNED_BYTE,c?.(e)??e)}catch{u=!1,h=requestAnimationFrame(I);return}let K=(performance.now()-b)/1e3,X=o;for(let V=0;V<v.length;V+=1){let B=v[V],z=i.get(B.id),q=V===v.length-1?null:a[V%2];_.bindFramebuffer(_.FRAMEBUFFER,q?q.framebuffer:null),_.useProgram(z.program),_.bindTexture(_.TEXTURE_2D,X),_.uniform2f(z.uniforms.get("iResolution")??null,t.width,t.height),_.uniform1f(z.uniforms.get("iTime")??null,K),_.uniform1i(z.uniforms.get("iChannel0")??null,0),_.uniform1f(z.uniforms.get("iFlip")??null,V===0?1:0),_.uniform1f(z.uniforms.get("iMagnet")??null,p),_.uniform1f(z.uniforms.get("iThump")??null,Math.min(R,60));let te=d.get(B.id);for(let Q of B.options??[])_.uniform1f(z.uniforms.get(`u_${Q.key}`)??null,te?.get(Q.key)??Q.value);_.drawArrays(_.TRIANGLES,0,3),q&&(X=q.texture)}u=!0,h=requestAnimationFrame(I)},O=()=>{if(A().length===0){l.clear(),w();return}t.style.display="block",e.style.visibility="hidden",h||(h=requestAnimationFrame(I))};return{setSourceComposer(v){c=v},isPresenting:()=>u&&!!r&&!r.isContextLost(),list:()=>Sn,enabled:()=>Sn.filter(v=>l.has(v.id)).map(v=>v.id),toggle(v){l.has(v)?l.delete(v):Sn.some(N=>N.id===v)&&l.add(v),O()},setEnabled(v){l.clear();for(let N of v)Sn.some(R=>R.id===N)&&l.add(N);O()},option:(v,N)=>d.get(v)?.get(N),magnetism:()=>p,warpPoint(v,N){if(!h)return{u:v,v:N};let R=X=>Math.min(1,Math.max(0,X)),M=R(v),_=1-R(N);if(l.has("degauss")){let X=(performance.now()-b)/1e3,V=Math.min((performance.now()-f)/1e3,60),B=Math.exp(-2.6*V),z=Math.sin(V*34-_*9)*B,Y=M-.5,q=_-.5,te=Math.hypot(Y,q),Q=z*.1*te+p*.05*Math.sin(X*.4)*te,U=Math.cos(Q),$=Math.sin(Q),W=Y+p*.008*Math.sin(_*21+X*.7),L=1+z*.05;M=R(.5+(U*W+$*q)*L),_=R(.5+(-$*W+U*q)*L)}let K=d.get("crt")?.get("curve")??0;if(l.has("crt")&&K!==0){let X=M*2-1,V=_*2-1,B=1+K*(X*X+V*V-1);M=(X*B+1)/2,_=(V*B+1)/2}return{u:M,v:1-_}},degauss(){p=.02;let v=Sn.find(N=>N.id==="degauss");!v||!C(v)||(f=performance.now(),S(),t.style.display="block",e.style.visibility="hidden",h||(h=requestAnimationFrame(I)))},setOption(v,N,R){let _=Sn.find(K=>K.id===v)?.options?.find(K=>K.key===N);_&&d.get(v)?.set(N,Math.min(_.max,Math.max(_.min,R)))},dispose(){w(),g?.close().catch(()=>{}),g=void 0,t.remove()}}}function Vb(n){let e=Nb({root:n.root,sinkOptions:{cellWidth:9,cellHeight:18,font:"14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",...n.host?.sinkOptions??{}},...n.host??{}}),t=()=>e.platform.size.peek().columns,r=()=>e.platform.size.peek().rows,o=[],i=()=>{for(let f=o.length;f<r();f+=1){let p=new Ee(""),m=f;o.push(p),new si({canvas:e.canvas,rectangle:new sn(()=>({column:0,row:m,width:e.platform.size.value.columns})),value:p,overwriteRectangle:!0,multiCodePointSupport:!0,style:g=>g,zIndex:1}).draw()}};i();let a={gpu:typeof navigator<"u"&&navigator.gpu!==void 0,audioInput:typeof navigator<"u"&&navigator.mediaDevices!==void 0,extras:n.extras},s=new Map,l=!1,d=f=>f.preventDefault();n.root.addEventListener("contextmenu",d);let c=Wb(n.root,e.element),u=(f,p)=>{let m=e.platform.size.peek(),g=c.warpPoint((f+.5)/m.columns,(p+.5)/m.rows);return{x:Math.min(m.columns-1,Math.max(0,Math.floor(g.u*m.columns))),y:Math.min(m.rows-1,Math.max(0,Math.floor(g.v*m.rows)))}},h=f=>{let p=f.coordinates.cell;if(!p)return f;let m=u(p.x,p.y);return m.x===p.x&&m.y===p.y?f:{...f,coordinates:{...f.coordinates,cell:{...p,x:m.x,y:m.y}}}};return e.start(),{host:e,shader:c,focus:()=>e.focus(),capabilities:a,size:()=>({columns:t(),rows:r()}),onResize(f){let p=()=>{i(),f({columns:t(),rows:r()})};return e.platform.size.subscribe(p),()=>e.platform.size.unsubscribe(p)},onKey(f){let p=m=>f(m);return e.on("keyPress",p),()=>e.off("keyPress",p)},onPointer(f){let p=m=>f(h(m));return e.on("pointerInput",p),()=>e.off("pointerInput",p)},onWheel(f){let p=m=>{let g=u(m.x,m.y);f(g.x===m.x&&g.y===m.y?m:{...m,x:g.x,y:g.y})};return e.on("mouseScroll",p),()=>e.off("mouseScroll",p)},present(f){i();let p=r();for(let m=0;m<p;m+=1){let g=f[m];o[m]&&(o[m].value=g?Mb(g):"")}for(let m=p;m<o.length;m+=1)o[m].value=""},requestFrame(f){requestAnimationFrame(f)},store(f){let p=s.get(f);if(!p){try{p=new il({databaseName:n.storeDatabase??"exotui",storeName:f})}catch{p=new ol}s.set(f,p)}return p},now:()=>performance.now(),dispose(){l||(l=!0,n.root.removeEventListener("contextmenu",d),c.dispose(),e.destroy())}}}var wl=44100,gt=2048,_r=gt*4,Ro=35,vl=12e3,bl=-62,Db=-14,iT=2e3,ot=24,Xn=256,aT="EXOMUX_AUDIO_DEVICE",sT=Object.freeze([Object.freeze({name:"parec",args:Object.freeze(["--format=s16le",`--rate=${wl}`,"--channels=1","--latency-msec=30"]),deviceFlag:"-d",monitorArgs:Object.freeze(["-d","@DEFAULT_MONITOR@"])}),Object.freeze({name:"pw-record",args:Object.freeze(["--format","s16","--rate",`${wl}`,"--channels","1","-"]),deviceFlag:"--target",monitorArgs:Object.freeze(["-P","stream.capture.sink=true"])}),Object.freeze({name:"arecord",args:Object.freeze(["-f","S16_LE","-r",`${wl}`,"-c","1","-t","raw","-q"]),deviceFlag:"-D"})]);function zb(){try{return io.env.get(aT)||void 0}catch{return}}function lT(n,e){let t=n.length;for(let r=1,o=0;r<t;r+=1){let i=t>>1;for(;o&i;i>>=1)o^=i;if(o^=i,r<o){let a=n[r];n[r]=n[o],n[o]=a;let s=e[r];e[r]=e[o],e[o]=s}}for(let r=2;r<=t;r<<=1){let o=r>>1,i=-2*Math.PI/r,a=Math.cos(i),s=Math.sin(i);for(let l=0;l<t;l+=r){let d=1,c=0;for(let u=0;u<o;u+=1){let h=l+u,f=h+o,p=n[f]*d-e[f]*c,m=n[f]*c+e[f]*d;n[f]=n[h]-p,e[f]=e[h]-m,n[h]=n[h]+p,e[h]=e[h]+m;let g=d*a-c*s;c=d*s+c*a,d=g}}}}function yl(n){return n>1?1:n<0?0:n}var To=[0,3,5,7,10,12],Th=[55,65.41,73.42,82.41],Rh=[96,112,128,140],dT=.14;function cT(n){let e=Math.log(n/Ro)/Math.log(vl/Ro);return Math.max(0,Math.min(ot-1,Math.round(e*ot-.5)))}function uT(n,e){let t=Math.sin(n*12.9898+e*78.233)*43758.5453;return t-Math.floor(t)}function hT(n={}){let e=n.mode??"mic",t=new Float32Array(_r),r=0,o=0,i="starting",a="",s,l=!1,d=new Float32Array(gt);for(let $=0;$<gt;$+=1)d[$]=.5*(1-Math.cos(2*Math.PI*$/(gt-1)));let c=new Float32Array(gt),u=new Float32Array(gt),h=wl/gt,f=new Int32Array(ot+1);for(let $=0;$<=ot;$+=1){let W=Ro*Math.pow(vl/Ro,$/ot);f[$]=Math.max(1,Math.min(gt/2-1,Math.round(W/h)))}let p=$=>Ro*Math.pow(vl/Ro,($+.5)/ot),m=new Float32Array(ot),g=new Float32Array(ot),y=new Float32Array(Xn),b=0,w=.08,x=0,k,C=0,T=Math.trunc(n.seed??performance.now())>>>0||1,S=()=>(T=Math.imul(T,1664525)+1013904223>>>0,T/4294967296),A=[{role:"bass",octave:0,decay:2.6,density:.28,stride:4,bright:.7,pattern:[],degree:0,freq:55,amp:0},{role:"lead",octave:2,decay:5.5,density:.5,stride:2,bright:.5,pattern:[],degree:0,freq:220,amp:0},{role:"arp",octave:3,decay:13,density:.66,stride:1,bright:.3,pattern:[],degree:0,freq:440,amp:0}],I=Th[0],O=Rh[1],v=0,N=0,R=0,M=!1,_=($,W)=>{let L=(W%To.length+To.length)%To.length,j=To[L]+12*($.octave+Math.floor(W/To.length));return I*Math.pow(2,j/12)},K=()=>{for(let $ of A){let W=[];for(let L=0;L<16;L+=1)W[L]=L%$.stride===0&&S()<$.density;$.role==="bass"&&(W[0]=!0),$.pattern=W}},X=()=>{I=Th[Math.floor(S()*Th.length)],O=Rh[Math.floor(S()*Rh.length)]},V=$=>{for(let W of A)if(W.pattern[$]){if(W.role==="lead"){let L=S()<.2,j=S()<.5?-1:1;W.degree=Math.max(-2,Math.min(11,W.degree+j*(L?3:1)))}else W.role==="arp"?W.degree=(W.degree+1)%(To.length*2):W.degree=S()<.75?0:3;W.freq=_(W,W.degree),W.amp=1}};function B($,W){let L=0;if(W.byte!==void 0&&$.length>0){let F=$[0]<<8|W.byte;t[r]=(F<<16>>16)/32768,r=(r+1)%_r,o+=1,W.byte=void 0,L=1}let j=$.length-L,H=j>>1;for(let F=0;F<H;F+=1){let oe=$[L+F*2],he=$[L+F*2+1];t[r]=((he<<8|oe)<<16>>16)/32768,r=(r+1)%_r,o+=1}j&1&&(W.byte=$[$.length-1])}async function z($){let W={byte:void 0},L=$.stdout.getReader();try{for(;!l;){let{value:j,done:H}=await L.read();if(H)break;j&&B(j,W)}}finally{L.releaseLock()}}async function Y(){let $=zb();for(let W of sT){if(l)return;if(e==="system"&&!W.monitorArgs&&!$)continue;let L=$?[W.deviceFlag,$]:e==="system"?[...W.monitorArgs]:[],j;try{j=new io.Command(W.name,{args:[...W.args,...L],stdin:"null",stdout:"piped",stderr:"null"}).spawn()}catch{continue}let H=o,F=z(j).catch(()=>{}),oe=performance.now()+iT;for(;!l&&o===H&&performance.now()<oe;)await new Promise(he=>setTimeout(he,50));if(o>H&&!l){if(s=j,a=W.name,i="mic",await F,l)return;s=void 0,i="starting";continue}try{j.kill()}catch{}await j.status.catch(()=>{})}!l&&i!=="mic"&&(i="synth")}let q=e==="synth"?Promise.resolve(i="synth"):Y().catch(()=>{l||(i="synth")});function te(){let $=(r-gt+_r)%_r,W=0;for(let H=0;H<gt;H+=1){let F=t[($+H)%_r];W+=F*F,c[H]=F*d[H],u[H]=0}lT(c,u);for(let H=0;H<ot;H+=1){let F=f[H],oe=Math.max(F+1,f[H+1]),he=0;for(let pe=F;pe<oe;pe+=1){let G=Math.hypot(c[pe],u[pe])*(2/gt);G>he&&(he=G)}let Fe=20*Math.log10(he+1e-9);m[H]=yl((Fe-bl)/(Db-bl))}let L=Math.sqrt(W/gt);b=yl((20*Math.log10(L+1e-9)-bl)/(Db-bl));let j=gt/Xn;for(let H=0;H<Xn;H+=1)y[H]=t[($+Math.floor(H*j))%_r]}function Q($){if(C+=$,!M)X(),K(),V(0),M=!0;else{N+=$;let L=0;for(;L<8;){let j=60/O/4;if(N<j)break;N-=j,L+=1,v=(v+1)%16,v===0&&(R+=1,K(),R%4===0&&X()),V(v)}}for(let L of A)L.amp*=Math.exp(-L.decay*$);for(let L=0;L<Xn;L+=1){let j=C-(Xn-1-L)/(Xn-1)*dT,H=0;for(let F of A){if(F.amp<.001)continue;let oe=2*Math.PI*F.freq*j;H+=F.amp*(Math.sin(oe)+F.bright*(.4*Math.sin(2*oe)+.2*Math.sin(3*oe)))}H+=(uT(L,R)-.5)*.06*A[2].amp,y[L]=Math.tanh(H*.6)}m.fill(0);for(let L of A){if(L.amp<.001)continue;let j=[[L.freq,1],[L.freq*2,.2+.5*L.bright],[L.freq*3,.35*L.bright]];for(let[H,F]of j){if(H>=vl)continue;let oe=cT(H),he=L.amp*F;m[oe]=Math.max(m[oe],he),oe>0&&(m[oe-1]=Math.max(m[oe-1],he*.5)),oe<ot-1&&(m[oe+1]=Math.max(m[oe+1],he*.5))}}for(let L=0;L<ot;L+=1){let j=.05*(1-L/ot)*(.6+.4*Math.sin(C*.8+L*.5));m[L]=yl(m[L]+Math.max(0,j))}let W=0;for(let L of A)W+=L.amp;b=yl(.12+W*.4)}function U($=performance.now()){let W=k===void 0?.125:Math.min(.25,Math.max(.001,($-k)/1e3));k=$,i==="mic"&&o>=gt?te():i==="synth"?Q(W):(m.fill(0),y.fill(0),b=0);for(let pe=0;pe<ot;pe+=1){let G=m[pe],ae=G>g[pe]?22:5;g[pe]=g[pe]+(G-g[pe])*Math.min(1,ae*W)}let L=0,j=0,H=0,F=0,oe=0,he=0;for(let pe=0;pe<ot;pe+=1){let G=p(pe);G<160?(L+=g[pe],j+=1):G<2e3?(H+=g[pe],F+=1):(oe+=g[pe],he+=1)}L/=Math.max(1,j),H/=Math.max(1,F),oe/=Math.max(1,he),x=Math.max(0,x-W);let Fe=!1;return x===0&&L>.18&&L>w*1.45&&(Fe=!0,x=.18),w+=(L-w)*Math.min(1,1.4*W),{level:b,bass:L,mid:H,treble:oe,bands:g,waveform:y,beat:Fe,source:i}}return{frame:U,label:()=>{if(i!=="mic")return i;let $=zb();return $?`mic:${a}:${$}`:`mic:${a}`},close:()=>{if(!l){l=!0;try{s?.kill()}catch{}}}}}if(import.meta.main){let n=hT();console.log("capturing... (3s)");let e=performance.now(),t=setInterval(()=>{let r=n.frame(),o=Array.from(r.bands,i=>" .:-=+*#%@"[Math.min(9,Math.floor(i*10))]).join("");console.log(`[${r.source.padEnd(7)}] level=${r.level.toFixed(2)} bass=${r.bass.toFixed(2)} mid=${r.mid.toFixed(2)} treble=${r.treble.toFixed(2)} ${r.beat?"BEAT":"    "} |${o}|`),performance.now()-e>3e3&&(clearInterval(t),n.close())},200)}function $b(){let n=new Float32Array(ot),e=new Float32Array(Xn),t=new Uint8Array(1024),r=new Uint8Array(2048),o,i,a,s=!1,l=0,d,c=5370206,u=()=>(c^=c<<13,c^=c>>>17,c^=c<<5,(c>>>0)/4294967295*2-1),h=0,f=p=>{let m=p/1e3;for(let b=0;b<n.length;b+=1)n[b]=Math.max(0,.35+.3*Math.sin(m*1.7+b/2.1)-b/n.length*.3);for(let b=0;b<e.length;b+=1)e[b]=Math.sin(m*4+b/9)*.35+Math.sin(m*7+b/23)*.2+u()*.15;let g=.4+.3*Math.sin(m*2.1),y=g>.62&&h<=.62;return h=g,{level:.45,bass:g,mid:.4+.25*Math.sin(m*1.3+1),treble:.3+.2*Math.sin(m*3.1+2),bands:n,waveform:e,beat:y,source:"synth"}};return{frame(p=performance.now()){if(!o)return f(p);o.getByteFrequencyData(t),o.getByteTimeDomainData(r);let m=t.length;for(let k=0;k<n.length;k+=1){let C=Math.floor(Math.pow(m,k/n.length)),T=Math.max(C+1,Math.floor(Math.pow(m,(k+1)/n.length))),S=0;for(let A=C;A<T&&A<m;A+=1)t[A]>S&&(S=t[A]);n[k]=S/255}let g=r.length/e.length;for(let k=0;k<e.length;k+=1)e[k]=(r[Math.floor(k*g)]-128)/128;let y=(k,C)=>{let T=Math.max(0,Math.floor(k/23.4)),S=Math.min(m,Math.ceil(C/23.4)),A=0;for(let I=T;I<S;I+=1)A+=t[I];return S>T?A/(S-T)/255:0},b=y(20,160),w=b>.5&&b>h*1.35;h=b;let x=0;for(let k=0;k<m;k+=1)x+=t[k];return{level:x/m/255,bass:b,mid:y(160,2e3),treble:y(2e3,12e3),bands:n,waveform:e,beat:w,source:"mic"}},label:()=>o?"mic:web":"noise generator",source:()=>o?"microphone":"noise",enableMicrophone(){if(o||s)return Promise.resolve();if(d)return d;let p=l;return d=(async()=>{let m,g;try{if(m=await navigator.mediaDevices.getUserMedia({audio:!0}),s||l!==p){m.getTracks().forEach(b=>b.stop());return}if(g=new AudioContext,await g.resume(),s||l!==p)throw new Error("Audio choice changed");let y=g.createAnalyser();y.fftSize=2048,y.smoothingTimeConstant=.6,g.createMediaStreamSource(m).connect(y),i=g,a=m,o=y}catch{m?.getTracks().forEach(y=>y.stop()),g?.close().catch(()=>{})}finally{d=void 0}})(),d},useNoise(){l++,a?.getTracks().forEach(p=>p.stop()),a=void 0,i?.close().catch(()=>{}),o=void 0,i=void 0},close(){s=!0,l++,a?.getTracks().forEach(p=>p.stop()),a=void 0,i?.close().catch(()=>{}),o=void 0,i=void 0}}}async function Hb(n){if(globalThis.isSecureContext&&navigator.clipboard?.writeText)try{return await navigator.clipboard.writeText(n),!0}catch{}let e=document.activeElement,t=globalThis.getSelection(),r=t?Array.from({length:t.rangeCount},(i,a)=>t.getRangeAt(a).cloneRange()):[],o=document.createElement("textarea");o.value=n,o.setAttribute("aria-label","Copy selected text"),o.style.cssText="position:fixed;left:-10000px;top:0;opacity:0;",document.body.appendChild(o);try{return o.focus({preventScroll:!0}),o.select(),document.execCommand("copy")}finally{if(o.remove(),e?.focus({preventScroll:!0}),t){t.removeAllRanges();for(let i of r)t.addRange(i)}}}var fT=n=>br(fi("small"),n,"font").map(e=>e.trimEnd()).filter(e=>e.length),_h=fT("PeerCompute"),Bb=["\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E           \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E","\u2502  PEER A  \u251C\u2500\u2500 libp2p \u2500\u2524  PEER B  \u2502","\u2570\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u256F           \u2570\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u256F","   WebGPU                  WebGPU"],_o=(n,e,t)=>Math.max(e,Math.min(t,n)),Ci=(n,e)=>n.length<=e?n:n.slice(0,Math.max(0,e-1))+"\u2026";function Ch(n,e){let t=[],r="";for(let o of n.trim().split(/\s+/)){for(r&&r.length+1+o.length>e&&(t.push(r),r="");o.length>e;)t.push(o.slice(0,e)),o=o.slice(e);r=r?r+" "+o:o}return r&&t.push(r),t}function mT(n,e,t,r){let o=n.naturalWidth||n.width,i=n.naturalHeight||n.height;if(!o||!i)return[];let a=document.createElement("canvas");a.width=e,a.height=t*2;let s=a.getContext("2d",{willReadFrequently:!0});if(!s)return[];s.fillStyle="rgb("+r.join(",")+")",s.fillRect(0,0,e,a.height);let l=Math.min(e/o,a.height/i),d=o*l,c=i*l;s.drawImage(n,(e-d)/2,(a.height-c)/2,d,c);let u=s.getImageData(0,0,e,a.height).data,h=f=>[u[f],u[f+1],u[f+2]];return Array.from({length:t},(f,p)=>Array.from({length:e},(m,g)=>{let y=(p*2*e+g)*4;return{char:"\u2580",foreground:h(y),background:h(y+e*4)}}))}function Fb({entries:n,openDemo:e,openSearch:t,openSettings:r,openHtml:o}){let i=["All",...new Set(n.map(R=>R.category))],a=new Map,s=i[0],l="",d=n,c=0,u=0,h=1,f=1,p=0,m={},g=[],y={},b=0,w=0,x,k=!1;function C(){let R=l.toLowerCase().trim().split(/\s+/).filter(Boolean);d=n.filter(M=>{let _=[M.title,M.category,M.description,M.summary,M.id].join(" ").toLowerCase();return(s===i[0]||M.category===s)&&R.every(K=>_.includes(K))}),c=0,u=0,b=0,k=!1,p++}function T(R){s=R,C()}function S(R){let M=_o(R,0,Math.max(0,d.length-1));c!==M&&(b=0),c=M,k=!1;let _=c*f;_<u?u=_:_+f>u+h&&(u=_+f-h),p++}function A(R){let M=_o(R,0,Math.max(0,d.length*f-h));M!==u&&(u=M,p++)}function I(R){let M=_o(R,0,w);M!==b&&(b=M,p++)}function O(R){let M=R.image;if(!M)return null;if(typeof M!="string"&&M.tagName==="CANVAS")return M;let _=typeof M=="string"?M:M.currentSrc||M.src;if(!_)return null;if(!a.has(_)){let X=new Image;a.set(_,X),X.onload=()=>{p++},X.src=_}let K=a.get(_);return K.complete&&K.naturalWidth?K:null}function v(R,M,_){let K={char:" ",background:_.surface},X=Array.from({length:M},()=>Array(R).fill(K));g=[];function V(G,ae,ye,Se=_.text,Re=_.surface){if(!(ae<0||ae>=M))for(let Ie of ye){if(G>=R)break;G>=0&&(X[ae][G]={char:Ie,foreground:Se,background:Re}),G++}}function B(G,ae,ye,Se,Re=_.accent,Ie=_.surface){V(G,ae,ye,Re,Ie),g.push({x:G,y:ae,width:ye.length,action:Se})}let z=R>=84?3:1,Y=R-z-1,q=Math.max(1,Y-z),te=0,Q=q>=80;if(Q&&M>=15){if(V(z,te++,"DEMO DIRECTORY",_.muted),M>=16+_h.length&&_h.every(G=>G.length<=q)){let G=te;for(let ae of _h)V(z,te++,ae,_.accent);if(q>=96){let ae=Y-Bb[0].length;Bb.forEach((ye,Se)=>V(ae,G+Se,ye,Se===1?_.text:_.muted))}}else V(z,te++,"PeerCompute",_.accent);M>=22&&(Ch("Explore shared worlds, browser AI and distributed simulations.",q).forEach(ae=>V(z,te++,ae)),te++)}else!Q&&M>=15&&V(z,te++,"PeerCompute",_.accent);if(B(z,te,Ci(l?"[ / ] Find: "+l:"[ / ] Find a demo",q),()=>t(),_.accent),te++,M>=(Q?13:23)&&q>=32){let G=z;for(let ae of i){let ye=ae===s?"["+ae+"]":" "+ae+" ";G>z&&G+ye.length>Y&&(te++,G=z),B(G,te,ye,()=>T(ae),ae===s?_.background:_.muted,ae===s?_.accent:_.surface),G+=ye.length+1}te++}else B(z,te++,Ci("Filter: "+s+"  \u203A",q),()=>N(1));M>=15&&V(z,te++,"\u2500".repeat(q),_.border);let U=Q?z+Math.floor(q*.48):Y,$=Q?U-z-1:q,W=M-1,L=M>=15,j=W-(L?2:1),H=te,F=H+1,oe=Math.max(1,j-F),he=h,Fe=f,pe=c*f>=u&&c*f<u+h;if(h=Q||!d.length?oe+1:Math.max(1,Math.floor((oe-1)*.43)),f=Q&&h>=10?2:1,pe&&(he!==h||Fe!==f)){let G=c*f;u=_o(u,G+f-h,G)}if(u=_o(u,0,Math.max(0,d.length*f-h)),V(z,H,d.length+(d.length===1?" DEMO":" DEMOS"),_.muted),d.length*f>h&&$>=19){let G=Math.max(f,Math.floor(h/f)*f);B(z+$-7,H,"[\u2191]",()=>{k=!1,A(u-G)}),B(z+$-3,H,"[\u2193]",()=>{k=!1,A(u+G)})}d.length||(V(z,F,Ci("No matching demos.",q)),B(z,F+1,"[ Clear filters ]",()=>{l="",T(i[0])}));for(let G=0;G<h;G++){let ae=Math.floor((G+u)/f),ye=d[ae];if(!ye)break;let Se=(G+u)%f,Re=c===ae,Ie=Re?_.surfaceStrong:_.surface,_e=Se?"  "+ye.category:(Re?"\u203A ":"  ")+ye.title;V(z,F+G,Ci(_e,$).padEnd($),Se?_.muted:Re?_.accent:_.text,Ie),g.push({x:z,y:F+G,width:$,action:()=>S(ae)})}if(x=void 0,w=0,d.length){let G=Q?U+2:z,ae=Math.max(1,Y-G),ye=Q?H:F+h,Se=ye+1,Re=Math.max(0,j-Se);if(Q)for(let De=ye;De<=j;De++)V(U,De,"\u2502",_.border);else M>=15&&V(G,ye,"\u2500".repeat(ae),_.border);V(G,ye,"PREVIEW",_.muted),x={x:G,top:ye,bottom:j};let Ie=d[c],_e=Ch(Ie.title,ae),it=Ch(Ie.summary||Ie.description,ae),je=Re>=7,Ce=_e.length+Number(je),Ae=Re-Ce-it.length-1,dt=Math.min(Q?15:8,Math.round(ae/3),Math.max(Re-Ce>=10?4:0,Ae)),$t=dt>=3?O(Ie):null,xl=Re>=7?1:0,Ei=Ce+($t?dt:0)+xl;w=Math.max(0,Ei+it.length-Re),b=_o(b,0,w);let At=Se-b,Mn=De=>De>=Se&&De<j;if(_e.forEach((De,Ot)=>{Mn(At+Ot)&&V(G,At+Ot,De,_.accent)}),je&&Mn(At+_e.length)&&V(G,At+_e.length,Ci(Ie.category,ae),_.muted),$t&&((y.image!==$t||y.width!==ae||y.height!==dt||y.theme!==_)&&(y={image:$t,width:ae,height:dt,theme:_,cells:mT($t,ae,dt,_.surface)}),y.cells.forEach((De,Ot)=>{let Co=At+Ce+Ot;Mn(Co)&&De.forEach((ey,ty)=>{X[Co][G+ty]=ey})})),it.forEach((De,Ot)=>{let Co=At+Ei+Ot;Mn(Co)&&V(G,Co,De)}),B(G,j,"[ Open demo \u2197 ]",()=>e(Ie.id)),w){let De=Math.max(1,Re-1),Ot=ae<22;B(Y-(Ot?3:7),j,Ot?"\u2191":"[\u2191]",()=>I(b-De),b?_.accent:_.muted),B(Y-(Ot?1:3),j,Ot?"\u2193":"[\u2193]",()=>I(b+De),b<w?_.accent:_.muted)}}if(L&&V(z,W-1,"\u2500".repeat(q),_.border),B(z,W,"[ Settings ]",r),q>=46?B(z+14,W,"[ HTML view ]",o):q>=21&&B(z+13,W,"[ HTML ]",o),q>=75){let G="\u2191 \u2193 select  \xB7  Enter to open";V(R-12-G.length,W,G,_.muted)}return X}function N(R){T(i[(i.indexOf(s)+R+i.length)%i.length])}return{id:"demo-atlas",title:"PeerCompute",summary:"Browse and launch PeerCompute demos.",window:{width:148,height:51,minWidth:25,minHeight:12,widthRatio:.84,heightRatio:.88,fullscreenBelow:1280},getSearch:()=>l,setSearch(R){l=R,C()},render(R,M,_,K){return(m.width!==R||m.height!==M||m.theme!==K||m.revision!==p)&&(m={width:R,height:M,theme:K,revision:p,frame:v(R,M,K)}),m.frame},onKey(R){if(R.ctrl||R.meta)return!1;switch(R.key){case"/":t();break;case"left":N(-1);break;case"right":N(1);break;case"up":R.shift?I(b-1):S(c-1);break;case"down":R.shift?I(b+1):S(c+1);break;case"home":S(0);break;case"end":S(d.length-1);break;case"pageup":S(c-Math.max(1,Math.floor(h/f)));break;case"pagedown":S(c+Math.max(1,Math.floor(h/f)));break;case"return":d[c]&&e(d[c].id);break;default:return!1}return!0},onPointerUp(R,M){g.find(K=>K.y===M&&R>=K.x&&R<K.x+K.width)?.action()},onWheel(R,M,_){let K=x&&M>=x.x&&_>=x.top&&_<=x.bottom;return k=!!(K&&w),K?I(b+R*3):A(u+R*f),!0},scrollTo(R){k?I(R):A(R)},vscroll(R,M){return k?{offset:b,total:M+w}:{offset:u,total:M+Math.max(0,d.length*f-h)}}}}function jb(n){let e=document.createElement("canvas"),t=[];return n.setSourceComposer(r=>{if(!t.length)return r;let{width:o,height:i}=r;e.width!==o&&(e.width=o),e.height!==i&&(e.height=i);let a=e.getContext("2d");a.globalCompositeOperation="copy",a.drawImage(r,0,0),a.globalCompositeOperation="source-over";for(let{canvas:s,box:l,parts:d}of t)if(!(!s.width||!s.height||!d.length)){a.save(),a.beginPath();for(let c of d){let u=Math.round(c.left*o),h=Math.round(c.top*i),f=Math.round((c.left+c.width)*o),p=Math.round((c.top+c.height)*i);a.rect(u,h,f-u,p-h)}a.clip(),a.drawImage(s,l.left*o,l.top*i,l.width*o,l.height*i),a.restore()}return e}),{setLayers(r){t=r},dispose(){n.setSourceComposer(null),t=[],e.width=e.height=0}}}var Eh=[[.5,.5],[.25,.25],[.75,.75],[.25,.75],[.75,.25],[.5,.2],[.5,.8],[.2,.5],[.8,.5]],Gb=[400,700,1200,2400,4800,8e3];function Ub({stage:n,surface:e,frame:t}){if(e.hasAttribute("data-pc-foreign"))return null;let r=document.createElement("canvas");if(!("content"in r)||typeof r.requestPaint!="function"||typeof CanvasRenderingContext2D.prototype.drawElementImage!="function"||typeof n.moveBefore!="function")return null;r.setAttribute("content","drawable");let o=r.getContext("2d");if(!o)return null;r.className="pc-demo-capture",Object.assign(r.style,{display:"block",width:"100%",height:"100%"}),e.setAttribute("drawable",""),r.append(e),n.append(r);let i=0,a=0,s=!1,l=!1,d=0,c,u=1/0,h,f=new WeakMap;function p(){l=!0,s=!1,clearTimeout(c),t.removeEventListener("load",w),r.onpaint=null}function m(x){p(),n.dataset.captureFallback=x,n.moveBefore(e,r),r.remove(),e.removeAttribute("drawable"),e.style.removeProperty("width"),e.style.removeProperty("height")}function g(x,k,C){if(!h){let R=document.createElement("canvas");R.width=2,R.height=Eh.length,h=R.getContext("2d",{willReadFrequently:!0}),h.imageSmoothingEnabled=!1}let T=r.width/i,S=r.height/a;h.clearRect(0,0,2,Eh.length);let A=0;for(let[R,M]of Eh){let _=k.left+k.width*R,K=k.top+k.height*M;_<0||K<0||_>=t.clientWidth||K>=t.clientHeight||C.elementFromPoint(_,K)!==x||(h.drawImage(x,Math.floor(R*x.width),Math.floor(M*x.height),1,1,0,A,1,1),h.drawImage(r,Math.floor((t.offsetLeft+_)*T),Math.floor((t.offsetTop+K)*S),1,1,1,A,1,1),A++)}if(!A)return"unknown";let I=h.getImageData(0,0,2,A).data,O=0,v=0,N=0;for(let R=0;R<I.length;R+=8){if(I[R+3]<250)continue;O++;let M=Math.max(Math.abs(I[R]-I[R+4]),Math.abs(I[R+1]-I[R+5]),Math.abs(I[R+2]-I[R+6]),Math.abs(I[R+3]-I[R+7]));M<=16&&v++,M>=32&&N++}return O&&v>=Math.ceil(O*.65)?"match":O>=2&&N>=Math.ceil(O*.75)?"mismatch":"unknown"}function y(x){x>=u||(clearTimeout(c),u=x,c=setTimeout(()=>{u=1/0,r.requestPaint()},Math.max(0,Math.ceil(x-performance.now()))))}function b(x,k){for(let C of x.getElementsByTagName("canvas")){let T=f.get(C)||{attempts:0,next:0,mismatches:0,firstMismatch:0};if(T.next>k){d=Math.min(d,T.next),y(T.next);continue}if(!C.width||!C.height)continue;let S=C.getBoundingClientRect();if(S.width<1||S.height<1||S.right<=0||S.bottom<=0||S.left>=t.clientWidth||S.top>=t.clientHeight)continue;let A=g(C,S,x);if(A==="mismatch"){let I=x.defaultView.getComputedStyle(C);(Number(I.opacity)<1||I.filter!=="none"||I.mixBlendMode!=="normal")&&(A="unknown")}if(A==="mismatch"){if(T.mismatches||(T.firstMismatch=k),T.mismatches++,T.mismatches>=3&&k-T.firstMismatch>=1500)return!1}else T.mismatches=0;T.next=A==="match"||T.attempts>=Gb.length?1/0:k+Gb[T.attempts],T.attempts++,f.set(C,T),d=Math.min(d,T.next),y(T.next)}return!0}r.onpaint=()=>{if(!(l||!i||!a||n.hidden))try{let x=t.contentDocument;if(!x){m("foreign-document");return}o.clearRect(0,0,r.width,r.height),o.drawElementImage(e,0,0,r.width,r.height);let k=performance.now();if(k>=d&&(d=k+500,!b(x,k))){m("uncaptured-canvas");return}s=!0}catch{m("capture-unavailable")}};function w(){l||(d=0,r.requestPaint(),y(performance.now()+650))}return t.addEventListener("load",w),{canvas:r,isReady:()=>s,resize(x,k){if(l||x<=0||k<=0)return;let C=window.devicePixelRatio||1,T=Math.max(1,Math.round(x*C)),S=Math.max(1,Math.round(k*C));i===x&&a===k&&r.width===T&&r.height===S||(i=x,a=k,e.style.width=i+"px",e.style.height=a+"px",r.width=T,r.height=S,s=!1,r.requestPaint())},dispose:p}}function Kb({stage:n,frame:e,root:t,shader:r}){let o=new AbortController,i,a=!1,s,l;function d(h,f){let p=t.getBoundingClientRect();if(!p.width||!p.height)return;let m=(h-p.left)/p.width,g=(f-p.top)/p.height;if(m<0||g<0||m>1||g>1)return;let y=r.warpPoint(m,g),b=Math.round((m-y.u)*p.width*4)/4,w=Math.round((g-y.v)*p.height*4)/4,x=b||w?b+"px "+w+"px":"";n.style.translate!==x&&(n.style.translate=x)}function c(h,f,p=!1){let m=y=>{if(!a||n.hidden||!y.isTrusted||y.isPrimary===!1||p&&y.screenX===s&&y.screenY===l)return;s=y.screenX,l=y.screenY;let{clientX:b,clientY:w}=y;if(p){let x=e.getBoundingClientRect();b+=x.left,w+=x.top}d(b,w)},g={capture:!0,passive:!0,signal:f};for(let y of["pointerover","pointermove","wheel"])h.addEventListener(y,m,g)}function u(){i?.abort(),s=l=void 0;let h=e.contentDocument;h&&(i=new AbortController,c(h,i.signal,!0))}return c(window,o.signal),e.addEventListener("load",u,{signal:o.signal}),u(),{setActive(h){a!==h&&(a=h,s=l=void 0,a||(n.style.translate=""))},dispose(){a=!1,n.style.translate="",i?.abort(),o.abort()}}}var Xb="peercompute-atlas-demo:",Jb="peercompute.atlas.return.v1";function Zb(){return window===window.parent||!window.name.startsWith(Xb)?!1:(window.parent.postMessage(Jb,"*"),!0)}var pT=`
.pc-demo-stage { position: fixed; display: flex; flex-direction: column;
  overflow: hidden; z-index: 1; background: #0a1014; color: #cfefea; }
.pc-demo-stage[data-presentation="shader"] { opacity: 0; }
.pc-demo-stage[inert] { pointer-events: none; }
.pc-demo-stage[hidden] { display: none !important; }
.pc-demo-surface { position: relative; display: flex; flex: 1; min-height: 0; flex-direction: column; overflow: hidden; }
.pc-demo-stage nav { display: flex; justify-content: space-between; align-items: center;
  gap: 10px; padding: 0 8px; flex: none; border-bottom: 1px solid currentColor; }
.pc-demo-stage nav :is(button,a) { font: 12px/1.4 ui-monospace, monospace; color: inherit;
  background: transparent; border: 0; padding: 5px 2px; text-decoration: none; cursor: pointer; }
.pc-demo-stage nav :is(button,a):hover { text-decoration: underline; }
.pc-demo-stage iframe { display: block; width: 100%; min-height: 0; flex: 1; border: 0; }
.pc-demo-focus { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0;
  border: 0; background: transparent; cursor: pointer; }
.pc-demo-dragging .pc-demo-stage { pointer-events: none; }
@media (pointer: coarse) { .pc-demo-stage nav :is(button,a) { min-height: 36px; } }`;function qb(n,e,t,r,o,i=!1){let a=n.column/e,s=(n.column+n.width)/e,l=n.row/t,d=(n.row+n.height)/t;function c(w,x){let k=2*w-1,C=2*x-1,T=o*(k*k+C*C),S=1;for(let A=0;A<4;A++){let I=T*S*S;S-=((1-o+I)*S-1)/(1-o+3*I)}return{x:(1+k*S)/2,y:(1+C*S)/2}}let u=[a,Math.max(a,Math.min(.5,s)),s],h=[l,Math.max(l,Math.min(.5,d)),d],f=i?Math.min:Math.max,p=i?Math.max:Math.min,m=f(...h.map(w=>c(a,w).x)),g=p(...h.map(w=>c(s,w).x)),y=f(...u.map(w=>c(w,l).y)),b=p(...u.map(w=>c(w,d).y));return{left:r.left+m*r.width,top:r.top+y*r.height,width:(g-m)*r.width,height:(b-y)*r.height}}function Yb(n,e){let t=n.left+n.width,r=n.top+n.height,o=Math.max(n.left,e.left),i=Math.max(n.top,e.top),a=Math.min(t,e.left+e.width),s=Math.min(r,e.top+e.height);return a<=o||s<=i?[n]:[{left:n.left,top:n.top,width:n.width,height:i-n.top},{left:n.left,top:s,width:n.width,height:r-s},{left:n.left,top:i,width:o-n.left,height:s-i},{left:a,top:i,width:t-a,height:s-i}].filter(l=>l.width>0&&l.height>0)}function Qb({entries:n,root:e,presenter:t,openAtlas:r,focusDesktop:o,focusWindow:i,closeWindow:a}){let s=new Map(n.map(T=>[T.id,T])),l=new Map,d=jb(t.shader),c=document.createElement("style");c.textContent=pT,document.head.append(c);let u=new AbortController,h={signal:u.signal},f="";function p(T){let S=l.get(T);S&&(S.input?.dispose(),S.capture?.dispose(),S.stage.remove(),l.delete(T),f="")}function m(T){p(T),a(T),r(),o()}let g=new URL("./",location.href);function y(T){return T.origin===g.origin&&(T.pathname===g.pathname||T.pathname===g.pathname+"index.html")}window.addEventListener("message",T=>{if(T.data===Jb)for(let[S,A]of l){if(A.frame.contentWindow!==T.source)continue;let I=new URL(g);I.port="4173",(T.origin===g.origin||new URL(A.frame.src).origin!==g.origin&&T.origin===I.origin)&&m(S);break}},h);let b=()=>e.parentElement.classList.remove("pc-demo-dragging");e.addEventListener("pointerdown",()=>e.parentElement.classList.add("pc-demo-dragging"),{...h,capture:!0}),window.addEventListener("pointerup",b,{...h,capture:!0}),window.addEventListener("pointercancel",b,{...h,capture:!0}),window.addEventListener("blur",b,h);function w(T){let S=s.get(T);if(!S||l.has(T))return;let A=document.createElement("section");A.className="pc-demo-stage",A.dataset.demoWindow=T,A.setAttribute("aria-label",S.title),A.hidden=!0;let I=document.createElement("nav");I.setAttribute("aria-label",S.title+" window controls");let O=document.createElement("button");O.type="button",O.textContent="\u2190 Back to PeerCompute",O.addEventListener("click",()=>{r(),o()});let v=document.createElement("a");v.textContent="Open in tab \u2197",v.href=S.href,v.target="_blank",v.rel="noopener";let N=document.createElement("small");N.textContent="Standard view",N.hidden=!0,I.append(O,N,v);let R=document.createElement("iframe");R.title=S.title,R.name=Xb+T,R.allow="autoplay; camera; clipboard-write; cross-origin-isolated; display-capture; fullscreen; gamepad; geolocation; microphone; xr-spatial-tracking",R.addEventListener("load",()=>{let B=R.contentDocument?.URL;B&&y(new URL(B))&&m(T)});let M=document.createElement("button");M.type="button",M.className="pc-demo-focus",M.setAttribute("aria-label","Focus "+S.title),M.addEventListener("click",()=>i(T));let _=document.createElement("div");_.className="pc-demo-surface",_.append(I,R);let K=new URL(S.href,location.href).origin===location.origin,X=K?Ub({stage:A,surface:_,frame:R}):null;X||A.append(_);let V=X?Kb({stage:A,frame:R,root:e,shader:t.shader}):null;A.append(M),l.set(T,{stage:A,surface:_,frame:R,nav:I,mode:N,shield:M,capture:X,input:V,sameOrigin:K}),f="",R.src=S.href,e.after(A)}let x=n.map(T=>({id:T.id,title:T.title,summary:T.description,menu:!1,liveClient:!0,window:{width:160,height:64,minWidth:24,minHeight:9,widthRatio:.87,heightRatio:.88,fullscreenBelow:800},render:(S,A,I,O)=>[Array.from(T.title.slice(0,S),v=>({char:v,foreground:O?.accent}))]}));function k(T,S,A,I,O){for(let U of I)U.state==="closed"&&p(U.id);for(let U of T)w(U.id);if(!l.size){d.setLayers([]);return}let v=t.size(),N=e.getBoundingClientRect(),R=t.shader,M=R.enabled().includes("crt")?R.option("crt","curve")??0:0,_=R.isPresenting(),K=Array.from(l.values(),({capture:U,stage:$})=>U?.canvas.parentElement===$?U.isReady()?"ready":"painting":"native"),X=[_,S,devicePixelRatio,...K,v.columns,v.rows,...O.map(U=>[U.column,U.row,U.width,U.height].join(",")),N.left,N.top,N.width,N.height,A.id,M,...T.map(U=>[U.id,U.active,...Object.values(U.rect),...Object.values(U.clientRect)].join(","))].join("|");if(f===X)return;f=X;let V=U=>({left:U.column/v.columns,top:U.row/v.rows,width:U.width/v.columns,height:U.height/v.rows}),B=U=>({left:N.left+U.left*N.width,top:N.top+U.top*N.height,width:U.width*N.width,height:U.height*N.height}),z=[...T.map(U=>U.rect),...O],Y=z.map(V),q=z.map(U=>qb(U,v.columns,v.rows,N,M,!0)),te=new Set,Q=[];T.forEach((U,$)=>{let W=l.get(U.id);if(!W)return;let{stage:L,surface:j,nav:H,mode:F,frame:oe,shield:he,capture:Fe,input:pe}=W;te.add(U.id),L.hidden=!1;let G=V(U.clientRect),ae=B(G),ye=Fe&&Fe.canvas.parentElement===L;ye&&Fe.resize(ae.width,ae.height);let Se=_&&ye&&Fe.isReady(),Re=Y.slice($+1).reduce((Ce,Ae)=>Ce.flatMap(dt=>Yb(dt,Ae)),[G]);Se&&Re.length&&Q.push({canvas:Fe.canvas,box:G,parts:Re});let Ie=ye?ae:qb(U.clientRect,v.columns,v.rows,N,M),_e=ye?Re.map(B):q.slice($+1).reduce((Ce,Ae)=>Ce.flatMap(dt=>Yb(dt,Ae)),[Ie]),it=_e.length===0;W.covered&&!it&&ye&&Fe.canvas.requestPaint(),W.covered=it,L.inert=S||it,L.dataset.presentation=Se?"shader":"native",F.hidden=ye||!_,F.hidden||(F.title=!W.sameOrigin||L.dataset.captureFallback==="foreign-document"?"This demo is on a different origin.":L.dataset.captureFallback?"Your browser could not include this scene in the desktop shaders.":"Your browser uses a standard iframe for this demo."),pe?.setActive(!!(Se&&U.active&&!L.inert)),he.hidden=U.active,H.inert=oe.inert=!U.active||L.inert,L.style.color="rgb("+A.accent.join(",")+")",j.style.backgroundColor=L.style.backgroundColor="rgb("+A.surface.join(",")+")";for(let[Ce,Ae]of Object.entries(Ie))L.style[Ce]=Ae+"px";let je=_e.map(Ce=>`M${Ce.left-Ie.left},${Ce.top-Ie.top}h${Ce.width}v${Ce.height}h${-Ce.width}Z`);L.style.clipPath=it?"inset(50%)":`path("${je.join(" ")}")`}),d.setLayers(Q);for(let[U,{stage:$,input:W}]of l)te.has(U)||($.hidden=!0,$.inert=!0,W?.setActive(!1))}function C(){d.dispose(),u.abort(),b();for(let T of l.keys())p(T);c.remove()}return{applications:x,open:w,project:k,dispose:C}}function gT(n){let e,t=!1;return import(new URL("./desktop-butterchurn.js",import.meta.url).href).then(({createButterchurnBackground:o})=>{t||(e=o(n))}).catch(o=>console.warn("Butterchurn wallpaper unavailable.",o)),{advance:o=>e?.advance(o)??!1,rasterizeCells:(o,i)=>e?.rasterizeCells(o,i)??[],setPointer:(o,i)=>e?.setPointer(o,i),clearPointer:()=>e?.clearPointer(),pick:(o,i,a)=>e?.pick?.(o,i,a)??!1,get presetIndex(){return e?.presetIndex},dispose(){t=!0,e?.dispose?.()}}}async function bT(n,e){let t=document.querySelector("#plain-directory").href,r=[...e.querySelectorAll("[data-demo-dir]")].map(I=>({id:"launch-"+I.dataset.demoDir+"-"+I.dataset.demoPath,title:I.querySelector("h2").textContent.trim(),description:I.querySelector("p").textContent.trim(),summary:I.querySelector(".demo-summary")?.textContent.trim()||I.querySelector("p").textContent.trim(),category:I.dataset.category,href:I.href,image:I.querySelector("img,canvas")})),o=e.querySelector(".source"),i=document.querySelector("#desktop-search"),a=i.querySelector("input"),s=$b(),l=Vb({root:n,storeDatabase:"peercompute-demo-atlas",host:{platformOptions:{textInput:"target"}}}),d,c=0,u=!1,h=0,f=()=>l.focus(),p=Qb({entries:r,root:n,presenter:l,focusDesktop:f,focusWindow:kb,closeWindow:Sb,openAtlas:()=>{d.openWindow(y.id),f()}});function m(I){p.open(I),d.openWindow(I)}function g(){i.open||(a.value=y.getSearch(),i.showModal(),a.focus(),a.select())}let y=Fb({entries:r,openDemo:m,openSearch:g,openSettings:()=>d.openWindow("settings"),openHtml:()=>location.assign(t)}),b=matchMedia("(prefers-reduced-motion: reduce)"),w=r.map(I=>({id:I.id,title:I.title,summary:I.description,href:I.href}));w.push({id:"source",title:"Project source",summary:"PeerCompute on GitHub",href:o.href},{id:"plain",title:"HTML directory",summary:"Browse accessible direct links",href:t}),d=vb({startLabel:"PeerCompute",initialWindow:y.id,applications:[y,...p.applications],hiddenMenuIds:["about","exomonitor","neon","viz","three","clock","workbench","jsr","github"],menuLinks:w,audio:s,shader:l.shader,reducedMotion:()=>b.matches,viewportWidth:()=>n.clientWidth,extraBackgrounds:[{id:"butterchurn",label:"Butterchurn \u2014 audio-reactive MilkDrop",fps:30,create:()=>gT(s)}],copyText:Hb,selectionText:()=>getSelection()?.toString()??"",openExternal(I){let O=r.find(v=>v.href===I);O?m(O.id):I===o.href?o.click():I===t&&location.assign(t)},onWindows:(I,O,v,N,R)=>p.project(I,O,v,xb(),R)});let x=[],k=new AbortController,C={signal:k.signal};function T(){if(!u){u=!0,cancelAnimationFrame(c),k.abort(),i.open&&i.close();for(let I of x)I();p.dispose(),s.close(),l.dispose()}}function S(I){T(),document.documentElement.classList.remove("exowebtui-ready"),e.hidden=!1,n.hidden=!0,console.warn("Switched to the HTML demo directory.",I)}function A(I){if(!u)try{I-h>=1e3/30&&(l.present(d.frame(I,l.size())),h=I),c=requestAnimationFrame(A)}catch(O){S(O)}}try{a.addEventListener("input",()=>y.setSearch(a.value),C),i.addEventListener("close",f,C),await d.init(l);for(let[I,O]of[["onKey","key"],["onPointer","pointer"],["onWheel","wheel"],["onResize","resize"]])x.push(l[I](v=>d[O](v)));e.addEventListener("click",I=>{let O=I.target.closest("a[href]");if(!O||I.defaultPrevented||I.button||I.metaKey||I.ctrlKey||I.shiftKey||I.altKey)return;let v=r.find(N=>N.href===O.href);v&&(I.preventDefault(),m(v.id))},C),l.present(d.frame(performance.now(),l.size())),document.documentElement.classList.add("exowebtui-ready"),e.hidden=!0,f(),c=requestAnimationFrame(A),window.addEventListener("pagehide",I=>{I.persisted||T()},C)}catch(I){S(I)}}async function yA(){let n=document.querySelector("#desktop");if(Zb()||new URLSearchParams(location.search).get("view")==="html"){n.hidden=!0;return}await bT(n,document.querySelector("#atlas"))}export{yA as startDesktop};
