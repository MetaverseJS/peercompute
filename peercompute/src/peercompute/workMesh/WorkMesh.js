/**
 * WorkMesh: spreads a divisible job over directly linked peers.
 *
 * Every node keeps a queue of tasks and measures how fast it gets rid of them
 * (by running them or passing them on). Its waiting time is queue length over
 * that rate. On each tick a node gives work to a neighbour with a shorter
 * waiting time, enough to close half the gap; it runs tasks itself; and it
 * passes finished results to the neighbour closest (in hops) to the job's
 * origin. Work never moves toward its origin, and moves sideways only across a
 * clear gap, so tasks cannot circulate. No node knows the whole network: it sees only its neighbours'
 * queues, rates and hop counts. Balancing time rather than length keeps a slow
 * node from holding work it cannot finish soon. One batch at a time is in
 * flight per link and direction, so a slow link carries less work without
 * anyone measuring its speed.
 *
 * This is the live counterpart of the flow model in
 * peercompute/experiments/conjecture/simulate.js. The module has no timers,
 * sockets or globals. The host supplies:
 *   send(peerId, message)        deliver a message to a linked peer
 *   execute(task, done)          run one task and call done(value) once
 *   onWork(peerId, units)        optional: tasks and results moved over a link
 * and calls linkUp/linkDown, receive(peerId, message) and tick(now).
 */

export const WORK_MESH_SCHEMA = 'peercompute.work-mesh.v1';

export const WORK_MESH_DEFAULTS = Object.freeze({
  headSeconds: 4, // waiting time a job's origin keeps on offer
  minHead: 8, // and the fewest tasks it offers, whatever its rate
  minRate: 0.5, // tasks per second assumed of a node that has not been measured
  rateTauMs: 2000,
  lateralGapSeconds: 1, // waiting-time gap needed to pass work to a neighbour no farther from the origin
  concurrency: 1,
  resultBuffer: 16, // finished results a node may hold before it stops computing
  workBatch: 8,
  resultBatch: 16,
  maxHops: 32,
  taskTimeoutMs: 60000, // the origin offers a task again if no result has come back
  forgetMs: 5000 // drop a job's leftovers once no neighbour has known a way to its origin for this long
});

export class WorkMesh {
  constructor({ nodeId, send, execute, onWork = null, config = {} } = {}) {
    if (!nodeId || typeof send !== 'function' || typeof execute !== 'function') {
      throw new TypeError('WorkMesh requires nodeId, send and execute');
    }
    this.nodeId = String(nodeId);
    this.send = send;
    this.execute = execute;
    this.onWork = typeof onWork === 'function' ? onWork : null;
    this.config = { ...WORK_MESH_DEFAULTS, ...config };
    this.queue = []; // { jobId, taskId, origin, payload }
    this.results = []; // { jobId, taskId, origin, value } waiting to travel home
    this.running = 0;
    this.links = new Map(); // peerId -> { queued, hops: Map, work: batch|null, results: batch|null }
    this.jobs = new Map(); // jobs this node originated
    this.origins = new Map(); // jobId -> origin nodeId, for every job seen
    this.hops = new Map(); // jobId -> this node's hop count to the origin
    this.unreachableSince = new Map(); // jobId -> when its origin was last reachable
    this.counters = { executed: 0, forwarded: 0, forwardedOutward: 0, returned: 0, reissued: 0, duplicates: 0 };
    this.rate = 0; // tasks per second this node runs or passes on, smoothed
    this.rateSample = null; // { at, drained }
    this.now = 0;
    this.destroyed = false;
  }

  /**
   * Offer a job to the mesh. `tasks` is an array of payloads; the promise
   * resolves with their results in the same order.
   */
  submitJob({ jobId, tasks, onResult = null } = {}) {
    if (this.destroyed) throw new Error('WorkMesh is destroyed');
    if (!jobId || !Array.isArray(tasks)) throw new TypeError('submitJob requires jobId and a tasks array');
    if (this.jobs.has(jobId)) throw new Error(`Job ${jobId} is already running`);
    let resolve;
    const done = new Promise((ok) => { resolve = ok; });
    this.jobs.set(jobId, {
      payloads: tasks, values: new Array(tasks.length), finished: new Uint8Array(tasks.length),
      remaining: tasks.length, next: 0, retry: [], issued: new Map(), onResult, resolve
    });
    this.origins.set(jobId, this.nodeId);
    this.hops.set(jobId, 0);
    if (tasks.length === 0) this._finish(jobId);
    return done;
  }

  linkUp(peerId) {
    if (!this.links.has(peerId)) this.links.set(peerId, { queued: Number.POSITIVE_INFINITY, rate: 0, hops: new Map(), work: null, results: null });
  }

