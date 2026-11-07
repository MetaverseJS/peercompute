import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldSpeech } from '../shared/agents/speech/WorldSpeech.js';
import { SPEECH_MODEL_CATALOG } from '../../peercompute/src/peercompute/inference/speech/speechCatalog.js';
import { validateSpeechManifest } from '../../peercompute/src/peercompute/inference/speech/runtimeDefinition.js';
const cid = 'bafkreiglh4rfdrjhf2xk7id7ggyvbm7qmxd5vg6q3j7mxkeu7mnckgf7w4';
function fixture({ delayLoad = false } = {}) {
  let useCount = 0, created = 0, finish;
  const registered = new Map();
  const runtime = { runtimeAssets: {},
    store: {
      async *list() { for (const entry of Object.values(SPEECH_MODEL_CATALOG)) yield {
        cid, kind: 'manifest', status: 'complete', pinned: true,
        manifest: { schema: 'peercompute.artifact.manifest.v1', model: entry.model, files: entry.files.map((file) => ({ ...file, cid })) },
      }; },
      async acquireUse() { useCount++; let released = false; return () => { if (!released) { released = true; useCount--; } }; },
    },
    computeManager: { async createModelInferenceService(options) {
      assert.equal(options.runtime, 'transformers-speech'); assert.equal(options.resourceBudgets, undefined); created++;
      let state = 'idle', manifestCid = null;
      return { getStatus: () => ({ status: state, manifestCid }),
        async loadModel({ signal, manifestCid: cid }) { state = 'loading';
          if (delayLoad) await new Promise((resolve, reject) => { finish = resolve; signal.addEventListener('abort', () => { state = 'idle'; reject(signal.reason); }, { once: true }); });
          signal?.throwIfAborted(); manifestCid = cid; state = 'ready'; },
        async unloadModel() { state = 'idle'; manifestCid = null; },
        async dispose() { await this.unloadModel(); state = 'closed'; },
        async generate(input) { input.signal?.throwIfAborted(); return input.audio ? { text: 'hello' } : { audio: new Float32Array(100), sampleRate: 44100 }; },
      };
    } },
    registerAuxiliaryService(id, service) { registered.set(id, service); return () => { assert(['idle', 'closed'].includes(service.getStatus().status)); registered.delete(id); }; },
  };
  return { runtime, registered, get useCount() { return useCount; }, get created() { return created; }, finish: () => finish?.() };
}
test('cached prepare reuses packages and keeps per-model use locks until acknowledged unload', async () => {
  const f = fixture(), controller = new AbortController();
  const speech = createWorldSpeech({ runtime: f.runtime, fetchImpl: () => { throw new Error('Unexpected weight fetch'); } });
  assert.equal((await speech.prepare({ signal: controller.signal })).status, 'ready');
  controller.abort(); assert.equal(f.useCount, 2);
  await speech.prepare(); assert.equal(f.created, 2);
  const first = [...f.registered.values()][0]; await first.unloadModel(); assert.equal(f.useCount, 1);
  await speech.dispose(); assert.equal(f.useCount, 0); assert.equal(f.registered.size, 0);
});
test('dispose aborts pending preparation and waits for use-lease cleanup', async () => {
  const f = fixture({ delayLoad: true }), speech = createWorldSpeech({ runtime: f.runtime });
  const loading = speech.prepare(); loading.catch(() => {});
  while (!f.useCount) await new Promise((resolve) => setTimeout(resolve, 0));
  await speech.dispose(); await assert.rejects(loading);
  assert.equal(f.useCount, 0); assert.equal(f.registered.size, 0);
  await assert.rejects(speech.prepare(), /disposed/);
});
test('download adapter binds each pinned package and file before requesting source bytes', async () => {
  const f = fixture(); let observed = false;
  f.runtime.store.list = async function* () {};
  f.runtime.store.withRetention = (callback) => callback({ async importFile(source) { for await (const chunk of source) void chunk; } });
  const speech = createWorldSpeech({ runtime: f.runtime, sourceUrl(entry, file) {
    assert.equal(entry.id, 'moonshine-tiny-fp32');
    assert.equal(file.path, 'onnx/encoder_model.onnx');
    assert.equal(file.sha256.length, 64); observed = true;
    throw new Error('Intentional source stop');
  } });
  await assert.rejects(speech.prepare(), /Intentional source stop/);
  assert.equal(observed, true); await speech.dispose();
});
test('new speech imports contain only valid artifact manifest fields and pinned model closure', async () => {
  const f = fixture(); let imported = 0;
  f.runtime.store.list = async function* () {};
  f.runtime.store.withRetention = (callback) => callback({
    async importFile(source, options) { return { cid, size: options.expectedSize, sha256: options.expectedSha256 }; },
    async importManifest(manifest) { validateSpeechManifest(manifest); imported++; return { cid, manifest }; },
  });
  const speech = createWorldSpeech({ runtime: f.runtime }); await speech.prepare();
  assert.equal(imported, 2); await speech.dispose();
});

