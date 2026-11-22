import{f as u,s as y,v as g}from"./main-DG8uJQCI.js";import{P as w,r as l}from"./protocol-CGByeYkR.js";const h=t=>new Uint8Array(
t.buffer,t.byteOffset,t.byteLength),d=t=>u(y(h(t)));function I(t,c,i){const{signal:n}=i;let r;return{task:(async()=>{try{
for(;!n.aborted;){const e=await t.read(n);if(e.requestId!==c)throw new Error("Inference control request ID mismatch");if(e.
type==="cancel")throw new Error("Remote request cancelled");if(e.type!=="result-credit"||!r||e.offset!==r.offset)throw new Error(
"Unexpected inference result credit");const a=r;r=null,a.resolve()}}catch(e){i.abort(e)}finally{r?.reject(n.reason??new Error(
"Inference control stream closed")),r=null}})(),expect(e){if(n.throwIfAborted(),r)throw new Error("Overlapping inference\
 result credit");const a=new Promise((o,f)=>{r={offset:e,resolve:o,reject:f}});return a.catch(()=>{}),a}}}function E(t){
return g(t),l({...t,sha256:d(t.data)})}async function R(t,{image:c,metadata:i,requestId:n,controls:r,signal:s}){const e=h(
c.data),a=r.expect(0);await t.write({type:"result-image",requestId:n,image:i},s),await a;for(let o=0;o<e.length;){const f=Math.
min(o+w.imageChunkBytes,e.length),m=r.expect(f);await t.rpc.write(e.subarray(o,f),{signal:s}),await m,o=f}}async function x(t,{
image:c,requestId:i,signal:n}){const r=l(c),s=new Uint8Array(r.width*r.height*4);await t.write({type:"result-credit",requestId:i,
offset:0},n);let e=0;for(;e<s.length;){const a=await t.rpc.read({signal:n});if(!a.byteLength||a.byteLength>w.imageChunkBytes||
a.byteLength>s.length-e)throw new Error("Invalid generated image transfer frame");if(s.set(a.subarray(),e),e+=a.byteLength,
e===s.length&&d(s)!==r.sha256)throw new Error("Generated image digest mismatch");await t.write({type:"result-credit",requestId:i,
offset:e},n)}return{...r,data:s}}export{E as d,d as i,I as m,x as r,R as w};
