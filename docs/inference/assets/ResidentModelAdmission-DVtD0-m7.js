class d{constructor({broker:r}={}){if(!r?.requestLease||!r.releaseLease||!r.get||!r.expireLeases)throw new TypeError("Re\
sourceLeaseBroker is required");for(const o of["cpu","gpu"])if(!(r.reportPressure().pools[o]?.memoryBytes>0))throw new Error(
`An explicit ${o} memory budget is required for inference`);this.broker=r}async acquire({sessionId:r,manifestCid:o,estimatedCpuBytes:i,
estimatedGpuBytes:n}){for(const e of[i,n])if(!Number.isSafeInteger(e)||e<=0)throw new RangeError("Invalid resident memor\
y envelope");const s=[];try{for(const[e,a]of[["cpu",i],["gpu",n]])s.push(await this.broker.requestLease({resourceKind:e,
memoryBytes:a,rootTaskId:r,serviceId:"model-inference",units:1,resident:!0,preemptable:!1,priorityClass:"interactive",lifetime:"\
owner",metadata:{manifestCid:o,policy:"configured-resident-envelope"}}))}catch(e){throw await Promise.all(s.map(a=>this.
broker.releaseLease(a.leaseId))),e}let t=!1;const l=()=>{if(this.broker.expireLeases(),t||s.some(e=>this.broker.get(e.leaseId)?.
status!=="active"))throw Object.assign(new Error("Resident admission was revoked or is unavailable; unload the model bef\
ore reuse"),{code:"ERR_RESIDENT_ADMISSION_INACTIVE"})};return{leaseIds:s.map(e=>e.leaseId),assertActive:l,assertActiveSync:l,
release:async()=>{t||(await Promise.all(s.map(e=>this.broker.releaseLease(e.leaseId))),t=!0)}}}}export{d as ResidentModelAdmission};