function pooledFixture({ preloaded = [], failLoad, pending = false, duplicateComplete = false } = {}) {
  const f = fixture(), entries=Object.values(SPEECH_MODEL_CATALOG), residents=new Map(), loads=[], unloads=[];
  const records=entries.map((entry,index)=>({cid:index===0?cid:'bafkreidjduwq3zpyr64exsixki3mnmc7dpo6brmiv4kugutmnifokzimqm',
    kind:'manifest',status:'complete',pinned:true,
    manifest:{schema:'peercompute.artifact.manifest.v1',model:entry.model,files:entry.files.map(file=>({...file,cid}))}}));
  const make=(root)=>({getStatus:()=>({status:'ready',manifestCid:root}),async generate(input){return input.audio?{text:'pooled speech'}:{audio:new Float32Array(1600),sampleRate:16000};}});
  for(const index of preloaded)residents.set(records[index].cid,make(records[index].cid));
  f.runtime.store.list=async function*(){
    if(pending||duplicateComplete)yield {...records[0],status:'partial',retain:true};
    for(const [index,record] of records.entries())if(!pending||index!==0)yield record;
  };
  f.runtime.getServiceForModel=root=>residents.get(root);
  f.runtime.loadStoredModel=async(root,{signal}={})=>{signal?.throwIfAborted();loads.push(root);if(root===records[failLoad]?.cid)throw new Error('Aggregate capacity exhausted');residents.set(root,make(root));};
  f.runtime.unload=async(root)=>{unloads.push(root);residents.delete(root);};
  f.runtime.store.withRetention=()=>{throw new Error('Unexpected download');};
  return {...f,runtime:f.runtime,entries,records,residents,loads,unloads};
}

test('world speech shares preloaded console residents and releases only speech it added',async()=>{
  const f=pooledFixture({preloaded:[0]}),speech=createWorldSpeech({runtime:f.runtime});
  await speech.prepare();assert.deepEqual(f.loads,[f.records[1].cid]);assert.equal(f.registered.size,0);
  assert.equal((await speech.transcribe({samples:new Float32Array(1600),sampleRate:16000})).text,'pooled speech');
  await speech.prepare();assert.equal(f.loads.length,1);await speech.dispose();
  assert.deepEqual(f.unloads,[f.records[1].cid]);assert(f.residents.has(f.records[0].cid));
});

test('pooled speech capacity rejection leaves an existing console model resident',async()=>{
  const f=pooledFixture({preloaded:[0],failLoad:1}),speech=createWorldSpeech({runtime:f.runtime});
  await assert.rejects(speech.prepare(),/capacity/);assert(f.residents.has(f.records[0].cid));
  assert(!f.unloads.includes(f.records[0].cid));await speech.dispose();assert(f.residents.has(f.records[0].cid));
});

test('pending retained speech requires explicit local recovery and never downloads again',async()=>{
  const f=pooledFixture({pending:true}),speech=createWorldSpeech({runtime:f.runtime});
  await assert.rejects(speech.prepare(),{code:'ERR_MODEL_VERIFICATION_REQUIRED'});
  assert.deepEqual(f.loads,[]);await speech.dispose();
  const complete=pooledFixture({duplicateComplete:true}),reused=createWorldSpeech({runtime:complete.runtime});
  await reused.prepare();assert.equal(complete.loads.length,2);await reused.dispose();
});

test('manual pooled unload is visible and preparing again loads only the missing voice',async()=>{
  const f=pooledFixture({preloaded:[0,1]}),speech=createWorldSpeech({runtime:f.runtime});
  await speech.prepare();assert.equal(f.loads.length,0);assert.equal(speech.getStatus().status,'ready');
  await f.runtime.unload(f.records[0].cid);assert.equal(speech.getStatus().status,'idle');
  await assert.rejects(speech.transcribe({samples:new Float32Array(1600),sampleRate:16000}),/prepare voice/);
  await speech.prepare();assert.deepEqual(f.loads,[f.records[0].cid]);await speech.dispose();
  assert(f.residents.has(f.records[1].cid));
});

test('voice preparation never adopts or unloads another caller\'s in-progress resident', async () => {
  const f=pooledFixture(), root=f.records[0].cid;
  const other={getStatus:()=>({status:'loading',manifestCid:root,sessionId:'other'})};
  f.residents.set(root,other);
  const speech=createWorldSpeech({runtime:f.runtime});
  await assert.rejects(speech.prepare(),/already loading/);
  await speech.dispose();assert.deepEqual(f.loads,[]);assert.deepEqual(f.unloads,[]);
  assert.equal(f.residents.get(root),other);
});

test('voice cleanup preserves a user replacement of the same CID, with or without reprepare', async () => {
  for(const reprepare of [false,true]) {
    const f=pooledFixture(),speech=createWorldSpeech({runtime:f.runtime});
    await speech.prepare();const root=f.records[0].cid;
    await f.runtime.unload(root);await f.runtime.loadStoredModel(root);
    const replacement=f.residents.get(root);f.unloads.length=0;
    if(reprepare)await speech.prepare();
    await speech.dispose();assert.equal(f.residents.get(root),replacement);
    assert.deepEqual(f.unloads,[f.records[1].cid]);
  }
});
