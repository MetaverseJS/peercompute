import test from 'node:test';
import assert from 'node:assert/strict';
import { createVoiceSession, voiceTarget } from '../shared/inference/VoiceSession.js';
import { speechChunks } from '../../peercompute/src/peercompute/inference/speech/chunks.js';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
function fixture({ holdPermission = false, holdExecute = false, holdPlay = false } = {}) {
  const calls = [], states = [], requests = [];
  let finishPermission, finishExecution, finishPlay, captureSignal;
  const audio = {
    async startRecording({signal,onLimit}) { calls.push('capture-start'); captureSignal=signal; audio.limit=onLimit;
      if(holdPermission) await new Promise((resolve,reject)=>{finishPermission=resolve;signal.addEventListener('abort',()=>reject(signal.reason),{once:true});});
      signal.throwIfAborted(); calls.push('microphone-owned'); },
    async stopRecording(){calls.push('capture-stop');return {samples:new Float32Array(1600).fill(.25),sampleRate:16000};},
    async cancelRecording(){calls.push('capture-clean');},
    async play(result,{signal}){calls.push('play');assert(result.audio instanceof Float32Array);
      if(holdPlay)await new Promise((resolve,reject)=>{finishPlay=resolve;signal.addEventListener('abort',()=>reject(signal.reason),{once:true});});},
    stopPlayback(){calls.push('play-clean');}, async dispose(){calls.push('audio-dispose');},
  };
  const execute=async(target,input)=>{requests.push({target,input});calls.push(input.task);
    if(holdExecute)await new Promise((resolve,reject)=>{finishExecution=resolve;input.signal.addEventListener('abort',()=>reject(input.signal.reason),{once:true});});
    input.signal.throwIfAborted();return input.task==='automatic-speech-recognition'?{text:'Describe the picture.',route:{local:false}}:
      {text:'',audio:new Float32Array(1600),sampleRate:16000};};
  const session=createVoiceSession({audio,execute});
  return {session,audio,calls,requests,states,onState:s=>states.push(s.status),
    get captureSignal(){return captureSignal;},finishPermission:()=>finishPermission?.(),finishExecution:()=>finishExecution?.(),finishPlay:()=>finishPlay?.()};
}

test('voice stages preserve locality policy instead of sending audio to a text model',()=>{
  assert.equal(voiceTarget('local:model'),'local-only');assert.equal(voiceTarget('local'),'local-only');
  assert.equal(voiceTarget('peer:model'),'mixed');assert.equal(voiceTarget('mixed'),'mixed');
  assert.equal(voiceTarget('peers-only'),'peers-only');assert.throws(()=>voiceTarget('unknown'));
});

test('explicit capture, stop and ASR use bounded owned PCM and an independent request identity',async()=>{
  const f=fixture();assert.deepEqual(f.calls,[]);
  const recording=f.session.record({target:'mixed',onState:f.onState});await tick();
  assert.equal(f.session.getState().recording,true);assert.equal(f.requests.length,0);
  assert.equal(f.session.stop(),true);const result=await recording;
  assert.equal(result.text,'Describe the picture.');assert.equal(f.requests.length,1);
  assert.equal(f.requests[0].target,'mixed');assert.equal(f.requests[0].input.task,'automatic-speech-recognition');
  assert.equal(f.requests[0].input.audio.sampleRate,16000);assert.equal(f.requests[0].input.audio.samples.length,1600);
  assert.match(f.requests[0].input.requestId,/^[a-f0-9-]{36}$/);
  assert.deepEqual(f.states,['requesting-microphone','recording','transcribing','idle']);
  assert.equal(f.calls.at(-1),'capture-clean');await f.session.dispose();
});

test('microphone time limit completes recording and an immediate stop is retained during permission',async()=>{
  const early=fixture();const earlyRecording=early.session.record();assert.equal(early.session.stop(),true);
  await earlyRecording;await early.session.dispose();
  const f=fixture({holdPermission:true});const recording=f.session.record({onState:f.onState});await tick();
  assert.equal(f.session.stop(),true);f.finishPermission();await recording;assert.equal(f.requests.length,1);await f.session.dispose();
  const g=fixture();const auto=g.session.record();await tick();g.audio.limit();await auto;
  assert.equal(g.requests.length,1);await g.session.dispose();
});

