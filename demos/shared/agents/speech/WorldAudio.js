const abortError = () => new DOMException('Voice audio cancelled', 'AbortError');
function vector(value, fallback) {
  const values = Array.isArray(value) ? value : [value?.x, value?.y, value?.z];
  return values.every((item) => Number.isFinite(item) && Math.abs(item) <= 1e9) ? values : fallback;
}
/** Owns only its microphone tracks, PCM nodes and AudioContext; no browser speech/cloud APIs. */
export function createWorldAudio({ getAudioPose = () => ({}),
  AudioContextImpl = globalThis.AudioContext, AudioWorkletNodeImpl = globalThis.AudioWorkletNode,
  OfflineAudioContextImpl = globalThis.OfflineAudioContext,
  mediaDevices = globalThis.navigator?.mediaDevices } = {}) {
  let context, moduleReady, capture, playback, closed = false;
  async function unlock() {
    if (closed) throw new Error('Voice audio is disposed');
    context ??= new AudioContextImpl({ sampleRate: 16000 });
    await context.resume();
  }
  function stopTracks(record) {
    clearTimeout(record.limitTimer); clearTimeout(record.stopTimer);
    for (const track of record.stream?.getTracks() ?? []) track.stop();
    record.source?.disconnect(); record.node?.disconnect(); record.mute?.disconnect();
    if (record.node) { record.node.port.onmessage = null; record.node.onprocessorerror = null; }
    record.signal?.removeEventListener('abort', record.abort);
  }
  async function finish(record, message, error) {
    if (record.finished) return;
    record.finished = true; stopTracks(record);
    if (error) { record.reject(error); return; }
    try {
      let samples = message.samples;
      if (!(samples instanceof Float32Array) || !Number.isFinite(message.sampleRate)
          || message.sampleRate < 8000 || message.sampleRate > 192000
          || samples.length > message.sampleRate * 20) throw new Error('Invalid microphone capture');
      if (message.sampleRate !== 16000 && samples.length) {
        const offline = new OfflineAudioContextImpl(1, Math.min(320000, Math.floor(samples.length * 16000 / message.sampleRate)), 16000);
        const buffer = offline.createBuffer(1, samples.length, message.sampleRate); buffer.copyToChannel(samples, 0);
        const source = offline.createBufferSource(); source.buffer = buffer; source.connect(offline.destination); source.start();
        samples = new Float32Array((await offline.startRendering()).getChannelData(0));
      }
      if (record.cancelled) throw abortError();
      record.resolve({ samples, sampleRate: 16000 });
      if (message.limited || record.limited) { try { record.onLimit?.(); } catch { /* UI callback does not own capture cleanup. */ } }
    } catch (failure) { record.reject(failure); }
  }
  function requestStop(record, limited = false) {
    if (record.finished || record.stopRequested) return;
    record.stopRequested = true; record.limited = limited;
    // A suspended or failed worklet must not keep microphone ownership forever.
    record.stopTimer = setTimeout(() => { void finish(record, null,
      new Error('Microphone processing stopped responding; recording was discarded. Try again.')); }, 2000);
    record.node.port.postMessage('stop');
  }
  async function startRecording({ signal, onLimit } = {}) {
    signal?.throwIfAborted();
    if (capture && !capture.finished) throw new Error('Microphone is already recording');
    const record = { signal, onLimit, finished: false, cancelled: false };
    record.promise = new Promise((resolve, reject) => { record.resolve = resolve; record.reject = reject; });
    record.promise.catch(() => {}); capture = record;
    record.abort = () => { record.cancelled = true; void finish(record, null, abortError()); };
    signal?.addEventListener('abort', record.abort, { once: true });
    try {
      // Mobile autoplay policy can leave resume pending until a later gesture.
      // Releasing Talk must still settle startup and free the next recording.
      await Promise.race([unlock(), record.promise]); signal?.throwIfAborted();
      if (record.finished || closed) throw abortError();
      if (!mediaDevices?.getUserMedia) throw new Error('Microphone capture requires HTTPS and browser microphone support');
      // If the permission prompt outlives cancellation, stop its late-granted tracks.
      const granted = mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }, video: false });
      granted.then((late) => { if (record.cancelled || closed) for (const track of late.getTracks()) track.stop(); }, () => {});
      const stream = await Promise.race([granted, record.promise]);
      if (record.finished || closed) { for (const track of stream.getTracks()) track.stop(); throw abortError(); }
      record.stream = stream;
      moduleReady ??= context.audioWorklet.addModule(new URL('./captureProcessor.js', import.meta.url)).catch((error) => { moduleReady = null; throw error; });
      await Promise.race([moduleReady, record.promise]);
      if (record.finished || closed) throw abortError();
      record.node = new AudioWorkletNodeImpl(context, 'world-microphone-capture', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1] });
      record.node.port.onmessage = ({ data }) => { void finish(record, data); };
      record.node.onprocessorerror = () => { void finish(record, null, new Error('Microphone processing failed. Try again.')); };
      record.source = context.createMediaStreamSource(stream); record.mute = context.createGain(); record.mute.gain.value = 0;
      record.source.connect(record.node); record.node.connect(record.mute); record.mute.connect(context.destination);
      record.limitTimer = setTimeout(() => requestStop(record, true), 20000);
    } catch (error) { await finish(record, null, error); throw error; }
  }
  async function stopRecording() {
    const record = capture;
    if (!record) throw new Error('Microphone has not been started');
    if (!record.finished) {
      if (!record.node) { record.cancelled = true; await finish(record, null, abortError()); }
      else requestStop(record);
    }
    return record.promise;
  }
  async function cancelRecording() {
    const record = capture;
    if (!record) return;
    record.cancelled = true;
    await finish(record, null, abortError());
    await record.promise.catch(() => {});
  }
  function stopPlayback() { playback?.stop(); }
  async function play({ audio, sampleRate }, { key, signal } = {}) {
    signal?.throwIfAborted();
    if (!(audio instanceof Float32Array) || !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 96000
        || !audio.length || audio.length > sampleRate * 30) throw new Error('Invalid bounded speech PCM');
    for (const value of audio) if (!Number.isFinite(value) || Math.abs(value) > 10) throw new Error('Invalid speech sample');
    await unlock(); signal?.throwIfAborted(); stopPlayback();
    const buffer = context.createBuffer(1, audio.length, sampleRate); buffer.copyToChannel(audio, 0);
    const source = context.createBufferSource(), panner = context.createPanner(); source.buffer = buffer;
    panner.panningModel = 'HRTF'; panner.distanceModel = 'inverse'; panner.refDistance = 2; panner.maxDistance = 100;
    let timer;
    const update = () => {
      const pose = getAudioPose(key) ?? {};
      const position = vector(pose.position ?? pose.source, [0, 0, 0]), listener = vector(pose.listenerPosition ?? pose.listener, [0, 0, 0]);
      const forward = vector(pose.listenerForward ?? pose.forward, [0, 0, -1]), up = vector(pose.listenerUp ?? pose.up, [0, 1, 0]);
      panner.setPosition(...position); context.listener.setPosition(...listener); context.listener.setOrientation(...forward, ...up);
    };
    update(); source.connect(panner); panner.connect(context.destination);
    return new Promise((resolve, reject) => {
      const entry = { stop: () => finish(abortError()) }; let ended = false;
      const finish = (error) => {
        if (ended) return; ended = true; clearInterval(timer);
        signal?.removeEventListener('abort', entry.stop); source.onended = null;
        try { source.stop(); } catch { /* Already ended. */ } source.disconnect(); panner.disconnect();
        if (playback === entry) playback = null;
        if (error) reject(error); else resolve();
      };
      playback = entry; source.onended = () => finish(); signal?.addEventListener('abort', entry.stop, { once: true });
      timer = setInterval(() => { try { update(); } catch (error) { finish(error); } }, 100);
      try { if (signal?.aborted) finish(abortError()); else source.start(); }
      catch (error) { finish(error); }
    });
  }
  return { unlock, startRecording, stopRecording, cancelRecording, play, stopPlayback,
    async dispose() { if (closed) return; closed = true; await cancelRecording(); stopPlayback(); await context?.close(); },
  };
}
