/* eslint-disable no-restricted-globals */

import './registerTaskModules.js';
import { installComputeWorkerHost } from '../computeManager/workerTaskHost.js';

// Inference-enabled managed compute worker. Registered as the default worker
// bootstrap URL only when `peercompute` or `peercompute/inference` is imported;
// `peercompute/core` stays on the slim `computeManager/computeWorker.js`.
installComputeWorkerHost(self);
