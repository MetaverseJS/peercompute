import { resolveOverviewUrl } from './consoleNavigation.js';

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

function dialog(title) {
  const element = node('dialog', undefined, 'pc-model-dialog');
  const heading = node('h2', title); heading.id = `model-dialog-${crypto.randomUUID()}`;
  element.setAttribute('aria-labelledby', heading.id);
  const done = button('Done'); done.autofocus = true; done.onclick = () => element.close();
  const header = node('div', undefined, 'pc-dialog-header'); header.append(heading, done);
  const body = node('div', undefined, 'pc-dialog-body');
  const status = node('p', '', 'pc-inference-status'); status.setAttribute('role', 'status');
  element.append(header, body, status);
  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...element.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')]
      .filter((control) => !control.disabled && control.tabIndex >= 0 && control.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault(); (event.shiftKey ? last : first)?.focus();
    }
  });
  return { element, body, status };
}

export function formatModelBytes(bytes) {
  if (!Number.isSafeInteger(bytes) || bytes < 0) return 'Unknown size';
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
  return `${Math.ceil(bytes / 1024)} KiB`;
}

export function sortModelPackages(models) {
  const size = (model) => Number.isSafeInteger(model.totalBytes) && model.totalBytes >= 0 ? model.totalBytes : Infinity;
  return [...models].sort((left, right) => (size(left) - size(right))
    || String(left.name).localeCompare(String(right.name))
    || String(left.key ?? left.manifestCid).localeCompare(String(right.key ?? right.manifestCid)));
}

