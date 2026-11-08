// Local microphone PCM only. Never sends samples over the network.
class WorldMicrophoneCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.samples = new Float32Array(Math.ceil(sampleRate * 20));
    this.length = 0; this.done = false;
    this.port.onmessage = ({ data }) => { if (data === 'stop') this.finish(false); };
  }
  finish(limited) {
    if (this.done) return;
    this.done = true;
    const samples = this.samples.slice(0, this.length); this.samples = null;
    this.port.postMessage({ samples, sampleRate, limited }, [samples.buffer]);
  }
  process(inputs) {
    if (this.done) return false;
    const channels = inputs[0];
    if (!channels?.length) return true;
    const length = Math.min(channels[0].length, this.samples.length - this.length);
    for (let index = 0; index < length; index++) {
      let value = 0;
      for (const channel of channels) value += channel[index] || 0;
      this.samples[this.length++] = Math.max(-1, Math.min(1, value / channels.length));
    }
    if (this.length === this.samples.length) this.finish(true);
    return !this.done;
  }
}
registerProcessor('world-microphone-capture', WorldMicrophoneCapture);
