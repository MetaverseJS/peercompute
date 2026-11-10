import { GlobalInferenceChatService } from '../../../shared/chat/GlobalInferenceChatService.js';
import { prepareGlobalChatInput } from '../../../shared/chat/globalInferenceChatContracts.js';

const MAX_PENDING_BYTES = 24 * 1024 * 1024;
const MAX_PENDING_EVENTS = 60;
const encoder = new TextEncoder();
function boundedText(value, maximum) {
  let result = '', bytes = 0;
  for (const character of String(value ?? '').replace(/\0/g, '').toWellFormed()) {
    const size = encoder.encode(character).byteLength;
    if (bytes + size > maximum) break;
    result += character; bytes += size;
  }
  return result;
}

/** Presentation remains usable offline; only explicitly published Global events
 * enter this bounded outbox. Neither model context nor private agent state is accepted. */
export function createGlobalChatSession({ getNetworkManager, onEvent, onStatus,
  serviceFactory = (options) => new GlobalInferenceChatService(options) }) {
  const localId = `local-${crypto.randomUUID()}`, controller = new AbortController();
  let service, manager, starting, refreshing, flushing, closing, closed = false, bytes = 0, missed = 0;
  const pending = [];
  function status() {
    if (closed) return;
    const state = service?.getStatus();
    onStatus?.((state?.connected ? 'Global connected.' : 'Global offline.')
      + (pending.length ? ` ${pending.length} item(s) waiting to share.` : '')
      + (missed ? ` ${missed} item(s) could not be shared with every peer.` : '')
      + ' Recent messages are available while their authors stay online.');
  }
  function emit(event) {
    if (closed) return;
    try { void Promise.resolve(onEvent?.(event)).catch(() => { missed++; status(); }); }
    catch { missed++; status(); }
  }
  function flush() {
    if (closed || !service || flushing) return flushing;
    const activeService = service;
    flushing = (async () => {
      while (!closed && service === activeService && pending.length) {
        const next = pending[0];
        try {
          const result = await activeService.publish(next.input, { signal: controller.signal });
          if (['failed', 'partial'].includes(result?.delivery?.status)) missed++;
        } catch { if (!closed) missed++; }
        pending.shift(); bytes -= next.bytes;
      }
    })().finally(() => { flushing = null; status(); });
    return flushing;
  }
  function publish(input) {
    if (closed) return;
    // Explicit allowlist: a caller's messages, record, memory or raw microphone
    // input must never accidentally ride along with a public turn.
    let event;
    try {
      event = prepareGlobalChatInput({ turnId: input.turnId, phase: input.phase,
        name: boundedText(input.name || 'Guest', 80), text: boundedText(input.text, 64 * 1024),
        ...(input.modelName ? { modelName: boundedText(input.modelName, 256) } : {}),
        ...(input.phase === 'audio' ? { part: input.part, audio: input.audio } : {}),
        // Peer inference returns verified transport metadata (including sha256)
        // alongside pixels. Publish the image's public payload only; the Global
        // service validates it and computes its own wire digest. The canonical
        // event contract stays strict, and no result metadata/context leaks out.
        ...(input.image ? { image: { width: input.image.width, height: input.image.height,
          channels: input.image.channels, data: input.image.data } } : {}) }).input;
    } catch { missed++; status(); return; }
    emit({ ...event, peerId: localId, id: crypto.randomUUID(), local: true });
    const size = new TextEncoder().encode(event.text).byteLength + (event.image?.data.byteLength || 0)
      + (event.audio?.samples.byteLength || 0) + 1024;
    if (pending.length >= MAX_PENDING_EVENTS || bytes + size > MAX_PENDING_BYTES) { missed++; status(); return; }
    pending.push({ input: event, bytes: size }); bytes += size;
    status(); void refresh();
  }
  function refresh() {
    if (closed || refreshing) return refreshing ?? Promise.resolve();
    refreshing = refreshOnce().catch(() => { if (!closed) { missed++; status(); } })
      .finally(() => { refreshing = null; });
    return refreshing;
  }
  async function refreshOnce() {
    if (closed) return;
    const nextManager = getNetworkManager?.();
    if (!nextManager) { status(); return; }
    if (service && (manager !== nextManager || !service.getStatus().connected)) {
      const previous = service; service = null;
      await previous.close(); await flushing;
    }
    if (!service && !starting) {
      manager = nextManager;
      starting = (async () => {
        let next;
        try {
          next = serviceFactory({ networkManager: manager,
            onEvent: (event) => {
              // Our provisional local rows already exist. Never deduplicate a
              // remote sender merely because they chose the same turn UUID.
              if (!event.local) emit(event);
            }, onStatus: status });
          await next.start(); if (closed) await next.close(); else service = next;
        } catch { await next?.close().catch(() => {}); }
      })().finally(() => { starting = null; });
    }
    await starting;
    if (closed || !service) { status(); return; }
    void flush();
    try { await service.refresh({ signal: controller.signal }); } catch { /* Next discovery retries. */ }
    status();
  }
  status();
  return { publish, refresh, close() {
    if (closing) return closing;
    closed = true; controller.abort();
    closing = (async () => {
      try { await starting; await service?.close(); }
      finally { await refreshing; await flushing; pending.length = 0; bytes = 0; }
    })().catch((error) => { closing = null; throw error; });
    return closing;
  } };
}
