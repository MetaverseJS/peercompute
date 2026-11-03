/* eslint-disable no-restricted-globals */

import { installComputeWorkerHost } from './workerTaskHost.js';

// A parent that marks workers as required needs a real module-evaluation
// acknowledgement before it is allowed to admit work. This is intentionally
// emitted before the first task so a bad worker URL/import fails closed.
installComputeWorkerHost(self);
