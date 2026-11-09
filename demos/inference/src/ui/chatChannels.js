import './chatChannels.css';

const NAME_BYTES = 80;
const encoder = new TextEncoder();
const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

/** Names are presentation only; authenticated peer IDs identify network authors. */
export function normalizeChatName(value) {
  if (typeof value !== 'string') return 'Anonymous';
  const source = value.slice(0, 1024).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().replace(/\s+/g, ' ');
  let name = '', bytes = 0;
  for (const character of source) {
    const size = encoder.encode(character).length;
    if (bytes + size > NAME_BYTES) break;
    name += character; bytes += size;
  }
  return name.trim() || 'Anonymous';
}

/** Two independent view/state slots. The owner moves its one composer on selection. */
export function createChatChannels({ panel, personalView, onSelect, storage,
  storageKey = 'peercompute:inference:display-name:v1' } = {}) {
  if (!panel?.insertBefore || !personalView?.transcript || !personalView?.empty
      || personalView.transcript.parentNode !== panel) throw new TypeError('Chat channels require the existing personal transcript');
  if (storage === undefined) { try { storage = globalThis.localStorage; } catch { storage = null; } }
  const element = node('section', 'pc-chat-channels');
  const header = node('div', 'pc-chat-channel-header');
  const tablist = node('div', 'pc-chat-channel-tabs'); tablist.setAttribute('role', 'tablist'); tablist.setAttribute('aria-label', 'Chat channels');
  const nameLabel = node('label', 'pc-chat-name');
  const nameInput = node('input'); nameInput.type = 'text'; nameInput.maxLength = NAME_BYTES;
  nameInput.placeholder = 'Your name'; nameInput.setAttribute('aria-label', 'Display name'); nameInput.autocomplete = 'nickname';
  nameInput.title = 'Name shown beside your Global prompts and replies';
  try { nameInput.value = normalizeChatName(storage?.getItem(storageKey)); } catch { nameInput.value = 'Anonymous'; }
  const description = node('p', 'pc-chat-channel-description');
  const status = node('p', 'pc-chat-channel-status'); status.setAttribute('role', 'status'); status.hidden = true;
  nameLabel.append(nameInput); header.append(tablist, nameLabel); element.append(header, description, status);

  const original = { id: personalView.transcript.id, label: personalView.transcript.getAttribute('aria-label'), hidden: personalView.transcript.hidden };
  const globalTranscript = node('div', 'pc-inference-transcript'); globalTranscript.setAttribute('role', 'log'); globalTranscript.setAttribute('aria-live', 'polite');
  const globalEmpty = node('p', 'pc-chat-empty', 'Start a conversation. Global prompts and replies are shared with connected peers.');
  globalTranscript.append(globalEmpty);
  const views = { global: { transcript: globalTranscript, empty: globalEmpty }, personal: personalView };
  const channels = new Map(), tabs = {};
  const instance = crypto.randomUUID();
  panel.insertBefore(element, personalView.transcript);
  // Moving Personal into its wrapper must not invalidate Global's insertion
  // point when Personal is the first tab.
  const insertionPoint = personalView.transcript.nextSibling;
  for (const id of ['personal', 'global']) {
    const title = id === 'global' ? 'Global' : 'Personal';
    const tab = node('button', '', title); tab.type = 'button'; tab.id = `pc-chat-${instance}-${id}-tab`;
    tab.setAttribute('role', 'tab');
    const container = node('section', 'pc-chat-channel-panel'); container.id = `pc-chat-${instance}-${id}`;
    container.setAttribute('role', 'tabpanel'); container.setAttribute('aria-labelledby', tab.id);
    tab.setAttribute('aria-controls', container.id);
    panel.insertBefore(container, insertionPoint);
    const view = { transcript: views[id].transcript, empty: views[id].empty };
    if (id === 'global') view.transcript.setAttribute('aria-label', 'Global conversation');
    container.append(view.transcript);
    channels.set(id, { id, view, container, histories: new Map(), draft: { text: '', attachment: null },
      targetKey: 'mixed', generateImage: false, speakReplies: false });
    tabs[id] = tab; tablist.append(tab);
  }
  let active = 'personal', busy = false, disposed = false;
  function render() {
    for (const [id, channel] of channels) {
      const selected = id === active;
      channel.container.hidden = !selected; channel.view.transcript.hidden = !selected;
      tabs[id].setAttribute('aria-selected', String(selected)); tabs[id].tabIndex = selected ? 0 : -1; tabs[id].disabled = busy;
    }
    nameLabel.hidden = active !== 'global'; nameInput.disabled = busy;
    description.textContent = active === 'global'
      ? 'Global prompts and replies are visible to everyone on the peer network.'
      : 'Personal conversations are separate from the Global feed.';
    status.hidden = active !== 'global' || !status.textContent;
  }
  function select(id) {
    if (!channels.has(id)) throw new TypeError('Unknown chat channel');
    if (disposed || busy || id === active) return false;
    const previous = channels.get(active); active = id; render();
    onSelect?.({ previous, current: channels.get(active) }); return true;
  }
  for (const [id, tab] of Object.entries(tabs)) tab.onclick = () => select(id);
  tablist.onkeydown = (event) => {
    if (busy || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'personal' : event.key === 'End' ? 'global' : active === 'global' ? 'personal' : 'global';
    select(next); tabs[next].focus();
  };
  const saveName = () => {
    nameInput.value = normalizeChatName(nameInput.value);
    try { storage?.setItem(storageKey, nameInput.value); } catch { /* Inference works when browser preferences are unavailable. */ }
  };
  nameInput.onchange = saveName; nameInput.onblur = saveName;
  render();
  return {
    element, tabs, nameInput,
    get active() { return active; },
    getChannel(id) { if (!channels.has(id)) throw new TypeError('Unknown chat channel'); return channels.get(id); },
    select,
    getName() { saveName(); return nameInput.value; },
    setBusy(value) { if (disposed) return; busy = Boolean(value); render(); },
    setStatus(text) { if (disposed) return; status.textContent = String(text ?? '').slice(0, 512); render(); },
    dispose() {
      if (disposed) return; disposed = true;
      for (const tab of Object.values(tabs)) tab.onclick = null;
      tablist.onkeydown = null; nameInput.onchange = null; nameInput.onblur = null;
      const personal = channels.get('personal');
      personal.container.before(personalView.transcript); personalView.transcript.hidden = original.hidden;
      if (original.label === null) personalView.transcript.removeAttribute('aria-label'); else personalView.transcript.setAttribute('aria-label', original.label);
      personalView.transcript.id = original.id;
      for (const channel of channels.values()) { channel.container.remove(); channel.histories.clear(); channel.draft = { text: '', attachment: null }; }
      element.remove();
    },
  };
}
