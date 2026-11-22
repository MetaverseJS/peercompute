const l=()=>new DOMException("Voice audio cancelled","AbortError");function G(u,y){const g=Array.isArray(u)?u:[u?.x,u?.y,
u?.z];return g.every(I=>Number.isFinite(I)&&Math.abs(I)<=1e9)?g:y}function Y({getAudioPose:u=()=>({}),AudioContextImpl:y=globalThis.
AudioContext,AudioWorkletNodeImpl:g=globalThis.AudioWorkletNode,OfflineAudioContextImpl:I=globalThis.OfflineAudioContext,
mediaDevices:X=globalThis.navigator?.mediaDevices}={}){let i,A,m,C,d=!1;async function R(){if(d)throw new Error("Voice a\
udio is disposed");i??=new y({sampleRate:16e3}),await i.resume()}function T(e){clearTimeout(e.limitTimer),clearTimeout(e.
stopTimer);for(const n of e.stream?.getTracks()??[])n.stop();e.source?.disconnect(),e.node?.disconnect(),e.mute?.disconnect(),
e.node&&(e.node.port.onmessage=null,e.node.onprocessorerror=null),e.signal?.removeEventListener("abort",e.abort)}async function p(e,n,t){
if(!e.finished){if(e.finished=!0,T(e),t){e.reject(t);return}try{let o=n.samples;if(!(o instanceof Float32Array)||!Number.
isFinite(n.sampleRate)||n.sampleRate<8e3||n.sampleRate>192e3||o.length>n.sampleRate*20)throw new Error("Invalid micropho\
ne capture");if(n.sampleRate!==16e3&&o.length){const a=new I(1,Math.min(32e4,Math.floor(o.length*16e3/n.sampleRate)),16e3),
r=a.createBuffer(1,o.length,n.sampleRate);r.copyToChannel(o,0);const s=a.createBufferSource();s.buffer=r,s.connect(a.destination),
s.start(),o=new Float32Array((await a.startRendering()).getChannelData(0))}if(e.cancelled)throw l();if(e.resolve({samples:o,
sampleRate:16e3}),n.limited||e.limited)try{e.onLimit?.()}catch{}}catch(o){e.reject(o)}}}function V(e,n=!1){e.finished||e.
stopRequested||(e.stopRequested=!0,e.limited=n,e.stopTimer=setTimeout(()=>{p(e,null,new Error("Microphone processing sto\
pped responding; recording was discarded. Try again."))},2e3),e.node.port.postMessage("stop"))}async function W({signal:e,
onLimit:n}={}){if(e?.throwIfAborted(),m&&!m.finished)throw new Error("Microphone is already recording");const t={signal:e,
onLimit:n,finished:!1,cancelled:!1};t.promise=new Promise((o,a)=>{t.resolve=o,t.reject=a}),t.promise.catch(()=>{}),m=t,t.
abort=()=>{t.cancelled=!0,p(t,null,l())},e?.addEventListener("abort",t.abort,{once:!0});try{if(await Promise.race([R(),t.
promise]),e?.throwIfAborted(),t.finished||d)throw l();if(!X?.getUserMedia)throw new Error("Microphone capture requires H\
TTPS and browser microphone support");const o=X.getUserMedia({audio:{channelCount:1,echoCancellation:!0,noiseSuppression:!0},
video:!1});o.then(r=>{if(t.cancelled||d)for(const s of r.getTracks())s.stop()},()=>{});const a=await Promise.race([o,t.promise]);
if(t.finished||d){for(const r of a.getTracks())r.stop();throw l()}if(t.stream=a,A??=i.audioWorklet.addModule(new URL("da\
ta:text/javascript;base64,Ly8gTG9jYWwgbWljcm9waG9uZSBQQ00gb25seS4gTmV2ZXIgc2VuZHMgc2FtcGxlcyBvdmVyIHRoZSBuZXR3b3JrLgpjbG\
FzcyBXb3JsZE1pY3JvcGhvbmVDYXB0dXJlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29yIHsKICBjb25zdHJ1Y3RvcigpIHsKICAgIHN1cGVyKCk7Ci\
AgICB0aGlzLnNhbXBsZXMgPSBuZXcgRmxvYXQzMkFycmF5KE1hdGguY2VpbChzYW1wbGVSYXRlICogMjApKTsKICAgIHRoaXMubGVuZ3RoID0gMDsgdGhpcy\
5kb25lID0gZmFsc2U7CiAgICB0aGlzLnBvcnQub25tZXNzYWdlID0gKHsgZGF0YSB9KSA9PiB7IGlmIChkYXRhID09PSAnc3RvcCcpIHRoaXMuZmluaXNoKG\
ZhbHNlKTsgfTsKICB9CiAgZmluaXNoKGxpbWl0ZWQpIHsKICAgIGlmICh0aGlzLmRvbmUpIHJldHVybjsKICAgIHRoaXMuZG9uZSA9IHRydWU7CiAgICBjb2\
5zdCBzYW1wbGVzID0gdGhpcy5zYW1wbGVzLnNsaWNlKDAsIHRoaXMubGVuZ3RoKTsgdGhpcy5zYW1wbGVzID0gbnVsbDsKICAgIHRoaXMucG9ydC5wb3N0TW\
Vzc2FnZSh7IHNhbXBsZXMsIHNhbXBsZVJhdGUsIGxpbWl0ZWQgfSwgW3NhbXBsZXMuYnVmZmVyXSk7CiAgfQogIHByb2Nlc3MoaW5wdXRzKSB7CiAgICBpZi\
AodGhpcy5kb25lKSByZXR1cm4gZmFsc2U7CiAgICBjb25zdCBjaGFubmVscyA9IGlucHV0c1swXTsKICAgIGlmICghY2hhbm5lbHM/Lmxlbmd0aCkgcmV0dX\
JuIHRydWU7CiAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1pbihjaGFubmVsc1swXS5sZW5ndGgsIHRoaXMuc2FtcGxlcy5sZW5ndGggLSB0aGlzLmxlbmd0aC\
k7CiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7CiAgICAgIGxldCB2YWx1ZSA9IDA7CiAgICAgIGZvciAoY29uc3\
QgY2hhbm5lbCBvZiBjaGFubmVscykgdmFsdWUgKz0gY2hhbm5lbFtpbmRleF0gfHwgMDsKICAgICAgdGhpcy5zYW1wbGVzW3RoaXMubGVuZ3RoKytdID0gTW\
F0aC5tYXgoLTEsIE1hdGgubWluKDEsIHZhbHVlIC8gY2hhbm5lbHMubGVuZ3RoKSk7CiAgICB9CiAgICBpZiAodGhpcy5sZW5ndGggPT09IHRoaXMuc2FtcG\
xlcy5sZW5ndGgpIHRoaXMuZmluaXNoKHRydWUpOwogICAgcmV0dXJuICF0aGlzLmRvbmU7CiAgfQp9CnJlZ2lzdGVyUHJvY2Vzc29yKCd3b3JsZC1taWNyb3\
Bob25lLWNhcHR1cmUnLCBXb3JsZE1pY3JvcGhvbmVDYXB0dXJlKTsK",import.meta.url)).catch(r=>{throw A=null,r}),await Promise.race(
[A,t.promise]),t.finished||d)throw l();t.node=new g(i,"world-microphone-capture",{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[
1]}),t.node.port.onmessage=({data:r})=>{p(t,r)},t.node.onprocessorerror=()=>{p(t,null,new Error("Microphone processing f\
ailed. Try again."))},t.source=i.createMediaStreamSource(a),t.mute=i.createGain(),t.mute.gain.value=0,t.source.connect(t.
node),t.node.connect(t.mute),t.mute.connect(i.destination),t.limitTimer=setTimeout(()=>V(t,!0),2e4)}catch(o){throw await p(
t,null,o),o}}async function K(){const e=m;if(!e)throw new Error("Microphone has not been started");return e.finished||(e.
node?V(e):(e.cancelled=!0,await p(e,null,l()))),e.promise}async function M(){const e=m;e&&(e.cancelled=!0,await p(e,null,
l()),await e.promise.catch(()=>{}))}function Z(){C?.stop()}async function z({audio:e,sampleRate:n},{key:t,signal:o}={}){
if(o?.throwIfAborted(),!(e instanceof Float32Array)||!Number.isFinite(n)||n<8e3||n>96e3||!e.length||e.length>n*30)throw new Error(
"Invalid bounded speech PCM");for(const c of e)if(!Number.isFinite(c)||Math.abs(c)>10)throw new Error("Invalid speech sa\
mple");await R(),o?.throwIfAborted(),Z();const a=i.createBuffer(1,e.length,n);a.copyToChannel(e,0);const r=i.createBufferSource(),
s=i.createPanner();r.buffer=a,s.panningModel="HRTF",s.distanceModel="inverse",s.refDistance=2,s.maxDistance=100;let v;const H=()=>{
const c=u(t)??{},B=G(c.position??c.source,[0,0,0]),b=G(c.listenerPosition??c.listener,[0,0,0]),w=G(c.listenerForward??c.
forward,[0,0,-1]),h=G(c.listenerUp??c.up,[0,1,0]);s.setPosition(...B),i.listener.setPosition(...b),i.listener.setOrientation(
...w,...h)};return H(),r.connect(s),s.connect(i.destination),new Promise((c,B)=>{const b={stop:()=>h(l())};let w=!1;const h=f=>{
if(!w){w=!0,clearInterval(v),o?.removeEventListener("abort",b.stop),r.onended=null;try{r.stop()}catch{}r.disconnect(),s.
disconnect(),C===b&&(C=null),f?B(f):c()}};C=b,r.onended=()=>h(),o?.addEventListener("abort",b.stop,{once:!0}),v=setInterval(
()=>{try{H()}catch(f){h(f)}},100);try{o?.aborted?h(l()):r.start()}catch(f){h(f)}})}return{unlock:R,startRecording:W,stopRecording:K,
cancelRecording:M,play:z,stopPlayback:Z,async dispose(){d||(d=!0,await M(),Z(),await i?.close())}}}export{Y as createWorldAudio};
