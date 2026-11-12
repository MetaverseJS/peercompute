const IMAGE_TYPES = new Map([['image/png', 'png'], ['image/jpeg', 'jpg'], ['image/webp', 'webp'], ['image/gif', 'gif']]);
const MAX_BYTES = 8 * 1024 ** 2;
const MAX_METADATA = 64 * 1024;
const abortReason = (signal) => signal.reason ?? new DOMException('Image selection cancelled', 'AbortError');

function wait(promise, signal) {
  if (signal.aborted) { Promise.resolve(promise).catch(() => {}); return Promise.reject(abortReason(signal)); }
  return new Promise((resolve, reject) => {
    const abort = () => reject(abortReason(signal));
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}

function payload(transfer, document) {
  if (!transfer) return null;
  // Clipboard/drag producers commonly include File, HTML and URI versions of
  // the same image. The explicit bytes always win; do not fetch its URL too.
  let files = [...(transfer.items ?? [])].filter((item) => item.kind === 'file').map((item) => item.getAsFile()).filter(Boolean);
  if (!files.length) files = [...(transfer.files ?? [])];
  if (files.length) return files.length === 1 ? { file: files[0] } : { error: 'Attach one image at a time.' };
  const html = transfer.getData('text/html');
  if (html && /<img\b|blob:/i.test(html)) {
    if (html.length > MAX_METADATA) return { error: 'Image clipboard information is too large. Save the image and attach the file.' };
    // A template is inert: parsing must not execute markup or load remote imgs.
    const template = document.createElement('template'); template.innerHTML = html;
    const images = [...template.content.querySelectorAll('img')];
    if (images.length > 1) return { error: 'Attach one image at a time.' };
    if (images.length) return { url: images[0].getAttribute('src') ?? '' };
    const links = [...template.content.querySelectorAll('a[href]')].map((item) => item.getAttribute('href')).filter((url) => /^blob:/i.test(url));
    if (links.length > 1) return { error: 'Attach one image at a time.' };
    if (links.length) return { url: links[0] };
  }
  const uris = transfer.getData('text/uri-list');
  if (uris && /(?:^|\n)blob:/i.test(uris)) {
    if (uris.length > MAX_METADATA) return { error: 'Image clipboard information is too large. Attach the image file instead.' };
    const urls = uris.split(/\r?\n/).map((value) => value.trim()).filter((value) => value && !value.startsWith('#'));
    return urls.length === 1 ? { url: urls[0] } : { error: 'Attach one image at a time.' };
  }
  const text = transfer.getData('text/plain').trim();
  if (/^blob:/i.test(text)) return text.length <= MAX_METADATA ? { url: text } : { error: 'Image link is too long. Attach the image file instead.' };
  return null;
}

function validateFile(file) {
  if (!IMAGE_TYPES.has(file.type)) throw new Error('Choose a PNG, JPEG, WebP or GIF image.');
  if (!Number.isSafeInteger(file.size) || file.size <= 0) throw new Error('This image is empty or unreadable. Attach the image file again.');
  if (file.size > MAX_BYTES) throw new Error('Choose an image smaller than 8 MiB.');
  return file;
}

async function fetchBlobImage(value, { document, fetchImpl, source, signal }) {
  let url;
  try { url = new URL(value); } catch { throw new Error('This image link is invalid. Save the image and attach the file.'); }
  if (url.protocol !== 'blob:') throw new Error('Drag or paste the image file itself; remote image links are not downloaded.');
  if (url.origin === 'null' || url.origin !== document.location.origin) {
    throw new Error('This image belongs to another website or browser tab. Save the image, then attach the file.');
  }
  let response;
  try { response = await wait(fetchImpl(url.href, { signal, credentials: 'omit', redirect: 'error' }), signal); }
  catch (error) {
    signal.throwIfAborted();
    throw new Error('This image link expired or is unavailable. Copy the image again, or save and attach its file.', { cause: error });
  }
  if (!response.ok) { void response.body?.cancel().catch(() => {}); throw new Error('This image link is unavailable. Copy the image again or attach its file.'); }
  const type = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (!IMAGE_TYPES.has(type)) { void response.body?.cancel().catch(() => {}); throw new Error('The image link must contain a PNG, JPEG, WebP or GIF image.'); }
  const length = response.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) {
    void response.body?.cancel().catch(() => {}); throw new Error('Choose an image smaller than 8 MiB.');
  }
  if (!response.body) throw new Error('This image has no readable data. Attach the image file instead.');
  const reader = response.body.getReader(), chunks = []; let size = 0, complete = false;
  try {
    for (;;) {
      const { done, value: chunk } = await wait(reader.read(), signal);
      signal.throwIfAborted();
      if (done) { complete = true; break; }
      size += chunk.byteLength;
      if (size > MAX_BYTES) throw new Error('Choose an image smaller than 8 MiB.');
      chunks.push(chunk);
    }
    if (length !== null && size !== Number(length)) throw new Error('The image was interrupted. Copy it again or attach the file.');
    return validateFile(new File(chunks, `${source === 'paste' ? 'pasted' : 'dropped'}-image.${IMAGE_TYPES.get(type)}`, { type }));
  } finally {
    if (!complete) void reader.cancel(abortReason(signal)).catch(() => {});
    try { reader.releaseLock(); } catch { /* A cancelled read is still settling. */ }
  }
}

/** Bind one-image clipboard/drag input. onFile must check its signal before
 * committing decoded pixels/preview; existing readImageAttachment does so. */
export function bindChatImageInput({ textarea, onFile, onError = () => {}, canAccept = () => true,
  onPendingChange = () => {}, fetchImpl = globalThis.fetch, timeoutMs = 10000 } = {}) {
  if (!textarea?.addEventListener || typeof onFile !== 'function' || typeof fetchImpl !== 'function') throw new TypeError('Chat image input requires a textarea, onFile and fetch');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 10 || timeoutMs > 30000) throw new RangeError('Invalid image input timeout');
  let current = null, closed = false, latest = Promise.resolve();
  const report = (error) => { try { Promise.resolve(onError(error)).catch(() => {}); } catch { /* Host owns error rendering. */ } };
  const allowed = () => {
    const result = canAccept();
    if (result !== true) throw new Error(typeof result === 'string' && result ? result : 'Images are unavailable for this chat target right now.');
  };
  const cancel = (reason = new DOMException('Image selection cancelled', 'AbortError')) => current?.controller.abort(reason);
  function receive(event, source) {
    if (closed) return;
    let input;
    try { input = payload(source === 'paste' ? event.clipboardData : event.dataTransfer, textarea.ownerDocument); }
    catch (error) { event.preventDefault(); report(error); return; }
    if (!input) return; // Preserve native text insertion, selection and undo.
    event.preventDefault();
    cancel();
    const job = { controller: new AbortController() }; current = job;
    onPendingChange(true);
    const timer = setTimeout(() => job.controller.abort(Object.assign(new Error('Reading the image timed out. Attach the file again.'), { code: 'ERR_CHAT_IMAGE_TIMEOUT' })), timeoutMs);
    latest = (async () => {
      try {
        allowed();
        if (input.error) throw new Error(input.error);
        const file = input.file ? validateFile(input.file) : await fetchBlobImage(input.url,
          { document: textarea.ownerDocument, fetchImpl, source, signal: job.controller.signal });
        job.controller.signal.throwIfAborted(); allowed();
        await wait(onFile(file, { signal: job.controller.signal, source }), job.controller.signal);
      } catch (error) {
        if (!closed && current === job && !(job.controller.signal.aborted && job.controller.signal.reason?.name === 'AbortError')) report(error);
      } finally {
        clearTimeout(timer);
        if (current === job) { current = null; if (!closed) onPendingChange(false); }
      }
    })();
  }
  const paste = (event) => receive(event, 'paste');
  const drop = (event) => receive(event, 'drop');
  const dragover = (event) => {
    if (closed) return;
    const transfer = event.dataTransfer;
    if (!transfer) return;
    // Dragover can expose only types, not bytes; HTML/URI drags become readable
    // at drop. Plain text drags retain the browser's normal insertion behavior.
    const types = [...transfer.types];
    if (!types.some((type) => ['Files', 'text/html', 'text/uri-list'].includes(type))) return;
    event.preventDefault(); transfer.dropEffect = canAccept() === true ? 'copy' : 'none';
  };
  textarea.addEventListener('paste', paste); textarea.addEventListener('dragover', dragover); textarea.addEventListener('drop', drop);
  return {
    cancel,
    whenIdle: () => latest,
    dispose() {
      if (!closed) {
        closed = true; cancel();
        textarea.removeEventListener('paste', paste); textarea.removeEventListener('dragover', dragover); textarea.removeEventListener('drop', drop);
        if (current) onPendingChange(false);
      }
      return latest;
    },
  };
}
