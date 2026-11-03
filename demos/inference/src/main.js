import { mountInferencePanel } from './agentPanel.js';

const canvas = document.querySelector('#scene');
const context = canvas.getContext('2d');
context.fillStyle = '#f4f1dd'; context.fillRect(0, 0, 256, 128);
context.fillStyle = '#e93037'; context.fillRect(24, 24, 80, 80);
context.fillStyle = '#287bec'; context.beginPath(); context.arc(185, 64, 40, 0, Math.PI * 2); context.fill();
try {
  window.inferencePanel = await mountInferencePanel({ container: document.querySelector('#panel'),
    autoConnect: true,
    getContext: ({ includeImage }) => ({ text: 'This demo shows a simple scene. Describe what you can observe.',
      ...(includeImage ? { image: { data: new Uint8Array(context.getImageData(0, 0, 256, 128).data),
        width: 256, height: 128, channels: 4 } } : {}) }),
  });
} catch (error) {
  const message = document.createElement('p'); message.textContent = error.message; document.querySelector('#panel').append(message);
}
