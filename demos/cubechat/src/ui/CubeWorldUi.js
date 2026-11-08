import './cubeWorldUi.css';

let sequence = 0;
const encoder = new TextEncoder();
const text = (value, maximum = 2048) => String(value ?? '').slice(0, maximum);
const node = (tag, value, className) => {
  const element = document.createElement(tag);
  if (value !== undefined) element.textContent = value;
  if (className) element.className = className;
  return element;
};
const button = (label) => { const element = node('button', label); element.type = 'button'; return element; };
const check = (label, checked = false) => {
  const input = node('input'); input.type = 'checkbox'; input.checked = checked;
  const wrapper = node('label', undefined, 'cube-native-check'); wrapper.append(input, document.createTextNode(label));
  return { input, wrapper };
};
const editable = (element) => element?.isContentEditable || element?.closest?.('input,textarea,select');

/** World-native presentation. Runtime, transport, storage and scene ownership stay with the host. */
export function createCubeWorldUi({ container = document.body, worldLabel = 'CubeChat', roomLabel = 'global',
  onSpawn, onSelect, onSend, onModels, onVoice, onRecord, onCancel, onClose, onRemove, onResume, onOpen,
  onRoomSend, onPlayerCaption, onMovement, onAppearance, onWorldChat, onSettings } = {}) {
  const root = node('section', undefined, 'cube-native-ui');
  const dock = node('section', undefined, 'cube-native-chat'); dock.setAttribute('aria-label', 'World chat');
  const launcher = button('Chat'); launcher.className = 'cube-native-chat-launcher'; launcher.setAttribute('aria-expanded', 'false');
  const chatBody = node('div', undefined, 'cube-native-chat-body'); chatBody.hidden = true;
  chatBody.id = `cube-world-chat-${++sequence}`; launcher.setAttribute('aria-controls', chatBody.id);
  const chatHeader = node('header');
  const target = node('select'); target.setAttribute('aria-label', 'Chat with');
  const collapse = button('Close chat'); chatHeader.append(target, collapse);
  const scopeNote = node('p', '', 'cube-native-note');
  const messages = node('div', undefined, 'cube-native-messages'); messages.setAttribute('role', 'log');
  messages.setAttribute('aria-label', 'World conversation'); messages.setAttribute('aria-live', 'polite');
  const status = node('p', '', 'cube-native-status'); status.setAttribute('role', 'status');
  const composer = node('form', undefined, 'cube-native-composer');
  const prompt = node('textarea'); prompt.rows = 2; prompt.setAttribute('aria-label', 'World message');
  const send = button('Send'); send.type = 'submit';
  const talk = button('Talk'), cancel = button('Cancel'), voiceButton = button('Voice options');
  const actions = node('div', undefined, 'cube-native-actions'); actions.append(send, talk, cancel, voiceButton);
  composer.append(prompt, actions); chatBody.append(chatHeader, scopeNote, messages, status, composer);
  dock.append(launcher, chatBody);

  const makeDialog = (title) => {
    const dialog = node('dialog', undefined, 'cube-native-dialog');
    const heading = node('h2', title); heading.id = `cube-world-dialog-${++sequence}`;
    dialog.setAttribute('aria-labelledby', heading.id);
    const header = node('header'), done = button('Done'); header.append(heading, done); dialog.append(header);
    return { dialog, done };
  };
  const residents = makeDialog('Residents'), voice = makeDialog('Voice options');
  const residentStatus = node('p', '', 'cube-native-status'); residentStatus.setAttribute('role', 'status');
  const list = node('div', undefined, 'cube-native-residents'); list.setAttribute('aria-label', 'Residents in this world');
  const empty = node('p', 'No residents here yet.', 'cube-native-note');
  const spawnDetails = node('details'); spawnDetails.append(node('summary', 'Place a resident'));
  const spawnForm = node('form', undefined, 'cube-native-spawn');
  const name = node('input'); name.setAttribute('aria-label', 'Resident name'); name.placeholder = 'Resident name'; name.maxLength = 240; name.required = true;
  const goals = node('textarea'); goals.setAttribute('aria-label', 'Resident goals'); goals.placeholder = 'Goals or context, one per line'; goals.rows = 3; goals.maxLength = 4096;
  const appearance = node('textarea'); appearance.setAttribute('aria-label', 'Physical appearance'); appearance.placeholder = 'Physical appearance (optional)'; appearance.rows = 3; appearance.maxLength = 1000;
  const appearanceNote = node('p', 'Describe the image for the front of the cube. The description is saved even when no image model is available.', 'cube-native-note');
  const localOnly = check('Use only models on this device'), shared = check('Let peers talk to this resident', true);
  const worldChat = check('Respond to world chat');
  const movement = node('select'); movement.setAttribute('aria-label', 'Movement');
  for (const [value, label] of [['roam', 'Roam'], ['stationary', 'Stay here'], ['follow', 'Follow me']]) {
    const option = node('option', label); option.value = value; movement.append(option);
  }
  const spawn = button('Place resident'); spawn.type = 'submit';
  spawnForm.append(name, goals, appearance, appearanceNote, localOnly.wrapper,
    node('p', 'With local-only off, conversation context may go to an inference host.', 'cube-native-note'), shared.wrapper, worldChat.wrapper, movement, spawn);
  spawnDetails.append(spawnForm); residents.dialog.append(residentStatus, list, empty, spawnDetails);
  const voiceEnabled = check('Enable voice'), speak = check('Speak replies');
  const voiceNote = node('p', 'Voice models download about 376 MB on first use. Text chat remains available.', 'cube-native-note');
  const voiceStatus = node('p', '', 'cube-native-status'); voiceStatus.setAttribute('role', 'status');
  voice.dialog.append(voiceEnabled.wrapper, speak.wrapper, voiceNote, voiceStatus);
  root.append(dock, residents.dialog, voice.dialog); container.append(root);

  let enabled = true, disposed = false, expanded = false, selected = null, hostKey = null;
  let agents = [], roomMessages = [], roomStatus = '', agentStatus = '', worldStatus = '', busy = false;
  let sending = false, mutating = false, selecting = false, cancelling = false, modelOpening = false, closing;
  let sendDone, cancelDone, roomSendController, recordPending = false, recordIntent = false, recordEpoch = 0, voiceEpoch = 0;
  let voiceState = { enabled: false, preparing: false, recording: false };
  const drafts = new Map(), histories = new Map(), movementByKey = new Map(), captionPrimed = new Set();
  const restores = new Map();
  const currentKey = () => selected?.key ?? 'room';
  const capturing = () => recordPending || recordIntent || voiceState.recording;
  const active = () => sending || busy || capturing() || voiceState.preparing;
  const paused = () => selected?.status === 'paused' || selected?.recoveryRequired;
  const fail = (error) => {
    if (disposed) return;
    const value = text(error?.message ?? error);
    if (selected) agentStatus = value; else roomStatus = value;
    residentStatus.textContent = voiceStatus.textContent = value; update();
  };
  function signalOpen() {
    try { Promise.resolve(onOpen?.()).catch(fail); } catch (error) { fail(error); }
  }
  function update() {
    if (disposed) return;
    const locked = !enabled || !!closing || modelOpening, transition = mutating || selecting || cancelling;
    root.hidden = !enabled;
    root.classList.toggle('cube-native-expanded', expanded);
    launcher.hidden = expanded; chatBody.hidden = !expanded; launcher.setAttribute('aria-expanded', String(expanded));
    launcher.textContent = `Chat · ${selected ? text(selected.name, 60) : `Room: ${text(roomLabel, 60)}`} · Enter`;
    target.disabled = locked || transition;
    prompt.disabled = locked || transition || sending || busy || capturing() || paused();
    prompt.maxLength = selected ? 16000 : 1024;
    prompt.placeholder = selected ? `Message ${text(selected.name, 80)}…` : 'Message everyone in this room…';
    send.disabled = prompt.disabled || !prompt.value.trim() || typeof (selected ? onSend : onRoomSend) !== 'function';
    talk.hidden = voiceButton.hidden = !selected;
    talk.textContent = voiceState.recording || recordIntent ? 'Stop' : 'Talk';
    talk.disabled = locked || transition || !selected || paused() || !voiceState.enabled || voiceState.preparing
      || ((sending || busy || recordPending) && !voiceState.recording && !recordIntent) || typeof onRecord !== 'function';
    cancel.hidden = !active() && !cancelling;
    cancel.disabled = locked || cancelling || !active(); cancel.textContent = cancelling ? 'Cancelling…' : 'Cancel';
    voiceButton.disabled = locked || transition;
    collapse.disabled = !!closing; collapse.textContent = closing ? 'Closing…' : 'Close chat';
    name.disabled = goals.disabled = appearance.disabled = localOnly.input.disabled = shared.input.disabled = worldChat.input.disabled = movement.disabled = locked || mutating;
    movement.hidden = typeof onMovement !== 'function';
    spawn.disabled = locked || transition || active() || typeof onSpawn !== 'function';
    voiceEnabled.input.checked = voiceState.enabled || voiceState.preparing;
    voiceEnabled.input.disabled = locked || !selected || typeof onVoice !== 'function';
    speak.input.disabled = locked || !voiceState.enabled;
    voiceNote.textContent = voiceState.preparing ? 'Preparing voice… Uncheck Enable voice to cancel.'
      : voiceState.recording || recordIntent ? 'Listening. Press Stop to send, or Cancel to discard.'
        : 'Voice models download about 376 MB on first use. Text chat remains available.';
    scopeNote.textContent = !selected ? `Room: ${text(roomLabel, 80)} · visible to players in this room.`
      : `${text(selected.name, 240)} · ${selected.local ? 'resident on this device' : 'peer-hosted resident'} · private conversation.`
        + (paused() ? selected.recoveryRequired ? ' Previous outcome unknown. Acknowledge and resume in Residents.' : ' Paused. Resume in Residents.' : '');
    status.textContent = selected ? agentStatus : roomStatus || worldStatus;
    for (const control of list.querySelectorAll('button,select,input')) control.disabled = locked || transition || active() || control.dataset.unavailable === 'true';
    target.value = currentKey();
  }
  function renderTargets() {
    target.replaceChildren();
    const room = node('option', `Room · ${text(roomLabel, 80)}`); room.value = 'room'; target.append(room);
    for (const agent of agents) { const option = node('option', `${text(agent.name, 240)}${agent.local ? '' : ' · peer'}`); option.value = agent.key; target.append(option); }
    update();
  }
  function renderMessages() {
    if (disposed) return;
    messages.replaceChildren();
    const entries = selected ? histories.get(selected.key) ?? [] : roomMessages;
    for (const entry of entries) {
      const article = node('article');
      if (entry.id) article.dataset.messageId = entry.id;
      if (entry.peerId) article.dataset.peerId = entry.peerId;
      article.append(node('strong', text(entry.name ?? (entry.role === 'user' ? 'You' : entry.role === 'assistant' ? selected?.name ?? 'Resident' : 'Status'), 240)), node('p', text(entry.text, 16000)));
      messages.append(article);
    }
    messages.scrollTop = messages.scrollHeight;
  }
  function rememberDraft() { drafts.set(currentKey(), prompt.value); }
  function select(descriptor) {
    if (disposed) return;
    rememberDraft(); selected = descriptor ? { ...descriptor } : null;
    if (descriptor) { hostKey = descriptor.key; captionPrimed.delete(hostKey); }
    prompt.value = drafts.get(currentKey()) ?? ''; renderTargets(); renderMessages();
    if (expanded && !prompt.disabled && !residents.dialog.open && !voice.dialog.open) prompt.focus();
  }
  async function cancelWork() {
    if (cancelDone) return cancelDone;
    roomSendController?.abort(new DOMException('Room message cancelled', 'AbortError'));
    cancelling = true; update();
    cancelDone = Promise.resolve().then(() => onCancel?.()).then(async () => { await sendDone; })
      .finally(() => {
        cancelling = false; cancelDone = null; update();
        if (!disposed && expanded && !prompt.disabled && !residents.dialog.open && !voice.dialog.open) prompt.focus();
      });
    return cancelDone;
  }
  async function choose(key) {
    if (disposed || selecting || closing) return;
    if (key === currentKey()) { hideDialog(residents.dialog, false); open(); return; }
    selecting = true; rememberDraft(); update();
    try {
      if (active()) await cancelWork();
      if (disposed) return;
      if (key === 'room') select(null);
      else {
        if (!agents.some(agent => agent.key === key)) throw new Error('This resident is no longer here.');
        await onSelect?.(key);
      }
      hideDialog(residents.dialog, false); open();
    } catch (error) { fail(error); }
    finally { selecting = false; update(); if (expanded && !prompt.disabled) prompt.focus(); }
  }
  function showDialog(dialog, opener) {
    if (disposed || !enabled || closing || dialog.open) return;
    signalOpen(); restores.set(dialog, opener ?? document.activeElement); dialog.showModal();
  }
  function hideDialog(dialog, restore = true) {
    if (!dialog.open) return;
    dialog.close();
    const opener = restores.get(dialog); restores.delete(dialog);
    if (restore) {
      // Menu actions can disappear when their menu closes. Restore a live
      // external opener when possible, otherwise return to the world chat.
      for (const candidate of [opener, expanded ? prompt : launcher]) {
        if (!candidate?.isConnected || candidate.disabled || !candidate.getClientRects().length
            || candidate.closest('[inert]') || getComputedStyle(candidate).visibility === 'hidden') continue;
        candidate.focus({ preventScroll: true });
        if (document.activeElement === candidate) break;
      }
    }
  }
  function open() {
    if (disposed || !enabled || closing) return;
    signalOpen(); expanded = true; update();
    if (!residents.dialog.open && !voice.dialog.open && !prompt.disabled) prompt.focus();
  }
  async function close() {
    if (closing) return closing;
    if (disposed) return;
    roomSendController?.abort(new DOMException('Room message cancelled', 'AbortError'));
    closing = Promise.resolve().then(async () => { await onClose?.(); await sendDone; }).then(() => {
      if (disposed) return;
      rememberDraft(); expanded = false; hideDialog(voice.dialog, false);
    }).catch(fail).finally(() => {
      closing = null; update(); if (!disposed && !expanded) launcher.focus();
    });
    update(); return closing;
  }
  async function openModels() {
    if (disposed || !enabled || modelOpening || closing || mutating || selecting) return;
    modelOpening = true; update();
    try {
      if (active()) await cancelWork();
      if (disposed) return;
      hideDialog(residents.dialog, false); hideDialog(voice.dialog, false); signalOpen(); await onModels?.();
    } catch (error) { fail(error); }
    finally { modelOpening = false; update(); }
  }
  function openResidents({ returnFocus } = {}) { if (!disposed && enabled && !modelOpening) showDialog(residents.dialog, returnFocus); }
  async function mutation(callback, argument) {
    if (disposed || mutating || active() || selecting) return;
    mutating = true; update();
    try { return await callback?.(argument); } catch (error) { fail(error); }
    finally {
      mutating = false; update();
      if (!disposed && expanded && !prompt.disabled && !residents.dialog.open && !voice.dialog.open) prompt.focus();
    }
  }
  function setAgents(next) {
    if (disposed) return;
    const focus = list.contains(document.activeElement) ? { key: document.activeElement.closest('[data-agent-key]')?.dataset.agentKey, label: document.activeElement.getAttribute('aria-label') } : null;
    agents = (Array.isArray(next) ? next : []).filter(item => item && typeof item.key === 'string' && item.key.length <= 300).slice(0, 256);
    list.replaceChildren(); empty.hidden = agents.length > 0;
    for (const agent of agents) {
      const row = node('article', undefined, 'cube-native-resident'); row.dataset.agentKey = agent.key;
      row.append(node('strong', text(agent.name, 240)), node('p', `${agent.local ? 'Local' : 'Peer'} · ${text(agent.status ?? 'idle', 32)}`, 'cube-native-note'));
      const controls = node('div', undefined, 'cube-native-actions');
      const chat = button('Chat'); chat.setAttribute('aria-label', `Chat with ${text(agent.name, 240)}`); chat.onclick = () => void choose(agent.key); controls.append(chat);
      if (agent.local) {
        if (typeof onWorldChat === 'function') {
          const respond = check('Respond to world chat', Boolean(agent.respondToWorldChat));
          respond.input.setAttribute('aria-label', `Respond to world chat for ${text(agent.name, 240)}`);
          respond.input.onchange = () => {
            if (disposed || mutating || active() || selecting || respond.input.disabled) { respond.input.checked = Boolean(agent.respondToWorldChat); return; }
            const value = respond.input.checked;
            void mutation(async () => {
              try { await onWorldChat({ key: agent.key, enabled: value }); agent.respondToWorldChat = value; }
              catch (error) { respond.input.checked = Boolean(agent.respondToWorldChat); throw error; }
            });
          };
          row.append(respond.wrapper);
        }
        if (agent.appearanceStatus || agent.appearanceError) {
          const appearanceStatus = text(agent.appearanceStatus, 64);
          const appearanceMessage = appearanceStatus === 'ready' ? 'Appearance ready.'
            : ['queued', 'generating', 'preparing'].includes(appearanceStatus) ? 'Generating appearance…'
              : appearanceStatus === 'waiting' ? 'Appearance saved. An image model is needed to generate it.'
                : appearanceStatus ? `Appearance: ${appearanceStatus}.` : '';
          const note = node('p', [appearanceMessage, text(agent.appearanceError, 512)].filter(Boolean).join(' '), 'cube-native-appearance-status');
          note.setAttribute('role', 'status'); row.append(note);
        }
        if (typeof onAppearance === 'function' && typeof agent.appearancePrompt === 'string' && agent.appearancePrompt.trim()) {
          const retry = Boolean(agent.appearanceError) || ['error', 'failed', 'waiting'].includes(agent.appearanceStatus);
          const generate = button(retry ? 'Retry appearance' : 'Generate appearance');
          generate.setAttribute('aria-label', `${retry ? 'Retry' : 'Generate'} appearance for ${text(agent.name, 240)}`);
          generate.dataset.unavailable = String(['queued', 'generating', 'preparing'].includes(agent.appearanceStatus));
          generate.onclick = () => void mutation(onAppearance, { key: agent.key }); controls.append(generate);
        }
        if (typeof onMovement === 'function') {
          const mode = movement.cloneNode(true); mode.hidden = false; mode.value = movementByKey.get(agent.key) ?? agent.movement ?? 'roam';
          mode.setAttribute('aria-label', `Movement for ${text(agent.name, 240)}`);
          mode.onchange = () => void mutation(async () => {
            const previous = movementByKey.get(agent.key) ?? 'roam';
            try { await onMovement({ key: agent.key, mode: mode.value }); movementByKey.set(agent.key, mode.value); }
            catch (error) { mode.value = previous; throw error; }
          }); controls.append(mode);
        }
        if (agent.status === 'paused' || agent.recoveryRequired) {
          const resume = button(agent.recoveryRequired ? 'Acknowledge and resume' : 'Resume');
          resume.onclick = () => void mutation(onResume, agent.key); controls.append(resume);
          if (agent.recoveryRequired) row.append(node('p', 'The previous request has an unknown outcome. Resume acknowledges it without replay.', 'cube-native-note'));
        }
        const remove = button('Remove body'); remove.setAttribute('aria-label', `Remove body ${text(agent.name, 240)}`);
        remove.title = 'Keep the saved identity and history; remove its world body.'; remove.onclick = () => void mutation(onRemove, agent.key); controls.append(remove);
      }
      row.append(controls); list.append(row);
    }
    if (selected) { const fresh = agents.find(agent => agent.key === selected.key); if (fresh) selected = { ...fresh }; else select(null); }
    const keys = new Set(['room', ...agents.map(agent => agent.key)]);
    for (const map of [drafts, histories, movementByKey]) for (const key of map.keys()) if (!keys.has(key)) map.delete(key);
    renderTargets();
    if (focus) [...list.querySelectorAll('button,select,input')].find(element => element.closest('[data-agent-key]').dataset.agentKey === focus.key && element.getAttribute('aria-label') === focus.label)?.focus();
  }
  function setMessages(next) {
    if (disposed || !hostKey) return;
    const previous = histories.get(hostKey) ?? [];
    const entries = (Array.isArray(next) ? next : []).slice(-32).map(item => ({ role: ['user', 'assistant', 'system'].includes(item?.role) ? item.role : 'system', text: text(item?.text, 16000) }));
    let bytes = 128000;
    for (let index = entries.length - 1; index >= 0; index--) { entries[index].text = entries[index].text.slice(0, Math.max(0, bytes)); bytes -= entries[index].text.length; }
    histories.set(hostKey, entries);
    const last = entries.at(-1), old = previous.at(-1);
    if (captionPrimed.has(hostKey) && last?.role === 'user' && (entries.length !== previous.length || old?.text !== last.text || old?.role !== last.role)) {
      try { Promise.resolve(onPlayerCaption?.(last.text)).catch(fail); } catch (error) { fail(error); }
    }
    captionPrimed.add(hostKey); if (selected?.key === hostKey) renderMessages();
  }
  function appendRoomMessage(message) {
    if (disposed || !message || typeof message.text !== 'string') return;
    const id = text(message.id ?? message.messageId, 160);
    if (id && roomMessages.some(entry => entry.id === id)) return;
    roomMessages = [...roomMessages, { id, peerId: text(message.peerId, 128), name: text(message.name || 'Anonymous', 240), text: text(message.text, 2048) }].slice(-64);
    if (!selected) renderMessages();
  }
  async function sendMessage() {
    if (disposed || send.disabled || sending) return;
    const key = currentKey(), content = prompt.value.trim(), isRoom = key === 'room';
    if (isRoom && (content.length > 1024 || encoder.encode(content).length > 2048)) { fail(new Error('Room messages can contain up to 1024 characters and 2048 UTF-8 bytes.')); return; }
    const roomController = isRoom ? new AbortController() : null;
    if (roomController) roomSendController = roomController;
    sending = true; update();
    sendDone = Promise.resolve().then(() => {
      roomController?.signal.throwIfAborted();
      return isRoom ? onRoomSend({ text: content }, { signal: roomController.signal }) : onSend({ key, text: content, voiceReply: voiceState.enabled && speak.input.checked });
    })
      .then(result => {
        if (roomController?.signal.aborted || result?.delivery?.cancelled) return;
        if (!disposed && currentKey() === key && prompt.value.trim() === content) { prompt.value = ''; drafts.set(key, ''); }
      })
      .catch(fail).finally(() => { if (roomSendController === roomController) roomSendController = null; sending = false; sendDone = null; update(); if (!disposed && expanded && currentKey() === key && !prompt.disabled && !residents.dialog.open && !voice.dialog.open) prompt.focus(); });
    return sendDone;
  }
  composer.onsubmit = event => { event.preventDefault(); void sendMessage(); };
  prompt.oninput = () => { rememberDraft(); update(); };
  prompt.onkeydown = event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && !event.repeat) { event.preventDefault(); event.stopPropagation(); void sendMessage(); }
    else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); void close(); }
  };
  target.onchange = () => void choose(target.value);
  launcher.onclick = open; collapse.onclick = () => void close();
  cancel.onclick = () => { void cancelWork().catch(fail); };
  voiceButton.onclick = () => showDialog(voice.dialog, voiceButton);
  for (const modal of [residents, voice]) {
    modal.done.onclick = () => hideDialog(modal.dialog);
    modal.dialog.addEventListener('cancel', event => { event.preventDefault(); hideDialog(modal.dialog); });
  }
  spawnForm.onsubmit = event => {
    event.preventDefault(); if (spawn.disabled) return;
    const requested = { name: name.value.trim(), goals: goals.value.split('\n').map(value => value.trim()).filter(Boolean), appearancePrompt: appearance.value.trim(), respondToWorldChat: worldChat.input.checked, localOnly: localOnly.input.checked, shared: shared.input.checked };
    if (!requested.name) { residentStatus.textContent = 'Give the resident a name.'; name.focus(); return; }
    if (requested.goals.length > 16) { residentStatus.textContent = 'Use at most 16 goals or context lines.'; return; }
    if (requested.appearancePrompt.length > 1000) { residentStatus.textContent = 'Use at most 1000 characters for physical appearance.'; appearance.focus(); return; }
    const requestedMode = movement.value;
    void mutation(async () => {
      await onSpawn(requested);
      if (disposed) return;
      if (selected?.local && typeof onMovement === 'function') { await onMovement({ key: selected.key, mode: requestedMode }); movementByKey.set(selected.key, requestedMode); }
      name.value = goals.value = appearance.value = ''; hideDialog(residents.dialog, false); open();
    });
  };
  voiceEnabled.input.onchange = async () => {
    if (disposed || closing) return;
    const value = voiceEnabled.input.checked, epoch = ++voiceEpoch;
    voiceState = { ...voiceState, preparing: value && !voiceState.enabled }; update();
    try { await onVoice?.(value); }
    catch (error) { if (epoch === voiceEpoch) { voiceState = { ...voiceState, preparing: false }; fail(error); } }
    finally { update(); }
  };
  talk.onclick = async () => {
    if (talk.disabled || !selected) return;
    const recording = !(voiceState.recording || recordIntent), epoch = ++recordEpoch;
    recordIntent = recording; recordPending = true; update();
    try { await onRecord({ key: selected.key, recording, voiceReply: speak.input.checked }); }
    catch (error) { if (epoch === recordEpoch) fail(error); }
    finally { if (epoch === recordEpoch) { recordIntent = false; recordPending = false; } update(); }
  };
  const onKeyDown = event => {
    if (disposed || !enabled || event.defaultPrevented || event.isComposing || event.repeat || event.ctrlKey || event.metaKey || event.altKey
        || editable(event.target) || event.target?.closest?.('button,[role="button"],dialog,[role="dialog"]') || document.querySelector('dialog[open]')) return;
    if (event.key === 'Enter') { event.preventDefault(); event.stopImmediatePropagation(); open(); }
    else if (event.key === 'Escape' && expanded) { event.preventDefault(); event.stopImmediatePropagation(); void close(); }
  };
  window.addEventListener('keydown', onKeyDown, true);
  root.addEventListener('keydown', event => { if (expanded || residents.dialog.open || voice.dialog.open) event.stopPropagation(); });
  root.addEventListener('focusin', signalOpen);
  root.addEventListener('focusout', () => queueMicrotask(() => {
    if (disposed || !expanded || active() || closing || document.activeElement === document.body || root.contains(document.activeElement)) return;
    rememberDraft(); expanded = false; update();
  }));
  renderTargets(); renderMessages(); update();
  return { element: root, dialog: residents.dialog, open, close, openResidents, openModels, select, setAgents, setMessages,
    appendMessage(role, value) { setMessages([...(histories.get(hostKey) ?? []), { role, text: value }]); },
    appendRoomMessage,
    setRoomMessages(next) { roomMessages = []; for (const message of Array.isArray(next) ? next.slice(-64) : []) appendRoomMessage(message); if (!selected) renderMessages(); },
    setRoomLabel(value) { roomLabel = text(value, 80); renderTargets(); },
    setRoomStatus(value) { roomStatus = text(value); update(); },
    setRoomDelivery(value) { roomStatus = text(typeof value === 'string' ? value : value?.message ?? value?.status); update(); },
    setStatus(value) { agentStatus = text(value); if (!hostKey) worldStatus = agentStatus; residentStatus.textContent = voiceStatus.textContent = agentStatus; update(); },
    setBusy(value) { busy = Boolean(value); update(); },
    setVoiceStatus(value) {
      if (disposed) return;
      const before = voiceState.enabled;
      voiceState = { enabled: Boolean(value?.enabled), recording: Boolean(value?.recording), preparing: Boolean(value?.preparing) };
      if (voiceState.enabled && !before) speak.input.checked = true;
      if (!voiceState.enabled) speak.input.checked = false;
      update();
    },
    setEnabled(value) { enabled = Boolean(value); if (!enabled) { expanded = false; hideDialog(residents.dialog, false); hideDialog(voice.dialog, false); } update(); },
    getTarget: currentKey,
    get selectedKey() { return selected?.key ?? null; },
    dispose() {
      if (disposed) return;
      disposed = true; voiceEpoch++; recordEpoch++; window.removeEventListener('keydown', onKeyDown, true);
      roomSendController?.abort(new DOMException('Room chat closed', 'AbortError'));
      hideDialog(residents.dialog, false); hideDialog(voice.dialog, false); root.remove();
      drafts.clear(); histories.clear(); movementByKey.clear(); restores.clear(); captionPrimed.clear(); agents = []; roomMessages = [];
    }
  };
}