export function createPanelView(container) {
  const panel = node('section', undefined, 'pc-inference-panel'); panel.setAttribute('aria-label', 'Model chat');
  const navigation = node('nav', undefined, 'pc-console-navigation'); navigation.setAttribute('aria-label', 'Console navigation');
  const back = node('a', '←', 'pc-console-back'); back.href = resolveOverviewUrl(location.href);
  back.setAttribute('aria-label', 'Back to demo overview'); back.title = 'Back to demo overview';
  const menu = button('☰', 'Menu'); menu.title = 'Menu';
  navigation.append(back, menu); panel.append(navigation);
  const sourceFilter = node('input'); sourceFilter.type = 'search'; sourceFilter.placeholder = 'Filter models';
  sourceFilter.setAttribute('aria-label', 'Filter models'); sourceFilter.maxLength = 256;
  const source = node('select'); source.setAttribute('aria-label', 'Model and source');
  const acquire = button('Load'), stored = button('Stored Models'), configure = button('Config', 'Configure model chat');
  const settings = dialog('Config'), library = dialog('Stored Models'), help = dialog('Model setup'), aboutWindow = dialog('About PeerCompute');
  const menuDialog = dialog('Menu'), menuWindow = menuDialog.element;
  menuWindow.classList.add('pc-console-menu');
  const aboutButton = button('About'), install = button('Install'); install.hidden = true;
  menuDialog.body.append(stored, configure, aboutButton, install);
  const about = aboutWindow.element;
  aboutWindow.body.append(node('p', 'PeerCompute runs models in your browser using WebGPU. You can chat with a model on this device or use inference hosted by another peer.'));
  aboutWindow.body.append(node('p', 'Model files are identified by their content and shared over IPFS. File sharing and hosted inference are available while the hosting browser stays online.'));
  const aboutLinks = node('ul', undefined, 'pc-about-links');
  for (const [text, href] of [['Tsotchke-Corporation on Hugging Face', 'https://huggingface.co/Tsotchke-Corporation'],
    ['tsotchke.org', 'https://tsotchke.org'], ['tsotchke.net', 'https://tsotchke.net']]) {
    const anchor = node('a', text); anchor.href = href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
    const item = node('li'); item.append(anchor); aboutLinks.append(item);
  }
  aboutWindow.body.append(aboutLinks);
  const configuration = settings.element, storedModels = library.element;
  const compatibility = help.element;
  const helpModel = node('strong'), helpReason = node('p', '', 'pc-inference-note');
  const helpBrowser = node('select'), helpOs = node('select');
  helpBrowser.setAttribute('aria-label', 'Browser'); helpOs.setAttribute('aria-label', 'Operating system');
  for (const [value, text] of [['chrome', 'Chrome'], ['chromium', 'Chromium'], ['edge', 'Edge'], ['brave', 'Brave'], ['firefox', 'Firefox'], ['safari', 'Safari'], ['other', 'Other browser']]) {
    const option = node('option', text); option.value = value; helpBrowser.append(option);
  }
  for (const [value, text] of [['linux', 'Linux'], ['windows', 'Windows'], ['macos', 'macOS'], ['android', 'Android'], ['ios', 'iOS / iPadOS'], ['other', 'Other system']]) {
    const option = node('option', text); option.value = value; helpOs.append(option);
  }
  const helpEnvironment = node('div', undefined, 'pc-config-grid');
  helpEnvironment.append(label('Browser', helpBrowser), label('Operating system', helpOs));
  const helpDetails = node('div', undefined, 'pc-model-help-details');
  const helpCommand = node('textarea'); helpCommand.readOnly = true; helpCommand.rows = 3;
  helpCommand.setAttribute('aria-label', 'Browser launch command'); helpCommand.spellcheck = false;
  const helpCopy = button('Copy command'), helpConfig = button('Open Config');
  const helpCommandGroup = node('div', undefined, 'pc-model-help-command'); helpCommandGroup.append(helpCommand, helpCopy);
  help.body.append(helpModel, helpReason, helpEnvironment,
    node('p', 'Browser detection is approximate. Adjust these choices if needed.', 'pc-inference-note'),
    helpDetails, helpCommandGroup, helpConfig);
  for (const [trigger, modal] of [[configure, configuration], [stored, storedModels], [aboutButton, about], [menu, menuWindow]]) {
    modal.id = `model-window-${crypto.randomUUID()}`;
    trigger.setAttribute('aria-controls', modal.id); trigger.setAttribute('aria-haspopup', 'dialog');
  }
  const top = node('div', undefined, 'pc-model-toolbar'); top.append(sourceFilter, source, acquire); panel.append(top);
  const sourceStatus = node('p', '', 'pc-model-availability'); sourceStatus.setAttribute('aria-live', 'polite');
  sourceStatus.id = `model-availability-${crypto.randomUUID()}`;
  source.setAttribute('aria-describedby', sourceStatus.id); panel.append(sourceStatus);
  const sourceHelp = button('Setup help', 'Set up selected model'); sourceHelp.hidden = true;
  sourceHelp.className = 'pc-source-help'; panel.append(sourceHelp);
  const discoveryStatus = node('p', 'Connecting to peer network…', 'pc-network-summary');
  discoveryStatus.setAttribute('aria-live', 'polite'); panel.append(discoveryStatus);
  const sharing = node('input'); sharing.type = 'checkbox'; sharing.checked = true;
  const hosting = node('input'); hosting.type = 'checkbox'; hosting.checked = true;
  const toggles = node('div', undefined, 'pc-model-preferences');
  const sharingLabel = label('Share with peers', sharing); sharingLabel.prepend(sharing);
  sharingLabel.title = 'Share imported model files with connected peers while this browser stays online.';
  const hostingLabel = label('Host inference', hosting); hostingLabel.prepend(hosting);
  hostingLabel.title = 'Allow connected peers to send requests to the model loaded on this device.';
  toggles.append(sharingLabel, hostingLabel); settings.body.append(toggles);
  const status = node('p', 'Opening model chat…', 'pc-inference-status'); status.setAttribute('role', 'status'); panel.append(status);
  const gpuLayers = node('input'); gpuLayers.type = 'number'; gpuLayers.min = '1'; gpuLayers.max = '99999'; gpuLayers.value = '99999';
  gpuLayers.setAttribute('aria-label', 'GGUF GPU layer limit');
  const limits = node('div', undefined, 'pc-config-grid');
  const cpuBudget = node('input'), gpuBudget = node('input');
  for (const input of [cpuBudget, gpuBudget]) {
    input.type = 'number'; input.min = '0'; input.max = '1024'; input.step = 'any'; input.placeholder = 'Auto';
  }
  limits.append(label('Model RAM budget (GiB)', cpuBudget), label('Model GPU memory budget (GiB)', gpuBudget));
  const memoryNote = node('p', '', 'pc-inference-note'); settings.body.append(limits, memoryNote);
  const gpuLimits = node('div', undefined, 'pc-config-grid');
  gpuLimits.append(label('GGUF GPU layers', gpuLayers)); settings.body.append(gpuLimits);
  settings.body.append(node('p', '99999 uses all GPU layers. The 27B model was tested with 56 layers on an RTX 5060 Ti (16 GB), with a compatible browser.', 'pc-inference-note'));
  const relay = node('input'); relay.placeholder = 'Optional relay multiaddress'; relay.setAttribute('aria-label', 'Artifact relay multiaddress');
  const connect = button('Connect'); const network = node('div', undefined, 'pc-config-row'); network.append(relay, connect); settings.body.append(network);
  const networkStatus = node('p', '', 'pc-inference-note'); settings.body.append(networkStatus);
  const file = node('input'); file.type = 'file'; file.setAttribute('aria-label', 'Pin a file locally'); settings.body.append(label('Pin a file locally', file));
  const unload = button('Unload local model'); settings.body.append(unload);
  const clearChat = button('Clear conversation'); settings.body.append(clearChat);
  settings.body.append(node('p', 'Clear chat history to start a new conversation while keeping the loaded model and stored files.', 'pc-inference-note'));
  library.body.append(node('p', 'Load uses the files already on this device and replaces the current local model. Delete removes a model and unloads it if needed. Files used by other stored models or pinned separately are kept.', 'pc-inference-note'));
  const storedList = node('ul', undefined, 'pc-stored-models'); storedList.setAttribute('aria-label', 'Stored model packages');
  const storedRefresh = button('Refresh'), storedCancel = button('Stop loading'); storedCancel.hidden = true;
  library.body.append(storedList, storedRefresh, storedCancel);
  const transcript = node('div', undefined, 'pc-inference-transcript');
  transcript.setAttribute('role', 'log'); transcript.setAttribute('aria-label', 'Conversation'); transcript.setAttribute('aria-live', 'polite');
  const empty = node('p', 'Load a model or choose an available peer to start chatting.', 'pc-chat-empty'); transcript.append(empty); panel.append(transcript);
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
  panel.append(configuration, storedModels, compatibility, about, menuWindow); container.append(panel);
  return { panel, sourceFilter, source, sourceStatus, sourceHelp, discoveryStatus, acquire, stored, configure, sharing, hosting, status, configuration,
    configurationStatus: settings.status, storedModels, storedList, storedRefresh, storedCancel, storedStatus: library.status, gpuLayers,
    back, menu, menuWindow, menuStatus: menuDialog.status, about, aboutButton, install,
    compatibility, helpModel, helpReason, helpBrowser, helpOs, helpDetails, helpCommandGroup, helpCommand, helpCopy, helpConfig, helpStatus: help.status,
    cpuBudget, gpuBudget, memoryNote,
    relay, connect, networkStatus, file, unload, clearChat, transcript, empty, proposed, attachment, attachmentImage,
    attachmentName, removeAttachment, prompt, target, attach, imageFile, send, cancel };
}

