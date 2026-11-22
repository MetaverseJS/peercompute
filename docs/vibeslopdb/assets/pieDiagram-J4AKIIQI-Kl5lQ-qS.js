import{p as tt}from"./chunk-JWPE2WC7-Z6-wgHu7.js";import{_ as l,h as et,g as at,i as rt,j as it,J as nt,I as ot,n as E,k as st,
a3 as lt,a6 as ct,a7 as dt,a8 as N,o as gt,R as ht,a9 as pt,a4 as ft}from"./main-DG8uJQCI.js";import{p as ut}from"./cynefin-EF2NZ3EQ-ENz6aSGk.js";
import{o as mt}from"./d3-scale-D5mADQCJ.js";import"./index-Cbny3n1e.js";var vt=ft.pie,R={sections:new Map,showData:!1},T=R.
sections,L=R.showData,St=structuredClone(vt),xt=l(()=>structuredClone(St),"getConfig"),wt=l(()=>{T=new Map,L=R.showData,
ht()},"clear"),$t=l(({label:t,value:a})=>{if(a<0)throw new Error(`"${t}" has invalid value: ${a}. Negative values are no\
t allowed in pie charts. All slice values must be >= 0.`);T.has(t)||(T.set(t,a),E.debug(`added new section: ${t}, with v\
alue: ${a}`))},"addSection"),Ct=l(()=>T,"getSections"),Dt=l(t=>{L=t},"setShowData"),yt=l(()=>L,"getShowData"),U={getConfig:xt,
clear:wt,setDiagramTitle:ot,getDiagramTitle:nt,setAccTitle:it,getAccTitle:rt,setAccDescription:at,getAccDescription:et,addSection:$t,
getSections:Ct,setShowData:Dt,getShowData:yt},Tt=l((t,a)=>{tt(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},
"populateDb"),bt={parse:l(async t=>{const a=await ut("pie",t);E.debug(a),Tt(a,U)},"parse")},At=l(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),kt=At,_t=l(t=>{const a=[...t.values()].reduce((o,m)=>o+m,0),W=[...t.entries()].map(([o,m])=>({label:o,value:m})).
filter(o=>o.value/a*100>=1);return pt().value(o=>o.value).sort(null)(W)},"createPieArcs"),zt=l((t,a,W,F)=>{E.debug(`rend\
ering pie chart
`+t);const o=F.db,m=st(),p=lt(o.getConfig(),m.pie),H=40,i=18,c=4,$=450,S=$,b=ct(a),C=b.append("g");C.attr("transform","t\
ranslate("+S/2+","+$/2+")");const{themeVariables:n}=m;let[M]=dt(n.pieOuterStrokeWidth);M??=2;const j=p.legendPosition,O=p.
textPosition,J=p.donutHole>0&&p.donutHole<=.9?p.donutHole:0,f=Math.min(S,$)/2-H,V=N().innerRadius(J*f).outerRadius(f),X=N().
innerRadius(f*O).outerRadius(f*O),x=C.append("g");x.append("circle").attr("cx",0).attr("cy",0).attr("r",f+M/2).attr("cla\
ss","pieOuterCircle");const D=o.getSections(),Z=_t(D),q=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,
n.pie10,n.pie11,n.pie12];let A=0;D.forEach(e=>{A+=e});const P=Z.filter(e=>(e.data.value/A*100).toFixed(0)!=="0"),k=mt(q).
domain([...D.keys()]);x.selectAll("mySlices").data(P).enter().append("path").attr("d",V).attr("fill",e=>k(e.data.label)).
attr("class",e=>{let r="pieCircle";return p.highlightSlice==="hover"?r+=" highlightedOnHover":p.highlightSlice===e.data.
label&&(r+=" highlighted"),r}),x.selectAll("mySlices").data(P).enter().append("text").text(e=>(e.data.value/A*100).toFixed(
0)+"%").attr("transform",e=>"translate("+X.centroid(e)+")").style("text-anchor","middle").attr("class","slice");const K=C.
append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),w=[...D.entries()].map(
([e,r])=>({label:e,value:r})),u=C.selectAll(".legend").data(w).enter().append("g").attr("class","legend");u.append("rect").
attr("width",i).attr("height",i).style("fill",e=>k(e.label)).style("stroke",e=>k(e.label)),u.append("text").attr("x",i+c).
attr("y",i-c).text(e=>o.getShowData()?`${e.label} [${e.value}]`:e.label);const v=Math.max(...u.selectAll("text").nodes().
map(e=>e?.getBoundingClientRect().width??0));let y=$,_=S+H;const s=i+c,z=w.length*s;switch(j){case"center":u.attr("trans\
form",(e,r)=>{const d=s*w.length/2,g=-v/2-(i+c),h=r*s-d;return"translate("+g+","+h+")"});break;case"top":y+=z,u.attr("tr\
ansform",(e,r)=>{const d=f,g=-v/2-(i+c),h=r*s-d;return`translate(${g}, ${h})`}),x.attr("transform",()=>`translate(0, ${z+
s})`);break;case"bottom":y+=z,u.attr("transform",(e,r)=>{const d=-f-s,g=-v/2-(i+c),h=r*s-d;return"translate("+g+","+h+")"});
break;case"left":_+=i+c+v,u.attr("transform",(e,r)=>{const d=s*w.length/2,g=-f-(i+c),h=r*s-d;return"translate("+g+","+h+
")"}),x.attr("transform",()=>`translate(${v+i+c}, 0)`);break;case"right":default:_+=i+c+v,u.attr("transform",(e,r)=>{const d=s*
w.length/2,g=12*i,h=r*s-d;return"translate("+g+","+h+")"});break}const G=K.node()?.getBoundingClientRect().width??0,Q=S/
2-G/2,Y=S/2+G/2,B=Math.min(0,Q),I=Math.max(_,Y)-B;b.attr("viewBox",`${B} 0 ${I} ${y}`),gt(b,y,I,p.useMaxWidth)},"draw"),
Et={draw:zt},Ot={parser:bt,db:U,renderer:Et,styles:kt};export{Ot as diagram};
