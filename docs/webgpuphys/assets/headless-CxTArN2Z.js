import{s as m,a as h,u as E}from"./diagnostics-B6-wCMvy.js";class w{constructor(e){this.device=e,this.domains=[]}addDomain(e){
return this.domains.push(e),e}step(e,s){const n=!!s,o=s??this.device.createCommandEncoder({label:"engine-step"});let i=!1;
for(const t of this.domains)!t||typeof t.step!="function"||(t.step.length>=2?(t.step(o,e),i=!0):t.step(e));if(!n){const t=o.
finish();i&&this.device.queue.submit([t])}}}function D(a){const{device:e,particleCount:s,gridSize:n,iterations:o,constants:i,
posVelBuffer:t,particleData:u,blockOptions:p={}}=a;if(!e)throw new Error("device is required");if(!s)throw new Error("pa\
rticleCount is required");if(!n)throw new Error("gridSize {x,y,z} is required");const r=m(e,{particleCount:s,gridSize:n,
posVelBuffer:t,constants:i,iterations:o}),f=u??h({count:s,gridSize:n,...p});E(e,r.buffers.particleBuffer,f);const c=new w(
e);return c.addDomain(r.domain),{engine:c,...r,step:(l=i&&i.dt||.2)=>{const d=e.createCommandEncoder({label:"mpm-headles\
s-step"});r.domain.step(d,l),e.queue.submit([d.finish()])}}}export{D as c};