test('one turn signal cancels permission or ASR and no later stage starts',async()=>{
  for(const during of ['permission','asr']){
    const f=fixture({holdPermission:during==='permission',holdExecute:during==='asr'}),controller=new AbortController();
    const operation=f.session.record({signal:controller.signal});operation.catch(()=>{});await tick();
    if(during==='asr'){f.session.stop();await tick();assert.equal(f.requests.length,1);}
    controller.abort(new DOMException('User stopped','AbortError'));await assert.rejects(operation,{name:'AbortError'});
    assert.equal(f.session.getState().status,'idle');assert(f.calls.includes('capture-clean'));
    assert.equal(f.requests.length,during==='asr'?1:0);await f.session.dispose();
  }
});

test('speech is split without truncation and playback is sequential with fresh request IDs',async()=>{
  const f=fixture();const text='Hello there. '+('A long sentence with words '.repeat(25))+'Done!';
  const chunks=speechChunks(text);assert(chunks.length>2);
  const result=await f.session.speak(text,{target:'local:language',onState:f.onState});
  assert.equal(result.completedChunks,chunks.length);assert.deepEqual(f.requests.map(r=>r.input.prompt),chunks);
  assert(f.requests.every(r=>r.target==='local-only'&&r.input.task==='text-to-speech'));
  assert.equal(new Set(f.requests.map(r=>r.input.requestId)).size,chunks.length);
  assert.equal(f.calls.filter(c=>c==='play').length,chunks.length);assert.equal(f.calls.at(-1),'play-clean');
  await f.session.dispose();
});

test('cancelled playback cannot advance to another sentence, and the session remains reusable',async()=>{
  const f=fixture({holdPlay:true});const speaking=f.session.speak('First sentence. Second sentence.');speaking.catch(()=>{});
  await tick();assert.equal(f.requests.length,1);assert.equal(f.session.getState().status,'playing');
  await f.session.cancel();await assert.rejects(speaking,{name:'AbortError'});
  assert.equal(f.requests.length,1);assert.equal(f.session.getState().status,'idle');
  const next=f.session.speak('Next.');await tick();f.finishPlay();await next;await f.session.dispose();
});

test('overlapping work is rejected and disposal cancels outstanding ownership before closing audio',async()=>{
  const f=fixture({holdPermission:true}),recording=f.session.record();recording.catch(()=>{});await tick();
  await assert.rejects(f.session.speak('Overlap'),/already active/);
  await f.session.dispose();await assert.rejects(recording,{name:'AbortError'});
  assert.equal(f.calls.at(-1),'audio-dispose');assert.equal(f.session.getState().status,'closed');
  await assert.rejects(f.session.record(),/disposed/);
});

test('empty transcription remains an error and UI observer exceptions do not strand audio',async()=>{
  const f=fixture();const s=createVoiceSession({audio:f.audio,execute:async()=>({text:' '})});
  const recording=s.record({onState(){throw new Error('UI detached');}});recording.catch(()=>{});await tick();s.stop();
  await assert.rejects(recording,/No speech recognized/);assert.equal(s.getState().status,'idle');
  assert(f.calls.includes('capture-clean'));await s.dispose();await f.session.dispose();
});

test('Unicode chunking obeys codepoint limit and rejects an invalid limit',()=>{
  const text='🐕'.repeat(600);assert.deepEqual(speechChunks(text).map(x=>[...x].length),[256,256,88]);
  assert.equal(speechChunks(text).join(''),text);assert.throws(()=>speechChunks(text,0));
});

test('failed audio disposal can be retried while the session stays closed', async () => {
  const f=fixture();let attempts=0;
  f.audio.dispose=async()=>{if(++attempts===1)throw new Error('AudioContext close failed');};
  await assert.rejects(f.session.dispose(),/disposal is incomplete/);
  await assert.rejects(f.session.record(),/disposed/);
  await f.session.dispose();assert.equal(attempts,2);
  assert.equal(f.session.getState().status,'closed');
});
