import{_ as p,n as w,a6 as L,a1 as E,R as I,aa as X,o as H,x as q,k as G}from"./carnageWindow--1fjkU2y.js";var z="",b="",
N="",A=[],R=new Map,k=p(e=>q(e,G()),"sanitizeText"),F=p(e=>{switch(e.type){case"terminal":return{...e,value:k(e.value)};case"\
nonterminal":return{...e,name:k(e.name)};case"sequence":return{...e,elements:e.elements.map(F)};case"choice":return{...e,
alternatives:e.alternatives.map(F)};case"optional":return{...e,element:F(e.element)};case"repetition":return{...e,element:F(
e.element),separator:e.separator?F(e.separator):void 0};case"special":return{...e,text:k(e.text)}}},"sanitizeAstNode"),U=p(
()=>{z="",b="",N="",A.length=0,R.clear(),I(),w.debug("[Railroad] Database cleared")},"clear"),_=p(e=>{z=k(e),w.debug("[R\
ailroad] Title set:",e)},"setTitle"),W=p(()=>z,"getTitle"),j=p(e=>{const i={...e,name:k(e.name),definition:F(e.definition),
comment:e.comment?k(e.comment):void 0};w.debug("[Railroad] Adding rule:",i.name),R.has(i.name)&&w.warn(`[Railroad] Rule \
'${i.name}' is already defined. Overwriting.`),A.push(i),R.set(i.name,i)},"addRule"),K=p(()=>A,"getRules"),J=p(e=>R.get(
e),"getRule"),Q=p(e=>{b=k(e).replace(/^\s+/g,""),w.debug("[Railroad] Accessibility title set:",e)},"setAccTitle"),Z=p(()=>b,
"getAccTitle"),V=p(e=>{N=k(e).replace(/\n\s+/g,`
`),w.debug("[Railroad] Accessibility description set:",e)},"setAccDescription"),ee=p(()=>N,"getAccDescription"),te=_,re=W,
ie={clear:U,setTitle:_,getTitle:W,addRule:j,getRules:K,getRule:J,setAccTitle:Q,getAccTitle:Z,setAccDescription:V,getAccDescription:ee,
setDiagramTitle:te,getDiagramTitle:re},g={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,
fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"\
#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#00000\
0",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",
ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},ae=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,
ne=/^[\w "',.-]+$/,oe=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize",
"fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextC\
olor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStro\
ke","ruleNameColor","showMarkers","markerRadius"]),B=p(e=>e?Object.keys(e).every(i=>i==="railroad"||oe.has(i)):!1,"isRai\
lroadStyleOptions"),le=p(e=>e?"railroad"in e&&e.railroad?e.railroad:B(e)?e:{}:{},"extractRailroadOverrides"),se=p(e=>{if(!e||
B(e))return{};const{railroad:i,svgId:n,theme:r,look:t,...a}=e;return a},"extractThemeOverrides"),m=p((e,i)=>{if(typeof e!=
"string")return i;const n=e.trim();return ae.test(n)?n:i},"sanitizeColorValue"),Y=p((e,i)=>{if(typeof e!="string")return i;
const n=e.trim();return ne.test(n)?n:i},"sanitizeFontFamilyValue"),S=p((e,i)=>{const n=typeof e=="number"?e:typeof e=="s\
tring"?Number.parseFloat(e):Number.NaN;return Number.isFinite(n)&&n>=0?n:i},"sanitizeNumberValue"),de=p(e=>{const i=typeof e==
"number"?e:typeof e=="string"?Number.parseFloat(e):Number.NaN;return Number.isFinite(i)&&i>0?i:void 0},"parseThemeFontSi\
ze"),ce=p(e=>{const i=Y(e.fontFamily,g.fontFamily),n=de(e.fontSize)??g.fontSize;return{...g,fontFamily:i,fontSize:n,terminalFill:m(
e.secondBkg??e.secondaryColor,g.terminalFill),terminalStroke:m(e.secondaryBorderColor??e.lineColor,g.terminalStroke),terminalTextColor:m(
e.secondaryTextColor??e.textColor,g.terminalTextColor),nonTerminalFill:m(e.mainBkg??e.background,g.nonTerminalFill),nonTerminalStroke:m(
e.primaryBorderColor??e.lineColor,g.nonTerminalStroke),nonTerminalTextColor:m(e.primaryTextColor??e.textColor,g.nonTerminalTextColor),
lineColor:m(e.lineColor,g.lineColor),markerFill:m(e.lineColor,g.markerFill),commentFill:m(e.labelBackground??e.tertiaryColor,
g.commentFill),commentStroke:m(e.tertiaryBorderColor??e.lineColor,g.commentStroke),commentTextColor:m(e.tertiaryTextColor??
e.textColor,g.commentTextColor),specialFill:m(e.tertiaryColor??e.secondaryColor,g.specialFill),specialStroke:m(e.tertiaryBorderColor??
e.secondaryBorderColor,g.specialStroke),ruleNameColor:m(e.titleColor??e.textColor,g.ruleNameColor)}},"buildThemeDefaults"),
M=p(e=>{const i=E(),n={...X(),...i.themeVariables??{},...se(e)},r=ce(n),t={...i.railroad??{},...le(e)};return{compactMode:t.
compactMode??r.compactMode,padding:S(t.padding,r.padding),verticalSeparation:S(t.verticalSeparation,r.verticalSeparation),
horizontalSeparation:S(t.horizontalSeparation,r.horizontalSeparation),arcRadius:S(t.arcRadius,r.arcRadius),fontSize:S(t.
fontSize,r.fontSize),fontFamily:Y(t.fontFamily,r.fontFamily),terminalFill:m(t.terminalFill,r.terminalFill),terminalStroke:m(
t.terminalStroke,r.terminalStroke),terminalTextColor:m(t.terminalTextColor,r.terminalTextColor),nonTerminalFill:m(t.nonTerminalFill,
r.nonTerminalFill),nonTerminalStroke:m(t.nonTerminalStroke,r.nonTerminalStroke),nonTerminalTextColor:m(t.nonTerminalTextColor,
r.nonTerminalTextColor),lineColor:m(t.lineColor,r.lineColor),strokeWidth:S(t.strokeWidth,r.strokeWidth),markerFill:m(t.markerFill,
r.markerFill),commentFill:m(t.commentFill,r.commentFill),commentStroke:m(t.commentStroke,r.commentStroke),commentTextColor:m(
t.commentTextColor,r.commentTextColor),specialFill:m(t.specialFill,r.specialFill),specialStroke:m(t.specialStroke,r.specialStroke),
ruleNameColor:m(t.ruleNameColor,r.ruleNameColor),showMarkers:t.showMarkers??r.showMarkers,markerRadius:S(t.markerRadius,
r.markerRadius)}},"buildRailroadStyleOptions"),ue=p(e=>{const{fontFamily:i,fontSize:n,terminalFill:r,terminalStroke:t,terminalTextColor:a,
nonTerminalFill:h,nonTerminalStroke:s,nonTerminalTextColor:o,lineColor:u,strokeWidth:c,markerFill:d,commentFill:x,commentStroke:l,
commentTextColor:f,specialFill:y,specialStroke:v,ruleNameColor:C}=M(e);return`
  .railroad-diagram {
    font-family: ${i};
    font-size: ${n}px;
  }

  .railroad-terminal rect {
    fill: ${r};
    stroke: ${t};
    stroke-width: ${c}px;
  }

  .railroad-terminal text {
    fill: ${a};
    font-family: ${i};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${h};
    stroke: ${s};
    stroke-width: ${c}px;
  }

  .railroad-nonterminal text {
    fill: ${o};
    font-family: ${i};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${u};
    stroke-width: ${c}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${d};
  }

  .railroad-comment ellipse {
    fill: ${x};
    stroke: ${l};
    stroke-width: ${c}px;
  }

  .railroad-comment text {
    fill: ${f};
    font-style: italic;
    font-family: ${i};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${y};
    stroke: ${v};
    stroke-width: ${c}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${o};
    font-family: ${i};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${C};
    font-family: ${i};
    font-size: ${n}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),T=class{constructor(){this.d=""}static{p(this,"PathBuilder")}moveTo(e,i){return this.d+=`M ${e} ${i} `,this}lineTo(e,i){
return this.d+=`L ${e} ${i} `,this}horizontalTo(e){return this.d+=`H ${e} `,this}verticalTo(e){return this.d+=`V ${e} `,
this}arcTo(e,i,n,r,t,a,h){return this.d+=`A ${e} ${i} ${n} ${r?1:0} ${t?1:0} ${a} ${h} `,this}build(){return this.d.trim()}},
me=class{constructor(e,i=M()){this.textCache=new Map,this.svg=e,this.config=i}static{p(this,"RailroadRenderer")}measureText(e){
if(this.textCache.has(e))return this.textCache.get(e);const i=this.svg.append("text").attr("font-family",this.config.fontFamily).
attr("font-size",this.config.fontSize).text(e),n=i.node().getBBox(),r={width:n.width,height:n.height};return i.remove(),
this.textCache.set(e,r),r}renderTerminal(e,i){const n=this.measureText(i),r=n.width+this.config.padding*2,t=n.height+this.
config.padding*2,a=e.append("g").attr("class","railroad-terminal");return a.append("rect").attr("x",0).attr("y",0).attr(
"width",r).attr("height",t).attr("rx",10).attr("ry",10),a.append("text").attr("x",r/2).attr("y",t/2).text(i),{element:a.
node(),dimensions:{width:r,height:t,up:t/2,down:t/2}}}renderNonTerminal(e,i){const n=this.measureText(i),r=n.width+this.
config.padding*2,t=n.height+this.config.padding*2,a=e.append("g").attr("class","railroad-nonterminal");return a.append("\
rect").attr("x",0).attr("y",0).attr("width",r).attr("height",t),a.append("text").attr("x",r/2).attr("y",t/2).text(i),{element:a.
node(),dimensions:{width:r,height:t,up:t/2,down:t/2}}}renderSequence(e,i){const n=i.map(o=>this.renderExpression(e,o));let r=0,
t=0,a=0;for(const o of n)r+=o.dimensions.width,t=Math.max(t,o.dimensions.up),a=Math.max(a,o.dimensions.down);r+=(n.length-
1)*this.config.horizontalSeparation;const h=e.append("g").attr("class","railroad-sequence");let s=0;for(let o=0;o<n.length;o++){
const u=n[o],c=t-u.dimensions.up;if(h.node().appendChild(u.element).setAttribute("transform",`translate(${s}, ${c})`),o<
n.length-1){const x=s+u.dimensions.width,l=x+this.config.horizontalSeparation,f=t;h.append("path").attr("class","railroa\
d-line").attr("d",new T().moveTo(x,f).lineTo(l,f).build())}s+=u.dimensions.width+this.config.horizontalSeparation}return{
element:h.node(),dimensions:{width:r,height:t+a,up:t,down:a}}}renderChoice(e,i){const n=i.map(d=>this.renderExpression(e,
d));let r=0,t=0;for(const d of n)r=Math.max(r,d.dimensions.width),t+=d.dimensions.height;t+=(n.length-1)*this.config.verticalSeparation;
const a=this.config.arcRadius,h=a*4,s=r+h,o=e.append("g").attr("class","railroad-choice");let u=0;const c=t/2;for(const d of n){
const x=u,l=x+d.dimensions.up,f=a*2+(r-d.dimensions.width)/2;o.node().appendChild(d.element).setAttribute("transform",`t\
ranslate(${f}, ${x})`);const v=new T,C=l>c;l===c?v.moveTo(0,c).lineTo(f,l):v.moveTo(0,c).arcTo(a,a,0,!1,C,a,c+(C?a:-a)).
lineTo(a,l-(C?a:-a)).arcTo(a,a,0,!1,!C,a*2,l).lineTo(f,l),o.append("path").attr("class","railroad-line").attr("d",v.build());
const $=new T,O=f+d.dimensions.width,P=s-a*2;l===c?$.moveTo(O,l).lineTo(s,c):$.moveTo(O,l).lineTo(P,l).arcTo(a,a,0,!1,!C,
s-a,l+(C?-a:a)).lineTo(s-a,c+(C?a:-a)).arcTo(a,a,0,!1,C,s,c),o.append("path").attr("class","railroad-line").attr("d",$.build()),
u+=d.dimensions.height+this.config.verticalSeparation}return{element:o.node(),dimensions:{width:s,height:t,up:c,down:t-c}}}renderOptional(e,i){
const n=this.renderExpression(e,i),r=this.config.arcRadius,t=r*2,a=n.dimensions.width+r*4,h=n.dimensions.height+t,s=e.append(
"g").attr("class","railroad-optional"),o=r*2,u=t;s.node().appendChild(n.element).setAttribute("transform",`translate(${o}\
, ${u})`);const d=u+n.dimensions.up,x=new T().moveTo(0,d).lineTo(r*2,d);s.append("path").attr("class","railroad-line").attr(
"d",x.build());const l=new T().moveTo(o+n.dimensions.width,d).lineTo(a,d);s.append("path").attr("class","railroad-line").
attr("d",l.build());const f=new T().moveTo(0,d).arcTo(r,r,0,!1,!1,r,d-r).lineTo(r,r).arcTo(r,r,0,!1,!0,r*2,0).lineTo(a-r*
2,0).arcTo(r,r,0,!1,!0,a-r,r).lineTo(a-r,d-r).arcTo(r,r,0,!1,!1,a,d);return s.append("path").attr("class","railroad-line").
attr("d",f.build()),{element:s.node(),dimensions:{width:a,height:h,up:d,down:h-d}}}renderRepetition(e,i,n){const r=this.
renderExpression(e,i),t=this.config.arcRadius,a=t*2,h=r.dimensions.width+t*4,s=n===0,o=r.dimensions.height+a+(s?a:0),u=e.
append("g").attr("class","railroad-repetition"),c=t*2,d=s?a:0;u.node().appendChild(r.element).setAttribute("transform",`\
translate(${c}, ${d})`);const l=d+r.dimensions.up;u.append("path").attr("class","railroad-line").attr("d",new T().moveTo(
0,l).lineTo(t*2,l).build()),u.append("path").attr("class","railroad-line").attr("d",new T().moveTo(c+r.dimensions.width,
l).lineTo(h,l).build());const f=d+r.dimensions.height+t,y=new T().moveTo(c+r.dimensions.width,l).arcTo(t,t,0,!1,!0,c+r.dimensions.
width+t,l+t).lineTo(c+r.dimensions.width+t,f).arcTo(t,t,0,!1,!0,c+r.dimensions.width,f+t).lineTo(t*2,f+t).arcTo(t,t,0,!1,
!0,t,f).lineTo(t,l+t).arcTo(t,t,0,!1,!0,t*2,l);if(u.append("path").attr("class","railroad-line").attr("d",y.build()),s){
const v=new T().moveTo(0,l).arcTo(t,t,0,!1,!1,t,l-t).lineTo(t,t).arcTo(t,t,0,!1,!0,t*2,0).lineTo(h-t*2,0).arcTo(t,t,0,!1,
!0,h-t,t).lineTo(h-t,l-t).arcTo(t,t,0,!1,!1,h,l);u.append("path").attr("class","railroad-line").attr("d",v.build())}return{
element:u.node(),dimensions:{width:h,height:o,up:l,down:o-l}}}renderSpecial(e,i){const n=this.measureText("? "+i+" ?"),r=n.
width+this.config.padding*2,t=n.height+this.config.padding*2,a=e.append("g").attr("class","railroad-special");return a.append(
"rect").attr("x",0).attr("y",0).attr("width",r).attr("height",t),a.append("text").attr("x",r/2).attr("y",t/2).text("? "+
i+" ?"),{element:a.node(),dimensions:{width:r,height:t,up:t/2,down:t/2}}}renderExpression(e,i){switch(i.type){case"termi\
nal":return this.renderTerminal(e,i.value);case"nonterminal":return this.renderNonTerminal(e,i.name);case"sequence":return this.
renderSequence(e,i.elements);case"choice":return this.renderChoice(e,i.alternatives);case"optional":return this.renderOptional(
e,i.element);case"repetition":return this.renderRepetition(e,i.element,i.min);case"special":return this.renderSpecial(e,
i.text);default:throw new Error(`Unknown node type: ${i.type}`)}}renderRule(e,i){const n=this.svg.append("g").attr("clas\
s","railroad-rule").attr("transform",`translate(0, ${i})`),r=e.name+" =",t=this.measureText(r).width+20,a=t+20,h=n.append(
"g"),s=this.renderExpression(h,e.definition),o=Math.max(20,s.dimensions.up),u=o-s.dimensions.up;return h.attr("transform",
`translate(${a}, ${u})`),n.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-ru\
le-name").attr("x",0).attr("y",o).text(r),n.append("g").attr("class","railroad-start").append("circle").attr("cx",t).attr(
"cy",o).attr("r",this.config.markerRadius),n.append("g").attr("class","railroad-end").append("circle").attr("cx",a+s.dimensions.
width+10).attr("cy",o).attr("r",this.config.markerRadius),n.append("path").attr("class","railroad-line").attr("d",new T().
moveTo(t+this.config.markerRadius,o).lineTo(a,o).build()),n.append("path").attr("class","railroad-line").attr("d",new T().
moveTo(a+s.dimensions.width,o).lineTo(a+s.dimensions.width+10-this.config.markerRadius,o).build()),{height:Math.max(40,u+
s.dimensions.height+this.config.padding*2),width:a+s.dimensions.width+10+this.config.markerRadius}}renderDiagram(e){let i=this.
config.padding,n=0;for(const r of e){const t=this.renderRule(r,i);i+=t.height+this.config.verticalSeparation,n=Math.max(
n,t.width)}return{width:n+this.config.padding*2,height:i+this.config.padding}}},D=p((e,i,n)=>{H(e,i.height,i.width,n),e.
attr("viewBox",`0 0 ${i.width} ${i.height}`)},"configureRailroadSvgSize"),he=p((e,i,n)=>{w.debug(`[Railroad] Rendering d\
iagram
`+e);try{const r=L(i);r.attr("class","railroad-diagram");const a=E().railroad?.useMaxWidth??!0,h=ie.getRules();if(w.debug(
`[Railroad] Rendering ${h.length} rules`),h.length===0){w.warn("[Railroad] No rules to render"),D(r,{height:100,width:200},
a);return}const o=new me(r,M()).renderDiagram(h);D(r,o,a),w.debug("[Railroad] Render complete")}catch(r){throw w.error("\
[Railroad] Render error:",r),r}},"draw"),ge={draw:he};export{ie as d,ue as g,ge as r};
