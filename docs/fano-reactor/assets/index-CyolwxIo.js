(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const V=16,ne=[[1,2,3],[1,4,5],[1,6,7],[2,4,6],[2,5,7],[3,4,7],[3,5,6]],j=(e,t)=>{if(e.length!==t.length)throw new Error(`Length mismatch: ${e.length} !== ${t.length}`)},oe=e=>e.slice(),B=e=>{const t=e.length/2;return[e.slice(0,t),e.slice(t)]},se=(e=V)=>new Array(e).fill(0),ae=(e,t=V)=>{const n=se(t);for(const a of e){if(!a)continue;const{index:o,coefficient:s=1}=a;if(!Number.isInteger(o)||o<0||o>=t)throw new Error(`Invalid basis index: ${o}`);n[o]+=s}return n},$=(e,t)=>(j(e,t),e.map((n,a)=>n+t[a])),le=(e,t)=>(j(e,t),e.map((n,a)=>n-t[a])),re=(e,t)=>e.map(n=>n*t),M=e=>{if(e.length===1)return oe(e);const[t,n]=B(e);return M(t).concat(re(n,-1))},p=(e,t)=>{if(j(e,t),e.length===1)return[e[0]*t[0]];const[n,a]=B(e),[o,s]=B(t),l=le(p(n,o),p(M(s),a)),i=$(p(s,n),p(a,M(o)));return l.concat(i)},P=e=>e.reduce((t,n)=>t+n*n,0),S=e=>e.every(t=>t===0),W=e=>e.map((t,n)=>({index:n,coefficient:t})).filter(t=>t.coefficient!==0),L=e=>{const t=W(e);return t.length?t.map(({index:n,coefficient:a},o)=>{const s=a<0?"-":"+",l=Math.abs(a),i=n===0?"1":`e${n}`,d=l===1?i:`${l}${i}`;return o===0?a<0?`-${d}`:d:` ${s} ${d}`}).join(""):"0"},h=[{lowerIndex:1,period:1,shellLength:2,nobleGas:"He",partnerIndex:9,layer:"C"},{lowerIndex:2,period:2,shellLength:8,nobleGas:"Ne",partnerIndex:10,layer:"H"},{lowerIndex:3,period:3,shellLength:8,nobleGas:"Ar",partnerIndex:11,layer:"H"},{lowerIndex:4,period:4,shellLength:18,nobleGas:"Kr",partnerIndex:12,layer:"O"},{lowerIndex:5,period:5,shellLength:18,nobleGas:"Xe",partnerIndex:13,layer:"O"},{lowerIndex:6,period:6,shellLength:32,nobleGas:"Rn",partnerIndex:14,layer:"O"},{lowerIndex:7,period:7,shellLength:32,nobleGas:"Og",partnerIndex:15,layer:"O"}],ie=new Map(h.map(e=>[e.lowerIndex,e])),q=new Map;for(const e of ne)for(const t of e){const n=q.get(t)||[];n.push(e),q.set(t,n)}const m={ionic:{label:"Ionic",tone:"ionic",color:"cyan",detail:"Norm annihilation / energy release"},covalent:{label:"Covalent",tone:"covalent",color:"amber",detail:"Norm conserved / neutral lock"},anti:{label:"Anti-bond",tone:"anti",color:"red",detail:"Norm amplified / repulsive pressure"},inert:{label:"Inert",tone:"inert",color:"green",detail:"No zero-divisor path discovered"},exotic:{label:"Exotic",tone:"exotic",color:"pink",detail:"Composite-state defect outside atomic spectrum"}},ce=(e,t,n)=>`e${e}${n>=0?"+":"-"}e${t}`,de=e=>e.slice().sort((t,n)=>t.index-n.index),ue=e=>de(W(e)),pe=e=>e.map(({index:t,coefficient:n})=>`${n>=0?"+":"-"}${Math.abs(n)}e${t}`).join(""),R=({lowerIndex:e,upperIndex:t,sign:n})=>{const a=[{index:e,coefficient:1},{index:t,coefficient:n>=0?1:-1}],o=ae(a),s=ie.get(e)||null;return{id:ce(e,t,n),kind:"atom",lowerIndex:e,upperIndex:t,sign:n>=0?1:-1,period:(s==null?void 0:s.period)??null,shellLength:(s==null?void 0:s.shellLength)??null,nobleGas:(s==null?void 0:s.nobleGas)??null,layer:(s==null?void 0:s.layer)??null,label:L(o),element:o,norm:P(o),terms:a,familyKey:`${e}:${t}`,isCdPartner:t===e+8}},me=(e,t)=>t||e===-4?m.ionic:e===0?m.covalent:e===4?m.anti:m.exotic,ve=(e,t)=>{const n=p(e.element,t.element),a=P(n),o=a-e.norm*t.norm,s=S(n),l=y(e)===0||y(t)===0,i=!s&&l?m.inert:me(o,s);return{left:e,right:t,product:n,productNorm:a,delta:o,zeroDivisor:s,bond:i,moleculeElement:$(e.element,t.element),moleculeLabel:L($(e.element,t.element))}},ge=(e,t="molecule")=>{const n=ue(e);return{id:`${t}:${pe(n)}`,kind:t,label:L(e),element:e,norm:P(e),terms:n}},fe=(e,t)=>e>=1&&e<=7&&t>=9&&t<=15&&t!==e+8,v=[];for(let e=1;e<=14;e+=1)for(let t=e+1;t<=15;t+=1)v.push(R({lowerIndex:e,upperIndex:t,sign:1})),v.push(R({lowerIndex:e,upperIndex:t,sign:-1}));const c=v.filter(e=>fe(e.lowerIndex,e.upperIndex)),D=v.filter(e=>e.isCdPartner),be=D.filter(e=>e.sign===1),he=new Map(v.map(e=>[e.id,e])),I=e=>he.get(e)||null,w=new Map;for(const e of c){const t=c.filter(n=>n.id!==e.id&&S(p(e.element,n.element)));w.set(e.id,t)}const O=e=>c.filter(t=>S(p(e,t.element))).length,k=(e,t)=>{const n=O(e);return{label:t,element:e,formatted:L(e),norm:P(e),canonicalTargets:n,paperTargets:n}},ye=()=>{for(const e of c){const t=w.get(e.id)||[];for(const n of t){const a=$(e.element,n.element),o=c.filter(s=>![e.id,n.id].includes(s.id)&&S(p(a,s.element)));for(const s of o){const l=$(a,s.element);if(O(l)===0)return{atomA:e,atomB:n,molecule:k(a,"molecule"),moleculeTargets:o,atomC:s,superMolecule:k(l,"super-molecule")}}}}return null},u={reactiveStates:c,nobleGasStates:D,showcaseStates:c.concat(be),inertStates:v.filter(e=>!c.includes(e)),cascadeSample:ye(),counts:{reactiveStates:c.length,reactiveFamilies:c.length/2,directedZeroDivisorPairs:c.reduce((e,t)=>{var n;return e+(((n=w.get(t.id))==null?void 0:n.length)||0)},0),nobleGasChannels:D.length/2}},x=e=>w.get(e.id)||[],y=e=>Array.isArray(e)?O(e):x(e).length,N=e=>Array.isArray(e)?y(e):(e==null?void 0:e.kind)==="atom"?y(e)*2:y(e),$e=e=>q.get(e)||[],G=e=>{const t=$e(e),n=new Set;for(const a of t)for(const o of a)o!==e&&n.add(o);return Array.from(n).sort((a,o)=>a-o)},Se=(e,t)=>{const n=ve(e,t),a=ge(n.moleculeElement,"molecule"),o=c.filter(s=>![e.id,t.id].includes(s.id)&&S(p(a.element,s.element)));return{...n,molecule:a,moleculeCanonicalTargets:o.length,moleculePaperTargets:o.length,productLabel:L(n.product),moleculeTargets:o}},Le=()=>m,xe=document.querySelector("#app"),Te=h.map(e=>`<option value="${e.lowerIndex}">Period ${e.period} :: e${e.lowerIndex} :: noble ${e.nobleGas}</option>`).join(""),z=u.showcaseStates.map(e=>`<option value="${e.id}">${e.label}</option>`).join(""),r=u.cascadeSample;var Y,K;const F=((Y=r==null?void 0:r.atomA)==null?void 0:Y.id)||((K=u.reactiveStates[0])==null?void 0:K.id)||"";var X,J;const ee=((X=r==null?void 0:r.atomB)==null?void 0:X.id)||((J=x(I(F))[0])==null?void 0:J.id)||F;var Q,U;const _=((Q=u.nobleGasStates.find(e=>e.id==="e1+e9"))==null?void 0:Q.id)||((U=u.nobleGasStates[0])==null?void 0:U.id)||"";xe.innerHTML=`
  <div class="shell">
    <div class="screen-noise"></div>
    <div class="grid"></div>
    <header class="hero panel">
      <div>
        <div class="eyebrow">ALGORITHMIC CHEMISTRY CONSOLE</div>
        <h1>Fano Reactor</h1>
        <p>
          big dog, this first scaffold keeps the chemistry model exact and the interaction surface explainable.
          Atoms are canonical sedenion states, reactions are classified from the composition norm defect,
          and the Fano plane exposes which period families can talk to each other.
        </p>
      </div>
      <div class="hero-stats">
        <div><span>Reactive States</span><strong>${u.counts.reactiveStates}</strong></div>
        <div><span>Reactive Families</span><strong>${u.counts.reactiveFamilies}</strong></div>
        <div><span>Directed ZD Pairs</span><strong>${u.counts.directedZeroDivisorPairs}</strong></div>
        <div><span>Noble Channels</span><strong>${u.counts.nobleGasChannels}</strong></div>
      </div>
    </header>

    <div class="toolbar panel">
      <button class="mode-tab active" data-mode-tab="bond-lab">bond-lab</button>
      <button class="mode-tab" data-mode-tab="fano-map">fano-map</button>
      <div class="toolbar-note"><code>swarm</code> and live PeerCompute task sharding are planned next.</div>
    </div>

    <main class="layout">
      <section class="panel mode-panel active" data-mode-panel="bond-lab">
        <div class="panel-title">Bond Lab</div>
        <div class="selectors">
          <label>
            <span>Atom A</span>
            <select id="left-state">${z}</select>
          </label>
          <label>
            <span>Atom B</span>
            <select id="right-state">${z}</select>
          </label>
          <div class="selector-actions">
            <button id="pick-target">Pick valid target</button>
            <button id="load-cascade">Load cascade sample</button>
            <button id="load-noble">Load noble gas guard</button>
          </div>
        </div>

        <div class="reaction-board">
          <article class="state-card">
            <div class="label">Atom A</div>
            <div id="left-label" class="state-label"></div>
            <div id="left-meta" class="meta-list"></div>
          </article>
          <article class="state-card center">
            <div class="label">Reaction</div>
            <div id="delta-badge" class="delta-badge"></div>
            <div id="bond-detail" class="bond-detail"></div>
            <div id="product-label" class="product-label"></div>
          </article>
          <article class="state-card">
            <div class="label">Atom B</div>
            <div id="right-label" class="state-label"></div>
            <div id="right-meta" class="meta-list"></div>
          </article>
        </div>

        <div class="molecule-grid">
          <article class="panel inset">
            <div class="panel-title">Molecule</div>
            <div id="molecule-label" class="state-label"></div>
            <div id="molecule-meta" class="meta-list"></div>
          </article>
          <article class="panel inset">
            <div class="panel-title">Target Console</div>
            <div id="target-list" class="chip-list"></div>
          </article>
          <article class="panel inset">
            <div class="panel-title">Cascade Probe</div>
            <div id="cascade-output" class="cascade-output"></div>
          </article>
        </div>
      </section>

      <section class="panel mode-panel" data-mode-panel="fano-map">
        <div class="panel-title">Fano Map</div>
        <div class="map-layout">
          <div class="map-shell">
            <svg id="fano-map" viewBox="0 0 520 420" role="img" aria-label="Fano period map"></svg>
          </div>
          <aside class="map-sidebar">
            <label>
              <span>Focus period family</span>
              <select id="period-select">${Te}</select>
            </label>
            <div id="period-meta" class="meta-list"></div>
            <div class="panel inset">
              <div class="panel-title">Reactive States</div>
              <div id="period-states" class="chip-list"></div>
            </div>
            <div class="panel inset">
              <div class="panel-title">Connected Families</div>
              <div id="connected-families" class="chip-list"></div>
            </div>
          </aside>
        </div>
      </section>

      <aside class="panel side-console">
        <div class="panel-title">System Console</div>
        <div id="console-lines" class="console-lines"></div>
        <div class="legend">
          ${Object.values(Le()).map(e=>`
            <div class="legend-row">
              <span class="swatch ${e.tone}"></span>
              <div><strong>${e.label}</strong><small>${e.detail}</small></div>
            </div>
          `).join("")}
        </div>
      </aside>
    </main>
  </div>
`;const g=document.querySelector("#left-state"),f=document.querySelector("#right-state"),Ce=document.querySelector("#pick-target"),Ie=document.querySelector("#load-cascade"),Ae=document.querySelector("#load-noble"),A=document.querySelector("#period-select"),Z=Array.from(document.querySelectorAll("[data-mode-tab]")),Pe=Array.from(document.querySelectorAll("[data-mode-panel]"));g.value=F;f.value=ee;r&&(A.value=String(r.atomA.lowerIndex));const E={1:{x:260,y:48},2:{x:112,y:144},3:{x:408,y:144},4:{x:92,y:310},5:{x:428,y:310},6:{x:260,y:360},7:{x:260,y:210}},C=e=>e.map(([t,n])=>`<div><span>${t}</span><strong>${n}</strong></div>`).join(""),H=(e,t="")=>e.length?e.map(n=>`<span class="chip ${t}">${n}</span>`).join(""):'<div class="empty">none</div>',we=e=>{const t=x(e.left),n=G(e.left.lowerIndex);document.querySelector("#console-lines").innerHTML=[`A = ${e.left.label}`,`B = ${e.right.label}`,`A * B = ${e.zeroDivisor?"0":e.productLabel}`,`N(A * B) = ${e.productNorm}`,`Delta = ${e.delta}`,`Zero-divisor path = ${e.zeroDivisor?"YES":"NO"}`,`A target set = ${t.map(a=>a.label).join(", ")}`,`Fano-linked lower families = ${n.join(", ")}`].map(a=>`<div>${a}</div>`).join("")},te=e=>{const t=document.querySelector("#fano-map"),n=new Set(G(e));t.innerHTML=`
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    ${[[1,2,3],[1,4,5],[1,6,7],[2,4,6],[2,5,7],[3,4,7],[3,5,6]].map(l=>{const i=l.includes(e),d=l.map(T=>`${E[T].x},${E[T].y}`).join(" ");return`<polyline class="fano-line ${i?"active":""}" points="${d}" />`}).join("")}
    ${h.map(l=>{const i=E[l.lowerIndex],d=l.lowerIndex===e,T=n.has(l.lowerIndex);return`
        <g class="period-node ${d?"active":T?"linked":""}" transform="translate(${i.x}, ${i.y})">
          <circle r="${d?40:32}" />
          <text class="period-number" y="-6">P${l.period}</text>
          <text class="period-label" y="16">e${l.lowerIndex}</text>
        </g>
      `}).join("")}
  `;const a=h.find(l=>l.lowerIndex===e),o=u.reactiveStates.filter(l=>l.lowerIndex===e),s=G(e).map(l=>`P${h.find(d=>d.lowerIndex===l).period} / e${l}`);document.querySelector("#period-meta").innerHTML=C([["Period",a.period],["Shell length",a.shellLength],["Layer",a.layer],["Partner",`${a.nobleGas} :: e${a.partnerIndex}`]]),document.querySelector("#period-states").innerHTML=H(o.map(l=>l.label)),document.querySelector("#connected-families").innerHTML=H(s,"linked")},b=()=>{const e=I(g.value),t=I(f.value),n=Se(e,t);document.querySelector("#left-label").textContent=e.label,document.querySelector("#right-label").textContent=t.label,document.querySelector("#left-meta").innerHTML=C([["Period",`P${e.period}`],["Layer",e.layer],["Targets",N(e)],["Partner",`${e.nobleGas} :: e${e.lowerIndex+8}`]]),document.querySelector("#right-meta").innerHTML=C([["Period",`P${t.period}`],["Layer",t.layer],["Targets",N(t)],["Partner",`${t.nobleGas} :: e${t.lowerIndex+8}`]]);const a=document.querySelector("#delta-badge");a.className=`delta-badge ${n.bond.tone}`,a.textContent=`Delta ${n.delta>=0?"+":""}${n.delta}`,document.querySelector("#bond-detail").textContent=`${n.bond.label} :: ${n.bond.detail}`,document.querySelector("#product-label").textContent=n.zeroDivisor?"A * B = 0":`A * B = ${n.productLabel}`,document.querySelector("#molecule-label").textContent=n.molecule.label,document.querySelector("#molecule-meta").innerHTML=C([["Norm",n.molecule.norm],["Canonical targets",n.moleculeCanonicalTargets],["Paper score",n.moleculePaperTargets],["Zero-divisor escape",n.zeroDivisor?"bond path available":"not forced"]]),document.querySelector("#target-list").innerHTML=H(x(e).map(l=>l.label),n.bond.tone);const o=[],s=n.moleculeTargets.map(l=>l.label);o.push(`<div><span>atom</span><strong>${N(e)}</strong></div>`),o.push(`<div><span>molecule</span><strong>${n.moleculePaperTargets}</strong></div>`),s.length?o.push(`<div><span>next target</span><strong>${s[0]}</strong></div>`):o.push("<div><span>next target</span><strong>none</strong></div>"),r&&(o.push(`<div><span>reference path</span><strong>${r.atomA.label} + ${r.atomB.label} -> ${r.atomC.label}</strong></div>`),o.push(`<div><span>reference score</span><strong>${r.molecule.paperTargets} -> ${r.superMolecule.paperTargets}</strong></div>`)),(e.isCdPartner||t.isCdPartner)&&o.push("<div><span>noble guard</span><strong>CD partner selected :: inert channel</strong></div>"),document.querySelector("#cascade-output").innerHTML=o.join(""),we(n),A.value=String(e.lowerIndex),te(e.lowerIndex)},Ne=()=>{const e=I(g.value),t=x(e);t.length&&(f.value=t[0].id,b())},Ee=()=>{r&&(g.value=r.atomA.id,f.value=r.atomB.id,b())},Be=()=>{_&&(g.value=_,f.value=ee,b())};for(const e of Z)e.addEventListener("click",()=>{const t=e.dataset.modeTab;Z.forEach(n=>n.classList.toggle("active",n===e)),Pe.forEach(n=>n.classList.toggle("active",n.dataset.modePanel===t))});g.addEventListener("change",b);f.addEventListener("change",b);Ce.addEventListener("click",Ne);Ie.addEventListener("click",Ee);Ae.addEventListener("click",Be);A.addEventListener("change",()=>te(Number(A.value)));b();
