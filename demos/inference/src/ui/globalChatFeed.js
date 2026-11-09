import { createGeneratedImageRenderer } from './generatedImages.js';

const MAX_TEXT_BYTES = 64 * 1024, MAX_AUDIO_PREVIEWS = 8, MAX_AUDIO_BYTES = 16 * 1024 * 1024;
const encoder = new TextEncoder();
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
function boundedText(value, maximum, label, { empty = true } = {}) {
  if (typeof value !== 'string' || (!empty && !value) || value.length > maximum || encoder.encode(value).length > maximum) {
    throw new TypeError(`Invalid Global ${label}`);
  }
  return value;
}
function validate(event) {
  if (!event || !['prompt', 'result', 'error', 'audio'].includes(event.phase)) throw new TypeError('Invalid Global phase');
  boundedText(event.peerId, 256, 'peer', { empty: false });
  if (typeof event.turnId !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(event.turnId)) throw new TypeError('Invalid Global turn');
  boundedText(event.name, 80, 'name', { empty: false }); boundedText(event.text ?? '', MAX_TEXT_BYTES, 'text');
  if (event.modelName !== undefined) boundedText(event.modelName, 256, 'model name');
  if (event.image !== undefined) {
    const { width, height, channels, data } = event.image ?? {};
    if (!['prompt', 'result'].includes(event.phase) || !Number.isSafeInteger(width) || !Number.isSafeInteger(height)
        || width < 1 || height < 1 || width > 1024 || height > 1024 || width * height > 1024 ** 2
        || channels !== 4 || !(data instanceof Uint8Array) || data.byteLength !== width * height * 4) throw new TypeError('Invalid Global image');
  }
  if (event.phase === 'audio') {
    const { samples, sampleRate } = event.audio ?? {};
    if (!Number.isSafeInteger(event.part) || event.part < 0 || event.part > 1023 || !(samples instanceof Float32Array)
        || !Number.isSafeInteger(sampleRate) || sampleRate < 8000 || sampleRate > 48000
        || !samples.length || samples.length > sampleRate * 30) throw new TypeError('Invalid Global audio');
    for (const sample of samples) if (!Number.isFinite(sample) || Math.abs(sample) > 10) throw new TypeError('Invalid Global audio sample');
  } else if (event.audio !== undefined) throw new TypeError('Audio requires a Global audio event');
}
function audioBlob({ samples, sampleRate }) {
  const buffer = new ArrayBuffer(44 + samples.length * 2), view = new DataView(buffer);
  const ascii = (offset, value) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
  ascii(0, 'RIFF'); view.setUint32(4, buffer.byteLength - 8, true); ascii(8, 'WAVE'); ascii(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  ascii(36, 'data'); view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index++) {
    const sample = Math.max(-1, Math.min(1, samples[index])); view.setInt16(44 + index * 2, Math.round(sample * (sample < 0 ? 32768 : 32767)), true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

/** A presentation-only public feed. Events never become prompts, actions, or autoplay. */
export function createGlobalChatFeed({ transcript, empty, maxTurns = 60 } = {}) {
  if (!transcript?.append || !empty || !Number.isSafeInteger(maxTurns) || maxTurns < 1 || maxTurns > 200) throw new TypeError('A bounded Global transcript is required');
  const turns = new Map(), audioPreviews = new Map();
  const images = createGeneratedImageRenderer(transcript);
  let disposed = false, audioBytes = 0;
  function releaseAudio(audio, expired = false) {
    const preview = audioPreviews.get(audio); if (!preview) return;
    audio.pause(); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(preview.url);
    audioBytes -= preview.bytes; audioPreviews.delete(audio);
    if (expired && transcript.contains(audio)) audio.replaceWith(node('p', 'pc-global-media-note', 'Earlier speech preview released.'));
  }
  function releaseTurn(turn) {
    turn.controller.abort();
    for (const audio of [...audioPreviews.keys()]) if (turn.element.contains(audio)) releaseAudio(audio);
    turn.element.remove();
  }
  function prune() {
    while (turns.size > maxTurns) { const [key, turn] = turns.entries().next().value; releaseTurn(turn); turns.delete(key); }
    for (const audio of [...audioPreviews.keys()]) if (!transcript.contains(audio)) releaseAudio(audio);
    while (audioPreviews.size > MAX_AUDIO_PREVIEWS || audioBytes > MAX_AUDIO_BYTES) releaseAudio(audioPreviews.keys().next().value, true);
    images.prune();
  }
  function createTurn(event) {
    const element = node('section', 'pc-global-turn'); element.dataset.peerId = event.peerId; element.dataset.turnId = event.turnId;
    element.setAttribute('aria-label', `Global turn by ${event.name}`);
    const prompt = node('article', 'pc-chat-message pc-chat-message-user'); prompt.hidden = true;
    const author = node('span', 'pc-chat-speaker', event.name); author.title = event.peerId;
    const promptBody = node('p', '', ''); prompt.append(author, promptBody);
    const pending = node('p', 'pc-global-pending', 'Waiting for reply…'); pending.hidden = true;
    const result = node('article', 'pc-chat-message'); result.hidden = true;
    const model = node('span', 'pc-chat-speaker'), resultBody = node('p', '', ''); result.append(model, resultBody);
    const audioParts = node('div', 'pc-global-audio-parts');
    element.append(prompt, pending, result, audioParts); empty.remove(); transcript.append(element);
    return { element, prompt, author, promptBody, pending, result, model, resultBody, audioParts,
      phases: new Set(), parts: new Map(), seenParts: new Uint8Array(1024), controller: new AbortController() };
  }
  return {
    get size() { return turns.size; },
    async append(event) {
      if (disposed) return;
      validate(event);
      const key = `${event.peerId}\n${event.turnId}`;
      let turn = turns.get(key);
      if (!turn) { turn = createTurn(event); turns.set(key, turn); prune(); }
      if (event.phase === 'audio') {
        if (turn.seenParts[event.part]) return; turn.seenParts[event.part] = 1;
        const blob = audioBlob(event.audio), audio = node('audio', 'pc-global-audio');
        audio.controls = true; audio.autoplay = false; audio.preload = 'none'; audio.setAttribute('aria-label', `Speech for ${event.name}, part ${event.part + 1}`);
        const url = URL.createObjectURL(blob); audio.src = url; audioPreviews.set(audio, { url, bytes: blob.size }); audioBytes += blob.size;
        const part = node('div'); part.dataset.part = String(event.part); part.append(audio); turn.parts.set(event.part, part);
        for (const [, element] of [...turn.parts].sort(([a], [b]) => a - b)) turn.audioParts.append(element);
        while (turn.parts.size > 32) { const oldest = Math.min(...turn.parts.keys()); turn.parts.get(oldest).remove(); turn.parts.delete(oldest); }
        prune();
      } else {
        if (turn.phases.has(event.phase)) return;
        if (['result', 'error'].includes(event.phase) && (turn.phases.has('result') || turn.phases.has('error'))) return;
        turn.phases.add(event.phase);
        let body;
        if (event.phase === 'prompt') {
          turn.prompt.hidden = false; turn.author.textContent = event.name; turn.promptBody.textContent = event.text ?? '';
          turn.pending.hidden = turn.phases.has('result') || turn.phases.has('error'); body = turn.promptBody;
        } else {
          turn.pending.hidden = true; turn.result.hidden = false;
          turn.model.textContent = event.phase === 'error' ? `${event.name} · Request status` : `${event.modelName || 'Model'} · for ${event.name}`;
          turn.resultBody.textContent = event.text ?? ''; turn.result.classList.toggle('pc-global-error', event.phase === 'error'); body = turn.resultBody;
        }
        if (event.image) {
          try {
            const image = await images.append(body, event.image, { signal: turn.controller.signal, prompt: event.text ?? '' });
            if (event.phase === 'prompt') { image.alt = `Image attached by ${event.name}`; image.className = 'pc-chat-image'; }
          } catch (error) {
            if (error?.name !== 'AbortError' && !disposed && turns.get(key) === turn) body.after(node('p', 'pc-global-media-note', 'Image preview unavailable.'));
          }
        }
      }
      if (!disposed && !transcript.hidden) transcript.scrollTop = transcript.scrollHeight;
    },
    clear() {
      if (disposed) return;
      for (const turn of turns.values()) releaseTurn(turn); turns.clear(); transcript.replaceChildren(empty); images.prune();
    },
    dispose() {
      if (disposed) return; disposed = true;
      for (const turn of turns.values()) releaseTurn(turn); turns.clear();
      for (const audio of [...audioPreviews.keys()]) releaseAudio(audio); images.dispose();
    },
  };
}
