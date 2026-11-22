const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./VoiceSession-CoeTb2Rg.js","./carnageWindow--1fjkU2y.js","./preload-helper-FD8EeCEm.js"])))=>i.map(i=>d[i]);
import{_ as No}from"./preload-helper-FD8EeCEm.js";import{x as Wo,y as mo,z as Vo,A as zn,B as Ko}from"./runtime-Du_G56TU.js";
import{b$ as Yo,c0 as ln,c1 as Xo}from"./carnageWindow--1fjkU2y.js";import{C as Cn,I as Jo,e as Zn,u as Zo,r as Qo,D as ea,
w as ta,y as na,d as go}from"./protocol-DXyXEBPY.js";import{i as oa,d as aa,w as ra,r as ia}from"./imageResult-D7BE3LAT.js";
import"./legacy-BvOuzvd-.js";function sa(t){const n=new URL(t),a=n.searchParams.get("prod")==="1"?"prod":n.searchParams.
get("dev")==="1"?"dev":null,o=["5189","5176","5187"].includes(n.port)&&/^\/(?:index\.html)?$/.test(n.pathname);return o?
(n.port="4173",n.pathname="/"):n.pathname=n.pathname.replace(/\/(?:inference|cubechat|earth)(?:\/index\.html|\/)?$/,"/"),
n.search=a?`?${a}=1`:o?"?dev=1":"",n.hash="",n.href}const Lt=(t,n,a)=>{const o=document.createElement(t);return n&&(o.className=
n),a!==void 0&&(o.textContent=a),o},Bn=t=>Number.isSafeInteger(t)&&t>=0?t:null,Qn=t=>String(t?.message??t??"").trim().slice(
0,256),la=new Map([["text-generation","Text generation"],["image-text-to-text","Vision chat"],["text-to-image","Image ge\
neration"],["image-to-3d","3D generation"],["automatic-speech-recognition","Speech recognition"],["text-to-speech","Spee\
ch synthesis"]]);function ca(t){const n=new Map;for(const a of Array.isArray(t)?t:[]){const o=typeof a?.manifestCid=="st\
ring"?a.manifestCid.trim():"";if(!o||a.local===!0||a.available!==!0)continue;n.has(o)||n.set(o,{cid:o,name:Qn(a.name)||"\
Unnamed model",capability:la.get(a.task),hosts:new Map,hasHostList:!1,fallbackCount:0,fallbackBusy:!0});const i=n.get(o);
if(Array.isArray(a.hosts)){i.hasHostList=!0;for(const l of a.hosts)l?.local===!0||typeof l?.peerId!="string"||!l.peerId.
trim()||i.hosts.set(l.peerId,(i.hosts.get(l.peerId)??!0)&&l.busy===!0)}else{const l=Bn(a.providerCount)??0;i.fallbackCount=
Math.max(i.fallbackCount,l),l>0&&(i.fallbackBusy&&=a.busy===!0)}}return[...n.values()].map(a=>({cid:a.cid,name:a.name,capability:a.
capability,peerCount:a.hasHostList?a.hosts.size:a.fallbackCount,busy:a.hasHostList?[...a.hosts.values()].every(Boolean):
a.fallbackBusy})).filter(a=>a.peerCount>0).sort((a,o)=>a.name.localeCompare(o.name)||a.cid.localeCompare(o.cid))}function da({
container:t,onVisibilityChange:n}={}){if(!t?.append)throw new TypeError("A network status container is required");const a=Lt(
"button","pc-network-trigger");a.type="button",a.setAttribute("aria-label","Network status"),a.setAttribute("aria-haspop\
up","dialog"),a.setAttribute("aria-expanded","false");const o=document.createElementNS("http://www.w3.org/2000/svg","svg");
o.setAttribute("viewBox","0 0 24 24"),o.setAttribute("aria-hidden","true"),o.setAttribute("focusable","false");for(const[
L,G]of[["path",{d:"M12 8v4M5 16v-4h14v4"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1"}],["rect",{x:"2",y:"16",width:"\
6",height:"6",rx:"1"}],["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1"}]]){const Y=document.createElementNS(o.namespaceURI,
L);for(const[p,C]of Object.entries(G))Y.setAttribute(p,C);o.append(Y)}a.append(o);const i=Lt("section","pc-network-popov\
er");i.id=`pc-network-${crypto.randomUUID()}`,i.setAttribute("role","dialog"),i.setAttribute("aria-modal","false"),i.tabIndex=
-1,i.hidden=!0;const l=typeof i.showPopover=="function";l&&i.setAttribute("popover","manual"),a.setAttribute("aria-contr\
ols",i.id);const s=Lt("h2","","Network status");s.id=`${i.id}-title`,i.setAttribute("aria-labelledby",s.id);const f=Lt("\
button","pc-network-close","×");f.type="button",f.setAttribute("aria-label","Close network status");const d=Lt("div","p\
c-network-header");d.append(s,f);const b=Lt("p","pc-network-state"),g=Lt("p","pc-network-summary");g.id=`${i.id}-status`,
g.setAttribute("role","status"),g.setAttribute("aria-live","polite"),g.setAttribute("aria-atomic","true"),i.setAttribute(
"aria-describedby",g.id),i.append(d,b,g);const y=Lt("h3","pc-network-models-heading","Peer inference models");y.id=`${i.
id}-models`;const h=Lt("ul","pc-network-models");h.setAttribute("aria-labelledby",y.id);const S=Lt("p","pc-network-model\
s-empty");i.append(y,h,S),t.append(a,i);let k=!1,x=!1,T="",m="";function D(){if(!k||x)return;const L=window.visualViewport,
G=L?.offsetLeft??0,Y=L?.offsetTop??0,p=L?.width??window.innerWidth,C=L?.height??window.innerHeight,q=8,X=Math.max(1,p-q*
2),K=Math.max(1,C-q*2);i.style.width=`${Math.min(360,X)}px`,i.style.maxHeight=`${K}px`;const te=a.getBoundingClientRect(),
ne=i.getBoundingClientRect(),qe=G+q,_e=G+p-q-ne.width,Se=Y+q,ie=Y+C-q-ne.height,Oe=te.bottom+q,Pe=Oe<=ie?Oe:te.top-q-ne.
height;i.style.left=`${Math.max(qe,Math.min(te.right-ne.width,_e))}px`,i.style.top=`${Math.max(Se,Math.min(Pe,ie))}px`}function e({
restoreFocus:L=!0}={}){if(!k)return;const G=i.contains(document.activeElement)||document.activeElement===a;k=!1,a.setAttribute(
"aria-expanded","false"),l&&i.matches(":popover-open")&&i.hidePopover(),i.hidden=!0,L&&G&&a.isConnected&&!a.disabled&&a.
getClientRects().length&&a.focus({preventScroll:!0}),n?.(!1)}function O(){x||k||!a.isConnected||a.disabled||(k=!0,i.hidden=
!1,a.setAttribute("aria-expanded","true"),l&&i.showPopover(),D(),i.focus({preventScroll:!0}),n?.(!0))}function Q(){k?e():
O()}function E(L){!k||L.composedPath().includes(i)||L.composedPath().includes(a)||e({restoreFocus:!1})}function $(L){k&&
L.key==="Escape"&&(L.preventDefault(),L.stopPropagation(),e())}function U(){l&&k&&!i.matches(":popover-open")&&e()}a.addEventListener(
"click",Q),f.addEventListener("click",e),document.addEventListener("pointerdown",E,!0),document.addEventListener("keydow\
n",$,!0),i.addEventListener("toggle",U),window.addEventListener("resize",D),window.addEventListener("scroll",D,!0),window.
visualViewport?.addEventListener("resize",D),window.visualViewport?.addEventListener("scroll",D);function H(L={}){if(x)return T;
const G=L.connected===!0,Y=L.connecting===!0,p=Bn(L.peerCount),C=Bn(L.sharedModelCount),q=Bn(L.hostedModelCount),X=Qn(L.
issue),K=Qn(L.artifacts?.error),te=L.artifacts?.status,ne=!G&&!Y?"offline":G&&p>0&&C>0&&q>0?"healthy":"pending",qe={healthy:"\
Healthy",pending:"Pending",offline:"Offline"}[ne],Se=[G?`Peer network connected${p!==null?` · ${p} peers`:" · peer coun\
t unknown"} · ${C!==null?C:"Unknown"} shared models · ${q!==null?q:"Unknown"} hosted models.`:Y?"Connecting to peer ne\
twork…":"Peer network is offline."];X?Se.push("Discovery issue: "+X):G&&p===0?Se.push("Waiting for other peers."):G&&q===
0&&Se.push("No peer is currently advertising a loaded model for inference."),te==="starting"&&Se.push("File sharing is p\
reparing stored models. Inference discovery remains available."),te==="error"||K?Se.push("File sharing unavailable: "+(K||
"Initialization failed")):G&&te==="offline"&&Se.push("File sharing is offline. Inference discovery remains available."),
T=Se.join(" "),a.dataset.state=i.dataset.state=ne,a.title=`Network status — ${qe}`,a.setAttribute("aria-description",`\
Network state: ${qe}.`),b.textContent=qe,g.textContent!==T&&(g.textContent=T);const ie=ca(G?L.inferenceModels:[]),Oe=JSON.
stringify(ie);if(Oe!==m){m=Oe;const Pe=i.scrollTop;h.replaceChildren(...ie.map(Ne=>{const pe=Lt("li","pc-network-model");
pe.dataset.modelCid=Ne.cid;const ge=Lt("span");return ge.append(Lt("span","pc-network-model-name",Ne.name)),Ne.capability&&
ge.append(Lt("span","pc-network-model-capability",Ne.capability)),pe.append(ge,Lt("span","pc-network-model-hosts",`${Ne.
peerCount} peer${Ne.peerCount===1?"":"s"}${Ne.busy?" · busy":""}`)),pe})),i.scrollTop=Pe}return h.hidden=ie.length===0,
S.hidden=ie.length>0,S.textContent=G?"No peer inference models are available.":Y?"Waiting for the peer network…":"Conn\
ect to the peer network to discover models.",D(),T}return H(),{trigger:a,element:i,status:g,update:H,close:e,dispose(){x||
(e({restoreFocus:!1}),x=!0,a.removeEventListener("click",Q),f.removeEventListener("click",e),document.removeEventListener(
"pointerdown",E,!0),document.removeEventListener("keydown",$,!0),i.removeEventListener("toggle",U),window.removeEventListener(
"resize",D),window.removeEventListener("scroll",D,!0),window.visualViewport?.removeEventListener("resize",D),window.visualViewport?.
removeEventListener("scroll",D),i.remove(),a.remove())}}}const I=(t,n,a)=>{const o=document.createElement(t);return n!==
void 0&&(o.textContent=n),a&&(o.className=a),o},Ae=(t,n)=>{const a=I("button",t);return a.type="button",n&&a.setAttribute(
"aria-label",n),a},Ft=(t,n)=>{const a=I("label",t);return a.append(n),a},bo=(t,n,a)=>{const o=I("label",void 0,"pc-chat-\
toggle");o.title=n,t.type="checkbox",t.setAttribute("aria-label",n);const i=document.createElementNS("http://www.w3.org/\
2000/svg","svg");i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("aria-hidden","true"),i.setAttribute("focusable","\
false");for(const s of a){const f=document.createElementNS(i.namespaceURI,"path");f.setAttribute("d",s),i.append(f)}const l=I(
"span",void 0,"pc-chat-toggle-glyph");return l.setAttribute("aria-hidden","true"),l.append(i),o.append(t,l),o};function cn(t,{
dismissible:n=!0}={}){const a=I("dialog",void 0,"pc-model-dialog"),o=I("h2",t);o.id=`model-dialog-${crypto.randomUUID()}`,
a.setAttribute("aria-labelledby",o.id);const i=I("div",void 0,"pc-dialog-header");if(i.append(o),n){const f=Ae("Done");f.
autofocus=!0,f.onclick=()=>a.close(),i.append(f)}const l=I("div",void 0,"pc-dialog-body"),s=I("p","","pc-inference-statu\
s");return s.setAttribute("role","status"),a.append(i,l,s),a.addEventListener("keydown",f=>{if(f.key!=="Tab")return;const d=[
...a.querySelectorAll("button,input,select,textarea,a[href],[tabindex]")].filter(y=>!y.disabled&&y.tabIndex>=0&&y.getClientRects().
length);if(!d.length){f.preventDefault(),a.focus();return}const b=d[0],g=d.at(-1);(f.shiftKey&&document.activeElement===
b||!f.shiftKey&&document.activeElement===g)&&(f.preventDefault(),(f.shiftKey?g:b)?.focus())}),{element:a,body:l,status:s}}
function en(t){return!Number.isSafeInteger(t)||t<0?"Unknown size":t>=1024**3?`${(t/1024**3).toFixed(2)} GiB`:t>=1024**2?
`${(t/1024**2).toFixed(1)} MiB`:`${Math.ceil(t/1024)} KiB`}function ua(t){const n=a=>Number.isSafeInteger(a.totalBytes)&&
a.totalBytes>=0?a.totalBytes:1/0;return[...t].sort((a,o)=>n(a)-n(o)||String(a.name).localeCompare(String(o.name))||String(
a.key??a.manifestCid).localeCompare(String(o.key??o.manifestCid)))}function pa(t){const n=I("section",void 0,"pc-inferen\
ce-panel");n.setAttribute("aria-label","Model chat");const a=I("nav",void 0,"pc-console-navigation");a.setAttribute("ari\
a-label","Console navigation");const o=I("a","←","pc-console-back");o.href=sa(location.href),o.setAttribute("aria-labe\
l","Back to demo overview"),o.title="Back to demo overview";const i=Ae("☰","Menu");i.title="Menu",i.className="pc-icon\
-button";const l=I("div",void 0,"pc-navigation-main"),s=I("div",void 0,"pc-navigation-actions");l.append(o),s.append(i),
a.append(l,s),n.append(a);const f=Ae("Models");f.setAttribute("aria-haspopup","dialog");const d=Ae("Agents");d.setAttribute(
"aria-haspopup","dialog"),d.disabled=!0;const b=Ae("Models"),g=Ae("Config","Configure model chat");b.setAttribute("aria-\
haspopup","dialog");const y=cn("Config"),h=cn("Model setup"),S=cn("About PeerCompute"),k=cn("Chat options"),x=k.element;
x.classList.add("pc-chat-options"),k.status.hidden=!0;const T=Ae("⚙","Chat options");T.title="Chat options",T.className=
"pc-chat-icon";const m=I("section",void 0,"pc-model-library"),D=I("div",void 0,"pc-dialog-body"),e=I("p","","pc-inferenc\
e-status");e.setAttribute("role","status"),m.append(D);const O=cn("Leave model console?",{dismissible:!1}),Q=Ae("Stay he\
re"),E=Ae("Leave");Q.autofocus=!0,O.body.append(I("p","Are you sure? Leaving stops the models and inference hosted by th\
is page. Stored model files remain on this device."),Q,E);const $=cn("Loading model",{dismissible:!1}),U=$.element;U.classList.
add("pc-model-loading"),U.tabIndex=-1;const H=I("span",void 0,"pc-loading-spinner");H.setAttribute("aria-hidden","true");
const L=I("strong","","pc-loading-model"),G=Ae("Cancel");G.autofocus=!0,$.status.id=`model-load-progress-${crypto.randomUUID()}`,
$.status.setAttribute("aria-live","polite"),$.status.setAttribute("aria-atomic","true"),U.setAttribute("aria-describedby",
$.status.id),$.body.append(H,L,$.status,G);const Y=cn("Menu"),p=Y.element;p.classList.add("pc-console-menu");const C=Ae(
"About"),q=Ae("Install");q.hidden=!0,Y.body.append(b,g,C,q);const X=S.element;S.body.append(I("p","PeerCompute runs mode\
ls in your browser using WebGPU. You can chat with a model on this device or use inference hosted by another peer.")),S.
body.append(I("p","Model files are identified by their content and shared over IPFS. File sharing and hosted inference a\
re available while the hosting browser stays online."));const K=I("ul",void 0,"pc-about-links");for(const[V,et]of[["Tsot\
chke-Corporation on Hugging Face","https://huggingface.co/Tsotchke-Corporation"],["tsotchke.org","https://tsotchke.org"],
["tsotchke.net","https://tsotchke.net"]]){const St=I("a",V);St.href=et,St.target="_blank",St.rel="noopener noreferrer";const on=I(
"li");on.append(St),K.append(on)}S.body.append(K);const te=y.element,ne=h.element,qe=I("strong"),_e=I("p","","pc-inferen\
ce-note"),Se=I("select"),ie=I("select");Se.setAttribute("aria-label","Browser"),ie.setAttribute("aria-label","Operating \
system");for(const[V,et]of[["chrome","Chrome"],["chromium","Chromium"],["edge","Edge"],["brave","Brave"],["firefox","Fir\
efox"],["safari","Safari"],["other","Other browser"]]){const St=I("option",et);St.value=V,Se.append(St)}for(const[V,et]of[
["linux","Linux"],["windows","Windows"],["macos","macOS"],["android","Android"],["ios","iOS / iPadOS"],["other","Other s\
ystem"]]){const St=I("option",et);St.value=V,ie.append(St)}const Oe=I("div",void 0,"pc-config-grid");Oe.append(Ft("Brows\
er",Se),Ft("Operating system",ie));const Pe=I("div",void 0,"pc-model-help-details"),Ne=I("textarea");Ne.readOnly=!0,Ne.rows=
3,Ne.setAttribute("aria-label","Browser launch command"),Ne.spellcheck=!1;const pe=Ae("Copy command"),ge=Ae("Open Config"),
le=I("div",void 0,"pc-model-help-command");le.append(Ne,pe),h.body.append(qe,_e,Oe,I("p","Browser detection is approxima\
te. Adjust these choices if needed.","pc-inference-note"),Pe,le,ge);for(const[V,et]of[[g,te],[C,X],[i,p],[T,x]])et.id=`m\
odel-window-${crypto.randomUUID()}`,V.setAttribute("aria-controls",et.id),V.setAttribute("aria-haspopup","dialog");const ve=I(
"div",void 0,"pc-model-toolbar");ve.append(f,d),l.append(ve);const _=I("input");_.type="checkbox",_.checked=!0;const W=I(
"input");W.type="checkbox",W.checked=!0;const ee=I("div",void 0,"pc-model-preferences"),ce=Ft("Share with peers",_);ce.prepend(
_),ce.title="Share imported model files with connected peers while this browser stays online.";const at=Ft("Host inferen\
ce",W);at.prepend(W),at.title="Allow connected peers to send requests to compatible models loaded on this device.";const mt=I(
"input");mt.type="checkbox";const tt=Ft("Share model compatibility observations",mt);tt.prepend(mt),tt.title="Send signe\
d inspection and execution results, runtime versions and coarse device/resource facts to the root registry. Prompts, ima\
ges and generated content stay private.",ee.append(ce,at,tt),y.body.append(ee),y.body.append(I("p","Model observations a\
re saved locally. Sharing is optional and sends no chat content. Browser memory estimates are not measured physical VRAM\
.","pc-browser-note"));const Le=I("p","Opening model chat…","pc-inference-status pc-status-quiet");Le.setAttribute("ro\
le","status"),n.append(Le);const rt=I("input");rt.type="number",rt.min="1",rt.max="99999",rt.value="99999",rt.setAttribute(
"aria-label","GGUF GPU layer limit");const Ke=I("div",void 0,"pc-config-grid"),Ue=I("input"),nt=I("input");for(const V of[
Ue,nt])V.type="number",V.min="0",V.max="1024",V.step="any",V.placeholder="Auto";Ke.append(Ft("Model RAM budget (GiB)",Ue),
Ft("Model GPU memory budget (GiB)",nt));const ue=I("p","","pc-inference-note");y.body.append(Ke,ue);const xe=I("p","","p\
c-inference-note");xe.setAttribute("aria-label","Estimated model memory reservations"),y.body.append(xe);const dt=I("div",
void 0,"pc-config-grid");dt.append(Ft("GGUF GPU layers",rt)),y.body.append(dt),y.body.append(I("p","99999 uses all GPU l\
ayers. The 27B model was tested with 56 layers on an RTX 5060 Ti (16 GB), with a compatible browser.","pc-inference-note"));
const it=I("input");it.placeholder="Optional relay multiaddress",it.setAttribute("aria-label","Artifact relay multiaddre\
ss");const Nt=Ae("Connect"),xt=I("div",void 0,"pc-config-row");xt.append(it,Nt),y.body.append(xt);const Et=I("p","","pc-\
inference-note");y.body.append(Et);const $t=I("input");$t.type="file",$t.setAttribute("aria-label","Pin a file locally"),
y.body.append(Ft("Pin a file locally",$t));const zt=Ae("Unload all local models");y.body.append(zt);const nn=Ae("Clear c\
onversation");y.body.append(nn),y.body.append(I("p","Clear chat history to start a new conversation while keeping the lo\
aded model and stored files.","pc-inference-note")),D.append(I("p","Select models, then Load selected or Delete selected\
. Loading uses compatible saved packages. Deleting also unloads selected models; files needed by other packages are kept\
. Unload keeps saved files.","pc-inference-note"));const be=I("ul",void 0,"pc-stored-models");be.setAttribute("aria-labe\
l","Stored model packages");const ke=Ae("Refresh"),Ye=Ae("Stop loading");Ye.hidden=!0;const gt=Ae("Load selected");gt.disabled=
!0;const bt=Ae("Delete selected");bt.disabled=!0,bt.className="pc-delete-model";const je=Ae("Add LoRA");je.disabled=!0,je.
title="Select one stored GGUF model to add an adapter";const Fe=I("p","0 models selected.","pc-inference-note");Fe.setAttribute(
"aria-live","polite");const yt=I("div",void 0,"pc-stored-footer"),Xe=I("div",void 0,"pc-stored-footer-actions");Xe.append(
gt,bt,je,ke,Ye),yt.append(Fe,Xe),D.append(be),m.append(yt,e);const Je=I("div",void 0,"pc-inference-transcript");Je.setAttribute(
"role","log"),Je.setAttribute("aria-label","Conversation"),Je.setAttribute("aria-live","polite");const wt=I("p","Open Mo\
dels to load one, or use ⚙ to choose a peer model.","pc-chat-empty");Je.append(wt),n.append(Je);const vt=I("div",void 0,
"pc-inference-actions");n.append(vt);const Ze=I("div",void 0,"pc-chat-attachment");Ze.hidden=!0;const kt=I("img");kt.alt=
"Selected image";const Wt=I("span"),ft=Ae("×","Remove attached image");Ze.append(kt,Wt,ft),n.append(Ze);const It=I("tex\
tarea");It.rows=2,It.maxLength=16e3,It.placeholder="Message…",It.setAttribute("aria-label","Message"),n.append(It);const Ot=I(
"input"),Ct=I("input"),Rt=bo(Ot,"Generate image",["M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-\
1Z","M3 17l6-6 4 4 3-3 5 5","M16 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"]),B=I("div",void 0,"pc-inference-note");B.hidden=!0,B.setAttribute(
"aria-live","polite");const Dt=Ae("Use text chat");B.append(I("span","Image generation is unavailable for this chat targ\
et. Your image prompt is kept. "),Dt),n.append(B);const pn=bo(Ct,"Speak replies",["M6 9a6 6 0 0 1 12 0c0 4-4 5-4 8a4 4 0\
 0 1-8 0","M10 10a2 2 0 1 1 4 0c0 2-3 2-3 5"]),Tt=I("input");Tt.type="checkbox",Tt.checked=!0;const Vt=I("div",void 0,"p\
c-model-preferences pc-conversation-options");Vt.append(Ft("Be concise",Tt));const Kt=I("p","","pc-inference-note pc-rou\
te-policy");Kt.setAttribute("aria-live","polite");const Qe=I("select");Qe.setAttribute("aria-label","Chat target"),k.body.
append(Ft("Chat target",Qe),Vt,Kt);const Ut=Ae("+","Attach image");Ut.title="Attach an image",Ut.className="pc-chat-icon";
const st=I("input");st.type="file",st.accept="image/png,image/jpeg,image/webp,image/gif",st.hidden=!0,st.setAttribute("a\
ria-label","Choose image attachment");const he=Ae("Resume agent");he.hidden=!0,n.append(he);const Yt=Ae("Send"),lt=Ae("T\
alk"),fe=Ae("Stop");fe.hidden=!0,Yt.className="pc-chat-send",fe.className="pc-chat-stop",lt.title="Hold to record a voic\
e message; release to send. Load a speech-recognition model or use a compatible peer.";const Ee=I("div",void 0,"pc-chat-\
controls");Ee.append(T,Ut,st,Rt,pn,lt,Yt,fe),n.append(Ee),n.append(te,ne,X,p,x,U,O.element);const At=da({container:n});return s.
prepend(At.trigger),t.append(n),{panel:n,browse:f,agents:d,networkInfo:At,discoveryStatus:At.status,modelsMenu:b,configure:g,
chatConfigure:T,chatOptions:x,chatOptionsStatus:k.status,sharing:_,hosting:W,shareEvidence:mt,status:Le,configuration:te,
configurationStatus:y.status,storedContent:m,storedList:be,storedRefresh:ke,storedCancel:Ye,storedLoadSelected:gt,storedDeleteSelected:bt,
storedAddLora:je,storedSelection:Fe,storedStatus:e,gpuLayers:rt,leaveConfirmation:O.element,leaveStatus:O.status,stay:Q,
leave:E,back:o,menu:i,menuWindow:p,menuStatus:Y.status,about:X,aboutButton:C,install:q,loading:U,loadingModel:L,loadingStatus:$.
status,loadingCancel:G,compatibility:ne,helpModel:qe,helpReason:_e,helpBrowser:Se,helpOs:ie,helpDetails:Pe,helpCommandGroup:le,
helpCommand:Ne,helpCopy:pe,helpConfig:ge,helpStatus:h.status,cpuBudget:Ue,gpuBudget:nt,memoryNote:ue,memoryPressure:xe,relay:it,
connect:Nt,networkStatus:Et,file:$t,unload:zt,clearChat:nn,transcript:Je,empty:wt,proposed:vt,attachment:Ze,attachmentImage:kt,
attachmentName:Wt,removeAttachment:ft,prompt:It,target:Qe,attach:Ut,imageFile:st,send:Yt,cancel:fe,talk:lt,generateImage:Ot,
imageUnavailable:B,useTextChat:Dt,speakReplies:Ct,beConcise:Tt,modeStatus:Kt,resumeAgent:he}}function fa(t,n){t.helpModel.
textContent=n.name,t.helpReason.textContent=n.reason,t.helpDetails.replaceChildren();for(const a of n.paragraphs)t.helpDetails.
append(I("p",a,"pc-inference-note"));if(n.steps.length){const a=I("ol");for(const o of n.steps)a.append(I("li",o));t.helpDetails.
append(a)}for(const a of n.links){const o=I("a",a.label);o.href=a.url,o.target="_blank",o.rel="noopener noreferrer";const i=I(
"p",void 0,"pc-inference-note");i.append(o),t.helpDetails.append(i)}t.helpCommand.value=n.command??"",t.helpCommandGroup.
hidden=!n.command,t.helpConfig.hidden=!n.openConfig,t.helpStatus.textContent=""}function Sn(t){return!!t.manifestCid}function yo(t){
return Sn(t)&&!t.loaded&&!t.cleanupPending&&!t.needsVerification&&!["checking","unavailable"].includes(t.localAvailability?.
status)}function ha(t,n,{selected:a=new Set,onSelect:o,onRecover:i,onUnload:l}={}){t.storedList.replaceChildren(),n.length||
t.storedList.append(I("li","No models stored on this device.","pc-stored-empty"));for(const s of ua(n)){const f=I("li",void 0,
"pc-stored-model");if(f.dataset.modelCid=s.manifestCid,o){const y=I("input");y.type="checkbox",y.setAttribute("aria-labe\
l",`Select ${s.name}`),y.dataset.inactive=String(!Sn(s)),y.disabled=y.dataset.inactive==="true",y.checked=!y.disabled&&a.
has(s.manifestCid),y.onchange=()=>o(s,y.checked),f.append(y)}const d=I("div");d.append(I("strong",s.name));const b=[en(s.
totalBytes),...s.loaded?["Loaded"]:[],...s.shared?["Shared"]:[],...s.cleanupPending?["Cleanup pending"]:[],...s.needsVerification?
["Needs local verification"]:[]];d.append(I("p",b.join(" · "),"pc-inference-note")),s.shareError&&d.append(I("p",`Shari\
ng unavailable: ${String(s.shareError).slice(0,256)}`,"pc-inference-note"));const g=["checking","unavailable"].includes(
s.localAvailability?.status);if(s.task==="automatic-speech-recognition"&&d.append(I("p","Speech recognition · used by Ta\
lk.","pc-inference-note")),s.task==="text-to-speech"&&d.append(I("p","Speech synthesis · used by Speak replies.","pc-in\
ference-note")),s.task==="image-to-3d"&&d.append(I("p","3D generation · used by CubeChat residents to create objects.",
"pc-inference-note")),g&&d.append(I("p",String(s.localAvailability.reason||"This model is unavailable on this device.").
slice(0,512),"pc-inference-note")),f.append(d),s.cleanupPending&&d.append(I("p","Select this model and Delete selected t\
o retry cleanup.","pc-inference-note")),s.needsVerification||s.loaded){const y=s.needsVerification?"Verify locally":"Unl\
oad",h=Ae(y,`${y} ${s.name}`);h.dataset.inactive=String(!!(s.cleanupPending||(s.needsVerification?!i:!l))),h.disabled=h.
dataset.inactive==="true",h.onclick=()=>{s.needsVerification?i?.(s):l?.(s)};const S=I("div",void 0,"pc-stored-actions");
S.append(h),f.append(S)}t.storedList.append(f)}}function Wn(t,n,a,{image:o,targetName:i}={}){t.empty.remove();const l=I(
"article",void 0,`pc-chat-message pc-chat-message-${n}`);if(l.append(I("span",n==="user"?"YOU":i||"MODEL","pc-chat-speak\
er")),o){const f=I("img");f.src=o,f.alt="Attached image",f.className="pc-chat-image",l.append(f)}const s=I("p",a);return l.
append(s),t.transcript.append(l),s}const wo=Object.freeze({chrome:"Google Chrome",chromium:"Chromium",edge:"Microsoft Ed\
ge",brave:"Brave",firefox:"Firefox",safari:"Safari",other:"Other browser"}),vo=Object.freeze({linux:"Linux",windows:"Win\
dows",macos:"macOS",android:"Android",ios:"iOS / iPadOS",other:"Other operating system"}),ko=Object.freeze({chrome:"goog\
le-chrome --enable-dawn-features=vulkan_enable_f16_on_nvidia",chromium:"chromium --enable-dawn-features=vulkan_enable_f1\
6_on_nvidia",edge:"microsoft-edge --enable-dawn-features=vulkan_enable_f16_on_nvidia",brave:"brave-browser --enable-dawn\
-features=vulkan_enable_f16_on_nvidia"}),ma="https://www.chromium.org/developers/how-tos/run-chromium-with-flags/",ga="h\
ttps://github.com/google/dawn/commit/8f96ae09bbaac54d52ca6f8aff8606ffdbe9de3f";function Vn(t,n,a=""){return typeof t!="s\
tring"?a:t.slice(0,n).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g," ").trim()||a}function Co(t,n){
return typeof t=="string"&&Object.hasOwn(n,t)?t:"other"}function Oo(t=globalThis.navigator){const{browser:n,os:a}=Yo(t);
return{browser:n,os:a}}function ba(t,{environment:n=Oo()}={}){const a=t?.localAvailability??{},o=Vn(a.code,100),i=Co(n?.
browser,wo),l=Co(n?.os,vo),s={name:Vn(t?.name,180,"Selected model"),reason:Vn(a.reason,500,"Compatibility has not been f\
ully verified."),environmentLabel:`${wo[i]} on ${vo[l]}`,paragraphs:[],steps:[],command:null,commandLabel:"",links:[],openConfig:!1};
return a.status==="checking"||o==="device_checking"?(s.paragraphs.push("The browser capability check is still running. T\
his does not mean the model is unsupported."),s.steps.push("Wait for the check to finish. If it remains pending, reload \
the page and check again.")):o==="cpu_budget_exceeded"||o==="gpu_budget_exceeded"?(s.openConfig=!0,s.paragraphs.push("Th\
e model reservation exceeds a configured memory budget. This budget is an admission limit, not a measurement of free RAM\
 or GPU memory."),s.steps.push("Open Config and review the RAM and GPU memory budgets. Raise or clear an optional limit \
only when appropriate for your device.","A shared compute pool may impose its own limit. Choose a smaller model or a pee\
r-hosted model if that limit still applies.")):o==="gpu_feature_unavailable"&&/\bshader-f16\b/i.test(s.reason)?(s.paragraphs.
push("This browser does not expose the shader-f16 feature required by this model runtime. GPU memory capacity alone does\
 not establish FP16 support."),l==="linux"&&Object.hasOwn(ko,i)?(s.command=ko[i],s.commandLabel="Optional Linux NVIDIA /\
 Vulkan launch command",s.paragraphs.push("If this Linux machine uses an NVIDIA GPU with the Chromium Vulkan backend, th\
e optional command below may expose FP16. It is specific to that backend and driver combination.","This switch overrides\
 a driver-related restriction. Older drivers may produce incorrect results or instability; exposing the feature does not\
 guarantee correct execution."),s.steps.push("Try the launch command below first. Save your work and fully exit this bro\
wser, including background processes, then run the command using your usual browser profile; do not clear site data or c\
reate a temporary profile.",`Open ${i==="edge"?"edge":"chrome"}://version and confirm the Command Line includes --enable\
-dawn-features=vulkan_enable_f16_on_nvidia. Then return to the original PeerCompute site address so its stored models re\
main available.`,"If the feature is still missing, update the browser and supported graphics driver, then check this mod\
el again.","If results are unstable, fully exit and launch normally without the switch. Choose an available model or a p\
eer-hosted model.")):(s.paragraphs.push("There is no verified launch command here for this browser and operating system.\
 Browser and driver support can vary."),s.steps.push("Update the browser and supported graphics driver, then check this \
model again.","Use a current compatible browser that exposes the required feature, or choose an available model or a pee\
r-hosted model.")),s.links.push({label:"Chromium command-line instructions",url:ma},{label:"Dawn NVIDIA FP16 driver rest\
riction",url:ga})):o==="gpu_feature_unavailable"?(s.paragraphs.push("The browser lacks a GPU feature required by this mo\
del. Support depends on the browser, GPU and driver."),s.steps.push("Update the browser and graphics driver, then rechec\
k. Use an available model or a peer-hosted model if the feature remains unavailable.")):o==="webgpu_unavailable"?(s.paragraphs.
push("The browser did not provide a supported hardware WebGPU adapter. This check does not measure the GPU’s memory capa\
city."),s.steps.push("Use the HTTPS site in an up-to-date WebGPU-capable browser. Check hardware acceleration and suppor\
ted graphics drivers.","Restart the browser and retry, or use a peer-hosted model.")):o==="gguf_crossOriginIsolated_unav\
ailable"||o==="gguf_sharedArrayBuffer_unavailable"?(s.paragraphs.push("This GGUF runtime needs cross-origin isolation an\
d SharedArrayBuffer. HTTPS alone does not enable isolation."),s.steps.push("Use the deployed HTTPS site. The site owner \
must send Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp, with compatible header\
s on required resources.","Reload after the hosting configuration is corrected. Otherwise choose an available model or a\
 peer-hosted model; do not disable browser security.")):o==="gguf_jspi_unavailable"||o==="gguf_memory64_unavailable"?(s.
paragraphs.push("This GGUF runtime needs WebAssembly JSPI and shared memory64 support. The required capability was not d\
etected in this browser."),s.steps.push("Update to a browser version that supports these runtime prerequisites and reche\
ck.","If support is still missing, choose an available ONNX model or a peer-hosted model.")):["runtime_unsupported","cat\
alog_unsupported","model_invalid","package_too_large","file_too_large"].includes(o)?(s.paragraphs.push("The package or i\
ts runtime does not meet this application’s supported model layout or loader limits. A browser launch switch will not fi\
x that mismatch."),s.steps.push("Choose an approved model package supported by the local runtime, or select a compatible\
 peer-hosted model.")):o==="device_probe_unknown"?(s.paragraphs.push("The capability check did not finish or could not v\
erify all prerequisites. This is not confirmation that the device is unsupported."),s.steps.push("Retry the check by rel\
oading the page. Keep the browser up to date, or choose a peer-hosted model.")):o==="model_metadata_unverified"?(s.paragraphs.
push("The advertised model still needs its package metadata verified before local loading. Its name alone does not estab\
lish compatibility."),s.steps.push("Inspect the model package and allow its manifest to be verified before downloading w\
eights.")):(s.paragraphs.push(o==="memory_fit_unverified"?"Required browser features are supported, but free physical RA\
M and GPU memory are not reliably available to this check. A successful check does not guarantee that the model will fit\
.":"Compatibility depends on the model runtime, browser features and available memory. This check cannot guarantee succe\
ssful loading."),s.steps.push("Choose a smaller available model or a peer-hosted model if local loading fails.")),s}const ya=new Set(
["image/png","image/jpeg","image/webp","image/gif"]);async function wa(t,{signal:n}={}){if(!t||!ya.has(t.type))throw new Error(
"Choose a PNG, JPEG, WebP or GIF image");if(t.size>8*1024**2)throw new Error("Choose an image smaller than 8 MiB");n?.throwIfAborted();
const a=await createImageBitmap(t);try{if(n?.throwIfAborted(),!a.width||!a.height||a.width*a.height>32*1024**2)throw new Error(
"Choose an image smaller than 32 megapixels");const o=Math.min(1,512/Math.max(a.width,a.height)),i=document.createElement(
"canvas");i.width=Math.max(1,Math.round(a.width*o)),i.height=Math.max(1,Math.round(a.height*o));const l=i.getContext("2d",
{willReadFrequently:!0});if(!l)throw new Error("Image decoding is unavailable");l.drawImage(a,0,0,i.width,i.height);const s=l.
getImageData(0,0,i.width,i.height),f=document.createElement("canvas"),d=Math.min(1,96/Math.max(i.width,i.height));return f.
width=Math.max(1,Math.round(i.width*d)),f.height=Math.max(1,Math.round(i.height*d)),f.getContext("2d").drawImage(i,0,0,f.
width,f.height),{name:t.name.slice(0,160),preview:f.toDataURL("image/webp",.8),image:{data:new Uint8Array(s.data),width:i.
width,height:i.height,channels:4}}}finally{a.close()}}const eo=new Map([["image/png","png"],["image/jpeg","jpg"],["image\
/webp","webp"],["image/gif","gif"]]),to=8*1024**2,Kn=64*1024,no=t=>t.reason??new DOMException("Image selection cancelled",
"AbortError");function oo(t,n){return n.aborted?(Promise.resolve(t).catch(()=>{}),Promise.reject(no(n))):new Promise((a,o)=>{
const i=()=>o(no(n));n.addEventListener("abort",i,{once:!0}),Promise.resolve(t).then(a,o).finally(()=>n.removeEventListener(
"abort",i))})}function va(t,n){if(!t)return null;let a=[...t.items??[]].filter(s=>s.kind==="file").map(s=>s.getAsFile()).
filter(Boolean);if(a.length||(a=[...t.files??[]]),a.length)return a.length===1?{file:a[0]}:{error:"Attach one image at a\
 time."};const o=t.getData("text/html");if(o&&/<img\b|blob:/i.test(o)){if(o.length>Kn)return{error:"Image clipboard info\
rmation is too large. Save the image and attach the file."};const s=n.createElement("template");s.innerHTML=o;const f=[...s.
content.querySelectorAll("img")];if(f.length>1)return{error:"Attach one image at a time."};if(f.length)return{url:f[0].getAttribute(
"src")??""};const d=[...s.content.querySelectorAll("a[href]")].map(b=>b.getAttribute("href")).filter(b=>/^blob:/i.test(b));
if(d.length>1)return{error:"Attach one image at a time."};if(d.length)return{url:d[0]}}const i=t.getData("text/uri-list");
if(i&&/(?:^|\n)blob:/i.test(i)){if(i.length>Kn)return{error:"Image clipboard information is too large. Attach the image \
file instead."};const s=i.split(/\r?\n/).map(f=>f.trim()).filter(f=>f&&!f.startsWith("#"));return s.length===1?{url:s[0]}:
{error:"Attach one image at a time."}}const l=t.getData("text/plain").trim();return/^blob:/i.test(l)?l.length<=Kn?{url:l}:
{error:"Image link is too long. Attach the image file instead."}:null}function Uo(t){if(!eo.has(t.type))throw new Error(
"Choose a PNG, JPEG, WebP or GIF image.");if(!Number.isSafeInteger(t.size)||t.size<=0)throw new Error("This image is emp\
ty or unreadable. Attach the image file again.");if(t.size>to)throw new Error("Choose an image smaller than 8 MiB.");return t}
async function ka(t,{document:n,fetchImpl:a,source:o,signal:i}){let l;try{l=new URL(t)}catch{throw new Error("This image\
 link is invalid. Save the image and attach the file.")}if(l.protocol!=="blob:")throw new Error("Drag or paste the image\
 file itself; remote image links are not downloaded.");if(l.origin==="null"||l.origin!==n.location.origin)throw new Error(
"This image belongs to another website or browser tab. Save the image, then attach the file.");let s;try{s=await oo(a(l.
href,{signal:i,credentials:"omit",redirect:"error"}),i)}catch(S){throw i.throwIfAborted(),new Error("This image link exp\
ired or is unavailable. Copy the image again, or save and attach its file.",{cause:S})}if(!s.ok)throw s.body?.cancel().catch(
()=>{}),new Error("This image link is unavailable. Copy the image again or attach its file.");const f=s.headers.get("con\
tent-type")?.split(";")[0].trim().toLowerCase();if(!eo.has(f))throw s.body?.cancel().catch(()=>{}),new Error("The image \
link must contain a PNG, JPEG, WebP or GIF image.");const d=s.headers.get("content-length");if(d!==null&&(!/^\d+$/.test(
d)||Number(d)>to))throw s.body?.cancel().catch(()=>{}),new Error("Choose an image smaller than 8 MiB.");if(!s.body)throw new Error(
"This image has no readable data. Attach the image file instead.");const b=s.body.getReader(),g=[];let y=0,h=!1;try{for(;;){
const{done:S,value:k}=await oo(b.read(),i);if(i.throwIfAborted(),S){h=!0;break}if(y+=k.byteLength,y>to)throw new Error("\
Choose an image smaller than 8 MiB.");g.push(k)}if(d!==null&&y!==Number(d))throw new Error("The image was interrupted. C\
opy it again or attach the file.");return Uo(new File(g,`${o==="paste"?"pasted":"dropped"}-image.${eo.get(f)}`,{type:f}))}finally{
h||b.cancel(no(i)).catch(()=>{});try{b.releaseLock()}catch{}}}function Ca({textarea:t,onFile:n,onError:a=()=>{},canAccept:o=()=>!0,
onPendingChange:i=()=>{},fetchImpl:l=globalThis.fetch,timeoutMs:s=1e4}={}){if(!t?.addEventListener||typeof n!="function"||
typeof l!="function")throw new TypeError("Chat image input requires a textarea, onFile and fetch");if(!Number.isSafeInteger(
s)||s<10||s>3e4)throw new RangeError("Invalid image input timeout");let f=null,d=!1,b=Promise.resolve();const g=m=>{try{
Promise.resolve(a(m)).catch(()=>{})}catch{}},y=()=>{const m=o();if(m!==!0)throw new Error(typeof m=="string"&&m?m:"Image\
s are unavailable for this chat target right now.")},h=(m=new DOMException("Image selection cancelled","AbortError"))=>f?.
controller.abort(m);function S(m,D){if(d)return;let e;try{e=va(D==="paste"?m.clipboardData:m.dataTransfer,t.ownerDocument)}catch(E){
m.preventDefault(),g(E);return}if(!e)return;m.preventDefault(),h();const O={controller:new AbortController};f=O,i(!0);const Q=setTimeout(
()=>O.controller.abort(Object.assign(new Error("Reading the image timed out. Attach the file again."),{code:"ERR_CHAT_IM\
AGE_TIMEOUT"})),s);b=(async()=>{try{if(y(),e.error)throw new Error(e.error);const E=e.file?Uo(e.file):await ka(e.url,{document:t.
ownerDocument,fetchImpl:l,source:D,signal:O.controller.signal});O.controller.signal.throwIfAborted(),y(),await oo(n(E,{signal:O.
controller.signal,source:D}),O.controller.signal)}catch(E){!d&&f===O&&!(O.controller.signal.aborted&&O.controller.signal.
reason?.name==="AbortError")&&g(E)}finally{clearTimeout(Q),f===O&&(f=null,d||i(!1))}})()}const k=m=>S(m,"paste"),x=m=>S(
m,"drop"),T=m=>{if(d)return;const D=m.dataTransfer;!D||![...D.types].some(O=>["Files","text/html","text/uri-list"].includes(
O))||(m.preventDefault(),D.dropEffect=o()===!0?"copy":"none")};return t.addEventListener("paste",k),t.addEventListener("\
dragover",T),t.addEventListener("drop",x),{cancel:h,whenIdle:()=>b,dispose(){return d||(d=!0,h(),t.removeEventListener("\
paste",k),t.removeEventListener("dragover",T),t.removeEventListener("drop",x),f&&i(!1)),b}}}const Ao=1024*1024,Aa=6,Sa=24*
1024*1024,So=t=>{if(t?.aborted)throw new DOMException("Image generation cancelled","AbortError")};function Go(t){const n=new Map;
let a=0,o=!1;function i(s,{expired:f=!1}={}){const d=n.get(s);if(d)if(URL.revokeObjectURL(d.url),a-=d.bytes,n.delete(s),
f&&t.contains(s)){const b=document.createElement("p");b.className="pc-inference-note",b.textContent="Earlier image previ\
ew released.",s.replaceWith(b)}else s.removeAttribute("src")}function l(){for(const s of n.keys())t.contains(s)||i(s);for(;n.
size>Aa||a>Sa;)i(n.keys().next().value,{expired:!0})}return{async append(s,f,{signal:d,prompt:b=""}={}){if(So(d),o)throw new Error(
"Conversation image renderer is closed");const{width:g,height:y,channels:h,data:S}=f??{};if(!Number.isSafeInteger(g)||!Number.
isSafeInteger(y)||g<1||y<1||g*y>Ao||h!==4||!(S instanceof Uint8Array||S instanceof Uint8ClampedArray)||S.byteLength!==g*
y*4)throw new Error("Generated image must contain bounded RGBA pixels");const k=new OffscreenCanvas(g,y),x=k.getContext(
"2d");if(!x)throw new Error("Image preview encoding is unavailable");x.putImageData(new ImageData(new Uint8ClampedArray(
S),g,y),0,0);const T=await k.convertToBlob({type:"image/png"});if(So(d),o||!t.contains(s))throw new DOMException("Conver\
sation closed","AbortError");if(T.type!=="image/png"||T.size>Ao*4+65536)throw new Error("Generated image preview exceeds\
 its byte budget");const m=document.createElement("img");m.className="pc-generated-image",m.width=g,m.height=y,m.alt=b?`\
Generated image: ${b.slice(0,160)}`:"Generated image";const D=URL.createObjectURL(T);return m.src=D,n.set(m,{url:D,bytes:T.
size}),a+=T.size,s.after(m),l(),m},prune:l,dispose(){o=!0;for(const s of n.keys())i(s)}}}const Bt=(t,n)=>{const a=document.
createElement(t);return n!==void 0&&(a.textContent=n),a},xa=t=>`${(t/1024**3).toFixed(2)} GiB`;function Ea({source:t,query:n}){
const a=Bt("section"),o=Bt("h4","Model observations"),i=Bt("p"),l=Bt("button","Check observations");l.type="button";const s=Bt(
"ul");a.className="pc-browser-evidence",i.className="pc-browser-note",a.append(o,Bt("p","Inspecting a package is not a s\
uccessful execution test. Reports are peer claims scoped to a package, runtime, device and workload."),l,i,s);let f,d=!1;
return l.onclick=async()=>{f?.abort(),f=new AbortController,l.disabled=!0,i.textContent="Checking local and root observa\
tions…";try{const b=await n(t.package??t,{signal:f.signal});if(d)return;i.textContent=b.network==="connected"?"Root co\
nnected. Historical failures never disable loading.":"Root unavailable. Showing local observations; model loading is una\
ffected.",s.replaceChildren(),b.records.length||s.append(Bt("li","No observations for this exact package yet."));for(const{
report:g,applicability:y}of b.records){const h=Bt("li"),S=y.current?"Same runtime/device profile; compare workloads":`Hi\
storical / different profile: ${y.changed.join(", ")}. Reinspect or retest.`,k=g.environment;h.append(Bt("strong",`${g.stage}\
: ${g.outcome}${g.reason?` (${g.reason})`:""}`),Bt("p",`${k.browserFamily??k.kind} ${k.browserVersion??""} · ${k.os??"O\
S unknown"} · ${k.gpu?.vendor??"GPU unknown"} ${k.gpu?.architecture??""}`),Bt("p",S),Bt("p",`${new Date(g.observedAt).toLocaleString()}\
 · client ${g.compatibility.clientBuild} · runtime ${g.compatibility.runtime??"inspection"} ${g.compatibility.runtimeVersion??
""}`));for(const x of g.metrics??[]){const T={durationMs:"Operation time",estimatedCpuBytes:"Planning RAM estimate",estimatedGpuBytes:"\
Planning GPU estimate",requestedGpuBufferPeakBytes:"Peak requested runtime buffers (not physical VRAM)",wasmMemoryBytes:"\
WASM memory buffer"}[x.name];T&&h.append(Bt("p",`${T}: ${x.unit==="bytes"?xa(x.value):`${x.value} ms`}`))}g.workload&&h.
append(Bt("p",Object.entries(g.workload).map(([x,T])=>`${x}: ${T}`).join(" · "))),s.append(h)}}catch{!d&&!f.signal.aborted&&
(i.textContent="Observations unavailable. Model loading is unaffected.")}finally{d||(l.disabled=!1)}},{element:a,dispose(){
d=!0,f?.abort()}}}new Set(Jo);const un=t=>Number.isSafeInteger(t)&&t>=0;function bn(t){return un(t)?t>=1024**3?`${(t/1024**
3).toFixed(2)} GiB`:t>=1024**2?`${(t/1024**2).toFixed(1)} MiB`:`${Math.ceil(t/1024)} KiB`:"Unknown size"}function ao(t){
return t.task??t.model?.task??(t.browserSummary?"unknown":t.modalities?.includes("image")?"image-text-to-text":"text-gen\
eration")}function _n(t){const n=t.dtype??t.model?.dtype;if(typeof n=="string")return n.toLowerCase();if(n&&typeof n=="o\
bject"&&!Array.isArray(n)){const a=[...new Set(Object.values(n).filter(o=>typeof o=="string").map(o=>o.toLowerCase()))];
if(a.length===1)return a[0];if(a.length)return`mixed (${a.sort().join(", ")})`}return""}function Nn(t){const n=t.trim();
if(!/^https?:\/\//i.test(n))return{query:n,repository:null};try{const a=Wo(n);return{query:a.repository,...a,reference:n}}catch{
return{query:"",repository:null,error:"Enter a Hugging Face model URL or search by name and description."}}}function Do(t,n){
try{const a=n?.(t)??t.localAvailability;if(a&&typeof a.then!="function")return a;a?.catch?.(()=>{})}catch{return{status:"\
unknown",reason:"Device compatibility could not be checked."}}return{status:"unknown",reason:"Memory fit has not been ve\
rified on this device."}}const xn=t=>["checking","unavailable"].includes(t?.status),hn=t=>!!(t.browserSummary||t.requiresInspection);
function xo(t,n,a,{includeUninspected:o=!1}={}){const i=Nn(n.query).query.toLowerCase().split(/\s+/).filter(Boolean);function l(d){
const b=o&&hn(d),g=d.browserOrigin??(d.source==="stored"?"stored":d.source==="peers"?"peers":"catalog");if(n.source!=="a\
ll"&&g!==n.source&&!(n.source==="stored"&&d.stored===!0))return!1;const y=ao(d),h=_n(d),S={...d.model,...d,task:y,modalities:d.
modalities??d.model?.modalities,outputModalities:d.outputModalities??d.model?.outputModalities??[y==="image-to-3d"?"mesh":
y==="text-to-image"?"image":y==="text-to-speech"?"audio":"text"]};if(n.task!=="all"&&y!==n.task&&!Cn(S,n.task)&&!(b&&y===
"unknown")||n.precision!=="all"&&h!==n.precision&&!(b&&(!h||h==="unknown")))return!1;if(g!=="hub"){const T=[d.name,d.modelId,
d.id,d.description,d.repository,d.model?.repository,y,d.runtime,d.model?.runtime,h,d.source,g,g==="stored"?"local stored\
 on this device":"",...d.tags??[]].join(" ").toLowerCase();if(!i.every(m=>T.includes(m)))return!1}const k=d.totalBytes;if(n.
size==="unknown"&&un(k))return!1;if(n.size!=="all"&&n.size!=="unknown"){if(un(k)){if(n.size==="large"?k<8*1024**3:k>Number(
n.size))return!1}else if(!b)return!1}const x=Do(d,a);return!(!b&&(n.compatibility==="eligible"&&!d.browserPeerAvailable&&
(xn(x)||d.loadable===!1||hn(d))||n.compatibility==="setup"&&(hn(d)||!xn(x)&&d.loadable!==!1)))}const s=t.flatMap(d=>{const b=[
d,...d.browserVariants??[]].filter(l),g=b.find(y=>!hn(y))??b[0];return g?[{...d,browserFilterPending:hn(g),browserMatchingVariant:g===
d?null:g.name??g.id}]:[]}),f=d=>un(d.totalBytes)?d.totalBytes:1/0;return s.sort((d,b)=>{if(n.sort!=="name"){if(f(d)===1/0&&
f(b)!==1/0)return 1;if(f(b)===1/0&&f(d)!==1/0)return-1;const g=(f(d)-f(b))*(n.sort==="largest"?-1:1);if(g)return g}return String(
d.name??d.repository).localeCompare(String(b.name??b.repository))||String(d.key).localeCompare(String(b.key))})}function yn(t,n){
const a=t.manifestCid??t.package?.manifestCid;return n.filter(o=>!o.local&&o.available===!0&&(o.key===t.key||a&&o.key===
`peer:${a}`))}function tn(t){return typeof t=="string"&&/^[\w.-]+\/[\w.-]+$/.test(t)?`https://huggingface.co/${t}`:null}
const Ia=new Set(["quantized","converted","derived","finetune","merge","adapter"]),En=(t,n)=>typeof t=="string"?t.slice(
0,n):"";function Eo(t){if(typeof t!="string")return null;const n=Nn(t),a=n.repository??t;return n.error||!tn(a)?null:{repository:a,
key:`${a.toLowerCase()}@${n.revision??"main"}`,reference:n.revision?`${tn(a)}/tree/${n.revision}`:a}}function Ma(t,n){if(!t||
!tn(t.repository)||t.repository.length>160||typeof t.sourceRepository!="string"||t.sourceRepository.toLowerCase()!==n.toLowerCase()||
t.repository.toLowerCase()===n.toLowerCase()||!Ia.has(t.relationship)||t.evidence?.kind!=="publisher-base-model"||!/^[a-f0-9]{40}$/i.
test(t.evidence.revision??"")||t.revision&&t.revision!==t.evidence.revision)return null;const a=[...new Set((Array.isArray(
t.formats)?t.formats:[]).filter(i=>["ONNX","GGUF"].includes(i)))];if(!a.length)return null;const o=t.evidence.revision.toLowerCase();
return{repository:t.repository,name:En(t.name,256)||t.repository,description:En(t.description,4e3),task:En(t.task,64)||void 0,
formats:a,revision:o,sourceRepository:n,relationship:t.relationship,reference:`${tn(t.repository)}/tree/${o}`,status:"ca\
ndidate",requiresInspection:!0}}function La({findConversions:t,onChange:n=()=>{}}={}){const a=new Map;let o=null,i=!1;function l(f,d){
for(a.delete(f),a.set(f,d);a.size>32;)a.delete(a.keys().next().value)}function s(){if(!o)return;const f=o;o=null,f.controller.
abort(),l(f.key,{status:"cancelled",items:[]}),n()}return{get:f=>a.get(Eo(f)?.key),cancel:s,async find(f){const d=Eo(f);
if(i||!t||!d)return;const b=a.get(d.key);if(b?.status==="complete"||b?.status==="pending"&&o?.key===d.key)return;s();const g={
...d,controller:new AbortController};o=g,l(g.key,{status:"pending",items:[]}),n();try{const y=await t(g.reference,{signal:g.
controller.signal});if(i||o!==g||g.controller.signal.aborted)return;if(!y||!Array.isArray(y.items))throw new Error("Inva\
lid related-model response");const h=[...new Map(y.items.slice(0,100).map(S=>Ma(S,g.repository)).filter(Boolean).map(S=>[
`${S.repository}@${S.revision}`,S])).values()].slice(0,24);l(g.key,{status:"complete",items:h,warning:En(y.warning,1e3),
cached:y.cached===!0})}catch(y){!i&&o===g&&!g.controller.signal.aborted&&l(g.key,{status:"error",items:[],error:En(y?.message??
String(y),1e3)})}finally{o===g&&(o=null,n())}},dispose(){i=!0,s(),a.clear()}}}const j=(t,n,a)=>{const o=document.createElement(
t);return n!==void 0&&(o.textContent=String(n)),a&&(o.className=a),o},_t=t=>{const n=j("button",t);return n.type="button",
n},$a=t=>({stored:"Stored on this device",peers:"Peer files",hub:"Hugging Face search",catalog:"Catalog"})[t.browserOrigin]??
(t.source==="stored"?"Stored on this device":t.source==="peers"?"Peer files":"Catalog"),Yn=t=>hn(t)?"Needs inspection":t.
loadable===!1&&!t.inferenceOnly?"Unsupported":t.browserOrigin==="hub"||t.inferenceOnly||["stored","peers"].includes(t.source)?
"Candidate":"Catalog",wn=t=>String(t?.message??t??"Request failed").slice(0,1e3);function Ra({container:t,getSources:n=()=>[],
getTargets:a=()=>[],searchModels:o,inspectModel:i,findConversions:l,queryEvidence:s,getCompatibility:f,onLoad:d,onUsePeer:b,
onSetup:g,storedContent:y,hasStoredModels:h=()=>!1,onStoredOpen:S,onConfigure:k,onDismiss:x,keepOpenOnAction:T=!1}={}){if(!t?.
append)throw new TypeError("A model browser container is required");const m=j("dialog",void 0,"pc-model-browser");m.id=`\
model-browser-dialog-${crypto.randomUUID()}`;const D=j("h2","Models");D.id=`model-browser-${crypto.randomUUID()}`,m.setAttribute(
"aria-labelledby",D.id);const e=j("div",void 0,"pc-browser-header"),O=_t("Done"),Q=j("div",void 0,"pc-browser-header-act\
ions"),E=_t("Config");E.hidden=!k,E.onclick=()=>k?.(),Q.append(E,O),e.append(D,Q);const $=j("p","","pc-browser-status");
$.setAttribute("role","status"),$.hidden=!0;const U=j("section",void 0,"pc-browser-page");U.hidden=!0,U.tabIndex=-1;const H=j(
"div",void 0,"pc-browser-tabs");H.setAttribute("role","tablist"),H.setAttribute("aria-label","Model library");const L={},
G={};for(const[u,M]of[["stored","Stored models"],["browse","Browse models"]]){if(u==="stored"&&!y)continue;const P=_t(M),
R=j("section",void 0,`pc-browser-tab-panel pc-browser-${u}-panel`);P.id=`${m.id}-${u}-tab`,R.id=`${m.id}-${u}-panel`,P.setAttribute(
"role","tab"),P.setAttribute("aria-controls",R.id),R.setAttribute("role","tabpanel"),R.setAttribute("aria-labelledby",P.
id),L[u]=P,G[u]=R,H.append(P)}const Y=j("p","","pc-browser-status");Y.setAttribute("role","status"),y&&(y.classList.add(
"pc-browser-stored-content"),G.stored.append(Y,y)),H.hidden=!y;const p=j("div",void 0,"pc-browser-controls"),C=j("div",void 0,
"pc-browser-search"),q=j("input");q.type="search",q.maxLength=256,q.autofocus=!0,q.placeholder="Name, description or hug\
gingface.co/owner/model",q.setAttribute("aria-label","Search models"),C.append(q),p.append(C);const X=j("details",void 0,
"pc-browser-filters"),K=j("summary"),te=j("span","Filters and sorting"),ne=j("span","","pc-browser-summary");K.append(te,
ne);const qe=j("div",void 0,"pc-browser-filter-fields");X.append(K,qe),p.append(X);const _e=matchMedia("(max-width:650px\
)"),Se=()=>{X.open=!_e.matches,_e.matches||(Ye=!1),Ze()};X.open=!_e.matches,_e.addEventListener("change",Se);const ie={};
function Oe(u,M,P){const R=j("select");R.setAttribute("aria-label",M);const N=j("label",M);for(const[oe,Ie]of P){const J=j(
"option",Ie);J.value=oe,R.append(J)}return N.append(R),qe.append(N),ie[u]=R,R}Oe("source","Source",[["all","All sources"],
["catalog","Catalog"],["stored","Stored on this device"],["peers","Peer files"],["hub","Hugging Face search"]]),Oe("task",
"Task",[["all","All tasks"],["text-generation","Text and code"],["image-text-to-text","Image understanding"],["audio-tex\
t-to-text","Audio understanding"],["text-to-image","Image generation"],["image-to-3d","3D generation"],["automatic-speec\
h-recognition","Speech recognition"],["text-to-speech","Speech synthesis"]]),Oe("size","Package size",[["all","Any size"],
[String(500*1024**2),"Up to 500 MiB"],[String(1024**3),"Up to 1 GiB"],[String(4*1024**3),"Up to 4 GiB"],[String(8*1024**
3),"Up to 8 GiB"],["large","8 GiB and larger"],["unknown","Unknown size"]]),Oe("precision","Precision",[["all","All prec\
isions"]]),Oe("compatibility","Compatibility",[["all","All models"],["eligible","Usable locally or via peers"],["setup",
"Needs local setup / unsupported"]]),Oe("sort","Sort models",[["smallest","Package size: smallest first"],["largest","Pa\
ckage size: largest first"],["name","Name"]]);const Pe=j("p","","pc-browser-status");Pe.setAttribute("role","status"),Pe.
setAttribute("aria-live","polite");const Ne=j("div",void 0,"pc-browser-content"),pe=j("ul",void 0,"pc-browser-results");
pe.setAttribute("aria-label","Model results");const ge=j("section",void 0,"pc-browser-details");ge.setAttribute("aria-la\
bel","Model details"),Ne.append(pe,ge);const le=_t("More Hugging Face results");le.className="pc-browser-more",le.hidden=
!0,G.browse.append(p,Pe,Ne,le),m.addEventListener("close",()=>{ve?.dispose(),zt=null}),m.append(e,$,H,...Object.values(G),
U),t.append(m);let ve,_=!1,W=!1,ee=!1,ce=null,at=null,mt,tt,Le,rt=0,Ke=0,Ue=[],nt=null,ue="",xe=!1,dt=null,it=!1,Nt=!1,xt="",
Et="",$t,zt,nn,be=null,ke="browse",Ye=!1,gt=0,bt,je=0,Fe,yt,Xe=!1;const Je=new Map,wt=new Map,vt=La({findConversions:l,onChange:()=>he()});
function Ze(){m.classList.toggle("pc-browser-show-details",!Fe&&_e.matches&&ke==="browse"&&Ye),D.textContent=Fe?.title??
"Models",H.hidden=!!Fe||!y,U.hidden=!Fe,E.hidden=!k||!!Fe,E.disabled=W||ee||Xe,O.disabled=Xe,O.textContent=Fe?.buttonLabel??
"Done";for(const[u,M]of Object.entries(G)){const P=u===ke;M.hidden=!!Fe||!P,L[u].setAttribute("aria-selected",String(P)),
L[u].tabIndex=P?0:-1,L[u].disabled=W||ee}O.title=Fe?"Return to Models":_e.matches&&Ye?"Return to model results":"Close M\
odels"}function kt({focus:u=!0}={}){Ye=!1,Ze(),pe.scrollTop=gt,u&&m.open&&(pe.querySelector('[aria-pressed="true"]')??q).
focus({preventScroll:!0})}function Wt(){!_e.matches||ke!=="browse"||(gt=pe.scrollTop,Ye=!0,Ze(),O.focus({preventScroll:!0}))}
function ft(){bt?.abort(),bt=null,je++}function It(){if(ft(),!S)return;const u=new AbortController,M=je;bt=u,Y.textContent=
"",Promise.resolve().then(()=>{if(!u.signal.aborted)return S({signal:u.signal})}).catch(P=>{!_&&!u.signal.aborted&&M===je&&
(Y.textContent=`Stored models unavailable: ${wn(P)}`)}).finally(()=>{bt===u&&(bt=null)})}function Ot(u,{focus:M=!1,refreshStored:P=!0}={}){
G[u]||(u="browse"),ke==="browse"&&!Ye&&(gt=pe.scrollTop),ke!==u&&(ft(),u==="stored"&&V()),ke=u,Ye=!1,Ze(),u==="browse"?(he(),
pe.scrollTop=gt,m.open&&it&&!tt&&!W&&et(Nt)):P&&m.open&&It(),M&&L[u].focus({preventScroll:!0})}pe.addEventListener("scro\
ll",()=>{ke==="browse"&&!Ye&&(gt=pe.scrollTop)});for(const[u,M]of Object.entries(L))M.onclick=()=>{!W&&!ee&&ke!==u&&Ot(u,
{focus:!0})},M.addEventListener("keydown",P=>{const R=Object.keys(L),N=R.indexOf(u),oe=P.key==="Home"?R[0]:P.key==="End"?
R.at(-1):P.key==="ArrowRight"?R[(N+1)%R.length]:P.key==="ArrowLeft"?R[(N+R.length-1)%R.length]:null;oe&&!W&&!ee&&(P.preventDefault(),
Ot(oe,{focus:!0,refreshStored:oe!==ke}))});function Ct(){return(n()??[]).filter(u=>u&&typeof u.key=="string")}function Rt(){
return(a()??[]).filter(Boolean)}function B(){const u=Ct(),M=Rt();for(const R of M)R.local||R.available!==!0||u.some(N=>yn(
N,[R]).length)||u.push({...R,source:"peers",inferenceOnly:!0,loadable:!1,manifestCid:R.manifestCid??R.key?.replace(/^peer:/,
""),reason:"Files not advertised; use peer inference."});const P=Ue.map(R=>({...R,key:R.browserKey??`hub:${R.repository}`,
browserOrigin:"hub",browserSummary:!0}));for(const R of P){const N=Je.get(R.inspectReference??R.repository),oe=Dt(N);if(oe){
const Ie=N.variants.map(J=>pn(R,N,J));Object.assign(R,pn(R,N,oe),{browserVariants:Ie})}else N&&Object.assign(R,{browserSummary:!1,
loadable:!1,revision:N.revision,description:N.description??R.description,license:N.license,reason:"No supported package \
variants were found in this repository."})}return[...u,...P].map(R=>({...R,browserPeerAvailable:yn(R,M).length>0}))}function Dt(u){
if(!u?.variants?.length)return null;const M=[...u.variants].sort((P,R)=>(un(P.totalBytes)?P.totalBytes:1/0)-(un(R.totalBytes)?
R.totalBytes:1/0)||String(P.name??P.key).localeCompare(String(R.name??R.key)));return M.find(P=>(P.key??P.id)===wt.get(u.
browserReference??u.repository))??M[0]}function pn(u,M,P){const R=P.package??{};return{...R,...u,...P,key:u.key,browserOrigin:"\
hub",browserSummary:!1,name:P.name??u.name??u.repository,repository:M.repository,revision:M.revision,description:M.description??
u.description,license:P.license??M.license??R.license??u.license,package:P.package,loadable:P.loadable===!0&&!!P.package,
model:P.model??R.model,task:P.task??R.model?.task,dtype:P.dtype??R.model?.dtype,localAvailability:P.localAvailability??R.
localAvailability}}function Tt(){return{query:q.value,...Object.fromEntries(Object.entries(ie).map(([u,M])=>[u,M.value]))}}
function Vt(u){return Do(u.package??u,f)}function Kt(u){return u&&!u.browserSummary&&u.loadable!==!1&&!u.requiresInspection&&
(u.browserOrigin!=="hub"||!!u.package)&&!xn(Vt(u))}function Qe(u){return xo([{...u,browserVariants:[]}],Tt(),Vt,{includeUninspected:!0}).
length>0}function Ut(u){const M=u?.repository??u?.model?.repository,P=Je.get(u?.inspectReference??M);return tn(M)&&/^[a-f0-9]{40}$/i.
test(P?.revision??"")?`${tn(M)}/tree/${P.revision}`:null}function st(u){const M=ie.precision.value,P=new Set(u.flatMap(oe=>[
oe,...oe.browserVariants??[]]).map(_n).filter(oe=>oe&&oe!=="unknown"));M!=="all"&&P.add(M);const R=[...P].sort().join(`
`);if(R===nn)return;nn=R;const N=[j("option","All precisions")];N[0].value="all";for(const oe of[...P].sort()){const Ie=j(
"option",oe);Ie.value=oe,N.push(Ie)}ie.precision.replaceChildren(...N),ie.precision.value=M}function he({revealSelected:u=!1}={}){
if(_)return;const M=B();st(M);const P=xo(M,Tt(),z=>Vt(z),{includeUninspected:!0}),R=P.filter(z=>z.browserFilterPending),
N=[...P.filter(z=>!z.browserFilterPending),...R],oe=be===ce&&!N.some(z=>z.key===ce)?M.find(z=>z.key===ce):null;at=oe||N.
some(z=>z.key===ce)?ce:N[0]?.key??null;const Ie=document.activeElement?.closest?.("[data-model-key]")?.dataset.modelKey,
J=ke==="browse"&&!Ye?pe.scrollTop:gt,$e=new Map([...pe.children].map(z=>[z.querySelector("[data-model-key]")?.dataset.modelKey,
z])),ze=[],ut=z=>$e.get(void 0)?.isEqualNode(z)?$e.get(void 0):z;for(const z of N){z===R[0]&&ze.push(ut(j("li","Needs in\
spection — package filters are not yet verified","pc-browser-candidates")));const Me=j("li"),ot=_t("");ot.className="p\
c-browser-result",ot.dataset.modelKey=z.key,ot.setAttribute("aria-pressed",String(z.key===at)),ot.append(j("strong",z.name??
z.repository??z.modelId),j("small",z.repository??z.model?.repository??z.modelId??""),j("small",`${$a(z)} · ${bn(z.totalBytes)}${un(
z.totalBytes)?" package":""} · ${_n(z)||"Precision unknown"}`),j("small",`${Yn(z)} · ${z.browserSummary?"Inspect varia\
nts":ao(z)}`)),z.browserMatchingVariant&&ot.append(j("small",`Matching variant: ${z.browserMatchingVariant}`)),ot.disabled=
W||ee;const Z=z.key;ot.onclick=()=>{if(W||ee||_)return;const Ve=B().find(Un=>Un.key===Z);if(!Ve)return;ce=Z,be=null,xt="",
Et="",he({revealSelected:!0}),Wt();const Gt=Ve.inspectReference??Ve.repository;Ve.browserOrigin==="hub"&&!Je.has(Gt)&&At(
Gt)},Me.append(ot);const Re=$e.get(Z);ze.push(Re?.isEqualNode(Me)?Re:Me)}N.length||ze.push(ut(j("li","No matching models\
. Clear a filter or try another search.","pc-browser-empty")));let We=pe.firstChild;for(const z of ze)z===We?We=We.nextSibling:
pe.insertBefore(z,We);for(;We;){const z=We.nextSibling;We.remove(),We=z}pe.scrollTop=J,gt=J,Ie&&[...pe.querySelectorAll(
"[data-model-key]")].find(z=>z.dataset.modelKey===Ie)?.focus({preventScroll:!0}),ne.textContent=`${N.length} model${N.length===
1?"":"s"}`,ne.title=R.length?`${R.length} need inspection before package filters can be verified`:"";const Xt=Object.entries(
ie).filter(([z,Me])=>z!=="sort"&&Me.value!=="all").length;te.textContent=`Filters and sorting${Xt?` (${Xt})`:""}`,te.title=
Xt?`${Xt} active filters`:"",Pe.textContent=Et||xt||(dt?`Inspecting ${dt}…`:"")||(xe?"Searching Hugging Face metadata…":
ue)||"",le.hidden=!nt,le.disabled=W||ee||xe;for(const z of[q,...Object.values(ie)])z.disabled=W||ee;if(Yt(oe?{...oe,browserHiddenByFilters:!0}:
N.find(z=>z.key===at)),u&&m.open&&ke==="browse"&&!Ye){const z=pe.querySelector('[aria-pressed="true"]');if(z){const Me=z.
getBoundingClientRect(),ot=pe.getBoundingClientRect();Me.top<ot.top?pe.scrollTop+=Me.top-ot.top:Me.bottom>ot.bottom&&(pe.
scrollTop+=Math.min(Me.top-ot.top,Me.bottom-ot.bottom)),gt=pe.scrollTop}}Ze()}function Yt(u){const M=u?.repository??u?.model?.
repository,P=JSON.stringify({source:u,compatibility:u?Vt(u):null,targets:u?yn(u,Rt()):[],conversions:vt.get(Ut(u)),selectedMatches:u?
Qe(u):!1,busy:W,actionPending:ee,inspecting:dt});if(P===zt)return;zt=P;const R=ge.contains(document.activeElement)?document.
activeElement.dataset.browserControl:null;if(ve?.dispose(),ve=null,ge.replaceChildren(),!u){ge.append(j("p","Choose a mo\
del to see its package, compatibility and available peers.","pc-browser-note"));return}const N=j("div");if(ge.append(N),
N.append(j("span",Yn(u),"pc-browser-badge"),j("h3",u.name??u.repository)),u.description&&N.append(j("p",String(u.description).
slice(0,4e3),"pc-browser-note")),u.browserMatchingVariant&&N.append(j("p",`Matching variant: ${u.browserMatchingVariant}\
. Your selected variant is unchanged; choose a matching package below.`,"pc-browser-note")),u.browserFilterPending&&N.append(
j("p","Needs inspection: size, precision and compatibility filters cannot be confirmed until the package is inspected.",
"pc-browser-warning")),u.browserHiddenByFilters||!Qe(u)){N.append(j("p","The selected package does not match your curren\
t filters. Change the filters or choose a matching variant before loading.","pc-browser-warning"));const Z=_t("Show sele\
cted package");Z.disabled=W||ee,Z.title="Clear package filters and show this Hugging Face selection; keep the search tex\
t.",Z.onclick=()=>{if(!(W||ee)){for(const Re of["task","size","precision","compatibility"])ie[Re].value="all";["all","hu\
b"].includes(ie.source.value)||(ie.source.value="hub"),he({revealSelected:!0})}},N.append(Z)}const oe=u.inspectReference??
M,Ie=tn(M);if(Ie){const Z=j("a",M);Z.href=Ie,Z.target="_blank",Z.rel="noopener noreferrer",N.append(Z)}const J=Je.get(oe);
if(u.browserConversion&&lt(N,u.browserConversion),u.browserOrigin==="hub"&&J?.variants?.length){const Z=j("label","Packa\
ge variant","pc-browser-variants"),Re=j("select");Re.setAttribute("aria-label","Package variant");for(const Ve of J.variants){
const Gt=j("option",`${Ve.name??Ve.id??Ve.key} · ${Ve.dtype??"Precision unknown"} · ${bn(Ve.totalBytes)}${Ve.requiresInspection?
" · Needs inspection":Ve.loadable===!1?" · Unsupported":""}`);Gt.value=Ve.key??Ve.id,Re.append(Gt)}Re.value=Dt(J)?.key??
Dt(J)?.id,Re.disabled=W||ee,Re.onchange=()=>{const Ve=Re.value;wt.set(oe,Ve),he({revealSelected:!0}),J.variants.find(Gt=>(Gt.
key??Gt.id)===Ve)?.requiresInspection&&At(oe,Ve)},Z.append(Re),N.append(Z)}const $e=j("dl",void 0,"pc-browser-facts"),ze=(Z,Re)=>$e.
append(j("dt",Z),j("dd",Re));ze("Task",u.browserSummary&&!u.task?"Inspect to determine":ao(u));const ut=u.modalities??u.
model?.modalities;Array.isArray(ut)&&ze("Inputs",ut.join(", ")),ze("Package",bn(u.totalBytes)),ze("Precision",_n(u)||"Un\
known"),ze("License",typeof u.license=="string"?u.license:u.license?.spdx??u.license?.join?.(", ")??"Not supplied"),ze("\
Revision",u.revision??u.model?.revision??"Not inspected");const We=Vt(u);ze("Estimated RAM",bn(We.cpuBytes>0?We.cpuBytes:
void 0)),ze("Estimated GPU memory",bn(We.gpuBytes>0?We.gpuBytes:void 0)),N.append($e),typeof u.license?.notice=="string"&&
N.append(j("p",u.license.notice.slice(0,1e3),"pc-browser-note"));const Xt=u.capabilities??u.package?.capabilities;typeof Xt?.
executionReason=="string"&&N.append(j("p",Xt.executionReason.slice(0,1200),Xt.executionStatus==="candidate"?"pc-browser-\
warning":"pc-browser-note")),N.append(j("p",u.browserSummary?"Search metadata is not a verified runnable package. Inspec\
t its variants before loading.":u.loadable===!1?u.reason||"This package is not supported by the current runtimes.":We.reason||
(We.status==="available"?"Required device features are available.":"Memory fit is unverified; this browser cannot report\
 free GPU memory."),xn(We)||u.loadable===!1?"pc-browser-warning":"pc-browser-note")),N.append(j("p",Yn(u)==="Catalog"?"C\
atalog provenance does not guarantee model quality or performance on this device.":"Candidate packages have not necessar\
ily been tested on this device. Review the model card and license.","pc-browser-note")),J&&l&&Ut(u)&&fe(N,u,M),s&&!u.browserSummary&&
(u.manifestCid||/^[a-f0-9]{40}$/.test(u.revision??u.model?.revision))&&(ve=Ea({source:u,query:s}),N.append(ve.element));
const z=j("div",void 0,"pc-browser-actions");if(u.browserSummary||u.requiresInspection){const Z=_t(u.requiresInspection?
"Inspect selected variant":"Inspect variants");Z.disabled=W||ee||dt===oe||!i,Z.onclick=()=>{ce=u.key;const Re=Dt(J);At(oe,
u.requiresInspection?Re?.key??Re?.id:void 0)},z.append(Z)}const Me=_t("Load");Me.disabled=W||ee||!Kt(u)||!Qe(u)||!d,Me.onclick=
()=>{const Z=B().find(Re=>Re.key===u.key);if(W||ee||!Kt(Z)||!Qe(Z)){he();return}Ee(()=>d(Z.package??Z))},z.append(Me);const ot=yn(
u,Rt());for(const Z of ot){const Re=_t(`Use peer${Z.busy?" (busy)":""}`);Re.disabled=W||ee||!b,Re.title=`${Z.providerCount??
1} online provider${Z.providerCount===1?"":"s"}; uses the peer without downloading model weights.`,Re.onclick=()=>{const Ve=yn(
u,Rt()).find(Gt=>Gt.key===Z.key);!W&&!ee&&Ve?Ee(()=>b(Ve.key)):he()},z.append(Re)}if(!u.browserSummary&&xn(We)&&g){const Z=_t(
"Setup help");Z.disabled=W||ee,Z.onclick=()=>void Ee(()=>g(u.package??u)),z.append(Z)}if(ot.length&&N.append(j("p","Peer\
 inference stays available even when this device cannot load the model. The selected peer receives your prompt.","pc-bro\
wser-note")),ge.append(z),R){const Z=[...ge.querySelectorAll("[data-browser-control]")].find(Re=>Re.dataset.browserControl===
R);Z?Z.focus({preventScroll:!0}):R==="conversion-search"&&ge.querySelector("[data-conversion-repository]")?.focus({preventScroll:!0})}}
function lt(u,M){u.append(j("p",`Publisher-declared source: ${M.sourceRepository}. Relationship: ${M.relationship}. This\
 does not prove equivalent weights or the same source revision.`,"pc-browser-note"));const P=_t("Back to source model");
P.disabled=W||ee,P.onclick=()=>{W||ee||!B().some(R=>R.key===M.sourceKey)||(ce=M.sourceKey,be=ce,he({revealSelected:!0}))},
u.append(P)}function fe(u,M,P){const R=Ut(M),N=vt.get(R),oe=j("section",void 0,"pc-browser-conversions");oe.setAttribute(
"aria-label","Related browser packages"),oe.append(j("h4","Related browser packages"));const Ie=j("p","","pc-browser-not\
e");if(Ie.setAttribute("role","status"),Ie.textContent=N?.status==="pending"?"Finding publisher-declared conversions…":
N?.status==="error"?`Conversion search unavailable: ${N.error}`:N?.status==="cancelled"?"Conversion search cancelled. Yo\
u can retry.":N?.status==="complete"?[N.items.length?"Candidates need package inspection before loading.":"No publisher-\
declared ONNX or GGUF relatives were found.",N.warning,N.cached?"Showing cached conversion metadata.":""].filter(Boolean).
join(" "):"Find ONNX or GGUF packages whose publisher identifies this source model.",oe.append(Ie),N?.status!=="complete"){
const J=_t(N?.status==="pending"?"Cancel conversion search":"Find browser conversions");J.dataset.browserControl="conver\
sion-search",J.disabled=W||ee,J.onclick=()=>{W||ee||(be=M.key,N?.status==="pending"?vt.cancel():vt.find(R))},oe.append(J)}
for(const J of N?.items??[]){const $e=_t("");$e.className="pc-browser-conversion",$e.dataset.conversionRepository=J.repository,
$e.dataset.browserControl=`conversion:${J.repository}`,$e.append(j("strong",J.name),j("small",J.repository),j("small",`${J.
formats.join(" / ")} · ${J.relationship} · Candidate · Needs inspection`),j("small",`Publisher-declared source: ${J.sourceRepository}`)),
$e.disabled=W||ee,$e.onclick=()=>{if(W||ee)return;const ze=`hub:${J.repository}@${J.revision}`,ut={repository:J.repository,
name:J.name,description:J.description,task:J.task,browserKey:ze,inspectReference:J.reference,browserConversion:{sourceKey:M.
key,sourceRepository:P,relationship:J.relationship}};Ue=[...Ue.filter(We=>(We.browserKey??`hub:${We.repository}`)!==ze),
ut],ce=ze,be=ze,xt="",Et="",he({revealSelected:!0}),Je.has(J.reference)||At(J.reference)},oe.append($e)}u.append(oe)}async function Ee(u){
if(!(_||W||ee)){ee=!0,T||ht(),he();try{await u()}catch(M){_||(Et=wn(M))}finally{ee=!1,he()}}}async function At(u,M){const P=Nn(
u),R=P.repository??u;if(_||W||!i||!tn(R))return;be=ce;const N=M?Je.get(u)?.revision:null,oe=P.revision??N,Ie=M&&/^[a-f0-9]{40}$/i.
test(N??"")?`${tn(R)}/tree/${N}`:u;Le?.abort();const J=new AbortController;Le=J;const $e=++Ke,ze=ce;dt=u,xt="",he();try{
const ut=await i(Ie,{selectedVariant:M,signal:J.signal});if(_||J.signal.aborted||$e!==Ke)return;if(!ut||ut.repository!==
R||!Array.isArray(ut.variants))throw new Error("Invalid model inspection response");if(oe&&ut.revision!==oe)throw new Error(
"Inspection returned a different model revision");Je.set(u,{...ut,browserReference:u}),ut.variants.length||(xt="No suppo\
rted package variants were found in this repository.")}catch(ut){!_&&!J.signal.aborted&&$e===Ke&&(xt=`Inspection failed:\
 ${wn(ut)}`)}finally{$e===Ke&&(dt=null,Le=null,he({revealSelected:ce===ze}))}}function V(){clearTimeout(mt),tt?.abort(),
Le?.abort(),vt.cancel(),++rt,++Ke,tt=null,Le=null,xe=!1,dt=null}async function et(u=!1){if(clearTimeout(mt),_||W||Fe||!m.
open||ke!=="browse")return;const M=Nn(q.value);if(M.error){it=!1,ue=M.error,he();return}if(!St())return;tt?.abort();const P=new AbortController;
tt=P,it=!0,Nt=u;const R=++rt;xe=!0,ue="",he();try{const N=await o({query:M.query,task:ie.task.value==="all"?void 0:ie.task.
value,cursor:u?nt:void 0,signal:P.signal});if(_||P.signal.aborted||R!==rt)return;if(!N||!Array.isArray(N.items))throw new Error(
"Invalid search response");let oe=N.items.filter(Ie=>Ie&&tn(Ie.repository));if(M.repository){const Ie=oe.find(J=>J.repository===
M.repository);oe=oe.filter(J=>J.repository!==M.repository),oe.unshift({...Ie,repository:M.repository,name:Ie?.name??M.repository,
inspectReference:M.reference,browserKey:`hub:${M.repository}${M.revision?"@"+M.revision:""}`})}Ue=[...new Map([...u?Ue:[],
...oe].map(Ie=>[Ie.repository,Ie])).values()].slice(0,200),nt=Ue.length<200?N.nextCursor??null:null,ue=[N.warning,N.cached?
"Showing cached Hugging Face results.":""].filter(Boolean).join(" ")}catch(N){!_&&!P.signal.aborted&&R===rt&&(ue=`Huggin\
g Face search unavailable: ${wn(N)}. Catalog, stored models and peer files remain available.`)}finally{R===rt&&(it=!1,xe=
!1,tt=null,he())}}function St(){return!!(o&&["all","hub"].includes(ie.source.value)&&(q.value.trim()||ie.source.value===
"hub"))}function on(){V(),Ue=[],nt=null,ue="",xt="",Et="",be=null,it=St(),Nt=!1,he(),it&&(mt=setTimeout(()=>void et(),350))}
q.addEventListener("input",on),q.addEventListener("keydown",u=>{u.key==="Enter"&&(u.preventDefault(),et())});for(const[u,
M]of Object.entries(ie))M.addEventListener("change",()=>{u==="task"||u==="source"?on():he()});le.onclick=()=>void et(!0);
function ht(){V(),ft(),Ye=!1,Ze(),m.open&&m.close()}async function gn(){if(Xe)return;if(!Fe&&_e.matches&&ke==="browse"&&
Ye){kt();return}const u=Fe?.onBack??x;if(!u){ht();return}Xe=!0,Ze();try{await u()}catch(M){_||($.textContent=`Could not \
close: ${wn(M)}. Try again.`,$.hidden=!1)}finally{Xe=!1,_||Ze()}}return O.onclick=gn,m.addEventListener("cancel",u=>{u.preventDefault(),
gn()}),m.addEventListener("close",()=>{m.open||(V(),ft(),Ye=!1,Ze(),$t?.isConnected&&$t.focus({preventScroll:!0}))}),m.addEventListener(
"keydown",u=>{if(u.key==="Escape"){u.preventDefault(),gn();return}if(u.key!=="Tab")return;const M=[...m.querySelectorAll(
"button,input,select,a[href],summary")].filter(N=>!N.disabled&&N.getClientRects().length),P=M[0],R=M.at(-1);u.shiftKey&&
document.activeElement===P&&(u.preventDefault(),R?.focus()),!u.shiftKey&&document.activeElement===R&&(u.preventDefault(),
P?.focus())}),{element:m,setFeedback(u){_||($.textContent=String(u??"").slice(0,2048),$.hidden=!$.textContent)},showPage({
title:u,content:M,onBack:P,buttonLabel:R="Done"}){_||(Fe||(yt=document.activeElement),V(),ft(),Fe={title:u,onBack:P,buttonLabel:R},
U.replaceChildren(M),Ze(),m.open||m.showModal(),(U.querySelector("[autofocus],button:not(:disabled),input:not(:disabled)")??
O).focus({preventScroll:!0}))},showLibrary({refreshStored:u=!1}={}){if(!_&&(Fe=null,U.replaceChildren(),Ze(),he(),m.open)){
const M=yt;yt=null,(M?.isConnected&&!M.disabled&&M.getClientRects().length?M:Ye?O:L[ke]??q).focus({preventScroll:!0}),ke===
"stored"&&u?It():ke==="browse"&&it&&!tt&&!W&&et(Nt)}},open({selectedKey:u,tab:M,refreshStored:P=!0}={}){if(_)return;u!==
void 0&&(ce=u,be!==u&&(be=null));const R=M??(y&&h()?"stored":"browse");m.open||($t=document.activeElement,ke=G[R]?R:"bro\
wse",Ye=!1,Ze(),m.showModal()),Ot(R,{refreshStored:P}),ke==="browse"?q.focus({preventScroll:!0}):L.stored.focus({preventScroll:!0})},
close(){!_&&m.open&&ht()},isStoredOpen:()=>!_&&m.open&&!Fe&&ke==="stored",getActiveTab:()=>ke,refresh:he,setBusy(u){const M=W;
W=!!u,W&&V(),he(),M&&!W&&m.open&&ke==="browse"&&it&&!tt&&et(Nt)},dispose(){_||(ve?.dispose(),_=!0,V(),ft(),_e.removeEventListener(
"change",Se),m.open&&m.close(),m.remove(),Je.clear(),wt.clear(),vt.dispose())}}}function Ta({browser:t,onRequestClose:n}){
const a=new Map;let o,i,l=!1;function s(){o=null,t.showLibrary({refreshStored:l}),l=!1}function f(){return i||(t.setFeedback(
"Closing Models… Waiting for cleanup."),i=Promise.resolve().then(n).catch(d=>{throw s(),t.setFeedback(`Could not close\
 Models: ${d.message}. Click Done to retry.`),d}).finally(()=>{i=null}),i)}return{requestClose:f,showLibrary:s,isShowing:d=>o===
d,show(d,{closeWindow:b=!1,refreshStoredOnReturn:g=!1}={}){let y=a.get(d);if(!y){y=document.createElement("section"),y.className=
"pc-management-content";for(const h of[...d.children])h.classList.contains("pc-dialog-header")||y.append(h);a.set(d,y)}o=
d,l=g,t.showPage({title:d.querySelector("h2")?.textContent??"Models",content:y,buttonLabel:b?"Close Models":"Done",onBack:b?
f:s})}}}const Be=(t,n,a)=>{const o=document.createElement(t);return n!==void 0&&(o.textContent=n),a&&(o.className=a),o},
Io=t=>{const n=Be("button",t);return n.type="button",n},Ln=t=>`${(t/1024**2).toFixed(1)} MiB`;function Ba({container:t,onInspect:n,
onApply:a,onClose:o}={}){if(!t?.append||typeof n!="function"||typeof a!="function")throw new TypeError("LoRA composer re\
quires a container, inspection and apply handlers.");const i=Be("dialog",void 0,"pc-model-dialog pc-lora-composer"),l=Be(
"h2","Add LoRA");l.id=`lora-composer-${crypto.randomUUID()}`,i.setAttribute("aria-labelledby",l.id);const s=Be("div",void 0,
"pc-dialog-header"),f=Io("Done");s.append(l,f);const d=Be("div",void 0,"pc-dialog-body"),b=Be("p");b.style.overflowWrap=
"anywhere";const g=Be("p","Add a GGUF LoRA to this GGUF model. Safetensors and ONNX adapters are not supported here."),y=Be(
"form"),h=Be("input");h.type="text",h.maxLength=1024,h.placeholder="huggingface.co/owner/adapter or a GGUF file URL",h.autocomplete=
"off",h.spellcheck=!1;const S=Be("label","Hugging Face adapter");S.append(h);const k=Be("button","Inspect");k.type="subm\
it",y.append(S,k);const x=Be("fieldset");x.hidden=!0;const T=Be("div"),m=Be("div"),D=Be("p","Adapter file");D.id=`${l.id}\
-files`,m.setAttribute("role","group"),m.setAttribute("aria-labelledby",D.id),T.append(D,m);const e=Be("p");e.style.overflowWrap=
"anywhere";const O=Be("p","Tensor compatibility is checked before download. The publisher may not specify the training b\
ase revision."),Q=Be("input");Q.type="number",Q.min="-2",Q.max="2",Q.step="0.1",Q.value="1";const E=Be("label","Strength");
E.append(Q);const $=Be("input");$.type="text",$.maxLength=256;const U=Be("label","Model name");U.append($);const H=Be("i\
nput");H.type="checkbox",H.checked=!0;const L=Be("label");L.append(H,document.createTextNode(" Load after saving"));const G=Be(
"p","Loading this version unloads the selected model first. Its downloaded files stay stored."),Y=Io("Save and load");x.
append(T,e,O,E,U,L,G,Y);const p=Be("p","","pc-inference-status");p.setAttribute("role","status"),p.setAttribute("aria-li\
ve","polite"),d.append(b,g,y,x),i.append(s,d,p),t.append(i);for(const _ of[S,T,E,U])Object.assign(_.style,{display:"flex",
flexDirection:"column",gap:"0.35rem",marginBottom:"0.75rem"});Object.assign(y.style,{marginBottom:"1rem"}),Object.assign(
x.style,{border:"0",padding:"0",minWidth:"0"});for(const _ of[h,m,$])Object.assign(_.style,{width:"100%",minWidth:"0",boxSizing:"\
border-box"});let C,q=[],X,K=0,te=0,ne=!1,qe=!1,_e;const Se=_=>String(_?.message??_??"Request failed").slice(0,500),ie=()=>q[te],
Oe=()=>Q.value.trim()!==""&&Number.isFinite(Number(Q.value))&&Math.abs(Number(Q.value))<=2;function Pe(){h.disabled=ne,k.
disabled=ne||!h.value.trim();for(const _ of m.querySelectorAll("input"))_.disabled=ne;Q.disabled=$.disabled=H.disabled=ne,
Y.disabled=ne||!ie()||!Oe()||!$.value.trim(),Y.textContent=H.checked?"Save and load":"Save model",f.textContent=ne?"Canc\
el":"Done",G.hidden=!H.checked}function Ne(){const _=ie();e.textContent=_?`${_.profile?.architecture??"GGUF"} · ${Ln(_.
file.size)}`:"",_&&($.value=`${C?.name??"Model"} + ${_.name}`.slice(0,256)),Pe()}function pe(){K+=1,X?.abort(new DOMException(
"Adapter operation cancelled","AbortError")),X=void 0,ne=!1}function ge(){const _=!!C;pe(),C=void 0,q=[],qe||(_e?.isConnected&&
_e.focus(),_&&o?.())}function le(){i.open&&i.close(),ge()}async function ve(_){pe(),X=new AbortController;const W=K,ee=X,
ce=()=>!qe&&!!C&&W===K&&!ee.signal.aborted;ne=!0,p.textContent="",Pe();try{await _(ee.signal,ce)}catch(at){ce()&&(p.textContent=
Se(at))}finally{ce()&&(X=void 0,ne=!1,Pe())}}y.addEventListener("submit",_=>{_.preventDefault(),!(ne||!C||!h.value.trim())&&
(q=[],m.replaceChildren(),x.hidden=!0,ve(async(W,ee)=>{p.textContent="Inspecting adapter files…";const ce=await n(h.value.
trim(),{signal:W});if(ee()){if(!Array.isArray(ce?.variants)||!ce.variants.length)throw new Error("No compatible GGUF LoR\
A files found.");q=ce.variants,te=0,m.replaceChildren(...q.map((at,mt)=>{const tt=Be("label"),Le=Be("input");Le.type="ra\
dio",Le.name=`${l.id}-variant`,Le.value=String(mt),Le.checked=mt===0;const rt=Be("span",`${at.name} · ${Ln(at.file.size)}`);
return Object.assign(tt.style,{display:"flex",alignItems:"start",gap:"0.5rem",marginBottom:"0.5rem"}),Object.assign(rt.style,
{minWidth:"0",overflowWrap:"anywhere"}),tt.append(Le,rt),tt})),x.hidden=!1,Ne(),p.textContent=ce.warning??`${q.length} a\
dapter file${q.length===1?"":"s"} found.`}}))}),Y.addEventListener("click",()=>{if(ne||!C||!ie()||!Oe()||!$.value.trim())
return;const _={baseManifestCid:C.manifestCid,adapter:ie(),scale:Number(Q.value),name:$.value.trim(),load:H.checked};ve(
async(W,ee)=>{p.textContent="Checking adapter compatibility…",await a({..._,signal:W,onProgress(ce){ee()&&(p.textContent=
ce.stage==="import"&&Number.isFinite(ce.totalBytes)?`Saving adapter: ${Ln(ce.loaded??0)} / ${Ln(ce.totalBytes)}`:ce.stage===
"verify"?"Verifying adapter…":ce.stage==="load"?"Loading model…":"Checking adapter compatibility…")}}),ee()&&le()})}),
h.addEventListener("input",()=>{q=[],m.replaceChildren(),x.hidden=!0,p.textContent="",Pe()}),m.addEventListener("change",
_=>{_.target?.type==="radio"&&_.target.checked&&(te=Number(_.target.value),Ne())});for(const _ of[Q,$,H])_.addEventListener(
"input",Pe);return f.addEventListener("click",le),i.addEventListener("cancel",_=>{_.preventDefault(),le()}),i.addEventListener(
"close",()=>{i.open||ge()}),i.addEventListener("keydown",_=>_.stopPropagation()),{element:i,open({manifestCid:_,name:W="\
Model"}={}){if(qe)throw new Error("LoRA composer is disposed.");if(typeof _!="string"||!_)throw new Error("Select one st\
ored GGUF model first.");pe(),_e=document.activeElement,C={manifestCid:_,name:String(W).slice(0,256)},b.textContent=`Bas\
e model: ${C.name}`,q=[],h.value="",m.replaceChildren(),x.hidden=!0,Q.value="1",H.checked=!0,p.textContent="",$.value="",
Pe(),i.open||i.showModal(),h.focus()},close:le,dispose(){qe||(qe=!0,le(),i.remove())}}}let _a=0;function Pa(t){const n=(le,ve,_)=>{
const W=document.createElement(le);return ve&&(W.textContent=ve),_&&(W.className=_),W},a=le=>{const ve=n("button",le);return ve.
type="button",ve},o=(le,ve)=>{const _=n("label",le);return _.append(ve),_},i=(le,ve,_)=>{const W=n(le);return W.setAttribute(
"aria-label",ve),_&&(W.maxLength=_),W},l=n("dialog",null,"pc-agent-console"),s=n("h2","Agents");s.id=`pc-agents-${++_a}`,
l.setAttribute("aria-labelledby",s.id);const f=a("Done"),d=n("header");d.append(s,f);const b=n("p","","pc-agent-status");
b.setAttribute("role","status"),b.setAttribute("aria-live","polite");const g=n("div",null,"pc-agent-body"),y=n("div",null,
"pc-agent-main"),h=n("aside");h.setAttribute("aria-label","Saved agents");const S=a("New agent"),k=a("Restore as new"),x=i(
"input","Restore agent file");x.type="file",x.accept=".json,application/json",x.hidden=!0;const T=n("div",null,"pc-agent\
-buttons");T.append(S,k,x);const m=n("div",null,"pc-agent-list");m.setAttribute("aria-label","Agent list"),h.append(T,m);
const D=n("section",null,"pc-agent-workspace"),e=n("h3","Create or select an agent"),O=n("p","","pc-agent-note"),Q=n("p",
"","pc-agent-note"),E=n("p","","pc-agent-record-text"),$=n("p","","pc-agent-record-text"),U=n("dl",null,"pc-agent-record");
for(const[le,ve]of[["Instructions",E],["Goals",Q],["Saved memory summary",$]]){const _=n("dd");_.append(ve),U.append(n("\
dt",le),_)}const H=n("div",null,"pc-agent-buttons"),L=a("Chat"),G=a("Edit agent"),Y=a("Pause"),p=a("Resume"),C=a("Export"),
q=a("Delete agent");H.append(L,G,Y,p,C,q);const X=n("p","","pc-agent-policy"),K=n("p","Chat opens this agent in the main\
 conversation. Resume allows new messages; it never starts a task.","pc-agent-note");D.append(e,O,H,X,U,K),y.append(h,D);
const te=n("form",null,"pc-agent-editor");te.hidden=!0;const ne=n("h3","New agent"),qe=i("input","Agent name",120);qe.required=
!0;const _e=i("textarea","Instructions",16e3);_e.rows=4;const Se=i("textarea","Goals",8e3);Se.rows=3;const ie=i("textare\
a","Saved memory summary",16e3);ie.rows=4;const Oe=i("select","Inference policy");for(const[le,ve]of[["local-only","Loca\
l only"],["network-assisted","Mixed · local first, then peers"]]){const _=n("option",ve);_.value=le,Oe.append(_)}const Pe=n(
"p","Mixed uses a compatible local model first, then an available peer. Your instructions, goals, saved context, message\
s and attachments may be sent to that peer. Local only keeps execution on this device.","pc-agent-policy"),Ne=a("Save ag\
ent");Ne.type="submit";const pe=a("Cancel edit"),ge=n("div",null,"pc-agent-buttons");return ge.append(Ne,pe),te.append(ne,
o("Name",qe),o("Instructions",_e),o("Goals · one per line",Se),o("Saved memory summary",ie),o("Inference policy",Oe),Pe,
ge),g.append(y,te),l.append(d,b,g),t.append(l),{element:l,close:f,status:b,body:g,main:y,create:S,restore:k,restoreFile:x,
list:m,workspace:D,name:e,metadata:O,identity:Q,instructionsText:E,summaryText:$,chat:L,edit:G,pause:Y,resume:p,exportButton:C,
remove:q,policy:X,editor:te,editorHeading:ne,agentName:qe,instructions:_e,goals:Se,summary:ie,mode:Oe,save:Ne,cancelEdit:pe}}
const Xn=t=>String(t?.message||t||"Agent operation failed"),Na=new Set(["queued","running","cancelling"]);function Oa({container:t,
controller:n,onChat:a}={}){if(!t||!n)throw new TypeError("Agent Console needs a container and controller");const o=Pa(t);
let i=!1,l=null,s=null,f=[],d=0,b=null,g=null,y=null,h=null,S=!0,k=!1,x=null,T=null;const m=new Map,D=()=>!!(b||g||l&&l!==
s?.agentId||Na.has(s?.activity?.status));function e(p,C=!1){i||(o.status.textContent=p,o.status.dataset.error=String(C))}
function O(){const p=D(),C=!!s,q=s?.status==="paused",X=!!(s?.activity?.unsaved||s?.recoveryRequired);for(const K of[o.create,
o.restore,o.edit,o.remove,o.exportButton])K.disabled=p||K!==o.create&&K!==o.restore&&!C;o.restore.hidden=typeof n.importAsNew!=
"function",o.exportButton.hidden=typeof n.export!="function",o.chat.hidden=typeof a!="function",o.chat.disabled=!C||p,o.
pause.disabled=!C||q||!!(b||g),o.resume.disabled=!C||!q&&!X||p;for(const K of[o.agentName,o.instructions,o.goals,o.summary,
o.mode,o.save,o.cancelEdit])K.disabled=!!(b||g);for(const K of o.list.querySelectorAll("button"))K.disabled=p;o.element.
setAttribute("aria-busy",String(!!(b||g)))}function Q(){if(o.list.replaceChildren(),!f.length){const p=document.createElement(
"p");p.className="pc-agent-note",p.textContent="No saved agents. Create one to keep its identity and context on this dev\
ice.",o.list.append(p)}for(const p of f){const C=document.createElement("button");C.type="button",C.dataset.agentId=p.agentId,
C.setAttribute("aria-current",String(p.agentId===l)),C.append(document.createTextNode(p.identity?.name||"Unnamed agent"));
const q=document.createElement("small");q.textContent=p.activity?.status||p.status||"Saved",C.append(q),C.addEventListener(
"click",()=>{D()||i||(l=p.agentId,O(),$())}),o.list.append(C)}}function E(){o.name.textContent=s?.identity?.name||"Creat\
e or select an agent",o.metadata.textContent=s?`${s.activity?.status||s.status} · Saved revision ${s.revision} · ${new Date(
s.updatedAt).toLocaleString()}`:"",s?.activity?.unsaved&&(o.metadata.textContent+=" · Unsaved outcome — resolve storage \
before more messages"),s?.recoveryRequired&&(o.metadata.textContent+=" · Interrupted outcome — Resume acknowledges it wi\
thout replay"),o.instructionsText.textContent=s?.identity?.instructions||"No instructions saved.",o.identity.textContent=
s?.goals?.join(`
`)||"No goals saved.",o.summaryText.textContent=s?.context?.summary||"No memory summary saved.",o.policy.textContent=s?s.
policy?.inferenceMode==="network-assisted"?"Mixed · local first, then peers. Selected agent context and message inputs m\
ay be sent to the executing peer.":"Local only. Tasks use a ready model on this device; no peer fallback.":"",Q(),O()}async function $(){
const p=++d;try{const C=await n.list({limit:100});if(i||p!==d)return;f=C,f.some(K=>K.agentId===l)||(l=f[0]?.agentId??null);
const q=l,X=q?await n.get(q):null;return i||p!==d||l!==q?void 0:(s=X,E(),!0)}catch(C){return!i&&p===d&&e(`Could not read\
 saved agents: ${Xn(C)}`,!0),!1}}function U(){k=!0,!x&&(x=(async()=>{for(;k&&!i;)k=!1,await $()})().finally(()=>{x=null}))}
async function H(p,C,q,X="Saved.",K=""){if(b||g||i)return;e(p);const te=Promise.resolve().then(async()=>{try{const ne=await C();
return i||(await q?.(ne),await $()&&e(X)),ne}catch(ne){e(K+Xn(ne),!0)}});b=te,O();try{return await te}finally{b===te&&(b=
null),i||O()}}function L(p){D()||i||(y=p?{id:p.agentId,revision:p.revision}:{},o.editorHeading.textContent=p?"Edit agent":
"New general agent",o.agentName.value=p?.identity?.name||"",o.instructions.value=p?.identity?.instructions||"",o.goals.value=
(p?.goals||[]).join(`
`),o.summary.value=p?.context?.summary||"",o.mode.value=p?.policy?.inferenceMode||"network-assisted",o.main.hidden=!0,o.
editor.hidden=!1,e(""),O(),o.agentName.focus())}function G(){y=null,o.main.hidden=!1,o.editor.hidden=!0,o.create.focus()}
o.close.addEventListener("click",()=>o.element.close()),o.element.addEventListener("close",()=>{!i&&!o.element.open&&S&&
h?.isConnected&&h.focus()}),o.element.addEventListener("keydown",p=>{if(p.key!=="Tab")return;const C=[...o.element.querySelectorAll(
"button,input,textarea,select,[tabindex]")].filter(K=>!K.disabled&&K.getClientRects().length),q=C[0],X=C.at(-1);p.shiftKey&&
document.activeElement===q?(p.preventDefault(),X?.focus()):!p.shiftKey&&document.activeElement===X&&(p.preventDefault(),
q?.focus())}),o.chat.addEventListener("click",()=>{if(!s||D()||i||typeof a!="function")return;const p=s.agentId;e("Openi\
ng conversation…");const C=Promise.resolve().then(()=>a(p));g=C,O(),C.then(()=>{i||(S=!1,o.element.close())},q=>e(`Cou\
ld not open chat: ${Xn(q)}`,!0)).finally(()=>{g===C&&(g=null),i||O()})}),o.create.addEventListener("click",()=>L()),o.edit.
addEventListener("click",()=>{s&&L(s)}),o.cancelEdit.addEventListener("click",G),o.editor.addEventListener("submit",p=>{
if(p.preventDefault(),!y||!o.agentName.value.trim())return;const C={name:o.agentName.value.trim(),instructions:o.instructions.
value,goals:o.goals.value.split(`
`).map(X=>X.trim()).filter(Boolean),summary:o.summary.value,inferenceMode:o.mode.value},q=y;H("Saving agent…",()=>q.id?
n.update(q.id,C,{expectedRevision:q.revision}):n.create(C),X=>{l=X.agentId,G()})}),o.remove.addEventListener("click",()=>{
if(s&&!D()){const p=s.agentId;H("Deleting agent…",()=>n.remove(p),()=>{l=null,s=null})}}),o.resume.addEventListener("c\
lick",()=>{if(s&&!o.resume.disabled){const p=s.agentId;H("Resuming agent…",()=>n.resume(p),null,"Resumed. Send a messa\
ge in the main chat when ready.")}}),o.pause.addEventListener("click",()=>{if(s&&!o.pause.disabled){const p=s.agentId;H(
"Pausing; waiting for task cleanup…",()=>n.pause(p),null,"Paused. Resume allows new messages but does not run them.","\
Cleanup incomplete: ")}}),o.exportButton.addEventListener("click",()=>{if(!s||D())return;const p=s.agentId;H("Preparing \
export…",()=>n.export(p),C=>{const q=new Blob([JSON.stringify(C,null,2)],{type:"application/json"}),X=URL.createObjectURL(
q),K=document.createElement("a");K.href=X,K.download=`agent-${p}.json`,K.click();const te=setTimeout(()=>{URL.revokeObjectURL(
X),m.delete(X)},1e3);m.set(X,te)})}),o.restore.addEventListener("click",()=>o.restoreFile.click()),o.restoreFile.addEventListener(
"change",()=>{const p=o.restoreFile.files?.[0];o.restoreFile.value="",!(!p||D())&&H("Restoring as a new paused agent…",
async()=>{if(p.size>12*1024*1024)throw new Error("Agent backup exceeds 12 MiB");return n.importAsNew(JSON.parse(await p.
text()))},C=>{l=C.agentId})});const Y=n.subscribe?.(p=>{!i&&["changed","activity","removed"].includes(p.type)&&U()});return O(),
{element:o.element,async open(p={}){if(i)throw new Error("Agent Console is closed");p.selectedId!==void 0&&!b&&!g&&(l=p.
selectedId),h=document.activeElement,S=!0,o.element.open||o.element.showModal(),await $()},dispose(){if(T)return T;i=!0,
++d,k=!1,Y?.(),o.element.close();for(const[p,C]of m)clearTimeout(C),URL.revokeObjectURL(p);return m.clear(),T=Promise.allSettled(
[b,g,x]).then(()=>{o.element.remove()}),T}}}const an=t=>structuredClone(t),vn=(t,n)=>Object.assign(new Error(n),{code:t}),
Ua=new Set(["queued","running","cancelling"]),Ga=t=>new TextEncoder().encode(t).byteLength;function Mo(t){if(!t)throw vn(
"ERR_AGENT_NOT_FOUND","This saved agent no longer exists.");if(t.activity?.unsaved)throw vn("ERR_AGENT_UNSAVED","Agent c\
hanges are not saved. Resume to retry saving before another task.");if(t.recoveryRequired)throw vn("ERR_AGENT_RECOVERY_R\
EQUIRED","Resume to acknowledge this interrupted task; it will not replay.");if(t.status==="paused")throw vn("ERR_AGENT_\
PAUSED","Resume this paused agent before sending a task.");if(Ua.has(t.activity?.status)||t.status==="running")throw vn(
"ERR_AGENT_BUSY","Wait for this agent task and its cleanup to finish.");if(!["local-only","network-assisted"].includes(t.
policy?.inferenceMode))throw new Error("Unknown agent inference policy");return t}function Da({controller:t,onChange:n}={}){
if(!t?.list||!t?.get||!t?.events||!t?.run||!t?.cancel||!t?.resume||!t?.getAttachment)throw new TypeError("Agent chat req\
uires a persistent agent controller");const a=new AbortController;let o=!1,i=[],l,s=!1,f=0;function d(){if(o)throw new Error(
"Agent chat session is closed")}function b(E,...$){if(!(o||typeof E!="function"))try{Promise.resolve(E(...$)).catch(()=>{})}catch{}}
function g(E){b(n,an(i),E)}function y(E,$){d();const U=$?AbortSignal.any([$,a.signal]):a.signal;return U.throwIfAborted(),
new Promise((H,L)=>{const G=()=>L(U.reason);U.addEventListener("abort",G,{once:!0}),Promise.resolve().then(()=>(U.throwIfAborted(),
E(U))).then(Y=>(U.throwIfAborted(),an(Y))).then(H,L).finally(()=>U.removeEventListener("abort",G))})}function h(){return d(),
l||(s=!0,l=(async()=>{for(;s;){s=!1;const E=f,$=await y(U=>t.list({limit:100,signal:U}));if(!Array.isArray($)||$.length>
100)throw new Error("Invalid saved-agent list");if(E!==f){s=!0;continue}i=$,g()}return an(i)})().finally(()=>{l=null}),l)}
const S=t.subscribe?.(E=>{o||!["changed","removed","activity"].includes(E?.type)||(f++,s=!0,h().catch($=>{o||g({error:$})}))});
async function k(E,{signal:$}={}){ln(E);const U=await y(()=>t.get(E),$);if(U&&U.agentId!==E)throw new Error("Saved agent\
 identity does not match the requested chat");return U}async function x(E,{signal:$}={}){ln(E);const U=[];let H;for(let G=0;G<
3;G++){const Y=await y(p=>t.events(E,{limit:100,after:H,signal:p}),$);if(!Array.isArray(Y)||Y.length>100)throw new Error(
"Invalid saved agent history");for(const p of Y){if(p.agentId!==void 0&&p.agentId!==E)throw new Error("Saved history bel\
ongs to another agent");if(!Number.isSafeInteger(p.sequence)||p.sequence<=(H??0))throw new Error("Invalid agent history \
cursor");H=p.sequence,U.push(p)}if(Y.length<100)break}const L=new Set(U.filter(G=>G.conversationId!==void 0&&G.operationId).
map(G=>G.operationId));return U.filter(G=>G.conversationId===void 0&&!L.has(G.operationId))}async function T(E,$,{signal:U}={}){
ln(E),ln($);const H=await y(()=>t.getAttachment(E,$),U);if(!H)return null;if(H.id!==$||H.agentId!==void 0&&H.agentId!==E)
throw new Error("Saved image belongs to another agent attachment");return Xo(H)}async function m(E,{task:$,prompt:U,image:H,
maxNewTokens:L,seed:G,concise:Y,signal:p,onToken:C,onProgress:q}={}){ln(E),d(),p?.throwIfAborted();const X=mo({task:$,prompt:U,
image:H,maxNewTokens:L,seed:G,concise:Y});Mo(await k(E,{signal:p})),p?.throwIfAborted();const K=await t.run(E,{...X,signal:p,
onEvent(ne){o||p?.aborted||ne?.agentId!==E||(ne.type==="token"&&typeof ne.text=="string"?b(C,ne.text):ne.type==="progres\
s"&&b(q,an(ne.event)))}}),te=an(K?.result);if(K?.agentId!==void 0&&K.agentId!==E)throw new Error("Agent result belongs t\
o another chat");if(!te||typeof te.text!="string"||Ga(te.text)>65536)throw new Error("Invalid saved agent result");if(te.
image!=null){if(X.task!=="text-to-image")throw new Error("Unexpected image in agent text response");te.image=mo({task:"i\
mage-text-to-text",prompt:"Validate result",image:te.image}).image}else if(X.task==="text-to-image")throw new Error("Age\
nt image generation returned no image");return{...te,route:an(K.route),agentId:E,requestId:K.requestId}}async function D(E,$){
return Mo(await k(E,$)).policy.inferenceMode==="local-only"?"local-only":"mixed"}function e(E){return d(),ln(E),t.cancel(
E)}async function O(E){d(),ln(E);const $=await t.resume(E);return o||await h(),an($)}function Q(){o||(o=!0,f++,s=!1,a.abort(
new DOMException("Agent chat session closed","AbortError")),S?.(),i=[])}return{refresh:h,list:()=>an(i),get:k,history:x,
attachment:T,run:m,speechTarget:D,cancel:e,resume:O,dispose:Q}}function qa({button:t,onStart:n,onRelease:a,onCancel:o}){
if(!t?.ownerDocument||typeof n!="function"||typeof a!="function"||typeof o!="function")throw new TypeError("HoldToRecord\
 requires a button and start/release/cancel callbacks");const i=t.ownerDocument,l=i.defaultView,s=[],f=t.style.touchAction;
let d=null,b=!1;t.style.touchAction="none";function g(m,D,e,O){m.addEventListener(D,e,O),s.push(()=>m.removeEventListener(
D,e,O))}function y(){const m=d;if(d=null,m?.kind==="pointer")try{t.hasPointerCapture(m.pointerId)&&t.releasePointerCapture(
m.pointerId)}catch{}return m}function h(m,D,e){const O=y();O&&m({...O,event:D,reason:e})}function S(m,D){h(o,m,D)}function k(){
return!b&&!d&&!t.disabled&&t.getAttribute("aria-disabled")!=="true"}function x(m,D){if(d=m,m.kind==="pointer")try{t.setPointerCapture(
m.pointerId)}catch{}try{n({...m,event:D})}catch(e){throw y(),e}}const T=m=>m.key===" "||m.key==="Spacebar"?"Space":m.key===
"Enter"?"Enter":null;return g(t,"pointerdown",m=>{!k()||m.isPrimary===!1||m.button!==0||(m.preventDefault(),t.focus({preventScroll:!0}),
x({kind:"pointer",pointerId:m.pointerId},m))}),g(l,"pointerup",m=>{d?.kind!=="pointer"||m.pointerId!==d.pointerId||(m.preventDefault(),
h(a,m,"release"))},!0),g(l,"pointercancel",m=>{d?.kind==="pointer"&&m.pointerId===d.pointerId&&S(m,"pointercancel")},!0),
g(t,"lostpointercapture",m=>{d?.kind==="pointer"&&m.pointerId===d.pointerId&&S(m,"lostpointercapture")}),g(t,"keydown",m=>{
const D=T(m);D&&(m.preventDefault(),!m.repeat&&k()&&x({kind:"keyboard",key:D},m))}),g(l,"keyup",m=>{d?.kind!=="keyboard"||
T(m)!==d.key||(m.preventDefault(),h(a,m,"release"))},!0),g(t,"click",m=>m.preventDefault()),g(t,"contextmenu",m=>m.preventDefault()),
g(t,"blur",m=>S(m,"blur")),g(l,"blur",m=>S(m,"blur")),g(i,"visibilitychange",m=>{i.hidden&&S(m,"hidden")}),{getState:()=>d?
{...d}:null,reset(){y()},dispose(){if(!b){b=!0;try{S(void 0,"dispose")}finally{for(const m of s)m();t.style.touchAction===
"none"&&(t.style.touchAction=f)}}}}}const qo=80,Fa=new TextEncoder,Ht=(t,n,a)=>{const o=document.createElement(t);return n&&
(o.className=n),a!==void 0&&(o.textContent=a),o};function Lo(t){if(typeof t!="string")return"Anonymous";const n=t.slice(
0,1024).replace(/[\u0000-\u001f\u007f]/g," ").trim().replace(/\s+/g," ");let a="",o=0;for(const i of n){const l=Fa.encode(
i).length;if(o+l>qo)break;a+=i,o+=l}return a.trim()||"Anonymous"}function Ha({panel:t,personalView:n,onSelect:a,storage:o,
storageKey:i="peercompute:inference:display-name:v1"}={}){if(!t?.insertBefore||!n?.transcript||!n?.empty||n.transcript.parentNode!==
t)throw new TypeError("Chat channels require the existing personal transcript");if(o===void 0)try{o=globalThis.localStorage}catch{
o=null}const l=Ht("section","pc-chat-channels"),s=Ht("div","pc-chat-channel-header"),f=Ht("div","pc-chat-channel-tabs");
f.setAttribute("role","tablist"),f.setAttribute("aria-label","Chat channels");const d=Ht("label","pc-chat-name"),b=Ht("i\
nput");b.type="text",b.maxLength=qo,b.placeholder="Your name",b.setAttribute("aria-label","Display name"),b.autocomplete=
"nickname",b.title="Name shown beside your Global prompts and replies";try{b.value=Lo(o?.getItem(i))}catch{b.value="Anon\
ymous"}const g=Ht("p","pc-chat-channel-description"),y=Ht("p","pc-chat-channel-status");y.setAttribute("role","status"),
y.hidden=!0,d.append(b),s.append(f,d),l.append(s,g,y);const h={id:n.transcript.id,label:n.transcript.getAttribute("aria-\
label"),hidden:n.transcript.hidden},S=Ht("div","pc-inference-transcript");S.setAttribute("role","log"),S.setAttribute("a\
ria-live","polite");const k=Ht("p","pc-chat-empty","Start a conversation. Global prompts and replies are shared with con\
nected peers.");S.append(k);const x={global:{transcript:S,empty:k},personal:n},T=new Map,m={},D=crypto.randomUUID();t.insertBefore(
l,n.transcript);const e=n.transcript.nextSibling;for(const L of["personal","global"]){const Y=Ht("button","",L==="global"?
"Global":"Personal");Y.type="button",Y.id=`pc-chat-${D}-${L}-tab`,Y.setAttribute("role","tab");const p=Ht("section","pc-\
chat-channel-panel");p.id=`pc-chat-${D}-${L}`,p.setAttribute("role","tabpanel"),p.setAttribute("aria-labelledby",Y.id),Y.
setAttribute("aria-controls",p.id),t.insertBefore(p,e);const C={transcript:x[L].transcript,empty:x[L].empty};L==="global"&&
C.transcript.setAttribute("aria-label","Global conversation"),p.append(C.transcript),T.set(L,{id:L,view:C,container:p,histories:new Map,
draft:{text:"",attachment:null},targetKey:"mixed",generateImage:!1,speakReplies:!1}),m[L]=Y,f.append(Y)}let O="personal",
Q=!1,E=!1;function $(){for(const[L,G]of T){const Y=L===O;G.container.hidden=!Y,G.view.transcript.hidden=!Y,m[L].setAttribute(
"aria-selected",String(Y)),m[L].tabIndex=Y?0:-1,m[L].disabled=Q}d.hidden=O!=="global",b.disabled=Q,g.textContent=O==="gl\
obal"?"Global prompts and replies are visible to everyone on the peer network.":"Personal conversations are separate fro\
m the Global feed.",y.hidden=O!=="global"||!y.textContent}function U(L){if(!T.has(L))throw new TypeError("Unknown chat c\
hannel");if(E||Q||L===O)return!1;const G=T.get(O);return O=L,$(),a?.({previous:G,current:T.get(O)}),!0}for(const[L,G]of Object.
entries(m))G.onclick=()=>U(L);f.onkeydown=L=>{if(Q||!["ArrowLeft","ArrowRight","Home","End"].includes(L.key))return;L.preventDefault();
const G=L.key==="Home"?"personal":L.key==="End"?"global":O==="global"?"personal":"global";U(G),m[G].focus()};const H=()=>{
b.value=Lo(b.value);try{o?.setItem(i,b.value)}catch{}};return b.onchange=H,b.onblur=H,$(),{element:l,tabs:m,nameInput:b,
get active(){return O},getChannel(L){if(!T.has(L))throw new TypeError("Unknown chat channel");return T.get(L)},select:U,
getName(){return H(),b.value},setBusy(L){E||(Q=!!L,$())},setStatus(L){E||(y.textContent=String(L??"").slice(0,512),$())},
dispose(){if(E)return;E=!0;for(const G of Object.values(m))G.onclick=null;f.onkeydown=null,b.onchange=null,b.onblur=null,
T.get("personal").container.before(n.transcript),n.transcript.hidden=h.hidden,h.label===null?n.transcript.removeAttribute(
"aria-label"):n.transcript.setAttribute("aria-label",h.label),n.transcript.id=h.id;for(const G of T.values())G.container.
remove(),G.histories.clear(),G.draft={text:"",attachment:null};l.remove()}}}const ja=64*1024,za=8,Wa=16*1024*1024,Va=new TextEncoder,
Pt=(t,n,a)=>{const o=document.createElement(t);return n&&(o.className=n),a!==void 0&&(o.textContent=a),o};function $n(t,n,a,{
empty:o=!0}={}){if(typeof t!="string"||!o&&!t||t.length>n||Va.encode(t).length>n)throw new TypeError(`Invalid Global ${a}`);
return t}function Ka(t){if(!t||!["prompt","result","error","audio"].includes(t.phase))throw new TypeError("Invalid Globa\
l phase");if($n(t.peerId,256,"peer",{empty:!1}),typeof t.turnId!="string"||!/^[a-zA-Z0-9_-]{1,80}$/.test(t.turnId))throw new TypeError(
"Invalid Global turn");if($n(t.name,80,"name",{empty:!1}),$n(t.text??"",ja,"text"),t.modelName!==void 0&&$n(t.modelName,
256,"model name"),t.image!==void 0){const{width:n,height:a,channels:o,data:i}=t.image??{};if(!["prompt","result"].includes(
t.phase)||!Number.isSafeInteger(n)||!Number.isSafeInteger(a)||n<1||a<1||n>1024||a>1024||n*a>1024**2||o!==4||!(i instanceof
Uint8Array)||i.byteLength!==n*a*4)throw new TypeError("Invalid Global image")}if(t.phase==="audio"){const{samples:n,sampleRate:a}=t.
audio??{};if(!Number.isSafeInteger(t.part)||t.part<0||t.part>1023||!(n instanceof Float32Array)||!Number.isSafeInteger(a)||
a<8e3||a>48e3||!n.length||n.length>a*30)throw new TypeError("Invalid Global audio");for(const o of n)if(!Number.isFinite(
o)||Math.abs(o)>10)throw new TypeError("Invalid Global audio sample")}else if(t.audio!==void 0)throw new TypeError("Audi\
o requires a Global audio event")}function Ya({samples:t,sampleRate:n}){const a=new ArrayBuffer(44+t.length*2),o=new DataView(
a),i=(l,s)=>{for(let f=0;f<s.length;f++)o.setUint8(l+f,s.charCodeAt(f))};i(0,"RIFF"),o.setUint32(4,a.byteLength-8,!0),i(
8,"WAVE"),i(12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,n,!0),o.setUint32(
28,n*2,!0),o.setUint16(32,2,!0),o.setUint16(34,16,!0),i(36,"data"),o.setUint32(40,t.length*2,!0);for(let l=0;l<t.length;l++){
const s=Math.max(-1,Math.min(1,t[l]));o.setInt16(44+l*2,Math.round(s*(s<0?32768:32767)),!0)}return new Blob([a],{type:"a\
udio/wav"})}function Xa({transcript:t,empty:n,maxTurns:a=60}={}){if(!t?.append||!n||!Number.isSafeInteger(a)||a<1||a>200)
throw new TypeError("A bounded Global transcript is required");const o=new Map,i=new Map,l=Go(t);let s=!1,f=0;function d(h,S=!1){
const k=i.get(h);k&&(h.pause(),h.removeAttribute("src"),h.load(),URL.revokeObjectURL(k.url),f-=k.bytes,i.delete(h),S&&t.
contains(h)&&h.replaceWith(Pt("p","pc-global-media-note","Earlier speech preview released.")))}function b(h){h.controller.
abort();for(const S of[...i.keys()])h.element.contains(S)&&d(S);h.element.remove()}function g(){for(;o.size>a;){const[h,
S]=o.entries().next().value;b(S),o.delete(h)}for(const h of[...i.keys()])t.contains(h)||d(h);for(;i.size>za||f>Wa;)d(i.keys().
next().value,!0);l.prune()}function y(h){const S=Pt("section","pc-global-turn");S.dataset.peerId=h.peerId,S.dataset.turnId=
h.turnId,S.setAttribute("aria-label",`Global turn by ${h.name}`);const k=Pt("article","pc-chat-message pc-chat-message-u\
ser");k.hidden=!0;const x=Pt("span","pc-chat-speaker",h.name);x.title=h.peerId;const T=Pt("p","","");k.append(x,T);const m=Pt(
"p","pc-global-pending","Waiting for reply…");m.hidden=!0;const D=Pt("article","pc-chat-message");D.hidden=!0;const e=Pt(
"span","pc-chat-speaker"),O=Pt("p","","");D.append(e,O);const Q=Pt("div","pc-global-audio-parts");return S.append(k,m,D,
Q),n.remove(),t.append(S),{element:S,prompt:k,author:x,promptBody:T,pending:m,result:D,model:e,resultBody:O,audioParts:Q,
phases:new Set,parts:new Map,seenParts:new Uint8Array(1024),controller:new AbortController}}return{get size(){return o.size},
async append(h){if(s)return;Ka(h);const S=`${h.peerId}
${h.turnId}`;let k=o.get(S);if(k||(k=y(h),o.set(S,k),g()),h.phase==="audio"){if(k.seenParts[h.part])return;k.seenParts[h.
part]=1;const x=Ya(h.audio),T=Pt("audio","pc-global-audio");T.controls=!0,T.autoplay=!1,T.preload="none",T.setAttribute(
"aria-label",`Speech for ${h.name}, part ${h.part+1}`);const m=URL.createObjectURL(x);T.src=m,i.set(T,{url:m,bytes:x.size}),
f+=x.size;const D=Pt("div");D.dataset.part=String(h.part),D.append(T),k.parts.set(h.part,D);for(const[,e]of[...k.parts].
sort(([O],[Q])=>O-Q))k.audioParts.append(e);for(;k.parts.size>32;){const e=Math.min(...k.parts.keys());k.parts.get(e).remove(),
k.parts.delete(e)}g()}else{if(k.phases.has(h.phase)||["result","error"].includes(h.phase)&&(k.phases.has("result")||k.phases.
has("error")))return;k.phases.add(h.phase);let x;if(h.phase==="prompt"?(k.prompt.hidden=!1,k.author.textContent=h.name,k.
promptBody.textContent=h.text??"",k.pending.hidden=k.phases.has("result")||k.phases.has("error"),x=k.promptBody):(k.pending.
hidden=!0,k.result.hidden=!1,k.model.textContent=h.phase==="error"?`${h.name} · Request status`:`${h.modelName||"Model"}\
 · for ${h.name}`,k.resultBody.textContent=h.text??"",k.result.classList.toggle("pc-global-error",h.phase==="error"),x=
k.resultBody),h.image)try{const T=await l.append(x,h.image,{signal:k.controller.signal,prompt:h.text??""});h.phase==="pr\
ompt"&&(T.alt=`Image attached by ${h.name}`,T.className="pc-chat-image")}catch(T){T?.name!=="AbortError"&&!s&&o.get(S)===
k&&x.after(Pt("p","pc-global-media-note","Image preview unavailable."))}}!s&&!t.hidden&&(t.scrollTop=t.scrollHeight)},clear(){
if(!s){for(const h of o.values())b(h);o.clear(),t.replaceChildren(n),l.prune()}},dispose(){if(!s){s=!0;for(const h of o.
values())b(h);o.clear();for(const h of[...i.keys()])d(h);l.dispose()}}}}const Ja=t=>t.reason instanceof Error?t.reason:new DOMException(
"Peer connection wait cancelled","AbortError");function Za({node:t,peerId:n,signal:a,timeoutMs:o=5e3,dial:i,assertAllowed:l}={}){
if(!t?.getConnections||!t.addEventListener||!t.removeEventListener||typeof n!="string"||!n||n.length>128||typeof i!="fun\
ction"||typeof l!="function"||!Number.isInteger(o)||o<1||o>15e3)throw new TypeError("Invalid bounded peer connection wai\
t");return new Promise((s,f)=>{let d=!1,b;const g=(S,k)=>{d||(d=!0,clearTimeout(b),t.removeEventListener("connection:ope\
n",h),a?.removeEventListener("abort",y),S?f(S):s(k))},y=()=>g(Ja(a)),h=()=>{if(!d)try{a?.throwIfAborted(),l();const S=t.
getConnections().find(k=>Zn(k)&&k.remotePeer.toString()===n);S&&g(null,S)}catch(S){g(S)}};if(t.addEventListener("connect\
ion:open",h),a?.addEventListener("abort",y,{once:!0}),b=setTimeout(()=>g(Object.assign(new Error("Waiting for an encrypt\
ed peer connection timed out"),{code:"ERR_PEER_CONNECTION_DEADLINE"})),o),b.unref?.(),h(),!d)try{Promise.resolve(i()).then(
h,S=>g(S))}catch(S){g(S)}})}const Rn="/peercompute/global-inference-chat/1.0.0",Ge=Object.freeze({nameBytes:80,textBytes:64*
1024,modelNameBytes:256,frameBytes:120*1024,imagePixels:1024*1024,imageDimension:1024,audioSeconds:30,audioSampleRate:48e3,
maximumPart:1023,maximumPeers:32,fanout:4,maximumSends:2,maximumInbound:4,perPeerInbound:2,requestMs:3e4,connectMs:5e3,sendMs:12e4,
cacheEvents:128,cacheBytes:16*1024*1024,peerCacheBytes:8*1024*1024,historyEvents:64,replayEntries:4096,replayMs:15*6e4,rateWindowMs:1e4,
rateMessages:64,ratePeers:256}),An=Ge,In=new TextEncoder,Qa=new TextDecoder("utf-8",{fatal:!0}),de=(t,n="ERR_GLOBAL_CHAT")=>Object.
assign(new Error(t),{code:n});function ct(t,n){if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).some(a=>!n.includes(
a)))throw de("Unexpected global chat fields")}function Pn(t,n,a,{empty:o=!1}={}){if(typeof t!="string"||!o&&!t.trim()||t.
includes("\0")||In.encode(t).length>n||Qa.decode(In.encode(t))!==t)throw de(`${a} must contain valid text within ${n} UT\
F-8 bytes`,"ERR_GLOBAL_CHAT_INPUT");return t}function On(t){if(typeof t!="string"||!/^[a-zA-Z0-9_-]{1,80}$/.test(t))throw de(
"Invalid global chat identifier");return t}function $o(t){return Object.fromEntries(["gameId","roomId","topologyId"].map(
n=>[n,Pn(t?.[n],240,n)]))}const Fo=["turnId","phase","name","text","modelName","image","audio","part"];function Ho(t){const n={
turnId:On(t.turnId),phase:t.phase,name:Pn(t.name??"Guest",An.nameBytes,"Display name"),text:Pn(t.text??"",An.textBytes,"\
Message",{empty:!0})};if(!["prompt","result","error","audio"].includes(n.phase))throw de("Invalid global chat phase");if(t.
modelName!==void 0&&(n.modelName=Pn(t.modelName,An.modelNameBytes,"Model name")),n.phase==="audio"){if(!t.audio||t.image||
!Number.isInteger(t.part)||t.part<0||t.part>An.maximumPart)throw de("Speech output requires PCM audio and a bounded part\
 number");n.part=t.part}else if(t.audio!==void 0||t.part!==void 0)throw de("Only generated speech may contain audio or a\
 part number");if(n.phase==="error"&&t.image!==void 0)throw de("Error events contain text only");if(n.phase!=="audio"&&!n.
text.trim()&&!t.image)throw de("Global event is empty");return n}function jo(t){ct(t,Fo);const n=Ho(t),a={...n};return t.
image!==void 0&&(ct(t.image,["data","width","height","channels"]),a.image=aa(t.image),n.image={width:a.image.width,height:a.
image.height,channels:4,data:new Uint8Array(t.image.data)}),t.audio!==void 0&&(ct(t.audio,["samples","sampleRate"]),a.audio=
Zo(t.audio.samples,t.audio.sampleRate),n.audio={samples:new Float32Array(t.audio.samples),sampleRate:a.audio.sampleRate}),
{input:n,wire:a}}function Ro(t){ct(t,["id",...Fo]);const n={id:On(t.id),...Ho(t)};if(t.image!==void 0&&(ct(t.image,["wid\
th","height","channels","sha256"]),n.image=Qo(t.image)),t.audio!==void 0&&(ct(t.audio,["format","channels","sampleRate",
"sampleCount","sha256"]),n.audio=ea(t.audio)),In.encode(JSON.stringify(n)).length>An.frameBytes)throw de("Global event m\
etadata is too large");return n}const To=t=>oa(In.encode(JSON.stringify(t))),er=t=>In.encode(JSON.stringify(t)).length+(t.
image?t.image.width*t.image.height*4:0)+(t.audio?t.audio.sampleCount*4:0);function Bo(t){return Object.freeze({...t,...t.
image?{image:{...t.image,data:new Uint8Array(t.image.data)}}:{},...t.audio?{audio:{...t.audio,samples:new Float32Array(t.
audio.samples)}}:{}})}function _o(t,n,{sending:a=!1,cancelled:o=!1}={}){const i=n.filter(s=>s.status==="acknowledged").length,
l=n.length;return{id:t,status:a?"sending":l?i===l?"delivered":i?"partial":"failed":"local-only",delivered:i,total:l,cancelled:o,
recipients:n.map(s=>({...s}))}}const kn=new WeakMap,rn=["type","recipient","scope"],tr=t=>t instanceof Error?t:de(String(
t)),mn=t=>t.reason instanceof Error?t.reason:new DOMException("Global chat cancelled","AbortError");function dn(t,n){const a=new AbortController,
o=t.filter(Boolean).map(l=>{const s=()=>a.abort(mn(l));return l.addEventListener("abort",s,{once:!0}),l.aborted&&s(),()=>l.
removeEventListener("abort",s)}),i=setTimeout(()=>a.abort(de("Global chat delivery timed out","ERR_GLOBAL_CHAT_DEADLINE")),
n);return i.unref?.(),{signal:a.signal,dispose(){clearTimeout(i),o.forEach(l=>l())}}}function De(t,n){const a=Promise.resolve(
t);return n.aborted?(a.catch(()=>{}),Promise.reject(mn(n))):new Promise((o,i)=>{const l=()=>i(mn(n));n.addEventListener(
"abort",l,{once:!0}),a.then(o,i).finally(()=>n.removeEventListener("abort",l))})}function jt(t,n){try{Promise.resolve(t?.
abort(tr(n))).catch(()=>{})}catch{}}async function Tn(t){const n=dn([],250);try{await De(t.close({signal:n.signal}),n.signal)}catch(a){
jt(t,a)}finally{n.dispose()}}function Po(t,n){try{Promise.resolve(t(n)).catch(()=>{})}catch{}}const fn=t=>String(t?.message??
t).slice(0,256);class nr{constructor({networkManager:n,onEvent:a=()=>{},onStatus:o=()=>{},requestTimeoutMs:i=Ge.requestMs,
now:l=()=>performance.now()}={}){if(!n||typeof a!="function"||typeof o!="function"||typeof l!="function"||!Number.isInteger(
i)||i<100||i>Ge.requestMs)throw new TypeError("Global inference chat requires a network manager, callbacks and a bounded\
 timeout");Object.assign(this,{manager:n,onEvent:a,onStatus:o,requestTimeoutMs:i,now:l}),this.controller=new AbortController,
this.session=crypto.randomUUID(),this.operations=new Set,this.inbound=new Map,this.cache=new Map,this.seen=new Map,this.
rates=new Map,this.cacheBytes=0,this.sends=0,this.started=!1,this.closed=!1,this.registered=!1,this.peerCursors={publish:0,
history:0},this.lastError=null,this.lastDelivery=null}get node(){return this.boundNode??this.manager.getLibp2pNode?.()??
this.manager.libp2p}get peerId(){return this.node?.peerId?.toString()}_active(){if(this.closed||!this.started)throw de("\
Global chat is not connected","ERR_GLOBAL_CHAT_CLOSED");if((this.manager.getLibp2pNode?.()??this.manager.libp2p)!==this.
boundNode||JSON.stringify($o(this.manager.config))!==JSON.stringify(this.scope))throw de("Inference network changed; rec\
onnect global chat","ERR_GLOBAL_CHAT_SCOPE")}_known(n){const a=this.manager.peers?.get(n);return!!(this.scope&&n!==this.
peerId&&!this.manager.bootstrapPeerIds?.has(n)&&a&&Object.keys(this.scope).every(o=>a[o]===this.scope[o]))}_peers(){return[
...this.manager.peers?.keys()??[]].filter(n=>this._known(n))}_peerBatch(n){const a=this._peers();if(!a.length)return this.
peerCursors[n]=0,[];const o=this.peerCursors[n]%a.length,i=Math.min(Ge.maximumPeers,a.length);return this.peerCursors[n]=
(o+i)%a.length,Array.from({length:i},(l,s)=>a[(o+s)%a.length])}_track(n){return this.operations.add(n),n.catch(()=>{}).finally(
()=>this.operations.delete(n)),n}_envelope(n,a,o={}){return{type:n,recipient:a,scope:this.scope,...o}}_check(n,a){if(this.
_active(),!this._known(a)||n?.recipient!==this.peerId||Object.keys(this.scope).some(o=>n.scope?.[o]!==this.scope[o]))throw de(
"Global chat authenticated peer or scope mismatch","ERR_GLOBAL_CHAT_SCOPE");ct(n.scope,Object.keys(this.scope))}_rate(n){
const a=this.now();for(const[i,l]of this.rates){const s=l.filter(f=>a-f<Ge.rateWindowMs);s.length?this.rates.set(i,s):this.
rates.delete(i)}const o=this.rates.get(n)??[];if(o.length>=Ge.rateMessages||!this.rates.has(n)&&this.rates.size>=Ge.ratePeers+
1)throw de("Global chat rate limit reached; wait a few seconds","ERR_GLOBAL_CHAT_RATE");o.push(a),this.rates.set(n,o)}getStatus(){
let n=!1;try{this._active(),n=!0}catch{}return{connected:n,peerCount:n?this._peers().length:0,eventCount:this.cache.size,
cacheBytes:this.cacheBytes,sending:this.sends,refreshing:!!this.refreshing,error:this.lastError,delivery:this.lastDelivery}}_status(n={}){
Po(this.onStatus,{...this.getStatus(),...n})}async start(){if(this.closed)throw de("Global chat is closed","ERR_GLOBAL_C\
HAT_CLOSED");if(this.starting)return this.starting;if(this.boundNode=this.node,!this.boundNode?.handle||!this.peerId)throw de(
"Inference network is not connected","ERR_GLOBAL_CHAT_UNREACHABLE");if(kn.has(this.node))throw de("This inference networ\
k already owns global chat","ERR_GLOBAL_CHAT_OWNER");return this.scope=Object.freeze($o(this.manager.config)),kn.set(this.
node,this),this.starting=(async()=>{this.registered=!0;try{return await this.node.handle(Rn,(n,a)=>{const o=a?.remotePeer?.
toString?.();if(this.closed||!Zn(a)||!this._known(o)||[...this.inbound.values()].reduce((i,l)=>i+l,0)>=Ge.maximumInbound||
(this.inbound.get(o)??0)>=Ge.perPeerInbound){jt(n,de("Encrypted inference peer required or global chat is busy","ERR_GLO\
BAL_CHAT_AUTH"));return}this.inbound.set(o,(this.inbound.get(o)??0)+1),this._track(this._handle(n,a).finally(()=>{const i=this.
inbound.get(o)-1;i?this.inbound.set(o,i):this.inbound.delete(o)}))},{maxInboundStreams:Ge.perPeerInbound,maxOutboundStreams:Ge.
maximumSends+1,runOnLimitedConnection:!0}),this.closed||(this.started=!0),this._status(),this}catch(n){try{await this.node.
unhandle(Rn),this.registered=!1,kn.delete(this.node)}catch(a){throw new AggregateError([n,a],"Global chat startup and cl\
eanup failed")}throw n}})(),this.starting}async _open(n,a){const o=()=>this.node.getConnections().filter(l=>Zn(l)&&l.remotePeer.
toString()===n).sort((l,s)=>+(s.encryption==="native")-+(l.encryption==="native"));!o().length&&this._known(n)&&this.manager.
_maybeDialPeer&&await Za({node:this.node,peerId:n,signal:a,timeoutMs:Math.min(this.requestTimeoutMs,Ge.connectMs),dial:()=>this.
manager._maybeDialPeer(n,"global-inference-chat"),assertAllowed:()=>{if(this._active(),!this._known(n))throw de("Peer le\
ft the inference network","ERR_GLOBAL_CHAT_SCOPE")}});let i;for(const l of o().slice(0,4)){a.throwIfAborted();const s=dn(
[a],Math.min(this.requestTimeoutMs,1500));let f;try{f=Promise.resolve(l.newStream(Rn,{signal:s.signal,runOnLimitedConnection:!0}));
const d=await De(f,s.signal);return s.signal.throwIfAborted(),{stream:d,connection:l}}catch(d){i=d,f?.then(b=>jt(b,d),()=>{}),
a.throwIfAborted()}finally{s.dispose()}}throw de(`Unable to reach global chat peer${i?`: ${fn(i)}`:""}`,"ERR_GLOBAL_CHAT\
_UNREACHABLE")}_accept(n,a,o){const i=`${n}:${a.id}`,l=To(a),s=this.now();for(const[x,T]of this.seen)s-T.at>=Ge.replayMs&&
this.seen.delete(x);const f=this.seen.get(i);if(f){if(f.digest!==l)throw de("Conflicting duplicate global event");return this.
cache.get(i)?.event??null}if(this.seen.size>=Ge.replayEntries)throw de("Global chat replay window is full","ERR_GLOBAL_C\
HAT_BUSY");const{image:d,audio:b,...g}=a,y=Object.freeze({...g,...o,peerId:n,local:n===this.peerId,receivedAt:Date.now()}),
h=er(a);if(h>Ge.peerCacheBytes)throw de("Global event exceeds retained media allowance");const S=()=>[...this.cache.values()].
filter(x=>x.event.peerId===n).reduce((x,T)=>x+T.size,0),k=x=>{this.cacheBytes-=x[1].size,this.cache.delete(x[0])};for(;S()+
h>Ge.peerCacheBytes;)k([...this.cache].find(([,x])=>x.event.peerId===n));for(;this.cache.size>=Ge.cacheEvents||this.cacheBytes+
h>Ge.cacheBytes;)k([...this.cache].find(([,x])=>x.event.peerId!==this.peerId)??this.cache.entries().next().value);return this.
cache.set(i,{event:y,wire:a,digest:l,size:h}),this.cacheBytes+=h,this.seen.set(i,{digest:l,at:s}),Po(this.onEvent,Bo(y)),
this._status(),y}_credits(n,a,o){return{expect(i){const l=De(n.read(o),o).then(s=>{if(ct(s,["type","requestId","offset"]),
s.type!=="result-credit"||s.requestId!==a||s.offset!==i)throw de("Invalid global media credit")});return l.catch(()=>{}),
l}}}async _writeEvent(n,a,o,i,l){await De(n.write(this._envelope("event",a,{session:o,event:i.wire}),l),l);const s=i.wire.
id,f=this._credits(n,s,l);i.wire.image&&await De(ra(n,{image:i.event.image,metadata:i.wire.image,requestId:s,controls:f,
signal:l}),l),i.wire.audio&&await De(ta(n,{samples:i.event.audio.samples,metadata:i.wire.audio,requestId:s,controls:f,signal:l}),
l)}async _readEvent(n,a,o,i,l){if(this._check(i,a),ct(i,[...rn,"session","event"]),i.type!=="event"||i.session!==o)throw de(
"Global event session changed");const s=Ro(i.event),f={};if(s.image){const d=await De(n.read(l),l);if(ct(d,["type","requ\
estId","image"]),d.type!=="result-image"||d.requestId!==s.id||JSON.stringify(d.image)!==JSON.stringify(s.image))throw de(
"Global image descriptor mismatch");const b=await De(ia(n,{image:s.image,requestId:s.id,signal:l}),l);f.image={width:b.width,
height:b.height,channels:4,data:b.data}}if(s.audio){const d=await De(n.read(l),l);if(ct(d,["type","requestId","audio"]),
d.type!=="result-audio"||d.requestId!==s.id||JSON.stringify(d.audio)!==JSON.stringify(s.audio))throw de("Global audio de\
scriptor mismatch");const b=await De(na(n,{audio:s.audio,requestId:s.id,signal:l}),l);f.audio={samples:b.audio,sampleRate:b.
sampleRate}}return l.throwIfAborted(),this._check(i,a),{wire:s,media:f}}async _ack(n,a,o,i,l){await De(n.write(this._envelope(
"ack",a,{session:o,id:i}),l),l)}async _readAck(n,a,o,i,l){const s=await De(n.read(l),l);if(this._check(s,a),s.type==="er\
ror")throw Object.assign(de(fn(s.message)),{rejected:!0});if(ct(s,[...rn,"session","id"]),s.type!=="ack"||s.session!==o||
s.id!==i)throw de("Invalid global chat acknowledgement")}async _connect(n,a,o){if(this._active(),!this._known(n))throw de(
"Peer left inference network");const{stream:i,connection:l}=await this._open(n,o),s=this.manager.retainPeerInferenceConnection?.(
l,{timeoutMs:this.requestTimeoutMs+500});try{const f=go(i);await De(f.write(this._envelope("hello",n,{operation:a}),o),o);
const d=await De(f.read(o),o);if(this._check(d,n),d.type==="error")throw de(fn(d.message));if(ct(d,[...rn,"session"]),d.
type!=="ready")throw de("Invalid global chat handshake");return On(d.session),{stream:i,io:f,release:s,session:d.session}}catch(f){
throw jt(i,f),s?.(),f}}async _deliver(n,a,o){const i=dn([this.controller.signal,o],this.requestTimeoutMs);let l,s=!1,f=!1;
const d=()=>jt(l?.stream,mn(i.signal));i.signal.addEventListener("abort",d,{once:!0});try{return l=await this._connect(n,
"publish",i.signal),s=!0,await this._writeEvent(l.io,n,l.session,a,i.signal),await this._readAck(l.io,n,l.session,a.wire.
id,i.signal),f=!0,await Tn(l.stream),{peerId:n,status:"acknowledged"}}catch(b){return jt(l?.stream,b),{peerId:n,status:f?
"acknowledged":s&&!b.rejected?"unconfirmed":"failed",...f?{}:{error:fn(b)}}}finally{i.signal.removeEventListener("abort",
d),i.dispose(),l?.release?.()}}publish(n,{signal:a}={}){if(this._active(),a?.throwIfAborted(),this.sends>=Ge.maximumSends)
throw de("Global chat is still sending","ERR_GLOBAL_CHAT_BUSY");const o=jo(n),i=Ro({id:crypto.randomUUID(),...o.wire});this.
_rate("local");const l=this._accept(this.peerId,i,{...o.input.image?{image:o.input.image}:{},...o.input.audio?{audio:o.input.
audio}:{}}),s={event:l,wire:i},f=this._peerBatch("publish"),d=f.map(g=>({peerId:g,status:"pending"}));this.sends++,this.
_status({delivery:_o(l.id,d,{sending:!0})});const b=async()=>{const g=dn([this.controller.signal,a],Ge.sendMs);let y=0;try{
await Promise.all(Array.from({length:Math.min(Ge.fanout,f.length)},async()=>{for(;;){const S=y++;if(S>=f.length)return;d[S]=
g.signal.aborted?{peerId:f[S],status:"failed",error:"Global sharing cancelled"}:await this._deliver(f[S],s,g.signal)}}));
const h=_o(l.id,d,{cancelled:g.signal.aborted});return this.lastDelivery=h,this.lastError=d.find(S=>S.error)?.error??null,
{event:Bo(l),delivery:h}}finally{g.dispose(),this.sends--,this._status()}};return this._track(b())}_ownHistory(){return[
...this.cache.values()].filter(n=>n.event.peerId===this.peerId).slice(-Ge.historyEvents)}async _sendHistory(n,a,o,i){const l=this.
_ownHistory().map(({wire:f,digest:d})=>({id:f.id,digest:d}));await De(n.write(this._envelope("inventory",a,{session:o,events:l}),
i),i);const s=await De(n.read(i),i);if(this._check(s,a),ct(s,[...rn,"session","ids"]),s.type!=="select"||s.session!==o||
!Array.isArray(s.ids)||s.ids.length>Ge.historyEvents||new Set(s.ids).size!==s.ids.length||s.ids.some(f=>!l.some(d=>d.id===
f)))throw de("Invalid global history selection");for(const f of s.ids){this._active(),i.throwIfAborted();const d=this.cache.
get(`${this.peerId}:${f}`);if(!d){await De(n.write(this._envelope("missing",a,{session:o,id:f}),i),i);continue}await this.
_writeEvent(n,a,o,d,i),await this._readAck(n,a,o,f,i)}await De(n.write(this._envelope("done",a,{session:o}),i),i)}async _fetchHistory(n,a){
const o=dn([this.controller.signal,a],this.requestTimeoutMs);let i;const l=()=>jt(i?.stream,mn(o.signal));o.signal.addEventListener(
"abort",l,{once:!0});try{i=await this._connect(n,"history",o.signal);const{io:s,session:f}=i,d=await De(s.read(o.signal),
o.signal);if(this._check(d,n),ct(d,[...rn,"session","events"]),d.type!=="inventory"||d.session!==f||!Array.isArray(d.events)||
d.events.length>Ge.historyEvents)throw de("Invalid global history inventory");const b=new Map,g=new Set;for(const h of d.
events){if(ct(h,["id","digest"]),On(h.id),!/^[a-f0-9]{64}$/.test(h.digest??"")||g.has(h.id))throw de("Invalid global his\
tory fingerprint");g.add(h.id);const S=this.seen.get(`${n}:${h.id}`);if(S&&S.digest!==h.digest)throw de("Conflicting glo\
bal history event");S||b.set(h.id,h.digest)}await De(s.write(this._envelope("select",n,{session:f,ids:[...b.keys()]}),o.
signal),o.signal);for(const[h,S]of b){const k=await De(s.read(o.signal),o.signal);if(this._check(k,n),k.type==="missing"){
if(ct(k,[...rn,"session","id"]),k.session!==f||k.id!==h)throw de("Invalid missing global history event");continue}const x=await this.
_readEvent(s,n,f,k,o.signal);if(x.wire.id!==h||To(x.wire)!==S)throw de("Global history content changed");this._accept(n,
x.wire,x.media),await this._ack(s,n,f,h,o.signal)}const y=await De(s.read(o.signal),o.signal);if(this._check(y,n),ct(y,[
...rn,"session"]),y.type!=="done"||y.session!==f)throw de("Invalid global history completion");return await Tn(i.stream),
{peerId:n,status:"acknowledged"}}catch(s){return jt(i?.stream,s),{peerId:n,status:"failed",error:fn(s)}}finally{o.signal.
removeEventListener("abort",l),o.dispose(),i?.release?.()}}refresh({signal:n}={}){if(this._active(),n?.throwIfAborted(),
this.refreshing)return this.refreshing;const a=async()=>{const o=dn([this.controller.signal,n],Ge.sendMs),i=this._peerBatch(
"history"),l=[];let s=0;try{await Promise.all(Array.from({length:Math.min(Ge.fanout,i.length)},async()=>{for(;;){const f=s++;
if(f>=i.length||o.signal.aborted)return;l.push(await this._fetchHistory(i[f],o.signal))}})),this.lastError=l.find(f=>f.error)?.
error??null}finally{o.dispose(),this.refreshing=null,this._status()}return this.getStatus()};return this.refreshing=this.
_track(Promise.resolve().then(a)),this.refreshing}async _handle(n,a){const o=a.remotePeer.toString(),i=dn([this.controller.
signal],this.requestTimeoutMs),l=go(n);let s,f=!1;const d=()=>jt(n,mn(i.signal));i.signal.addEventListener("abort",d,{once:!0});
try{s=this.manager.retainPeerInferenceConnection?.(a,{timeoutMs:this.requestTimeoutMs+500});const b=await De(l.read(i.signal),
i.signal);if(this._check(b,o),ct(b,[...rn,"operation"]),b.type!=="hello"||!["publish","history"].includes(b.operation))throw de(
"Global chat handshake required");if(this._rate(o),await De(l.write(this._envelope("ready",o,{session:this.session}),i.signal),
i.signal),b.operation==="history")await this._sendHistory(l,o,this.session,i.signal);else{const g=await De(l.read(i.signal),
i.signal),y=await this._readEvent(l,o,this.session,g,i.signal);this._accept(o,y.wire,y.media),f=!0,await this._ack(l,o,this.
session,y.wire.id,i.signal)}await Tn(n)}catch(b){if(!i.signal.aborted&&!f)try{await De(l.write(this._envelope("error",o,
{message:fn(b)}),i.signal),i.signal),await Tn(n)}catch(g){jt(n,g)}else jt(n,b)}finally{i.signal.removeEventListener("abo\
rt",d),i.dispose(),s?.()}}close(){return this.closing?this.closing:(this.closed=!0,this.controller.abort(new DOMException(
"Global chat closed","AbortError")),this.closing=(async()=>{await this.starting?.catch(()=>{}),this.registered&&(await this.
boundNode.unhandle(Rn),this.registered=!1),await Promise.allSettled([...this.operations]),kn.get(this.boundNode)===this&&
kn.delete(this.boundNode),this.started=!1,this.cache.clear(),this.cacheBytes=0,this.seen.clear(),this.rates.clear(),this.
_status()})().catch(n=>{throw this.closing=null,n}),this.closing)}}const or=24*1024*1024,ar=60,rr=new TextEncoder;function Jn(t,n){
let a="",o=0;for(const i of String(t??"").replace(/\0/g,"").toWellFormed()){const l=rr.encode(i).byteLength;if(o+l>n)break;
a+=i,o+=l}return a}function ir({getNetworkManager:t,onEvent:n,onStatus:a,serviceFactory:o=i=>new nr(i)}){const i=`local-${crypto.
randomUUID()}`,l=new AbortController;let s,f,d,b,g,y,h=!1,S=0,k=0;const x=[];function T(){if(h)return;const E=s?.getStatus();
a?.((E?.connected?"Global connected.":"Global offline.")+(x.length?` ${x.length} item(s) waiting to share.`:"")+(k?` ${k}\
 item(s) could not be shared with every peer.`:"")+" Recent messages are available while their authors stay online.")}function m(E){
if(!h)try{Promise.resolve(n?.(E)).catch(()=>{k++,T()})}catch{k++,T()}}function D(){if(h||!s||g)return g;const E=s;return g=
(async()=>{for(;!h&&s===E&&x.length;){const $=x[0];try{const U=await E.publish($.input,{signal:l.signal});["failed","par\
tial"].includes(U?.delivery?.status)&&k++}catch{h||k++}x.shift(),S-=$.bytes}})().finally(()=>{g=null,T()}),g}function e(E){
if(h)return;let $;try{$=jo({turnId:E.turnId,phase:E.phase,name:Jn(E.name||"Guest",80),text:Jn(E.text,64*1024),...E.modelName?
{modelName:Jn(E.modelName,256)}:{},...E.phase==="audio"?{part:E.part,audio:E.audio}:{},...E.image?{image:{width:E.image.
width,height:E.image.height,channels:E.image.channels,data:E.image.data}}:{}}).input}catch{k++,T();return}m({...$,peerId:i,
id:crypto.randomUUID(),local:!0});const U=new TextEncoder().encode($.text).byteLength+($.image?.data.byteLength||0)+($.audio?.
samples.byteLength||0)+1024;if(x.length>=ar||S+U>or){k++,T();return}x.push({input:$,bytes:U}),S+=U,T(),O()}function O(){
return h||b?b??Promise.resolve():(b=Q().catch(()=>{h||(k++,T())}).finally(()=>{b=null}),b)}async function Q(){if(h)return;
const E=t?.();if(!E){T();return}if(s&&(f!==E||!s.getStatus().connected)){const $=s;s=null,await $.close(),await g}if(!s&&
!d&&(f=E,d=(async()=>{let $;try{$=o({networkManager:f,onEvent:U=>{U.local||m(U)},onStatus:T}),await $.start(),h?await $.
close():s=$}catch{await $?.close().catch(()=>{})}})().finally(()=>{d=null})),await d,h||!s){T();return}D();try{await s.refresh(
{signal:l.signal})}catch{}T()}return T(),{publish:e,refresh:O,close(){return y||(h=!0,l.abort(),y=(async()=>{try{await d,
await s?.close()}finally{await b,await g,x.length=0,S=0}})().catch(E=>{throw y=null,E}),y)}}}const sr=async t=>(await No(
async()=>{const{createVoiceSession:n}=await import("./VoiceSession-CoeTb2Rg.js");return{createVoiceSession:n}},__vite__mapDeps([0,1,2]),
import.meta.url)).createVoiceSession(t),lr=async()=>(await No(async()=>{const{createWorldAudio:t}=await import("./WorldAudio-BU3XEm63.js");
return{createWorldAudio:t}},[],import.meta.url)).createWorldAudio();async function mr({container:t=document.
body,stateManager:n,computeManager:a,networkManager:o,getContext:i,actions:l,runtimeBaseUrl:s,onClose:f,onRequestClose:d,
autoConnect:b=!1,managementOnly:g=!1,enableGlobalChat:y=!1,runtimeFactory:h=Vo,globalChatFactory:S=ir,refreshIntervalMs:k=5e3,
pwaInstallController:x,voiceSessionFactory:T=sr,audioFactory:m=lr,navigate:D=e=>location.assign(e)}={}){const e=pa(t);if(g){
e.panel.setAttribute("aria-label","Model management"),e.panel.classList.add("pc-model-management");for(const c of[e.back,
e.agents,e.transcript,e.proposed,e.attachment,e.prompt,e.resumeAgent,e.send.parentElement,e.clearChat,e.clearChat.nextElementSibling])
c&&(c.style.display="none");const r=document.createElement("p");r.className="pc-inference-note",r.textContent="Manage mo\
dels for this world. Loaded models remain available to residents when you return to the world.",e.panel.append(r)}const O=Go(
e.panel),Q=document.createElement("div");Q.hidden=!0,e.panel.append(Q);const E=new TextEncoder,$=new Set;let U=new Map,H,
L,G,Y,p,C,q,X,K,te,ne=!1,qe=!1,_e=!1,Se,ie,Oe,Pe,Ne,pe,ge,le,ve,_=!1,W=!1,ee=[],ce=!0,at,mt=!1,tt=!1;const Le=new Set;let rt,
Ke=[],Ue=[],nt,ue,xe,dt,it,Nt,xt=0,Et,$t,zt,nn,be,ke,Ye,gt,bt,je,Fe,yt=[],Xe="mixed",Je,wt,vt,Ze,kt=!1,Wt=0,ft,It,Ot,Ct,
Rt={status:"idle",active:!1,recording:!1};const B=()=>!qe&&!_e,Dt=r=>["checking","unavailable"].includes(r?.localAvailability?.
status),pn=r=>String(r?.localAvailability?.reason||(r?.localAvailability?.status==="checking"?"Checking this device…":
"Unavailable on this device.")).slice(0,512),Tt=()=>e.generateImage.checked?"text-to-image":K?"image-text-to-text":"text\
-generation",Vt=()=>!!(p?.getDiscoveryStatus?.()?.connected??p?.networkReady),Kt=r=>r?.available===!0&&(r.automatic||r.local||
Vt()),Qe=r=>typeof r=="string"&&r.startsWith("agent:")?r.slice(6):null,Ut=r=>r?r.activity?.unsaved?"Agent changes are no\
t saved. Resume to retry saving before another message.":r.recoveryRequired?"This agent has an interrupted task. Resume \
to acknowledge it; it will not replay.":["queued","running","cancelling"].includes(r.activity?.status)?"This agent is bu\
sy.":r.status==="paused"?"This agent is paused. Resume it to chat.":"":"This agent is unavailable.",st=(r,c)=>Kt(r)&&(r.
agentId?Ue.some(w=>(r.local||r.inferenceMode==="local-only"?w.local:!0)&&Kt(w)&&Cn(w,c)):Cn(r,c)),he=(r=Tt())=>{const c=e.
target.value||"mixed",w=Qe(c);if(w){const v=yt.find(ae=>ae.agentId===w),A=Ut(v),F=v?.policy?.inferenceMode!=="network-as\
sisted";return{key:c,agentId:w,head:v,name:v?.identity?.name??"Unavailable agent",reason:A,available:!A,automatic:!0,local:F,
inferenceMode:F?"local-only":"network-assisted",modalities:["text","image"],outputModalities:r==="text-to-image"?["image"]:
["text"]}}return["mixed","local-only"].includes(c)?{key:c,automatic:!0,task:r,name:c==="mixed"?"Mixed":"Local only",local:c===
"local-only",available:Ue.some(v=>(c==="mixed"||v.local)&&st(v,r)),modalities:r==="image-text-to-text"?["text","image"]:
r==="audio-text-to-text"?["text","audio"]:["text"],outputModalities:r==="text-to-image"?["image"]:["text"]}:Ue.find(v=>v.
key===c)},Yt=(r,c,w=[])=>st(r,c)?(r.automatic?Ue:[r]).some(v=>(!r.local||v.local)&&st(v,c)&&w.every(A=>v.modalities?.includes(
A))&&zn(v,c,w)):!1,lt=()=>{l?.invalidate?.(),e.proposed.replaceChildren()};function fe(r,{quiet:c=!1}={}){return e.status.
textContent=r,e.status.classList.toggle("pc-status-quiet",c),g&&ue?.setFeedback(r),r}const Ee=r=>{if(!B())return;const c=(r.
name==="AbortError"?"Cancelled: ":"Error: ")+r.message+(/context budget/i.test(r.message)?". Use Config → Clear conversa\
tion to start again, or shorten the prompt.":"");fe(c),e.chatOptions.open&&(e.chatOptionsStatus.textContent=c,e.chatOptionsStatus.
hidden=!1),(e.configuration.open||xe?.isShowing(e.configuration))&&(e.configurationStatus.textContent=c),ue?.isStoredOpen()&&
(e.storedStatus.textContent=c)},At=()=>{if(H?.active==="global"){e.transcript.scrollTop=e.transcript.scrollHeight;return}
for(;e.transcript.children.length>24||E.encode(e.transcript.textContent).byteLength>128*1024;)e.transcript.firstElementChild?.
remove();O.prune(),e.transcript.scrollTop=e.transcript.scrollHeight};function V(){H?.setBusy(!!C||ne||mt||kt||!!bt);const r=he();
e.prompt.placeholder=e.generateImage.checked?"Describe an image…":"Message…",e.browse.disabled=ce||!!C,e.modelsMenu.
disabled=ce||!!be,e.chatConfigure.disabled=ce||!!C,ue?.setBusy(_e||ce||!!C),e.agents.disabled=!!C||!!bt||!p?.getAgentController,
e.cpuBudget.disabled=e.gpuBudget.disabled=!!C||!p?.setMemoryBudgets;const c=e.generateImage.checked&&!!K;e.send.disabled=
!!C||kt||ne||mt||c||!Yt(r,Tt())||!e.prompt.value.trim()&&!K,e.cancel.hidden=!C||!!be,e.target.disabled=!!C,e.attach.disabled=
!!C||e.generateImage.checked||!st(he("image-text-to-text"),"image-text-to-text"),e.attach.title=e.generateImage.checked?
"Generate image uses a text prompt. Uncheck it to attach an image.":st(he("image-text-to-text"),"image-text-to-text")?"A\
ttach an image for a vision model":"Choose Mixed or a loaded local or peer vision model to attach an image.";const w=st(
he("text-to-image"),"text-to-image");e.generateImage.disabled=!!C||!w,e.generateImage.parentElement.title=w?"Generate im\
age":"No image-generation model is available for this chat target. Load one or choose a compatible peer.",e.imageUnavailable.
hidden=!e.generateImage.checked||w||!!C,e.useTextChat.disabled=!!C,e.speakReplies.disabled=e.beConcise.disabled=!!C;const v=Rt.
recording||Rt.status==="requesting-microphone";e.talk.textContent=Rt.recording?"Release":"Talk",e.talk.setAttribute("ari\
a-label","Talk"),e.talk.setAttribute("aria-pressed",String(v)),e.talk.disabled=!!be||!!C&&(!Ct||Ct.released)||kt||ne||mt||
c||!!r?.agentId&&!r.available,e.resumeAgent.hidden=!r?.agentId||!r.reason||/busy|unavailable/i.test(r.reason),e.resumeAgent.
disabled=!!C||kt,e.modeStatus.textContent=c?"Generate image uses a text prompt. Remove the attached image or uncheck Gen\
erate image.":r?.agentId?`${r.name} · ${r.local?"Local only, including voice.":"Mixed: local first, then peers, includi\
ng voice."} Identity and conversation are saved on this device.${r.reason?" "+r.reason:""}`:r?.key==="mixed"?"Mixed uses\
 a compatible loaded local model first, then an online peer. Messages, images and voice may be sent to that peer.":r?.key===
"local-only"||r?.local?"Local execution only. Voice also uses compatible local speech models.":"This target runs on anot\
her peer. Messages and attachments go to that host; voice uses available local or peer speech models.",!c&&r&&!r.reason&&
!st(r,Tt())?e.modeStatus.textContent+=` No compatible ${e.generateImage.checked?"image-generation":K?"vision":"text"} mo\
del is available for this choice. Load one or choose another target.`:!c&&r&&!r.reason&&!Yt(r,Tt())&&(e.modeStatus.textContent+=
" Compatible models have no available queue capacity. You can keep drafting; sending resumes when capacity is available."),
e.empty.textContent=H?.active==="global"?"Global prompts and results are shared with everyone connected. Choose Personal\
 for a separate conversation.":r?.agentId&&r.reason?`${r.name}: ${r.reason}`:st(r,Tt())?e.generateImage.checked?"Describ\
e an image to get started. Use ⚙ for chat options.":"Ask a question to get started. Use ⚙ for chat options.":"Open M\
odels to load one, or use ⚙ to choose a peer model.",e.unload.disabled=!!C,e.clearChat.disabled=!!C||!!r?.agentId,e.clearChat.
title=r?.agentId?"Agent history and memory are persistent. Manage this agent through Agents.":"",(e.configuration.open||
xe?.isShowing(e.configuration))&&oe(),e.storedRefresh.disabled=!!C||!!le;for(const ae of e.storedList.querySelectorAll("\
button,input"))ae.disabled=!!C||!!le||ae.dataset.inactive==="true";const A=ee.filter(ae=>Le.has(ae.manifestCid)),F=p?.loadStoredModel?
A.filter(yo).length:0;e.storedLoadSelected.disabled=!!C||!!le||!F,e.storedDeleteSelected.disabled=!!C||!!le||!p?.deleteStoredModel||
!A.length,e.storedAddLora.disabled=!!C||!!le||!p?.createLoraModel||A.length!==1||A[0].runtime!=="llama.cpp"||A[0].needsVerification,
e.storedSelection.textContent=`${A.length} model${A.length===1?"":"s"} selected.`+(A.length!==F?` ${F} ready to load.`:""),
e.storedCancel.hidden=!C||!(_||W)||!!be,e.storedCancel.disabled=!!C?.signal.aborted}function et(){nt||(nt=p.getPreferredModelSourceKey?.()??
Ke.find(r=>r.modelId==="smolvlm-256m-q4"&&r.source==="hf")?.key??Ke.find(r=>!Dt(r))?.key??Ke[0]?.key),ue?.refresh(),V()}
function St(){Nt&&(xt++,fa(e,ba(Nt,{environment:{browser:e.helpBrowser.value,os:e.helpOs.value}})))}function on(r){if(!B()||
C)return;if(r.needsVerification||r.localAvailability?.code==="model_verification_required"){Dn({tab:"stored"});return}Nt=
{...r,localAvailability:r.localAvailability??p.getModelCompatibility?.(r.package??r)};const c=Oo();if(e.helpBrowser.value=
c.browser,e.helpOs.value=c.os,St(),xe){xe.show(e.compatibility);return}e.networkInfo.close(),e.chatOptions.close(),e.menuWindow.
close(),e.configuration.close(),ue?.close(),e.about.close(),e.compatibility.open||e.compatibility.showModal()}function ht(){
const r=Xe||"mixed",c=Ue.find(v=>v.key===r),w=e.target.value===r?e.target.selectedOptions[0]?.textContent:c?.name??r;Ke=
p.listModelSources(),dt&&!Ke.some(v=>v.key===dt.key)&&Ke.push(dt),Ue=p.listInferenceTargets(),et(),e.target.replaceChildren();
for(const[v,A]of[["mixed","Mixed · local first, then peers"],["local-only","Local only · automatic"]]){const F=document.
createElement("option");F.value=v,F.textContent=A,e.target.append(F)}for(const v of H?.active==="global"?[]:yt){const A=document.
createElement("option");A.value=`agent:${v.agentId}`,A.textContent=`Agent · ${String(v.identity?.name??"Unnamed agent").
slice(0,120)}`+(Ut(v)?` (${v.activity?.status||v.status||"unavailable"})`:""),e.target.append(A)}for(const v of Ue.filter(
A=>!["automatic-speech-recognition","text-to-speech","image-to-3d"].includes(A.task))){const A=document.createElement("o\
ption");A.value=v.key,A.textContent=(v.local?"Local · ":"Peers · ")+String(v.name).slice(0,140)+(v.task==="text-to-ima\
ge"?" · Image generation":"")+(v.busy?" (busy)":v.available?"":" (unavailable)"),e.target.append(A)}if(!Ue.some(v=>v.key===
r)&&!yt.some(v=>`agent:${v.agentId}`===r)&&!["mixed","local-only"].includes(r)&&w){const v=document.createElement("optio\
n");v.value=r,v.disabled=!0,v.textContent=(c?.name??w.replace(/ \(unavailable\)$/,""))+" (unavailable)",e.target.append(
v)}e.target.value=r,e.target.value||(e.target.value="mixed"),V()}function gn(){if(!B()||!je)return;const r=Qe(Xe),c=yt.find(
v=>v.agentId===r);yt=je.list(),ht();const w=yt.find(v=>v.agentId===r);r&&H?.active!=="global"&&!C&&!kt&&c?.revision!==w?.
revision&&M(Xe)}async function u(){return!je&&!Fe&&(Fe=(async()=>{const r=await p.getAgentController();if(!B())throw new DOMException(
"Console closed","AbortError");return je=Da({controller:r,onChange:gn}),await je.refresh(),yt=je.list(),ht(),je})().finally(
()=>{Fe=null})),je??await Fe}async function M(r){vt?.abort();const c=new AbortController;vt=c;const w=++Wt,v=Qe(r);if(!v)
return;kt=!0,V();const A=()=>B()&&H?.active!=="global"&&!c.signal.aborted&&w===Wt&&Xe===r;Ze=(async()=>{try{const F=await u(),
[ae,ye]=await Promise.all([F.get(v,{signal:c.signal}),F.history(v,{signal:c.signal})]);if(!A())return;if(!ae)throw new Error(
"This saved agent no longer exists. Choose another chat or create an agent.");const me=yt.findIndex(re=>re.agentId===v);
me>=0&&(yt[me]=ae),e.transcript.replaceChildren(e.empty),O.prune();const se=new Set(ye.filter(re=>re.type==="request").map(
re=>re.operationId)),we=ye.filter(re=>["request","result"].includes(re.type)||["failed","cancelled","outcome-unknown"].includes(
re.type)&&se.has(re.operationId)).slice(-24),Te=new Set,pt=new Set(we.filter(re=>re.inputAttachmentId||re.imageAttachmentId).
slice(-6));for(const re of we){if(!A())return;const Jt=`${re.type}:${re.operationId??re.sequence}`;if(Te.has(Jt))continue;
Te.add(Jt);const Zt=Wn(e,re.type==="request"?"user":"assistant",re.text||"",{targetName:`Agent · ${ae.identity.name}${re.
route?" · "+qn(re.route):""}`});Zt.parentElement.dataset.operationId=re.operationId??"";const sn=re.inputAttachmentId||
re.imageAttachmentId;if(sn)try{if(!pt.has(re))throw new Error("Older preview omitted");const Mn=await F.attachment(v,sn,
{signal:c.signal});if(!A())return;const Mt=await O.append(Zt,Mn,{signal:c.signal,prompt:re.text});re.type==="request"&&(Mt.
className="pc-chat-image",Mt.alt="Saved attached image")}catch{if(!A())return;const Mt=document.createElement("p");Mt.className=
"pc-inference-note",Mt.textContent="Saved image preview is unavailable.",Zt.after(Mt)}}At()}catch(F){A()&&(e.transcript.
replaceChildren(e.empty),O.prune(),Ee(F))}finally{w===Wt&&(kt=!1,vt=null,B()&&V())}})(),await Ze}async function P(r){if(!B()||
C)return;Qe(r)&&H?.active==="global"&&H.select("personal");const c=Xe,w=!!Qe(c),v=!!Qe(r);if(c===r){v&&await M(r),V();return}
vt?.abort(),Wt++,kt=!1,Xe=r,e.target.value=r,(w||v)&&(at?.cancel(),te?.abort(),Gn(),e.prompt.value=""),lt(),v?(w||Q.append(
...e.transcript.childNodes),e.transcript.replaceChildren(e.empty),O.prune(),await M(r)):w&&(e.transcript.replaceChildren(
...Q.childNodes),e.transcript.children.length||e.transcript.append(e.empty),O.prune(),At()),V()}function R(r){if(!p)return;
const c=p.getDiscoveryStatus?.(),w=c?.connected??p.networkReady;w&&(pe=null);const v=r?.message??pe?.message??c?.errors?.[0]?.
message;e.networkStatus.textContent=e.networkInfo.update({connected:w,connecting:!!Pe&&!Pe.signal.aborted,peerCount:c?.peerCount,
sharedModelCount:c?.sharedModelCount??Ke.filter(A=>A.source==="peers").length,hostedModelCount:c?.hostedModelCount??Ue.filter(
A=>!A.local&&A.available).length,inferenceModels:w?p.listInferenceTargets().filter(A=>!A.local&&A.available):[],issue:v,
artifacts:p.getArtifactNetworkStatus?.()})}function N(){const r=p.getMemoryBudgets?.()??{};e.cpuBudget.value=r.cpuBytes==
null?"":String(r.cpuBytes/1024**3),e.gpuBudget.value=r.gpuBytes==null?"":String(r.gpuBytes/1024**3);const c=p.getDeviceCapabilities?.()?.
deviceMemoryGiB;e.memoryNote.textContent=(Number.isFinite(c)&&c>0?`Browser-reported RAM: approximately ${c} GiB. `:"")+"\
Optional combined limits for all loaded models, using conservative estimates. Auto sets no application byte cap; an embe\
dding app’s limits still apply. Your browser cannot report free GPU memory. Actual allocations may fail. Lowering a limi\
t keeps loaded models and restricts future loads.",oe()}function oe(){const r=p?.getMemoryBudgetStatus?.();if(e.memoryPressure.
hidden=!r,r){const c=(w,v)=>{const A=r[w];return`${v}: ${en(A.reservedBytes)} estimated reserved; ${A.budgetBytes===null?
"no application cap":`${en(A.budgetBytes)} combined budget`}${A.overBudget?" (over budget; unload a model or raise the l\
imit before adding another)":""}.`};e.memoryPressure.textContent=c("cpu","RAM")+" "+c("gpu","GPU")+(r.owned?"":" The emb\
edding app owns the shared resource pool; its limits cannot be raised here.")+" These totals are estimates, not measured\
 RAM or VRAM use."}}function Ie(){if(!(!B()||C||!p.setMemoryBudgets))try{const r=[e.cpuBudget,e.gpuBudget].map(c=>{c.setCustomValidity(
""),c.removeAttribute("aria-invalid");const w=c.value.trim(),v=w?Math.round(Number(w)*1024**3):null;if(c.validity.badInput||
w&&(!Number.isFinite(Number(w))||Number(w)<=0||Number(w)>1024||!Number.isSafeInteger(v)||v<1)){const A="Enter a memory b\
udget above 0 and at most 1024 GiB, or leave it blank.";throw c.setCustomValidity(A),c.setAttribute("aria-invalid","true"),
new Error(A)}return v});p.setMemoryBudgets({cpuBytes:r[0],gpuBytes:r[1]}),N(),Ke=p.listModelSources(),et(),e.configurationStatus.
textContent="Combined memory budgets updated for future loads."}catch(r){Ee(r)}}async function J(){if(!B()||ie)return ie;
G?.refresh();const r=new AbortController;return Oe=r,ie=(async()=>{try{await p.refreshPeers({signal:r.signal}),B()&&(CSS.
supports("selector(:open)")&&e.target.matches(":open")?(Ue=p.listInferenceTargets(),V()):ht(),R())}catch(c){B()&&!r.signal.
aborted&&(Ue=p.listInferenceTargets(),V(),R(c))}finally{ie=null,Oe=null}})(),ie}const $e=r=>{if(!B())return;let c;if(r.stage===
"import"){if(c=(r.reused?"Using saved file ":"Downloading ")+(r.index+1)+"/"+r.total+": "+r.path,Number.isSafeInteger(r.
loaded)&&Number.isSafeInteger(r.totalBytes)&&r.loaded>=0&&r.totalBytes>0&&(c+=` · ${en(r.loaded)} / ${en(r.totalBytes)}`),
r.retryAttempt&&(c+=` · Connection interrupted; retry ${r.retryAttempt}/${r.maxRetries} in ${Math.ceil(r.retryDelayMs/1e3)}\
s`),r.preparation){const{stage:v,sourceLoaded:A,sourceTotalBytes:F}=r.preparation;c=`${v==="projector-download"?"Fetchin\
g":"Preparing"} Gemma image/audio companion`,Number.isSafeInteger(A)&&Number.isSafeInteger(F)&&F>0&&(c+=` · ${en(A)} / ${en(
F)}`)}}else r.type==="model-load"?c="Loading model: "+(r.stage||r.status||"initializing GPU")+(r.file?" · "+r.file:""):
c={prepare:"Preparing model…",verify:"Verifying stored model files…","download-peers":"Fetching and verifying model \
files from peers…",unload:"Releasing the previous model…",load:"Loading model into RAM and GPU memory…"}[r.stage];
if(r.stage==="verify"&&Number.isSafeInteger(r.loaded)&&Number.isSafeInteger(r.totalBytes)&&r.totalBytes>0&&(c+=` · ${en(
r.loaded)} / ${en(r.totalBytes)}`),!c)return;const w=`${r.type??""}:${r.stage??r.status??""}:${r.path??r.file??""}`;w!==
zt&&(zt=w,nn=performance.now()),$t=String(c).slice(0,512),fe($t),be&&!be.controller.signal.aborted&&(e.loadingStatus.textContent=
$t),_&&ue?.isStoredOpen()&&(e.storedStatus.textContent=$t),Et||(Et=setInterval(()=>{B()&&C&&!C.signal.aborted&&(fe(`${$t}\
 (${Math.floor((performance.now()-nn)/1e3)}s)`),be&&(e.loadingStatus.textContent=e.status.textContent),_&&ue?.isStoredOpen()&&
(e.storedStatus.textContent=e.status.textContent))},1e3))};function ze(){!be||be.controller.signal.aborted||be.controller.
abort(new DOMException("Model load cancelled","AbortError"))}async function ut(){if(C&&(C.abort(new DOMException("Models\
 window closed","AbortError")),await q),ke)throw new Error("Model cleanup is incomplete. Retry Unload in Stored models o\
r Config before closing.",{cause:ke});return d?d():Hn()}function We(){const r=p.getResidentModelStates?.()??p.listResidentModels?.();
(!r||!r.some(c=>!["ready","idle","closed"].includes(c.status)))&&(ke=null)}function Xt(r,c){e.networkInfo.close(),e.chatOptions.
close();const w={controller:r,focus:document.activeElement,previousDialog:[...e.panel.querySelectorAll("dialog[open]")].
at(-1)};be=w,e.loadingModel.textContent=String(c).slice(0,256),e.loadingStatus.textContent="Preparing model…",e.loadingCancel.
disabled=!1,w.onAbort=()=>{e.loadingCancel.disabled=!0,e.loadingStatus.textContent="Cancelling load… Waiting for cleanup\
.",B()&&(xe?ue.element:e.loading).focus()},r.signal.addEventListener("abort",w.onAbort,{once:!0}),V(),xe?xe.show(e.loading,
{closeWindow:!0}):e.loading.showModal()}function z(r){const c=be;if(!c||c.controller!==r||(r.signal.removeEventListener(
"abort",c.onAbort),be=null,e.loading.close(),!B()))return;if(xe){xe.showLibrary();return}(c.focus?.isConnected&&c.focus.
matches("button,input,select,textarea,a[href],[tabindex]")&&!c.focus.disabled&&c.focus.getClientRects().length?c.focus:c.
previousDialog?.open?c.previousDialog.querySelector("button:not(:disabled)"):e.browse.disabled?e.menu:e.browse)?.focus()}
async function Me(r,{modelName:c}={}){if(!B()||C)return;const w=new AbortController;C=w,V(),q=(async()=>{try{c!==void 0&&
Xt(w,c),await r(w.signal)}catch(v){g&&c!==void 0&&w.signal.aborted&&v instanceof AggregateError&&(ke=v),Ee(v)}finally{clearInterval(
Et),Et=null,zt=null,Je=null,wt=null;try{B()&&(await je?.refresh().catch(Ee),Qe(Xe)&&await M(Xe),ht(),At())}finally{C===w&&
(C=null),B()&&V(),z(w)}}})(),await q}function ot(r){if(!B()||!ue?.isStoredOpen()||!r||document.activeElement!==document.
body&&document.activeElement?.getClientRects().length)return;(r.isConnected&&!r.disabled&&r.getClientRects().length?r:e.
storedContent.querySelector("button:not(:disabled)"))?.focus()}async function Z({signal:r,preserveStatus:c=!1,quietCancellation:w=!1}={}){
if(!B())return!1;if(ge)return ve?.aborted?(await ge,!B()||r?.aborted?!1:Z({signal:r,preserveStatus:c,quietCancellation:w})):
ge;const v=new AbortController;le=v;const A=r?AbortSignal.any([v.signal,r]):v.signal;ve=A;const F=e.storedContent.contains(
document.activeElement)?document.activeElement:null;return c||(e.storedStatus.textContent="Reading stored models…"),V(),
ge=(async()=>{await Promise.resolve();try{A.throwIfAborted();const ae=await p.listStoredModels({signal:A});if(A.throwIfAborted(),
B()){ee=ae;const ye=new Set(ae.filter(Sn).map(me=>me.manifestCid));for(const me of Le)ye.has(me)||Le.delete(me);ha(e,ae,
{selected:Le,onRecover:p.recoverStoredModel?Gt:void 0,onUnload:Ve,onSelect:(me,se)=>{!B()||C||le||!Sn(me)||!ee.some(we=>we.
manifestCid===me.manifestCid)||(se?Le.add(me.manifestCid):Le.delete(me.manifestCid),V())}}),c||(e.storedStatus.textContent=
`${ae.length} model${ae.length===1?"":"s"} stored.`)}return!0}catch(ae){return w&&(r?.aborted||v.signal.aborted)||c||(Ee(
ae),B()&&(e.storedStatus.textContent="Error: "+ae.message)),!1}finally{ge=null,le=null,ve=null,B()&&(V(),ot(F))}})(),ge}
async function Re(r){if(!B()||C||le||!p.deleteStoredModel)return;const c=[...new Map(r.filter(Sn).map(v=>[v.manifestCid,
v])).values()];if(!c.length)return;const w=e.storedContent.contains(document.activeElement)?document.activeElement:null;
W=!0,e.storedCancel.textContent="Stop deleting";try{await Me(async v=>{let A=0,F=0,ae=0,ye;try{for(const Te of c){v.throwIfAborted(),
e.storedStatus.textContent=`Deleting ${A+1} / ${c.length}: ${Te.name}…`;const pt=await p.deleteStoredModel(Te.manifestCid,
{signal:v});A++,pt.deleted&&F++,Number.isSafeInteger(pt.freedBytes)&&pt.freedBytes>0&&(ae+=pt.freedBytes),Le.delete(Te.manifestCid),
pt.unloaded&&(U.delete(`local:${Te.manifestCid}`),lt())}}catch(Te){ye=Te}ge&&await ge;const me=await Z({preserveStatus:!0}),
se=ae>0?` Freed ${en(ae)}.`:"";if(ye){const Te=new Error(`Completed ${A} of ${c.length} deletions.${se} ${ye.message}`+(me?
"":" Use Refresh to check the stored library."),{cause:ye});throw Te.name=ye.name,Te}if(!me)throw new Error("Deletion fi\
nished, but the stored library could not be refreshed. Use Refresh to check its state.");const we=c.length===1?F?`Delete\
d ${c[0].name}.`:"This model is no longer stored.":`Deleted ${F} models.`+(F<A?` ${A-F} already absent.`:"");e.storedStatus.
textContent=we+se,fe(we,{quiet:!0})})}finally{W=!1,e.storedCancel.textContent="Stop loading",B()&&(V(),ot(w))}}async function Ve(r){
!B()||C||le||!r.loaded||await Me(async()=>{await p.unload(r.manifestCid),We(),U.delete(`local:${r.manifestCid}`),lt(),await Z(),
ht(),fe(e.storedStatus.textContent=`Unloaded ${r.name}. Its files remain stored.`,{quiet:!0})})}async function Gt(r){if(!(!B()||
C||le||!r.needsVerification)){_=!0,e.storedCancel.textContent="Cancel verification";try{await Me(async c=>{$e({stage:"ve\
rify"});try{await p.recoverStoredModel(r.manifestCid,{signal:c,onProgress:w=>{c.aborted||$e(w)}})}catch(w){throw await Z(),
w}c.throwIfAborted(),await Z(),ht(),fe(e.storedStatus.textContent=`Verified ${r.name} from local files. You can now load\
 it.`,{quiet:!0})})}finally{_=!1,e.storedCancel.textContent="Stop loading",B()&&V()}}}async function Un(r){if(!B()||C||le||
!p.loadStoredModel)return;const c=[...new Map(r.filter(yo).map(A=>[A.manifestCid,A])).values()];if(!c.length)return;_=!0;
let w=!1,v=!1;try{await Me(async A=>{lt();const F=[];let ae=0,ye=!1;try{for(const[me,se]of c.entries()){A.throwIfAborted(),
e.loadingModel.textContent=c.length>1?`${me+1} / ${c.length} · ${se.name}`:se.name,$e({stage:"verify"});try{await p.loadStoredModel(
se.manifestCid,{signal:A,onProgress:we=>{A.aborted||$e(we)},ggufGpuLayers:Number(e.gpuLayers.value)}),A.throwIfAborted(),
ae++,Le.delete(se.manifestCid)}catch(we){const Te=p.listResidentModels?.().find(pt=>pt.manifestCid===se.manifestCid);if(we instanceof
AggregateError||Te&&!["ready","idle"].includes(Te.status)||(A.throwIfAborted(),we.name==="AbortError"))throw we;F.push({
model:se,error:we})}}}finally{ye=await Z({signal:A}),v=A.aborted}if(A.throwIfAborted(),!ye)throw new Error("Model loadin\
g finished, but the stored library could not be refreshed. Use Refresh to check its state.");if(nt=p.getPreferredModelSourceKey?.()??
nt,ht(),F.length)throw new Error(c.length===1?F[0].error.message:`Loaded ${ae} of ${c.length} models. ${F.map(({model:me,
error:se})=>`${me.name}: ${se.message}`).join("; ")}`);fe(e.storedStatus.textContent=c.length===1?`Loaded ${c[0].name}. \
Compatible tasks can now use it.`:`Loaded ${ae} models. Compatible tasks can now use them.`,{quiet:!0}),w=!0},{modelName:c.
length===1?c[0].name:`${c.length} selected models`})}finally{_=!1,B()&&(V(),w&&!Le.size&&!g?(ue?.close(),e.prompt.focus()):
v&&Z({preserveStatus:!0}))}}function Gn(){K=null,e.attachment.hidden=!0,e.attachmentImage.removeAttribute("src"),e.imageFile.
value="",V()}try{if(p=await h({stateManager:n,computeManager:a,networkManager:o,runtimeBaseUrl:s}),y&&!g){H=Ha({panel:e.
panel,personalView:{transcript:e.transcript,empty:e.empty},onSelect({previous:w,current:v}){at?.cancel(),te?.abort(),vt?.
abort(),Wt++,kt=!1,w.draft={text:e.prompt.value,attachment:K},w.targetKey=Xe,w.generateImage=e.generateImage.checked,w.speakReplies=
e.speakReplies.checked,U=v.histories,e.transcript=v.view.transcript,e.empty=v.view.empty,Xe=v.targetKey,e.target.value=Xe,
e.prompt.value=v.draft.text,K=v.draft.attachment,e.attachment.hidden=!K,K?(e.attachmentImage.src=K.preview,e.attachmentName.
textContent=K.name):e.attachmentImage.removeAttribute("src"),e.imageFile.value="",e.generateImage.checked=v.generateImage,
e.speakReplies.checked=v.speakReplies,lt(),ht(),At(),v.id==="personal"&&Qe(Xe)&&M(Xe),e.prompt.focus()}});const c=H.getChannel(
H.active);U=c.histories,e.transcript=c.view.transcript,e.empty=c.view.empty,L=Xa(H.getChannel("global").view),G=S({getNetworkManager:()=>p?.
networkManager,onEvent:w=>B()?L.append(w):void 0,onStatus:w=>{B()&&H.setStatus(w)}})}const r=p.getPreferences();e.sharing.
checked=r.sharing,e.hosting.checked=r.hostInference,e.shareEvidence.checked=p.getModelEvidenceStatus?.().sharing===!0,N(),
ue=Ra({container:e.panel,keepOpenOnAction:g,onConfigure:g?()=>e.configure.click():void 0,onDismiss:g?()=>xe.requestClose():
void 0,storedContent:e.storedContent,hasStoredModels:()=>ee.length>0||Ke.some(c=>c.source==="stored"),onStoredOpen:({signal:c}={})=>Z(
{signal:c,quietCancellation:!0}),getSources:()=>Ke,getTargets:()=>Ue,searchModels:c=>p.searchModelHub(c),inspectModel:(c,w)=>p.
inspectModelHub(c,w),queryEvidence:p.queryModelEvidence?(c,w)=>p.queryModelEvidence(c,w):void 0,findConversions:p.findModelConversions?
(c,w)=>p.findModelConversions(c,w):void 0,getCompatibility:c=>c.localAvailability??p.getModelCompatibility?.(c.package??
c)??{status:"unknown",reason:"Local memory fit is unverified."},onLoad:zo,onUsePeer(c){ht();const w=Ue.find(F=>F.key===c&&
F.available&&!F.local);if(!w){Ee(new Error("This inference host is no longer available. Refresh the model browser."));return}
if(g){fe("This peer model is available to residents with network-assisted routing. Return to the world to chat.");return}
const v=["automatic-speech-recognition","text-to-speech"].includes(w.task),A=w.task==="image-to-3d";P(v||A?"mixed":c).then(
()=>e.prompt.focus()).catch(Ee),v&&fe("Mixed routing can use compatible peer speech models. Use Talk or Speak replies.",
{quiet:!0}),A&&fe("This 3D model is available to CubeChat residents. Ask your resident to generate and place an object.",
{quiet:!0})},onSetup:on}),g&&(xe=Ta({browser:ue,onRequestClose:ut})),p.inspectLoraHub&&p.createLoraModel&&(it=Ba({container:e.
panel,onInspect:(c,w)=>p.inspectLoraHub(c,w),async onApply({baseManifestCid:c,signal:w,onProgress:v,...A}){if(!B()||C)throw new Error(
"Another model operation is running");let F,ae;if(await Me(async ye=>{const me=AbortSignal.any([w,ye]);try{F=await p.createLoraModel(
c,{...A,signal:me,ggufGpuLayers:Number(e.gpuLayers.value),onProgress(se){v?.(se),$e(se)}}),me.throwIfAborted(),fe(`Saved\
 ${A.name}${A.load?" and loaded it":""}.`,{quiet:!0})}catch(se){throw g&&me.aborted&&se instanceof AggregateError&&(ke=se),
ae=se,se}finally{await Z({preserveStatus:!0})}},A.load&&!g?{modelName:A.name}:{}),ae)throw ae;if(!F)throw new DOMException(
"Adapter operation cancelled","AbortError");return F}}));for(const c of[e.browse,e.modelsMenu])c.setAttribute("aria-cont\
rols",ue.element.id);ue.element.addEventListener("close",()=>{!g&&B()&&!e.panel.querySelector("dialog[open]")&&(document.
activeElement===document.body||!document.activeElement?.getClientRects().length)&&e.browse.focus()}),ht(),fe("Ready.",{quiet:!0})}catch(r){
throw e.networkInfo.dispose(),e.panel.remove(),r}e.chatConfigure.onclick=()=>{!B()||ce||C||(e.chatOptionsStatus.textContent=
"",e.chatOptionsStatus.hidden=!0,e.networkInfo.close(),e.menuWindow.close(),e.configuration.close(),e.about.close(),e.compatibility.
close(),ue?.close(),e.chatOptions.open||e.chatOptions.showModal())},e.chatOptions.addEventListener("close",()=>{B()&&!e.
panel.querySelector("dialog[open]")&&(document.activeElement===document.body||!document.activeElement?.getClientRects().
length)&&e.chatConfigure.focus()}),e.configure.onclick=()=>{if(!(!B()||be)){if(xe){e.configurationStatus.textContent="",
oe(),xe.show(e.configuration,{refreshStoredOnReturn:!0});return}e.networkInfo.close(),e.chatOptions.close(),e.menuWindow.
close(),e.about.close(),e.compatibility.close(),ue?.close(),e.configurationStatus.textContent="",e.configuration.showModal()}};
function Dn(r={}){!B()||ce||be||(xe&&xe.showLibrary(),e.networkInfo.close(),e.chatOptions.close(),e.menuWindow.close(),e.
about.close(),e.compatibility.close(),e.configuration.close(),ue.open({selectedKey:nt,...r}))}e.browse.onclick=e.modelsMenu.
onclick=()=>Dn(),e.menu.onclick=()=>{!B()||be||(e.networkInfo.close(),e.chatOptions.close(),e.about.close(),e.compatibility.
close(),e.configuration.close(),ue?.close(),e.menuWindow.showModal())},e.aboutButton.onclick=()=>{!B()||be||(e.networkInfo.
close(),e.chatOptions.close(),e.menuWindow.close(),e.about.showModal())};for(const r of[e.menuWindow,e.configuration,e.about])
r.addEventListener("close",()=>{B()&&![e.loading,e.menuWindow,e.configuration,e.about,e.compatibility,e.chatOptions,ue.element].
some(c=>c.open)&&document.activeElement!==e.prompt&&e.menu.focus()});if(x){const r=(c=x.getState())=>{B()&&(e.install.hidden=
!1,e.install.disabled=c.installed||c.installing,e.install.textContent=c.installed?"Installed":c.installing?"Installing…":
"Install",e.menuStatus.textContent=String(c.instructions??"").slice(0,512))};r(),Ye=x.subscribe?.(r),e.install.onclick=async()=>{
if(!(!B()||e.install.disabled))try{const c=await x.install();B()&&(r(),c.instructions&&(e.menuStatus.textContent=String(
c.instructions).slice(0,512)))}catch(c){B()&&(e.menuStatus.textContent="Installation unavailable: "+String(c.message).slice(
0,256))}}}e.storedRefresh.onclick=()=>{Z()},e.storedLoadSelected.onclick=()=>{Un(ee.filter(r=>Le.has(r.manifestCid)))},e.
storedDeleteSelected.onclick=()=>{Re(ee.filter(r=>Le.has(r.manifestCid)))},e.storedAddLora.onclick=()=>{if(e.storedAddLora.
disabled||!it)return;const r=ee.find(c=>Le.has(c.manifestCid));r&&it.open(r)},e.back.onclick=r=>{r.preventDefault(),B()&&
!e.leaveConfirmation.open&&(e.networkInfo.close(),e.chatOptions.close(),e.leaveConfirmation.showModal())},e.stay.onclick=
()=>{tt||(e.leaveConfirmation.close(),e.back.focus())},e.leaveConfirmation.addEventListener("cancel",r=>{tt&&r.preventDefault()}),
e.leave.onclick=async()=>{if(e.leave.disabled)return;const r=e.back.href;tt=!0,e.leave.disabled=e.stay.disabled=!0,e.leaveStatus.
textContent="Stopping models and closing connections…";try{await Hn(),D(r)}catch(c){e.panel.inert=!1,e.leave.disabled=
!1,e.leaveStatus.textContent=`Could not finish cleanup: ${c.message}. Click Leave to retry.`,e.leaveConfirmation.open||e.
leaveConfirmation.showModal(),e.leave.focus()}},e.helpBrowser.onchange=e.helpOs.onchange=St,e.helpConfig.onclick=()=>e.configure.
click(),e.compatibility.addEventListener("close",()=>{xt++,B()&&!e.configuration.open&&!ue?.element.open&&!e.about.open&&
!e.menuWindow.open&&!e.chatOptions.open&&e.browse.focus()}),e.helpCopy.onclick=async()=>{const r=e.helpCommand.value;if(!r||
!B())return;const c=++xt,w=()=>B()&&(e.compatibility.open||xe?.isShowing(e.compatibility))&&xt===c;try{await navigator.clipboard.
writeText(r),w()&&(e.helpStatus.textContent="Command copied.")}catch{w()&&(e.helpCommand.focus(),e.helpCommand.select(),
e.helpStatus.textContent="Clipboard unavailable. Select and copy the command above.")}},e.cpuBudget.onchange=e.gpuBudget.
onchange=Ie,e.target.onchange=()=>{e.chatOptionsStatus.textContent="",e.chatOptionsStatus.hidden=!0,P(e.target.value).catch(
Ee)},e.resumeAgent.onclick=()=>{const r=Qe(e.target.value);!r||C||Me(async c=>{await(await u()).resume(r),c.throwIfAborted(),
fe("Agent ready. Send a message.",{quiet:!0})})},e.generateImage.onchange=()=>{e.generateImage.checked&&(e.speakReplies.
checked=!1),lt(),V()},e.useTextChat.onclick=()=>{C||(e.generateImage.checked=!1,lt(),V(),e.prompt.focus())},e.speakReplies.
onchange=()=>{e.speakReplies.checked&&(e.generateImage.checked=!1),lt(),V()},e.prompt.oninput=V;for(const[r,c]of[[e.sharing,
"setSharing"],[e.hosting,"setHostInference"],[e.shareEvidence,"setShareModelEvidence"]])r.onchange=()=>{if(!B())return;const w=r.
checked;r.disabled=!0;const v=(async()=>{try{await p[c](w),B()&&(e.configurationStatus.textContent="Preferences updated.")}catch(A){
r.checked=!w,Ee(A)}finally{B()&&(r.disabled=!1)}})();$.add(v),v.finally(()=>$.delete(v))};async function zo(r){if(!B()||
C)return;const c=typeof r=="string"?r:r?.key;Ke=p.listModelSources();let w=c?Ke.find(A=>A.key===c)??(dt?.key===c?dt:null):
r;if(!w){et();return}w.package&&(w={...w,localAvailability:p.getModelCompatibility(w.package)});const v=!w.key&&w.model&&
Array.isArray(w.files);if(v&&(w=dt={...w,key:`hub:${w.id}`,source:"hf",package:w,localAvailability:p.getModelCompatibility(
w)}),Dt(w)){on(w);return}return nt=w.key,v&&Ke.push(w),et(),Me(async A=>{lt(),$e({stage:"prepare"});const F={signal:A,onProgress:ye=>{
A.aborted||$e(ye)},ggufGpuLayers:Number(e.gpuLayers.value)};w.package?await p.acquireHubModel(w.package,F):await p.acquireModel(
w.key,F),A.throwIfAborted(),nt=p.getPreferredModelSourceKey?.()??nt,dt=null,ht(),V();const ae=!!p.getSharingErrors?.().length;
fe(ae?"Model ready. Sharing is unavailable for some stored models; see Models → Stored models.":g?"Model ready. Return\
 to the world to use it.":(w.model?.task??w.task)==="image-to-3d"?"3D model ready. CubeChat residents can use it to crea\
te objects; enable Host inference to serve other peers.":"Model ready. Send a message.",{quiet:!ae})},{modelName:w.name})}
e.unload.onclick=()=>Me(async()=>{lt(),await p.unload(),We();for(const r of U.keys())(r==="local"||r.startsWith("local:"))&&
U.delete(r);fe("Local models unloaded. Stored files are kept.",{quiet:!0}),e.configurationStatus.textContent=e.status.textContent}),
e.clearChat.onclick=()=>{!B()||C||Qe(e.target.value)||(U.clear(),lt(),H?.active==="global"?L.clear():e.transcript.replaceChildren(
e.empty),O.prune(),fe(e.configurationStatus.textContent=H?.active==="global"?"Global view and your model context cleared\
 here. Messages already shared remain on other peers.":"Conversation cleared. Ready for a new message.",{quiet:!0}))},e.
connect.onclick=()=>Me(async r=>{e.relay.value.trim()?await p.connect(e.relay.value.trim(),{signal:r}):await p.connectBackend(
{signal:r}),await J()}),e.file.onchange=()=>Me(async r=>{const c=e.file.files[0];c&&(await p.store.importFile(c.stream(),
{expectedSize:c.size,pin:!0,signal:r}),fe("Pinned "+c.name+" locally.",{quiet:!0}),e.file.value="")}),e.attach.onclick=()=>e.
imageFile.click();async function ro(r,{signal:c}={}){if(!r||!B())return;te?.abort();const w=new AbortController;te=w;const v=c?
AbortSignal.any([w.signal,c]):w.signal;ne=!0,V();try{const A=await wa(r,{signal:v});if(!B()||v.aborted)return;K=A,e.attachmentImage.
src=A.preview,e.attachmentName.textContent=A.name,e.attachment.hidden=!1,V(),e.prompt.focus()}catch(A){v.aborted||Ee(A)}finally{
te===w&&(ne=!1,B()&&V())}}at=Ca({textarea:e.prompt,onFile:ro,onError:Ee,onPendingChange:r=>{r&&te?.abort(),mt=r,B()&&V()},
canAccept:()=>B()?C||kt?"Wait for the current chat operation to finish.":e.generateImage.checked?"Uncheck Generate image\
 to attach an image for a vision model.":st(he("image-text-to-text"),"image-text-to-text")||"Choose Mixed or a loaded lo\
cal or peer vision model to attach an image.":"This chat is closing."}),e.imageFile.onchange=()=>{at.cancel(),ro(e.imageFile.
files[0])},e.removeAttachment.onclick=()=>{at.cancel(),te?.abort(),Gn()},e.cancel.onclick=()=>{if(be){ze();return}C?.abort(
new DOMException("User cancelled","AbortError")),Rt.active&&ft?.cancel().catch(Ee),_&&(e.storedStatus.textContent="Cance\
lling verification… Waiting for cleanup."),W&&(e.storedStatus.textContent="Cancelling deletion… Waiting for cleanup."),
V(),X&&p.cancel(X).catch(Ee),Je&&je?.cancel(Je).catch(Ee)},e.loadingCancel.onclick=ze,e.loading.addEventListener("cancel",
r=>{r.preventDefault(),ze()}),e.storedCancel.onclick=()=>e.cancel.click();const qn=r=>r&&typeof r.local=="boolean"?`${r.
local?"Local":"Peer"} · ${String(r.modelName??r.manifestCid??"model").slice(0,180)}`:null;function io(r,c){Rt=r,B()&&(!c?.
aborted&&r.status!=="idle"&&r.status!=="closed"&&fe({"requesting-microphone":"Starting microphone… allow access if asked\
, and keep holding Talk.",recording:"Listening… release Talk to send.",transcribing:"Transcribing voice…",synthesizing:"\
Preparing spoken reply…",playing:"Speaking…"}[r.status]??r.status),V())}async function so(r){!ft&&!It&&(It=(async()=>{
Ot=await m();try{return ft=await T({audio:Ot,execute:async(w,v)=>{if(wt){const F=await(await u()).speechTarget(wt,{signal:v.
signal});w=w==="local-only"||F==="local-only"?"local-only":"mixed"}const A=v.requestId??crypto.randomUUID();X=A;try{const F=await p.
generate(w,{...v,requestId:A});return Y&&v.task==="text-to-speech"&&!v.signal?.aborted&&G.publish({...Y,phase:"audio",text:"",
part:Y.part++,audio:{samples:F.audio,sampleRate:F.sampleRate}}),F}finally{X===A&&(X=null)}}}),ft}catch(w){throw await Ot?.
dispose(),Ot=null,w}})().finally(()=>{It=null}));const c=ft??await It;return r?.throwIfAborted(),c}function lo(r){if(!B()||
C?.signal.aborted)return;const c=qn(r.route??(r.type==="routing"||r.type==="route"?r:null));c&&fe(`${Rt.status==="transc\
ribing"?"Speech recognition":"Speech"} · ${c}`)}async function Fn(r,{text:c=e.prompt.value.trim(),preserveDraft:w=!1,origin:v,
audio:A}={}){v??={channel:H?.active??"personal",name:H?.getName()??"Guest"};const F=v.channel==="global"?{turnId:crypto.
randomUUID(),name:v.name,part:0}:null;if(A&&F)throw new Error("Transcribe recordings before sending them to Global chat.");
const ae=A?"audio-text-to-text":Tt(),ye=he(ae),me=ye?.key??e.target.value,se=ye?.agentId,we=ae==="text-to-image",Te=K;if(A&&
se)throw new Error("Transcribe recordings before sending them to an agent.");if(we&&Te)throw new Error("Remove the attac\
hed image or uncheck Generate image.");if(!st(ye,ae))throw new Error("No compatible model is available. Load one in Mode\
ls or choose another target.");if(!Yt(ye,ae,[...A?["audio"]:[],...Te?["image"]:[]]))throw new Error("Compatible models h\
ave no available queue capacity. Wait for capacity or choose another target.");if(Te&&!ye.automatic&&!ye.modalities?.includes(
"image"))throw new Error("This model accepts text only. Remove the image or choose an image model.");if(lt(),F&&se)throw new Error(
"Saved agents belong to Personal chat.");if(se){const Qt=await u(),He=await Qt.get(se,{signal:r}),Ce=Ut(He);if(Ce)throw new Error(
Ce)}const pt=we||se||F?null:await i?.({includeImage:!1}),re=(typeof pt=="string"?pt:pt?.text??"").slice(0,16e3),Jt=we||se||
F?"":String(l?.instructions??"").slice(0,8e3),Zt=Te||A||se?[]:U.get(me)??[],sn=c||(A?"Listen to the recording and respon\
d to the speaker.":"Describe this image."),Mn=we?void 0:[...re||Jt?[{role:"system",content:re+`
`+Jt}]:[],...Zt.slice(-6),{role:"user",content:Ko(sn,{task:ae,concise:e.beConcise.checked})}];F?G.publish({...F,phase:"p\
rompt",text:sn,image:Te?.image}):Wn(e,"user",A?`${c?c+`
`:""}Voice message (${(A.samples.length/A.sampleRate).toFixed(1)} seconds)`:c,{image:Te?.preview});const Mt=F?document.createElement(
"p"):Wn(e,"assistant","",{targetName:ye.automatic?"Choosing model…":ye.name});let fo=ye.name;const ho=Qt=>{const He=qn(
Qt);!He||!B()||r.aborted||(fo=He,F||(Mt.parentElement.querySelector(".pc-chat-speaker").textContent=se?`Agent · ${ye.name}\
 · ${He}`:He),F||(Mt.parentElement.dataset.routeTarget=String(Qt.target??"").slice(0,256)),fe(`Using ${He}`))};w||(e.prompt.
value=""),Gn(),At(),X=se?null:crypto.randomUUID(),Je=se,wt=se,Y=F,fe("Choosing a compatible model…");try{const Qt={onProgress(Ce){
ho(Ce.route??(["route","routing","accepted"].includes(Ce.type)?Ce:null)),B()&&we&&Number.isSafeInteger(Ce.step)&&Number.
isSafeInteger(Ce.steps)&&Ce.step>=0&&Ce.step<=Ce.steps&&Ce.steps<=100&&fe(`Generating image: ${Ce.step}/${Ce.steps} step\
s…`)},onToken(Ce){B()&&!r.aborted&&!we&&(Mt.textContent+=Ce,At())}},He=se?await je.run(se,{signal:r,task:ae,prompt:sn,
concise:e.beConcise.checked,...Te?{image:Te.image}:{},maxNewTokens:1024,...Qt}):await p.generate(me,{requestId:X,signal:r,
task:ae,...we?{prompt:c}:{messages:Mn,image:Te?.image,...A?{audio:A}:{},maxNewTokens:1024},...Qt});if(r.aborted)throw new DOMException(
"Generation cancelled","AbortError");if(ho(He.route),we){if(!ye.outputModalities?.includes("image"))throw new Error("Thi\
s target did not advertise image output");F||await O.append(Mt,He.image,{signal:r,prompt:c})}else{if(typeof He.text!="st\
ring")throw new Error("Model returned an invalid text response");if(Mt.textContent=He.text,!se&&!A){for(Zt.push({role:"u\
ser",content:sn},{role:"assistant",content:He.text});Zt.length>6||E.encode(JSON.stringify(Zt)).byteLength>24*1024;)Zt.splice(
0,2);U.delete(me),U.set(me,Zt),U.size>8&&U.delete(U.keys().next().value)}else A&&U.delete(me)}if(F&&G.publish({...F,phase:"\
result",modelName:fo,text:we?"":He.text,...we?{image:He.image}:{}}),fe("Ready.",{quiet:!0}),!we){const Ce=[];if(He.finishReason===
"length"?Ce.push("Response reached the model’s output or context limit and may be incomplete."):He.finishReason!=="sto\
p"&&Ce.push("The model did not report whether this response is complete."),He.contextTruncated&&Ce.push("Older conversat\
ion turns were omitted to fit the model’s context."),Ce.length){const qt=document.createElement("p");qt.className="pc-\
inference-note",qt.textContent=Ce.join(" "),F||Mt.after(qt),fe(Ce.join(" "))}}try{for(const Ce of(we||F?[]:l?.propose(He.
text)??[]).slice(0,4)){const qt=document.createElement("button");qt.type="button",qt.textContent="Apply: "+Ce.label,qt.onclick=
async()=>{qt.disabled=!0;try{await Ce.apply()}catch(jn){Ee(jn)}},e.proposed.append(qt)}}catch{}if(!we&&e.speakReplies.checked&&
He.text.trim())try{const Ce=await so(r),qt=se?await je.speechTarget(se,{signal:r}):me;await Ce.speak(He.text,{target:qt,
signal:r,onProgress:lo,onState:jn=>io(jn,r)}),r.throwIfAborted(),fe("Ready.",{quiet:!0})}catch(Ce){r.throwIfAborted(),fe(
`Text reply received. Voice: ${Ce.message}. Load a speech-synthesis model in Models or use a compatible peer.`)}return He}catch(Qt){
const He=Qt.name==="AbortError"?"Cancelled.":"Request failed.";throw F?G.publish({...F,phase:"error",text:He}):Mt.textContent||
(Mt.textContent=He),Qt}finally{X=null,Je=null,wt=null,Y=null,At()}}async function co(){e.send.disabled||await Me(r=>Fn(r))}
e.send.onclick=()=>{co()};const uo=qa({button:e.talk,onStart(){if(!B()||e.talk.disabled||C)return;const r={channel:H?.active??
"personal",name:H?.getName()??"Guest"},c={controller:new AbortController,released:!1};Ct=c,Me(async w=>{const v=AbortSignal.
any([w,c.controller.signal]);v.throwIfAborted();const A=e.target.value||"mixed";wt=Qe(A);const F=wt?await(await u()).speechTarget(
wt,{signal:v}):A,ae=await so(v),ye=he("audio-text-to-text"),me=r.channel==="personal"&&!wt&&!e.generateImage.checked&&Yt(
ye,"audio-text-to-text",["audio",...K?["image"]:[]]),se=Ue.filter(re=>Kt(re)&&(!(F==="local"||F==="local-only"||F.startsWith(
"local:"))||re.local)),we=!se.some(re=>Cn(re,"automatic-speech-recognition")&&zn(re,"automatic-speech-recognition"))&&se.
some(re=>Cn(re,"audio-text-to-text")&&zn(re,"audio-text-to-text"))?"audio-text-to-text":"automatic-speech-recognition";let Te,
pt;try{const re={target:F,signal:v,onProgress:lo,onState:Jt=>{Jt.status!=="idle"&&(Te=Jt.status),Jt.recording&&(c.captureReady=
!0),io(Jt,v)}};pt=me?await ae.capture(re):await ae.record({...re,transcriptionTask:we})}catch(re){throw v.throwIfAborted(),
Te==="transcribing"?new Error(`${re.message}. Load a speech-recognition model in Models or use a compatible peer.`,{cause:re}):
re}if(v.throwIfAborted(),me){await Fn(v,{audio:pt,preserveDraft:!0,origin:r});return}if(!pt.text?.trim())throw new Error(
"No speech recognized. Try again or type a message.");await Fn(v,{text:pt.text.trim(),preserveDraft:!0,origin:r})}).finally(
()=>{Ct===c&&(Ct=null,uo.reset(),B()&&V())})},onRelease(){const r=Ct;if(!(!r||r.released)){if(r.released=!0,Rt.recording)
Promise.resolve().then(()=>ft.stop()).catch(c=>{r.controller.abort(c),Ee(c)});else if(!r.captureReady){try{Promise.resolve(
Ot?.unlock?.()).catch(c=>{B()&&Ct===r&&Ee(c)})}catch(c){Ee(c)}r.controller.abort(new DOMException("Microphone startup ca\
ncelled. Allow access if asked, then hold Talk again to record.","AbortError"))}B()&&V()}},onCancel(){!Ct||Ct.released||
(Ct.released=!0,Ct.controller.abort(new DOMException("Recording cancelled","AbortError")),B()&&V())}});e.agents.onclick=
()=>{!B()||e.agents.disabled||(H?.select("personal"),bt=(async()=>{try{const r=await p.getAgentController();if(!B())return;
await u(),gt??=Oa({container:e.panel,controller:r,onChat:async c=>{await je.refresh(),ht(),await P(`agent:${c}`),requestAnimationFrame(
()=>{B()&&e.prompt.focus()})},onBrowseModels:()=>{B()&&e.browse.click()}}),e.networkInfo.close(),e.chatOptions.close(),e.
menuWindow.close(),e.configuration.close(),ue?.close(),e.about.close(),e.compatibility.close(),await gt.open({selectedId:Qe(
e.target.value)})}catch(r){Ee(r)}})().finally(()=>{bt=null,B()&&V()}),V())},e.prompt.onkeydown=r=>{r.key==="Enter"&&!r.shiftKey&&
!r.isComposing&&(r.preventDefault(),co())};const po=(async()=>{const r=await Z();if(B()){if(ce=!1,V(),g){ue.open({tab:!r||
ee.length?"stored":"browse",refreshStored:!1,selectedKey:nt});return}if(!r||ee.length){ue.open({tab:"stored",refreshStored:!1,
selectedKey:nt}),r&&fe("Choose stored models to load, or close the library to use peers.",{quiet:!0});return}try{const c=p.
getStartupModel?.();c&&(nt=c.sourceKey,et(),c.manifestCid?fe("The remembered model is no longer in the stored library. C\
hoose a model to load."):Dt(c)?fe(c.needsVerification?`${c.name} is saved but needs local verification. Open Models → St\
ored models → Verify locally. No model download has started.`:`Cannot load ${c.name}: ${pn(c)}`):Me(async w=>{$e({stage:"\
prepare"});const v={signal:w,onProgress:A=>{w.aborted||$e(A)},ggufGpuLayers:Number(e.gpuLayers.value)};await p.acquireModel(
c.sourceKey,v),w.throwIfAborted(),ht(),fe(`Loaded ${c.name}. Send a message.`,{quiet:!0})},{modelName:c.name}))}catch(c){
Ee(c)}}})();if(rt=setInterval(()=>{J(),je?.refresh().catch(Ee)},Math.max(20,k)),!g&&p.getAgentController&&u().catch(r=>{
B()&&Ee(r)}),b&&!p.networkReady){const r=new AbortController;Pe=r,Ne=p.connectBackend({signal:r.signal}).then(()=>J()).catch(
c=>{B()&&!r.signal.aborted&&(pe=c)}).finally(()=>{Pe===r&&(Pe=null),B()&&R()})}else J();async function Hn(){if(clearInterval(
Et),Et=null,!qe){if(Se)return Se;if(_e=!0,it?.dispose(),uo.dispose(),e.networkInfo.dispose(),e.chatOptions.close(),xe){ue.
setBusy(!0),ue.setFeedback("Closing Models… Waiting for cleanup.");for(const r of e.storedContent.querySelectorAll("bu\
tton,input"))r.disabled=!0}else ue?.dispose(),e.panel.inert=!0;Ye?.(),O.dispose(),e.menuWindow.close(),e.compatibility.close(),
e.configuration.close(),e.about.close(),Se=(async()=>{clearInterval(rt),C?.abort("Chat closed"),vt?.abort(),te?.abort(),
Oe?.abort(),Pe?.abort(),le?.abort(),await at?.dispose(),await je?.dispose(),lt(),await q,await ie,await Ne,await ge,await po,
await Promise.allSettled([...$]),await bt,await Fe?.catch(()=>{}),await Ze,await gt?.dispose(),await It,await ft?.dispose(),
await G?.close(),L?.dispose(),H?.dispose(),await p.dispose(),qe=!0,it?.dispose(),ue?.dispose(),U.clear(),K=null,e.panel.
remove(),f?.()})();try{await Se}catch(r){throw xe&&(xe.showLibrary(),ue.setBusy(!0),ue.setFeedback(`Could not close Mode\
ls: ${r.message}. Click Done to retry.`)),r}finally{Se=null}}}return{element:e.panel,runtime:p,dispose:Hn,refreshPeers:J,
startupReady:po,openModels:Dn}}export{mr as mountInferencePanel};
