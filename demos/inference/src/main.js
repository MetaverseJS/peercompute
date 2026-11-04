import { mountInferencePanel } from './agentPanel.js';

try {
  window.inferencePanel = await mountInferencePanel({ container: document.querySelector('#panel'), autoConnect: true });
} catch (error) {
  const message = document.createElement('p'); message.textContent = error.message;
  document.querySelector('#panel').append(message);
}
