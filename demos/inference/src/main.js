import { mountInferencePanel } from './agentPanel.js';
import { createPwaInstallController, registerConsoleAppShell } from './pwa.js';

const pwaInstallController = createPwaInstallController();
window.inferencePwa = pwaInstallController;
// Reuse the isolation worker on header-isolated hosts too; dev has no built shell.
if (import.meta.env.PROD) void registerConsoleAppShell().catch(() => {});
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) pwaInstallController.dispose();
});

async function startConsole() {
  try {
    window.inferencePanel = await mountInferencePanel({ container: document.querySelector('#panel'),
      autoConnect: true, pwaInstallController });
  } catch (error) {
    const message = document.createElement('p'); message.textContent = error.message;
    document.querySelector('#panel').append(message);
  }
}

// Let the entry module finish before manager imports consume its shared chunks.
void startConsole();
