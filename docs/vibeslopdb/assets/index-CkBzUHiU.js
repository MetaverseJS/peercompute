const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./main-DG4RwMeI.js","./carnageWindow-Ta-Zfo9P.js","./preload-helper-FD8EeCEm.js"])))=>i.map(i=>d[i]);
import{_ as g}from"./preload-helper-FD8EeCEm.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&
o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(
t=>{for(const e of t)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(
s)}).observe(document,{childList:!0,subtree:!0});function n(t){const e={};return t.integrity&&(e.integrity=t.integrity),
t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin===
"anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=n(t);fetch(t.
href,e)}})();const p="peercompute:pages-isolation:v1:";function l(r,o){return r.controller?.scriptURL===o}function h(r,o,n){
return l(r,o)?Promise.resolve():new Promise((i,t)=>{const e=()=>{r.removeEventListener("controllerchange",s),n.removeEventListener(
"abort",a)},s=()=>{l(r,o)&&(e(),i())},a=()=>{e(),t(n.reason)};r.addEventListener("controllerchange",s),n.addEventListener(
"abort",a,{once:!0}),n.aborted?a():s()})}async function w({scope:r=globalThis,timeoutMs:o=3e3}={}){const n=e=>({status:"\
unavailable",reloading:!1,reason:String(e?.message??e).slice(0,240)});if(r.crossOriginIsolated===!0)return{status:"isola\
ted",reloading:!1};if(!r.isSecureContext||!r.navigator?.serviceWorker)return n("This browser context cannot install the \
isolation service worker");const i=new AbortController;let t;try{if(!Number.isFinite(o)||o<1||o>1e4)throw new Error("Inv\
alid isolation startup deadline");const e=new URL("./",r.location.href),s=new URL("pages-isolation-sw.js",e).href,a=r.navigator.
serviceWorker;if(a.controller&&!l(a,s))return n("Another service worker controls this page");const c=`${p}${e.pathname}`;
if(r.sessionStorage.getItem(c))return n("Isolation reload was already attempted");const d=new Promise((y,m)=>{t=setTimeout(
()=>{const u=new Error("Isolation startup timed out");i.abort(u),m(u)},o)}),f=(async()=>{await a.register(s,{scope:e.href,
type:"module",updateViaCache:"none"}),i.signal.throwIfAborted(),await h(a,s,i.signal)})();return await Promise.race([f,d]),
r.sessionStorage.setItem(c,"attempted"),r.location.reload(),{status:"reloading",reloading:!0,workerUrl:s,scope:e.href}}catch(e){
return n(e)}finally{clearTimeout(t),i.abort(new Error("Isolation startup finished"))}}async function v(r,o={}){const n=o.
scope??globalThis,i=await w(o);if(n.__peercomputeIsolation=i,!i.reloading)return r()}v(()=>g(()=>import("./main-DG4RwMeI.js"),
__vite__mapDeps([0,1,2]),import.meta.url));