  /** Anything in flight on a lost link may not have arrived: keep it here. */
  linkDown(peerId) {
    const link = this.links.get(peerId);
    if (!link) return;
    if (link.work) {
      for (const task of link.work) this.jobs.get(task.jobId)?.issued.delete(task.taskId);
      this.queue.push(...link.work);
    }
    if (link.results) this.results.push(...link.results);
    this.links.delete(peerId);
  }

  receive(peerId, message) {
    const link = this.links.get(peerId);
    if (this.destroyed || !link || !message || message.schema !== WORK_MESH_SCHEMA) return;
    switch (message.type) {
      case 'state':
        link.queued = Number.isFinite(message.queued) ? Math.max(0, message.queued) : Number.POSITIVE_INFINITY;
        link.rate = Number.isFinite(message.rate) ? Math.max(0, message.rate) : 0;
        link.hops = new Map();
        for (const [jobId, origin, hops] of Array.isArray(message.jobs) ? message.jobs : []) {
          if (!this.origins.has(jobId)) this.origins.set(jobId, origin);
          link.hops.set(jobId, hops);
        }
        break;
      case 'work':
        for (const task of Array.isArray(message.tasks) ? message.tasks : []) {
          if (!this.origins.has(task.jobId)) this.origins.set(task.jobId, task.origin);
          this.queue.push(task);
        }
        this._moved(peerId, message.tasks?.length || 0);
        this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'work-ack' });
        this._pump();
        break;
      case 'work-ack':
        if (link.work) {
          this.counters.forwarded += link.work.length;
          if (link.work.outward) this.counters.forwardedOutward += link.work.length;
          this._moved(peerId, link.work.length);
        }
        link.work = null;
        this._serve(peerId, link); // keep the link busy without waiting for a tick
        break;
      case 'results':
        for (const result of Array.isArray(message.results) ? message.results : []) this._accept(result);
        this._moved(peerId, message.results?.length || 0);
        this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'results-ack' });
        break;
      case 'results-ack':
        if (link.results) this._moved(peerId, link.results.length);
        link.results = null;
        this._serve(peerId, link);
        break;
      default:
    }
  }

  /** Advance the node: call a few times per second with a millisecond clock. */
  tick(now) {
    if (this.destroyed) return;
    this.now = now;
    this._measure(now);
    this._refill(now);
    this._updateHops(now);
    this._pump();
    const held = this.queue.length + this.running;
    const jobs = [...this.hops].map(([jobId, hops]) => [jobId, this.origins.get(jobId), hops]);
    for (const [peerId, link] of this.links) {
      this._serve(peerId, link);
      this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'state', queued: held, rate: this.rate, jobs });
    }
  }

  /** Put results and work on a link that has nothing in flight in that direction. */
  _serve(peerId, link) {
    if (!link.results && this.results.length) {
      // Results travel only to a neighbour that is closer to their origin.
      const batch = [];
      const rest = [];
      for (const result of this.results) {
        const closer = (link.hops.get(result.jobId) ?? Number.POSITIVE_INFINITY) < (this.hops.get(result.jobId) ?? Number.POSITIVE_INFINITY);
        (closer && batch.length < this.config.resultBatch ? batch : rest).push(result);
      }
      if (batch.length) {
        this.results = rest;
        link.results = batch;
        this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'results', results: batch });
      }
    }
    if (!link.work && this.queue.length) {
      // Close half the gap in waiting time; an idle neighbour gets at least one task.
      const mine = this.queue.length / Math.max(this.rate, this.config.minRate);
      const peerRate = Math.max(link.rate, this.config.minRate);
      const gap = mine - link.queued / peerRate;
      const share = Math.min(this.config.workBatch, this.queue.length,
        Math.max(Math.floor(gap * peerRate / 2), gap > 0 && link.queued === 0 && this.queue.length > 1 ? 1 : 0));
      if (share >= 1) {
        // Oldest first, for running and for handing on alike, so no task
        // waits behind this node's own executor for longer than the queue.
        const batch = [];
        const rest = [];
        let outward = true;
        for (const task of this.queue) {
          const away = (link.hops.get(task.jobId) ?? Number.POSITIVE_INFINITY) - (this.hops.get(task.jobId) ?? 0);
          const allowed = away > 0 || (away === 0 && gap >= this.config.lateralGapSeconds);
          if (allowed && batch.length < share) { batch.push(task); if (away <= 0) outward = false; } else rest.push(task);
        }
        if (batch.length) {
          this.queue = rest;
          batch.outward = outward;
          // The origin's clock for a task starts when the task leaves it; a
          // task still queued here is not missing.
          for (const task of batch) this.jobs.get(task.jobId)?.issued.set(task.taskId, this.now);
          link.work = batch;
          link.queued += batch.length;
          this.send(peerId, { schema: WORK_MESH_SCHEMA, type: 'work', tasks: [...batch] });
        }
      }
    }
  }

  snapshot() {
    return { nodeId: this.nodeId, queued: this.queue.length, running: this.running, results: this.results.length,
      links: this.links.size, jobs: this.jobs.size, counters: { ...this.counters } };
  }

  destroy() {
    this.destroyed = true;
    this.queue = []; this.results = []; this.links.clear();
  }

  /** Start tasks until this node is busy or holding too many results. */
  _pump() {
    while (!this.destroyed && this.running < this.config.concurrency && this.queue.length
        && this.results.length < this.config.resultBuffer) {
      const task = this.queue.shift();
      this.running += 1;
      let settled = false;
      this.execute(task, (value) => {
        if (settled || this.destroyed) return;
        settled = true;
        this.running -= 1;
        this.counters.executed += 1;
        this._accept({ jobId: task.jobId, taskId: task.taskId, origin: task.origin, value });
        this._pump(); // do not wait for the next tick
      });
    }
  }

  _measure(now) {
    // Work passed sideways is not progress, so it does not count as capacity.
    const drained = this.counters.executed + this.counters.forwardedOutward;
    if (this.rateSample && now > this.rateSample.at) {
      const elapsed = now - this.rateSample.at;
      this.rate += ((drained - this.rateSample.drained) * 1000 / elapsed - this.rate) * (1 - Math.exp(-elapsed / this.config.rateTauMs));
    }
    if (!this.rateSample || now > this.rateSample.at) this.rateSample = { at: now, drained };
  }

  _moved(peerId, units) {
    if (units > 0 && this.onWork) this.onWork(peerId, units);
  }

  /** The origin tops its queue up to `head` and re-offers tasks that went missing. */
  _refill(now) {
    for (const [jobId, job] of this.jobs) {
      for (const [taskId, issuedAt] of job.issued) {
        if (now - issuedAt < this.config.taskTimeoutMs) break; // insertion order is issue order
        job.issued.delete(taskId);
        if (!job.finished[taskId]) { job.retry.push(taskId); this.counters.reissued += 1; }
      }
      const head = Math.max(this.config.minHead, Math.ceil(this.config.headSeconds * this.rate));
      while (this.queue.length < head && (job.retry.length || job.next < job.payloads.length)) {
        const taskId = job.retry.length ? job.retry.shift() : job.next++;
        if (job.finished[taskId]) continue;
        this.queue.push({ jobId, taskId, origin: this.nodeId, payload: job.payloads[taskId] });
      }
    }
  }

  _updateHops(now) {
    for (const jobId of [...this.origins.keys()]) {
      if (this.jobs.has(jobId)) { this.hops.set(jobId, 0); continue; }
      let best = Number.POSITIVE_INFINITY;
      for (const link of this.links.values()) best = Math.min(best, (link.hops.get(jobId) ?? Number.POSITIVE_INFINITY) + 1);
      if (best <= this.config.maxHops) {
        this.hops.set(jobId, best);
        this.unreachableSince.delete(jobId);
        continue;
      }
      this.hops.delete(jobId);
      if (!this.unreachableSince.has(jobId)) this.unreachableSince.set(jobId, now);
      if (now - this.unreachableSince.get(jobId) < this.config.forgetMs) continue;
      // The job finished or its origin is gone: its leftovers would only clog this node.
      this.origins.delete(jobId);
      this.unreachableSince.delete(jobId);
      this.queue = this.queue.filter((task) => task.jobId !== jobId);
      this.results = this.results.filter((result) => result.jobId !== jobId);
    }
  }

  /** A result is either this node's own job (record it) or passes through. */
  _accept(result) {
    const job = this.jobs.get(result.jobId);
    if (!job) {
      if (this.origins.has(result.jobId)) this.results.push(result); // otherwise the job is over
      return;
    }
    if (job.finished[result.taskId]) { this.counters.duplicates += 1; return; }
    job.finished[result.taskId] = 1;
    job.values[result.taskId] = result.value;
    job.issued.delete(result.taskId);
    job.remaining -= 1;
    this.counters.returned += 1;
    job.onResult?.(result.taskId, result.value);
    if (job.remaining === 0) this._finish(result.jobId);
  }

  _finish(jobId) {
    const job = this.jobs.get(jobId);
    this.jobs.delete(jobId);
    this.hops.delete(jobId);
    this.origins.delete(jobId);
    // Tasks of a finished job still queued anywhere are harmless duplicates.
    this.queue = this.queue.filter((task) => task.jobId !== jobId);
    job.resolve(job.values);
  }
}
