import{_ as a,o as w,n as x}from"./carnageWindow-BBcEUL8m.js";var g=a((e,t,i,r)=>{e.attr("class",i);const{width:o,height:h,
x:s,y:c}=u(e,t);w(e,h,o,r);const n=B(s,c,o,h,t);e.attr("viewBox",n),x.debug(`viewBox configured: ${n} with padding: ${t}`)},
"setupViewPortForSVG"),u=a((e,t)=>{const i=e.node()?.getBBox()||{width:0,height:0,x:0,y:0};return{width:i.width+t*2,height:i.
height+t*2,x:i.x,y:i.y}},"calculateDimensionsWithPadding"),B=a((e,t,i,r,o)=>`${e-o} ${t-o} ${i} ${r}`,"createViewBox");export{g as s};
