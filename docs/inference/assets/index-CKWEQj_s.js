const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-doVKNvU_.js","./main-BCX3ywto.css"])))=>i.map(i=>d[i]);
(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.
querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const e of r)if(e.type==="childList")for(const n of e.
addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function i(r){
const e={};return r.integrity&&(e.integrity=r.integrity),r.referrerPolicy&&(e.referrerPolicy=r.referrerPolicy),r.crossOrigin===
"use-credentials"?e.credentials="include":r.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}
function a(r){if(r.ep)return;r.ep=!0;const e=i(r);fetch(r.href,e)}})();const y="modulepreload",b=function(t,o){return new URL(
t,o).href},w={},E=function(o,i,a){let r=Promise.resolve();if(i&&i.length>0){let n=function(l){return Promise.all(l.map(c=>Promise.
resolve(c).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const s=document.getElementsByTagName(
"link"),f=document.querySelector("meta[property=csp-nonce]"),h=f?.nonce||f?.getAttribute("nonce");r=n(i.map(l=>{if(l=b(l,
a),l in w)return;w[l]=!0;const c=l.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(!!a)for(let m=s.length-1;m>=0;m--){const g=s[m];
if(g.href===l&&(!c||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${d}`))return;const u=document.
createElement("link");if(u.rel=c?"stylesheet":y,c||(u.as="script"),u.crossOrigin="",u.href=l,h&&u.setAttribute("nonce",h),
document.head.appendChild(u),c)return new Promise((m,g)=>{u.addEventListener("load",m),u.addEventListener("error",()=>g(
new Error(`Unable to preload CSS for ${l}`)))})}))}function e(n){const s=new Event("vite:preloadError",{cancelable:!0});
if(s.payload=n,window.dispatchEvent(s),!s.defaultPrevented)throw n}return r.then(n=>{for(const s of n||[])s.status==="re\
jected"&&e(s.reason);return o().catch(e)})},L="peercompute:pages-isolation:v1:";function v(t,o){return t.controller?.scriptURL===
o}function P(t,o,i){return v(t,o)?Promise.resolve():new Promise((a,r)=>{const e=()=>{t.removeEventListener("controllerch\
ange",n),i.removeEventListener("abort",s)},n=()=>{v(t,o)&&(e(),a())},s=()=>{e(),r(i.reason)};t.addEventListener("control\
lerchange",n),i.addEventListener("abort",s,{once:!0}),i.aborted?s():n()})}async function I({scope:t=globalThis,timeoutMs:o=3e3}={}){
const i=e=>({status:"unavailable",reloading:!1,reason:String(e?.message??e).slice(0,240)});if(t.crossOriginIsolated===!0)
return{status:"isolated",reloading:!1};if(!t.isSecureContext||!t.navigator?.serviceWorker)return i("This browser context\
 cannot install the isolation service worker");const a=new AbortController;let r;try{if(!Number.isFinite(o)||o<1||o>1e4)
throw new Error("Invalid isolation startup deadline");const e=new URL("./",t.location.href),n=new URL("pages-isolation-s\
w.js",e).href,s=t.navigator.serviceWorker;if(s.controller&&!v(s,n))return i("Another service worker controls this page");
const f=`${L}${e.pathname}`;if(t.sessionStorage.getItem(f))return i("Isolation reload was already attempted");const h=new Promise(
(c,d)=>{r=setTimeout(()=>{const p=new Error("Isolation startup timed out");a.abort(p),d(p)},o)}),l=(async()=>{await s.register(
n,{scope:e.href,type:"module",updateViaCache:"none"}),a.signal.throwIfAborted(),await P(s,n,a.signal)})();return await Promise.
race([l,h]),t.sessionStorage.setItem(f,"attempted"),t.location.reload(),{status:"reloading",reloading:!0,workerUrl:n,scope:e.
href}}catch(e){return i(e)}finally{clearTimeout(r),a.abort(new Error("Isolation startup finished"))}}async function _(t,o={}){
const i=o.scope??globalThis,a=await I(o);if(i.__peercomputeIsolation=a,!a.reloading)return t()}_(()=>E(()=>import("./main-doVKNvU_.js").
then(t=>t.bv),__vite__mapDeps([0,1]),import.meta.url));export{E as _};
