import{a as Gr}from"./chunk-KS47KZWR-CGo6t1ZD.js";import{c as zr}from"./chunk-KQLB2F66-CqQ6Pnjj.js";import{n as Xe,_ as c}from"./carnageWindow-BBcEUL8m.js";
import"./preload-helper-FD8EeCEm.js";import"./graph-B911Usce.js";function Go(t,{measure:e}){const n=t.config?.swimlane?.
lineHops;if(n===!1)return;const o=n==="gap"?"gap":"arc",s=t.edges.filter(r=>Array.isArray(r.points)&&r.points.length>=2).
map(r=>({id:r.id,points:r.points,curve:r.curve,arrowTypeStart:r.arrowTypeStart,arrowTypeEnd:r.arrowTypeEnd}));Gr(e.groups.
edgePaths,s,{enabled:!0,jumpRadius:6,jumpStyle:o})}c(Go,"applySwimlaneLineJumps");function zo(t){const e=t?.metadata?.laneRole;
return e==="pool"||e==="lane"?e:void 0}c(zo,"readLaneRole");function en(t){const e=t?.metadata?.laneIndex;return typeof e==
"number"&&Number.isFinite(e)?e:void 0}c(en,"readLaneIndex");function ue(t){const e=new Map,n=new Map;for(const g of t)e.
set(g.id,g),g.isGroup&&g.parentId&&n.set(g.parentId,(n.get(g.parentId)??0)+1);const o=new Set;for(const g of t)g.isGroup&&
zo(g)==="pool"&&(n.get(g.id)??0)>0&&o.add(g.id);const s=new Set,r=new Map;for(const g of t)if(!(!g.isGroup||o.has(g.id)))
if(g.parentId&&o.has(g.parentId)){s.add(g.id);const x=r.get(g.parentId)??[];x.push(g.id),r.set(g.parentId,x)}else g.parentId||
s.add(g.id);const i=c((g,x)=>{const d=new Set([g]);let b=e.get(g)?.parentId;for(;b&&!d.has(b);){if(x.has(b))return b;d.add(
b),b=e.get(b)?.parentId}return null},"walk"),a=new Map;return{isPool:c(g=>o.has(g),"isPool"),isLane:c(g=>s.has(g),"isLan\
e"),laneIdOf:c(g=>{const x=a.get(g);if(x!==void 0)return x;const d=i(g,s);return a.set(g,d),d},"laneIdOf"),poolIdOf:c(g=>o.
has(g)?g:i(g,o),"poolIdOf"),lanesByPool:r,hasPools:o.size>0}}c(ue,"buildLaneModel");var $r=new Set(["top","right","botto\
m","left"]),Nn=8,Vr=1e4;function Ye(t){const e=t?.metadata?.anchorTo;if(!e||typeof e!="object")return;const{hostId:n,side:o,
slot:s,gap:r}=e;if(!(typeof n!="string"||n.length===0||n===t?.id))return{hostId:n,...typeof o=="string"&&$r.has(o)?{side:o}:
{},...typeof s=="number"&&Number.isFinite(s)?{slot:s}:{},...typeof r=="number"&&Number.isFinite(r)&&r>0?{gap:Math.min(r,
Vr)}:{}}}c(Ye,"readAnchor");function pn(t,e){const n=new Set([t]);let o=Ye(e.get(t))?.hostId;for(;o&&!n.has(o);){const s=e.
get(o);if(!s)return;const r=Ye(s)?.hostId;if(!r)return o;n.add(o),o=r}}c(pn,"resolveAnchorHostId");function ze(t){const e=new Map(
t.map(o=>[o.id,o])),n=new Set;for(const o of t)Ye(o)&&pn(o.id,e)&&n.add(o.id);return n}c(ze,"collectAnchoredIds");function $o(t,e){
return t==="canonical"?"right":e==="LR"||e==="RL"?"bottom":"right"}c($o,"defaultAnchorSide");function Vo(t,e){const n=t.
anchor.slot,o=e.anchor.slot;return n!==void 0&&o!==void 0&&n!==o?n-o:n!==void 0&&o===void 0?-1:n===void 0&&o!==void 0?1:
t.index-e.index}c(Vo,"compareBucketEntries");function Uo(t){const e=t.reduce((s,r)=>s+r,0)+Nn*Math.max(0,t.length-1),n=[];
let o=-e/2;for(const s of t)n.push(o+s/2),o+=s+Nn;return{offsets:n,total:e}}c(Uo,"packAlongBorder");var Ur=c(t=>[t.width,
t.height].every(e=>e===void 0||Number.isFinite(e)),"hasUsableSize");function jo(t,e){const n=new Map(t.map(s=>[s.id,s])),
o=new Map;t.forEach((s,r)=>{const i=Ye(s);if(!i||!Ur(s))return;const a=pn(s.id,n);if(!a)return;const h=e(i),g=`${h}:${a}`,
x=o.get(g)??[];x.push({node:s,anchor:i,index:r,side:h,hostId:a}),o.set(g,x)});for(const s of o.values())s.sort(Vo);return o}
c(jo,"bucketByHostAndSide");function Wo(t,e,n,o){const s=!e&&n>0?-(o+Nn):0;return t+s}c(Wo,"centreAlongBorder");function Ko(t,e){
const n=e==="top"||e==="bottom",o=c(g=>n?g.width??0:g.height??0,"alongBorder"),s=c(g=>n?g.height??0:g.width??0,"reach"),
{offsets:r}=Uo(t.map(g=>o(g.node)));let i=0,a=0,h=0;return t.forEach((g,x)=>{const d=g.anchor.gap??0,b=o(g.node)/2,l=Wo(
r[x],n,d,b);i=Math.max(i,b-l),a=Math.max(a,l+b),h=Math.max(h,d>0?d+s(g.node):0)}),{before:i,after:a,beyond:h}}c(Ko,"foot\
printOf");function qo(t,e){const n=$o("final",e??"TB"),o=new Map;for(const s of jo(t,r=>r.side??n).values()){if(!s.some(
a=>a.anchor.gap))continue;const{hostId:r,side:i}=s[0];o.set(r,{...o.get(r),[i]:Ko(s,i)})}return o}c(qo,"anchorFootprints");
var An="__swimlane_default__",jr=21,_o=20;function Bn(t){return Math.max(t.padding??_o,_o)}c(Bn,"topLaneHorizontalPaddin\
g");function Zo(t){const{x:e,y:n,width:o,height:s}=t,r=t.swimlaneContentTop;if(typeof e!="number"||typeof n!="number"||typeof o!=
"number"||typeof s!="number"||typeof r!="number"||!Number.isFinite(e)||!Number.isFinite(n)||!Number.isFinite(o)||!Number.
isFinite(s)||!Number.isFinite(r)||o<=0||s<=0){delete t.groupTitleRect;return}const i=n-s/2,a=Math.min(r,n+s/2),h=Math.min(
jr,Math.max(0,a-i)),g=i+h;if(g<=i){delete t.groupTitleRect;return}t.groupTitleRect={left:e-o/2,right:e+o/2,top:i,bottom:g}}
c(Zo,"assignTopLaneTitleRect");function Jo(t){const e=t.other?.droppedSubGraphMembers;return Array.isArray(e)?e:[]}c(Jo,
"sharedMembers");var Wr=c((t,e,n)=>!e.some(o=>o.parentId===n)&&!(t.edges??[]).some(o=>o.start===n||o.end===n),"isEmptyLa\
ne");function Qo(t,e){return t.isLane(e)?e:t.laneIdOf(e)??void 0}c(Qo,"laneIdOrSelf");function ts(t,e,n){for(const o of n){
const s=e.findIndex(r=>r.id===o);s>=0&&Wr(t,e,o)&&e.splice(s,1)}}c(ts,"removeEmptyLanes");function es(t,e){const n=ue(e),
o=new Set(e.filter(r=>n.isLane(r.id)).map(r=>r.id)),s=new Set;for(const{node:r,keptBy:i,droppedFrom:a}of Jo(t)){const h=Qo(
n,i);h&&h!==a&&o.has(a)&&(Xe.warn(`Swimlane node "${r}" is listed in lanes "${h}" and "${a}"; it is drawn in "${h}" only\
.`),s.add(a))}ts(t,e,s)}c(es,"dropLanesEmptiedBySharedNodes");function ns(t,e){for(const n of t)n.isGroup&&!e.isLane(n.id)&&
!e.isPool(n.id)&&Xe.warn(`Swimlane subgraph "${n.id}" is nested in "${n.parentId}"; only top-level subgraphs are lanes, \
so it is drawn as a plain box.`)}c(ns,"warnAboutNestedGroups");function os(t){const e=t.direction,n=t.nodes??=[];es(t,n);
const o=ue(n);ns(n,o);for(const i of n){const a=o.isLane(i.id);!a&&!o.isPool(i.id)||(i.shape=a?"swimlane":"pool",e&&(i.direction=
e))}const s=n.filter(i=>!i.isGroup&&!i.parentId);if(s.length===0)return;let r=n.find(i=>i.id===An);r?r.isGroup&&(r.shape=
"swimlane",e&&(r.direction=e)):(r={id:An,label:"",isGroup:!0,shape:"swimlane",padding:20,look:t.config?.look,colorIndex:n.
reduce((i,a)=>Math.max(i,a.colorIndex??-1),-1)+1,...e?{direction:e}:{}},n.push(r));for(const i of s)i.parentId=An}c(os,"\
prepareLayoutForSwimlanes");function ss(t){const e=(t.nodes??[]).filter(d=>!d.isEdgeLabel),n=new Map(e.map(d=>[d.id,d])),
o=ze(e),s=c(d=>o.has(d)?pn(d,n)??d:d,"hostOf"),r=new Map;for(const d of e)o.has(d.id)||r.set(d.id,d);const i=[];for(const d of t.
edges??[]){const b=typeof d.start=="string"?d.start:void 0,l=typeof d.end=="string"?d.end:void 0;if(!b||!l||d.isLayoutOnly)
continue;const p=s(b),f=s(l);p!==f&&i.push({id:d.id,src:p,dst:f,ref:d})}const a=e.filter(d=>d.isGroup&&!o.has(d.id)),h=e.
filter(d=>!d.isGroup&&!o.has(d.id));return{nodes:[...[...a].reverse(),...h].map(d=>d.id),edges:i,layout:t,nodeById:r}}c(
ss,"toGraphView");function rs(t){const e=new Map(t.map(o=>[o.id,o])),n=c(o=>{let s=0,r=o.parentId;const i=new Set([o.id]);
for(;r!=null&&!i.has(r);)i.add(r),s++,r=e.get(r)?.parentId;return s},"depthOf");return t.filter(o=>o?.isGroup).map(o=>({
node:o,depth:n(o)})).sort((o,s)=>s.depth-o.depth).map(o=>o.node)}c(rs,"groupsDeepestFirst");function is(t,e,n,o){const{layout:s}=t,
r=t.nodeById,i=o?.layerGap??100,a=o?.nodeGap??40;let h=0;for(const p of e.layers){let f=0;for(const m of p){const S=r.get(
m);if(!S){f++;continue}S.layer=h,S.order=f;const M=n.x[m]??f*a,L=n.y[m]??h*i;S.x=M,S.y=L,f++}h++}const g=s.nodes??[],x=ze(
g);for(const p of g)p.isEdgeLabel&&n.x[p.id]!=null&&n.y[p.id]!=null&&(p.x=n.x[p.id],p.y=n.y[p.id]);const d=new Map,b=ue(
g),l=[];for(const p of rs(g)){b.isLane(p.id)&&l.push(p);const f=g.filter(v=>v.parentId===p.id&&!x.has(v.id));let m=1/0,S=-1/0,
M=1/0,L=-1/0;for(const v of f){const y=v.x??n.x[v.id],I=v.y??n.y[v.id],w=v.width??0,E=v.height??0;y!=null&&I!=null&&(v.isEdgeLabel||
(m=Math.min(m,y-w/2),S=Math.max(S,y+w/2)),M=Math.min(M,I-E/2),L=Math.max(L,I+E/2))}if(m===1/0||M===1/0)p.x=p.x??0,p.y=p.
y??0,p.width=p.width??0,p.height=p.height??0;else{const v=p.padding??20,y=p.parentId?v:2*Bn(p),I=v,w=Math.max(0,S-m)+y,E=Math.
max(0,L-M)+I,B=(m+S)/2,D=(M+L)/2;p.x=B,p.y=D,p.width=w,p.height=E,d.set(p.id,{minX:m,maxX:S,minY:M,maxY:L})}}if(l.length>
0&&d.size>0){let p=1/0,f=-1/0,m=0;for(const S of l){const M=S.padding??20;M>m&&(m=M);const L=d.get(S.id);L&&(p=Math.min(
p,L.minY),f=Math.max(f,L.maxY))}if(p!==1/0&&f!==-1/0){const S=Math.max(0,f-p),L=Math.max(m,36),v=S+2*L,y=(p+f)/2;for(const N of l)
N.y=y,N.height=v,N.swimlaneContentTop=p;const I=[...l].sort((N,H)=>{const U=N.x??0,Z=H.x??0;return U-Z}),w=[],E=[],B=[];
for(const N of I){const H=d.get(N.id);if(!H)continue;const U=Math.max(0,H.maxX-H.minX)+2*Bn(N),Z=(H.minX+H.maxX)/2;w.push(
N.id),E.push(Z),B.push(U)}const D=w.length;if(D>0){const N=new Map;if(D===1)N.set(w[0],B[0]);else{const H=[];for(let ht=0;ht<
D-1;ht++)H.push(E[ht+1]-E[ht]);const U=new Array(D);U[0]=0;for(let ht=0;ht<D-1;ht++)U[ht+1]=2*H[ht]-U[ht];let Z=0,tt=Number.
POSITIVE_INFINITY;for(let ht=0;ht<D;ht++){const Et=B[ht];ht%2===0?Z=Math.max(Z,Et-U[ht]):tt=Math.min(tt,U[ht]-Et)}let at=Z;
Z<=tt?at=(Z+tt)/2:at=Z;for(let ht=0;ht<D;ht++){const Et=U[ht]+(ht%2===0?at:-at),ce=Math.max(B[ht],Et);N.set(w[ht],ce)}}for(const H of l){
const U=N.get(H.id);U!=null&&(H.width=U),Zo(H)}}}}}c(is,"writeBackToLayoutData");var Kr="[EdgeLabelNodes]";function cs(t){
const e=[],n=[],o=new Map;for(const i of t.nodes)o.set(i.id,i);for(const i of t.edges){if(!i.label||i.label.length===0||
i.isLayoutOnly||i.labelNodeId)continue;const a=i.start?o.get(i.start):void 0,h=i.end?o.get(i.end):void 0;if(!a||!h){Xe.warn(
Kr,`Edge ${i.id} has missing source or target node`);continue}const g=`edge-label-${i.start}-${i.end}-${i.id}`,d=a.parentId!==
h.parentId?h.parentId:a.parentId,b={id:g,label:i.label,edgeStart:i.start??"",edgeEnd:i.end??"",shape:"labelRect",width:0,
height:0,isEdgeLabel:!0,isDummy:!0,parentId:d,isGroup:!1,labelStyle:Array.isArray(i.labelStyle)?i.labelStyle[0]:i.labelStyle??
"",...a.dir?{dir:a.dir}:{}};e.push(b),i.labelNodeId=g,i.label=void 0,i.text=void 0;const l={id:`${i.id}-to-label`,start:i.
start,end:g,type:"normal",isLayoutOnly:!0},p={id:`${i.id}-from-label`,start:g,end:i.end,type:"normal",isLayoutOnly:!0};n.
push(l,p)}const s=[...t.nodes,...e],r=[...t.edges,...n];return{...t,nodes:s,edges:r}}c(cs,"createEdgeLabelNodes");var jt=.001;
function ho(t){const e=t.x??0,n=t.y??0,o=t.width??0,s=t.height??0;return o>0&&s>0?{cx:e,cy:n,rect:He(e,n,o,s)}:void 0}c(
ho,"measuredNodeRect");function go(t){if(t.isGroup)return;const e=ho(t);return e?{id:String(t.id??""),cx:e.cx,cy:e.cy,rect:e.
rect}:void 0}c(go,"nodeBoundsInfoFor");function fe(t,e,n=jt){return Math.abs(t.x-e.x)<n&&Math.abs(t.y-e.y)<n}c(fe,"sameP\
oint");function It(t,e,n=jt){return Math.abs(t.x-e.x)<n}c(It,"sameX");function Ct(t,e,n=jt){return Math.abs(t.y-e.y)<n}c(
Ct,"sameY");function _t(t,e,n=jt){return Ct(t,e,n)&&Math.abs(t.x-e.x)>n}c(_t,"isHorizontalSegment");function Ht(t,e,n=jt){
return It(t,e,n)&&Math.abs(t.y-e.y)>n}c(Ht,"isVerticalSegment");function Qt(t,e,n,o){return Math.max(0,Math.min(Math.max(
t,e),Math.max(n,o))-Math.max(Math.min(t,e),Math.min(n,o)))}c(Qt,"overlapLength");function ge(t,e,n=jt){return t.horizontal&&
e.horizontal&&Ct(t.a,e.a,n)?Qt(t.a.x,t.b.x,e.a.x,e.b.x):t.vertical&&e.vertical&&It(t.a,e.a,n)?Qt(t.a.y,t.b.y,e.a.y,e.b.y):
0}c(ge,"sameAxisSegmentOverlapLength");function Le(t,e=jt){const n=[];for(let o=0;o<t.length-1;o++){const s=t[o],r=t[o+1],
i=_t(s,r,e),a=Ht(s,r,e);(i||a)&&n.push({index:o,a:s,b:r,horizontal:i,vertical:a})}return n}c(Le,"orthogonalSegmentsForPo\
ints");function ie(t,e=jt){const n=Le(t,e);let o=0;for(let s=1;s<n.length;s++)n[s-1].horizontal!==n[s].horizontal&&o++;return o}
c(ie,"countOrthogonalBends");function as(t){const e=Le(vt(t));return e.slice(1).flatMap((n,o)=>e[o].horizontal===n.horizontal?
[]:[n.a])}c(as,"bendPoints");function ls(t,e){const n=Math.max(Math.min(e.a.x,e.b.x)-t.x,0,t.x-Math.max(e.a.x,e.b.x)),o=Math.
max(Math.min(e.a.y,e.b.y)-t.y,0,t.y-Math.max(e.a.y,e.b.y));return Math.hypot(n,o)}c(ls,"distanceToSegment");function fs(t,e,n){
const o=c((s,r)=>{const i=Le(vt(r));return as(s).some(a=>i.some(h=>ls(a,h)<n))},"touches");return o(t,e)||o(e,t)}c(fs,"r\
outesTouchAtBend");function vt(t,e=jt){const n=[];for(const o of t){const s=n.length>0?n[n.length-1]:void 0;(!s||!fe(s,o,
e))&&n.push({x:o.x,y:o.y})}return n}c(vt,"dedupeConsecutivePoints");function po(t,e=jt){if(!t||t.length!==4)return;const[
n,o,s,r]=t;return _t(n,o,e)&&Ht(o,s,e)&&_t(s,r,e)?{kind:"HVH",p0:n,p1:o,p2:s,p3:r}:Ht(n,o,e)&&_t(o,s,e)&&Ht(s,r,e)?{kind:"\
VHV",p0:n,p1:o,p2:s,p3:r}:void 0}c(po,"classifyThreeSegmentRoute");function mn(t,e,n,o=0){const s=Math.min(t.x,e.x),r=Math.
max(t.x,e.x),i=Math.min(t.y,e.y),a=Math.max(t.y,e.y);return r>n.left-o&&s<n.right+o&&a>n.top-o&&i<n.bottom+o}c(mn,"segme\
ntBoundsOverlapRect");function mo(t,e,n=0){return t.x>e.left+n&&t.x<e.right-n&&t.y>e.top+n&&t.y<e.bottom-n}c(mo,"pointIn\
sideRect");function ds(t,e){return t.left<=e.left&&t.right>=e.right&&t.top<=e.top&&t.bottom>=e.bottom}c(ds,"rectContains\
Rect");function rn(t,e){return t.left<e.right&&t.right>e.left&&t.top<e.bottom&&t.bottom>e.top}c(rn,"rectsOverlap");function Pn(t,e){
return{left:t.left-e,right:t.right+e,top:t.top-e,bottom:t.bottom+e}}c(Pn,"inflateRect");function He(t,e,n,o){return{left:t-
n/2,right:t+n/2,top:e-o/2,bottom:e+o/2}}c(He,"rectFromCenterSize");function oe(t){return ho(t)?.rect}c(oe,"rectOfNodeBou\
nds");function Be(t,e){switch(e){case"top":return{x:t.cx,y:t.rect.top};case"bottom":return{x:t.cx,y:t.rect.bottom};case"\
left":return{x:t.rect.left,y:t.cy};case"right":return{x:t.rect.right,y:t.cy}}}c(Be,"portForRectSide");function yo(t,e,n,o,s,r=jt){
const i=e==="left"||e==="right",a=o==="left"||o==="right";if(i&&a){if(e==="right"&&o==="left"&&t.x<n.x||e==="left"&&o===
"right"&&t.x>n.x){if(Ct(t,n,r))return[t,n];const d=(t.x+n.x)/2;return[t,{x:d,y:t.y},{x:d,y:n.y},n]}if(e===o){if(Ct(t,n,r))
return;const d=e==="left"?Math.min(t.x,n.x)-s:Math.max(t.x,n.x)+s;return[t,{x:d,y:t.y},{x:d,y:n.y},n]}return}if(!i&&!a){
if(e===o){if(It(t,n,r))return;const b=e==="top"?Math.min(t.y,n.y)-s:Math.max(t.y,n.y)+s;return[t,{x:t.x,y:b},{x:n.x,y:b},
n]}if(!(e==="bottom"&&o==="top"&&t.y<n.y||e==="top"&&o==="bottom"&&t.y>n.y))return;if(It(t,n,r))return[t,n];const d=(t.y+
n.y)/2;return[t,{x:t.x,y:d},{x:n.x,y:d},n]}if(i&&!a){const x=e==="right"&&n.x>t.x||e==="left"&&n.x<t.x,d=o==="top"&&t.y<
n.y||o==="bottom"&&t.y>n.y;return x&&d?[t,{x:n.x,y:t.y},n]:void 0}const h=e==="bottom"&&n.y>t.y||e==="top"&&n.y<t.y,g=o===
"left"&&t.x<n.x||o==="right"&&t.x>n.x;return h&&g?[t,{x:t.x,y:n.y},n]:void 0}c(yo,"buildOrthogonalPortPath");function xo(t,e,n,o){
return e==="left"||e==="right"?[t,{x:o,y:t.y},{x:o,y:n.y},n]:[t,{x:t.x,y:o},{x:n.x,y:o},n]}c(xo,"buildSameSideTrackPath");
function yn(t){const e=new Map,n=[];for(const o of t){if(o.isEdgeLabel)continue;const s=go(o);s&&(e.set(s.id,s),n.push({
id:s.id,rect:s.rect}))}return{nodeInfoById:e,realNodeRects:n}}c(yn,"collectRealNodeBounds");function we(t){const e=[],n=[];
for(const o of t){const s=go(o);if(!s)continue;const r={id:s.id,rect:s.rect};o.isEdgeLabel?n.push(r):e.push(r)}return{realNodeRects:e,
labelNodeRects:n}}c(we,"collectNodeRectEntries");function us(t,{includeEdgeLabels:e=!0}={}){const n=[];for(const o of t){
if(o.isGroup||!e&&o.isEdgeLabel)continue;const s=o.x??0,r=o.y??0,i=o.width??0,a=o.height??0;n.push({nodeId:o.id,...He(s,
r,i,a)})}return n}c(us,"collectLayoutNodeRects");function bo(t,e,n=jt){const o=t.start,s=t.end;if(!o||!s)return;const r=e.
get(o),i=e.get(s);if(!(!r||!i))return{srcId:o,dstId:s,srcInfo:r,dstInfo:i,collinearX:Math.abs(r.cx-i.cx)<n,collinearY:Math.
abs(r.cy-i.cy)<n}}c(bo,"getNodePairGeometry");function Xt(t,e,n,o=[],s=0){for(const r of n)if(!o.includes(r.id)&&mn(t,e,
r.rect,-s))return!0;return!1}c(Xt,"segmentHitsAnyRect");function Mo(t,e,n,o,s=jt,r=1e-6){const i=Ct(t,e,s),a=It(t,e,s),h=Ct(
n,o,s),g=It(n,o,s);if(i&&h||a&&g||!(i||a)||!(h||g))return!1;const x=i?{a:t,b:e}:{a:n,b:o},d=a?{a:t,b:e}:{a:n,b:o},b=x.a.
y,l=Math.min(x.a.x,x.b.x),p=Math.max(x.a.x,x.b.x),f=d.a.x,m=Math.min(d.a.y,d.b.y),S=Math.max(d.a.y,d.b.y);if(f<l||f>p||b<
m||b>S)return!1;const M=Math.abs(f-x.a.x)<r&&Math.abs(b-x.a.y)<r||Math.abs(f-x.b.x)<r&&Math.abs(b-x.b.y)<r,L=Math.abs(f-
d.a.x)<r&&Math.abs(b-d.a.y)<r||Math.abs(f-d.b.x)<r&&Math.abs(b-d.b.y)<r;return!(M&&L)}c(Mo,"orthogonalSegmentsCross");function hs(t,e,n,o,s=jt){
const r=Ct(t,e,s),i=It(t,e,s),a=Ct(n,o,s),h=It(n,o,s);return i&&h&&It(t,n,s)?Qt(t.y,e.y,n.y,o.y)>s:r&&a&&Ct(t,n,s)?Qt(t.
x,e.x,n.x,o.x)>s:!1}c(hs,"sameAxisSegmentsOverlap");function cn(t,e,n,o,{epsilon:s=jt,skipDegenerateOther:r=!1}={}){for(const i of n){
if(i===o||i.isLayoutOnly)continue;const a=i.points;if(!(!a||a.length<2))for(let h=0;h<a.length-1;h++){const g=a[h],x=a[h+
1];if(!(r&&fe(g,x,s))&&(Mo(t,e,g,x,s)||hs(t,e,g,x,s)))return!0}}return!1}c(cn,"segmentConflictsWithAnyEdge");function xe(t,e,n,o,s=jt){
const r=Ct(t,e,s),i=It(t,e,s),a=Ct(n,o,s),h=It(n,o,s);if(!(r&&h||i&&a))return!1;const g=r?{a:t,b:e}:{a:n,b:o},x=r?{a:n,b:o}:
{a:t,b:e},d=g.a.y,b=Math.min(g.a.x,g.b.x),l=Math.max(g.a.x,g.b.x),p=x.a.x,f=Math.min(x.a.y,x.b.y),m=Math.max(x.a.y,x.b.y);
return p>b+s&&p<l-s&&d>f+s&&d<m-s}c(xe,"orthogonalSegmentsStrictlyCross");function kn(t,e,n){const o=Math.min(e,n),s=Math.
max(e,n);return t>o+jt&&t<s-jt}c(kn,"strictlyBetween");function gs(t,e,n){return It(t,e)&&It(e,n)?kn(e.y,t.y,n.y):Ct(t,e)&&
Ct(e,n)?kn(e.x,t.x,n.x):!1}c(gs,"isCollinearIntermediate");function ps(t){let e=!1;const n=[];for(let o=0;o<t.length;o++){
const s=n[n.length-1],r=t[o],i=o+1<t.length?t[o+1]:void 0;if(s&&i){if(fe(s,i)){o++,e=!0;continue}if(gs(s,r,i)){e=!0;continue}}
n.push(r)}return{points:n,changed:e}}c(ps,"simplifyPolylineOnce");function an(t){const e=[t[0]];for(let o=1;o<t.length;o++){
const s=e[e.length-1],r=t[o];if(!It(s,r)&&!Ct(s,r)){const i=e.length>=2?e[e.length-2]:void 0,h=(i?It(i,s):!1)?{x:s.x,y:r.
y}:{x:r.x,y:s.y};e.push(h)}e.push(r)}const n=[];for(const o of e){const s=n[n.length-1];(!s||!fe(s,o))&&n.push(o)}return n}
c(an,"orthogonalizePolyline");function pe(t){if(t.length<3)return t;let e=[...t];for(let n=0;n<32;n++){const o=ps(e);if(e=
o.points,!o.changed)break}return e}c(pe,"simplifyPolyline");var ut=.001,qr=.5,Ho=4;function Io(t,e,n){const o=t;if(o.isLayoutOnly||
!o.points||o.points.length<n)return;const s=o.start?e.get(o.start):void 0,r=o.end?e.get(o.end):void 0;return{edge:o,points:o.
points,srcRect:s?oe(s):void 0,dstRect:r?oe(r):void 0}}c(Io,"endpointContextFor");function ms(t,e,n){if(Ct(t,e,ut))return{
x:t.x<n.left?n.left:n.right,y:t.y};if(It(t,e,ut)){const o=t.y<n.top?n.top:n.bottom;return{x:t.x,y:o}}return{x:Math.min(n.
right,Math.max(n.left,t.x)),y:Math.min(n.bottom,Math.max(n.top,t.y))}}c(ms,"segmentEnterPoint");function Fn(t,e,n){const o=n?
1:-1;let s=n?0:t.length-1;for(;s>=0&&s<t.length&&mo(t[s],e,qr);)s+=o;if(s<0||s>=t.length)return t;const r=s-o;if(r<0||r>=
t.length)return t;const i=ms(t[s],t[r],e);return n?[i,...t.slice(s)]:[...t.slice(0,s+1),i]}c(Fn,"clipEndpoint");function ys(t,e){
for(const n of t){const o=Io(n,e,2);if(!o)continue;let s=[...o.points];o.srcRect&&(s=Fn(s,o.srcRect,!0)),o.dstRect&&(s=Fn(
s,o.dstRect,!1)),s=pe(an(s)),s=So(s,o.srcRect,o.dstRect),o.edge.points=pe(an(s))}}c(ys,"clipEdgeEndpointsToNodeBoundarie\
s");function _n(t,e,n,o=!1){if(Ct(t,e,ut)){if(e.y<n.top-ut||e.y>n.bottom+ut)return e;if(o){if(t.x<n.left-ut)return{x:n.left,
y:t.y};if(t.x>n.right+ut)return{x:n.right,y:t.y}}return{x:Math.abs(e.x-n.left)<=Math.abs(e.x-n.right)?n.left:n.right,y:t.
y}}if(It(t,e,ut)){if(e.x<n.left-ut||e.x>n.right+ut)return e;if(o){if(t.y<n.top-ut)return{x:t.x,y:n.top};if(t.y>n.bottom+
ut)return{x:t.x,y:n.bottom}}const s=Math.abs(e.y-n.top)<=Math.abs(e.y-n.bottom);return{x:t.x,y:s?n.top:n.bottom}}return e}
c(_n,"snapEndpointToBoundary");function ln(t,e,n){const o=t[e];for(let s=e+n;s>=0&&s<t.length;s+=n){const r=t[s];if(!fe(
r,o,ut))return r}return t[e+n]}c(ln,"firstDistinctAdjacent");function fn(t,e){const n=t+Ho,o=e-Ho;return n<=o?{lo:n,hi:o}:
{lo:(t+e)/2,hi:(t+e)/2}}c(fn,"cornerClearanceRange");function Hn(t,e,n){const{lo:o,hi:s}=fn(e,n);return Math.min(s,Math.
max(o,t))}c(Hn,"clampToCornerClearance");function xs(t){const e=Math.max(...t.map(o=>o.lo)),n=Math.min(...t.map(o=>o.hi));
if(!(e>n))return{lo:e,hi:n}}c(xs,"intersectRanges");function Dn(t,e){return e==="left"||e==="right"?fn(t.top,t.bottom):fn(
t.left,t.right)}c(Dn,"clearanceRangeForSide");function dn(t,e,n){const o=t.y>=n.top-ut&&t.y<=n.bottom+ut,s=t.x>=n.left-ut&&
t.x<=n.right+ut;if(Ct(t,e,ut)&&o){if(Math.abs(t.x-n.left)<ut)return"left";if(Math.abs(t.x-n.right)<ut)return"right"}if(It(
t,e,ut)&&s){if(Math.abs(t.y-n.top)<ut)return"top";if(Math.abs(t.y-n.bottom)<ut)return"bottom"}}c(dn,"terminalSideForSegm\
ent");function Ge(t){return t==="left"||t==="right"}c(Ge,"isHorizontalSide");function bs(t,e,n,o,s){const r=[],i=n?dn(t,
e,n):void 0,a=o?dn(e,t,o):void 0;return n&&i&&Ge(i)===s&&r.push(Dn(n,i)),o&&a&&Ge(a)===s&&r.push(Dn(o,a)),r.length>0?xs(
r):void 0}c(bs,"straightClearanceRange");function Xn(t,e,n,o,s){const r=bs(t,e,n,o,s);if(!r)return;const i=s?t.y:t.x,a=Math.
min(r.hi,Math.max(r.lo,i));if(!(Math.abs(a-i)<ut))return s?[{x:t.x,y:a},{x:e.x,y:a}]:[{x:a,y:t.y},{x:a,y:e.y}]}c(Xn,"cle\
arStraightEndpointCornerAxis");function So(t,e,n){if(t.length!==2)return t;const[o,s]=t;return Ct(o,s,ut)?Xn(o,s,e,n,!0)??
t:It(o,s,ut)?Xn(o,s,e,n,!1)??t:t}c(So,"clearStraightEndpointCornerConnections");function Ms(t,e,n){return Ge(n)?{x:t.x,y:Hn(
t.y,e.top,e.bottom)}:{x:Hn(t.x,e.left,e.right),y:t.y}}c(Ms,"cornerClearedEndpoint");function Is(t,e,n,o,s,r){const i=t.map(
a=>({...a}));for(let a=e;a>=0&&a<t.length;a+=n){const h=t[a];if(r&&!Ct(h,o,ut)||!r&&!It(h,o,ut))break;r?i[a].y=s.y:i[a].
x=s.x}return i}c(Is,"moveCollinearEndpointRun");function Yn(t,e,n){if(t.length<2)return t;const o=n?0:t.length-1,s=n?1:-1,
r=t[o],i=ln(t,o,s);if(!i)return t;const a=dn(r,i,e);if(!a)return t;const h=Ge(a),g=Ms(r,e,a);return fe(r,g,ut)?t:Is(t,o,
s,r,g,h)}c(Yn,"clearEndpointCornerConnection");function Gn(t,e,n){const o=Math.min(t.x,e.x)>=n.left-ut&&Math.max(t.x,e.x)<=
n.right+ut,s=Math.min(t.y,e.y)>=n.top-ut&&Math.max(t.y,e.y)<=n.bottom+ut;if(Math.abs(t.y-n.top)<ut&&Math.abs(e.y-n.top)<
ut&&o)return"top";if(Math.abs(t.y-n.bottom)<ut&&Math.abs(e.y-n.bottom)<ut&&o)return"bottom";if(Math.abs(t.x-n.left)<ut&&
Math.abs(e.x-n.left)<ut&&s)return"left";if(Math.abs(t.x-n.right)<ut&&Math.abs(e.x-n.right)<ut&&s)return"right"}c(Gn,"bor\
derSideForSegment");function zn(t,e,n,o){switch(t){case"top":return It(e,n,ut)&&n.y<o.top-ut;case"bottom":return It(e,n,
ut)&&n.y>o.bottom+ut;case"left":return Ct(e,n,ut)&&n.x<o.left-ut;case"right":return Ct(e,n,ut)&&n.x>o.right+ut}}c(zn,"le\
avesOutward");function $n(t,e,n){if(t.length<3)return t;if(n){const r=Gn(t[0],t[1],e);return r&&zn(r,t[1],t[2],e)?t.slice(
1):t}const o=t.length-1,s=Gn(t[o-1],t[o],e);return s&&zn(s,t[o-1],t[o-2],e)?t.slice(0,o):t}c($n,"collapseOwnBorderStub");
function Ss(t,e,n){let o=t;if(e){const r=ln(o,0,1);if(r){const i=_n(r,o[0],e);i!==o[0]&&(o=[i,...o.slice(1)])}o=$n(o,e,!0)}
if(n){const r=o.length-1,i=ln(o,r,-1);if(i){const a=_n(i,o[r],n,!0);a!==o[r]&&(o=[...o.slice(0,r),a])}o=$n(o,n,!1)}const s=So(
o,e,n);return s!==o||o.length===2?s:(e&&(o=Yn(o,e,!0)),n&&(o=Yn(o,n,!1)),o)}c(Ss,"snapAndCollapseEndpoints");function Vn(t,e){
for(const n of t){const o=Io(n,e,2);if(!o)continue;const s=vt(o.points,ut),r=Ss(s,o.srcRect,o.dstRect);if(r.length<3){o.
edge.points=r;continue}const i=[r[0],{...r[0]},...r.slice(1,-1),r[r.length-1],{...r[r.length-1]}];o.edge.points=i}}c(Vn,
"prepareEdgeEndpointsForRenderer");function Cs(t){return new Map(t.map(e=>[e.id,e]))}c(Cs,"buildNodeMap");function Un(t,e){
const n=new Set([t.id]);let o=0,s=t.parentId;for(;s&&!n.has(s);){const r=e.get(s);if(!r?.isGroup)break;n.add(s),o++,s=r.
parentId}return o}c(Un,"groupDepth");function Co(t){let e=1/0,n=-1/0,o=1/0,s=-1/0;for(const r of t){const i=r.x,a=r.y;if(typeof i!=
"number"||typeof a!="number")continue;const h=r.width??0,g=r.height??0;e=Math.min(e,i-h/2),n=Math.max(n,i+h/2),o=Math.min(
o,a-g/2),s=Math.max(s,a+g/2)}return e===1/0||o===1/0?null:{minX:e,maxX:n,minY:o,maxY:s}}c(Co,"boundsForChildren");function vs(t,e){
const n=t.padding??20;t.x=(e.minX+e.maxX)/2,t.y=(e.minY+e.maxY)/2,t.width=Math.max(0,e.maxX-e.minX)+n,t.height=Math.max(
0,e.maxY-e.minY)+n}c(vs,"applyGroupBounds");function Ls(t){const e=Cs(t),n=t.filter(o=>o.isGroup&&o.parentId).sort((o,s)=>Un(
s,e)-Un(o,e));for(const o of n){const s=t.filter(i=>i.parentId===o.id),r=Co(s);r&&vs(o,r)}}c(Ls,"recomputeNestedGroupBou\
nds");function un(t,e){const n=t.nodes??[],o=t.edges??[],s=n.filter(h=>!h.isGroup);let r=1/0,i=-1/0;for(const h of s){const g=h[e];
typeof g=="number"&&(r=Math.min(r,g),i=Math.max(i,g))}if(!Number.isFinite(r)||!Number.isFinite(i))return!1;const a=c(h=>r+
i-h,"mirror");for(const h of n){const g=h[e];typeof g=="number"&&(h[e]=a(g));const x=h.groupTitleRect;x&&(h.groupTitleRect=
e==="x"?{...x,left:a(x.right),right:a(x.left)}:{...x,top:a(x.bottom),bottom:a(x.top)})}for(const h of o)for(const g of h.
points??[])g[e]=a(g[e]);return!0}c(un,"mirrorAxis");function ws(t){return(t.nodes??[]).some(n=>!n.isGroup)?un(t,"y"):!0}
c(ws,"applyBtDirectionTransform");function vo(t){const e=t.filter(i=>!i.isGroup&&!i.isEdgeLabel);if(e.length===0)return 1;
let n=0,o=0;for(const i of e)n+=i.width??0,o+=i.height??0;const s=n/e.length,r=o/e.length;return r>0?Math.max(1,s/r):1}c(
vo,"flowAxisStretch");var Zr=36,Jr=["top","right","bottom","left"];function As(t){return t==="left"?"right":t==="right"?
"left":t}c(As,"mirroredSide");function Es(t,e,n,o,s){if(n==="top"||n==="bottom"){const i=(e.left+e.right)/2,[a,h]=s?[o.after,
o.before]:[o.before,o.after];t.left=Math.min(t.left,i-a),t.right=Math.max(t.right,i+h);return}const r=(e.top+e.bottom)/2;
t.top=Math.min(t.top,r-o.before),t.bottom=Math.max(t.bottom,r+o.after)}c(Es,"growAlongBorder");var Qr={top:c((t,e,n)=>{t.
top=Math.min(t.top,e.top-n)},"top"),bottom:c((t,e,n)=>{t.bottom=Math.max(t.bottom,e.bottom+n)},"bottom"),left:c((t,e,n)=>{
t.left=Math.min(t.left,e.left-n)},"left"),right:c((t,e,n)=>{t.right=Math.max(t.right,e.right+n)},"right")};function Ts(t,e,n,o,s){
Es(t,e,n,o,s),Qr[n](t,e,o.beyond)}c(Ts,"reserveOnSide");function Rs(t,e,n){const o=t.x??0,s=t.y??0,r=(t.width??0)/2,i=(t.
height??0)/2,a={left:o-r,right:o+r,top:s-i,bottom:s+i},h={...a},g=n==="RL";for(const x of Jr){const d=e[x];d&&Ts(h,a,g?As(
x):x,d,g)}return{...t,x:(h.left+h.right)/2,y:(h.top+h.bottom)/2,width:h.right-h.left,height:h.bottom-h.top}}c(Rs,"withAn\
chorFootprints");function Os(t,e="LR"){const n=t.nodes??[],o=t.edges??[],s=ze(n),r=n.filter(N=>!N.isGroup&&!s.has(N.id));
let i=1/0,a=1/0;for(const N of r){const H=N.x??0,U=N.y??0;H<i&&(i=H),U<a&&(a=U)}if(!Number.isFinite(i)||!Number.isFinite(
a))return!1;const h=Zr,g=vo(r);for(const N of r){const H=N.x??0,Z=((N.y??0)-a)*g+h,tt=H-i;N.x=Z,N.y=tt}for(const N of o)
if(N.points)for(const H of N.points){const U=H.x,tt=(H.y-a)*g+h,at=U-i;H.x=tt,H.y=at}Ls(n);const x=ue(n),d=n.filter(N=>x.
isLane(N.id));if(d.length===0)return e==="RL"&&un(t,"x"),!0;const b=new Map,l=qo(n,e);for(const N of n){if(x.isLane(N.id)||
x.isPool(N.id)||s.has(N.id))continue;const H=x.laneIdOf(N.id);if(!H)continue;const U=b.get(H)??[],Z=l.get(N.id);U.push(Z?
Rs(N,Z,e):N),b.set(H,U)}let p=0;for(const N of d){const H=N.padding??0;H>p&&(p=H)}const f=[];let m=1/0,S=-1/0;for(const N of d){
const H=b.get(N.id)??[],U=Co(H);U&&(m=Math.min(m,U.minX),S=Math.max(S,U.maxX),f.push({lane:N,contentTop:U.minY,contentBottom:U.
maxY,centerY:(U.minY+U.maxY)/2}))}if(m===1/0||S===-1/0)return!0;const M=Math.max(0,S-m),L=Math.max(p,10),v=M+2*L,y=h+v,E=(m+
S)/2-v/2-h,B=E+y/2,D=Math.max(p,h);f.sort((N,H)=>N.centerY-H.centerY);for(let N=0;N<f.length;N++){const H=f[N];let U,Z;if(N===
0?U=H.contentTop-D:U=(f[N-1].contentBottom+H.contentTop)/2,N===f.length-1)Z=H.contentBottom+D;else{const ht=f[N+1];Z=(H.
contentBottom+ht.contentTop)/2}const tt=Math.max(0,Z-U),at=(U+Z)/2;H.lane.x=B,H.lane.y=at,H.lane.width=y,H.lane.height=tt,
H.lane.swimlaneContentTop=H.contentTop,H.lane.groupTitleRect={left:E,right:E+h,top:U,bottom:Z}}return e==="RL"&&un(t,"x"),
!0}c(Os,"applyLrDirectionTransform");var de=1e-6,ti=8,Je=ti,ei=[0,Je,-Je,2*Je,-2*Je];function Ns(t,e){const{nodeInfoById:n,
realNodeRects:o}=yn(e);for(const s of t){if(s.isLayoutOnly)continue;const r=s.points;if(!r||r.length<4)continue;const i=po(
vt(r,de),de);if(!i)continue;const{p3:a}=i,h=i.kind==="HVH",g=bo(s,n,de);if(!g)continue;const{srcId:x,dstId:d,srcInfo:b,dstInfo:l,
collinearX:p,collinearY:f}=g;if(p||f)continue;let m;const S=b.rect;for(const M of ei){let L,v,y;if(h){const N=l.cy>b.cy?
S.bottom:S.top,H=b.cx+M;if(H<=S.left+de||H>=S.right-de)continue;L={x:H,y:N},v={x:H,y:a.y},y={x:a.x,y:a.y}}else{const N=l.
cx>b.cx?S.right:S.left,H=b.cy+M;if(H<=S.top+de||H>=S.bottom-de)continue;L={x:N,y:H},v={x:a.x,y:H},y={x:a.x,y:a.y}}const I=fe(
L,v,de),w=fe(v,y,de);if(I&&w||!I&&Xt(L,v,o,[x],1)||!w&&Xt(v,y,o,[d],1))continue;const E=!I&&cn(L,v,t,s,{epsilon:de,skipDegenerateOther:!0}),
B=!w&&cn(v,y,t,s,{epsilon:de,skipDegenerateOther:!0});if(!(E||B)){I?m=[v,y]:w?m=[L,v]:m=[L,v,y];break}}m&&(s.points=m)}}
c(Ns,"portSwapToLShape");function Bs(t,e){const{realNodeRects:r,labelNodeRects:i}=we(e.values());for(const a of t){if(a.
isLayoutOnly)continue;const h=a.points;if(!h||h.length<4)continue;const g=vt(h,.001);if(g.length<4)continue;const x=g.length-
1,d=g[x],b=g[x-1],l=g[x-2],p=d.x-b.x,f=d.y-b.y,m=Math.hypot(p,f);if(m>=10||m<.001)continue;const S=b.x-l.x,M=b.y-l.y;if(Math.
hypot(S,M)<.001)continue;const v=_t(b,d,.001),y=Ht(b,d,.001),I=_t(l,b,.001),w=Ht(l,b,.001);if(!(v&&w||y&&I))continue;const E=a.
end,B=a.start,D=E?e.get(E):void 0;if(!D)continue;const N=D.x??0,H=D.y??0,U=oe(D);if(!U)continue;let Z,tt;if(w){const J=M<
0;Z={x:N,y:l.y},tt={x:N,y:J?U.bottom:U.top}}else{const J=S>0;Z={x:l.x,y:H},tt={x:J?U.right:U.left,y:H}}if(Xt(Z,tt,r,E?[E]:
[],-2)||Xt(Z,tt,i,[],-2))continue;if(B){const J=e.get(B),lt=J?oe(J):void 0;if(lt&&mo(Z,lt,2))continue}const at=c((J,lt)=>`${J.
x.toFixed(3)},${J.y.toFixed(3)}|${lt.x.toFixed(3)},${lt.y.toFixed(3)}`,"ownSegmentKey"),ht=new Set;for(let J=0;J<g.length-
1;J++)ht.add(at(g[J],g[J+1]));const Et=c((J,lt)=>{for(const k of t){if(k===a||k.isLayoutOnly)continue;const G=k.points;if(!(!G||
G.length<2))for(let Q=0;Q<G.length-1;Q++){const K=G[Q],st=G[Q+1];if(!ht.has(at(K,st))&&xe(J,lt,K,st,.001))return!0}}return!1},
"segmentCrossesOtherEdge");if(Et(Z,tt))continue;if(x-3>=0){const J=g[x-3],lt=[B,E].filter(k=>!!k);if(Xt(J,Z,r,lt,-2)||Et(
J,Z))continue}const $t=[...g.slice(0,x-2),Z,tt];a.points=$t;const Vt=a.labelNodeId;if(Vt){const J=e.get(Vt);if(J){const lt=J.
width??0,k=J.height??0;if(lt>0&&k>0){let G,Q,K=-1;for(let st=0;st<$t.length-1;st++){const dt=$t[st],gt=$t[st+1],pt=Math.
hypot(gt.x-dt.x,gt.y-dt.y),xt=Ct(dt,gt,.001),Pt=It(dt,gt,.001);(xt&&pt>=lt+2||Pt&&pt>=k+2)&&pt>K&&(K=pt,G=(dt.x+gt.x)/2,
Q=(dt.y+gt.y)/2)}G!==void 0&&Q!==void 0&&(J.x=G,J.y=Q)}}}}}c(Bs,"collapseShortTerminalStub");var ni=4,oi=2,Ps={MIN_ARROWHEAD_SPACING:12,
ROUTE_TOUCH_TOLERANCE:ni+oi},si={EPSILON:1e-6},hn={GRAVITY_ITERATIONS:8,MAX_CROSSING_OPTIMIZATION_PASSES:4,DEFAULT_COMPACT_SINGLE_INPUT:!0},
En={DEFAULT_LAYER_GAP:100,DEFAULT_NODE_GAP:40,EDGE_LABEL_CLEARANCE:16},it=.001,Ut=8,ks=c(t=>typeof t=="string"?t.toUpperCase():
"","upperCaseDirection"),yt=Le,Tn=c((t,e)=>It(t,e,it)||Ct(t,e,it),"orthogonallyAligned");function jn(t,e){const s=c((l,p)=>{
const f=l.x??0,m=l.y??0,S=p.x-f,M=p.y-m;let L=(l.width??0)/2,v=(l.height??0)/2;return Math.abs(M)*L>Math.abs(S)*v?(M<0&&
(v=-v),{x:f+(M===0?0:v*S/M),y:m+v}):(S<0&&(L=-L),{x:f+L,y:m+(S===0?0:L*M/S)})},"rectIntersect"),r=c((l,p)=>{const f=vt(l.
points??[]);if(f.length<2)return;const m=p?l.start:l.end,S=m?e.get(m):void 0,M=S?oe(S):void 0;if(!S||!m||!M)return;const L=p?
f[0]:f[f.length-1],v=p?f[1]:f[f.length-2],y=s(S,L);let I=L;if(Tn(v,y)&&(I=v),It(y,I,it))return{edge:l,edgeId:String(l.id??
""),nodeId:m,atStart:p,orientation:"V",coord:y.x,min:Math.min(y.y,I.y),max:Math.max(y.y,I.y),boundary:y,railEnd:I,rect:M};
if(Ct(y,I,it))return{edge:l,edgeId:String(l.id??""),nodeId:m,atStart:p,orientation:"H",coord:y.y,min:Math.min(y.x,I.x),max:Math.
max(y.x,I.x),boundary:y,railEnd:I,rect:M}},"terminalLaneFor"),i=c((l,p)=>Math.max(0,Math.min(l.max,p.max)-Math.max(l.min,
p.min)),"projectedOverlapLength"),a=c((l,p)=>l.nodeId!==p.nodeId||l.orientation!==p.orientation?!1:l.orientation==="H"?(Math.
abs(l.boundary.x-l.rect.left)<1||Math.abs(l.boundary.x-l.rect.right)<1)&&It(l.boundary,p.boundary,1):(Math.abs(l.boundary.
y-l.rect.top)<1||Math.abs(l.boundary.y-l.rect.bottom)<1)&&Ct(l.boundary,p.boundary,1),"sameTerminalFace"),h=c((l,p)=>l.nodeId!==
p.nodeId||l.orientation!==p.orientation?!1:i(l,p)>=Ut&&Math.abs(l.coord-p.coord)<.5,"exactTerminalLaneConflict"),g=c((l,p)=>{
if(l.nodeId!==p.nodeId||l.orientation!==p.orientation||l.orientation!=="H"||l.atStart===p.atStart)return!1;const f=i(l,p);
if(f<Ut)return!1;const m=l.rect.bottom-l.rect.top;return f<m||f>2*m?!1:a(l,p)&&Math.abs(l.coord-p.coord)<16},"nearTermin\
alLaneConflict"),x=c((l,p)=>{const f=vt(l.edge.points??[]);if(f.length<2)return;const m=l.orientation==="V"?{x:l.boundary.
x+p,y:l.boundary.y}:{x:l.boundary.x,y:l.boundary.y+p},S=l.orientation==="V"?{x:l.railEnd.x+p,y:l.railEnd.y}:{x:l.railEnd.
x,y:l.railEnd.y+p};if(!c(()=>Math.abs(l.boundary.y-l.rect.top)<1||Math.abs(l.boundary.y-l.rect.bottom)<1?Ct(m,l.boundary,
it)&&m.x>=l.rect.left+1&&m.x<=l.rect.right-1:Math.abs(l.boundary.x-l.rect.left)<1||Math.abs(l.boundary.x-l.rect.right)<1?
It(m,l.boundary,it)&&m.y>=l.rect.top+1&&m.y<=l.rect.bottom-1:!1,"boundaryStaysOnSameFace")())return;if(l.atStart){const I=f.
length>1&&fe(f[1],l.railEnd,it),w=f.slice(I?2:1),E=w[0];return E&&!Tn(E,S)?void 0:[m,S,...w]}const L=f.length>1&&fe(f[f.
length-2],l.railEnd,it),v=f.slice(0,L?-2:-1),y=v[v.length-1];if(!(y&&!Tn(y,S)))return[...v,S,m]},"shiftedCandidate"),d=c(
l=>{const p=l.edge,f=vt(p.points??[]);if(f.length!==2)return!1;const m=p.start,S=p.end,M=m?e.get(m):void 0,L=S?e.get(S):
void 0;if(!M||!L)return!1;const v=M.x??0,y=M.y??0,I=L.x??0,w=L.y??0,[E,B]=f;return Ct(E,B,it)&&Math.abs(y-w)<1&&Math.abs(
v-I)>1||It(E,B,it)&&Math.abs(v-I)<1&&Math.abs(y-w)>1},"laneIsStraightCollinearConnector"),b=[-7,7,-14,14,-21,21];for(let l=0;l<
8;l++){const p=t.filter(m=>!m.isLayoutOnly).flatMap(m=>[r(m,!0),r(m,!1)]).filter(m=>!!m);let f=!1;for(let m=0;m<p.length&&
!f;m++)for(let S=m+1;S<p.length&&!f;S++){const M=p[m],L=p[S];if(M.edge===L.edge||!(h(M,L)||g(M,L)))continue;const v=!h(M,
L),y=[M,L].sort((I,w)=>{const E=d(I),B=d(w);return E!==B?Number(E)-Number(B):+!w.atStart-+!I.atStart});for(const I of y){
for(const w of b){const E=x(I,w);if(!E)continue;const B=r({...I.edge,points:E},I.atStart);if(!(!B||p.some(D=>D.edge!==I.
edge&&(h(B,D)||v&&g(B,D))))){I.edge.points=E,f=!0;break}}if(f)break}}if(!f)return}}c(jn,"separateSharedRenderedTerminalL\
anes");function Fs(t,e){const{realNodeRects:o,labelNodeRects:s}=we(e.values()),r=c((a,h)=>{const g=a.start,x=a.end,d=yt(
h);if(d.length!==h.length-1)return!1;const b=[g,x].filter(l=>!!l);for(const l of d)if(Xt(l.a,l.b,o,b,-2)||Xt(l.a,l.b,s,[],
-2))return!1;for(const l of t){if(l===a||l.isLayoutOnly)continue;const p=l.points;if(!(!p||p.length<2)){for(const f of d)
for(const m of yt(vt(p)))if(ge(f,m,.5)>=Ut||xe(f.a,f.b,m.a,m.b,it))return!1}}return!0},"candidateIsSafe"),i=c((a,h)=>{if(h+
4>=a.length)return;const g=a[h],x=a[h+1],d=a[h+2],b=a[h+3],l=a[h+4],p=_t(g,x)&&Ht(x,d)&&_t(d,b)&&Ht(b,l)&&It(g,b,it)&&It(
g,l,it)&&It(x,d,it)&&(x.x-g.x)*(b.x-d.x)<0,f=Ht(g,x)&&_t(x,d)&&Ht(d,b)&&_t(b,l)&&Ct(g,b,it)&&Ct(g,l,it)&&Ct(x,d,it)&&(x.
y-g.y)*(b.y-d.y)<0;if(p||f)return vt([...a.slice(0,h+1),l,...a.slice(h+5)]);if(h+5>=a.length)return;const m=a[h+5],S=Ht(
g,x)&&_t(x,d)&&Ht(d,b)&&_t(b,l)&&Ht(l,m)&&It(g,l,it)&&It(g,m,it)&&It(d,b,it)&&(d.x-x.x)*(l.x-b.x)<0,M=_t(g,x)&&Ht(x,d)&&
_t(d,b)&&Ht(b,l)&&_t(l,m)&&Ct(g,l,it)&&Ct(g,m,it)&&Ct(d,b,it)&&(d.y-x.y)*(l.y-b.y)<0;if(!(!S&&!M))return vt([...a.slice(
0,h+1),m,...a.slice(h+6)])},"withoutDogleg");for(let a=0;a<8;a++){let h=!1;for(const g of t){if(g.isLayoutOnly)continue;
const x=vt(g.points??[]);for(let d=0;d<=x.length-5;d++){const b=i(x,d);if(!(!b||!r(g,b))){g.points=b,h=!0;break}}if(h)break}
if(!h)return}}c(Fs,"collapseRedundantRectangularDoglegs");function Wn(t,e){const{realNodeRects:r,labelNodeRects:i}=we(e.
values()),a=t.filter(p=>!p.isLayoutOnly),h=c((p,f,m)=>vt(p===f?m??[]:p.points??[]),"pointsFor"),g=c((p,f)=>{let m=0;for(let S=0;S<
a.length;S++){const M=yt(h(a[S],p,f));for(let L=S+1;L<a.length;L++){const v=yt(h(a[L],p,f));for(const y of M)for(const I of v)
xe(y.a,y.b,I.a,I.b,it)&&m++}}return m},"strictCrossingCount"),x=c(p=>{const f=yt(p);if(f.length!==3)return;const m=f[1];
if(!(f[0].horizontal===m.horizontal||f[2].horizontal===m.horizontal))return{index:m.index,horizontal:m.horizontal,vertical:m.
vertical,segment:m}},"middleRail"),d=c((p,f)=>{const m=[p.start,p.end].filter(S=>!!S);return r.filter(S=>{if(m.includes(
S.id))return!1;const M=S.rect;return f.horizontal?Qt(f.a.x,f.b.x,M.left,M.right)>=Ut&&f.a.y>=M.top-2&&f.a.y<=M.bottom+2:
Qt(f.a.y,f.b.y,M.top,M.bottom)>=Ut&&f.a.x>=M.left-2&&f.a.x<=M.right+2})},"blockingRectsFor"),b=c((p,f,m)=>{const S=p.map(
L=>({...L}));if(f.horizontal)S[f.index].y=m,S[f.index+1].y=m;else if(f.vertical)S[f.index].x=m,S[f.index+1].x=m;else return;
const M=pe(vt(S));return yt(M).length===M.length-1?M:void 0},"candidateByMovingRail"),l=c((p,f,m)=>{const S=[p.start,p.end].
filter(L=>!!L),M=yt(f);if(M.length!==f.length-1)return!1;for(const L of M)if(Xt(L.a,L.b,r,S,-2)||Xt(L.a,L.b,i,[],-2))return!1;
for(const L of a)if(L!==p){for(const v of M)for(const y of yt(h(L)))if(ge(v,y,.5)>=Ut)return!1}return g(p,f)<=m},"candid\
ateIsSafe");for(let p=0;p<8;p++){const f=g();let m=!1;for(const S of a){const M=h(S),L=x(M);if(!L)continue;const v=d(S,L.
segment);if(v.length===0)continue;const y=L.horizontal?[Math.min(...v.map(I=>I.rect.top))-20,Math.max(...v.map(I=>I.rect.
bottom))+20]:[Math.min(...v.map(I=>I.rect.left))-20,Math.max(...v.map(I=>I.rect.right))+20];for(const I of y){const w=b(
M,L.segment,I);if(!(!w||!l(S,w,f))){S.points=w,m=!0;break}}if(m)break}if(!m)return}}c(Wn,"liftObstacleHuggingSameSideRai\
ls");function Kn(t,e,n){const s=c(x=>{const d=x.groupTitleRect;if(!(!d||typeof d.left!="number"||typeof d.right!="number"||
typeof d.top!="number"||typeof d.bottom!="number"||!Number.isFinite(d.left)||!Number.isFinite(d.right)||!Number.isFinite(
d.top)||!Number.isFinite(d.bottom)||d.right<=d.left||d.bottom<=d.top))return{left:d.left,right:d.right,top:d.top,bottom:d.
bottom}},"validTitleRect"),r=ue([...e.values()]),i=c(x=>{if(!r.isLane(x.id))return;const d=ks(x.direction??n);if(d==="LR"||
d==="RL"||d==="BT")return;const b=s(x),l=x.y,p=x.height;if(!b||typeof l!="number"||typeof p!="number"||!Number.isFinite(
l)||!Number.isFinite(p)||p<=0)return;const f=b.right-b.left,m=b.bottom-b.top;if(!(m<=0||f<m))return{node:x,rect:b}},"top\
LaneTitleFor"),a=c((x,d)=>{if(!x.horizontal)return!1;const b=x.a.y;return b<d.top-it||b>d.bottom+it?!1:Qt(x.a.x,x.b.x,d.
left,d.right)>=Ut},"horizontalSegmentIntersectsTitle"),h=[...e.values()].map(i).filter(x=>!!x);if(h.length===0)return;let g=0;
for(const x of t){if(x.isLayoutOnly)continue;const d=vt(x.points??[]);for(const b of yt(d))for(const l of h)a(b,l.rect)&&
(g=Math.max(g,l.rect.bottom-b.a.y+4))}if(!(g<=it))for(const x of h){const d=x.node.y,b=x.node.height;typeof d!="number"||
typeof b!="number"||!Number.isFinite(d)||!Number.isFinite(b)||b<=0||(x.node.y=d-g/2,x.node.height=b+g,x.node.groupTitleRect=
{...x.rect,top:x.rect.top-g,bottom:x.rect.bottom-g})}}c(Kn,"liftTopLaneTitleBandsAboveRails");function qn(t,e,n){const s=c(
d=>{const b=d.groupTitleRect;if(!(!b||typeof b.left!="number"||typeof b.right!="number"||typeof b.top!="number"||typeof b.
bottom!="number"||!Number.isFinite(b.left)||!Number.isFinite(b.right)||!Number.isFinite(b.top)||!Number.isFinite(b.bottom)||
b.right<=b.left||b.bottom<=b.top))return{left:b.left,right:b.right,top:b.top,bottom:b.bottom}},"validTitleRect"),r=ue([...e.
values()]),i=c(d=>{if(!r.isLane(d.id)||ks(d.direction??n)!=="LR")return;const l=s(d),p=d.x,f=d.width;if(!l||typeof p!="n\
umber"||typeof f!="number"||!Number.isFinite(p)||!Number.isFinite(f)||f<=0)return;const m=l.right-l.left,S=l.bottom-l.top;
if(!(m<=0||S<m))return{node:d,rect:l}},"leftLaneTitleFor"),a=c((d,b)=>{if(!d.vertical)return!1;const l=d.a.x;return l<b.
left-it||l>b.right+it?!1:Qt(d.a.y,d.b.y,b.top,b.bottom)>=Ut},"verticalSegmentIntersectsTitle"),h=c((d,b)=>{if(!d.horizontal)
return!1;const l=d.a.y;return l<b.top-it||l>b.bottom+it?!1:Qt(d.a.x,d.b.x,b.left,b.right)>=Ut},"horizontalSegmentInterse\
ctsTitle"),g=[...e.values()].map(i).filter(d=>!!d);if(g.length===0)return;let x=0;for(const d of t){if(d.isLayoutOnly)continue;
const b=vt(d.points??[]);for(const l of yt(b))for(const p of g)if(a(l,p.rect))x=Math.max(x,p.rect.right-l.a.x+4);else if(h(
l,p.rect)){const f=Math.min(l.a.x,l.b.x);x=Math.max(x,p.rect.right-f+4)}}if(!(x<=it))for(const d of g){const b=d.node.x,
l=d.node.width;typeof b!="number"||typeof l!="number"||!Number.isFinite(b)||!Number.isFinite(l)||l<=0||(d.node.x=b-x/2,d.
node.width=l+x,d.node.groupTitleRect={...d.rect,left:d.rect.left-x,right:d.rect.right-x})}}c(qn,"shiftLeftLaneTitleBands\
LeftOfRails");function _s(t,e){const{realNodeRects:o}=we(e.values()),s=t.filter(p=>!p.isLayoutOnly),r=c((p,f=new Map)=>vt(
f.get(p)??p.points??[]),"replacementPointsFor"),i=c((p=new Map)=>{let f=0;for(let m=0;m<s.length;m++){const S=yt(r(s[m],
p));for(let M=m+1;M<s.length;M++){const L=yt(r(s[M],p));for(const v of S)for(const y of L)xe(v.a,v.b,y.a,y.b,it)&&f++}}return f},
"crossingCount"),a=c((p=new Map)=>s.reduce((f,m)=>f+ie(r(m,p)),0),"totalBends"),h=c(p=>{const f=r(p);if(f.length<4)return;
const m=f[f.length-2],S=f[f.length-1];if(!(!_t(m,S,it)&&!Ht(m,S,it)))return{tailStart:m,terminal:S}},"terminalTailFor"),
g=c((p,f)=>{const m=r(p);if(m.length<3)return;const S=m[0],M=m[1];let L;if(_t(S,M,it))L={x:M.x,y:f.tailStart.y};else if(Ht(
S,M,it))L={x:f.tailStart.x,y:M.y};else return;const v=pe(vt([S,M,L,f.tailStart,f.terminal]));return yt(v).length===v.length-
1?v:void 0},"candidateWithDestinationTail"),x=c((p,f)=>{const m=[p.start,p.end].filter(S=>!!S);for(const S of yt(f))if(Xt(
S.a,S.b,o,m,-2))return!0;return!1},"pathHasNodeHit"),d=c((p,f,m)=>{for(const S of s)if(S!==p){for(const M of yt(f))for(const L of yt(
r(S,m)))if(ge(M,L,.5)>=Ut)return!0}return!1},"pathHasSharedTrack"),b=c((p,f,m)=>!x(p,f)&&!d(p,f,m),"candidateIsSafe"),l=c(
()=>{const p=new Map;for(const f of s){const m=f.end;if(!m||!e.has(m)||r(f).length<4)continue;const M=p.get(m)??[];M.push(
f),p.set(m,M)}return p},"edgesByDestination");for(let p=0;p<4;p++){const f=i();if(f===0)return;const m=a();let S,M=f,L=m;
for(const v of l().values())for(let y=0;y<v.length;y++)for(let I=y+1;I<v.length;I++){const w=v[y],E=v[I],B=h(w),D=h(E);if(!B||
!D)continue;const N=g(w,D),H=g(E,B);if(!N||!H)continue;const U=new Map([[w,N],[E,H]]);if(!b(w,N,U)||!b(E,H,U))continue;const Z=i(
U),tt=a(U);Z>=f||Z>M||Z===M&&tt>=L||(S=U,M=Z,L=tt)}if(!S)return;for(const[v,y]of S)v.points=y}}c(_s,"swapDestinationTerm\
inalTailsToReduceCrossings");function Hs(t,e){const{realNodeRects:r,labelNodeRects:i}=we(e.values()),a=t.filter(v=>!v.isLayoutOnly),
h=c((v,y=new Map)=>vt(y.get(v)??v.points??[]),"replacementPointsFor"),g=c((v=new Map)=>{let y=0;for(let I=0;I<a.length;I++){
const w=yt(h(a[I],v));for(let E=I+1;E<a.length;E++){const B=yt(h(a[E],v));for(const D of w)for(const N of B)xe(D.a,D.b,N.
a,N.b,it)&&y++}}return y},"strictCrossingCount"),x=c((v=new Map)=>a.reduce((y,I)=>y+ie(h(I,v)),0),"totalBends"),d=c(v=>{
const y=v.start,I=v.end,w=y?e.get(y):void 0,E=I?e.get(I):void 0,B=w?oe(w):void 0,D=E?oe(E):void 0;return B&&D?{src:B,dst:D}:
void 0},"endpointRectsFor"),b=c((v,y,I)=>{if(I.index<=0||I.index+1>=y.length-1)return;const w=d(v);if(w){if(I.vertical){
const E=I.a.x,B=Math.min(w.src.left,w.dst.left),D=Math.max(w.src.right,w.dst.right),N=E<B-it?"left":E>D+it?"right":void 0;
return N?{edge:v,points:y,segmentIndex:I.index,axis:"vertical",side:N,coord:E,min:Math.min(I.a.y,I.b.y),max:Math.max(I.a.
y,I.b.y)}:void 0}if(I.horizontal){const E=I.a.y,B=Math.min(w.src.top,w.dst.top),D=Math.max(w.src.bottom,w.dst.bottom),N=E<
B-it?"top":E>D+it?"bottom":void 0;return N?{edge:v,points:y,segmentIndex:I.index,axis:"horizontal",side:N,coord:E,min:Math.
min(I.a.x,I.b.x),max:Math.max(I.a.x,I.b.x)}:void 0}}},"externalRailForSegment"),l=c(()=>{const v=[];for(const y of a){const I=h(
y);for(const w of yt(I)){const E=b(y,I,w);E&&v.push(E)}}return v},"collectExternalRails"),p=c((v,y)=>v.edge!==y.edge&&v.
axis===y.axis&&v.side===y.side&&Qt(v.min,v.max,y.min,y.max)>=Ut,"railsInteract"),f=c(v=>{const y=[],I=new Set;for(const w of v){
if(I.has(w))continue;const E=[w],B=[];for(I.add(w);E.length>0;){const D=E.pop();B.push(D);for(const N of v)!I.has(N)&&p(
D,N)&&(I.add(N),E.push(N))}B.length>1&&y.push(B)}return y},"connectedComponents"),m=c(v=>{const y=[];for(const I of v)y.
some(w=>Math.abs(w-I.coord)<it)||y.push(I.coord);for(;y.length<v.length;){const I=Math.min(...y),w=Math.max(...y),E=v[0].
side;y.push(E==="left"||E==="top"?I-12*(v.length-y.length):w+12*(v.length-y.length))}return y},"uniqueCoordsFor"),S=c(v=>{
const y=v.map(E=>E.coord),I=m(v),w=[];if(v.length<=6){const E=new Array(I.length).fill(!1),B=[],D=c(()=>{if(B.length===v.
length){B.some((N,H)=>Math.abs(N-y[H])>=it)&&w.push([...B]);return}for(const[N,H]of I.entries())E[N]||(E[N]=!0,B.push(H),
D(),B.pop(),E[N]=!1)},"visit");return D(),w}for(let E=0;E<y.length;E++)for(let B=E+1;B<y.length;B++){const D=[...y];[D[E],
D[B]]=[D[B],D[E]],w.push(D)}return w},"coordinateAssignmentsFor"),M=c((v,y)=>{const I=new Map;for(const[E,B]of v.entries()){
const D=y[E],N=I.get(B.edge)??B.points.map(H=>({x:H.x,y:H.y}));B.axis==="vertical"?(N[B.segmentIndex].x=D,N[B.segmentIndex+
1].x=D):(N[B.segmentIndex].y=D,N[B.segmentIndex+1].y=D),I.set(B.edge,N)}const w=new Map;for(const[E,B]of I){const D=pe(vt(
B));if(yt(D).length!==D.length-1)return;w.set(E,D)}return w},"replacementsForAssignment"),L=c(v=>{for(const[y,I]of v){const w=[
y.start,y.end].filter(E=>!!E);for(const E of yt(I))if(Xt(E.a,E.b,r,w,-2)||Xt(E.a,E.b,i,[],-2))return!1}for(let y=0;y<a.length;y++){
const I=a[y],w=v.has(I),E=yt(h(I,v));for(let B=y+1;B<a.length;B++){const D=a[B];if(!w&&!v.has(D))continue;const N=yt(h(D,
v));for(const H of E)for(const U of N)if(ge(H,U,.5)>=Ut)return!1}}return!0},"candidateIsSafe");for(let v=0;v<4;v++){const y=g();
if(y===0)return;let I,w=y,E=x(),B=Number.POSITIVE_INFINITY;for(const D of f(l()))for(const N of S(D)){const H=M(D,N);if(!H||
!L(H))continue;const U=g(H);if(U>=y)continue;const Z=x(H),tt=D.reduce((at,ht,Et)=>at+Math.abs(N[Et]-ht.coord),0);U>w||U===
w&&(Z>E||Z===E&&tt>=B)||(I=H,w=U,E=Z,B=tt)}if(!I)return;for(const[D,N]of I)D.points=N}}c(Hs,"reassignCrossingExternalRai\
lChannels");function Ds(t,e){const{realNodeRects:o,labelNodeRects:s}=we(e.values()),r=t.filter(l=>!l.isLayoutOnly),i=c((l,p,f)=>vt(
l===p?f??[]:l.points??[]),"pointsFor"),a=c(l=>yt(l).reduce((p,f)=>{const m=f.a.x-f.b.x,S=f.a.y-f.b.y;return p+Math.hypot(
m,S)},0),"pathLength"),h=c((l,p)=>{let f=0;for(let m=0;m<r.length;m++){const S=yt(i(r[m],l,p));for(let M=m+1;M<r.length;M++){
const L=yt(i(r[M],l,p));for(const v of S)for(const y of L)xe(v.a,v.b,y.a,y.b,it)&&f++}}return f},"strictCrossingCount"),
g=c((l,p)=>{if(l.horizontal){const f=l.a.y;return(Math.abs(f-p.top)<1||Math.abs(f-p.bottom)<1)&&Qt(l.a.x,l.b.x,p.left,p.
right)>=Ut}if(l.vertical){const f=l.a.x;return(Math.abs(f-p.left)<1||Math.abs(f-p.right)<1)&&Qt(l.a.y,l.b.y,p.top,p.bottom)>=
Ut}return!1},"segmentRunsAlongRectBorder"),x=c(l=>{const p=[l.start,l.end].filter(m=>!!m),f=[];for(const m of p){const S=e.
get(m),M=S?oe(S):void 0;M&&f.push(M)}return f},"endpointRectsFor"),d=c((l,p)=>{if(p+3>=l.length)return[];const f=l[p],m=l[p+
1],S=l[p+2],M=l[p+3],L=_t(f,m,it)&&Ht(m,S,it)&&_t(S,M,it),v=Ht(f,m,it)&&_t(m,S,it)&&Ht(S,M,it);if(!L&&!v)return[];if(!(L?
Math.sign(m.x-f.x)!==Math.sign(M.x-S.x):Math.sign(m.y-f.y)!==Math.sign(M.y-S.y)))return[];const I=It(f,M,it)||Ct(f,M,it)?
[]:[{x:f.x,y:M.y},{x:M.x,y:f.y}],w=I.length===0?[[...l.slice(0,p+1),...l.slice(p+3)]]:I.map(B=>[...l.slice(0,p+1),B,...l.
slice(p+3)]),E=new Set;return w.map(B=>pe(vt(B))).filter(B=>{if(yt(B).length!==B.length-1||!B.some(N=>fe(N,M,it)))return!1;
const D=B.map(N=>`${N.x.toFixed(3)},${N.y.toFixed(3)}`).join("|");return E.has(D)?!1:(E.add(D),!0)})},"shortcutCandidate\
sAt"),b=c((l,p,f)=>{const m=[l.start,l.end].filter(M=>!!M),S=x(l);for(const M of yt(p))if(Xt(M.a,M.b,o,m,-2)||Xt(M.a,M.b,
s,[],-2)||S.some(L=>g(M,L)))return!1;for(const M of r)if(M!==l){for(const L of yt(p))for(const v of yt(i(M)))if(ge(L,v,.5)>=
Ut)return!1}return h(l,p)<=f},"candidateIsSafe");for(let l=0;l<8;l++){const p=h();let f,m,S=p,M=Number.POSITIVE_INFINITY,
L=Number.POSITIVE_INFINITY;for(const v of r){const y=i(v),I=ie(y,it),w=a(y);for(let E=0;E<=y.length-4;E++)for(const B of d(
y,E)){const D=ie(B,it),N=a(B);if(!(D<I||D===I&&N<w-it)||!b(v,B,p))continue;const U=h(v,B);U>S||U===S&&(D>M||D===M&&N>=L)||
(f=v,m=B,S=U,M=D,L=N)}}if(!f||!m)return;f.points=m}}c(Ds,"shortcutRedundantOrthogonalJogs");function Xs(t,e){const i=[];
for(const O of e.values()){if(O.isGroup||O.isEdgeLabel)continue;const P=O.x??0,_=O.y??0,V=oe(O);V&&i.push({id:String(O.id??
""),cx:P,cy:_,rect:V})}if(i.length===0)return;const a=new Map(i.map(O=>[O.id,O])),h=i.map(O=>({id:O.id,rect:O.rect})),g=[
"top","bottom","left","right"],x={top:Math.min(...i.map(O=>O.rect.top))-20,bottom:Math.max(...i.map(O=>O.rect.bottom))+20,
left:Math.min(...i.map(O=>O.rect.left))-20,right:Math.max(...i.map(O=>O.rect.right))+20},d=t.filter(O=>!O.isLayoutOnly),
b=new Map(d.map((O,P)=>[O,P])),l=c(O=>{const P=O==="left"||O==="top"?-1:1,_=[];for(let V=0;V<=2;V++)_.push(x[O]+P*20*V);
return _},"outwardTracksForSide"),p=c((O,P=new Map)=>vt(P.get(O)??O.points??[]),"replacementPointsFor"),f=c((O,P)=>{let _=0;
for(const V of O)for(const W of P)xe(V.a,V.b,W.a,W.b,it)&&_++;return _},"crossingCountBetweenSegments"),m=c((O,P)=>f(yt(
O),yt(P)),"crossingCountBetweenPaths"),S=c((O=new Map)=>{let P=0;const _=[],V=new Set,W=[],et=c(Y=>{V.has(Y)||(V.add(Y),
W.push(Y))},"addEdge");for(let Y=0;Y<d.length;Y++){const nt=d[Y],ft=p(nt,O);for(let u=Y+1;u<d.length;u++){const C=d[u],A=m(
ft,p(C,O));A>0&&(P+=A,_.push({first:nt,second:C,count:A}),et(nt),et(C))}}return W.sort((Y,nt)=>(b.get(Y)??0)-(b.get(nt)??
0)),{count:P,pairs:_,edgeSet:V,edges:W}},"crossingSnapshot"),M=c((O,P)=>{const _=new Set(P.keys());if(_.size===0)return O.
count;let V=0;for(const et of O.pairs)(_.has(et.first)||_.has(et.second))&&(V+=et.count);let W=0;for(let et=0;et<d.length;et++){
const Y=d[et],nt=_.has(Y),ft=p(Y,P);for(let u=et+1;u<d.length;u++){const C=d[u];!nt&&!_.has(C)||(W+=m(ft,p(C,P)))}}return O.
count-V+W},"crossingCountWithReplacements"),L=c(O=>{const P=new Map;for(const W of O.pairs){const et=P.get(W.first)??new Set;
et.add(W.second),P.set(W.first,et);const Y=P.get(W.second)??new Set;Y.add(W.first),P.set(W.second,Y)}const _=[],V=new Set;
for(const W of O.edges){if(V.has(W))continue;const et=[W],Y=[];for(V.add(W);et.length>0;){const nt=et.pop();Y.push(nt);for(const ft of P.
get(nt)??[])V.has(ft)||(V.add(ft),et.push(ft))}Y.sort((nt,ft)=>(b.get(nt)??0)-(b.get(ft)??0)),Y.length>1&&_.push(Y)}return _},
"crossingComponents"),v=c(O=>[O.start,O.end].filter(P=>!!P),"endpointIdsFor"),y=c(O=>{const P=[];for(const _ of L(O)){const V=new Set(
_),W=new Set(_.flatMap(Y=>v(Y))),et=[..._];for(const Y of d)V.has(Y)||v(Y).some(nt=>W.has(nt))&&et.push(Y);et.sort((Y,nt)=>(b.
get(Y)??0)-(b.get(nt)??0)),P.push(et)}return P},"pairSearchGroups"),I=c((O,P,_)=>M(O,new Map([[P,_]])),"crossingCountWit\
hSingleReplacement"),w=c(O=>{const P=new Map;for(const _ of O.pairs)P.set(_.first,(P.get(_.first)??0)+_.count),P.set(_.second,
(P.get(_.second)??0)+_.count);return P},"currentCrossingsByEdge"),E=c(O=>O.slice(1).reduce((P,_,V)=>{const W=O[V];return P+
Math.abs(_.x-W.x)+Math.abs(_.y-W.y)},0),"pathLength"),B=c((O=new Map)=>d.reduce((P,_)=>P+ie(p(_,O)),0),"totalBends"),D=c(
(O=new Map)=>d.reduce((P,_)=>P+E(p(_,O)),0),"totalLength"),N=c((O,P)=>fs(O,P,Ps.ROUTE_TOUCH_TOLERANCE),"touchesAtBend"),
H=c((O,P,_=new Map)=>{const V=yt(P);for(const W of d)if(W!==O){for(const et of V)for(const Y of yt(p(W,_)))if(ge(et,Y,.5)>=
Ut)return!0;if(N(P,p(W,_)))return!0}return!1},"pathHasSegmentConflict"),U=c((O,P)=>{const _=[O.start,O.end].filter(V=>!!V);
for(const V of yt(P))if(Xt(V.a,V.b,h,_,-2))return!0;return!1},"pathHitsNode"),Z=c((O,P)=>{const _=pe(vt(P));yt(_).length===
_.length-1&&O.push(_)},"pushOrthogonalCandidate"),tt=c(O=>O==="left"||O==="right","sideIsHorizontal"),at=c((O,P,_)=>{switch(P){case"\
left":return Math.min(O.x,_.x)-20;case"right":return Math.max(O.x,_.x)+20;case"top":return Math.min(O.y,_.y)-20;case"bot\
tom":return Math.max(O.y,_.y)+20}},"localTrackForSameSide"),ht=c((O,P,_,V)=>{const W=_==="left"||_==="top"?-1:1,et=[at(P,
_,V),x[_]];for(const Y of et)for(let nt=0;nt<=2;nt++)Z(O,xo(P,_,V,Y+W*20*nt))},"addSameSideCandidates"),Et=c((O,P,_,V,W)=>{
for(const et of l(_))for(const Y of l(W))Z(O,[P,{x:et,y:P.y},{x:et,y:Y},{x:V.x,y:Y},V])},"addHorizontalToVerticalCandida\
tes"),ce=c((O,P,_,V,W)=>{for(const et of l(_))for(const Y of l(W))Z(O,[P,{x:P.x,y:et},{x:Y,y:et},{x:Y,y:V.y},V])},"addVe\
rticalToHorizontalCandidates"),$t=c((O,P,_,V,W)=>{const et=[...l("top"),...l("bottom")];for(const Y of l(_))for(const nt of l(
W))for(const ft of et)Z(O,[P,{x:Y,y:P.y},{x:Y,y:ft},{x:nt,y:ft},{x:nt,y:V.y},V])},"addHorizontalPairCandidates"),Vt=c((O,P,_,V,W)=>{
const et=[...l("left"),...l("right")];for(const Y of l(_))for(const nt of l(W))for(const ft of et)Z(O,[P,{x:P.x,y:Y},{x:ft,
y:Y},{x:ft,y:nt},{x:V.x,y:nt},V])},"addVerticalPairCandidates"),J=c(O=>{const P=new Set;return O.map(_=>vt(_)).filter(_=>{
const V=_.map(W=>`${W.x.toFixed(3)},${W.y.toFixed(3)}`).join("|");return P.has(V)||_.length<2?!1:(P.add(V),!0)})},"dedup\
eCandidatePaths"),lt=c((O,P,_,V)=>{const W=[],et=yo(O,P,_,V,20,it);et&&Z(W,et),P===V&&ht(W,O,P,_);const Y=tt(P),nt=tt(V);
return Y&&!nt?Et(W,O,P,_,V):!Y&&nt?ce(W,O,P,_,V):Y?$t(W,O,P,_,V):Vt(W,O,P,_,V),J(W)},"buildCandidatesForSides"),k=c((O,P,_,V)=>{
const W=[...l("left"),...l("right")],et=[...l("top"),...l("bottom")];for(const Y of g){const nt=Be(V,Y),ft=Y==="top"||Y===
"bottom"?l(Y):et;for(const u of W){tt(Y)&&Z(O,[P,_,{x:u,y:_.y},{x:u,y:nt.y},nt]);for(const C of ft)Z(O,[P,_,{x:u,y:_.y},
{x:u,y:C},{x:nt.x,y:C},nt])}}},"addVerticalDepartureOuterTrackCandidates"),G=c((O,P,_,V)=>{const W=[...l("left"),...l("r\
ight")],et=[...l("top"),...l("bottom")];for(const Y of g){const nt=Be(V,Y),ft=Y==="left"||Y==="right"?l(Y):W;for(const u of et){
tt(Y)||Z(O,[P,_,{x:_.x,y:u},{x:nt.x,y:u},nt]);for(const C of ft)Z(O,[P,_,{x:_.x,y:u},{x:C,y:u},{x:C,y:nt.y},nt])}}},"add\
HorizontalDepartureOuterTrackCandidates"),Q=c(O=>{const P=O.start,_=O.end,V=_?a.get(_):void 0;if(!P||!V)return[];const W=vt(
O.points??[]);if(W.length<4)return[];const et=W[0],Y=W[1],nt=[];return Ht(et,Y,it)?k(nt,et,Y,V):_t(et,Y,it)&&G(nt,et,Y,V),
nt},"terminalPreservingOuterTrackCandidates"),K=c(O=>{const P=O.start,_=O.end,V=P?a.get(P):void 0,W=_?a.get(_):void 0;if(!V||
!W)return[];const et=[];for(const Y of g){const nt=Be(V,Y);for(const ft of g)et.push(...lt(nt,Y,Be(W,ft),ft))}return et.
push(...Q(O)),et},"candidatePathsFor"),st=c(()=>new Map(d.map(O=>[O,yt(p(O))])),"currentSegmentsByEdge"),dt=c((O,P,_,V)=>{
const W=new Set;for(const et of d){if(et===O)continue;const Y=V.get(et)??yt(p(et));(_.some(nt=>Y.some(ft=>ge(nt,ft,.5)>=
Ut))||N(P,p(et)))&&W.add(et)}return W},"sharedTrackConflictsFor"),gt=c((O,P,_,V)=>{const W=new Set;return K(O).map(Y=>pe(
vt(Y))).filter(Y=>{if(U(O,Y))return!1;const nt=Y.map(ft=>`${ft.x.toFixed(3)},${ft.y.toFixed(3)}`).join("|");return W.has(
nt)||Y.length<2?!1:(W.add(nt),!0)}).map(Y=>{const nt=yt(Y);let ft=0;for(const u of d)u!==O&&(ft+=f(nt,_.get(u)??yt(p(u))));
return{candidate:Y,candidateSegments:nt,crossings:P.count-(V.get(O)??0)+ft,bends:ie(Y,it),totalBends:ie(Y),length:E(Y)}}).
filter(({crossings:Y})=>Y<=P.count).sort((Y,nt)=>Y.crossings-nt.crossings||Y.bends-nt.bends||Y.length-nt.length).slice(0,
48).map(Y=>({path:Y.candidate,segments:Y.candidateSegments,sharedTrackConflicts:dt(O,Y.candidate,Y.candidateSegments,_),
totalBends:Y.totalBends,length:Y.length}))},"pairCandidatesFor"),pt=c((O,P,_,V,W,et)=>{let Y=0;for(const ft of O.pairs)(ft.
first===P||ft.second===P||ft.first===V||ft.second===V)&&(Y+=ft.count);let nt=f(_.segments,W.segments);for(const ft of d){
if(ft===P||ft===V)continue;const u=et.get(ft)??yt(p(ft));nt+=f(_.segments,u)+f(W.segments,u)}return O.count-Y+nt},"pairC\
rossingCount"),xt=c((O,P)=>{for(const _ of O.sharedTrackConflicts)if(_!==P)return!1;return!0},"conflictsOnlyWith"),Pt=c(
(O,P)=>O.segments.some(_=>P.segments.some(V=>ge(_,V,.5)>=Ut))||N(O.path,P.path),"candidatesShareTrack"),Ee=c((O,P,_,V)=>xt(
P,_.edge)&&xt(V,O.edge)&&!Pt(P,V),"pairCandidatesAreCompatible"),me=c((O,P,_,V,W)=>{const et=pt(O.current,P.edge,_,V.edge,
W,O.baseSegments);if(!(et>=O.current.count))return{replacements:new Map([[P.edge,_.path],[V.edge,W.path]]),crossings:et,
bends:O.currentBends-(O.baseBendsByEdge.get(P.edge)??0)-(O.baseBendsByEdge.get(V.edge)??0)+_.totalBends+W.totalBends,length:O.
currentLength-(O.baseLengthByEdge.get(P.edge)??0)-(O.baseLengthByEdge.get(V.edge)??0)+_.length+W.length}},"scorePairRepl\
acement"),ye=c((O,P)=>O.crossings<P.crossings||O.crossings===P.crossings&&(O.bends<P.bends||O.bends===P.bends&&O.length<
P.length),"pairScoreIsBetter"),Te=c((O,P,_,V)=>{let W=V;for(const et of P.candidates)for(const Y of _.candidates){if(!Ee(
P,et,_,Y))continue;const nt=me(O,P,et,_,Y);nt&&ye(nt,W)&&(W=nt)}return W},"bestScoreForOptionPair"),Ve=c(O=>{const P=B(),
_=D(),V=st(),W=w(O),et=new Map(d.map(A=>[A,ie(p(A))])),Y=new Map(d.map(A=>[A,E(p(A))])),nt=new Map,ft=y(O);for(const A of ft)
for(const T of A){if(nt.has(T))continue;const R=gt(T,O,V,W);R.length>0&&nt.set(T,{edge:T,candidates:R})}let u={replacements:new Map,
crossings:O.count,bends:P,length:_};const C={current:O,currentBends:P,currentLength:_,baseBendsByEdge:et,baseLengthByEdge:Y,
baseSegments:V};for(const A of ft){const T=new Set(A.filter(F=>O.edgeSet.has(F))),R=A.map(F=>nt.get(F)).filter(F=>!!F);for(let F=0;F<
R.length;F++){const q=R[F];for(let ct=F+1;ct<R.length;ct++){const j=R[ct];!T.has(q.edge)&&!T.has(j.edge)||(u=Te(C,q,j,u))}}}
return u.replacements.size>0?u.replacements:void 0},"bestPairedReplacement");for(let O=0;O<4;O++){const P=S(),_=P.count;
if(_===0)return;let V,W,et=_,Y=Number.POSITIVE_INFINITY;for(const ft of P.edges){const u=ie(p(ft),it);for(const C of K(ft)){
const A=U(ft,C),T=!A&&H(ft,C),R=I(P,ft,C),F=ie(C,it);A||T||!(R<_||R===_&&F<u)||R>et||R===et&&F>=Y||(V=ft,W=C,et=R,Y=F)}}
if(V&&W){V.points=W;continue}const nt=Ve(P);if(!nt)return;for(const[ft,u]of nt)ft.points=u}}c(Xs,"resolveRenderedOrthogo\
nalCrossings");var ve=.001,ri=8;function Ys(t,e){const{nodeInfoById:n,realNodeRects:o}=yn(e),s=["top","bottom","left","r\
ight"],r=20,i={top:Math.min(...o.map(f=>f.rect.top))-r,bottom:Math.max(...o.map(f=>f.rect.bottom))+r,left:Math.min(...o.
map(f=>f.rect.left))-r,right:Math.max(...o.map(f=>f.rect.right))+r},a=c((f,m,S,M)=>{const L=[],v=yo(f,m,S,M,r,ve);return v&&
L.push(v),m===M&&L.push(xo(f,m,S,i[m])),L},"buildOrthogonalPathCandidates"),h=c((f,m)=>{for(let S=0;S<f.length-1;S++){const M=f[S],
L=f[S+1];if(Xt(M,L,o,m,1))return!0}return!1},"pathHitsNode"),g=c((f,m,S=!1)=>{let M=0;const L=Le(f,ve),v=m.start,y=m.end;
for(const I of t){if(I===m||I.isLayoutOnly)continue;const w=I.start,E=I.end;if(!S&&v&&y&&(w===v||w===y||E===v||E===y))continue;
const B=I.points;if(!(!B||B.length<2))for(const D of L)for(const N of Le(B,ve)){if(Mo(D.a,D.b,N.a,N.b,ve,ve)){M++;continue}
ge(D,N,ve)>=ri&&M++}}return M},"pathConflictCount"),x=4,d=c((f,m)=>{const S=Math.abs(f.y-m.rect.top),M=Math.abs(f.y-m.rect.
bottom),L=Math.abs(f.x-m.rect.left),v=Math.abs(f.x-m.rect.right);let y="top",I=S;return M<I&&(y="bottom",I=M),L<I&&(y="l\
eft",I=L),v<I&&(y="right",I=v),y},"nearestSideOfRect"),b=new Map,l=c((f,m,S)=>{const M=b.get(f)??[];M.push({side:m,edgeId:S}),
b.set(f,M)},"addFaceClaim");for(const f of t){if(f.isLayoutOnly)continue;const m=f.points??[];if(m.length<1)continue;const S=f.
id??"",M=f.start,L=f.end;if(M){const v=n.get(M);v&&l(M,d(m[0],v),S)}if(L){const v=n.get(L);v&&l(L,d(m[m.length-1],v),S)}}
const p=c((f,m,S)=>b.get(f)?.some(M=>M.edgeId!==S&&M.side===m)??!1,"faceIsClaimed");for(const f of t){if(f.isLayoutOnly)
continue;const m=f.points;if(!m||m.length<2)continue;const S=ie(m,ve);if(S<x)continue;const M=f.start,L=f.end;if(!M||!L)
continue;const v=n.get(M),y=n.get(L);if(!v||!y)continue;const I=f.id??"",w=g(m,f,!0),E=g(m,f);let B,D=w,N=S;for(const H of s){
if(p(M,H,I))continue;const U=Be(v,H);for(const Z of s){if(p(L,Z,I))continue;const tt=Be(y,Z);for(const at of a(U,H,tt,Z)){
if(h(at,[M,L]))continue;const ht=ie(at,ve);if(w>0){const Et=g(at,f,!0);if(Et>D||Et===D&&ht>=N)continue;D=Et,N=ht,B=at;continue}
g(at,f)>E||ht<N&&(N=ht,B=at)}}}if(B){f.points=B;const H=b.get(M);H&&b.set(M,H.filter(Z=>Z.edgeId!==I));const U=b.get(L);
U&&b.set(L,U.filter(Z=>Z.edgeId!==I)),l(M,d(B[0],v),I),l(L,d(B[B.length-1],y),I)}}}c(Ys,"simplifyDetouredEdges");var ne=.001,
Do=10,Qe=7;function Zn(t,e){const n=e?0:t.length-1,o=e?1:-1,s=t[n],r=t[n+o];if(!s||!r)return;const i=r.x-s.x,a=r.y-s.y;if(!(Math.
abs(i)+Math.abs(a)<ne)){if(Math.abs(a)<=ne){const g=s.x+Math.sign(i)*Do;return{left:Math.min(s.x,g),right:Math.max(s.x,g),
top:s.y-Qe,bottom:s.y+Qe}}if(Math.abs(i)<=ne){const g=s.y+Math.sign(a)*Do;return{left:s.x-Qe,right:s.x+Qe,top:Math.min(s.
y,g),bottom:Math.max(s.y,g)}}return{left:Math.min(s.x,r.x),right:Math.max(s.x,r.x),top:Math.min(s.y,r.y),bottom:Math.max(
s.y,r.y)}}}c(Zn,"markerClearanceRectFor");function Gs(t){return{left:Math.min(t.left,t.right),right:Math.max(t.left,t.right),
top:Math.min(t.top,t.bottom),bottom:Math.max(t.top,t.bottom)}}c(Gs,"normalizeRect");function Jn(t,e){const n=vt(e),o=Zn(
n,!0),s=Zn(n,!1);return[o,s].some(r=>r&&rn(t,Gs(r)))}c(Jn,"labelOverlapsOwnMarker");function nn(t,e){const n=[];for(const f of t){
if(f.isLayoutOnly)continue;const m=f.points;if(!(!m||m.length<2))for(let S=0;S<m.length-1;S++)n.push({edgeId:f.id,p1:m[S],
p2:m[S+1]})}const o=[],s=[],r=ue([...e.values()]);for(const f of e.values()){const m=f.isGroup;if(r.isLane(f.id)){const M=oe(
f);M&&s.push({id:f.id,rect:M});continue}if(m||f.isEdgeLabel)continue;const S=oe(f);S&&o.push({nodeId:f.id,rect:S})}const i=3,
a=1,h=12,g=c((f,m)=>{const S=Pn(m,i);for(const{nodeId:M,rect:L}of o)if(M!==f&&rn(S,L))return!0;return!1},"labelOverlapsF\
oreignNode"),x=c((f,m)=>{const S=Pn(m,i);for(const M of n)if(M.edgeId!==f&&mn(M.p1,M.p2,S))return!0;return!1},"labelOver\
lapsForeignEdge"),d=c((f,m,S)=>g(f,S)||x(m,S),"labelOverlapsAnything"),b=[],l=c(f=>{for(const{id:m,rect:S}of s)if(ds(S,f))
return m},"findContainingLane"),p=c((f,m)=>b.some(S=>S.labelId!==f&&rn(m,S.rect)),"overlapsPlacedLabel");for(const f of t){
if(f.isLayoutOnly)continue;const m=f.labelNodeId;if(!m)continue;const S=e.get(m);if(!S)continue;const M=f.points;if(!M||
M.length<2)continue;const L=S.width??0,v=S.height??0;if(L<=0||v<=0)continue;const y=[];for(let J=0;J<M.length-1;J++){const lt=M[J],
k=M[J+1],G=Math.abs(lt.x-k.x),Q=Math.abs(lt.y-k.y);G<ne&&Q<ne||G>=ne&&Q>=ne||y.push({idx:J,length:G+Q,orientation:G>=ne?
"horizontal":"vertical",midX:(lt.x+k.x)/2,midY:(lt.y+k.y)/2})}if(y.length===0)continue;const I=y.length>=3?y.filter(J=>J.
idx>0&&J.idx<y.length-1):y,w=I.length>0?I:y,E=L>=v?"horizontal":"vertical",B=c(J=>[...J].sort((lt,k)=>{const G=lt.orientation===
E,Q=k.orientation===E;if(G!==Q)return G?-1:1;const K=lt.length>=(lt.orientation==="horizontal"?L:v)+2,st=k.length>=(k.orientation===
"horizontal"?L:v)+2;return K!==st?K?-1:1:k.length-lt.length}),"rankSegments"),D=y[0],N=y[y.length-1],H=[.5,.25,.75,.05,.95,
.15,.85,.1,.9],U=c((J,lt)=>{const k=M[J.idx],G=M[J.idx+1];return{midX:k.x+(G.x-k.x)*lt,midY:k.y+(G.y-k.y)*lt}},"anchorAt\
T"),Z=c((J,lt,k)=>Math.min(k,Math.max(lt,J)),"clamp"),tt=c((J,lt)=>J.midX>=lt.left-ne&&J.midX<=lt.right+ne&&J.midY>=lt.top-
ne&&J.midY<=lt.bottom+ne,"pointInsideRectInclusive"),at=c(J=>{const lt=He(J.midX,J.midY,L,v),k=l(lt);if(k)return{laneId:k,
anchor:J,rect:lt};const G=s.find(({rect:xt})=>tt(J,xt));if(!G)return;const Q=G.rect.left+L/2+a,K=G.rect.right-L/2-a,st=G.
rect.top+v/2+a,dt=G.rect.bottom-v/2-a;if(Q>K||st>dt)return;const gt={midX:Z(J.midX,Q,K),midY:Z(J.midY,st,dt)},pt=He(gt.midX,
gt.midY,L,v);return tt(J,pt)?{laneId:G.id,anchor:gt,rect:pt}:void 0},"placementForAnchor"),ht=c((J,lt,k)=>J.orientation===
"horizontal"?Math.abs(lt.midX-k.x):Math.abs(lt.midY-k.y),"distanceAlongSegment"),Et=c((J,lt)=>{const G=(J.orientation===
"horizontal"?L/2:v/2)+h;if(J===D){const Q=M[J.idx];if(ht(J,lt,Q)+ne<G)return!1}if(J===N){const Q=M[J.idx+1];if(ht(J,lt,Q)+
ne<G)return!1}return!0},"labelClearsTerminalEndpoints"),ce=c(J=>{const lt=B(J);for(const k of lt)for(const G of H){const Q=U(
k,G);if(!Et(k,Q))continue;const K=at(Q);if(K&&!Jn(K.rect,M)&&!p(m,K.rect)&&!d(m,f.id,K.rect))return{laneId:K.laneId,anchor:K.
anchor}}},"tryPool"),$t=c((J,lt,k=!1)=>{const G=B(J);for(const Q of G){const K={midX:Q.midX,midY:Q.midY};if(lt&&!Et(Q,K))
continue;const st=at(K);if(st&&!Jn(st.rect,M)&&!p(m,st.rect)&&!g(m,st.rect)&&(k||!x(f.id,st.rect)))return{laneId:st.laneId,
anchor:st.anchor}}},"findLaneContainingFallback"),Vt=ce(w)??(w.length<y.length?ce(y):void 0)??$t(y,!0)??$t(y,!1)??$t(y,!1,
!0);if(Vt){S.x=Vt.anchor.midX,S.y=Vt.anchor.midY,S.parentId=Vt.laneId;const J=He(Vt.anchor.midX,Vt.anchor.midY,L,v),lt=b.
findIndex(k=>k.labelId===m);lt>=0?b[lt]={labelId:m,rect:J}:b.push({labelId:m,rect:J})}}}c(nn,"anchorLabelsToPolyline");var Rn=1e-6,
ii=8,Xo=ii/2,ci=3;function Qn(t,e,n,{cx:o,cy:s},r,i){const a={x:o,y:s},h=i==="x"?"y":"x",g=Math.sign(r[h]-a[h]);for(const x of t){
if(x===e||x.isLayoutOnly||!x.points?.length)continue;if([...x.end===n?[x.points.at(-1)]:[],...x.start===n?[x.points[0]]:
[]].some(b=>Math.sign(b[h]-a[h])===g&&Math.abs(b[i]-r[i])<Ps.MIN_ARROWHEAD_SPACING))return!0}return!1}c(Qn,"crowdsFaceNe\
ighbour");function to(t,e){return t<e?`${t}::${e}`:`${e}::${t}`}c(to,"pairKey");function zs(t,e){const{nodeInfoById:n,realNodeRects:o}=yn(
e),s=new Map;for(const i of e){const a=i.id;if(!i.isGroup&&i.isEdgeLabel){s.set(a,{w:i.width??0,h:i.height??0});continue}}
const r=c((i,a,h,g)=>{const x=to(a,h);let d=0;const b=c(l=>{if(!l)return;const p=s.get(l);if(!p)return;const f=g==="x"?p.
w/2:p.h/2;f>d&&(d=f)},"consider");b(i.labelNodeId);for(const l of t){if(l===i||l.isLayoutOnly)continue;const p=l.start,f=l.
end;!p||!f||to(p,f)===x&&b(l.labelNodeId)}return d>0?d+ci:0},"labelClearanceFor");for(const i of t){if(i.isLayoutOnly)continue;
const a=i.points;if(!po(a,Rn))continue;const h=bo(i,n,Rn);if(!h)continue;const{srcId:g,dstId:x,srcInfo:d,dstInfo:b,collinearX:l,
collinearY:p}=h;if(l===p)continue;let f,m;if(l){const I=b.cy>d.cy;f={x:d.cx,y:I?d.rect.bottom:d.rect.top},m={x:b.cx,y:I?
b.rect.top:b.rect.bottom}}else{const I=b.cx>d.cx;f={x:I?d.rect.right:d.rect.left,y:d.cy},m={x:I?b.rect.left:b.rect.right,
y:b.cy}}if(Xt(f,m,o,[g,x],1))continue;const S=l?"x":"y",M=r(i,g,x,S),L=M>Xo?M:Xo,v=[0,L,-L];let y;for(const I of v){const w={
...f},E={...m};if(l){if(w.x+=I,E.x+=I,w.x<=d.rect.left||w.x>=d.rect.right||E.x<=b.rect.left||E.x>=b.rect.right)continue}else if(w.
y+=I,E.y+=I,w.y<=d.rect.top||w.y>=d.rect.bottom||E.y<=b.rect.top||E.y>=b.rect.bottom)continue;if(Xt(w,E,o,[g,x],1)||cn(w,
E,t,i,{epsilon:Rn}))continue;const B=[w,E];if(Qn(t,i,g,d,w,S)||Qn(t,i,x,b,E,S)){y??=B;continue}i.points=B,y=void 0;break}
y&&(i.points=y)}}c(zs,"straightenCollinearSiblingDetours");function eo(t,e){const{realNodeRects:h,labelNodeRects:g}=we(e.
values()),x=c((y,I)=>Le(I,.001).map(w=>({...w,edge:y,interior:w.index>=1&&w.index<=I.length-3})),"segmentsFor"),d=c(()=>{
const y=[];for(const I of t){if(I.isLayoutOnly)continue;const w=I.points;!w||w.length<2||y.push(...x(I,vt(w)))}return y},
"allSegments"),b=c((y,I)=>y.horizontal&&I.horizontal?Qt(y.a.x,y.b.x,I.a.x,I.b.x)>=8&&Math.abs(y.a.y-I.a.y)<7:y.vertical&&
I.vertical?Qt(y.a.y,y.b.y,I.a.y,I.b.y)>=8&&Math.abs(y.a.x-I.a.x)<7:!1,"hasCrowdedParallelTrack"),l=c((y,I)=>{const w=y.start,
E=y.end,B=x(y,I);if(B.length!==I.length-1)return!1;const D=[w,E].filter(H=>!!H),N=y.labelNodeId?[y.labelNodeId]:[];for(const H of B)
if(Xt(H.a,H.b,h,D,-2)||Xt(H.a,H.b,g,N,-2))return!1;for(const H of t){if(H===y||H.isLayoutOnly)continue;const U=H.points;
if(!(!U||U.length<2)){for(const Z of B)for(const tt of x(H,vt(U)))if(b(Z,tt)||xe(Z.a,Z.b,tt.a,tt.b,.001))return!1}}return!0},
"candidateIsSafe"),p=c((y,I)=>{const w=vt(y.edge.points??[]);if(w.length<4||y.index>=w.length-1)return;const E=w.map(B=>({
...B}));if(y.horizontal)E[y.index].y+=I,E[y.index+1].y+=I;else if(y.vertical)E[y.index].x+=I,E[y.index+1].x+=I;else return;
return x(y.edge,E).length===E.length-1?E:void 0},"shiftedCandidate"),f=c((y,I)=>({x:y.x??(I.left+I.right)/2,y:y.y??(I.top+
I.bottom)/2}),"nodeCenter"),m=c(y=>{const I=y.edge,w=vt(I.points??[]);if(w.length!==4||y.index!==1)return;const E=I.start?
e.get(I.start):void 0,B=I.end?e.get(I.end):void 0,D=E?oe(E):void 0,N=B?oe(B):void 0,H=w.slice(y.index+2);if(!(!E||!B||!D||
!N||H.length===0))return{sourceCenter:f(E,D),targetCenter:f(B,N),sourceRect:D,tail:H}},"sourceDetourContextFor"),S=c((y,I,w,E,B,D)=>{
const N=E.y>=w.y,H=N?B.bottom:B.top,U=H+(N?20:-20);if(N&&y.b.y<=U+.001||!N&&y.b.y>=U-.001)return;const Z=y.a.x+I;return vt(
[{x:w.x,y:H},{x:w.x,y:U},{x:Z,y:U},{x:Z,y:y.b.y},...D],.001)},"verticalSourceDetour"),M=c((y,I,w,E,B,D)=>{const N=E.x>=w.
x,H=N?B.right:B.left,U=H+(N?20:-20);if(N&&y.b.x<=U+.001||!N&&y.b.x>=U-.001)return;const Z=y.a.y+I;return vt([{x:H,y:w.y},
{x:U,y:w.y},{x:U,y:Z},{x:y.b.x,y:Z},...D],.001)},"horizontalSourceDetour"),L=c((y,I)=>{const w=m(y);if(w){if(y.vertical)
return S(y,I,w.sourceCenter,w.targetCenter,w.sourceRect,w.tail);if(y.horizontal)return M(y,I,w.sourceCenter,w.targetCenter,
w.sourceRect,w.tail)}},"sourceDetourCandidate"),v=[-7,7,-14,14,-21,21];for(let y=0;y<12;y++){const I=d();let w=!1;for(let E=0;E<
I.length&&!w;E++)for(let B=E+1;B<I.length&&!w;B++){const D=I[E],N=I[B];if(D.edge===N.edge||!b(D,N))continue;const H=[D,N].
filter(U=>U.interior);for(const U of H){for(const Z of v){const tt=p(U,Z);if(tt&&l(U.edge,tt)){U.edge.points=tt,w=!0;break}
const at=L(U,Z);if(at&&l(U.edge,at)){U.edge.points=at,w=!0;break}}if(w)break}}if(!w)return}}c(eo,"nudgeSharedInteriorSub\
paths");function $s(t,e,n,o){const s=e.x-t.x,r=e.y-t.y,i=o.x-n.x,a=o.y-n.y,h=s*a-r*i;if(Math.abs(h)<1e-10)return!1;const g=n.
x-t.x,x=n.y-t.y,d=(g*a-x*i)/h,b=(g*r-x*s)/h,l=.01;return d>l&&d<1-l&&b>l&&b<1-l}c($s,"segmentsIntersect");function Vs(t){
const e=t.nodes??[],n=t.edges??[],o=[];if(!n.length||!e.length)return o;const s=us(e),r=[];for(const a of n){if(a.isLayoutOnly)
continue;const h=a.points;if(!h||h.length<2)continue;const g=a.start,x=a.end,d=a.labelNodeId,b=a.id??`${g}->${x}`;for(const l of s)
if(!(l.nodeId===g||l.nodeId===x)&&!(d&&l.nodeId===d)){for(let p=0;p<h.length-1;p++)if(mn(h[p],h[p+1],l,-1)){o.push({type:"\
edge-node-overlap",edgeId:b,targetId:l.nodeId,detail:`segment ${p} passes through node "${l.nodeId}"`});break}}for(let l=0;l<
h.length-1;l++)r.push({edgeId:b,start:g,end:x,p1:h[l],p2:h[l+1]})}const i=new Set;for(let a=0;a<r.length;a++)for(let h=a+
1;h<r.length;h++){const g=r[a],x=r[h];if(g.edgeId!==x.edgeId&&!(g.start===x.start||g.start===x.end||g.end===x.start||g.end===
x.end)&&$s(g.p1,g.p2,x.p1,x.p2)){const d=g.edgeId<x.edgeId?`${g.edgeId}|${x.edgeId}`:`${x.edgeId}|${g.edgeId}`;i.has(d)||
(i.add(d),o.push({type:"edge-edge-crossing",edgeId:g.edgeId,targetId:x.edgeId,detail:`edges "${g.edgeId}" and "${x.edgeId}\
" cross`}))}}if(o.length>0){const a=o.filter(g=>g.type==="edge-node-overlap").length,h=o.filter(g=>g.type==="edge-edge-c\
rossing").length;Xe.warn(`[SWIMLANE_VALIDATE] ${o.length} issue(s) detected: ${a} edge-node overlap(s), ${h} edge crossi\
ng(s)`);for(const g of o)Xe.warn(`[SWIMLANE_VALIDATE]   ${g.type}: ${g.detail}`)}return o}c(Vs,"validateSwimlanesLayout");
function Us(t,e){const n=t.nodes??[],o=t.edges??[],s=n.filter(a=>!a.isGroup);if((e==="LR"||e==="RL")&&s.length>0&&!Os(t,
e)||e==="BT"&&s.length>0&&!ws(t))return;for(const a of o){if(a.isLayoutOnly)continue;const h=a.points;!h||h.length<2||(a.
points=pe(an(h)))}Ys(o,n),zs(o,n),Ns(o,n);const r=new Map;for(const a of n)r.set(String(a.id),a);nn(o,r),ys(o,r),Bs(o,r),
eo(o,r),jn(o,r),Fs(o,r),Wn(o,r),_s(o,r);const i=c(()=>{Xs(o,r),jn(o,r),Hs(o,r),Ds(o,r),nn(o,r),Vn(o,r),Wn(o,r),nn(o,r),Vn(
o,r)},"finalizeRenderedEdges");i(),eo(o,r),i(),Kn(o,r,e),qn(o,r,e),Kn(o,r,e),qn(o,r,e)}c(Us,"postProcessSwimlaneLayout");
function Ae(t){const e=new Map(t.nodeById),n=new Set,o=[];for(const r of t.edges){if(!e.has(r.src)||!e.has(r.dst))continue;
const i=`${r.id}:${r.src}->${r.dst}`;n.has(i)||(n.add(i),o.push(r))}return{nodes:[...e.keys()],edges:o,layout:t.layout,nodeById:e}}
c(Ae,"normalizeGraph");function Lo(t,e){return t.edges.filter(n=>n.dst===e)}c(Lo,"incoming");function js(t){const e=new Map;
for(const n of t.nodes)e.set(n,[]);for(const n of t.edges)e.get(n.src).push(n.dst);return e}c(js,"buildSuccessorMap");function wo(t){
const e=js(t);for(const n of e.values())n.sort((o,s)=>o.localeCompare(s));return e}c(wo,"buildSortedSuccessorMap");function xn(t){
const e=new Map;for(const n of t.nodes)e.set(n,0);for(const n of t.edges)e.set(n.dst,(e.get(n.dst)??0)+1);return e}c(xn,
"buildInDegreeMap");function Ao(t,e){const n=[...e.entries()].filter(([,a])=>a===0).map(([a])=>a).sort((a,h)=>a.localeCompare(
h)),o=new Set(t.edges.flatMap(a=>[a.src,a.dst])),s=c(a=>!o.has(a)&&!t.nodeById.get(a)?.isGroup,"isUnconnected"),r=[...e.
keys()].filter(a=>e.get(a)===0&&s(a));let i=0;return n.map(a=>s(a)?r[i++]:a)}c(Ao,"sortedZeroInDegreeNodes");function bn(t,e=()=>!0){
const n=new Map,o=new Map;for(const s of t.nodes)n.set(s,[]),o.set(s,[]);for(const s of t.edges)e(s)&&(o.get(s.src).push(
s.dst),n.get(s.dst).push(s.src));return{preds:n,succs:o}}c(bn,"buildPredecessorSuccessorMaps");function Eo(t,e,n,o){let s=0;
for(const i of t.nodes)o?.skipGroups&&t.nodeById.get(i)?.isGroup||(s=Math.max(s,n[i]??0));const r=Array.from({length:s+1},
()=>[]);for(const i of e)o?.skipGroups&&t.nodeById.get(i)?.isGroup||r[Math.max(0,n[i]??0)].push(i);return r}c(Eo,"buildL\
ayersFromRanks");function $e(t){const e=xn(t),n=Ao(t,e),o=[],s=wo(t);for(;n.length;){const r=n.shift();o.push(r);for(const i of s.
get(r)??[])if(e.set(i,(e.get(i)??0)-1),(e.get(i)??0)===0){let a=0;for(;a<n.length&&n[a]<i;)a++;n.splice(a,0,i)}}return o.
length===t.nodes.length?o:null}c($e,"topoSortIfAcyclic");function De(t){const e=new Map;let n=0;for(const o of t)e.set(o,
n),n++;return e}c(De,"buildLayerIndex");function To(t){const e=new Array(t.length),n=c((o,s)=>{if(s-o<=1)return 0;const r=o+
s>>1;let i=n(o,r)+n(r,s),a=o,h=r,g=o;for(;a<r||h<s;)h>=s||a<r&&t[a]<=t[h]?e[g++]=t[a++]:(e[g++]=t[h++],i+=r-a);for(let x=o;x<
s;x++)t[x]=e[x];return i},"count");return n(0,t.length)}c(To,"countInversions");function Ws(t){const e=Ae(t),n=new Map;for(const d of e.
nodes)n.set(d,[]);for(const d of e.edges)n.get(d.src).push(d);for(const d of n.values())d.sort((b,l)=>b.dst===l.dst?b.id.
localeCompare(l.id):b.dst.localeCompare(l.dst));const o=Object.create(null);for(const d of e.nodes)o[d]=0;const s=[],r=c(
d=>{o[d]=1;for(const b of n.get(d)??[]){const l=b.dst;o[l]===0?r(l):o[l]===1&&s.push(b)}o[d]=2},"dfs"),i=xn(e),a=[...e.nodes.
filter(d=>(i.get(d)??0)===0),...e.nodes.filter(d=>(i.get(d)??0)!==0)];for(const d of a)o[d]===0&&r(d);const h=new Set(s.
map(d=>`${d.id}:${d.src}->${d.dst}`)),g=e.edges.map(d=>h.has(`${d.id}:${d.src}->${d.dst}`)?{id:d.id,src:d.dst,dst:d.src,
weight:d.weight,ref:d.ref}:d);return{acyclic:{nodes:[...e.nodes],edges:g,layout:e.layout,nodeById:new Map(e.nodeById)},reversed:s}}
c(Ws,"removeCycles_DFS");function Ks(t){const e=ue(t.layout.nodes??[]),n=new Map;for(const o of t.nodes)n.set(o,e.laneIdOf(
o));return n}c(Ks,"buildTopLaneMap");function be(t){const e=Ks(t);return n=>e.get(n)??null}c(be,"createTopLaneResolver");
function Mn(t){const e=t.layout.nodes??[],n=ue(e),o=e.filter(i=>n.isLane(i.id)),s=o.filter(i=>en(i)!==void 0);if(s.length>
0&&s.length===o.length)return[...s].sort((i,a)=>(en(i)??0)-(en(a)??0)).map(i=>i.id);if(!n.hasPools)return[...new Set(o.map(
i=>i.id))].reverse();const r=[];for(const i of e)i.parentId||(n.isPool(i.id)?r.push(...n.lanesByPool.get(i.id)??[]):n.isLane(
i.id)&&r.push(i.id));return[...new Set(r)].reverse()}c(Mn,"buildTopLaneOrder");function Ro(t,e){const n=Mn(t);if(!e||e.length===
0)return n;const o=new Set(n),s=new Set,r=[];for(const i of e)!o.has(i)||s.has(i)||(s.add(i),r.push(i));for(const i of n)
s.has(i)||r.push(i);return r}c(Ro,"resolveTopLaneOrder");function qs(t,e){const n=Ae(t),o=e?.laneOf??(()=>null),s=e?.rankHint,
{preds:r}=bn(n);for(const y of r.values())y.sort((I,w)=>I.localeCompare(w));const i=$e(n)??[...n.nodes].sort((y,I)=>y.localeCompare(
I)),a=new Map;for(const[y,I]of i.entries())a.set(I,y);const h=new Map,g=new Map;for(const y of n.nodes)g.set(y,[]);for(const y of i){
const I=(r.get(y)??[]).filter(w=>h.has(w));if(I.length>0){const w=Zs(y,I,{laneOf:o,rankHint:s,topoIndex:a});h.set(y,w),g.
get(w).push(y)}else h.has(y)||h.set(y,null)}for(const y of n.nodes)h.has(y)||h.set(y,null);const x=new Set;for(const y of n.
nodes)(h.get(y)??null)===null&&x.add(y);const d=[...x].sort((y,I)=>{const w=a.get(y)??0,E=a.get(I)??0;return w===E?y.localeCompare(
I):w-E}),b=Js(n),l=new Map;for(const[y,I]of b.entries())l.set(y,[...I].sort((w,E)=>w.localeCompare(E)));const p=Qs(l),f=tr(
l),m=new Map;for(const y of n.nodes)m.set(y,[]);for(const y of f)for(const I of y.nodes){const w=m.get(I);w?w.push(y.id):
m.set(I,[y.id])}const S=[],M=[],L=new Set,v=c(y=>{if(!L.has(y)){L.add(y),S.push(y);for(const I of g.get(y)??[])v(I);M.push(
y)}},"walk");for(const y of d)v(y);for(const y of i)v(y);return{parent:h,children:g,roots:d,componentOf:p,blocks:f,nodeBlocks:m,
adjacency:l,preorder:S,postorder:M,topologicalOrder:i}}c(qs,"buildDrivingTree");function Zs(t,e,n){const o=n.laneOf(t);return[
...e].sort((r,i)=>{const a=n.laneOf(r),h=n.laneOf(i),g=a!=null&&a===o,x=h!=null&&h===o;if(g!==x)return g?-1:1;const d=n.
rankHint?.[r],b=n.rankHint?.[i];if(d!=null&&b!=null&&d!==b)return b-d;const l=n.topoIndex.get(r)??0,p=n.topoIndex.get(i)??
0;return l!==p?l-p:r.localeCompare(i)})[0]}c(Zs,"chooseParent");function Js(t){const e=new Map;for(const n of t.nodes)e.
set(n,new Set);for(const n of t.edges)e.get(n.src).add(n.dst),e.get(n.dst).add(n.src);return e}c(Js,"buildAdjacency");function Qs(t){
const e=new Map;let n=0;for(const o of t.keys()){if(e.has(o))continue;const s=[o];for(;s.length>0;){const r=s.pop();if(!e.
has(r)){e.set(r,n);for(const i of t.get(r)??[])e.has(i)||s.push(i)}}n++}return e}c(Qs,"assignComponents");function tr(t){
const e=new Map,n=new Map,o=[],s=[];let r=0;const i=c((a,h)=>{e.set(a,++r),n.set(a,r);for(const g of t.get(a)??[])g!==h&&
(e.has(g)?(e.get(g)??0)<(e.get(a)??0)&&(o.push([a,g]),n.set(a,Math.min(n.get(a)??r,e.get(g)??r))):(o.push([a,g]),i(g,a),
n.set(a,Math.min(n.get(a)??r,n.get(g)??r)),(n.get(g)??0)>=(e.get(a)??0)&&s.push(er(a,g,o,s.length))))},"visit");for(const a of t.
keys())e.has(a)||i(a,null);return s}c(tr,"computeBlocks");function er(t,e,n,o){const s=[],r=new Set;for(;n.length>0;){const i=n.
pop();if(s.push(i),r.add(i[0]),r.add(i[1]),i[0]===t&&i[1]===e||i[0]===e&&i[1]===t)break}return{id:o,edges:s,nodes:[...r]}}
c(er,"popBlock");function nr(t,e,n){const o=[...t.nodes],s=new Map;for(const[M,L]of o.entries())s.set(L,M);const r=o.length,
i=new Array(r).fill(-1),a=new Array(r).fill(0),h=[],g=new Set;for(const M of o){const L=n.parent.get(M)??null,v=s.get(M);
v!=null&&L==null&&(i[v]=-1,a[v]=0,g.has(M)||(g.add(M),h.push(M)))}for(;h.length>0;){const M=h.shift(),L=s.get(M);if(L==null)
continue;const v=n.children.get(M)??[];for(const y of v){if(g.has(y))continue;const I=s.get(y);I!=null&&(i[I]=L,a[I]=a[L]+
1,g.add(y),h.push(y))}}for(const M of o){if(g.has(M))continue;const L=s.get(M);L!=null&&(i[L]=-1,a[L]=0,g.add(M))}const x=Math.
max(1,Math.ceil(Math.log2(Math.max(1,r)))+1),d=Array.from({length:x},()=>new Array(r).fill(-1));for(let M=0;M<r;M++)d[0][M]=
i[M];for(let M=1;M<x;M++)for(let L=0;L<r;L++){const v=d[M-1][L];d[M][L]=v===-1?-1:d[M-1][v]}const b=c((M,L)=>{if(M===-1||
L===-1)return-1;a[M]<a[L]&&([M,L]=[L,M]);const v=a[M]-a[L];for(let y=0;y<x;y++)if(v>>y&1&&(M=d[y][M],M===-1))return-1;if(M===
L)return M;for(let y=x-1;y>=0;y--){const I=d[y][M],w=d[y][L];I===-1||w===-1||I!==w&&(M=I,L=w)}return d[0][M]},"lcaIndex"),
l=Array.from({length:r},()=>new Map);for(const M of t.edges){let L=M.src,v=M.dst,y=e[L],I=e[v];if(y==null||I==null||(y>I&&
([L,v]=[v,L],[y,I]=[I,y]),y==null||I==null||y===I))continue;const w=s.get(L),E=s.get(v);if(w==null||E==null)continue;const B=b(
w,E);if(B===-1)continue;const D=l[B];for(let N=y;N<I;N++)D.set(N,(D.get(N)??0)+1)}const p=new Map,f=c((M,L)=>{if(L.size!==
0)for(const[v,y]of L)M.set(v,(M.get(v)??0)+y)},"mergeInto"),m=new Set,S=c(M=>{const L=s.get(M);m.add(M);const v=L==null?
void 0:l[L],y=v?new Map(v):new Map,I=n.children.get(M)??[];for(const w of I){const E=S(w),B=e[M];if(B!=null){let D=p.get(
M);D||(D=new Map,p.set(M,D));let N=E.get(B)??0;const H=e[w];H!=null&&H>B&&(N+=1),D.set(w,N)}f(y,E)}return y},"dfs");for(const M of n.
roots)m.has(M)||S(M);for(const M of o)m.has(M)||S(M);return p}c(nr,"computeSubtreeCrossCounts");function or(t,e,n){const o=new Map,
s=c(r=>{let i=n[r]??0;const a=[...e.get(r)??[]];a.sort(Oo(n));for(const h of a){s(h);const g=o.get(h);g!=null&&(i=Math.min(
i,g))}o.set(r,i)},"annotate");for(const r of t)s(r);return o}c(or,"annotateMinimumLayers");function Oo(t){return(e,n)=>{
const o=t[e]??0,s=t[n]??0;return o===s?e.localeCompare(n):o-s}}c(Oo,"compareByRankThenId");function sr(t,e,n,o){let s=0;
for(const h of e){const g=n[h]??0;g>s&&(s=g)}const r=Array.from({length:s+1},()=>[]),i=new Set,a=c(h=>{if(i.has(h))return;
i.add(h);const g=n[h]??0;r[g]||(r[g]=[]),r[g].push(h);for(const x of o(h))a(x)},"emit");for(const h of t)a(h);for(const h of e)
if(!i.has(h)){const g=n[h]??0;r[g]||(r[g]=[]),r[g].push(h),i.add(h)}return r}c(sr,"emitNodesInTreeOrder");function rr(t){
const e=[];for(const n of t){const o=new Set,s=[];for(const r of n)o.has(r)||(o.add(r),s.push(r));e.push(s)}return e}c(rr,
"deduplicateLayers");function ir(t,e,n,o){return s=>{const r=t.get(s)??[];if(r.length===0)return[];const i=e[s]??0,a=[],
h=[],g=n.get(s);for(const x of r){const d=o.get(x)??i;d>i?a.push({child:x,min:d}):h.push(x)}return a.sort((x,d)=>x.min===
d.min?x.child.localeCompare(d.child):x.min-d.min),h.sort((x,d)=>{const b=g?.get(x)??0,l=g?.get(d)??0;if(b!==l)return b-l;
const p=o.get(x)??i,f=o.get(d)??i;return p!==f?p-f:x.localeCompare(d)}),[...a.map(x=>x.child),...h]}}c(ir,"createChildOr\
derer");function gn(t,e,n){const o=qs(t,{rankHint:e,laneOf:n}),{children:s,roots:r}=o;for(const d of t.nodes)s.has(d)||s.
set(d,[]);const i=nr(t,e,o),a=[...r].sort(Oo(e)),h=or(a,s,e),g=ir(s,e,i,h);let x=sr(a,t.nodes,e,g);return x=rr(x),x}c(gn,
"buildMultitreeLayerOrder");function cr(t,e,n){const o=new Set(t),s=new Set(e),r=De(e),i=[];for(const a of n)o.has(a.src)&&
s.has(a.dst)&&i.push(r.get(a.dst));return To(i)}c(cr,"countCrossingsBetweenAdjacent");function no(t,e,n){const o=[];for(const r of e){
const i=n[r.src],a=n[r.dst];if(i==null||a==null||i===a)continue;let h=r.src,g=r.dst,x=i,d=a;i>a&&(h=r.dst,g=r.src,x=a,d=
i);for(let b=x;b<d;b++)o.push({id:`${r.id}@${b}`,src:h,dst:g,ref:r.ref})}let s=0;for(let r=0;r+1<t.length;r++)s+=cr(t[r],
t[r+1],o);return s}c(no,"totalCrossings");function ar(t,e){const n={...e},{preds:o}=bn(t),s=be(t),r=gn(t,n,s);let i=no(r,
t.edges,n);const a=hn.MAX_CROSSING_OPTIMIZATION_PASSES;for(let h=0;h<a;h++){let g=!1;const x=[...t.nodes].sort((d,b)=>(n[b]??
0)-(n[d]??0));for(const d of x){const b=n[d]??0;if(b===0)continue;let l=0;for(const S of o.get(d)??[])l=Math.max(l,(n[S]??
0)+1);if(l>=b)continue;const p=b;n[d]=l;const f=gn(t,n,s),m=no(f,t.edges,n);m<i?(i=m,g=!0):n[d]=p}if(!g)break}return n}c(
ar,"optimizeRanksByCrossings");function lr(t,e){const n=be(t),o=[...t.nodes].sort((s,r)=>(e[s]??0)-(e[r]??0)||s.localeCompare(
r));for(const s of o){const r=n(s);if(!r)continue;const i=t.edges.filter(f=>f.src===s);if(i.length===0)continue;let a=!1,
h=0;for(const f of i){const m=n(f.dst);m==null||m===r?a=!0:h++}if(h===0||a)continue;let g=0,x=!1;for(const f of t.edges){
if(f.dst!==s)continue;const m=n(f.src);m&&(m===r?x=!0:g++)}if(g>0||!x)continue;const d=e[s]??0,b=d+h;let l=0;for(const f of t.
edges)f.dst===s&&(l=Math.max(l,(e[f.src]??0)+1));const p=Math.max(d,l,b);p!==d&&(e[s]=p)}}c(lr,"adjustCrossLaneSources");
function fr(t,e){const n=Ae(t),o=$e(n)??[...n.nodes].sort(),s=e?.compactSingleInput??!1,r=be(n);let i=Object.create(null);
for(const h of o){const g=Lo(n,h),x=e?.ignoreCrossLaneEdges?g.filter(d=>{const b=r(d.src),l=r(h);return!b||!l?!0:b===l}):
g;if(x.length===0)i[h]=0;else if(s&&x.length===1){const d=x[0].src,b=r(d),l=r(h);b!==l?i[h]=i[d]??0:i[h]=(i[d]??0)+1}else{
let d=-1/0;for(const b of x)d=Math.max(d,(i[b.src]??0)+1);i[h]=d===-1/0?0:d}}return(e?.optimizeRanksByCrossings??!1)&&(i=
ar(n,i)),e?.ignoreCrossLaneEdges&&lr(n,i),{layers:gn(n,i,r),rankOf:i,dummy:new Set}}c(fr,"assignLayers_LongestPath");function dr(t,e){
const n=Ae(t),s={...fr(n,{compactSingleInput:e?.compactSingleInput,ignoreCrossLaneEdges:e?.ignoreCrossLaneEdges,optimizeRanksByCrossings:e?.
optimizeRanksByCrossings}).rankOf},r=be(n),{preds:i,succs:a}=bn(n,p=>{if(e?.ignoreCrossLaneEdges){const f=r(p.src),m=r(p.
dst);if(f&&m&&f!==m)return!1}return!0}),h=$e(n)??[...n.nodes],g=[...h].reverse(),x=c((p,f)=>{let m=0;for(const L of i.get(
p)??[])m=Math.max(m,(s[L]??0)+1);let S=Number.POSITIVE_INFINITY;const M=a.get(p)??[];return M.length>0&&(S=Math.min(...M.
map(L=>(s[L]??0)-1))),Number.isFinite(S)||(S=Math.max(m,f)),Math.min(Math.max(f,m),S)},"clampFeasible"),d=hn.GRAVITY_ITERATIONS,
b=c(p=>{let f=!1;for(const m of p){const S=i.get(m)??[],M=a.get(m)??[];if(S.length===0&&M.length===0)continue;const L=S.
length>0?S.reduce((w,E)=>w+(s[E]??0)+1,0)/S.length:s[m]??0,v=M.length>0?M.reduce((w,E)=>w+(s[E]??0)-1,0)/M.length:s[m]??
0,y=Math.round((L+v)/2),I=x(m,y);I!==s[m]&&(s[m]=I,f=!0)}return f},"relaxOrder");for(let p=0;p<d;p++){const f=b(h),m=b(g);
if(!f&&!m)break}for(const p of h){let f=0;for(const m of i.get(p)??[])f=Math.max(f,(s[m]??0)+1);(s[p]??0)<f&&(s[p]=f)}for(const p of g){
const f=a.get(p)??[];if(f.length>0){const m=Math.min(...f.map(S=>(s[S]??0)-1));(s[p]??0)>m&&(s[p]=m)}}return{layers:Eo(n,
h,s),rankOf:s,dummy:new Set}}c(dr,"assignLayers_Gravity");function ur(t){const e=xn(t),n=wo(t);let o=Ao(t,e);const s=[];
for(;o.length>0;){const r=[];for(const i of o){s.push(i);for(const a of n.get(i)??[])e.set(a,(e.get(a)??0)-1),(e.get(a)??
0)===0&&r.push(a)}o=r.sort((i,a)=>i.localeCompare(a))}return s.length===t.nodes.length?s:null}c(ur,"topoSortByGeneration\
IfAcyclic");function hr(t,e){const n=Ae(t),o=e?.direction==="LR"?ur(n)??[...n.nodes].sort():$e(n)??[...n.nodes].sort(),s=be(
n),r=c(x=>s(x)??x,"laneOf"),i=Object.create(null),a=new Map,h=c((x,d)=>e?.ignoreCrossLaneEdges??!0?r(x)===r(d)?1:0:1,"ed\
geWeight");for(const x of o){if(n.nodeById.get(x)?.isGroup)continue;const b=Lo(n,x);let l=0;if(b.length>0)for(const S of b){
const M=S.src,L=i[M]??0;l=Math.max(l,L+h(M,x))}const p=r(x),f=a.get(p)??0,m=Math.max(l,f);i[x]=m,a.set(p,m+1)}return{layers:Eo(
n,o,i,{skipGroups:!0}),rankOf:i,dummy:new Set}}c(hr,"assignLayers_LaneAwareCompact");function gr(t,e){const n=Ae(e),{rankOf:o}=t,
s=t.layers.map(l=>[...l]),r=new Set(t.dummy?[...t.dummy]:[]);let i=0;const a=new Map(n.nodeById),h=c(l=>{const p=`placeh\
older-${i++}`,f={id:p,isGroup:!1,isDummy:!0,width:0,height:0};for(a.set(p,f),r.add(p);s.length<=l;)s.push([]);return s[l].
push(p),o[p]=l,p},"addDummyAt"),g=[...n.edges].sort((l,p)=>l.id===p.id?l.src===p.src?l.dst.localeCompare(p.dst):l.src.localeCompare(
p.src):l.id.localeCompare(p.id)),x=[];for(const l of g){const p=o[l.src]??0,f=o[l.dst]??0;if(f-p<=1){x.push(l);continue}
let m=l.src;for(let M=p+1,L=0;M<f;M++,L++){const v=h(M);x.push({id:`${l.id}#${L}`,src:m,dst:v,weight:l.weight,ref:l.ref}),
m=v}const S=f-p-2;x.push({id:`${l.id}#${Math.max(S+1,0)}`,src:m,dst:l.dst,weight:l.weight,ref:l.ref})}const b={nodes:[...n.
nodes,...[...r].filter(l=>!n.nodes.includes(l))],edges:x,layout:n.layout,nodeById:a};return{layering:{layers:s,rankOf:o,
dummy:r},graphWithDummies:b}}c(gr,"makeProperLayering");function oo(t){const e=t.length;if(e===0)return Number.POSITIVE_INFINITY;
const n=[...t].sort((o,s)=>o-s);return e%2===1?n[(e-1)/2]:.5*(n[e/2-1]+n[e/2])}c(oo,"median");function so(t){return t.length===
0?Number.POSITIVE_INFINITY:t.reduce((n,o)=>n+o,0)/t.length}c(so,"barycenter");function pr(t,e,n,o){const s=new Map;for(const r of t)
s.set(r,[]);for(const r of n)o==="down"?e.has(r.src)&&s.has(r.dst)&&s.get(r.dst).push(e.get(r.src)):e.has(r.dst)&&s.has(
r.src)&&s.get(r.src).push(e.get(r.dst));return s}c(pr,"neighborPositionsFor");function mr(t,e,n){const o=n.get(t)??0,s=n.
get(e)??0;return o!==s?o-s:t.localeCompare(e)}c(mr,"currentOrderTieBreak");function ro(t,e,n){const o=new Set(t),s=new Set(
e),r=De(t),i=De(e),a=[];for(const g of n)o.has(g.src)&&s.has(g.dst)&&a.push({u:r.get(g.src),v:i.get(g.dst)});a.sort((g,x)=>g.
u===x.u?g.v-x.v:g.u-x.u);const h=a.map(g=>g.v);return To(h)}c(ro,"countCrossingsBetweenAdjacent");function on(t,e,n){return[
...t].sort((o,s)=>{const r=oo(e.get(o)??[]),i=oo(e.get(s)??[]);return r===i?mr(o,s,n):isFinite(r)?isFinite(i)?r-i:-1:1})}
c(on,"sortByHeuristic");function io(t,e,n,o,s,r){const i=De(t),a=De(e),h=pr(e,i,n,o);if(!s||!r||r.length===0)return on(e,
h,a);const g=new Map;for(const b of e){const l=s(b),p=g.get(l)??[];p.push(b),g.set(l,p)}const x=[];for(const b of r){const l=g.
get(b);if(!l||l.length===0)continue;const p=on(l,h,a);x.push(...p)}const d=g.get(null);if(d&&d.length>0){const b=on(d,h,
a);for(const l of b){const p=so(h.get(l)??[]);let f=x.length;if(isFinite(p))for(const[m,S]of x.entries()){const M=so(h.get(
S)??[]);if(p<M){f=m;break}}x.splice(f,0,l)}}return x}c(io,"reorderLayer");function co(t,e,n,o,s){const r=[...e],i=new Set(
t),a=new Set(e),h=o?new Set(o):null,g=n.filter(f=>i.has(f.src)&&a.has(f.dst)),x=h?n.filter(f=>a.has(f.src)&&h.has(f.dst)):
void 0,d=c(f=>{let m=ro(t,f,g);return x&&o&&(m+=ro(f,o,x)),m},"crossingScore"),b=s?new Map:null;if(s&&b)for(const f of e)
b.set(f,s(f));let l=!0,p=d(r);for(;l;){l=!1;for(let f=0;f+1<r.length;f++){if(b){const M=b.get(r[f]),L=b.get(r[f+1]);if(M!==
L)continue}const m=p;[r[f],r[f+1]]=[r[f+1],r[f]];const S=d(r);S<m?(p=S,l=!0):[r[f],r[f+1]]=[r[f+1],r[f]]}}return r}c(co,
"transposeImprove");function yr(t,e,n){const o=t.layers.map(a=>[...a]),s=e.edges,r=be(e),i=Ro(e,n?.laneOrder);for(let a=0;a<
3;a++){for(let h=1;h<o.length;h++)o[h]=io(o[h-1],o[h],s,"down",r,i),o[h]=co(o[h-1],o[h],s,o[h+1],r);for(let h=o.length-2;h>=
0;h--)o[h]=io(o[h+1],o[h],s,"up",r,i),o[h]=co(o[h+1],o[h],s,o[h-1],r)}return{layers:o}}c(yr,"orderLayers");function xr(t,e,n){
const o=n?.layerGap??En.DEFAULT_LAYER_GAP,s=n?.nodeGap??En.DEFAULT_NODE_GAP,r=n?.laneGap??s*2,i=n?.direction??"TB",a=i===
"LR"||i==="RL",h=Object.create(null),g=Object.create(null),x=new Map((e.layout?.nodes??[]).filter(k=>k.isEdgeLabel).map(
k=>[k.id,k])),d=c(k=>x.get(k)??e.nodeById.get(k),"getNode"),b=c(k=>d(k)?.width??0,"getWidth"),l=c(k=>d(k)?.height??0,"ge\
tHeight"),p=be(e),f=new Map,m=c(k=>f.has(k)?f.get(k)??null:p(k),"topLaneOf"),S=Ro(e,n?.laneOrder),M=new Set;for(const k of t.
layers)for(const G of k)M.add(p(G));const L=M.has(null),v=S.filter(k=>M.has(k)),y=[...L?[null]:[],...v],I=t.layers,w=new Map;
for(const[k,G]of I.entries())for(const Q of G)w.set(Q,k);const E=[],B=[],D=[];for(const k of e.layout?.edges??[]){const G=k.
labelNodeId,Q=k.start,K=k.end;if(!G||!x.has(G)||Q==null||K==null)continue;const st=w.get(Q),dt=w.get(K);if(st==null||dt==
null){D.push({labelId:G,near:st==null?K:Q});continue}if(f.set(G,p(K)),st===dt){const xt=c(Pt=>y.indexOf(p(Pt)),"column");
E.push({labelId:G,rank:dt,lane:p(K),side:Q!==K&&xt(Q)<xt(K)?"before":"after"});continue}const gt=Math.min(st,dt),pt=Math.
max(st,dt);B.push({labelId:G,start:Q,end:K,gap:gt+Math.floor((pt-gt-1)/2),crossesLanes:p(Q)!==p(K)})}const N=I.map(k=>k.
reduce((G,Q)=>Math.max(G,l(Q)),0));for(const{labelId:k,rank:G}of E)N[G]=Math.max(N[G],l(k));const H=I.map(()=>0);if(a)for(let k=0;k+
1<I.length;k++){const G=I[k].reduce((pt,xt)=>Math.max(pt,b(xt)),0),Q=I[k+1].reduce((pt,xt)=>Math.max(pt,b(xt)),0),K=N[k],
st=N[k+1],dt=K/2+st/2,gt=(G+Q)/2;H[k]=Math.max(0,gt-dt-o)}const U=a?vo(e.layout?.nodes??[]):1,Z=I.map(()=>0);for(const{labelId:k,
gap:G}of B){const K=((a?b(k):l(k))+2*En.EDGE_LABEL_CLEARANCE)/U;Z[G]=Math.max(Z[G],K)}for(const[k,G]of Z.entries())H[k]+=
G;const tt=Object.create(null);for(const k of v)tt[k]=0;L&&(tt.null=0);for(const k of I){const G=Object.create(null),Q=[];
for(const K of k){const st=m(K);st===null?Q.push(K):(G[st]||=[]).push(K)}for(const[K,st]of Object.entries(G)){const dt=st.
reduce((gt,pt)=>gt+b(pt),0)+s*Math.max(0,st.length-1);tt[K]=Math.max(tt[K]??0,dt)}if(L&&Q.length){const K=Q.reduce((st,dt)=>st+
b(dt),0)+s*Math.max(0,Q.length-1);tt.null=Math.max(tt.null??0,K)}}const at=new Map;for(const k of B){const G=`${k.gap}:${m(
k.labelId)}`,Q=at.get(G);Q?Q.push(k):at.set(G,[k])}for(const k of at.values()){const G=m(k[0].labelId);if(G!==null){const Q=k.
reduce((K,st,dt)=>K+b(st.labelId)+(dt>0?s:0),0);tt[G]=Math.max(tt[G]??0,Q)}}const ht=new Map;for(const{labelId:k,rank:G,
lane:Q,side:K}of E){const st=`${G}:${Q}:${K}`;ht.set(st,(ht.get(st)??0)+s+b(k))}const Et=c((k,G,Q)=>ht.get(`${k}:${G}:${Q}`)??
0,"rowLabelSpan");for(const{rank:k,lane:G}of E){const Q=I[k].filter(dt=>m(dt)===G).reduce((dt,gt,pt)=>dt+b(gt)+(pt>0?s:0),
0),K=Math.max(Et(k,G,"before"),Et(k,G,"after")),st=G??"null";tt[st]=Math.max(tt[st]??0,Q+2*K)}const ce=new Map;{const k=y.
map(K=>(K===null?tt.null:tt[K])??0);let Q=-(k.reduce((K,st)=>K+st,0)+r*Math.max(0,y.length-1))/2;for(let K=0;K<y.length;K++){
const st=y[K],dt=k[K]??0,gt=Q+dt/2;ce.set(st,gt),Q+=dt,K<y.length-1&&(Q+=r)}}const $t=[];let Vt=0;for(const[k,G]of I.entries()){
const Q=N[k]??0,K=new Map;for(const dt of G){const gt=m(dt),pt=K.get(gt)??[];pt.push(dt),K.set(gt,pt)}for(const dt of y){
const gt=K.get(dt)??[];if(gt.length===0)continue;const pt=ce.get(dt);if(gt.length===1){const xt=gt[0];h[xt]=pt,g[xt]=Vt+
Q/2}else{const xt=gt.map(me=>b(me)),Pt=xt.reduce((me,ye)=>me+ye,0)+s*(gt.length-1);let Ee=pt-Pt/2;for(const[me,ye]of gt.
entries()){const Te=xt[me];h[ye]=Ee+Te/2,g[ye]=Vt+Q/2,Ee+=Te+s}}}const st=o+(H[k]??0);$t[k]=Vt+Q+st/2,Vt+=Q+st}const J=new Map;
for(const{labelId:k,rank:G,lane:Q,side:K}of E){const st=`${G}:${Q}:${K}`;if(!J.has(st)){const xt=I[G].filter(Pt=>m(Pt)===
Q).map(Pt=>K==="before"?h[Pt]-b(Pt)/2:h[Pt]+b(Pt)/2);J.set(st,K==="before"?Math.min(...xt):Math.max(...xt))}const dt=b(k),
gt=J.get(st)+(K==="before"?-1:1)*(s+dt/2);h[k]=gt,g[k]=g[I[G].find(pt=>m(pt)===Q)],J.set(st,gt+(K==="before"?-1:1)*(dt/2))}
for(const k of at.values()){const G=k.map(({start:pt,end:xt,crossesLanes:Pt})=>Pt?h[xt]:((h[pt]??0)+(h[xt]??0))/2),Q=k.map(
(pt,xt)=>xt).sort((pt,xt)=>G[pt]-G[xt]||pt-xt),K=[];let st=-1/0;for(const pt of Q){const xt=b(k[pt].labelId);K[pt]=Math.
max(G[pt],st+s+xt/2),st=K[pt]+xt/2}const dt=c(pt=>pt.reduce((xt,Pt)=>xt+Pt,0)/pt.length,"mean"),gt=dt(G)-dt(K);for(const[
pt,{labelId:xt,gap:Pt}]of k.entries())h[xt]=K[pt]+gt,g[xt]=$t[Pt]}for(const{labelId:k,near:G}of D)h[k]=h[G]??0,g[k]=g[G]??
0;const lt=new Map;for(const k of e.edges){const G=k.ref.id;lt.has(G)||lt.set(G,[]),lt.get(G).push(k)}for(const[,k]of lt){
if(k.length===0)continue;const G=k[0].ref,Q=G.start,K=G.end;if(Q==null||K==null)continue;const st=Math.round(((h[Q]??0)+
(h[K]??0))/2),dt=new Set;for(const gt of k)dt.add(gt.src),dt.add(gt.dst);for(const gt of dt){if(gt===Q||gt===K)continue;
e.nodeById.get(gt)?.isDummy&&(h[gt]=st)}}return{x:h,y:g}}c(xr,"assignCoordinates");var br=8;function Mr(t){let e=2166136261;
for(let n=0;n<t.length;n++)e^=t.charCodeAt(n),e=Math.imul(e,16777619);return e>>>0}c(Mr,"hashString");function Ir(t){let e=t>>>
0;return()=>{e+=1831565813;let n=e;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}
c(Ir,"mulberry32");function Sr(t,e){const n=[...t],o=Ir(e);for(let s=n.length-1;s>0;s--){const r=Math.floor(o()*(s+1));[
n[s],n[r]]=[n[r],n[s]]}return n}c(Sr,"deterministicShuffle");function Cr(t,e){let n=0;for(const[o,s]of t.entries())n+=Math.
abs(o-(e.get(s)??o));return n}c(Cr,"sourceDistance");function ao(t,e){const n=new Map;for(const[s,r]of t.entries())n.set(
r,s);let o=0;for(const{a:s,b:r,weight:i}of e){const a=n.get(s),h=n.get(r);a==null||h==null||(o+=i*Math.abs(a-h))}return o}
c(ao,"laneArrangementCost");function vr(t){const e=Mn(t);if(e.length<2)return[];const n=new Map(e.map((r,i)=>[r,i])),o=be(
t),s=new Map;for(const r of t.layout.edges??[]){if(r.isLayoutOnly)continue;const i=typeof r.start=="string"?r.start:void 0,
a=typeof r.end=="string"?r.end:void 0;if(!i||!a||!t.nodeById.has(i)||!t.nodeById.has(a))continue;const h=o(i),g=o(a);if(!h||
!g||h===g)continue;const x=n.get(h),d=n.get(g);if(x==null||d==null)continue;const[b,l]=x<=d?[h,g]:[g,h],p=`${b}\0${l}`,f=s.
get(p);f?f.weight++:s.set(p,{a:b,b:l,weight:1})}return[...s.values()]}c(vr,"buildWeightedLaneEdges");function lo(t,e,n){
const o=[...t];let s=ao(o,e),r=!0,i=0;const a=Math.max(1,o.length);for(;r&&i<a;){r=!1,i++;for(let h=0;h+1<o.length;h++){
[o[h],o[h+1]]=[o[h+1],o[h]];const g=ao(o,e);g<s?(s=g,r=!0):[o[h],o[h+1]]=[o[h+1],o[h]]}}return{order:o,cost:s,sourceDistance:Cr(
o,n)}}c(lo,"greedySwitch");function Lr(t,e){return t.cost!==e.cost?t.cost<e.cost:t.sourceDistance<e.sourceDistance}c(Lr,
"isBetterCandidate");function wr(t,e,n){const o=[...e].sort((s,r)=>s.a===r.a?s.b.localeCompare(r.b):s.a.localeCompare(r.
a)).map(({a:s,b:r,weight:i})=>`${s}:${r}:${i}`).join("|");return Mr(`${t.join("|")}#${o}#${n}`)}c(wr,"seedForRestart");function Ar(t,e={}){
const n=Mn(t);if(n.length<2)return n;const o=vr(t);if(o.length===0)return n;const s=new Map(n.map((a,h)=>[a,h]));let r=lo(
n,o,s);const i=Math.max(0,e.restarts??br);for(let a=0;a<i;a++){const h=wr(n,o,a),g=Sr(n,h),x=lo(g,o,s);Lr(x,r)&&(r=x)}return r.
order}c(Ar,"optimizeTopLaneOrder");function Er(t,e){const n=e?.ignoreCrossLaneEdges??!0,o=e?.optimizeRanksByCrossings??!0,
s=Ae(t),r=e?.automaticLaneOrdering?Ar(s,{restarts:br}):void 0,i=Ws(s),a=i.acyclic,h=n?hr(a,{compactSingleInput:e?.compactSingleInput??
hn.DEFAULT_COMPACT_SINGLE_INPUT,ignoreCrossLaneEdges:!0,direction:e?.direction}):dr(a,{compactSingleInput:e?.compactSingleInput??
hn.DEFAULT_COMPACT_SINGLE_INPUT,ignoreCrossLaneEdges:!1,optimizeRanksByCrossings:o}),{layering:g,graphWithDummies:x}=gr(
h,a),d=yr(g,x,{laneOrder:r}),b=xr(d,x,{layerGap:e?.layerGap,nodeGap:e?.nodeGap,direction:e?.direction,laneOrder:r});return{
acyclic:a,reversed:i.reversed,layering:g,ordered:d,coordinates:b}}c(Er,"sugiyamaLayout");var mt=si.EPSILON,ai=8,Oe=15,_e=15,
tn=25,le=20,On=10;function fo(t,e,n){const o=t.x??0,s=t.y??0,r=e.x-o,i=e.y-s,a=Math.abs(r),h=Math.abs(i);return a<mt&&h<
mt?n:h>mt&&h*3>=a?i>0?"bottom":"top":a>mt?r>0?"right":"left":n}c(fo,"chooseOrthogonalSide");var Yo=c(t=>typeof t=="numbe\
r"&&Number.isFinite(t)&&t>0,"isDrawableSize");function sn(t,e){const n=t.metadata?.drawnExtent;return{w:Yo(n?.width)?n.width:
t.width??e,h:Yo(n?.height)?n.height:t.height??e}}c(sn,"drawnSize");function uo(t,e){return Math.abs(t.to-e.from)<mt||Math.
abs(t.to-e.to)<mt?t.to:t.from}c(uo,"sharedLineEndpointCoord");function Ne(t,e){return t.orient==="vertical"?{x:t.coord,y:e}:
{x:e,y:t.coord}}c(Ne,"pointOnLine");function Tr(t,e){const n=t.nodes??[],o=t.edges??[],s=[];for(const u of o)u.isLayoutOnly||
s.push({...u,__originalEdge:u});const r=new Map,i=new Map,a=[],h=e==="LR";for(const u of n)r.set(u.id,u);const g=ue(n),x=n.
filter(u=>g.isLane(u.id));for(const u of x){const C={id:u.id},A=c(T=>{i.set(T.id,C),n.filter(R=>R.parentId===T.id).forEach(
A)},"assignLane");A(u)}const d=ze(n),b=n.filter(u=>!u.isGroup&&!u.isEdgeLabel&&!d.has(u.id)).map(u=>{const C=u.width??10,
A=u.height??10,T=u.x??0,R=u.y??0,F=ai;return{nodeId:u.id,minX:T-C/2-F,maxX:T+C/2+F,minY:R-A/2-F,maxY:R+A/2+F,visualXHalfExtent:h?
A/2+F:C/2+F}}),l=c((u,C,A,T)=>{let R=a.find(F=>F.orientation===u&&Math.abs(F.coord-C)<1);return R||(R={id:`pipe-${u}-${C.
toFixed(0)}`,orientation:u,coord:C,spanMin:A,spanMax:T,tracks:[]},a.push(R)),R.spanMin=Math.min(R.spanMin,A),R.spanMax=Math.
max(R.spanMax,T),R},"getOrAddPipe"),p=c((u,C)=>{const{w:A,h:T}=sn(u,10),R=u.x??0,F=u.y??0;switch(C){case"top":return{x:R,
y:F-T/2};case"bottom":return{x:R,y:F+T/2};case"left":return{x:R-A/2,y:F};case"right":return{x:R+A/2,y:F}}},"portForSide"),
f=c((u,C,A)=>p(u,fo(u,C,A?"bottom":"top")),"getOrthogonalPort"),m=[],S=[],M=new Set,L=1e3,v=c((u,C,A)=>{if(m.length===0)
return 0;const T=Math.abs(C.y-A.y)<mt,R=Math.abs(C.x-A.x)<mt;if(!T&&!R)return 0;let F=0;if(T){const q=C.y,ct=Math.min(C.
x,A.x)-mt,j=Math.max(C.x,A.x)+mt;if(j<=ct)return 0;for(const $ of m)$.edgeIndex===u||$.orientation!=="vertical"||$.pipe.
coord<ct||$.pipe.coord>j||$.from-mt<=q&&$.to+mt>=q&&(F+=L)}else if(R){const q=C.x,ct=Math.min(C.y,A.y)-mt,j=Math.max(C.y,
A.y)+mt;if(j<=ct)return 0;for(const $ of m)$.edgeIndex===u||$.orientation!=="horizontal"||$.pipe.coord<ct||$.pipe.coord>
j||$.from-mt<=q&&$.to+mt>=q&&(F+=L)}return F},"crossingPenalty"),y=s.map((u,C)=>{if(!u.start||!u.end)return{idx:C,crossLane:0,
dx:0,dy:0};const A=r.get(u.start),T=r.get(u.end),R=i.get(u.start),F=i.get(u.end),q=R&&F&&R.id!==F.id?1:0,ct=A&&T?Math.abs(
(T.x??0)-(A.x??0)):0,j=A&&T?Math.abs((T.y??0)-(A.y??0)):0;return{idx:C,crossLane:q,dx:ct,dy:j}}).sort((u,C)=>{if(u.crossLane!==
C.crossLane)return C.crossLane-u.crossLane;const A=u.dx+u.dy,T=C.dx+C.dy;return Math.abs(A-T)>1?A-T:u.idx-C.idx}).map(u=>u.
idx),I=c((u,C,A,T)=>{const R=Math.min(u.x,C.x),F=Math.max(u.x,C.x),q=Math.min(u.y,C.y),ct=Math.max(u.y,C.y);return!!b.find(
$=>A&&$.nodeId===A||T&&$.nodeId===T?!1:Math.abs(u.x-C.x)>mt?$.minY<u.y&&$.maxY>u.y&&$.maxX>R&&$.minX<F:$.minX<u.x&&$.maxX>
u.x&&$.maxY>q&&$.minY<ct)},"isSegmentBlocked"),w=new Map,E=new Map;for(const u of s)!u.start||!u.end||u.start===u.end||(E.
set(u.start,(E.get(u.start)??0)+1),E.set(u.end,(E.get(u.end)??0)+1));const B=c((u,C)=>fo(u,C,"bottom"),"determineSide"),
D=new Map;for(const[u,C]of s.entries()){if(!C.start||!C.end||C.start===C.end||C.points&&C.points.length>0)continue;const A=r.
get(C.start),T=r.get(C.end);if(!A||!T)continue;const R=(T.x??0)-(A.x??0),F=(T.y??0)-(A.y??0);D.set(u,{edgeIdx:u,srcId:C.
start,dstId:C.end,srcSide:B(A,{x:T.x??0,y:T.y??0}),dstSide:B(T,{x:A.x??0,y:A.y??0}),absDx:Math.abs(R),absDy:Math.abs(F),
dxSign:Math.sign(R),dySign:Math.sign(F)})}const N=c(u=>u.srcSide==="top"||u.srcSide==="bottom"?u.absDx===0?1/0:u.absDy/u.
absDx:u.absDy===0?1/0:u.absDx/u.absDy,"preferenceStrength"),H=c(u=>u.srcSide==="top"||u.srcSide==="bottom"?u.dxSign===0?
["right","left"]:[u.dxSign>0?"right":"left"]:u.dySign===0?["bottom","top"]:[u.dySign>0?"bottom":"top"],"secondarySides"),
U=c(u=>H(u)[0],"secondarySide"),Z=new Map;for(const u of D.values()){const C=`${u.srcId}:${u.srcSide}`;Z.has(C)||Z.set(C,
[]),Z.get(C).push(u)}const tt=new Map,at=c((u,C)=>`${u}:${C}`,"loadKey");for(const u of D.values())tt.set(at(u.srcId,u.srcSide),
(tt.get(at(u.srcId,u.srcSide))??0)+1),tt.set(at(u.dstId,u.dstSide),(tt.get(at(u.dstId,u.dstSide))??0)+1);for(const u of Z.
values())if(!(u.length<2)){u.sort((C,A)=>{const T=N(C),R=N(A);return Math.abs(T-R)>1e-9?R-T:C.edgeIdx-A.edgeIdx});for(let C=1;C<
u.length;C++){const A=u[C],T=tt.get(at(A.srcId,A.srcSide))??0,R=H(A).reduce((q,ct)=>(tt.get(at(A.srcId,ct))??0)<(tt.get(
at(A.srcId,q))??0)?ct:q),F=tt.get(at(A.srcId,R))??0;F>=T||(tt.set(at(A.srcId,A.srcSide),T-1),tt.set(at(A.srcId,R),F+1),A.
srcSide=R)}}const ht=c(u=>{const C=u?.shape;return C==="question"||C==="diamond"},"isDiamondNode"),Et=new Map;for(const u of D.
values())Et.has(u.dstId)||Et.set(u.dstId,new Set),Et.get(u.dstId).add(u.dstSide);for(const u of D.values()){if(!ht(r.get(
u.srcId)))continue;const C=Et.get(u.srcId);if(!C?.has(u.srcSide))continue;const A=U(u);if(C.has(A)||(tt.get(at(u.srcId,A))??
0)>0)continue;const T=tt.get(at(u.srcId,u.srcSide))??0;tt.set(at(u.srcId,u.srcSide),Math.max(0,T-1)),tt.set(at(u.srcId,A),
1),u.srcSide=A}const ce=c(u=>{const C=u?.shape;return C==="hexagon"||C==="notch-pent"},"hasVertexFaces"),$t=new Map;for(const u of D.
values())$t.has(u.srcId)||$t.set(u.srcId,new Set),$t.get(u.srcId).add(u.srcSide);const Vt=c(u=>u.dstSide==="top"||u.dstSide===
"bottom"?u.dxSign>=0?"left":"right":u.dySign>=0?"top":"bottom","secondaryDstSide");for(const u of D.values()){if(!ce(r.get(
u.dstId)))continue;const C=$t.get(u.dstId);if(!C?.has(u.dstSide))continue;const A=Vt(u);if(C.has(A)||(tt.get(at(u.dstId,
A))??0)>0)continue;const T=tt.get(at(u.dstId,u.dstSide))??0;tt.set(at(u.dstId,u.dstSide),Math.max(0,T-1)),tt.set(at(u.dstId,
A),1),u.dstSide=A;const R=u.dySign>=0?"bottom":"top";if((A==="top"||A==="bottom")&&Et.get(u.srcId)?.has(u.srcSide)&&!Et.
get(u.srcId)?.has(R)&&(tt.get(at(u.srcId,R))??0)===0){const F=tt.get(at(u.srcId,u.srcSide))??0;tt.set(at(u.srcId,u.srcSide),
Math.max(0,F-1)),tt.set(at(u.srcId,R),1),u.srcSide=R}}for(const u of D.values()){const{edgeIdx:C,srcId:A,dstId:T,srcSide:R,
dstSide:F}=u,q=r.get(A),ct=r.get(T),j=`${A}:${R}:src`,$=R==="top"||R==="bottom"?ct.x??0:ct.y??0;w.has(j)||w.set(j,[]),w.
get(j).push({edgeIdx:C,oppositeCoord:$});const Lt=`${T}:${F}:dst`,wt=F==="top"||F==="bottom"?q.x??0:q.y??0;w.has(Lt)||w.
set(Lt,[]),w.get(Lt).push({edgeIdx:C,oppositeCoord:wt})}const J=new Map,lt=8;for(const[u,C]of w){if(C.length<2)continue;
C.sort((Dt,se)=>Dt.oppositeCoord-se.oppositeCoord);const A=u.split(":"),T=A.slice(0,-2).join(":"),R=A[A.length-2],F=A[A.
length-1],q=r.get(T);if(!q)continue;const ct=R==="left"||R==="right",j=sn(q,10),$=ct?j.h:j.w,Lt=q.shape,Tt=Lt==="questio\
n"||Lt==="diamond"?$*.3:$,bt=Math.min(20,Tt/(C.length-1),Math.max(lt,Tt/(C.length+1))),te=-(bt*(C.length-1))/2;for(const[
Dt,se]of C.entries()){const Me=te+Dt*bt,In=`${se.edgeIdx}:${F}`;J.set(In,Me)}}const k=c(u=>!!s[u]?.labelNodeId,"edgeHasL\
abelNode"),G=c((u,C)=>u?(w.get(`${u}:${C}:src`)??[]).some(({edgeIdx:A})=>k(A))||(w.get(`${u}:${C}:dst`)??[]).some(({edgeIdx:A})=>k(
A)):!1,"faceHasLabelNode"),Q=c((u,C,A)=>C==="top"||C==="bottom"?{x:u.x+A,y:u.y}:{x:u.x,y:u.y+A},"applyPortOffset"),K=c((u,C,A)=>{
const T=D.get(u),R={x:A.x??0,y:A.y??0},F={x:C.x??0,y:C.y??0},q=T?.srcSide??B(C,R),ct=T?.dstSide??B(A,F);let j=T?p(C,T.srcSide):
f(C,R,!0),$=T?p(A,T.dstSide):f(A,F,!1);const Lt=J.get(`${u}:src`),wt=J.get(`${u}:dst`);return Lt!==void 0&&(j=Q(j,q,Lt)),
wt!==void 0&&($=Q($,ct,wt)),{pSrcPort:j,pDstPort:$,srcSide:q,dstSide:ct}},"portsForEdge");for(const u of y){const C=s[u];
if(S[u]=[],!C.start||!C.end||C.points&&C.points.length>0||C.start===C.end)continue;const A=r.get(C.start),T=r.get(C.end);
if(!A||!T)continue;const{pSrcPort:R,pDstPort:F,srcSide:q,dstSide:ct}=K(u,A,T),j={...R},$={...F},Lt=q==="top"||q==="botto\
m",wt=ct==="top"||ct==="bottom";if(Lt){const X=R.y>(A.y??0);j.y=X?R.y+le:R.y-le}else{const X=R.x>(A.x??0);j.x=X?R.x+le:R.
x-le}if(wt){const X=F.y>(T.y??0);$.y=X?F.y+le:F.y-le}else{const X=F.x>(T.x??0);$.x=X?F.x+le:F.x-le}const Tt=c((X,z)=>{for(const ot of b)
if(!z.includes(ot.nodeId)&&X.x>ot.minX&&X.x<ot.maxX&&X.y>ot.minY&&X.y<ot.maxY)return{inside:!0,obstacle:ot};return{inside:!1}},
"isPointInObstacle"),rt=c((X,z,ot,Mt,Bt)=>{if(Bt){const Yt=X.y>(z.y??0);return{x:(ot.x??0)>=X.x?Mt.maxX+Oe:Mt.minX-Oe,y:Yt?
Mt.maxY+_e:Mt.minY-_e,leavesPositiveSide:Yt}}const At=X.x>(z.x??0),Ft=(ot.y??0)>=X.y;return{x:At?Mt.maxX+Oe:Mt.minX-Oe,y:Ft?
Mt.maxY+_e:Mt.minY-_e,leavesPositiveSide:At}},"obstacleDetour");let bt=[];const kt=[C.start,C.end],te=Tt(j,kt);if(te.inside&&
te.obstacle){const X=te.obstacle;if(Lt){const z=rt(R,A,T,X,!0);j.x=z.x,j.y=z.y;const ot=z.leavesPositiveSide?Math.min(X.
minY-2,R.y+le):Math.max(X.maxY+2,R.y-le);bt=[{x:R.x,y:ot},{x:z.x,y:ot},{x:z.x,y:z.y}]}else{const z=rt(R,A,T,X,!1),ot=z.leavesPositiveSide?
Math.min(X.minX-2,R.x+le):Math.max(X.maxX+2,R.x-le);j.x=z.x,j.y=z.y,bt=[{x:ot,y:R.y},{x:ot,y:z.y},{x:z.x,y:z.y}]}}let Dt=[];
const se=Tt($,kt);if(se.inside&&se.obstacle){const X=se.obstacle;if(wt){const z=rt(F,T,A,X,!0);$.x=z.x,$.y=z.y,Dt=[{x:z.
x,y:z.y},{x:F.x,y:z.y}]}else{const z=rt(F,T,A,X,!1);$.x=z.x,$.y=z.y,Dt=[{x:z.x,y:z.y},{x:z.x,y:F.y}]}}if(bt.length===0&&
Dt.length===0){const X=Oe,z=Math.abs(j.x-$.x)<X,ot=Math.abs(j.y-$.y)<X,Mt=J.get(`${u}:src`)!==void 0||J.get(`${u}:dst`)!==
void 0,Bt=(w.get(`${C.start??""}:${q}:src`)?.length??0)+(w.get(`${C.start??""}:${q}:dst`)?.length??0),At=(w.get(`${C.end??
""}:${ct}:src`)?.length??0)+(w.get(`${C.end??""}:${ct}:dst`)?.length??0),Ft=Bt>1||At>1,Yt=E.get(C.start??"")??0,St=E.get(
C.end??"")??0,qt=Bt>1&&G(C.start,q)||At>1&&G(C.end,ct),ae=Bt<=1||Yt<=2,zt=At<=1||St<=2;if((z||ot)&&!Mt&&(!Ft||Ft&&!qt&&ae&&
zt)&&!I(R,F,C.start,C.end)){C.points=[{...R},{...j},{...$},{...F}],M.add(u);const Rt=ot?"horizontal":"vertical",Jt=ot?R.
y:R.x,Ot=ot?Math.min(R.x,F.x):Math.min(R.y,F.y),Nt=ot?Math.max(R.x,F.x):Math.max(R.y,F.y),ee={id:`fast-path-${Rt}-${Jt.toFixed(
0)}-${u}`,orientation:Rt,coord:Jt,spanMin:Ot,spanMax:Nt,tracks:[]};m.push({edgeIndex:u,segmentIndex:0,orientation:Rt,pipe:ee,
trackIndex:0,from:Ot,to:Nt});continue}}const Me=l("vertical",j.x,j.y,j.y);j.x=Me.coord;const In=l("vertical",$.x,$.y,$.y);
$.x=In.coord;let Ie=Math.min(j.x,$.x)-50,Se=Math.max(j.x,$.x)+50,Pe=Math.min(j.y,$.y)-50,ke=Math.max(j.y,$.y)+50;for(const X of b){
const z=Math.min(j.x,$.x),ot=Math.max(j.x,$.x),Mt=Math.min(j.y,$.y),Bt=Math.max(j.y,$.y);X.minX<ot&&X.maxX>z&&X.minY<Bt&&
X.maxY>Mt&&(Ie=Math.min(Ie,X.minX-tn),Se=Math.max(Se,X.maxX+tn),Pe=Math.min(Pe,X.minY-tn),ke=Math.max(ke,X.maxY+tn))}for(const X of b){
if(X.maxX<Ie||X.minX>Se||X.maxY<Pe||X.minY>ke)continue;const z=Oe;l("horizontal",X.minY-z,Ie,Se),l("horizontal",X.maxY+z,
Ie,Se);const ot=_e;l("vertical",X.minX-ot,Pe,ke),l("vertical",X.maxX+ot,Pe,ke)}l("horizontal",j.y,Ie,Se),l("horizontal",
$.y,Ie,Se);const Br=a.filter(X=>X.orientation==="horizontal"&&X.coord>=Pe&&X.coord<=ke),Pr=a.filter(X=>X.orientation==="\
vertical"&&X.coord>=Ie&&X.coord<=Se),Ue=c((X,z)=>`${X.toFixed(1)},${z.toFixed(1)}`,"getKey"),je=Ue(j.x,j.y),No=Ue($.x,$.
y),We=new Map,Sn=new Map,Cn=new Map,Ke=new Set,Re=[];We.set(je,0),Cn.set(je,"n"),Re.push({key:je,f:Math.hypot($.x-j.x,$.
y-j.y),pt:j}),Ke.add(je);let Wt=[];const Ce=c((X,z)=>I(X,z,C.start,C.end),"checkSegmentBlocked"),vn={x:$.x,y:j.y},kr=Ce(
j,vn),Fr=Ce(vn,$),_r=kr||Fr,Ln={x:j.x,y:$.y},Hr=Ce(j,Ln),Dr=Ce(Ln,$);if(_r?Hr||Dr||(Math.abs(j.x-$.x)<mt?Wt=[j,$]:Wt=[j,
Ln,$]):Math.abs(j.y-$.y)<mt||Math.abs(j.x-$.x)<mt?Wt=[j,$]:Wt=[j,vn,$],Wt.length===0)for(;Re.length>0;){Re.sort((St,qt)=>St.
f-qt.f);const X=Re.shift();if(Ke.delete(X.key),X.key===No){let St=No,qt=$;for(Wt=[qt];Sn.has(St);){const ae=Sn.get(St);Wt.
unshift(ae),qt=ae,St=Ue(ae.x,ae.y)}break}const z=X.pt.x,ot=X.pt.y,Mt=Pr.sort((St,qt)=>St.coord-qt.coord),Bt=Mt.findIndex(
St=>Math.abs(St.coord-z)<1),At=Br.sort((St,qt)=>St.coord-qt.coord),Ft=At.findIndex(St=>Math.abs(St.coord-ot)<1),Yt=[];Bt>
0&&Yt.push({x:Mt[Bt-1].coord,y:ot}),Bt>=0&&Bt<Mt.length-1&&Yt.push({x:Mt[Bt+1].coord,y:ot}),Ft>0&&Yt.push({x:z,y:At[Ft-1].
coord}),Ft>=0&&Ft<At.length-1&&Yt.push({x:z,y:At[Ft+1].coord});for(const St of Yt){const qt=Math.min(z,St.x),ae=Math.max(
z,St.x),zt=Math.min(ot,St.y),Zt=Math.max(ot,St.y);if(b.some(re=>re.nodeId===C.start||re.nodeId===C.end?!1:qt!==ae?re.minY<
ot&&re.maxY>ot&&re.maxX>qt&&re.minX<ae:re.minX<z&&re.maxX>z&&re.maxY>zt&&re.minY<Zt))continue;const Rt=Ue(St.x,St.y),Jt=Math.
abs(St.x-z)+Math.abs(St.y-ot),Ot=v(u,X.pt,St);let Nt=0;const ee=$.x-j.x,Fe=$.y-j.y,qe=St.x-z,wn=St.y-ot;(Fe>10&&wn<-5||Fe<
-10&&wn>5)&&(Nt=Math.abs(wn)*100),(ee>10&&qe<-5||ee<-10&&qe>5)&&(Nt+=Math.abs(qe)*50);let Bo=0;const Po=Cn.get(X.key)??"\
n",ko=Math.abs(qe)>mt?"h":"v";Po!=="n"&&Po!==ko&&(Bo=50);const Xr=Jt+Ot+Nt+Bo,Ze=(We.get(X.key)??1/0)+Xr,Fo=Math.abs($.x-
St.x)+Math.abs($.y-St.y);if(Ze<(We.get(Rt)??1/0))if(Sn.set(Rt,X.pt),We.set(Rt,Ze),Cn.set(Rt,ko),!Ke.has(Rt))Re.push({key:Rt,
f:Ze+Fo,pt:St}),Ke.add(Rt);else{const re=Re.findIndex(Yr=>Yr.key===Rt);re!==-1&&(Re[re].f=Ze+Fo)}}}if(Wt.length===0&&(Wt=
[j,{x:j.x,y:$.y},$]),Wt.length>4){const X=Wt[0],z=Wt[Wt.length-1];let ot=Math.min(X.x,z.x),Mt=Math.max(X.x,z.x),Bt=Math.
min(X.y,z.y),At=Math.max(X.y,z.y);for(const zt of Wt)ot=Math.min(ot,zt.x),Mt=Math.max(Mt,zt.x),Bt=Math.min(Bt,zt.y),At=Math.
max(At,zt.y);const Ft=Mt>Math.max(X.x,z.x),Yt=ot<Math.min(X.x,z.x);if(h){const zt=_e;if(Ft){const Zt=Math.max(X.x,z.x),Gt=Math.
min(X.y,z.y),Rt=Math.max(X.y,z.y),Jt=b.filter(Ot=>Ot.minX<Zt&&Ot.maxX>Zt&&Ot.minY<Rt&&Ot.maxY>Gt);if(Jt.length>0){let Ot=Math.
max(X.x,z.x);for(const Nt of Jt){const ee=(Nt.minX+Nt.maxX)/2;if(Nt.visualXHalfExtent===void 0||isNaN(Nt.visualXHalfExtent))
continue;const Fe=ee+Nt.visualXHalfExtent+zt;Ot=Math.max(Ot,Fe)}isNaN(Ot)||(Mt=Ot)}}if(Yt){const Zt=b.filter(Gt=>Gt.minX<
Math.min(X.x,z.x)+zt&&Gt.minY<Math.max(X.y,z.y)&&Gt.maxY>Math.min(X.y,z.y));if(Zt.length>0){let Gt=Math.min(X.x,z.x);for(const Rt of Zt){
const Ot=(Rt.minX+Rt.maxX)/2-Rt.visualXHalfExtent-zt;Gt=Math.min(Gt,Ot)}ot=Gt}}}const St=c(zt=>{const Zt=z.y>X.y,Gt=b.filter(
Ot=>{const Nt=Math.min(X.x,z.x)<Ot.maxX&&Math.max(X.x,z.x)>Ot.minX,ee=Math.min(X.y,z.y)<Ot.maxY&&Math.max(X.y,z.y)>Ot.minY;
return Nt&&ee});let Rt=Gt;if(h&&Gt.length>0){const Ot=Gt.filter(Nt=>Nt.minX<zt&&Nt.maxX>zt);Ot.length>0&&(Rt=Ot)}if(Rt.length===
0)return z.y;const Jt=Oe;if(Zt){const Nt=Math.max(...Rt.map(ee=>ee.maxY))+Jt;if(Nt<z.y-mt)return Nt}else{const Nt=Math.min(
...Rt.map(ee=>ee.minY))-Jt;if(Nt>z.y+mt)return Nt}return z.y},"findBestReturnY"),qt=c(zt=>{const Zt=St(zt),Gt={x:zt,y:X.
y},Rt={x:zt,y:Zt},Jt={x:z.x,y:Zt},Ot=Ce(X,Gt),Nt=Ce(Gt,Rt),ee=Ce(Rt,Jt),Fe=Zt!==z.y?Ce(Jt,z):!1;return!Ot&&!Nt&&!ee&&!Fe?
Math.abs(Zt-z.y)<mt?[X,Gt,Rt,z]:[X,Gt,Rt,Jt,z]:null},"trySimplifyWithDetourX"),ae=Ft&&!Yt?qt(Mt):Yt&&!Ft?qt(ot):null;ae&&
(Wt=ae)}const Kt=[R,...bt,...Wt,...Dt.reverse(),F];if(Kt.length>=3){const X=Kt[Kt.length-1],z=Kt[Kt.length-2],ot=Kt[Kt.length-
3],Mt=Math.abs(ot.y-z.y)<mt&&Math.abs(z.y-X.y)<mt,Bt=Math.abs(ot.x-z.x)<mt&&Math.abs(z.x-X.x)<mt;if(Mt){const At=Math.sign(
z.x-ot.x),Ft=Math.sign(X.x-ot.x);At!==0&&At===Ft&&Math.abs(z.x-ot.x)>Math.abs(X.x-ot.x)&&Kt.splice(-2,1)}else if(Bt){const At=Math.
sign(z.y-ot.y),Ft=Math.sign(X.y-ot.y);At!==0&&At===Ft&&Math.abs(z.y-ot.y)>Math.abs(X.y-ot.y)&&Kt.splice(-2,1)}}const he=[
Kt[0]];for(let X=1;X<Kt.length-1;X++){if(X===1){he.push(Kt[X]);continue}const z=he[he.length-1],ot=Kt[X],Mt=Kt[X+1];if(Math.
abs(z.y-ot.y)<mt&&Math.abs(ot.y-Mt.y)<mt){const Bt=ot.x>z.x,At=Mt.x>ot.x;if(Bt!==At){he.push(ot);continue}continue}if(Math.
abs(z.x-ot.x)<mt&&Math.abs(ot.x-Mt.x)<mt){const Bt=ot.y>z.y,At=Mt.y>ot.y;if(Bt!==At){he.push(ot);continue}continue}he.push(
ot)}he.push(Kt[Kt.length-1]);for(let X=0;X<he.length-1;X++){const z=he[X],ot=he[X+1],Mt=Math.abs(z.x-ot.x)<mt?"vertical":
"horizontal",Bt=Mt==="vertical"?z.x:z.y,At=Mt==="vertical"?Math.min(z.y,ot.y):Math.min(z.x,ot.x),Ft=Mt==="vertical"?Math.
max(z.y,ot.y):Math.max(z.x,ot.x),Yt=l(Mt,Bt,At,Ft),St={edgeIndex:u,segmentIndex:X,orientation:Mt,pipe:Yt,trackIndex:0,from:At,
to:Ft};m.push(St),S[u].push(m.length-1),Yt.tracks[0]||(Yt.tracks[0]={index:0,coord:Yt.coord,segments:[]}),Yt.tracks[0].segments.
push({edgeIndex:u,segmentIndex:X,from:At,to:Ft})}}const st=c((u,C)=>u.from<C.to&&C.from<u.to,"segmentsOverlap"),dt=c((u,C,A,T)=>{
const R=!T.segments.some(q=>(q.edgeIndex!==C.edgeIndex||q.segmentIndex!==C.segmentIndex)&&st(q,u)),F=!A.segments.some(q=>(q.
edgeIndex!==u.edgeIndex||q.segmentIndex!==u.segmentIndex)&&st(q,C));return R&&F?(u.trackIndex=T.index,C.trackIndex=A.index,
A.segments=[...A.segments.filter(q=>q.edgeIndex!==u.edgeIndex||q.segmentIndex!==u.segmentIndex),{edgeIndex:C.edgeIndex,segmentIndex:C.
segmentIndex,from:C.from,to:C.to}],T.segments=[...T.segments.filter(q=>q.edgeIndex!==C.edgeIndex||q.segmentIndex!==C.segmentIndex),
{edgeIndex:u.edgeIndex,segmentIndex:u.segmentIndex,from:u.from,to:u.to}],!0):!1},"trySwapSegmentsAcrossTracks"),gt=c(u=>{
const C=u.tracks.length;return u.tracks[C]={index:C,coord:u.coord,segments:[]},C},"createNewTrack"),pt=c((u,C)=>{const A=u.
pipe.tracks[u.trackIndex];A.segments=A.segments.filter(R=>R.edgeIndex!==u.edgeIndex||R.segmentIndex!==u.segmentIndex),u.
trackIndex=C,u.pipe.tracks[C].segments.push({edgeIndex:u.edgeIndex,segmentIndex:u.segmentIndex,from:u.from,to:u.to})},"m\
oveSegmentToTrack"),xt=c((u,C)=>{const A=S[u.edgeIndex];for(const T of A){const R=m[T];R.pipe===u.pipe&&pt(R,C)}},"moveS\
egmentChainToTrack"),Pt=c(u=>{const C=S[u.edgeIndex],A=C.indexOf(m.indexOf(u)),T=[];return A>0&&T.push(m[C[A-1]]),A<C.length-
1&&T.push(m[C[A+1]]),T},"getAdjacentSegmentsAlongEdge"),Ee=c((u,C)=>{if(u.orientation===C.orientation)return!1;const A=u.
orientation==="horizontal"?u:C,T=u.orientation==="horizontal"?C:u;return T.pipe.coord>A.from&&T.pipe.coord<A.to&&A.pipe.
coord>T.from&&A.pipe.coord<T.to},"haveAnyCrossing"),me=c((u,C)=>{for(const A of u.tracks)if(!A.segments.some(R=>(R.edgeIndex!==
C.edgeIndex||R.segmentIndex!==C.segmentIndex)&&st(R,C)))return A.index;return-1},"findAvailableTrack"),ye=c((u,C)=>{if(u.
trackIndex===C.trackIndex)return st(u,C);const A=Pt(u),T=Pt(C);return A.some(R=>T.some(F=>Ee(R,F)))},"segmentsConflict"),
Te=c((u,C,A)=>{if(dt(u,C,u.pipe.tracks[u.trackIndex],C.pipe.tracks[C.trackIndex]))return;const T=me(u.pipe,C);A(C,T!==-1?
T:gt(u.pipe))},"resolveTrackConflict"),Ve=c(u=>{let C=0;for(let A=0;A<u.length;A++)for(let T=A+1;T<u.length;T++){const R=u[A],
F=u[T];R.pipe===F.pipe&&ye(R,F)&&(C++,Te(R,F,xt))}return C},"resolveHandleConflicts"),O=new Map,P=c(u=>{if(O.has(u))return O.
get(u);const C=S[u];if(C.length===0){const ct={dest:0,deviation:0,base:0,delta:0};return O.set(u,ct),ct}const T=m[C[0]].
pipe.coord;let R=T;for(let ct=1;ct<C.length;ct++){const j=m[C[ct]];if(j.orientation==="horizontal"){const $=j.from,Lt=j.
to;R=Math.abs($-T)>Math.abs(Lt-T)?$:Lt;break}}const F=Math.abs(R-T),q={dest:R,deviation:F,base:T,delta:R-T};return O.set(
u,q),q},"getDestInfo"),_=c(()=>{let u=0;const C=new Map;for(const[T,R]of s.entries())S[T].length!==0&&R.start&&(C.has(R.
start)||C.set(R.start,[]),C.get(R.start).push(T));const A=c(T=>{const R=s[T];if(!R.start||!R.end)return 0;const F=r.get(
R.start),q=r.get(R.end);if(!F||!q)return 0;const ct=(q.x??0)-(F.x??0),j=(q.y??0)-(F.y??0);return Math.abs(ct)+Math.abs(j)},
"getEdgeDistance");for(const T of C.values()){T.sort((F,q)=>{const ct=P(F),j=P(q);if(Math.abs(ct.deviation-j.deviation)>
1)return ct.deviation-j.deviation;if(Math.abs(ct.dest-j.dest)>1)return ct.dest-j.dest;const $=A(F),Lt=A(q);if(Math.abs($-
Lt)>1)return Lt-$;const wt=S[F].length,Tt=S[q].length;if(wt!==Tt)return wt-Tt;if(wt===1){const rt=S[F][0],bt=S[q][0];if(m[rt]&&
m[bt]){const kt=m[rt],te=m[bt],Dt=Math.abs(kt.to-kt.from),se=Math.abs(te.to-te.from);if(Math.abs(Dt-se)>1)return Dt-se}}
return 0});const R=T.map(F=>m[S[F][0]]);u+=Ve(R)}return u},"fixSourceHandleCrossings"),V=c(()=>{let u=0;const C=new Map;
for(const[A,T]of s.entries())S[A].length!==0&&T.end&&(C.has(T.end)||C.set(T.end,[]),C.get(T.end).push(A));for(const A of C.
values()){A.sort((R,F)=>{const q=c($=>{const Lt=S[$];if(Lt.length<2)return 0;const wt=m[Lt[Lt.length-2]];return Math.abs(
wt.to-wt.from)},"getDist"),ct=q(R),j=q(F);return Math.abs(ct-j)>.1?ct-j:R-F});const T=A.map(R=>m[S[R][S[R].length-1]]);u+=
Ve(T)}return u},"fixTargetHandleCrossings"),W=c(()=>{let u=0;for(const C of a){const A=[];for(const T of C.tracks)for(const R of T.
segments){const F=S[R.edgeIndex].find(q=>m[q].segmentIndex===R.segmentIndex);F!==void 0&&A.push(m[F])}A.sort((T,R)=>T.edgeIndex-
R.edgeIndex||T.segmentIndex-R.segmentIndex);for(let T=0;T<A.length;T++)for(let R=T+1;R<A.length;R++){const F=A[T],q=A[R];
ye(F,q)&&(u++,Te(F,q,pt))}}return u},"fixPipeCrossings");let et=0;const Y=10;for(;et<Y;){let u=0;if(u+=_(),u+=V(),u+=W(),
u===0)break;et++}const nt=new Map;for(const u of a){const C=[];u.tracks.forEach(T=>{T.segments.forEach(R=>{C.push({edgeIndex:R.
edgeIndex,segmentIndex:R.segmentIndex,trackIndex:T.index,from:R.from,to:R.to})})}),C.sort((T,R)=>T.from-R.from);const A=[];
if(C.length>0){let T=[C[0]],R=C[0].to;for(let F=1;F<C.length;F++){const q=C[F];q.from<R?(T.push(q),R=Math.max(R,q.to)):(A.
push(T),T=[q],R=q.to)}A.push(T)}for(const T of A){const R=new Set;T.forEach(rt=>R.add(rt.trackIndex));const F=new Map;T.
forEach(rt=>{const bt=P(rt.edgeIndex);F.set(rt.trackIndex,(F.get(rt.trackIndex)??0)+bt.delta)});const q=[...R].filter(rt=>(F.
get(rt)??0)<-1),ct=[...R].filter(rt=>(F.get(rt)??0)>1),j=[...R].filter(rt=>Math.abs(F.get(rt)??0)<=1);q.sort((rt,bt)=>(F.
get(bt)??0)-(F.get(rt)??0)),ct.sort((rt,bt)=>(F.get(rt)??0)-(F.get(bt)??0));const $=c((rt,bt)=>{T.filter(kt=>kt.trackIndex===
rt).forEach(kt=>{const te=M.has(kt.edgeIndex)?u.coord:bt;nt.set(`${kt.edgeIndex}-${kt.segmentIndex}`,te)})},"assignCoord");
let Lt=0;for(const rt of q)Lt++,$(rt,u.coord-Lt*On);if(j.length===0&&R.size>0){const rt=[...R].sort((te,Dt)=>Math.abs(F.
get(te)??0)-Math.abs(F.get(Dt)??0))[0],bt=q.indexOf(rt);bt!==-1&&q.splice(bt,1);const kt=ct.indexOf(rt);kt!==-1&&ct.splice(
kt,1),j.push(rt)}let wt=0;for(const rt of j){if(wt===0)$(rt,u.coord);else{const bt=wt%2===1?1:-1,kt=Math.ceil(wt/2);$(rt,
u.coord+bt*kt*On*.5)}wt++}let Tt=0;for(const rt of ct)Tt++,$(rt,u.coord+Tt*On)}}for(const[u,C]of s.entries()){const A=S[u]??
[];if(A.length===0)continue;const T=[],R=r.get(C.start),F=r.get(C.end),{pSrcPort:q,pDstPort:ct}=K(u,R,F),j=A.map(Tt=>{const rt=m[Tt],
bt=nt.get(`${rt.edgeIndex}-${rt.segmentIndex}`)??rt.pipe.coord;return{orient:rt.orientation,coord:bt,from:rt.from,to:rt.
to}});T.push(q);for(let Tt=0;Tt<j.length;Tt++){const rt=j[Tt],bt=T[T.length-1],kt=rt.orient==="vertical"?bt.y:bt.x,te=rt.
orient==="vertical"?bt.x:bt.y,Dt=j[Tt+1],se=Tt<j.length-1;if(Math.abs(te-rt.coord)>mt&&T.push(Ne(rt,kt)),se&&Dt.orient===
rt.orient)if(Math.abs(rt.coord-Dt.coord)>mt){const Me=rt.orient==="vertical"?(kt+Dt.from)/2:uo(rt,Dt);T.push(Ne(rt,Me),Ne(
Dt,Me))}else(Tt===0||Tt===j.length-2)&&T.push(Ne(rt,uo(rt,Dt)));else if(se)T.push(Ne(rt,Dt.coord));else{const Me=Math.abs(
rt.from-kt)<Math.abs(rt.to-kt)?rt.to:rt.from;T.push(Ne(rt,Me))}}const $=T[T.length-1];(Math.abs($.x-ct.x)>mt||Math.abs($.
y-ct.y)>mt)&&T.push(ct);const Lt=T[0];Lt&&(Math.abs(Lt.x-q.x)>mt||Math.abs(Lt.y-q.y)>mt)&&T.unshift(q);const wt=[];T.length>
0&&wt.push(T[0]);for(let Tt=1;Tt<T.length;Tt++){const rt=T[Tt],bt=wt[wt.length-1];(Math.abs(rt.x-bt.x)>mt||Math.abs(rt.y-
bt.y)>mt)&&wt.push(rt)}C.points=wt}for(const u of s){const C=u.__originalEdge;C&&u.points&&(C.points=u.points)}t.edges=(t.
edges??[]).filter(u=>!u.isLayoutOnly);const ft=c((u,C)=>{const A=C.x??0,T=C.y??0,{w:R,h:F}=sn(C,0);if(R<=0||F<=0)return u;
const q=A-R/2,ct=A+R/2,j=T-F/2,$=T+F/2;if(u.x<q||u.x>ct||u.y<j||u.y>$)return u;const Lt=u.x-q,wt=ct-u.x,Tt=u.y-j,rt=$-u.
y,bt=Math.min(Lt,wt,Tt,rt);return bt===Lt?{x:q,y:u.y}:bt===wt?{x:ct,y:u.y}:bt===Tt?{x:u.x,y:j}:{x:u.x,y:$}},"nodeBoundar\
yClamp");for(const u of t.edges){const C=u.points;if(!C||C.length<2)continue;const A=u.start,T=u.end,R=A?r.get(A):void 0,
F=T?r.get(T):void 0;R&&(C[0]=ft(C[0],R)),F&&(C[C.length-1]=ft(C[C.length-1],F))}return t}c(Tr,"routeEdgesOrthogonal");function Rr(t){
return t.direction??"TB"}c(Rr,"getSwimlaneDirection");function Or(t){const e=ss(t),n=t.config.flowchart?.nodeSpacing??40,
o=t.config.flowchart?.rankSpacing??100,s=t.config.swimlane?.ignoreCrossLaneEdges??!0,r=t.config.swimlane?.optimizeRanksByCrossings??
!0,i=t.config.swimlane?.automaticLaneOrdering??!1,a=Rr(t),{ordered:h,coordinates:g}=Er(e,{nodeGap:n,layerGap:o,ignoreCrossLaneEdges:s,
optimizeRanksByCrossings:r,automaticLaneOrdering:i,direction:a});is(e,h,g,{nodeGap:n,layerGap:o});for(const x of t.edges??
[])delete x.points;Tr(t,a);for(const x of t.edges??[])(!x.curve||x.curve==="basis")&&(x.curve="rounded");return Us(t,a),
Vs(t),a}c(Or,"runSwimlaneLayoutCore");function Nr(t){os(t);const e=cs(t);t.nodes=e.nodes,t.edges=e.edges}c(Nr,"prepareSw\
imlaneLayout");var pi=zr({prepareLayout:Nr,runLayoutCore:Or,afterPaint:Go});export{pi as render};
