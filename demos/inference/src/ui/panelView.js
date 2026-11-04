const node = (tag, text, className) => {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (className) result.className = className;
  return result;
};
const button = (text, label) => {
  const result = node('button', text); result.type = 'button';
  if (label) result.setAttribute('aria-label', label);
  return result;
};
const label = (text, control) => { const result = node('label', text); result.append(control); return result; };

export function createPanelView(container, quotas) {
  const panel = node('section', undefined, 'pc-inference-panel'); panel.setAttribute('aria-label', 'Model chat');
  const source = node('select'); source.setAttribute('aria-label', 'Model and source');
  const acquire = button('Import Model'), configure = button('Config', 'Configure model chat');
  const configurationId = `model-config-${crypto.randomUUID()}`;
  configure.setAttribute('aria-controls', configurationId); configure.setAttribute('aria-expanded', 'false');
  const top = node('div', undefined, 'pc-model-toolbar'); top.append(source, acquire, configure); panel.append(top);
  const sharing = node('input'); sharing.type = 'checkbox'; sharing.checked = true;
  const hosting = node('input'); hosting.type = 'checkbox'; hosting.checked = true;
  const toggles = node('div', undefined, 'pc-model-preferences');
  const sharingLabel = label('Share with peers', sharing); sharingLabel.prepend(sharing);
  sharingLabel.title = 'Share imported model files with connected peers while this browser stays online.';
  const hostingLabel = label('Host inference', hosting); hostingLabel.prepend(hosting);
  hostingLabel.title = 'Allow connected peers to send requests to the model loaded on this device.';
  toggles.append(sharingLabel, hostingLabel); panel.append(toggles);
  const status = node('p', 'Opening model chat…', 'pc-inference-status'); status.setAttribute('role', 'status'); panel.append(status);
  const configuration = node('section', undefined, 'pc-model-configuration');
  configuration.id = configurationId; configuration.hidden = true; configuration.setAttribute('aria-label', 'Model configuration');
  const quota = node('select'); quota.setAttribute('aria-label', 'Local artifact storage limit');
  for (const bytes of quotas) { const option = node('option', `${bytes / 1024 ** 3} GiB`); option.value = String(bytes); quota.append(option); }
  const gpuLayers = node('input'); gpuLayers.type = 'number'; gpuLayers.min = '1'; gpuLayers.max = '99999'; gpuLayers.value = '99999';
  gpuLayers.setAttribute('aria-label', 'GGUF GPU layer limit');
  const limits = node('div', undefined, 'pc-config-grid');
  limits.append(label('Storage limit', quota), label('GGUF GPU layers', gpuLayers)); configuration.append(limits);
  configuration.append(node('p', '99999 uses all GPU layers. The 27B model was tested with 56 layers on an RTX 5060 Ti (16 GB), with a compatible browser.', 'pc-inference-note'));
  const relay = node('input'); relay.placeholder = 'Optional relay multiaddress'; relay.setAttribute('aria-label', 'Artifact relay multiaddress');
  const connect = button('Connect'); const network = node('div', undefined, 'pc-config-row'); network.append(relay, connect); configuration.append(network);
  const networkStatus = node('p', '', 'pc-inference-note'); configuration.append(networkStatus);
  const file = node('input'); file.type = 'file'; file.setAttribute('aria-label', 'Pin a file locally'); configuration.append(label('Pin a file locally', file));
  const unload = button('Unload local model'); configuration.append(unload); panel.append(configuration);
  const transcript = node('div', undefined, 'pc-inference-transcript');
  transcript.setAttribute('role', 'log'); transcript.setAttribute('aria-label', 'Conversation'); transcript.setAttribute('aria-live', 'polite');
  const empty = node('p', 'Import a model or choose an available peer to start chatting.', 'pc-chat-empty'); transcript.append(empty); panel.append(transcript);
  const proposed = node('div', undefined, 'pc-inference-actions'); panel.append(proposed);
  const attachment = node('div', undefined, 'pc-chat-attachment'); attachment.hidden = true;
  const attachmentImage = node('img'); attachmentImage.alt = 'Selected image';
  const attachmentName = node('span'); const removeAttachment = button('×', 'Remove attached image');
  attachment.append(attachmentImage, attachmentName, removeAttachment); panel.append(attachment);
  const prompt = node('textarea'); prompt.rows = 2; prompt.maxLength = 16000; prompt.placeholder = 'Message…'; prompt.setAttribute('aria-label', 'Message'); panel.append(prompt);
  const target = node('select'); target.setAttribute('aria-label', 'Chat target');
  const attach = button('+', 'Attach image'); attach.title = 'Attach an image';
  const imageFile = node('input'); imageFile.type = 'file'; imageFile.accept = 'image/png,image/jpeg,image/webp,image/gif'; imageFile.hidden = true; imageFile.setAttribute('aria-label', 'Choose image attachment');
  const send = button('Send'), cancel = button('Stop'); cancel.hidden = true;
  const composer = node('div', undefined, 'pc-chat-controls'); composer.append(target, attach, imageFile, send, cancel); panel.append(composer);
  container.append(panel);
  return { panel, source, acquire, configure, sharing, hosting, status, configuration, quota, gpuLayers,
    relay, connect, networkStatus, file, unload, transcript, empty, proposed, attachment, attachmentImage,
    attachmentName, removeAttachment, prompt, target, attach, imageFile, send, cancel };
}

export function appendMessage(view, role, text, { image, targetName } = {}) {
  view.empty.remove();
  const message = node('article', undefined, `pc-chat-message pc-chat-message-${role}`);
  message.append(node('span', role === 'user' ? 'YOU' : targetName || 'MODEL', 'pc-chat-speaker'));
  if (image) { const preview = node('img'); preview.src = image; preview.alt = 'Attached image'; preview.className = 'pc-chat-image'; message.append(preview); }
  const body = node('p', text); message.append(body); view.transcript.append(message); return body;
}
