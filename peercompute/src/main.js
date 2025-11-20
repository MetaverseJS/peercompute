import './style.css';
import { createNode, VERSION, NodeKernel } from './peercompute/index.js';

// Expose NodeKernel for tests
window.NodeKernel = NodeKernel;

// Initialize the page
if (document.querySelector('#app')) {
document.querySelector('#app').innerHTML = `
  <div>
    <h1>PeerCompute Demo</h1>
    <p>Version: ${VERSION}</p>
    <div class="card">
      <h2>Node Status</h2>
      <div id="status">Initializing...</div>
      <button id="initButton" type="button">Initialize Node</button>
      <button id="startButton" type="button" disabled>Start Node</button>
      <button id="stopButton" type="button" disabled>Stop Node</button>
    </div>
    <div class="card">
      <h2>Configuration</h2>
      <label>
        Topology:
        <select id="topology">
          <option value="distributed">Distributed</option>
          <option value="hierarchy">Hierarchy</option>
          <option value="emergent">Emergent</option>
        </select>
      </label>
      <label>
        <input type="checkbox" id="enableWebGPU"> Enable WebGPU
      </label>
      <label>
        <input type="checkbox" id="enablePhysics"> Enable Physics
      </label>
      <label>
        <input type="checkbox" id="enableInput"> Enable Input
      </label>
    </div>
    <div class="card">
      <h2>Console</h2>
      <pre id="console"></pre>
    </div>
  </div>
`;

// Global node reference
let node = null;

// Console logging
function log(message) {
  const consoleEl = document.querySelector('#console');
  if (!consoleEl) return;
  const timestamp = new Date().toLocaleTimeString();
  consoleEl.textContent += `[${timestamp}] ${message}\n`;
  consoleEl.scrollTop = consoleEl.scrollHeight;
  console.log(message);
}

// Update status display
function updateStatus() {
  const statusEl = document.querySelector('#status');
  if (!statusEl) return;
  if (!node) {
    statusEl.textContent = 'Not initialized';
    return;
  }
  
  const status = node.getStatus();
  statusEl.textContent = `
Node ID: ${status.nodeId || 'N/A'}
Initialized: ${status.isInitialized}
Topology: ${status.topology}
  `.trim();
}

// Button handlers
document.querySelector('#initButton').addEventListener('click', async () => {
  try {
    log('Initializing PeerCompute node...');
    
    const topology = document.querySelector('#topology').value;
    const enableWebGPU = document.querySelector('#enableWebGPU').checked;
    const enablePhysics = document.querySelector('#enablePhysics').checked;
    const enableInput = document.querySelector('#enableInput').checked;
    
    node = await createNode({
      topology,
      enableWebGPU,
      enablePhysics,
      enableInput
    });
    
    log(`Node initialized with topology: ${topology}`);
    log(`WebGPU: ${enableWebGPU ? 'enabled' : 'disabled'}`);
    log(`Physics: ${enablePhysics ? 'enabled' : 'disabled'}`);
    log(`Input: ${enableInput ? 'enabled' : 'disabled'}`);
    
    updateStatus();
    
    document.querySelector('#initButton').disabled = true;
    document.querySelector('#startButton').disabled = false;
  } catch (error) {
    log(`Error initializing node: ${error.message}`);
  }
});

document.querySelector('#startButton').addEventListener('click', async () => {
  try {
    log('Starting node...');
    await node.start();
    log('Node started successfully');
    
    document.querySelector('#startButton').disabled = true;
    document.querySelector('#stopButton').disabled = false;
    
    updateStatus();
  } catch (error) {
    log(`Error starting node: ${error.message}`);
  }
});

document.querySelector('#stopButton').addEventListener('click', async () => {
  try {
    log('Stopping node...');
    await node.stop();
    log('Node stopped');
    
    document.querySelector('#stopButton').disabled = true;
    document.querySelector('#startButton').disabled = false;
    
    updateStatus();
  } catch (error) {
    log(`Error stopping node: ${error.message}`);
  }
});

log('PeerCompute demo ready');
log('Configure options and click "Initialize Node" to begin');
}
