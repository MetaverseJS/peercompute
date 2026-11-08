import { GeodataError, isAbortError } from '../errors.js';

function abortReason(signal) {
  if (signal?.reason instanceof Error) return signal.reason;
  return new DOMException('The operation was aborted.', 'AbortError');
}

export class BoundedSemaphore {
  #active = 0;
  #queue = [];

  constructor({
    concurrency,
    maxQueue,
    busyMessage = 'The OSM adapter is busy; retry after a short delay.'
  }) {
    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new RangeError('Semaphore concurrency must be a positive integer.');
    }
    if (!Number.isInteger(maxQueue) || maxQueue < 0) {
      throw new RangeError('Semaphore maxQueue must be a non-negative integer.');
    }
    if (typeof busyMessage !== 'string' || busyMessage.length === 0) {
      throw new TypeError('Semaphore busyMessage must be a non-empty string.');
    }
    this.concurrency = concurrency;
    this.maxQueue = maxQueue;
    this.busyMessage = busyMessage;
  }

  get active() {
    return this.#active;
  }

  get queued() {
    return this.#queue.length;
  }

  async acquire(signal) {
    if (signal?.aborted) throw abortReason(signal);

    if (this.#active < this.concurrency) {
      this.#active += 1;
      return this.#createRelease();
    }

    if (this.#queue.length >= this.maxQueue) {
      throw new GeodataError(
        'UPSTREAM_BUSY',
        this.busyMessage,
        { statusCode: 503, retryable: true }
      );
    }

    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, signal, onAbort: null };
      waiter.onAbort = () => {
        const index = this.#queue.indexOf(waiter);
        if (index >= 0) this.#queue.splice(index, 1);
        reject(abortReason(signal));
      };
      signal?.addEventListener('abort', waiter.onAbort, { once: true });
      this.#queue.push(waiter);
    });
  }

  async run(task, signal) {
    const release = await this.acquire(signal);
    try {
      return await task();
    } finally {
      release();
    }
  }

  #createRelease() {
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.#active -= 1;
      this.#drain();
    };
  }

  #drain() {
    while (this.#active < this.concurrency && this.#queue.length > 0) {
      const waiter = this.#queue.shift();
      waiter.signal?.removeEventListener('abort', waiter.onAbort);
      if (waiter.signal?.aborted) {
        waiter.reject(abortReason(waiter.signal));
        continue;
      }
      this.#active += 1;
      waiter.resolve(this.#createRelease());
    }
  }
}

export function raceWithSignal(sharedPromise, signal) {
  if (!signal) return sharedPromise;
  if (signal.aborted) return Promise.reject(abortReason(signal));

  return new Promise((resolve, reject) => {
    const onAbort = () => reject(abortReason(signal));
    signal.addEventListener('abort', onAbort, { once: true });
    sharedPromise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      }
    );
  });
}

export function abortCode(error) {
  return isAbortError(error) ? 'ABORTED' : null;
}
