/** CubeChat's shell and small, purpose-specific settings windows. */
export const cubeShell = `
  <div id="loading" role="button" tabindex="0" aria-label="Start CubeChat">
    <h1>CubeChat</h1><p>Initializing P2P Network...</p>
    <p>Click or tap to enter</p><p>WASD to move · Enter to chat · Select a resident to talk</p>
  </div>
  <div id="scene-container"></div><div id="event-log"></div>
  <button id="vr-button" style="display:none">Enter VR</button>
  <button id="settings-button" aria-label="Settings" aria-haspopup="dialog">☰</button>
  <dialog id="settings-menu" class="cube-settings" aria-labelledby="cube-settings-title">
    <header><h2 id="cube-settings-title">CubeChat</h2><button data-close-settings>Done</button></header>
    <nav aria-label="World controls">
      <button data-settings-section="player">Player &amp; controls</button>
      <button data-settings-section="world">World &amp; rooms</button>
      <button data-settings-section="media">Camera, voice &amp; screen</button>
      <button data-world-action="residents">Residents</button>
      <button data-world-action="models">Models</button>
    </nav>
    <p class="cube-settings-note">Enter opens chat. Type to everyone in the room, or select a resident for a direct conversation. Escape returns to the world.</p>
  </dialog>
  <dialog id="player-settings" class="cube-settings" aria-labelledby="cube-player-title">
    <header><h2 id="cube-player-title">Player &amp; controls</h2><button data-close-settings>Done</button></header>
    <label>Name<input id="player-name" maxlength="20" placeholder="Anonymous"></label>
    <label>Color<input type="color" id="player-color"></label>
    <label>Mass<input type="number" id="player-mass" min="0.1" max="100" step="0.1" value="5"></label>
    <label class="cube-check"><input type="checkbox" id="invert-mouse"> Invert mouse Y-axis</label>
    <button id="save-settings">Save player</button>
  </dialog>
  <dialog id="world-settings" class="cube-settings" aria-labelledby="cube-world-title">
    <header><h2 id="cube-world-title">World &amp; rooms</h2><button data-close-settings>Done</button></header>
    <label>Theme<select id="world-theme"></select></label>
    <p class="cube-settings-note">Theme changes are shared with this room.</p>
    <label>Room name<input id="room-name" maxlength="80" placeholder="global"></label>
    <label>Privacy<select id="room-privacy"><option value="public">Public</option><option value="private">Private</option></select></label>
    <label>Password (private rooms)<input type="password" id="room-password"></label>
    <div class="room-actions"><button id="room-create">Create</button><button id="room-join">Join</button><button id="room-list-open">Room list</button></div>
    <p id="room-status" role="status"></p>
  </dialog>
  <dialog id="media-settings" class="cube-settings" aria-labelledby="cube-media-title">
    <header><h2 id="cube-media-title">Camera, voice &amp; screen</h2><button data-close-settings>Done</button></header>
    <label class="cube-check"><input id="camera-enabled" type="checkbox"> Share camera</label>
    <label class="cube-check"><input id="microphone-enabled" type="checkbox"> Share microphone with nearby players</label>
    <p id="media-status" class="cube-settings-note"></p>
    <label>Screen height<input type="number" id="screen-height" min="10" max="1000" step="10" value="100"></label>
    <button id="screen-share-toggle">Share screen</button><p id="screen-share-status" role="status"></p>
    <p class="cube-settings-note">Resident speech uses the voice options in chat. Player microphone audio uses proximity chat.</p>
  </dialog>
  <dialog id="room-list" class="cube-settings" aria-labelledby="cube-rooms-title">
    <header><h2 id="cube-rooms-title">Available rooms</h2><button id="room-list-close" data-close-settings>Done</button></header>
    <button id="room-list-refresh">Refresh</button><div id="room-list-items"></div>
  </dialog>`;

export function createCubeSettingsUi({ container = document, beforeOpen = () => {}, onResidents, onModels } = {}) {
  const ids = { menu: 'settings-menu', player: 'player-settings', world: 'world-settings', media: 'media-settings', rooms: 'room-list' };
  const dialogs = Object.fromEntries(Object.entries(ids).map(([key, id]) => [key, container.querySelector(`#${id}`)]));
  const controller = new AbortController();
  let closed = false, previousFocus;
  const close = () => { Object.values(dialogs).forEach(dialog => { if (dialog.open) dialog.close(); }); };
  const open = (section = 'menu') => {
    if (closed) return;
    const dialog = dialogs[section]; if (!dialog) return;
    if (!Object.values(dialogs).some(value => value.open)) previousFocus = document.activeElement;
    beforeOpen(); close(); dialog.showModal();
  };
  const listen = (node, type, fn) => node?.addEventListener(type, fn, { signal: controller.signal });
  listen(container.querySelector('#settings-button'), 'click', () => open());
  for (const dialog of Object.values(dialogs)) {
    for (const button of dialog.querySelectorAll('[data-close-settings]')) listen(button, 'click', close);
    listen(dialog, 'close', () => {
      if (!closed && !Object.values(dialogs).some(value => value.open) && document.activeElement === document.body) previousFocus?.focus?.();
    });
    for (const button of dialog.querySelectorAll('[data-settings-section]')) listen(button, 'click', () => open(button.dataset.settingsSection));
    for (const button of dialog.querySelectorAll('[data-world-action]')) listen(button, 'click', () => {
      close(); Promise.resolve(button.dataset.worldAction === 'residents' ? onResidents?.() : onModels?.()).catch(() => {});
    });
  }
  return { open, close, dispose() { closed = true; controller.abort(); close(); } };
}
