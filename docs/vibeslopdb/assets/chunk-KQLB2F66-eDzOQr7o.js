const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sizeCapture-INFHLROL-DSFtHgL3.js","./carnageWindow-Ta-Zfo9P.js","./preload-helper-FD8EeCEm.js"])))=>i.map(i=>d[i]);
import{_ as Z}from"./preload-helper-FD8EeCEm.js";import{_ as u,aK as I,n as o,aL as ee,aM as te,aN as ne,at as se,k as re,
aO as D,aP as S,au as L,as as ie,aQ as ae,aR as R,aS as oe,a1 as ce,aT as le,aU as ue,aV as de,G as fe}from"./carnageWindow-Ta-Zfo9P.js";
import{G as k}from"./graph-B911Usce.js";function P(e,{edgePathsClass:n="edges edgePaths"}={}){const t=e.insert("g").attr(
"class","root"),r=t.insert("g").attr("class","clusters"),s=t.insert("g").attr("class",n),i=t.insert("g").attr("class","e\
dgeLabels"),c=t.insert("g").attr("class","nodes");return{clusters:r,edgePaths:s,edgeLabels:i,nodes:c,rootGroups:t}}u(P,"\
createLayoutElementGroups");async function T(e,n,t){if(n.label){const{shapeSvg:r,bbox:s}=await oe(e,t===void 0?n:{...n,width:t});
n.labelBBox={width:s.width,height:s.height},r.remove()}else n.labelBBox={width:0,height:0}}u(T,"measureGroupLabel");async function _(e,n,t){
const r=await se(e,n,t),s=r.node()?.getBBox()??{width:0,height:0};return n.width=s.width,n.height=s.height,r}u(_,"insert\
MeasuredNode");function B(e,n,t){let r=e;const s=new Set;for(;r;){if(r.dir)return r.dir;if(!r.parentId||s.has(r.parentId))
break;s.add(r.parentId),r=n.get(r.parentId)}return t}u(B,"resolveNodeDir");async function M(e,n,t={}){const r=new k({multigraph:!0,
compound:!0}),s=[...n.edges],i=re(),c=P(e),{edgeLabels:f,nodes:a}=c,g=new Map,h=new Map(n.nodes.map(d=>[d.id,d])),C=n.direction,
w=e.node()!=null;await Promise.all(n.nodes.map(async d=>{if(d.isGroup){if(w){const b=t.unwrapGroupLabels&&d.labelType!==
"markdown";await T(a,d,b?Number.POSITIVE_INFINITY:void 0)}r.setNode(d.id,{...d})}else{if(w){const b=await _(a,d,{config:i,
dir:B(d,h,C)});g.set(d.id,b)}r.setNode(d.id,{...d})}}));for(const d of s)w&&D(d)&&await S(f,d),r.setEdge(d.start,d.end,{
...d},d.id),n.edges.some(E=>E.id===d.id)||n.edges.push(d);if(globalThis.mermaidCaptureSizes){const{captureNodeSizes:d}=await Z(
async()=>{const{captureNodeSizes:b}=await import("./sizeCapture-INFHLROL-DSFtHgL3.js");return{captureNodeSizes:b}},__vite__mapDeps([0,1,2]),
import.meta.url);d(e,n)}return{graph:r,groups:c,nodeElements:g}}u(M,"createGraphWithElements");var l=new Map,m=new Map,A=new Map,
ge=u(()=>{m.clear(),A.clear(),l.clear()},"clear"),v=u((e,n)=>{const t=m.get(n)||[];return o.trace("In isDescendant",n," ",
e," = ",t.includes(e)),t.includes(e)},"isDescendant"),be=u((e,n)=>{const t=m.get(n)||[];return o.info("Descendants of ",
n," is ",t),o.info("Edge is ",e),e.v===n||e.w===n?!1:t?t.includes(e.v)||v(e.v,n)||v(e.w,n)||t.includes(e.w):(o.debug("Ti\
lt, ",n,",not in descendants"),!1)},"edgeInCluster"),G=u((e,n,t,r)=>{o.debug("Copying children of ",e,"root",r,"data",n.
node(e),r);const s=n.children(e)||[];e!==r&&s.push(e),o.debug("Copying (nodes) clusterId",e,"nodes",s),s.forEach(i=>{if(n.
children(i).length>0)G(i,n,t,r);else{const c=n.node(i);o.info("cp ",i," to ",r," with parent ",e),t.setNode(i,c),r!==n.parent(
i)&&(o.debug("Setting parent",i,n.parent(i)),t.setParent(i,n.parent(i))),e!==r&&i!==e?(o.debug("Setting parent",i,e),t.setParent(
i,e)):(o.info("In copy ",e,"root",r,"data",n.node(e),r),o.debug("Not Setting parent for node=",i,"cluster!==rootId",e!==
r,"node!==clusterId",i!==e));const f=n.edges(i);o.debug("Copying Edges",f),f.forEach(a=>{o.info("Edge",a);const g=n.edge(
a.v,a.w,a.name);o.info("Edge data",g,r);try{be(a,r)?(o.info("Copying as ",a.v,a.w,g,a.name),t.setEdge(a.v,a.w,g,a.name),
o.info("newGraph edges ",t.edges(),t.edge(t.edges()[0]))):o.info("Skipping copy of edge ",a.v,"-->",a.w," rootId: ",r," \
clusterId:",e)}catch(h){o.error(h)}})}o.debug("Removing node",i),n.removeNode(i)})},"copy"),X=u((e,n)=>{const t=n.children(
e);let r=[...t];for(const s of t)A.set(s,e),r=[...r,...X(s,n)];return r},"extractDescendants"),me=u((e,n,t)=>{const r=e.
edges().filter(a=>a.v===n||a.w===n),s=e.edges().filter(a=>a.v===t||a.w===t),i=r.map(a=>({v:a.v===n?t:a.v,w:a.w===n?n:a.w})),
c=s.map(a=>({v:a.v,w:a.w}));return i.filter(a=>c.some(g=>a.v===g.v&&a.w===g.w))},"findCommonEdges"),p=u((e,n,t)=>{const r=n.
children(e);if(o.trace("Searching children of id ",e,r),r.length<1)return e;let s;for(const i of r){const c=p(i,n,t),f=me(
n,t,c);if(c)if(f.length>0)s=c;else return c}return s},"findNonClusterChild"),x=u(e=>!l.has(e)||!l.get(e).externalConnections?
e:l.has(e)?l.get(e).id:e,"getAnchorId"),Ne=u((e,n)=>{if(!e||n>10){o.debug("Opting out, no graph ");return}else o.debug("\
Opting in, graph ");e.nodes().forEach(function(t){e.children(t).length>0&&(o.debug("Cluster identified",t," Replacement \
id in edges: ",p(t,e,t)),m.set(t,X(t,e)),l.set(t,{id:p(t,e,t),clusterData:e.node(t)}))}),e.nodes().forEach(function(t){const r=e.
children(t),s=e.edges();r.length>0?(o.debug("Cluster identified",t,m),s.forEach(i=>{const c=v(i.v,t),f=v(i.w,t);c^f&&(o.
debug("Edge: ",i," leaves cluster ",t),o.debug("Descendants of XXX ",t,": ",m.get(t)),l.get(t).externalConnections=!0)})):
o.debug("Not a cluster ",t,m)});for(let t of l.keys()){const r=l.get(t).id,s=e.parent(r);s!==t&&l.has(s)&&!l.get(s).externalConnections&&
(l.get(t).id=s);const i=e.edges().some(c=>c.v===t);if(r&&l.get(t)?.externalConnections&&i&&$(e,r,t)){const c=he(e,t,e.parent(
r));c&&(l.get(t).id=c)}}e.edges().forEach(function(t){const r=e.edge(t);o.debug("Edge "+t.v+" -> "+t.w+": "+JSON.stringify(
t)),o.debug("Edge "+t.v+" -> "+t.w+": "+JSON.stringify(e.edge(t)));let s=t.v,i=t.w;if(o.debug("Fix XXX",l,"ids:",t.v,t.w,
"Translating: ",l.get(t.v)," --- ",l.get(t.w)),l.get(t.v)||l.get(t.w)){if(o.debug("Fixing and trying - removing XXX",t.v,
t.w,t.name),s=x(t.v),i=x(t.w),e.removeEdge(t.v,t.w,t.name),s!==t.v){const c=e.parent(s);l.get(c).externalConnections=!0,
r.fromCluster=t.v}if(i!==t.w){const c=e.parent(i);l.get(c).externalConnections=!0,r.toCluster=t.w}o.debug("Fix Replacing\
 with XXX",s,i,t.name),e.setEdge(s,i,r,t.name)}}),O(e,0),o.trace(l)},"adjustClustersAndEdges"),O=u((e,n)=>{if(n>10){o.error(
"Bailing out");return}let t=e.nodes(),r=!1;for(const s of t){const i=e.children(s);r=r||i.length>0}if(!r){o.debug("Done,\
 no node has children",e.nodes());return}o.debug("Nodes = ",t,n);for(const s of t)if(o.debug("Extracting node",s,l,l.has(
s)&&!l.get(s).externalConnections,!e.parent(s),e.node(s),e.children("D")," Depth ",n),!l.has(s))o.debug("Not a cluster",
s,n);else if(!l.get(s).externalConnections&&e.children(s)&&e.children(s).length>0){o.debug("Cluster without external con\
nections, without a parent and with children",s,n);let c=e.graph().rankdir==="TB"?"LR":"TB";l.get(s)?.clusterData?.dir&&
(c=l.get(s).clusterData.dir,o.debug("Fixing dir",l.get(s).clusterData.dir,c));const f=new k({multigraph:!0,compound:!0}).
setGraph({rankdir:c,nodesep:50,ranksep:50,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}});G(s,e,f,s),e.setNode(
s,{clusterNode:!0,id:s,clusterData:l.get(s).clusterData,label:l.get(s).label,graph:f})}else o.debug("Cluster ** ",s," **\
not meeting the criteria !externalConnections:",!l.get(s).externalConnections," no parent: ",!e.parent(s)," children ",e.
children(s)&&e.children(s).length>0,e.children("D"),n),o.debug(l);t=e.nodes(),o.debug("New list of nodes",t);for(const s of t){
const i=e.node(s);o.debug(" Now next level",s,i),i?.clusterNode&&O(i.graph,n+1)}},"extractor"),F=u((e,n)=>{if(n.length===
0)return[];let t=Object.assign([],n);return n.forEach(r=>{const s=e.children(r),i=F(e,s);t=[...t,...i]}),t},"sorter"),ye=u(
e=>F(e,e.children()),"sortNodesByHierarchy"),$=u((e,n,t)=>{let r=e.parent(n);for(;r&&r!==t;){const s=l.get(r);if(s&&!s.externalConnections)
return!0;r=e.parent(r)}return!1},"isNodeInExtractableCluster"),he=u((e,n,t)=>{const r=e.children(n)??[];for(const s of r){
if(s===t||v(s,t))continue;const i=p(s,e,n);if(i&&!$(e,i,n))return i}return null},"findSafeAnchorNode");function we({prepareLayout:e,
measureLayout:n,runLayoutCore:t,paintLayout:r,afterPaint:s,paintOptions:i}){const c=n??z;return u(async function(a,g,h,C){
const w=g.select("g");(h?.insertMarkers??I)(w,a.markers,a.type,a.diagramId),j();const d={element:w,helpers:h,options:C};
d.preparedLayout=await e?.(a,d);const b=await c(a,d),E=await t(a,d),N={...d,measure:b};r?await r(a,N,E):await H(a,N,i),await s?.(
a,N,E)},"render")}u(we,"createCommonLayoutRenderer");function j(){ee(),te(),ne(),ge()}u(j,"clearLayoutRenderState");async function z(e,{
element:n},t){return await M(n,e,t)}u(z,"defaultMeasureLayout");async function H(e,n,t={}){const{measure:r}=n,{groups:s}=r;
for(const c of t.getNodes?.(e,n)??e.nodes)t.skipNode?.(c,n)||await V(s,c,n,t);const i=W(e.nodes);for(const c of e.edges)
K(c,t)||await Q(s,c,i,e,t,n)}u(H,"paintLayoutData");async function V(e,n,t,r){n.clusterNode?L(n):J(n,t,r)?await ie(e.clusters,
n):L(n)}u(V,"paintLayoutNode");function J(e,n,t){return e.isGroup===!0&&(t.isCluster?.(e,n)??!0)}u(J,"shouldPaintAsClust\
er");function W(e){const n=new Map;for(const t of e)t?.id&&n.set(t.id,t);return n}u(W,"buildNodeLookup");function K(e,n){
return e.isLayoutOnly||!!n.skipEdge?.(e)}u(K,"shouldSkipPaintEdge");async function Q(e,n,t,r,s,i){const c=ae(e.edgePaths,
{...n},s.clusterDb??new Map,r.type,y(n.start,n,t,i,s),y(n.end,n,t,i,s),r.diagramId,U(n,s),r.layoutAlgorithm);D(n)&&(R.has(
n.id)||await S(e.edgeLabels,n),Y(n,c))}u(Q,"paintLayoutEdge");function y(e,n,t,r,s){return s.getEdgeNode?.(e,n,r)??(e?t.
get(e)??{}:{})}u(y,"getRenderedNode");function U(e,n){return typeof n.skipIntersect=="function"?n.skipIntersect(e):n.skipIntersect??
!1}u(U,"shouldSkipIntersect");function Y(e,n){const t=n?.updatedPath??n?.originalPath,r=ce(),{subGraphTitleTotalMargin:s}=le(
{flowchart:r.flowchart??{}});if(e.label){const i=R.get(e.id),{x:c,y:f}=ue(e,n);i.attr("transform",`translate(${c}, ${f+s/
2})`)}for(const[i,c]of[["startLeft",e.startLabelLeft],["startRight",e.startLabelRight],["endLeft",e.endLabelLeft],["endR\
ight",e.endLabelRight]])if(c){const{x:f,y:a}=q(e,i,t);de.get(e.id)[i].attr("transform",`translate(${f}, ${a})`)}}u(Y,"po\
sitionRenderedEdgeLabel");var ve={startLeft:"start_left",startRight:"start_right",endLeft:"end_left",endRight:"end_right"};
function q(e,n,t){const r=e.terminalLabelCenters?.[n];if(r)return{...r};if(!t)return{x:e.x,y:e.y};const s=n.startsWith("\
start")?e.arrowTypeStart:e.arrowTypeEnd;return fe.calcTerminalLabelPosition(s?10:0,ve[n],t)}u(q,"terminalLabelTranslate");export{Ne as a,P as b,we as c,z as d,l as e,p as f,_ as i,ye as s};
