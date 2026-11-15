import { createBrowserRoot } from './createBrowserRoot.js';

// Startup is explicit through the owned supervisor. Loading this document does
// not fetch configuration, connect to public peers or acquire any model.
window.peercomputeRoot = createBrowserRoot();
window.peercomputeRootReady = true;
