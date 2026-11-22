import{i as u}from"./device-CB8g0LHY.js";import{c as m}from"./headless-DXPCYyPb.js";import{c as f}from"./diagnostics-DRxK5GC6.js";
let n=null,t=null,o=0;async function M({particleCount:i,gridSize:r,iterations:e,blockOptions:s,constants:a}={}){if(!i||!r||
!s||!a)throw new Error("Missing required initialization data for headless MPM");return n||(n=(await u()).device),o=i,t=m(
{device:n,particleCount:o,gridSize:r,iterations:e,blockOptions:s,constants:a}),{ok:!0}}async function w({steps:i=1,diagnostics:r=!1}={}){
if(!t)throw new Error("Simulation not initialized");const e=Math.max(0,Math.floor(i));for(let l=0;l<e;l++)t.step();if(!r)
return{steps:e};const{mass:s,momentum:a}=await f(n,t.buffers.particleBuffer,o);return{steps:e,mass:s,momentum:a}}function h(){
return t=null,o=0,{ok:!0}}export{M as initHeadlessSim,h as resetHeadlessSim,w as stepHeadlessSim};
