import { mountInferencePanel } from './agentPanel.js';

async function startConsole() {
  try {
    window.inferencePanel = await mountInferencePanel({ container: document.querySelector('#panel'), autoConnect: true });
  } catch (error) {
    const message = document.createElement('p'); message.textContent = error.message;
    document.querySelector('#panel').append(message);
  }
}

// Let the entry module finish before manager imports consume its shared chunks.
void startConsole();
