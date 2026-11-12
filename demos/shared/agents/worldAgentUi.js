import './worldAgents.css';

let sequence = 0;
const text = (value, maximum = 2048) => String(value ?? '').slice(0, maximum);
const element = (tag, value, className) => {
  const node = document.createElement(tag);
  if (value !== undefined) node.textContent = value;
  if (className) node.className = className;
  return node;
};
const button = (label) => { const node = element('button', label); node.type = 'button'; return node; };
const checkbox = (label, checked = false) => {
  const input = element('input'); input.type = 'checkbox'; input.checked = checked;
  const wrapper = element('label', undefined, 'pc-world-check'); wrapper.append(input, document.createTextNode(label));
  return { input, wrapper };
};

/** Accessible scene conversation controls. No model execution or storage ownership. */
export function createWorldAgentUi({ worldLabel = 'World', container = document.body,
  onSpawn, onSelect, onSend, onModels, onVoice, onRecord, onCancel, onClose, onRemove, onResume, onOpen, onMind } = {}) {
  const root = element('div', undefined, 'pc-world-agent-ui');
  const launcher = button('Agents'); launcher.className = 'pc-world-agent-launcher';
  const dialog = element('dialog', undefined, 'pc-world-agent-dialog');
  dialog.id = `pc-world-agents-${++sequence}`;
  launcher.setAttribute('aria-haspopup', 'dialog'); launcher.setAttribute('aria-controls', dialog.id);
  const heading = element('h2', `Agents · ${text(worldLabel, 80)}`); heading.id = `${dialog.id}-title`;
  dialog.setAttribute('aria-labelledby', heading.id);
  const header = element('header'), models = button('Models'); header.append(heading, models);
  const status = element('p', '', 'pc-world-agent-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const layout = element('div', undefined, 'pc-world-agent-layout');
  const sidebar = element('aside'); sidebar.setAttribute('aria-label', 'Agents in this world');
  const list = element('div', undefined, 'pc-world-agent-list');
  const empty = element('p', 'No agents are visible here yet.', 'pc-world-agent-note');
  const spawnDetails = element('details', undefined, 'pc-world-agent-spawn');
  spawnDetails.append(element('summary', 'Place an agent'));
  const spawnForm = element('form');
  const name = element('input'); name.required = true; name.maxLength = 240; name.setAttribute('aria-label', 'Agent name'); name.placeholder = 'Agent name';
  const goals = element('textarea'); goals.rows = 3; goals.maxLength = 4096; goals.setAttribute('aria-label', 'Agent goals'); goals.placeholder = 'Goals or context, one per line';
  const localOnly = checkbox('Use only models on this device');
  const shared = checkbox('Let peers talk to this agent', true);
  const routingNote = element('p', 'When local-only is off, selected conversation context may be sent to an inference host.', 'pc-world-agent-note');
  const spawn = button('Place agent'); spawn.type = 'submit';
  spawnForm.append(name, goals, localOnly.wrapper, routingNote, shared.wrapper, spawn); spawnDetails.append(spawnForm);
  sidebar.append(list, empty, spawnDetails);
  const conversation = element('section', undefined, 'pc-world-agent-conversation');
  const agentName = element('h3', 'Select an agent cube');
  const metadata = element('p', 'Choose a cube in the scene or an agent from the list.', 'pc-world-agent-note');
  const ownerActions = element('div', undefined, 'pc-world-agent-actions');
  const resume = button('Resume'), remove = button('Remove body'), mind = button('Mind');
  remove.title = 'Remove this cube from the world. Its saved identity and conversation history remain.';
  ownerActions.append(mind, resume, remove);
  const recovery = element('p', '', 'pc-world-agent-note'); recovery.hidden = true;
  const messages = element('div', undefined, 'pc-world-agent-messages');
  messages.setAttribute('role', 'log'); messages.setAttribute('aria-label', 'Agent conversation'); messages.setAttribute('aria-live', 'polite');
  const composer = element('form', undefined, 'pc-world-agent-composer');
  const prompt = element('textarea'); prompt.rows = 3; prompt.maxLength = 16_000;
  prompt.setAttribute('aria-label', 'Message to agent'); prompt.placeholder = 'Talk to this agent…';
  const send = button('Send'); send.type = 'submit';
  const record = button('Talk'), cancel = button('Cancel');
  const sendActions = element('div', undefined, 'pc-world-agent-actions'); sendActions.append(send, record, cancel);
  const voice = checkbox('Enable voice');
  const voiceNote = element('p', 'Voice models download about 376 MB on first use. Text chat remains available.', 'pc-world-agent-note');
  const voiceReply = checkbox('Speak replies');
  composer.append(prompt, sendActions, voice.wrapper, voiceNote, voiceReply.wrapper);
  conversation.append(agentName, metadata, ownerActions, recovery, messages, composer);
  layout.append(sidebar, conversation);
  const footer = element('footer'), closeButton = button('Close'); footer.append(closeButton);
  dialog.append(header, status, layout, footer); root.append(launcher, dialog); container.append(root);

  let agents = [], selected = null, busy = false, disposed = false, closing = null, restoreFocus = null;
  let sending = false, mutating = false, cancelling = false, selecting = false;
  let voiceState = { enabled: false, recording: false, preparing: false }, recordIntent = false, recordPending = false, voiceEpoch = 0, recordEpoch = 0;
  let messageList = [];
  const active = () => busy || sending;
  const capturing = () => voiceState.recording || recordIntent || recordPending;
  const paused = () => selected?.status === 'paused' || selected?.recoveryRequired === true;
  const setStatus = (value) => { if (!disposed) status.textContent = text(value); };

  function updateControls() {
    const blocked = disposed || Boolean(closing), pending = mutating || selecting;
    launcher.disabled = blocked;
    closeButton.disabled = blocked; closeButton.textContent = closing ? 'Closing…' : 'Close';
    models.disabled = blocked || pending || active() || capturing() || voiceState.preparing;
    name.disabled = goals.disabled = localOnly.input.disabled = shared.input.disabled = blocked || mutating;
    spawn.disabled = blocked || mutating || active() || capturing() || typeof onSpawn !== 'function';
    prompt.disabled = blocked || !selected || paused() || active() || capturing() || pending;
    send.disabled = prompt.disabled || !prompt.value.trim() || typeof onSend !== 'function';
    record.textContent = voiceState.recording || recordIntent ? 'Stop' : 'Talk';
    record.disabled = blocked || !selected || paused() || pending || !voiceState.enabled || voiceState.preparing
      || ((active() || recordPending) && !voiceState.recording && !recordIntent) || typeof onRecord !== 'function';
    cancel.disabled = blocked || cancelling || !(active() || capturing() || voiceState.preparing) || typeof onCancel !== 'function';
    cancel.textContent = cancelling ? 'Cancelling…' : 'Cancel';
    voice.input.disabled = blocked || typeof onVoice !== 'function';
    voice.input.checked = voiceState.enabled || voiceState.preparing;
    voiceReply.input.disabled = blocked || !voiceState.enabled;
    voiceReply.wrapper.hidden = !voiceState.enabled;
    voiceNote.textContent = voiceState.preparing
      ? 'Preparing voice models… Uncheck Enable voice to cancel. Text chat remains available.'
      : voiceState.recording ? 'Listening. Select Stop when you have finished speaking.'
        : 'Voice models download about 376 MB on first use. Text chat remains available.';
    const owned = selected?.local === true;
    ownerActions.hidden = !owned;
    remove.hidden = !owned; remove.disabled = blocked || pending || active() || capturing() || typeof onRemove !== 'function';
    resume.hidden = !owned || !paused(); resume.disabled = blocked || pending || active() || capturing() || typeof onResume !== 'function';
    mind.hidden = !owned || typeof onMind !== 'function'; mind.disabled = blocked || !owned;
    resume.textContent = selected?.recoveryRequired ? 'Acknowledge and resume' : 'Resume';
    recovery.hidden = !paused();
    recovery.textContent = selected?.recoveryRequired
      ? 'The previous request has an unknown outcome. Resume acknowledges it without replaying that request.'
      : owned ? 'This agent is paused. Resume it before starting a new conversation.' : 'This agent is paused by its host.';
    for (const row of list.querySelectorAll('button')) row.disabled = blocked || pending || active() || capturing();
  }

  async function invoke(callback, argument, { mutation = false, selection = false } = {}) {
    if (disposed || closing || typeof callback !== 'function') return;
    if (mutation) { if (mutating) return; mutating = true; }
    if (selection) { if (selecting) return; selecting = true; }
    updateControls();
    try { return await callback(argument); }
    catch (error) { setStatus(error?.message ?? error); }
    finally { if (mutation) mutating = false; if (selection) selecting = false; updateControls(); }
  }

  function renderSelection() {
    agentName.textContent = selected ? text(selected.name, 240) : 'Select an agent cube';
    metadata.textContent = selected
      ? `${selected.local ? 'Hosted on this device' : 'Hosted by a peer'} · ${text(selected.status || 'idle', 32)}`
      : 'Choose a cube in the scene or an agent from the list.';
    for (const row of list.querySelectorAll('button')) row.setAttribute('aria-current', String(row.dataset.agentKey === selected?.key));
    updateControls();
  }

  function setAgents(next) {
    if (disposed) return;
    const focused = list.contains(document.activeElement) ? document.activeElement.dataset.agentKey : null;
    agents = (Array.isArray(next) ? next : []).slice(0, 256).filter(item => item && typeof item.key === 'string' && item.key.length <= 300);
    list.replaceChildren(); empty.hidden = agents.length > 0;
    for (const item of agents) {
      const row = button(''); row.dataset.agentKey = item.key;
      row.append(element('strong', text(item.name, 240)), element('small', item.local ? 'Local agent' : 'Peer agent'));
      row.addEventListener('click', () => { if (!row.disabled) void invoke(onSelect, item.key, { selection: true }); });
      list.append(row);
    }
    if (selected) {
      const fresh = agents.find(item => item.key === selected.key);
      if (fresh) selected = { ...fresh };
      else { selected = null; setMessages([]); }
    }
    renderSelection();
    if (focused) [...list.querySelectorAll('button')].find(row => row.dataset.agentKey === focused)?.focus();
  }

  function select(descriptor) {
    if (disposed) return;
    const changed = selected?.key !== descriptor?.key;
    selected = descriptor ? { ...descriptor } : null;
    if (changed) { setMessages([]); prompt.value = ''; }
    renderSelection();
  }

  function setMessages(next) {
    if (disposed) return;
    messageList = (Array.isArray(next) ? next : []).slice(-32).map(item => {
      const modelLabel = item?.role === 'assistant' && typeof item.modelLabel === 'string' ? text(item.modelLabel, 240).trim() : '';
      return { role: ['user', 'assistant', 'system'].includes(item?.role) ? item.role : 'system', text: text(item?.text, 16_000),
        ...(modelLabel ? { modelLabel } : {}) };
    });
    let budget = 128_000;
    for (let index = messageList.length - 1; index >= 0; index--) {
      messageList[index].text = messageList[index].text.slice(0, Math.max(0, budget)); budget -= messageList[index].text.length;
    }
    messages.replaceChildren();
    for (const message of messageList) {
      const article = element('article');
      article.append(element('strong', message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Agent' : 'Status'));
      if (message.role === 'assistant' && message.modelLabel) {
        const label = element('small', `Model: ${message.modelLabel}`, 'pc-world-agent-note');
        label.dataset.modelLabel = ''; article.append(element('br'), label);
      }
      article.append(element('p', message.text));
      messages.append(article);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    if (send.disabled || sending || disposed) return;
    const content = prompt.value.trim(), key = selected.key;
    sending = true; updateControls();
    try {
      await onSend({ key, text: content, voiceReply: voiceState.enabled && voiceReply.input.checked });
      if (!disposed && selected?.key === key && prompt.value.trim() === content) prompt.value = '';
    } catch (error) { setStatus(error?.message ?? error); }
    finally { sending = false; updateControls(); }
  }

  composer.addEventListener('submit', event => { event.preventDefault(); void sendMessage(); });
  prompt.addEventListener('input', updateControls);
  prompt.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.repeat) return;
    event.preventDefault(); void sendMessage();
  });
  spawnForm.addEventListener('submit', event => {
    event.preventDefault(); if (spawn.disabled) return;
    const agentName = name.value.trim();
    if (!agentName) { setStatus('Give the agent a name.'); name.focus(); return; }
    const requested = { name: agentName, goals: goals.value.split('\n').map(value => value.trim()).filter(Boolean),
      localOnly: localOnly.input.checked, shared: shared.input.checked };
    if (requested.goals.length > 16) { setStatus('Use at most 16 goals or context lines.'); return; }
    void invoke(onSpawn, requested, { mutation: true });
  });
  models.addEventListener('click', () => { if (!models.disabled) void invoke(onModels); });
  remove.addEventListener('click', () => { if (selected?.local && !remove.disabled) void invoke(onRemove, selected.key, { mutation: true }); });
  mind.addEventListener('click', () => { if (selected?.local && !mind.disabled) void invoke(onMind, { key: selected.key, returnFocus: mind }); });
  resume.addEventListener('click', () => { if (selected?.local && !resume.disabled) void invoke(onResume, selected.key, { mutation: true }); });
  cancel.addEventListener('click', async () => {
    if (cancel.disabled) return;
    cancelling = true; updateControls();
    try { await onCancel(); } catch (error) { setStatus(error?.message ?? error); }
    finally { cancelling = false; updateControls(); }
  });
  voice.input.addEventListener('change', async () => {
    if (disposed || closing) return;
    const enabled = voice.input.checked, epoch = ++voiceEpoch;
    voiceState = { ...voiceState, preparing: enabled && !voiceState.enabled };
    updateControls();
    try { await onVoice?.(enabled); }
    catch (error) { if (epoch === voiceEpoch) { voiceState = { ...voiceState, preparing: false }; setStatus(error?.message ?? error); } }
    finally { updateControls(); }
  });
  record.addEventListener('click', async () => {
    if (record.disabled || !selected) return;
    const recording = !(voiceState.recording || recordIntent), epoch = ++recordEpoch;
    recordIntent = recording; recordPending = true; updateControls();
    try { await onRecord({ key: selected.key, recording, voiceReply: voiceReply.input.checked }); }
    catch (error) { if (epoch === recordEpoch) setStatus(error?.message ?? error); }
    finally { if (epoch === recordEpoch) { recordIntent = false; recordPending = false; } updateControls(); }
  });

  function open() {
    if (disposed || dialog.open) return;
    restoreFocus = document.activeElement;
    try { Promise.resolve(onOpen?.()).catch(error => setStatus(error?.message ?? error)); }
    catch (error) { setStatus(error?.message ?? error); }
    dialog.showModal(); renderSelection();
    (selected && !prompt.disabled ? prompt : list.querySelector('button') ?? spawnDetails.querySelector('summary')).focus();
  }
  async function close() {
    if (disposed || !dialog.open) return;
    if (closing) return closing;
    let didClose = false;
    closing = Promise.resolve().then(() => onClose?.()).then(() => {
      if (disposed) return;
      dialog.close(); didClose = true;
    }).catch(error => setStatus(error?.message ?? error)).finally(() => {
      closing = null; updateControls();
      if (didClose && !disposed && restoreFocus?.isConnected && typeof restoreFocus.focus === 'function') restoreFocus.focus();
    });
    updateControls(); return closing;
  }
  launcher.addEventListener('click', open);
  closeButton.addEventListener('click', () => void close());
  dialog.addEventListener('cancel', event => { event.preventDefault(); void close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button,input,textarea,summary,a[href],[tabindex]')]
      .filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  updateControls();
  return { element: root, dialog, open, close, setAgents, select, setMessages, setStatus,
    appendMessage(role, value) { setMessages([...messageList, { role, text: value }]); },
    setBusy(value) { busy = Boolean(value); updateControls(); },
    setVoiceStatus(value) {
      if (disposed) return;
      const wasEnabled = voiceState.enabled;
      voiceState = { enabled: Boolean(value?.enabled), recording: Boolean(value?.recording), preparing: Boolean(value?.preparing) };
      if (voiceState.enabled && !wasEnabled) voiceReply.input.checked = true;
      if (!voiceState.enabled) voiceReply.input.checked = false;
      updateControls();
    },
    dispose() {
      if (disposed) return;
      disposed = true; voiceEpoch++; recordEpoch++;
      if (dialog.open) dialog.close();
      root.remove(); agents = []; selected = null; messageList = [];
    } };
}