export function renderModelCompatibilityHelp(view, help) {
  view.helpModel.textContent = help.name;
  view.helpReason.textContent = help.reason;
  view.helpDetails.replaceChildren();
  for (const paragraph of help.paragraphs) view.helpDetails.append(node('p', paragraph, 'pc-inference-note'));
  if (help.steps.length) {
    const steps = node('ol');
    for (const step of help.steps) steps.append(node('li', step));
    view.helpDetails.append(steps);
  }
  for (const link of help.links) {
    const anchor = node('a', link.label); anchor.href = link.url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
    const paragraph = node('p', undefined, 'pc-inference-note'); paragraph.append(anchor); view.helpDetails.append(paragraph);
  }
  view.helpCommand.value = help.command ?? '';
  view.helpCommandGroup.hidden = !help.command;
  view.helpConfig.hidden = !help.openConfig;
  view.helpStatus.textContent = '';
}

export function renderStoredModels(view, models, onDelete, onLoad) {
  view.storedList.replaceChildren();
  if (!models.length) view.storedList.append(node('li', 'No models stored on this device.', 'pc-stored-empty'));
  for (const model of sortModelPackages(models)) {
    const row = node('li', undefined, 'pc-stored-model');
    const details = node('div'); details.append(node('strong', model.name));
    const metadata = [formatModelBytes(model.totalBytes), ...(model.loaded ? ['Loaded'] : []), ...(model.shared ? ['Shared'] : []),
      ...(model.cleanupPending ? ['Cleanup pending'] : [])];
    details.append(node('p', metadata.join(' · '), 'pc-inference-note'));
    if (model.shareError) details.append(node('p', `Sharing unavailable: ${String(model.shareError).slice(0, 256)}`, 'pc-inference-note'));
    const blocked = ['checking', 'unavailable'].includes(model.localAvailability?.status);
    if (blocked) details.append(node('p', String(model.localAvailability.reason || 'This model is unavailable on this device.').slice(0, 512), 'pc-inference-note'));
    const load = button(model.loaded ? 'Loaded' : 'Load', `${model.loaded ? 'Loaded' : 'Load'} ${model.name}`);
    load.dataset.inactive = String(Boolean(model.loaded || model.cleanupPending || blocked || !onLoad));
    load.disabled = load.dataset.inactive === 'true'; load.onclick = () => onLoad?.(model);
    const removeLabel = model.cleanupPending ? 'Retry delete' : 'Delete';
    const remove = button(removeLabel, `${removeLabel} ${model.name}`); remove.className = 'pc-delete-model';
    const actions = node('div', undefined, 'pc-stored-actions'); actions.append(load, remove);
    remove.onclick = () => onDelete(model); row.append(details, actions); view.storedList.append(row);
  }
}

export function appendMessage(view, role, text, { image, targetName } = {}) {
  view.empty.remove();
  const message = node('article', undefined, `pc-chat-message pc-chat-message-${role}`);
  message.append(node('span', role === 'user' ? 'YOU' : targetName || 'MODEL', 'pc-chat-speaker'));
  if (image) { const preview = node('img'); preview.src = image; preview.alt = 'Attached image'; preview.className = 'pc-chat-image'; message.append(preview); }
  const body = node('p', text); message.append(body); view.transcript.append(message); return body;
}
