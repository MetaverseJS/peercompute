import './networkStatus.css';

const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
const count = (value) => Number.isSafeInteger(value) && value >= 0 ? value : null;
const boundedMessage = (value) => String(value?.message ?? value ?? '').trim().slice(0, 256);

/** Display-only network diagnostics. The owner supplies discovery snapshots. */
export function createNetworkStatus({ container } = {}) {
  if (!container?.append) throw new TypeError('A network status container is required');
  const trigger = node('button', 'pc-network-trigger'); trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Network status'); trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  for (const [tag, attributes] of [
    ['path', { d: 'M12 8v4M5 16v-4h14v4' }],
    ['rect', { x: '9', y: '2', width: '6', height: '6', rx: '1' }],
    ['rect', { x: '2', y: '16', width: '6', height: '6', rx: '1' }],
    ['rect', { x: '16', y: '16', width: '6', height: '6', rx: '1' }],
  ]) {
    const shape = document.createElementNS(svg.namespaceURI, tag);
    for (const [name, value] of Object.entries(attributes)) shape.setAttribute(name, value);
    svg.append(shape);
  }
  trigger.append(svg);

  const element = node('section', 'pc-network-popover'); element.id = `pc-network-${crypto.randomUUID()}`;
  element.setAttribute('role', 'dialog'); element.setAttribute('aria-modal', 'false'); element.tabIndex = -1; element.hidden = true;
  const nativePopover = typeof element.showPopover === 'function';
  if (nativePopover) element.setAttribute('popover', 'manual');
  trigger.setAttribute('aria-controls', element.id);
  const heading = node('h2', '', 'Network status'); heading.id = `${element.id}-title`;
  element.setAttribute('aria-labelledby', heading.id);
  const dismiss = node('button', 'pc-network-close', '×'); dismiss.type = 'button'; dismiss.setAttribute('aria-label', 'Close network status');
  const header = node('div', 'pc-network-header'); header.append(heading, dismiss);
  const stateLabel = node('p', 'pc-network-state');
  const status = node('p', 'pc-network-summary'); status.id = `${element.id}-status`;
  status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
  element.setAttribute('aria-describedby', status.id); element.append(header, stateLabel, status);
  container.append(trigger, element);
  let open = false, disposed = false, lastText = '';

  function position() {
    if (!open || disposed) return;
    const viewport = window.visualViewport;
    const originX = viewport?.offsetLeft ?? 0, originY = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? window.innerWidth, height = viewport?.height ?? window.innerHeight;
    const gap = 8, availableWidth = Math.max(1, width - gap * 2), availableHeight = Math.max(1, height - gap * 2);
    element.style.width = `${Math.min(360, availableWidth)}px`;
    element.style.maxHeight = `${availableHeight}px`;
    const anchor = trigger.getBoundingClientRect(), box = element.getBoundingClientRect();
    const minX = originX + gap, maxX = originX + width - gap - box.width;
    const minY = originY + gap, maxY = originY + height - gap - box.height;
    const below = anchor.bottom + gap;
    const preferredY = below <= maxY ? below : anchor.top - gap - box.height;
    element.style.left = `${Math.max(minX, Math.min(anchor.right - box.width, maxX))}px`;
    element.style.top = `${Math.max(minY, Math.min(preferredY, maxY))}px`;
  }
  function close({ restoreFocus = true } = {}) {
    if (!open) return;
    const ownedFocus = element.contains(document.activeElement) || document.activeElement === trigger;
    open = false; trigger.setAttribute('aria-expanded', 'false');
    if (nativePopover && element.matches(':popover-open')) element.hidePopover();
    element.hidden = true;
    if (restoreFocus && ownedFocus && trigger.isConnected && !trigger.disabled && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
  }
  function show() {
    if (disposed || open || !trigger.isConnected || trigger.disabled) return;
    open = true; element.hidden = false; trigger.setAttribute('aria-expanded', 'true');
    if (nativePopover) element.showPopover();
    position(); element.focus({ preventScroll: true });
  }
  function onTrigger() { if (open) close(); else show(); }
  function onOutside(event) {
    if (!open || event.composedPath().includes(element) || event.composedPath().includes(trigger)) return;
    close({ restoreFocus: false });
  }
  function onKey(event) {
    if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
  }
  function onToggle() {
    // Browser-owned closure must not leave a stale expanded icon. Ignore queued
    // toggle events from an earlier opening after immediate reopen.
    if (nativePopover && open && !element.matches(':popover-open')) close();
  }
  trigger.addEventListener('click', onTrigger);
  dismiss.addEventListener('click', close);
  document.addEventListener('pointerdown', onOutside, true);
  document.addEventListener('keydown', onKey);
  element.addEventListener('toggle', onToggle);
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);
  window.visualViewport?.addEventListener('resize', position);
  window.visualViewport?.addEventListener('scroll', position);

  function update(info = {}) {
    if (disposed) return lastText;
    const connected = info.connected === true, connecting = info.connecting === true;
    const peers = count(info.peerCount), shared = count(info.sharedModelCount), hosted = count(info.hostedModelCount);
    const issue = boundedMessage(info.issue), artifactError = boundedMessage(info.artifacts?.error);
    const artifactState = info.artifacts?.status;
    const artifactPending = Boolean(artifactState && artifactState !== 'ready');
    const state = !connected && !connecting ? 'offline'
      : connected && !connecting && peers > 0 && shared > 0 && hosted > 0 && !issue && !artifactError && !artifactPending ? 'healthy' : 'pending';
    const label = { healthy: 'Healthy', pending: 'Pending', offline: 'Offline' }[state];
    const text = connected ? `Peer network connected${peers !== null ? ` · ${peers} peers` : ' · peer count unknown'}`
      + ` · ${shared !== null ? shared : 'Unknown'} shared models · ${hosted !== null ? hosted : 'Unknown'} hosted models.`
      : connecting ? 'Connecting to peer network…' : 'Peer network is offline.';
    const notes = [text];
    if (issue) notes.push('Discovery issue: ' + issue);
    else if (connected && peers === 0) notes.push('Waiting for other peers.');
    else if (connected && hosted === 0) notes.push('No peer is currently advertising a loaded model for inference.');
    if (artifactState === 'starting') notes.push('File sharing is preparing stored models. Inference discovery remains available.');
    if (artifactState === 'error' || artifactError) notes.push('File sharing unavailable: ' + (artifactError || 'Initialization failed'));
    else if (connected && artifactState === 'offline') notes.push('File sharing is offline. Inference discovery remains available.');
    lastText = notes.join(' ');
    trigger.dataset.state = element.dataset.state = state;
    trigger.title = `Network status — ${label}`;
    trigger.setAttribute('aria-description', `Network state: ${label}.`);
    stateLabel.textContent = label;
    if (status.textContent !== lastText) status.textContent = lastText;
    position(); return lastText;
  }
  update();
  return { trigger, element, status, update, close,
    dispose() {
      if (disposed) return;
      close({ restoreFocus: false }); disposed = true;
      trigger.removeEventListener('click', onTrigger); dismiss.removeEventListener('click', close);
      document.removeEventListener('pointerdown', onOutside, true); document.removeEventListener('keydown', onKey);
      element.removeEventListener('toggle', onToggle);
      window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true);
      window.visualViewport?.removeEventListener('resize', position); window.visualViewport?.removeEventListener('scroll', position);
      element.remove(); trigger.remove();
    },
  };
}
