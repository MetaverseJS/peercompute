import { UlgDispatchServiceHost } from '@peercompute';

let host = null;

function bindHost(manifest) {
  host = new UlgDispatchServiceHost(manifest);
  host.addEventListener('message', (event) => {
    self.postMessage(event.data);
  });
  host.addEventListener('error', (error) => {
    self.postMessage({
      type: 'task-error',
      error: error?.message || String(error)
    });
  });
  return host;
}

self.addEventListener('message', (event) => {
  const message = event.data || {};
  if (!host) {
    bindHost(message.manifest || {
      serviceId: 'moonlab-ulg-fixture',
      metadata: {
        domain: 'moonlab',
        acceptedArtifactKinds: ['quantum-response']
      },
      childWorkers: {
        allowed: false,
        allowedModules: []
      }
    });
  }
  host.postMessage(message);
});
